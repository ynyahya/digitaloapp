"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

const licenseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "License name required"),
  priceCents: z.coerce.number().int().min(0),
  description: z.string().optional().nullable(),
  perks: z.array(z.string().min(1)).optional().default([]),
});

const includedSchema = z.object({
  icon: z.string().optional().default("check"),
  title: z.string().min(1),
  description: z.string().optional().default(""),
});

const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and dashes")
    .min(2)
    .optional(),
  tagline: z.string().max(140).optional().default(""),
  description: z.string().optional().default(""),
  type: z.enum(["ONE_TIME", "SUBSCRIPTION", "BUNDLE"]).default("ONE_TIME"),
  priceCents: z.coerce.number().int().min(0),
  compareAtCents: z
    .union([z.coerce.number().int().min(0), z.literal("").transform(() => null), z.null()])
    .optional()
    .nullable(),
  currency: z.string().length(3).default("USD"),
  coverImage: z.string().optional().nullable().default(""),
  gallery: z.array(z.string().url()).optional().default([]),
  bestSeller: z.boolean().optional().default(false),
  instantDelivery: z.boolean().optional().default(true),
  lifetimeUpdates: z.boolean().optional().default(true),
  licenses: z.array(licenseSchema).min(1, "Add at least one license"),
  included: z.array(includedSchema).optional().default([]),
  faq: z
    .array(z.object({ q: z.string().min(1), a: z.string().min(1) }))
    .optional()
    .default([]),
  publish: z.boolean().optional().default(false),
});

export type ProductFormInput = z.input<typeof productSchema>;

export type ProductActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

type RequireCreatorResult =
  | { creatorId: string }
  | { error: string };

async function requireCreator(): Promise<RequireCreatorResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in" };
  }
  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) {
    return { error: "Creator profile required" };
  }
  return { creatorId: creator.id };
}

export async function saveProduct(
  _prev: ProductActionResult | null,
  input: ProductFormInput,
): Promise<ProductActionResult> {
  const me = await requireCreator();
  if ("error" in me) return { ok: false, error: me.error };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: `${first.path.join(".") || "form"}: ${first.message}`,
    };
  }
  const data = parsed.data;

  // Resolve a unique slug (auto-generate from title if missing). Guard the
  // empty-string case — if a user's title is all non-Latin characters, emoji,
  // or punctuation, slugify() strips everything and we'd end up persisting
  // slug = "" (which would route-collide with the /p/ index).
  const baseSlug = slugify(data.slug ?? data.title);
  if (!baseSlug) {
    return {
      ok: false,
      error:
        "Title or slug must contain at least one Latin letter or number so we can build a URL.",
    };
  }
  let slug = baseSlug;
  let suffix = 2;
  while (
    await db.product.findFirst({
      where: { slug, NOT: data.id ? { id: data.id } : undefined },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix++}`;
    if (suffix > 50) return { ok: false, error: "Could not generate a unique slug" };
  }

  // Look up the existing product (if editing) so we can preserve its published
  // status/timestamp when the creator clicks "Save" on an already-PUBLISHED
  // product. Without this, saving edits would silently demote it to DRAFT and
  // pull it from the storefront.
  const existing = data.id
    ? await db.product.findFirst({
        where: { id: data.id, creatorId: me.creatorId },
        select: { status: true, publishedAt: true },
      })
    : null;
  if (data.id && !existing) {
    return { ok: false, error: "Product not found" };
  }

  // Status/publishedAt resolution:
  //   - publish=true      → PUBLISHED, keep original publishedAt if it already
  //                         had one (don't reset publication date on re-save),
  //                         otherwise stamp now
  //   - publish=false new → DRAFT
  //   - publish=false edit→ preserve whatever status/publishedAt exist
  let nextStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  let nextPublishedAt: Date | null;
  if (data.publish) {
    nextStatus = "PUBLISHED";
    nextPublishedAt = existing?.publishedAt ?? new Date();
  } else if (existing) {
    nextStatus = existing.status as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    nextPublishedAt = existing.publishedAt;
  } else {
    nextStatus = "DRAFT";
    nextPublishedAt = null;
  }

  const scalar = {
    creatorId: me.creatorId,
    slug,
    title: data.title,
    tagline: data.tagline,
    description: data.description,
    type: data.type,
    priceCents: data.priceCents,
    compareAtCents: data.compareAtCents ?? null,
    currency: data.currency,
    coverImage: data.coverImage || null,
    gallery: data.gallery.length ? JSON.stringify(data.gallery) : null,
    bestSeller: data.bestSeller,
    instantDelivery: data.instantDelivery,
    lifetimeUpdates: data.lifetimeUpdates,
    included: data.included.length
      ? JSON.stringify(
          data.included.map((i) => ({
            icon: i.icon,
            title: i.title,
            description: i.description,
          })),
        )
      : null,
    faq: data.faq.length ? JSON.stringify(data.faq) : null,
    status: nextStatus,
    publishedAt: nextPublishedAt,
  } as const;

  const upserted = await db.$transaction(async (tx) => {
    const row = data.id
      ? await tx.product.update({
          where: { id: data.id, creatorId: me.creatorId },
          data: scalar,
        })
      : await tx.product.create({ data: scalar });

    // Replace licenses wholesale — simple + safe for Sprint 2.
    await tx.license.deleteMany({ where: { productId: row.id } });
    await tx.license.createMany({
      data: data.licenses.map((l) => ({
        productId: row.id,
        name: l.name,
        priceCents: l.priceCents,
        description: l.description ?? null,
        perks: l.perks?.length ? JSON.stringify(l.perks) : null,
      })),
    });

    return row;
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/p/${slug}`);
  return { ok: true, id: upserted.id, slug: upserted.slug };
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  const me = await requireCreator();
  if ("error" in me) return { ok: false, error: me.error };
  const row = await db.product.findFirst({
    where: { id, creatorId: me.creatorId },
    select: { id: true, slug: true },
  });
  if (!row) return { ok: false, error: "Product not found" };
  await db.product.delete({ where: { id: row.id } });
  revalidatePath("/dashboard/products");
  return { ok: true, id: row.id, slug: row.slug };
}

export async function setProductStatus(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  const me = await requireCreator();
  if ("error" in me) return { ok: false, error: me.error } as const;
  // Ownership + existence check first so a deleted/non-owned product returns
  // { ok: false } instead of a Prisma P2025 crash.
  const existing = await db.product.findFirst({
    where: { id, creatorId: me.creatorId },
    select: { id: true, slug: true, publishedAt: true },
  });
  if (!existing) {
    return { ok: false, error: "Product not found" } as const;
  }
  const row = await db.product.update({
    where: { id: existing.id },
    data: {
      status,
      // Preserve an existing publish timestamp when re-publishing, so unpublish
      // → publish doesn't erase the creator's original release date.
      publishedAt:
        status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : null,
    },
    select: { id: true, slug: true },
  });
  revalidatePath("/dashboard/products");
  revalidatePath(`/p/${row.slug}`);
  return { ok: true, id: row.id, slug: row.slug } as const;
}

export async function saveProductAndRedirect(input: ProductFormInput) {
  const res = await saveProduct(null, input);
  if (res.ok) {
    redirect(`/dashboard/products/${res.id}?saved=1`);
  }
  return res;
}

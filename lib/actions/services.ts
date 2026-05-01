"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/auth/session";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}
function makeUniqueSlug(base: string) {
  return `${base}-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(-4)}`;
}

const SERVICE_FIELDS = [
  "title", "description", "category", "priceCents", "currency",
  "deliveryDays", "revisions", "status", "coverImage",
  "promise", "packagesJson", "scopeJson", "outcomesJson",
  "faqJson", "proofJson", "metaTitle", "metaDescription",
] as const;

// ── CRUD ────────────────────────────────────────────────────

export async function createService(data: {
  title: string;
  description?: string | null;
  category?: string | null;
  priceCents?: number;
  currency?: string;
  deliveryDays?: number;
  revisions?: number;
}) {
  if (!data.title || !data.title.trim()) {
    throw new Error("Service title is required");
  }
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  const baseSlug = slugify(data.title.trim());
  const slug = makeUniqueSlug(baseSlug || "service");
  const service = await db.service.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title.trim(),
      description: data.description || null,
      category: data.category || null,
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      deliveryDays: data.deliveryDays ?? 1,
      revisions: data.revisions ?? 0,
    },
  });
  revalidatePath("/dashboard/services");
  return service;
}

export async function updateService(serviceId: string, data: Record<string, any>) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  const existing = await db.service.findFirst({ where: { id: serviceId, creatorId: creator.id } });
  if (!existing) throw new Error("Service not found");
  const sanitized: Record<string, any> = {};
  for (const key of SERVICE_FIELDS) {
    if (key in data && data[key] !== undefined) sanitized[key] = data[key];
  }
  const updated = await db.service.update({ where: { id: serviceId }, data: sanitized });
  revalidatePath(`/dashboard/services/${existing.slug}`);
  revalidatePath("/dashboard/services");
  return updated;
}

export async function publishService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  await db.service.updateMany({ where: { id: serviceId, creatorId: creator.id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function unpublishService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  await db.service.updateMany({ where: { id: serviceId, creatorId: creator.id }, data: { status: "DRAFT" } });
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function deleteService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");
  await db.service.deleteMany({ where: { id: serviceId, creatorId: creator.id } });
  revalidatePath("/dashboard/services");
  return { success: true };
}

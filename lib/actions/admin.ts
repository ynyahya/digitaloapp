"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin";

const ROLE = z.enum(["BUYER", "CREATOR", "ADMIN"]);
const PRODUCT_STATUS = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

type Result =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function setUserRole(
  userId: string,
  role: z.infer<typeof ROLE>,
): Promise<Result> {
  const admin = await requireAdminSession();
  const parsed = ROLE.safeParse(role);
  if (!parsed.success) return { ok: false, error: "Invalid role" };
  if (userId === admin.id && parsed.data !== "ADMIN") {
    return {
      ok: false,
      error: "You can't remove your own admin role. Ask another admin to do it.",
    };
  }
  await db.user.update({
    where: { id: userId },
    data: { role: parsed.data },
  });
  revalidatePath("/admin/users");
  revalidatePath("/admin/creators");
  return { ok: true };
}

export async function setCreatorVerified(
  creatorId: string,
  verified: boolean,
): Promise<Result> {
  await requireAdminSession();
  const row = await db.creator.update({
    where: { id: creatorId },
    data: { verified },
    select: { handle: true },
  });
  revalidatePath("/admin/creators");
  // Revalidate the specific storefront path so the verified badge flips on the
  // next visit. `revalidatePath("/c")` doesn't match the dynamic /c/[handle]
  // route, so we build the concrete path from the handle we just read back.
  revalidatePath(`/c/${row.handle}`);
  return { ok: true };
}

export async function setProductStatusAdmin(
  productId: string,
  status: z.infer<typeof PRODUCT_STATUS>,
): Promise<Result> {
  await requireAdminSession();
  const parsed = PRODUCT_STATUS.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status" };
  // Existence check + read the current publishedAt so we preserve the original
  // release date on re-publish (matches the creator-facing setProductStatus in
  // lib/actions/products.ts). Without this, archiving and re-publishing a
  // product would destroy its original publish date and float it to the top
  // of "newest" listings.
  const existing = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, publishedAt: true },
  });
  if (!existing) return { ok: false, error: "Product not found" };
  const row = await db.product.update({
    where: { id: existing.id },
    data: {
      status: parsed.data,
      publishedAt:
        parsed.data === "PUBLISHED"
          ? (existing.publishedAt ?? new Date())
          : null,
    },
    select: { slug: true },
  });
  revalidatePath("/admin/products");
  revalidatePath(`/p/${row.slug}`);
  return { ok: true };
}

export async function refundOrderAdmin(orderId: string): Promise<Result> {
  await requireAdminSession();
  // Flip PAID -> REFUNDED atomically by scoping the update's where clause to
  // status=PAID. Two concurrent refund requests can both pass an external
  // status check; here only one of them will match the row, the other throws
  // P2025 which we translate to a graceful error. The Refund row is created
  // in the same transaction so it can never exist without the status flip.
  try {
    await db.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId, status: "PAID" },
        data: { status: "REFUNDED" },
        select: { id: true, totalCents: true },
      });
      await tx.refund.create({
        data: {
          orderId: updated.id,
          amountCents: updated.totalCents,
          reason: "Refunded by admin",
        },
      });
    });
    revalidatePath("/admin/orders");
    return { ok: true, message: "Order refunded" };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      // Either the order doesn't exist or it wasn't in PAID status — read it
      // back to produce a helpful error message without relying on the state
      // observed before the transaction.
      const existing = await db.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });
      if (!existing) return { ok: false, error: "Order not found" };
      return {
        ok: false,
        error: `Cannot refund an order in status ${existing.status}`,
      };
    }
    throw err;
  }
}

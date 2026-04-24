"use server";

import { revalidatePath } from "next/cache";
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
  await db.creator.update({
    where: { id: creatorId },
    data: { verified },
  });
  revalidatePath("/admin/creators");
  revalidatePath(`/c`);
  return { ok: true };
}

export async function setProductStatusAdmin(
  productId: string,
  status: z.infer<typeof PRODUCT_STATUS>,
): Promise<Result> {
  await requireAdminSession();
  const parsed = PRODUCT_STATUS.safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status" };
  const row = await db.product.update({
    where: { id: productId },
    data: {
      status: parsed.data,
      publishedAt: parsed.data === "PUBLISHED" ? new Date() : null,
    },
    select: { slug: true },
  });
  revalidatePath("/admin/products");
  revalidatePath(`/p/${row.slug}`);
  return { ok: true };
}

export async function refundOrderAdmin(orderId: string): Promise<Result> {
  await requireAdminSession();
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, totalCents: true },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status !== "PAID") {
    return { ok: false, error: `Cannot refund an order in status ${order.status}` };
  }
  await db.$transaction([
    db.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    }),
    db.refund.create({
      data: {
        orderId: order.id,
        amountCents: order.totalCents,
        reason: "Refunded by admin",
      },
    }),
  ]);
  revalidatePath("/admin/orders");
  return { ok: true, message: "Order refunded" };
}

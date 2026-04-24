"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
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

  // 1) Pre-flight: look up the order so we know which Stripe PaymentIntent to
  //    reverse, and surface a meaningful error before touching anything.
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, stripePaymentIntentId: true },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.status !== "PAID") {
    return {
      ok: false,
      error: `Cannot refund an order in status ${order.status}`,
    };
  }

  // 2) If this order originated from a real Stripe charge, require Stripe to
  //    be configured and actually issue the refund there first. We never want
  //    to flip the DB status to REFUNDED while the customer's card is still
  //    charged — the customer's money must move before we claim a refund
  //    happened internally.
  if (order.stripePaymentIntentId) {
    if (!stripe) {
      return {
        ok: false,
        error:
          "Stripe isn't configured on the server. Set STRIPE_SECRET_KEY before issuing refunds so the customer actually gets their money back.",
      };
    }
    try {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
    } catch (err: unknown) {
      // Treat "already refunded in Stripe dashboard" as a soft success — we
      // still need to sync our DB to match reality. Everything else is a
      // hard failure.
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : undefined;
      const message =
        err instanceof Error
          ? err.message
          : "Stripe rejected the refund request.";
      if (code !== "charge_already_refunded") {
        return { ok: false, error: `Stripe refund failed: ${message}` };
      }
    }
  }

  // 3) Flip PAID -> REFUNDED atomically by scoping the update's where clause to
  //    status=PAID. Two concurrent refund requests both reach this point but
  //    only one can match the row; the other throws P2025 which we translate
  //    to a graceful error. The Refund row is created in the same transaction
  //    so it can never exist without the status flip.
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

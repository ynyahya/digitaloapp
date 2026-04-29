"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const email = formData.get("email") as string;
  const name = `${formData.get("firstName")} ${formData.get("lastName")}`;
  const itemsJson = formData.get("items") as string;
  
  let cartItems: { productId: string; licenseId: string; priceCents: number; qty: number; creatorId: string }[] = [];
  
  try {
    cartItems = JSON.parse(itemsJson);
  } catch {
    // Fallback for old single-item submissions if any
    const productId = formData.get("productId") as string;
    const licenseId = formData.get("licenseId") as string;
    if (productId) {
      const p = await db.product.findUnique({ where: { id: productId } });
      if (p) {
        cartItems = [{ 
          productId: p.id, 
          licenseId: licenseId || "", 
          priceCents: p.priceCents, 
          qty: 1,
          creatorId: p.creatorId
        }];
      }
    }
  }

  if (cartItems.length === 0) throw new Error("No items in order");

  const subtotalCents = cartItems.reduce((acc, item) => acc + (item.priceCents * item.qty), 0);

  // 1. Create or Find User
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: { email, name, role: "BUYER" },
    });
  }

  // 2. Create Order in Transaction
  await db.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: user!.id,
        email: email,
        status: "PAID",
        totalCents: subtotalCents,
        subtotalCents: subtotalCents,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            licenseId: item.licenseId || null,
            priceCents: item.priceCents,
            qty: item.qty,
          })),
        },
      },
    });

    // 3. Update Creator Metrics & Product Sales for each item
    for (const item of cartItems) {
      await tx.creatorMetrics.update({
        where: { creatorId: item.creatorId },
        data: {
          totalSalesCents: { increment: item.priceCents * item.qty },
          productsSold: { increment: item.qty },
          customers: { increment: 1 }, 
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: item.qty } },
      });
    }

    return newOrder;
  });

  redirect("/checkout/success");
}

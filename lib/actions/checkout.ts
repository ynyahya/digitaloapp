"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const productId = formData.get("productId") as string;
  const licenseId = formData.get("licenseId") as string;
  const email = formData.get("email") as string;
  const name = `${formData.get("firstName")} ${formData.get("lastName")}`;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { creator: true },
  });

  if (!product) throw new Error("Product not found");

  const license = await db.license.findUnique({
    where: { id: licenseId },
  });

  const priceCents = license ? license.priceCents : product.priceCents;

  // 1. Create or Find User
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: { email, name, role: "BUYER" },
    });
  }

  // 2. Create Order
  const order = await db.order.create({
    data: {
      userId: user.id,
      email: email,
      status: "PAID", // Simulation: mark as paid immediately
      totalCents: priceCents,
      subtotalCents: priceCents,
      items: {
        create: {
          productId: product.id,
          licenseId: licenseId || null,
          priceCents: priceCents,
          qty: 1,
        },
      },
    },
  });

  // 3. Update Creator Metrics
  await db.creatorMetrics.update({
    where: { creatorId: product.creatorId },
    data: {
      totalSalesCents: { increment: priceCents },
      productsSold: { increment: 1 },
      customers: {
        // Simple approximation: check if this is the first order from this user for this creator
        // For brevity, we just increment for now.
        increment: 1, 
      },
    },
  });

  // 4. Update Product Sales Count
  await db.product.update({
    where: { id: product.id },
    data: { salesCount: { increment: 1 } },
  });

  redirect("/checkout/success");
}

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, requireCreator } from "@/lib/auth/session";

// ── Enroll in course ────────────────────────────────────────

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Please sign in to enroll");
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || course.status !== "PUBLISHED") throw new Error("Course not available");
  const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } });
  if (existing) { redirect(`/learn/${course.slug}`); }
  if (course.priceCents === 0) {
    await db.enrollment.create({ data: { userId: user.id, courseId, status: "ACTIVE", dripStartAt: new Date() } });
    await db.course.update({ where: { id: courseId }, data: { totalStudents: { increment: 1 } } });
    revalidatePath(`/c/${course.slug}`);
    redirect(`/learn/${course.slug}`);
  }
  // Paid: create enrollment directly (TODO: Stripe checkout flow)
  await db.enrollment.create({ data: { userId: user.id, courseId, status: "ACTIVE", dripStartAt: new Date() } });
  await db.course.update({ where: { id: courseId }, data: { totalStudents: { increment: 1 } } });
  revalidatePath(`/c/${course.slug}`);
  redirect(`/learn/${course.slug}`);
}

// ── Mark lesson complete ────────────────────────────────────

export async function markLessonComplete(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  await db.lessonCompletion.upsert({
    where: { lessonId_userId: { lessonId, userId: user.id } },
    create: { lessonId, userId: user.id },
    update: {},
  });
  const lesson = await db.lesson.findUnique({ where: { id: lessonId }, include: { chapter: { include: { course: true } } } });
  if (lesson) revalidatePath(`/learn/${lesson.chapter.course.slug}/lesson/${lessonId}`);
}

// ── Order actions (for form submission) ─────────────────────

export async function refundOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const creator = await requireCreator();
  const order = await db.order.findFirst({ where: { id: orderId, items: { some: { product: { creatorId: creator.id } } } } });
  if (!order) throw new Error("Order not found");
  await db.order.update({ where: { id: orderId }, data: { status: "REFUNDED" } });
  revalidatePath("/dashboard/orders");
}

export async function completeOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const creator = await requireCreator();
  const order = await db.order.findFirst({ where: { id: orderId, items: { some: { product: { creatorId: creator.id } } } } });
  if (!order) throw new Error("Order not found");
  await db.order.update({ where: { id: orderId }, data: { status: "COMPLETED" } });
  revalidatePath("/dashboard/orders");
}

// ── Checkout ────────────────────────────────────────────────

export async function createCheckoutSession(formData: FormData) {
  const email = formData.get("email") as string;
  const name = `${formData.get("firstName")} ${formData.get("lastName")}`;
  const itemsJson = formData.get("items") as string;
  let cartItems: { productId: string; licenseId: string; priceCents: number; qty: number; creatorId: string }[] = [];
  try { cartItems = JSON.parse(itemsJson); } catch { throw new Error("Invalid cart"); }
  if (!cartItems.length) throw new Error("No items");

  const subtotalCents = cartItems.reduce((a, i) => a + i.priceCents * i.qty, 0);
  let user = await db.user.findUnique({ where: { email } });
  if (!user) user = await db.user.create({ data: { email, name, role: "BUYER" } });

  const order = await db.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: { userId: user!.id, email, status: "PAID", totalCents: subtotalCents, subtotalCents,
        items: { create: cartItems.map(i => ({ productId: i.productId, licenseId: i.licenseId || null, priceCents: i.priceCents, qty: i.qty })) },
      },
    });
    for (const item of cartItems) {
      await tx.creatorMetrics.upsert({
        where: { creatorId: item.creatorId },
        create: { creatorId: item.creatorId, totalSalesCents: item.priceCents * item.qty, productsSold: item.qty, customers: 1 },
        update: { totalSalesCents: { increment: item.priceCents * item.qty }, productsSold: { increment: item.qty }, customers: { increment: 1 } },
      });
      await tx.product.update({ where: { id: item.productId }, data: { salesCount: { increment: item.qty } } });
    }
    return o;
  });
  redirect(`/checkout/success?orderId=${order.id}`);
}

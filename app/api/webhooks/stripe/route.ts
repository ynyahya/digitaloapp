import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, assertStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import crypto from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    assertStripe(stripe);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 501 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await fulfillOrder(session);
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const { productId, licenseId, userId } = session.metadata ?? {};
  if (!productId) return;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { files: true, licenses: true },
  });
  if (!product) return;

  const license = licenseId ? product.licenses.find((l) => l.id === licenseId) : null;
  const priceCents = license?.priceCents ?? product.priceCents;
  const amountTotal = session.amount_total ?? priceCents;
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  // Use first matching user or fallback (anonymous purchases create a ghost user).
  let user = userId
    ? await db.user.findUnique({ where: { id: userId } })
    : email
      ? await db.user.findUnique({ where: { email } })
      : null;
  if (!user && email) {
    user = await db.user.create({ data: { email, role: "BUYER" } });
  }
  if (!user) return;

  await db.order.upsert({
    where: { stripeSessionId: session.id },
    update: {
      status: "PAID",
      totalCents: amountTotal,
    },
    create: {
      userId: user.id,
      email,
      country: session.customer_details?.address?.country ?? null,
      status: "PAID",
      subtotalCents: amountTotal,
      totalCents: amountTotal,
      currency: (session.currency ?? "usd").toUpperCase(),
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      items: {
        create: [
          {
            productId: product.id,
            licenseId: license?.id ?? null,
            priceCents,
            qty: 1,
          },
        ],
      },
      downloads: {
        create: product.files.map((f) => ({
          fileId: f.id,
          token: crypto.randomBytes(18).toString("hex"),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
        })),
      },
    },
  });

  await db.product.update({
    where: { id: product.id },
    data: { salesCount: { increment: 1 } },
  });
}

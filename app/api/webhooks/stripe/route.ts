import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Prisma } from "@prisma/client";
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
  const { productId, licenseId, licensePriceCents, userId } = session.metadata ?? {};
  if (!productId) return;

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { files: true, licenses: true },
  });
  if (!product) return;

  // License resolution precedence:
  //   1. The license row itself, if its ID still exists.
  //   2. The licensePriceCents we stamped into session metadata at checkout
  //      time. Needed when the creator edited the product between checkout
  //      and webhook — saveProduct deletes-and-recreates license rows, so
  //      the ID in metadata can reference a row that no longer exists even
  //      though the customer paid for a specific license.
  //   3. The product base price as a last resort.
  const license = licenseId ? product.licenses.find((l) => l.id === licenseId) : null;
  const metadataPrice =
    licensePriceCents && /^\d+$/.test(licensePriceCents)
      ? Number(licensePriceCents)
      : null;
  const priceCents =
    license?.priceCents ?? metadataPrice ?? product.priceCents;
  const amountTotal = session.amount_total ?? priceCents;
  const email = session.customer_details?.email ?? session.customer_email ?? "";

  // Idempotency: Stripe may deliver the same event more than once. Short-circuit
  // if this session has already been fulfilled so we never double-increment
  // salesCount or re-mint download tokens.
  //
  // Importantly, once a row exists we treat it as terminal and return — we do
  // NOT re-flip status. Earlier this was `if (existing.status !== "PAID")
  // update({ status: "PAID" })`, which had a nasty corner case: if Stripe
  // retried a checkout.session.completed *after* the order had been refunded
  // (e.g. initial delivery 200'd on our side but was retried anyway, or the
  // retry arrived after an admin refund), the retry would silently revert
  // REFUNDED -> PAID while the customer's money was already back. Just return.
  const existing = await db.order.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true },
  });
  if (existing) return;

  // Resolve the buyer. Use `upsert` on email to avoid the TOCTOU race where two
  // concurrent webhooks (same email, different sessions) both try to `create`.
  let user = userId
    ? await db.user.findUnique({ where: { id: userId } })
    : null;
  if (!user && email) {
    user = await db.user.upsert({
      where: { email },
      update: {},
      create: { email, role: "BUYER" },
    });
  }
  if (!user) return;

  try {
    await db.$transaction([
      db.order.create({
        data: {
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
      }),
      db.product.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      }),
    ]);
  } catch (err) {
    // Concurrent delivery of the same event: another handler already created the
    // order between our existence check and the transaction. Swallow the unique
    // violation so Stripe sees 200 and doesn't retry indefinitely.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return;
    }
    throw err;
  }
}

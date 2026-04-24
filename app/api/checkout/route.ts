import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { stripe, assertStripe } from "@/lib/stripe";
import { auth } from "@/auth";

export const runtime = "nodejs";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  licenseId: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    assertStripe(stripe);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 501 },
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const product = await db.product.findFirst({
    where: { slug: parsed.data.productSlug, status: "PUBLISHED" },
    include: { licenses: true },
  });
  if (!product) {
    // Treat DRAFT and ARCHIVED products the same as missing — never surface their
    // existence to unauthenticated callers and never let them spin up a Stripe
    // session for something that isn't actually for sale.
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const license =
    product.licenses.find((l) => l.id === parsed.data.licenseId) ??
    product.licenses[0];
  const priceCents = license?.priceCents ?? product.priceCents;
  const licenseName = license?.name ?? "Standard";

  const session = await auth();
  const customerEmail = parsed.data.email ?? session?.user?.email ?? undefined;

  // Use a trusted server-side origin. The Origin header is user-controllable, so
  // reading it here would let a caller point Stripe's success/cancel redirects at
  // an attacker-controlled domain. AUTH_URL is set by the operator at deploy time.
  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (product.currency ?? "usd").toLowerCase(),
          unit_amount: priceCents,
          product_data: {
            name: `${product.title} — ${licenseName} License`,
            description: product.tagline ?? undefined,
          },
        },
      },
    ],
    metadata: {
      productId: product.id,
      productSlug: product.slug,
      licenseId: license?.id ?? "",
      // Snapshot the license details at checkout time so the webhook can
      // still record the correct per-item price if the creator edits the
      // product (which re-creates license rows with new IDs) while this
      // session is in-flight.
      licenseName: licenseName,
      licensePriceCents: String(priceCents),
      userId: session?.user?.id ?? "",
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/p/${product.slug}`,
  });

  if (!checkout.url) {
    return NextResponse.json({ error: "Stripe session missing url" }, { status: 500 });
  }

  return NextResponse.json({ url: checkout.url, sessionId: checkout.id });
}

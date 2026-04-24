import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
      appInfo: { name: "Digitalo", version: "0.1.0" },
    })
  : null;

export function assertStripe(client: typeof stripe): asserts client is Stripe {
  if (!client) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.",
    );
  }
}

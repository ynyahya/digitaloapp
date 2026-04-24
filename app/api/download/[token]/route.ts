import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Signed-token download endpoint.
 *
 * Tokens are minted by the Stripe webhook on `checkout.session.completed`, one
 * per ProductFile, with a 30-day expiry (see app/api/webhooks/stripe/route.ts).
 * This route verifies the token, marks it used, and redirects to the file's
 * storage URL.
 *
 * For Sprint 2 we don't have a signed-URL provider wired up yet, so we return
 * the `storageKey` directly via JSON. Sprint 2 Part 3 swaps this for a short-
 * lived S3/R2 pre-signed URL redirect.
 */
export async function GET(
  _req: Request,
  { params }: { params: { token: string } },
) {
  const token = params.token;
  if (!token || token.length < 8) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const download = await db.download.findUnique({
    where: { token },
    include: {
      order: { select: { status: true, email: true } },
    },
  });
  if (!download) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  if (download.order.status !== "PAID") {
    return NextResponse.json(
      { error: "Order not yet paid" },
      { status: 402 },
    );
  }

  if (download.expiresAt && download.expiresAt < new Date()) {
    return NextResponse.json(
      {
        error: "Token expired",
        message:
          "This download link has expired. Request a new one from your receipt page.",
      },
      { status: 410 },
    );
  }

  const file = await db.productFile.findUnique({
    where: { id: download.fileId },
    select: { filename: true, storageKey: true, sizeBytes: true, version: true },
  });
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Mark first-use timestamp (non-destructive — re-downloads are still allowed
  // until the token expires, which matches how Gumroad / Lemon Squeezy behave).
  if (!download.usedAt) {
    await db.download.update({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  // TODO (Sprint 2 Part 3): swap for a pre-signed S3/R2 URL redirect.
  // For now expose the raw metadata so the UI can link to it.
  return NextResponse.json({
    filename: file.filename,
    storageKey: file.storageKey,
    sizeBytes: file.sizeBytes,
    version: file.version,
    expiresAt: download.expiresAt,
  });
}

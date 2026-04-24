"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type Result =
  | { ok: true; token?: string; prefix?: string }
  | { ok: false; error: string };

const NameInput = z.object({
  name: z.string().min(1).max(60),
  scopes: z.enum(["read", "read-write"]).default("read"),
});

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function requireUserId(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in" };
  return { ok: true, userId: session.user.id };
}

export async function createApiKey(input: unknown): Promise<Result> {
  const me = await requireUserId();
  if (!me.ok) return { ok: false, error: me.error };
  const parsed = NameInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Name is required (1-60 chars)." };
  }

  // Token shape: `sk_live_` + 32 url-safe bytes. The `live` prefix is a
  // convention — no live/test split yet, but keeps the format forward-
  // compatible with Stripe-style environment keys.
  const raw = randomBytes(32).toString("base64url");
  const token = `sk_live_${raw}`;
  const prefix = token.slice(0, 12);
  const hashed = hashToken(token);

  await db.apiKey.create({
    data: {
      userId: me.userId,
      name: parsed.data.name,
      prefix,
      hashed,
      scopes: parsed.data.scopes,
    },
  });
  revalidatePath("/dashboard/api-keys");

  // We return the cleartext token exactly once — the UI is responsible for
  // showing it to the user and nudging them to copy it. After this we only
  // have the hash.
  return { ok: true, token, prefix };
}

export async function revokeApiKey(id: string): Promise<Result> {
  const me = await requireUserId();
  if (!me.ok) return { ok: false, error: me.error };
  const key = await db.apiKey.findFirst({
    where: { id, userId: me.userId, revokedAt: null },
    select: { id: true },
  });
  if (!key) return { ok: false, error: "Key not found or already revoked" };
  await db.apiKey.update({
    where: { id: key.id },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/dashboard/api-keys");
  return { ok: true };
}

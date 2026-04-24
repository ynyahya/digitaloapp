"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type Result =
  | { ok: true; code?: string; id?: string }
  | { ok: false; error: string };

const LabelInput = z.object({
  label: z.string().max(60).optional(),
});

async function requireCreator(): Promise<
  { ok: true; creatorId: string } | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in" };
  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) return { ok: false, error: "No creator profile" };
  return { ok: true, creatorId: creator.id };
}

// 6-char, base32-ish (no confusing chars). Deterministic length keeps URL
// cards tidy.
function genCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function createAffiliateLink(input: unknown): Promise<Result> {
  const me = await requireCreator();
  if (!me.ok) return { ok: false, error: me.error };
  const parsed = LabelInput.safeParse(input ?? {});
  if (!parsed.success) return { ok: false, error: "Invalid label" };

  // Retry loop in case of a rare P2002 on code collision. The unique index on
  // `code` is the source of truth — we never rely on a pre-check.
  for (let i = 0; i < 5; i++) {
    const code = genCode();
    try {
      const link = await db.affiliateLink.create({
        data: {
          creatorId: me.creatorId,
          code,
          label: parsed.data.label ?? null,
        },
        select: { id: true, code: true },
      });
      revalidatePath("/dashboard/affiliate");
      return { ok: true, id: link.id, code: link.code };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        continue;
      }
      throw err;
    }
  }
  return { ok: false, error: "Couldn't allocate a unique code. Try again." };
}

export async function deleteAffiliateLink(id: string): Promise<Result> {
  const me = await requireCreator();
  if (!me.ok) return { ok: false, error: me.error };

  const link = await db.affiliateLink.findFirst({
    where: { id, creatorId: me.creatorId },
    select: { id: true, _count: { select: { referrals: true } } },
  });
  if (!link) return { ok: false, error: "Link not found" };
  if (link._count.referrals > 0) {
    return {
      ok: false,
      error:
        "This link already has referrals — deleting it would erase the commission trail.",
    };
  }
  await db.affiliateLink.delete({ where: { id: link.id } });
  revalidatePath("/dashboard/affiliate");
  return { ok: true };
}

export async function markCommissionPaid(
  commissionId: string,
): Promise<Result> {
  const me = await requireCreator();
  if (!me.ok) return { ok: false, error: me.error };

  // Ownership is derived: commission -> referral -> link -> creator.
  const commission = await db.commission.findFirst({
    where: {
      id: commissionId,
      referral: { link: { creatorId: me.creatorId } },
      status: "PENDING",
    },
    select: { id: true },
  });
  if (!commission) {
    return { ok: false, error: "Commission not found or not pending" };
  }
  await db.commission.update({
    where: { id: commission.id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/dashboard/affiliate");
  return { ok: true };
}

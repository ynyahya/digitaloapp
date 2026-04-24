"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

const handleSchema = z
  .string()
  .min(3, "Handle must be at least 3 characters")
  .max(24, "Handle must be 24 characters or less")
  .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only");

const creatorSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  handle: handleSchema,
  tagline: z.string().max(120, "Tagline must be 120 characters or less").optional(),
});

export type CreatorFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function createCreatorAction(
  _prev: CreatorFormState,
  formData: FormData,
): Promise<CreatorFormState> {
  const user = await requireUser();

  const parsed = creatorSchema.safeParse({
    displayName: formData.get("displayName"),
    handle: (formData.get("handle") ?? "").toString().toLowerCase(),
    tagline: formData.get("tagline") || undefined,
  });

  if (!parsed.success) {
    return {
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const handleTaken = await db.creator.findUnique({
    where: { handle: parsed.data.handle },
  });
  if (handleTaken) {
    return {
      error: "That handle is already taken.",
      fieldErrors: { handle: ["That handle is already taken."] },
    };
  }

  await db.creator.create({
    data: {
      userId: user.id,
      handle: parsed.data.handle,
      displayName: parsed.data.displayName,
      tagline: parsed.data.tagline ?? null,
    },
  });

  // Promote to CREATOR role only if currently BUYER (don't downgrade ADMINs).
  await db.user.updateMany({
    where: { id: user.id, role: "BUYER" },
    data: { role: "CREATOR" },
  });

  redirect("/dashboard");
}

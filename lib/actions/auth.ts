"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less"),
  role: z.enum(["BUYER", "CREATOR"]).default("CREATOR"),
});

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const redirectTo =
    typeof formData.get("redirectTo") === "string"
      ? (formData.get("redirectTo") as string)
      : "/dashboard";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return null;
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }
      return { error: "Something went wrong. Please try again." };
    }
    // Next.js redirects throw — let them propagate
    throw e;
  }
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "CREATOR",
  });

  if (!parsed.success) {
    return {
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await db.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      passwordHash,
    },
  });

  if (parsed.data.role === "CREATOR") {
    const baseHandle = parsed.data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 20) || "creator";
    let handle = baseHandle;
    let suffix = 1;
    while (await db.creator.findUnique({ where: { handle } })) {
      handle = `${baseHandle}-${suffix++}`;
    }
    await db.creator.create({
      data: {
        userId: user.id,
        handle,
        displayName: parsed.data.name,
      },
    });
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
    return null;
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Account created. Please sign in." };
    }
    throw e;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

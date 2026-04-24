import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getCurrentCreator() {
  const user = await getCurrentUser();
  if (!user) return null;
  return db.creator.findUnique({ where: { userId: user.id } });
}

export async function requireCreator() {
  const user = await requireUser();
  const creator = await db.creator.findUnique({ where: { userId: user.id } });
  if (!creator) redirect("/dashboard/onboarding");
  return creator;
}

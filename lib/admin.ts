import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Resolve the current session and enforce ADMIN role. Used by every admin
 * surface so an ordinary user who guesses `/admin` is bounced back to the
 * landing page rather than seeing whether the route exists.
 */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, image: true },
  });
  if (!user || user.role !== "ADMIN") {
    // Intentionally send regular users home rather than /login — surfacing a
    // redirect loop to /login would leak that the admin surface exists.
    redirect("/");
  }
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

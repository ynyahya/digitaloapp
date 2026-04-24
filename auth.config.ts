import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config (no Prisma adapter, no Node.js APIs).
 * Used by middleware for lightweight auth checks.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtected =
        path.startsWith("/dashboard") ||
        path.startsWith("/studio") ||
        path.startsWith("/account");
      if (isProtected && !isLoggedIn) {
        const url = new URL("/login", nextUrl.origin);
        url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
        return Response.redirect(url);
      }
      return true;
    },
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        const role = (user as unknown as { role?: string }).role;
        if (role) session.user.role = role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";

/**
 * Shared NextAuth config. The server instance in auth.ts extends this with the
 * Prisma adapter and Resend provider; middleware currently does not run auth
 * checks because we use `session.strategy = "database"` on the server, and
 * database sessions aren't readable from the edge runtime without Prisma.
 * Route-level protection lives in the server components (see
 * `app/(creator)/layout.tsx` which redirects unauthenticated users to /login).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  providers: [],
  callbacks: {
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

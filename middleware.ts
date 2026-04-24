// Auth.js runs a database-session strategy (see auth.ts). Database sessions
// can't be decoded from the edge runtime without Prisma, so we deliberately do
// not perform auth checks in middleware — that would cause a strategy mismatch
// and redirect-loop authenticated users on /dashboard. Server components
// (e.g. `app/(creator)/layout.tsx`) guard protected routes with `auth()` +
// `redirect("/login")` at the Node runtime where the Prisma adapter is
// available.
//
// This file intentionally exports a no-op middleware so Next.js keeps the file
// wired up for future auth, rate-limiting, or i18n logic.
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnAuth =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  if (isOnDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("redirectTo", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

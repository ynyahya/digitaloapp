import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

// Short affiliate redirect: `/a/ABC123` -> storefront with a cookie that later
// attributes a checkout to this link. The cookie is intentionally short-lived
// (30 days) and scoped site-wide so the attribution survives navigation.
//
// We bump `clicks` atomically so two concurrent hits don't race — the update
// is a single UPDATE statement.
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  const code = params.code?.toUpperCase();
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  const link = await db.affiliateLink.findUnique({
    where: { code },
    select: { id: true, creator: { select: { handle: true } } },
  });
  if (!link) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Fire-and-forget click bump. If the DB is slow we still want the redirect
  // to feel instant.
  db.affiliateLink
    .update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    .catch(() => {
      /* swallow — analytics, not critical path */
    });

  const destination = link.creator?.handle
    ? new URL(`/c/${link.creator.handle}`, req.url)
    : new URL("/", req.url);

  const res = NextResponse.redirect(destination);
  res.cookies.set("digitalo_ref", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}

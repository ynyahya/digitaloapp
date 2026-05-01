import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { requireCreator } from "@/lib/auth/session";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const creator = await requireCreator();
  if (!creator) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = await db.service.findFirst({
    where: { slug: params.slug, creatorId: creator.id },
  });

  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(service);
}

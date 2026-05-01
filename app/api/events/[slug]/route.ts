import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { auth } from "@/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creator = await db.creator.findUnique({ where: { userId } });
  if (!creator) {
    return NextResponse.json({ error: "No creator profile found" }, { status: 403 });
  }

  const event = await db.event.findFirst({
    where: { slug: params.slug, creatorId: creator.id },
    include: {
      tickets: { orderBy: { position: "asc" } },
      questions: { orderBy: { position: "asc" } },
      speakers: { orderBy: { position: "asc" } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

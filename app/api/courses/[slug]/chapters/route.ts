import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
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

  const course = await db.course.findFirst({
    where: { slug: params.slug, creatorId: creator.id },
    include: {
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

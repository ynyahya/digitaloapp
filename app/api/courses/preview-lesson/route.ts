import { NextRequest, NextResponse } from "next/server";
import { getPreviewLesson } from "@/lib/queries/courses";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const lesson = await getPreviewLesson(id);
  if (!lesson) return NextResponse.json({ error: "Preview not available" }, { status: 404 });

  return NextResponse.json(lesson);
}

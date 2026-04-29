import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/studio/categories — List all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ error: "Failed to get categories" }, { status: 500 });
  }
}

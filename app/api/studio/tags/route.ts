import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/studio/tags — Add tag to product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, tagName } = body;

    if (!productId || !tagName) {
      return NextResponse.json(
        { error: "productId and tagName are required" },
        { status: 400 }
      );
    }

    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    let tag = await db.tag.findUnique({ where: { slug } });
    if (!tag) {
      tag = await db.tag.create({ data: { slug, name: tagName } });
    }

    try {
      await db.productOnTag.create({
        data: { productId, tagId: tag.id },
      });
    } catch {
      // Already exists — ignore
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Add tag error:", error);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}

// DELETE /api/studio/tags — Remove tag from product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const tagId = searchParams.get("tagId");

    if (!productId || !tagId) {
      return NextResponse.json(
        { error: "productId and tagId are required" },
        { status: 400 }
      );
    }

    await db.productOnTag.delete({
      where: { productId_tagId: { productId, tagId } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove tag error:", error);
    return NextResponse.json({ error: "Failed to remove tag" }, { status: 500 });
  }
}

// GET /api/studio/tags?q= — Search tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const tags = await db.tag.findMany({
      where: query
        ? { name: { contains: query } }
        : undefined,
      take: 15,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Search tags error:", error);
    return NextResponse.json({ error: "Failed to search tags" }, { status: 500 });
  }
}

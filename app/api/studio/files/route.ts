import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/studio/files — Add a product file (after upload)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, filename, storageKey, sizeBytes, version } = body;

    if (!productId || !filename || !storageKey) {
      return NextResponse.json(
        { error: "productId, filename, and storageKey are required" },
        { status: 400 }
      );
    }

    const file = await db.productFile.create({
      data: {
        productId,
        filename,
        storageKey,
        sizeBytes: sizeBytes || 0,
        version: version || "1.0.0",
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error("Create file error:", error);
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
  }
}

// DELETE /api/studio/files — Delete a product file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    const file = await db.productFile.findUnique({
      where: { id: fileId },
      select: { storageKey: true },
    });

    await db.productFile.delete({ where: { id: fileId } });

    // Try to delete the physical file
    if (file?.storageKey?.startsWith("/uploads/")) {
      try {
        const { unlink } = await import("fs/promises");
        const path = await import("path");
        await unlink(path.join(process.cwd(), file.storageKey));
      } catch {
        // File may already be gone — ignore
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

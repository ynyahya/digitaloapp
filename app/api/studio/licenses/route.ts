import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/studio/licenses — Add a license tier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, priceCents, description, perks } = body;

    if (!productId || !name || priceCents === undefined) {
      return NextResponse.json(
        { error: "productId, name, and priceCents are required" },
        { status: 400 }
      );
    }

    const license = await db.license.create({
      data: {
        productId,
        name,
        priceCents: parseInt(priceCents),
        description: description || null,
        perks: perks ? JSON.stringify(perks) : null,
      },
    });

    return NextResponse.json(license);
  } catch (error) {
    console.error("Create license error:", error);
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 });
  }
}

// PATCH /api/studio/licenses — Update a license tier
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseId, name, priceCents, description, perks } = body;

    if (!licenseId) {
      return NextResponse.json({ error: "licenseId is required" }, { status: 400 });
    }

    const updateData: Record<string, string | number | null> = {};
    if (name !== undefined) updateData.name = name;
    if (priceCents !== undefined) updateData.priceCents = parseInt(priceCents);
    if (description !== undefined) updateData.description = description;
    if (perks !== undefined) updateData.perks = JSON.stringify(perks);

    const license = await db.license.update({
      where: { id: licenseId },
      data: updateData,
    });

    return NextResponse.json(license);
  } catch (error) {
    console.error("Update license error:", error);
    return NextResponse.json({ error: "Failed to update license" }, { status: 500 });
  }
}

// DELETE /api/studio/licenses — Delete a license tier
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const licenseId = searchParams.get("licenseId");

    if (!licenseId) {
      return NextResponse.json({ error: "licenseId is required" }, { status: 400 });
    }

    await db.license.delete({ where: { id: licenseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete license error:", error);
    return NextResponse.json({ error: "Failed to delete license" }, { status: 500 });
  }
}

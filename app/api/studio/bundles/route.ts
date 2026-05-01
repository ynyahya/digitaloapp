import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { requireCreator } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const creator = await requireCreator();
    if (!creator) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, priceCents, currency, productIds } = body;

    if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
    if (!productIds || productIds.length < 2) return NextResponse.json({ error: "At least 2 products required" }, { status: 400 });

    const baseSlug = slugify(title.trim());
    const slug = `${baseSlug || "bundle"}-${Date.now().toString(36)}`;

    // Verify all products belong to creator
    const products = await db.product.findMany({
      where: { id: { in: productIds }, creatorId: creator.id },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Some products not found or not yours" }, { status: 400 });
    }

    const bundle = await db.product.create({
      data: {
        creatorId: creator.id,
        slug,
        title: title.trim(),
        tagline: description || null,
        type: "BUNDLE",
        status: "DRAFT",
        priceCents: priceCents ?? 0,
        currency: currency || "IDR",
        bundleItems: {
          create: productIds.map((productId: string, idx: number) => ({
            productId,
            position: idx,
          })),
        },
      },
    });

    revalidatePath("/dashboard/bundles");
    return NextResponse.json(bundle);
  } catch (err: any) {
    console.error("Bundle create error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

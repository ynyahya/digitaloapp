import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the creator profile for this user
    const creator = await db.creator.findUnique({ where: { userId } });
    if (!creator) {
      return NextResponse.json({ error: "No creator profile found" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, tagline } = body;
    const creatorId = creator.id;

    if (!title || !creatorId) {
      return NextResponse.json(
        { error: "title and creatorId are required" },
        { status: 400 }
      );
    }

    // Generate a unique slug from the title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = baseSlug || "product";
    let attempts = 0;
    let product = null;

    while (attempts < 10) {
      try {
        // Double check if slug is taken (to reduce P2002 errors in logs)
        const existing = await db.product.findUnique({ where: { slug } });
        if (existing) {
          slug = `${baseSlug || "product"}-${Math.random().toString(36).substring(2, 7)}`;
          attempts++;
          continue;
        }

        product = await db.product.create({
          data: {
            creatorId,
            slug,
            title,
            description: description || null,
            tagline: tagline || null,
            priceCents: 0,
            status: "DRAFT",
          },
          include: {
            licenses: true,
            files: true,
            tags: { include: { tag: true } },
            category: true,
            creator: true,
            reviews: {
              take: 10,
              orderBy: { createdAt: "desc" },
              include: { user: { select: { name: true, image: true } } },
            },
          },
        });
        break; // Success!
      } catch (error: unknown) {
        // If it's a unique constraint error on slug, retry with random suffix
        if (
          error && 
          typeof error === 'object' && 
          'code' in error && 
          error.code === 'P2002' && 
          'meta' in error && 
          typeof error.meta === 'object' &&
          error.meta !== null &&
          'target' in error.meta &&
          Array.isArray(error.meta.target) &&
          error.meta.target.includes('slug')
        ) {
          slug = `${baseSlug || "product"}-${Math.random().toString(36).substring(2, 7)}`;
          attempts++;
        } else {
          throw error; // Other error, rethrow
        }
      }
    }

    if (!product) {
      throw new Error("Failed to generate a unique slug after multiple attempts");
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("Create product error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create product. " + message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await db.creator.findUnique({ where: { userId } });
    if (!creator) {
      return NextResponse.json({ error: "No creator profile found" }, { status: 403 });
    }

    const products = await db.product.findMany({
      where: { creatorId: creator.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

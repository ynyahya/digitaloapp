"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ────────────────────────────────────────────────────────────
// Product — Core CRUD
// ────────────────────────────────────────────────────────────

export async function publishProduct(productId: string) {
  const product = await db.product.update({
    where: { id: productId },
    data: { 
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  revalidatePath("/dashboard/products");
  revalidatePath(`/p/${product.slug}`);
  
  return product;
}

export async function unpublishProduct(productId: string) {
  const product = await db.product.update({
    where: { id: productId },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/products");
  return product;
}

/**
 * Granular field-level update — used by auto-save debounce.
 * Accepts a partial product object and merges it.
 */
export async function updateProductFields(
  productId: string, 
  data: Record<string, any>
) {
  // Whitelist of safe fields to prevent arbitrary writes
  const ALLOWED_FIELDS = [
    "title", "tagline", "description", "coverImage", "gallery",
    "priceCents", "compareAtCents", "currency", "pricingModel",
    "type", "instantDelivery", "lifetimeUpdates",
    "metaTitle", "metaDescription", "ogImageUrl", "customSlug",
    "refundPolicy", "blockOrder", "bonuses", "discountCodes",
    "faq", "included", "highlights", "comparison",
    "categoryId",
  ];

  const sanitized: Record<string, any> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in data) {
      sanitized[key] = data[key];
    }
  }

  if (Object.keys(sanitized).length === 0) {
    throw new Error("No valid fields provided");
  }

  const product = await db.product.update({
    where: { id: productId },
    data: sanitized,
  });

  return product;
}

// ────────────────────────────────────────────────────────────
// Licenses — CRUD
// ────────────────────────────────────────────────────────────

export async function addLicense(productId: string, data: {
  name: string;
  priceCents: number;
  description?: string;
  perks?: string[];
}) {
  const license = await db.license.create({
    data: {
      productId,
      name: data.name,
      priceCents: data.priceCents,
      description: data.description || null,
      perks: data.perks ? JSON.stringify(data.perks) : null,
    },
  });
  return license;
}

export async function updateLicense(licenseId: string, data: {
  name?: string;
  priceCents?: number;
  description?: string;
  perks?: string[];
}) {
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.priceCents !== undefined) updateData.priceCents = data.priceCents;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.perks !== undefined) updateData.perks = JSON.stringify(data.perks);

  const license = await db.license.update({
    where: { id: licenseId },
    data: updateData,
  });
  return license;
}

export async function deleteLicense(licenseId: string) {
  await db.license.delete({ where: { id: licenseId } });
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Product Files — CRUD
// ────────────────────────────────────────────────────────────

export async function addProductFile(productId: string, data: {
  filename: string;
  storageKey: string;
  sizeBytes?: number;
  version?: string;
}) {
  const file = await db.productFile.create({
    data: {
      productId,
      filename: data.filename,
      storageKey: data.storageKey,
      sizeBytes: data.sizeBytes || 0,
      version: data.version || "1.0.0",
    },
  });
  return file;
}

export async function deleteProductFile(fileId: string) {
  await db.productFile.delete({ where: { id: fileId } });
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Tags — Management
// ────────────────────────────────────────────────────────────

export async function addTagToProduct(productId: string, tagName: string) {
  // Find or create the tag
  const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  let tag = await db.tag.findUnique({ where: { slug } });
  if (!tag) {
    tag = await db.tag.create({ data: { slug, name: tagName } });
  }

  // Create the relation (ignore if already exists)
  try {
    await db.productOnTag.create({
      data: { productId, tagId: tag.id },
    });
  } catch {
    // Already exists — ignore
  }

  return tag;
}

export async function removeTagFromProduct(productId: string, tagId: string) {
  await db.productOnTag.delete({
    where: { productId_tagId: { productId, tagId } },
  });
  return { success: true };
}

export async function searchTags(query: string) {
  const tags = await db.tag.findMany({
    where: { name: { contains: query } },
    take: 10,
  });
  return tags;
}

// ────────────────────────────────────────────────────────────
// Fetch full product for Studio
// ────────────────────────────────────────────────────────────

export async function getStudioProduct(productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
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
  return product;
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

import type { ReadinessCheck } from "./types";

export type ProductReadinessData = {
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  priceCents?: number | null;
  coverImage?: string | null;
  files?: unknown[];
  licenses?: unknown[];
  faq?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  tags?: unknown[];
};

const hasText = (value?: unknown, min = 1) => typeof value === "string" && value.trim().length >= min;

export function getProductReadiness(product: ProductReadinessData): ReadinessCheck[] {
  return [
    { id: "title", label: "Product title", description: "Name the product clearly.", severity: "required", done: hasText(product.title, 3), actionLabel: "Edit title", targetSection: "hero" },
    { id: "tagline", label: "Tagline", description: "Add a sharp promise for the hero section.", severity: "required", done: hasText(product.tagline, 8), actionLabel: "Edit tagline", targetSection: "hero" },
    { id: "description", label: "Description", description: "Explain what buyers get and why it matters.", severity: "required", done: hasText(product.description, 40), actionLabel: "Improve description", targetSection: "hero" },
    { id: "pricing", label: "Pricing", description: "Set a price or license buyers can choose.", severity: "required", done: Number(product.priceCents ?? 0) > 0 || Boolean(product.licenses?.length), actionLabel: "Set pricing", targetSection: "pricing" },
    { id: "cover", label: "Cover image", description: "Show the product visually.", severity: "required", done: hasText(product.coverImage), actionLabel: "Add cover", targetSection: "cover" },
    { id: "asset", label: "Downloadable asset", description: "Attach the file or delivery logic.", severity: "required", done: Boolean(product.files?.length), actionLabel: "Add asset", targetSection: "assets" },
    { id: "faq", label: "FAQ", description: "Answer purchase objections before launch.", severity: "recommended", done: hasText(product.faq, 20), actionLabel: "Add FAQ", targetSection: "faq" },
    { id: "seo", label: "SEO metadata", description: "Improve search and share previews.", severity: "recommended", done: hasText(product.metaTitle) && hasText(product.metaDescription), actionLabel: "Add SEO", targetSection: "seo" },
    { id: "tags", label: "Tags", description: "Help shoppers discover the product.", severity: "optional", done: Boolean(product.tags?.length), actionLabel: "Add tags", targetSection: "tags" },
  ];
}

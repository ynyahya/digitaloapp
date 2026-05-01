import type { ReadinessCheck } from "./types";

export type ServiceReadinessData = {
  title?: string | null;
  category?: string | null;
  promise?: string | null;
  description?: string | null;
  priceCents?: number | null;
  deliveryDays?: number | null;
  revisions?: number | null;
  coverImage?: string | null;
  packagesJson?: string | null;
  faqJson?: string | null;
  scopeJson?: string | null;
  outcomesJson?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

const hasText = (value?: string | null, min = 1) => Boolean(value && value.trim().length >= min);
const hasJsonItems = (value?: string | null) => {
  if (!value) return false;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.length > 0 : Boolean(parsed);
  } catch {
    return false;
  }
};

export function getServiceReadiness(service: ServiceReadinessData): ReadinessCheck[] {
  return [
    {
      id: "title",
      label: "Service title",
      description: "Give buyers a clear name for the offer.",
      severity: "required",
      done: hasText(service.title, 3),
      actionLabel: "Edit title",
      targetSection: "basics",
    },
    {
      id: "category",
      label: "Category",
      description: "Help customers understand where this service fits.",
      severity: "required",
      done: hasText(service.category),
      actionLabel: "Choose category",
      targetSection: "basics",
    },
    {
      id: "description",
      label: "Clear promise",
      description: "Explain the outcome, process, and what buyers receive.",
      severity: "required",
      done: hasText(service.promise, 12) || hasText(service.description, 40),
      actionLabel: "Improve copy",
      targetSection: "proof",
    },
    {
      id: "pricing",
      label: "Package pricing",
      description: "Set a package price buyers can evaluate quickly.",
      severity: "required",
      done: Number(service.priceCents ?? 0) > 0 || hasJsonItems(service.packagesJson),
      actionLabel: "Set price",
      targetSection: "packages",
    },
    {
      id: "delivery",
      label: "Delivery timeline",
      description: "Set realistic delivery days for expectation clarity.",
      severity: "required",
      done: Number(service.deliveryDays ?? 0) > 0,
      actionLabel: "Set timeline",
      targetSection: "delivery",
    },
    {
      id: "revisions",
      label: "Revision policy",
      description: "Tell buyers how many revision rounds are included.",
      severity: "required",
      done: service.revisions !== null && service.revisions !== undefined && Number(service.revisions) >= 0,
      actionLabel: "Set revisions",
      targetSection: "delivery",
    },
    {
      id: "cover",
      label: "Cover or proof image",
      description: "A visual makes the service feel more trustworthy.",
      severity: "recommended",
      done: hasText(service.coverImage),
      actionLabel: "Add cover",
      targetSection: "settings",
    },
    {
      id: "faq",
      label: "FAQ",
      description: "Answer common buyer objections before launch.",
      severity: "recommended",
      done: hasJsonItems(service.faqJson),
      actionLabel: "Add FAQ",
      targetSection: "faq",
    },
    {
      id: "scope",
      label: "Scope boundaries",
      description: "Make included and not included work explicit.",
      severity: "recommended",
      done: hasJsonItems(service.scopeJson),
      actionLabel: "Define scope",
      targetSection: "delivery",
    },
    {
      id: "seo",
      label: "SEO metadata",
      description: "Improve search and share previews.",
      severity: "optional",
      done: hasText(service.metaTitle) && hasText(service.metaDescription),
      actionLabel: "Add SEO",
      targetSection: "settings",
    },
  ];
}

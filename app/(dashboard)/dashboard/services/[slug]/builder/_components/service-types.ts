export type ServiceBuilderData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  priceCents: number;
  currency: string;
  deliveryDays: number;
  revisions: number;
  status: string;
  coverImage: string | null;
  promise: string | null;
  packagesJson: string | null;
  scopeJson: string | null;
  outcomesJson: string | null;
  faqJson: string | null;
  proofJson: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  salesCount: number;
  ratingAvg: number;
};

export type ServicePackage = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  deliveryDays: number;
  revisions: number;
};

export type ServiceFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ServiceScope = {
  id: string;
  label: string;
  included: boolean;
};

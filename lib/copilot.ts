// Deterministic "AI Copilot" heuristics.
//
// No external LLM is required for any of these signals — everything below
// derives from the same product/order/review data already in the DB. When you
// wire up an OpenAI / Anthropic key later, the copy rewriter and daily brief
// are the natural places to swap heuristic strings for model calls; the
// structural scoring logic should stay the same so the UI doesn't change.

export type ListingScore = {
  score: number; // 0..100
  grade: "A" | "B" | "C" | "D";
  issues: ListingIssue[];
  wins: string[];
};

export type ListingIssue = {
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
};

export type PricingInsight = {
  suggestion: "raise" | "hold" | "lower";
  confidence: number; // 0..1
  headline: string;
  reasoning: string;
  targetCents: number;
  currentCents: number;
};

export type DailyBriefItem = {
  kind: "signal" | "warning" | "win";
  icon: "trending-up" | "trending-down" | "flag" | "sparkles" | "users";
  title: string;
  body: string;
};

type ProductForScore = {
  title: string;
  tagline: string | null;
  description: string | null;
  coverImage: string | null;
  gallery: string | null;
  priceCents: number;
  compareAtCents: number | null;
  included: string | null;
  faq: string | null;
  licenses: Array<{ name: string; perks: string | null }>;
  ratingCount: number;
  ratingAvg: number;
};

export function scoreListing(p: ProductForScore): ListingScore {
  const issues: ListingIssue[] = [];
  const wins: string[] = [];
  let score = 100;

  // Cover image is the single biggest visual contributor to conversion.
  if (!p.coverImage) {
    issues.push({
      severity: "high",
      title: "Missing cover image",
      detail: "Cover is the hero of the storefront card. Upload a 1600×900 cover to boost clicks.",
    });
    score -= 25;
  } else {
    wins.push("Cover image present");
  }

  // Gallery / secondary visuals.
  const galleryLen = safeParseJsonArray(p.gallery).length;
  if (galleryLen < 3) {
    issues.push({
      severity: galleryLen === 0 ? "high" : "medium",
      title: galleryLen === 0 ? "No gallery shots" : `Only ${galleryLen} gallery image${galleryLen === 1 ? "" : "s"}`,
      detail: "Top listings ship 4–6 gallery shots: in-context mockups, before/after, feature close-ups.",
    });
    score -= galleryLen === 0 ? 12 : 6;
  } else {
    wins.push(`Gallery has ${galleryLen} shots`);
  }

  // Description length.
  const descLen = (p.description ?? "").trim().length;
  if (descLen < 240) {
    issues.push({
      severity: descLen < 80 ? "high" : "medium",
      title: "Description too thin",
      detail: "Aim for 500–900 characters with scannable bullets. Thin copy reads like an afterthought.",
    });
    score -= descLen < 80 ? 15 : 8;
  } else if (descLen > 240 && descLen < 1800) {
    wins.push("Description length is in the sweet spot");
  }

  // Tagline.
  if (!p.tagline || p.tagline.trim().length < 12) {
    issues.push({
      severity: "medium",
      title: "Weak or missing tagline",
      detail: "A 6–10 word tagline under the title makes the storefront card pop. Describe the outcome, not the format.",
    });
    score -= 6;
  }

  // Licenses / perks.
  const perksPerLicense = p.licenses.map((l) => safeParseJsonArray(l.perks).length);
  const avgPerks = perksPerLicense.length
    ? perksPerLicense.reduce((a, b) => a + b, 0) / perksPerLicense.length
    : 0;
  if (p.licenses.length < 2) {
    issues.push({
      severity: "medium",
      title: "Single license tier",
      detail: "Two or three tiers (Personal / Commercial / Team) consistently lift average order value 12–18%.",
    });
    score -= 8;
  }
  if (avgPerks < 3) {
    issues.push({
      severity: "medium",
      title: "License perks are sparse",
      detail: "Each tier should list 3–5 concrete perks (seats, commercial use, support window).",
    });
    score -= 6;
  } else {
    wins.push(`Avg ${avgPerks.toFixed(1)} perks per license`);
  }

  // Included grid.
  const includedLen = safeParseJsonArray(p.included).length;
  if (includedLen < 4) {
    issues.push({
      severity: "low",
      title: "What's included grid is short",
      detail: "4–6 items in the What's Included grid wins over a wall of text.",
    });
    score -= 4;
  } else {
    wins.push(`${includedLen} items in the included grid`);
  }

  // FAQ.
  const faqLen = safeParseJsonArray(p.faq).length;
  if (faqLen < 3) {
    issues.push({
      severity: "low",
      title: "Add at least 3 FAQs",
      detail: "Answer refunds, licensing, and update cadence to remove the top objections before checkout.",
    });
    score -= 4;
  } else {
    wins.push(`FAQ covers ${faqLen} topics`);
  }

  // Social proof (reviews).
  if (p.ratingCount === 0) {
    issues.push({
      severity: "low",
      title: "No reviews yet",
      detail: "Ask your first 10 buyers for a one-line testimonial. Even 3 reviews move conversion noticeably.",
    });
    score -= 4;
  } else if (p.ratingCount >= 10 && p.ratingAvg >= 4.5) {
    wins.push(`${p.ratingCount} reviews averaging ${p.ratingAvg.toFixed(1)}★`);
  }

  // Compare-at anchor (gives the listing a price anchor).
  if (p.compareAtCents && p.compareAtCents > p.priceCents) {
    wins.push("Compare-at anchor is set");
  }

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const grade: ListingScore["grade"] =
    clamped >= 90 ? "A" : clamped >= 75 ? "B" : clamped >= 60 ? "C" : "D";

  return { score: clamped, grade, issues, wins };
}

export function pricingInsight(args: {
  currentCents: number;
  compareAtCents: number | null;
  peerMedianCents: number;
  ratingAvg: number;
  ratingCount: number;
  salesCount: number;
  viewsCount: number;
}): PricingInsight {
  const {
    currentCents,
    compareAtCents,
    peerMedianCents,
    ratingAvg,
    ratingCount,
    salesCount,
    viewsCount,
  } = args;
  const anchor = compareAtCents && compareAtCents > currentCents ? compareAtCents : null;
  const conversion = viewsCount > 0 ? salesCount / viewsCount : 0;

  // Ratio to peer median drives the headline suggestion.
  const peerRatio = peerMedianCents > 0 ? currentCents / peerMedianCents : 1;

  // Strong social proof + above-median conversion → price up.
  if (ratingCount >= 15 && ratingAvg >= 4.5 && conversion >= 0.025 && peerRatio <= 1.1) {
    const target = Math.round(currentCents * 1.12);
    return {
      suggestion: "raise",
      confidence: 0.72,
      headline: "Raise price by ~12% — demand signals you're underpriced",
      reasoning: `Strong social proof (${ratingAvg.toFixed(1)}★, ${ratingCount} reviews), conversion ${(
        conversion * 100
      ).toFixed(2)}% beats marketplace median, and you're priced at ${(peerRatio * 100).toFixed(
        0,
      )}% of peer median. Testing a 12% bump is low-risk.`,
      targetCents: target,
      currentCents,
    };
  }

  // Stale conversion + far above peer median → lower.
  if (peerRatio >= 1.35 && conversion < 0.01 && salesCount < 10) {
    const target = Math.round(peerMedianCents * 1.05);
    return {
      suggestion: "lower",
      confidence: 0.64,
      headline: "Consider lowering toward the peer median",
      reasoning: `You're priced at ${(peerRatio * 100).toFixed(
        0,
      )}% of peer median with conversion below 1%. Most buyers compare on perceived value — aim ~5% above median to start.`,
      targetCents: target,
      currentCents,
    };
  }

  // Compare-at is being used but it's < 30% off — buyers don't feel the deal.
  if (anchor && (anchor - currentCents) / anchor < 0.1) {
    return {
      suggestion: "hold",
      confidence: 0.5,
      headline: "Compare-at anchor is too subtle",
      reasoning: `Your compare-at is only ${(((anchor - currentCents) / anchor) * 100).toFixed(
        0,
      )}% higher. Anchors below 10% don't register as discounts. Either widen it to 20–35% or remove it.`,
      targetCents: currentCents,
      currentCents,
    };
  }

  return {
    suggestion: "hold",
    confidence: 0.55,
    headline: "Price is in the right band — hold and test",
    reasoning: `You're at ${(peerRatio * 100).toFixed(0)}% of peer median with conversion ${(
      conversion * 100
    ).toFixed(2)}%. Nothing screams mispriced. Focus on listing quality and social proof before revisiting price.`,
    targetCents: currentCents,
    currentCents,
  };
}

export function rewriteTagline(title: string, draft: string | null | undefined): string {
  const base = (draft ?? "").trim();
  if (base.length >= 12 && base.length <= 90) return base;

  // Deterministic fallback: craft a tagline from the title when draft is weak.
  // Intentionally boring — it's a placeholder until an LLM is wired up.
  const lower = title.toLowerCase();
  if (lower.includes("template")) return `A thoughtful ${title.toLowerCase()} — launch in a weekend.`;
  if (lower.includes("kit") || lower.includes("bundle")) {
    return `Everything in one file. ${title} ships production-ready.`;
  }
  if (lower.includes("course") || lower.includes("guide")) {
    return `Learn the thing properly. ${title} is the guide I wish I had.`;
  }
  return `${title} — built for creators who want premium without the wait.`;
}

export function dailyBrief(args: {
  revenue7d: number;
  revenuePrev7d: number;
  topProductTitle: string | null;
  topProductRevenue: number;
  avgRating: number;
  reviewCount: number;
  newFollowers7d: number;
  draftCount: number;
}): DailyBriefItem[] {
  const {
    revenue7d,
    revenuePrev7d,
    topProductTitle,
    topProductRevenue,
    avgRating,
    reviewCount,
    newFollowers7d,
    draftCount,
  } = args;
  const out: DailyBriefItem[] = [];

  const delta = revenuePrev7d > 0 ? (revenue7d - revenuePrev7d) / revenuePrev7d : revenue7d > 0 ? 1 : 0;
  if (revenue7d > 0 && delta >= 0.15) {
    out.push({
      kind: "win",
      icon: "trending-up",
      title: `Revenue +${(delta * 100).toFixed(0)}% WoW`,
      body: "Momentum is real — consider launching a companion product or raising the price on your top seller.",
    });
  } else if (delta <= -0.2 && revenuePrev7d > 0) {
    out.push({
      kind: "warning",
      icon: "trending-down",
      title: `Revenue ${(delta * 100).toFixed(0)}% WoW`,
      body: "Dip signal. Check your last week's checkout abandons and make sure your top listings still have fresh cover images.",
    });
  } else {
    out.push({
      kind: "signal",
      icon: "sparkles",
      title: "Steady week",
      body: "No big swings week over week — a good time to refresh descriptions or ship a new license tier.",
    });
  }

  if (topProductTitle && topProductRevenue > 0) {
    out.push({
      kind: "signal",
      icon: "flag",
      title: `"${topProductTitle}" is carrying`,
      body: `Top product drove ${(topProductRevenue / 100).toFixed(0)}$ this week. Consider a bundle that pairs it with an underperformer.`,
    });
  }

  if (reviewCount >= 5 && avgRating < 4.0) {
    out.push({
      kind: "warning",
      icon: "flag",
      title: `Rating slipping (${avgRating.toFixed(1)}★)`,
      body: "Dig into the 1-3★ reviews — there's usually a single fixable theme (missing files, unclear scope, support wait).",
    });
  } else if (reviewCount >= 10 && avgRating >= 4.6) {
    out.push({
      kind: "win",
      icon: "sparkles",
      title: `Rating steady at ${avgRating.toFixed(1)}★`,
      body: "Perfect time to ask your last 10 buyers for one-line testimonials. Social proof compounds.",
    });
  }

  if (newFollowers7d >= 5) {
    out.push({
      kind: "signal",
      icon: "users",
      title: `${newFollowers7d} new followers this week`,
      body: "Post a behind-the-scenes update. Followers are the only audience that actually shows up for launches.",
    });
  }

  if (draftCount > 0) {
    out.push({
      kind: "warning",
      icon: "flag",
      title: `${draftCount} product${draftCount === 1 ? "" : "s"} sitting in Draft`,
      body: "Drafts don't make money. Even a minimal listing (cover + 2 licenses + 200-word description) converts.",
    });
  }

  return out;
}

function safeParseJsonArray(raw: string | null | undefined): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

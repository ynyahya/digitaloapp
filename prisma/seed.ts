/**
 * Digitalo seed — populates creators, products, licenses, reviews,
 * collections and bundles. Aligned with blueprint PNGs in
 * `plan project fullstack/` (Pilars 1, 3, 4).
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type CreatorInput = {
  handle: string;
  displayName: string;
  tagline: string;
  bio: string;
  avatarInitials: string;
  verified?: boolean;
  tools?: string[];
  featuredClients?: string[];
  socials?: Record<string, string>;
  metrics: {
    customers: number;
    totalSalesCents: number;
    productsSold: number;
    avgRating: number;
  };
};

const CREATORS: CreatorInput[] = [
  {
    handle: "alex-morgan",
    displayName: "Alex Morgan",
    tagline: "Digital products built for creators and founders.",
    bio: "I'm a full-time indie builder and product maker. I've built and scaled multiple digital products used by thousands of creators and founders worldwide.",
    avatarInitials: "AM",
    verified: true,
    tools: ["Next.js", "Tailwind CSS", "Supabase", "Framer", "Notion"],
    featuredClients: ["Linear", "Vercel", "Contra", "Acemity", "Dub.co", "Payload"],
    socials: { twitter: "alexmorgan", github: "alexmorgan", website: "alexmorgan.dev" },
    metrics: {
      customers: 50_000,
      totalSalesCents: 200_000_000,
      productsSold: 120,
      avgRating: 4.9,
    },
  },
  {
    handle: "makerstack",
    displayName: "MakerStack",
    tagline: "Production-grade starter kits for SaaS builders.",
    bio: "MakerStack builds beautifully engineered SaaS boilerplates to help indie hackers launch in days, not months.",
    avatarInitials: "MS",
    verified: true,
    tools: ["Next.js", "Stripe", "Prisma", "Turborepo"],
    featuredClients: ["Lindy", "Polar", "Dub", "Framer"],
    socials: { website: "makerstack.co" },
    metrics: {
      customers: 24_300,
      totalSalesCents: 860_000_000,
      productsSold: 18,
      avgRating: 4.9,
    },
  },
  {
    handle: "notionify",
    displayName: "Notionify",
    tagline: "Gorgeous Notion templates for founders & operators.",
    bio: "Notionify crafts minimalist Notion systems that help founders run clear, calm companies.",
    avatarInitials: "NF",
    verified: true,
    tools: ["Notion", "Figma"],
    featuredClients: ["Framer", "Vercel"],
    metrics: {
      customers: 8_600,
      totalSalesCents: 124_000_000,
      productsSold: 12,
      avgRating: 4.8,
    },
  },
  {
    handle: "framebase",
    displayName: "Framebase",
    tagline: "Editorial Framer templates with motion built-in.",
    bio: "Framebase makes award-winning Framer templates for studios and founders.",
    avatarInitials: "FB",
    verified: true,
    tools: ["Framer", "Figma", "Rive"],
    featuredClients: ["Contra", "Linear"],
    metrics: {
      customers: 7_100,
      totalSalesCents: 96_000_000,
      productsSold: 10,
      avgRating: 4.7,
    },
  },
  {
    handle: "designlab",
    displayName: "DesignLab",
    tagline: "Design systems and UI kits that scale.",
    bio: "DesignLab is a small studio shipping rigorous design systems for modern product teams.",
    avatarInitials: "DL",
    verified: true,
    tools: ["Figma", "Tokens Studio", "Storybook"],
    featuredClients: ["Vercel", "Dub.co"],
    metrics: {
      customers: 4_300,
      totalSalesCents: 58_000_000,
      productsSold: 6,
      avgRating: 4.9,
    },
  },
  {
    handle: "promptbase",
    displayName: "PromptBase",
    tagline: "High-signal AI prompt libraries for operators.",
    bio: "PromptBase curates editorial-grade prompt packs for product, marketing and ops teams.",
    avatarInitials: "PB",
    verified: true,
    tools: ["Claude", "GPT", "Cursor"],
    featuredClients: ["Lindy", "Dub"],
    metrics: {
      customers: 9_800,
      totalSalesCents: 48_000_000,
      productsSold: 7,
      avgRating: 4.8,
    },
  },
];

const CATEGORIES = [
  { slug: "templates", name: "Templates", blurb: "Notion, Framer and Figma systems." },
  { slug: "saas-kits", name: "SaaS Starter Kits", blurb: "Production-ready boilerplates." },
  { slug: "ui-kits", name: "UI Kits", blurb: "Design systems and component libraries." },
  { slug: "ai-prompts", name: "AI Prompt Packs", blurb: "Curated prompt libraries." },
  { slug: "ebooks", name: "Ebooks & Guides", blurb: "Playbooks from indie operators." },
];

type ProductInput = {
  slug: string;
  creatorHandle: string;
  title: string;
  tagline: string;
  description: string;
  categorySlug: string;
  priceCents: number;
  compareAtCents?: number;
  type?: "ONE_TIME" | "SUBSCRIPTION" | "BUNDLE";
  bestSeller?: boolean;
  ratingAvg: number;
  ratingCount: number;
  salesCount: number;
  viewsCount?: number;
  included: { icon: string; title: string; description: string }[];
  highlights: { eyebrow: string; title: string; body: string }[];
  faq: { q: string; a: string }[];
  comparison?: {
    tiers: { name: string; priceCents: number; popular?: boolean }[];
    features: { label: string; values: (boolean | string)[] }[];
  };
  licenses: { name: string; priceCents: number; description?: string; perks: string[] }[];
  bundleChildren?: string[];
  publishedAt?: Date;
};

const PRODUCTS: ProductInput[] = [
  {
    slug: "saas-starter-kit",
    creatorHandle: "makerstack",
    title: "SaaS Starter Kit",
    tagline:
      "Launch your SaaS faster with production-ready boilerplates, dashboards, auth and payments.",
    description:
      "A production-grade Next.js 14 boilerplate engineered for founders who want to skip weeks of setup. Dashboards, auth, multi-tenant billing and polished monochrome UI — ready to deploy on day one.",
    categorySlug: "saas-kits",
    priceCents: 4900,
    compareAtCents: 9900,
    bestSeller: true,
    ratingAvg: 4.9,
    ratingCount: 2100,
    salesCount: 2100,
    viewsCount: 124,
    included: [
      { icon: "code", title: "Full Source Code", description: "Production-ready codebase." },
      { icon: "box", title: "Next.js 14 Boilerplate", description: "Latest app router." },
      { icon: "stripe", title: "Stripe Integration", description: "Payments & subscriptions." },
      { icon: "lock", title: "Authentication", description: "Email + social login." },
      { icon: "db", title: "Database Schema", description: "Prisma ORM schema." },
      { icon: "doc", title: "Documentation", description: "Step-by-step guides." },
      { icon: "figma", title: "Figma UI Kit", description: "Beautiful UI components." },
      { icon: "refresh", title: "Lifetime Updates", description: "Free updates forever." },
      { icon: "chat", title: "Community Access", description: "Private Discord." },
    ],
    highlights: [
      {
        eyebrow: "Build Faster",
        title: "Ship production-ready apps.",
        body: "Everything you need to build and launch your SaaS in days, not months.",
      },
      {
        eyebrow: "Monetize Faster",
        title: "Payments built in.",
        body: "Stripe integration, subscriptions, coupons and billing portal preconfigured.",
      },
      {
        eyebrow: "Scale Confidently",
        title: "Architecture designed to grow.",
        body: "Built with best practices, clean code and scalable infrastructure.",
      },
    ],
    faq: [
      { q: "What is the license?", a: "Personal license is for a single project. Commercial license unlocks unlimited client projects." },
      { q: "Will I get updates?", a: "Yes — lifetime updates on all tiers." },
      { q: "Can I use this for client projects?", a: "Commercial and Agency licenses include client project usage." },
      { q: "What is your refund policy?", a: "30-day money-back guarantee, no questions asked." },
      { q: "Do you offer support?", a: "All buyers get access to our private Discord community." },
    ],
    comparison: {
      tiers: [
        { name: "Starter", priceCents: 4900 },
        { name: "Pro", priceCents: 7900 },
        { name: "Bundle", priceCents: 12900, popular: true },
      ],
      features: [
        { label: "Full Source Code", values: [true, true, true] },
        { label: "Next.js Boilerplate", values: [true, true, true] },
        { label: "Authentication", values: [true, true, true] },
        { label: "Stripe Payments", values: [true, true, true] },
        { label: "Database Schema", values: [true, true, true] },
        { label: "Figma UI Kit", values: [false, true, true] },
        { label: "Advanced Analytics", values: [false, true, true] },
        { label: "Email Templates", values: [false, false, true] },
        { label: "Priority Support", values: [false, true, true] },
        { label: "Commercial License", values: [false, false, true] },
      ],
    },
    licenses: [
      {
        name: "Personal",
        priceCents: 4900,
        description: "For personal projects.",
        perks: ["1 project", "Lifetime updates", "Instant download"],
      },
      {
        name: "Commercial",
        priceCents: 14900,
        description: "For commercial use.",
        perks: ["Unlimited projects", "Commercial license", "Priority support"],
      },
      {
        name: "Agency",
        priceCents: 24900,
        description: "For agencies & teams.",
        perks: ["Unlimited projects & clients", "Team seats", "Dedicated support"],
      },
    ],
    publishedAt: new Date("2024-03-10"),
  },
  {
    slug: "notion-finance-tracker",
    creatorHandle: "notionify",
    title: "Notion Finance Tracker",
    tagline: "A calm, elegant way to track income, expenses and runway — built in Notion.",
    description:
      "Beautiful monochrome dashboards for founders who want clarity over their finances without opening a spreadsheet ever again.",
    categorySlug: "templates",
    priceCents: 2900,
    ratingAvg: 4.8,
    ratingCount: 1600,
    salesCount: 1600,
    included: [
      { icon: "sheet", title: "Finance Dashboard", description: "At-a-glance financial overview." },
      { icon: "chart", title: "Runway Forecast", description: "Cash runway projections." },
      { icon: "tag", title: "Expense Tagging", description: "Automatic categorization." },
      { icon: "calendar", title: "Monthly Reports", description: "Auto-generated reports." },
    ],
    highlights: [
      {
        eyebrow: "Calm by Design",
        title: "One dashboard. Zero chaos.",
        body: "Replace five spreadsheets with one beautifully crafted Notion system.",
      },
      {
        eyebrow: "Built for Founders",
        title: "Visibility without overhead.",
        body: "Understand your numbers in under a minute, every Monday morning.",
      },
    ],
    faq: [
      { q: "Do I need a paid Notion plan?", a: "No — free Notion works perfectly." },
      { q: "Is there support?", a: "Yes, lifetime support via the Notionify community." },
    ],
    licenses: [
      { name: "Personal", priceCents: 2900, perks: ["Unlimited duplicates", "Lifetime updates"] },
      { name: "Team", priceCents: 7900, perks: ["Team workspace", "Priority support"] },
    ],
    publishedAt: new Date("2024-04-02"),
  },
  {
    slug: "framer-portfolio-kit",
    creatorHandle: "framebase",
    title: "Framer Portfolio Kit",
    tagline: "Editorial portfolio templates built for designers and studios.",
    description: "Seven monochrome Framer templates engineered for designers who ship award-winning work.",
    categorySlug: "templates",
    priceCents: 3900,
    ratingAvg: 4.7,
    ratingCount: 1200,
    salesCount: 1200,
    included: [
      { icon: "layers", title: "7 Framer Templates", description: "Fully responsive layouts." },
      { icon: "motion", title: "Motion Presets", description: "Beautiful micro-interactions." },
      { icon: "figma", title: "Figma Source", description: "Design files included." },
      { icon: "refresh", title: "Lifetime Updates", description: "New layouts added monthly." },
    ],
    highlights: [
      { eyebrow: "Editorial", title: "Crafted for studios.", body: "Pixel-perfect layouts inspired by award-winning editorial design." },
      { eyebrow: "Motion", title: "Motion without the fuss.", body: "Beautiful micro-interactions that enhance, never distract." },
    ],
    faq: [
      { q: "Do I need Framer Pro?", a: "Yes — Pro or Team plan required for publishing." },
    ],
    licenses: [{ name: "Personal", priceCents: 3900, perks: ["1 portfolio", "Lifetime updates"] }],
    publishedAt: new Date("2024-02-20"),
  },
  {
    slug: "ai-prompts-mega-pack",
    creatorHandle: "promptbase",
    title: "AI Prompts Mega Pack",
    tagline: "1000+ prompt workflows for product, marketing and ops teams.",
    description: "Curated, battle-tested prompts for founders using Claude, GPT and Cursor in their daily workflows.",
    categorySlug: "ai-prompts",
    priceCents: 1900,
    ratingAvg: 4.8,
    ratingCount: 3400,
    salesCount: 3400,
    included: [
      { icon: "prompt", title: "1,000+ Prompts", description: "Curated across 12 categories." },
      { icon: "notion", title: "Notion Library", description: "Ready-to-clone workspace." },
      { icon: "refresh", title: "Monthly Updates", description: "40+ new prompts monthly." },
    ],
    highlights: [
      { eyebrow: "Battle-tested", title: "Curated by operators.", body: "Every prompt road-tested in production by shipping teams." },
    ],
    faq: [
      { q: "Which models does this support?", a: "All prompts are tuned for Claude 3, GPT-4 and Cursor." },
    ],
    licenses: [{ name: "Personal", priceCents: 1900, perks: ["Personal use", "Lifetime updates"] }],
    publishedAt: new Date("2024-05-05"),
  },
  {
    slug: "design-system-pro",
    creatorHandle: "designlab",
    title: "Design System Pro",
    tagline: "A modern monochrome design system built in Figma.",
    description: "Enterprise-grade design system with 80+ components, tokens, and a full Storybook setup.",
    categorySlug: "ui-kits",
    priceCents: 4900,
    ratingAvg: 4.9,
    ratingCount: 980,
    salesCount: 980,
    included: [
      { icon: "figma", title: "80+ Components", description: "Fully variant-driven." },
      { icon: "token", title: "Design Tokens", description: "Typography, color, spacing." },
      { icon: "storybook", title: "Storybook Preview", description: "Ready-to-fork repo." },
    ],
    highlights: [
      { eyebrow: "Enterprise", title: "Built to scale.", body: "Variant-driven components matching every state and density." },
    ],
    faq: [{ q: "Do you offer figma community file?", a: "No — paid license only, to keep it polished." }],
    licenses: [
      { name: "Personal", priceCents: 4900, perks: ["1 designer", "Lifetime updates"] },
      { name: "Team", priceCents: 14900, perks: ["Up to 5 seats", "Priority support"] },
    ],
    publishedAt: new Date("2024-01-14"),
  },
  {
    slug: "nextjs-saas-auth",
    creatorHandle: "makerstack",
    title: "Next.js SaaS Auth",
    tagline: "Drop-in authentication system for Next.js apps.",
    description: "Battle-tested auth boilerplate with social login, email magic links, and session management.",
    categorySlug: "saas-kits",
    priceCents: 2900,
    ratingAvg: 4.9,
    ratingCount: 1200,
    salesCount: 1200,
    included: [
      { icon: "lock", title: "Social + Email Auth", description: "Google, GitHub, email magic links." },
      { icon: "shield", title: "Session Management", description: "JWT + refresh tokens." },
    ],
    highlights: [
      { eyebrow: "Drop-in", title: "Ready in 10 minutes.", body: "Auth so polished your users won't notice it." },
    ],
    faq: [{ q: "Which providers are supported?", a: "Google, GitHub, email, Apple out of the box." }],
    licenses: [{ name: "Personal", priceCents: 2900, perks: ["1 project", "Lifetime updates"] }],
    publishedAt: new Date("2024-03-22"),
  },
  {
    slug: "saas-ui-kit",
    creatorHandle: "designlab",
    title: "SaaS UI Kit",
    tagline: "Premium Figma UI kit for SaaS products.",
    description: "Dashboard, onboarding, auth, billing and empty state components built for modern SaaS.",
    categorySlug: "ui-kits",
    priceCents: 3900,
    ratingAvg: 4.9,
    ratingCount: 680,
    salesCount: 680,
    included: [
      { icon: "figma", title: "120+ Screens", description: "Every core SaaS flow." },
      { icon: "icons", title: "Icon Library", description: "Consistent iconography." },
    ],
    highlights: [
      { eyebrow: "Polished", title: "Ship polished SaaS UX.", body: "Every state, every edge case, every density — handled." },
    ],
    faq: [{ q: "Is Figma required?", a: "Yes — Figma free plan works." }],
    licenses: [{ name: "Personal", priceCents: 3900, perks: ["1 project", "Lifetime updates"] }],
    publishedAt: new Date("2024-02-12"),
  },
  {
    slug: "email-templates",
    creatorHandle: "framebase",
    title: "Email Templates",
    tagline: "Beautiful transactional & marketing email templates.",
    description: "React Email + MJML templates for onboarding, receipts, marketing and growth loops.",
    categorySlug: "templates",
    priceCents: 1900,
    ratingAvg: 4.8,
    ratingCount: 860,
    salesCount: 860,
    included: [
      { icon: "email", title: "24 Templates", description: "Onboarding, billing, marketing." },
      { icon: "code", title: "React Email Source", description: "MJML + React Email." },
    ],
    highlights: [
      { eyebrow: "Conversion-crafted", title: "Emails that convert.", body: "Battle-tested layouts for every lifecycle moment." },
    ],
    faq: [{ q: "Which ESPs does this support?", a: "Postmark, Resend, Sendgrid, Mailgun — works with any." }],
    licenses: [{ name: "Personal", priceCents: 1900, perks: ["1 project", "Lifetime updates"] }],
    publishedAt: new Date("2024-04-18"),
  },
  {
    slug: "notion-second-brain",
    creatorHandle: "notionify",
    title: "Notion Second Brain",
    tagline: "A calm, editorial operating system for your thoughts.",
    description: "The most beautiful personal knowledge system in Notion, designed for founders and writers.",
    categorySlug: "templates",
    priceCents: 2900,
    ratingAvg: 4.8,
    ratingCount: 1600,
    salesCount: 1600,
    included: [
      { icon: "notion", title: "12 Databases", description: "Linked knowledge graph." },
      { icon: "doc", title: "Weekly Review", description: "Automated templates." },
    ],
    highlights: [
      { eyebrow: "Editorial", title: "Your second brain, distilled.", body: "Capture, refine, publish — without the clutter." },
    ],
    faq: [{ q: "Does it work on mobile?", a: "Yes — Notion iOS & Android supported." }],
    licenses: [{ name: "Personal", priceCents: 2900, perks: ["Unlimited duplicates", "Lifetime updates"] }],
    publishedAt: new Date("2024-03-06"),
  },
  {
    slug: "complete-saas-bundle",
    creatorHandle: "makerstack",
    title: "Complete SaaS Bundle",
    tagline: "All six MakerStack products in one bundle. Save 40%.",
    description: "Every MakerStack product — SaaS kit, auth, UI kit, emails, Notion ops dashboard and prompt pack — in one bundle.",
    categorySlug: "saas-kits",
    priceCents: 12900,
    compareAtCents: 21600,
    type: "BUNDLE",
    ratingAvg: 4.9,
    ratingCount: 340,
    salesCount: 340,
    included: [
      { icon: "box", title: "6 Premium Products", description: "All MakerStack hits." },
      { icon: "license", title: "Commercial License", description: "For unlimited projects." },
      { icon: "priority", title: "Priority Support", description: "Dedicated channel." },
      { icon: "bonus", title: "Bonus Resources", description: "Unreleased experiments." },
    ],
    highlights: [
      { eyebrow: "Save 40%", title: "One checkout. Everything you need.", body: "Get the complete MakerStack toolkit at a fraction of the price." },
    ],
    faq: [{ q: "Do I get future products?", a: "Yes — all future MakerStack launches are included." }],
    licenses: [
      { name: "Personal", priceCents: 12900, perks: ["Unlimited personal projects", "Lifetime updates"] },
      { name: "Agency", priceCents: 24900, perks: ["Unlimited client projects", "Priority support"] },
    ],
    bundleChildren: [
      "saas-starter-kit",
      "nextjs-saas-auth",
      "saas-ui-kit",
      "email-templates",
      "ai-prompts-mega-pack",
      "notion-second-brain",
    ],
    publishedAt: new Date("2024-04-28"),
  },
];

const COLLECTIONS_BY_CREATOR: Record<
  string,
  { slug: string; name: string; description: string; products: string[] }[]
> = {
  "alex-morgan": [
    {
      slug: "founder-pack",
      name: "Founder Pack",
      description: "Everything a first-time founder needs to ship their first SaaS.",
      products: ["saas-starter-kit", "nextjs-saas-auth", "notion-finance-tracker"],
    },
    {
      slug: "creator-toolkit",
      name: "Creator Toolkit",
      description: "Tools to ship digital products without hiring a team.",
      products: ["notion-second-brain", "ai-prompts-mega-pack", "email-templates"],
    },
    {
      slug: "productivity-bundle",
      name: "Productivity Bundle",
      description: "The calmest Notion + AI workflow for operators.",
      products: ["notion-finance-tracker", "notion-second-brain", "ai-prompts-mega-pack"],
    },
    {
      slug: "design-essentials",
      name: "Design Essentials",
      description: "A monochrome design system and premium UI kits.",
      products: ["design-system-pro", "saas-ui-kit", "framer-portfolio-kit"],
    },
  ],
};

const REVIEW_BLURBS: { role: string; name: string; body: string }[] = [
  {
    role: "Indie Hacker",
    name: "Sarah Chen",
    body: "\u201CAlex's templates are absolute game changers. High quality, clean code, and super easy to customize.\u201D",
  },
  {
    role: "Founder",
    name: "James Parker",
    body: "\u201CBest creator on the platform. His SaaS Starter Kit saved me weeks of development time.\u201D",
  },
  {
    role: "Solopreneur",
    name: "Jessica Lee",
    body: "\u201CHigh quality products and amazing support. Worth every penny!\u201D",
  },
  {
    role: "Founder",
    name: "Arvid Kahl",
    body: "\u201CDigitalo transformed how I sell my digital products. The platform is sleek, fast, and incredibly easy to use.\u201D",
  },
  {
    role: "Founder",
    name: "Marc Lou",
    body: "\u201CThe best marketplace for indie creators. I've made over $50k in sales in just 6 months.\u201D",
  },
  {
    role: "YouTuber & Creator",
    name: "Sara Dietschy",
    body: "\u201CBeautiful stores, zero code, and powerful analytics. Everything a creator needs.\u201D",
  },
];

async function main() {
  console.log("\u00b7 Resetting database \u2026");
  await db.$transaction([
    db.review.deleteMany(),
    db.collectionItem.deleteMany(),
    db.collection.deleteMany(),
    db.bundleItem.deleteMany(),
    db.orderItem.deleteMany(),
    db.order.deleteMany(),
    db.license.deleteMany(),
    db.productFile.deleteMany(),
    db.productOnTag.deleteMany(),
    db.tag.deleteMany(),
    db.product.deleteMany(),
    db.creatorMetrics.deleteMany(),
    db.creator.deleteMany(),
    db.category.deleteMany(),
    db.follow.deleteMany(),
    db.user.deleteMany(),
  ]);

  console.log("\u00b7 Seeding categories \u2026");
  for (const c of CATEGORIES) {
    await db.category.create({ data: c });
  }

  console.log("\u00b7 Seeding admin user \u2026");
  await db.user.create({
    data: {
      email: "admin@digitalo.app",
      name: "Digitalo Admin",
      role: "ADMIN",
    },
  });

  console.log("\u00b7 Seeding creators \u2026");
  for (const c of CREATORS) {
    await db.user.create({
      data: {
        email: `${c.handle}@digitalo.app`,
        name: c.displayName,
        role: "CREATOR",
        creator: {
          create: {
            handle: c.handle,
            displayName: c.displayName,
            tagline: c.tagline,
            bio: c.bio,
            avatarUrl: null,
            verified: c.verified ?? false,
            socials: c.socials ? JSON.stringify(c.socials) : null,
            tools: c.tools ? JSON.stringify(c.tools) : null,
            featuredClients: c.featuredClients ? JSON.stringify(c.featuredClients) : null,
            metrics: { create: { ...c.metrics } },
          },
        },
      },
    });
  }

  console.log("\u00b7 Seeding products, licenses and bundles \u2026");
  for (const p of PRODUCTS) {
    const creator = await db.creator.findUniqueOrThrow({ where: { handle: p.creatorHandle } });
    const category = await db.category.findUniqueOrThrow({ where: { slug: p.categorySlug } });
    await db.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        type: p.type ?? "ONE_TIME",
        status: "PUBLISHED",
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        bestSeller: p.bestSeller ?? false,
        included: JSON.stringify(p.included),
        highlights: JSON.stringify(p.highlights),
        faq: JSON.stringify(p.faq),
        comparison: p.comparison ? JSON.stringify(p.comparison) : null,
        salesCount: p.salesCount,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        viewsCount: p.viewsCount ?? 0,
        publishedAt: p.publishedAt ?? new Date(),
        creatorId: creator.id,
        categoryId: category.id,
        licenses: {
          create: p.licenses.map((l) => ({
            name: l.name,
            priceCents: l.priceCents,
            description: l.description ?? null,
            perks: JSON.stringify(l.perks),
          })),
        },
      },
    });
  }

  console.log("\u00b7 Linking bundle children \u2026");
  for (const p of PRODUCTS) {
    if (!p.bundleChildren?.length) continue;
    const bundle = await db.product.findUniqueOrThrow({ where: { slug: p.slug } });
    for (let i = 0; i < p.bundleChildren.length; i += 1) {
      const child = await db.product.findUniqueOrThrow({ where: { slug: p.bundleChildren[i] } });
      await db.bundleItem.create({
        data: { bundleId: bundle.id, productId: child.id, position: i },
      });
    }
  }

  console.log("\u00b7 Seeding collections \u2026");
  for (const [handle, cols] of Object.entries(COLLECTIONS_BY_CREATOR)) {
    const creator = await db.creator.findUniqueOrThrow({ where: { handle } });
    for (const c of cols) {
      const collection = await db.collection.create({
        data: {
          creatorId: creator.id,
          slug: c.slug,
          name: c.name,
          description: c.description,
        },
      });
      for (let i = 0; i < c.products.length; i += 1) {
        const product = await db.product.findUniqueOrThrow({ where: { slug: c.products[i] } });
        await db.collectionItem.create({
          data: { collectionId: collection.id, productId: product.id, position: i },
        });
      }
    }
  }

  console.log("\u00b7 Seeding reviews \u2026");
  const buyers = await Promise.all(
    REVIEW_BLURBS.map((r, i) =>
      db.user.create({
        data: {
          email: `buyer-${i}-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@digitalo.app`,
          name: r.name,
          role: "BUYER",
        },
      }),
    ),
  );
  const allProducts = await db.product.findMany();
  for (let i = 0; i < allProducts.length; i += 1) {
    const product = allProducts[i];
    // first 3 reviews per product, cycling through blurbs
    for (let j = 0; j < 3; j += 1) {
      const blurb = REVIEW_BLURBS[(i + j) % REVIEW_BLURBS.length];
      const buyer = buyers[(i + j) % buyers.length];
      try {
        await db.review.create({
          data: {
            productId: product.id,
            userId: buyer.id,
            rating: 5,
            body: blurb.body,
            role: blurb.role,
            title: blurb.name,
          },
        });
      } catch {
        // unique constraint — skip duplicate
      }
    }
  }

  console.log("\u2713 Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

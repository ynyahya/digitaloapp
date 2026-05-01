import type { ProductCardData } from "@/components/marketplace/product-card";

export type DemoCreator = {
  id: string;
  handle: string;
  displayName: string;
  tagline: string;
  bio: string;
  verified: boolean;
  socials: Record<string, string>;
  tools: string[];
  featuredClients: string[];
  metrics: {
    customers: number;
    totalSalesCents: number;
    productsSold: number;
    avgRating: number;
  };
  products: ProductCardData[];
  offers: { kind: string; title: string; href: string; description: string }[];
};

const DEMO_CREATORS: DemoCreator[] = [
  {
    id: "demo-stellar",
    handle: "stellar",
    displayName: "Stellar Studio",
    tagline: "Design systems, conversion assets, and launch kits for SaaS founders.",
    bio: "Stellar Studio packages the systems used by high-growth SaaS teams into polished templates, productized services, and launch playbooks. Their storefront is built for founders who need premium execution without waiting on an agency queue.",
    verified: true,
    socials: { website: "stellar.studio", twitter: "x.com/stellar" },
    tools: ["Figma", "Framer", "Next.js", "Stripe"],
    featuredClients: ["Northstar", "Pilotbase", "Arc Labs"],
    metrics: { customers: 8421, totalSalesCents: 12400000, productsSold: 9100, avgRating: 4.9 },
    products: [],
    offers: [
      { kind: "Product", title: "SaaS Launch System", href: "/products", description: "Homepage, pricing, onboarding, and growth templates." },
      { kind: "Service", title: "Conversion audit sprint", href: "/products", description: "A 72-hour teardown of your product funnel." },
      { kind: "Course", title: "Design Systems for Founders", href: "/courses", description: "A practical system for fast-moving product teams." },
    ],
  },
  {
    id: "demo-obsidian",
    handle: "obsidian",
    displayName: "Obsidian Co.",
    tagline: "Templates that turn messy creator operations into a launch room.",
    bio: "Obsidian Co. builds ruthless operating systems for creators: launch calendars, content engines, offer dashboards, and high-converting product pages. The result is a cleaner business with fewer tools and faster shipping cycles.",
    verified: true,
    socials: { website: "obsidian.co", twitter: "x.com/obsidian" },
    tools: ["Notion", "Airtable", "Webflow", "Zapier"],
    featuredClients: ["MakerOps", "SoloLab", "CreatorDesk"],
    metrics: { customers: 3210, totalSalesCents: 8450000, productsSold: 3760, avgRating: 4.8 },
    products: [],
    offers: [
      { kind: "Product", title: "Creator Command Center", href: "/products", description: "A complete dashboard for launches, customers, and revenue." },
      { kind: "Bundle", title: "Launch Room Bundle", href: "/products", description: "Templates, checklists, and dashboards for a premium launch." },
      { kind: "Membership", title: "Ops Room", href: "/pricing", description: "Monthly systems drops for independent creator businesses." },
    ],
  },
  {
    id: "demo-lattice",
    handle: "lattice",
    displayName: "Lattice Cohort",
    tagline: "Cohort programs for builders who want shipping discipline.",
    bio: "Lattice Cohort runs intense creator programs with playbooks, critique rooms, templates, and accountability systems. Their work helps operators turn ideas into paid products through weekly shipping loops.",
    verified: true,
    socials: { website: "lattice.cohort", twitter: "x.com/lattice" },
    tools: ["Zoom", "Circle", "Notion", "Slack"],
    featuredClients: ["Buildcamp", "Indie Guild", "Shipyard"],
    metrics: { customers: 1820, totalSalesCents: 6420000, productsSold: 2140, avgRating: 5 },
    products: [],
    offers: [
      { kind: "Course", title: "Build in Public Masterclass", href: "/courses", description: "A cohort program for audience-led product launches." },
      { kind: "Event", title: "Creator Demo Day", href: "/creators", description: "Live demos, reviews, and operator feedback." },
      { kind: "Product", title: "Cohort Ops Kit", href: "/products", description: "Run live cohorts with templates and SOPs." },
    ],
  },
  {
    id: "demo-fjord",
    handle: "fjord",
    displayName: "Fjord & Co.",
    tagline: "Premium interface assets for teams that care about detail.",
    bio: "Fjord & Co. ships icon systems, interface kits, onboarding packs, and product illustration libraries. Everything is built to feel editorial, exacting, and ready for production teams.",
    verified: true,
    socials: { website: "fjord.co", github: "github.com/fjord" },
    tools: ["Figma", "Illustrator", "React", "Tailwind"],
    featuredClients: ["Linear Works", "OrbitStack", "VantaForm"],
    metrics: { customers: 6430, totalSalesCents: 4270000, productsSold: 7010, avgRating: 4.9 },
    products: [],
    offers: [
      { kind: "Product", title: "Premium Icon Library", href: "/products", description: "A sharp visual system for SaaS, AI, and fintech products." },
      { kind: "Bundle", title: "Interface Asset Vault", href: "/products", description: "Icons, empty states, hero art, and launch visuals." },
      { kind: "Service", title: "Brand polish sprint", href: "/products", description: "A focused visual upgrade for product teams." },
    ],
  },
  {
    id: "demo-meridian",
    handle: "meridian",
    displayName: "Meridian",
    tagline: "Notion OS and revenue dashboards for indie founders.",
    bio: "Meridian designs calm, complete business operating systems for founders who sell digital products. Their templates connect strategy, customer research, launch planning, and metrics into one daily workspace.",
    verified: false,
    socials: { website: "meridian.os", twitter: "x.com/meridian" },
    tools: ["Notion", "Tally", "Stripe", "Super"],
    featuredClients: ["IndieNorth", "FounderPad", "MicroStudio"],
    metrics: { customers: 2210, totalSalesCents: 2890000, productsSold: 2600, avgRating: 4.7 },
    products: [],
    offers: [
      { kind: "Product", title: "Indie Founder OS", href: "/products", description: "A full-stack workspace for product, content, and revenue." },
      { kind: "Product", title: "Revenue Control Room", href: "/products", description: "Track experiments, launches, customers, and cash flow." },
      { kind: "Membership", title: "Meridian Lab", href: "/pricing", description: "Monthly founder systems and operating reviews." },
    ],
  },
  {
    id: "demo-axiom",
    handle: "axiom",
    displayName: "Axiom Labs",
    tagline: "AI product cohorts, prompts, and launch systems for modern builders.",
    bio: "Axiom Labs teaches creators how to ship useful AI products with better positioning, evaluation, workflows, and launch mechanics. Their materials are tactical, fast-moving, and grounded in real products.",
    verified: true,
    socials: { website: "axiomlabs.ai", github: "github.com/axiomlabs" },
    tools: ["OpenAI", "LangChain", "Next.js", "Postgres"],
    featuredClients: ["PromptWorks", "AgentBase", "ModelOps"],
    metrics: { customers: 1140, totalSalesCents: 2250000, productsSold: 1320, avgRating: 4.8 },
    products: [],
    offers: [
      { kind: "Course", title: "AI Products Cohort", href: "/courses", description: "Build, evaluate, and launch AI features people pay for." },
      { kind: "Product", title: "Prompt Ops Kit", href: "/products", description: "Prompt libraries, eval sheets, and shipping workflows." },
      { kind: "Event", title: "AI Builder Office Hours", href: "/creators", description: "Live critiques for agents, copilots, and AI tools." },
    ],
  },
];

function makeProduct(creator: DemoCreator, index: number, title: string, type = "ONE_TIME"): ProductCardData {
  return {
    slug: `${creator.handle}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    title,
    creatorName: creator.displayName,
    creatorHandle: creator.handle,
    priceCents: [4900, 7900, 12900][index % 3],
    compareAtCents: index === 0 ? 14900 : null,
    ratingAvg: creator.metrics.avgRating,
    salesCount: Math.max(120, Math.round(creator.metrics.productsSold / (index + 2))),
    bestSeller: index === 0,
    instantDelivery: true,
    type,
  };
}

const PRODUCT_TITLES: Record<string, [string, string, string, string]> = {
  stellar: ["SaaS Launch System", "Pricing Page Lab", "Onboarding Flow Kit", "Founder Growth Bundle"],
  obsidian: ["Creator Command Center", "Launch Room Bundle", "Content Ops Dashboard", "Offer Validation Kit"],
  lattice: ["Cohort Ops Kit", "Build in Public Playbook", "Workshop Delivery System", "Accountability Sprint Bundle"],
  fjord: ["Premium Icon Library", "Interface Asset Vault", "Empty State Gallery", "Launch Visual System"],
  meridian: ["Indie Founder OS", "Revenue Control Room", "Customer Research Vault", "Solo Operator Bundle"],
  axiom: ["Prompt Ops Kit", "AI Product Scorecard", "Agent Launch Checklist", "Model Evaluation Bundle"],
};

for (const creator of DEMO_CREATORS) {
  creator.products = PRODUCT_TITLES[creator.handle].map((title, index) =>
    makeProduct(creator, index, title, title.includes("Bundle") ? "BUNDLE" : "ONE_TIME"),
  );
}

export function getDemoCreators() {
  return DEMO_CREATORS;
}

export function getDemoCreatorByHandle(handle: string) {
  return DEMO_CREATORS.find((creator) => creator.handle === handle) ?? null;
}

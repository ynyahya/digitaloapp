// Static definitions for the built-in agent templates. Users instantiate
// these into AgentWorkflow rows; the code that actually runs the steps is
// stubbed out until we wire up a real scheduler/LLM.
//
// Each template exposes:
//   - id (stable, used as the slug when installing)
//   - visual canvas nodes + edges so the UI can render the same diagram
//     for every user without per-user overrides

import type { ComponentType } from "react";
import {
  Bot,
  CircleDollarSign,
  Heart,
  MessageSquareText,
  Rocket,
  Wand2,
} from "lucide-react";

export type NodeKind = "trigger" | "action" | "condition" | "ai";

export type AgentNode = {
  id: string;
  kind: NodeKind;
  label: string;
  sub?: string;
  col: number; // 0..3, laid out left-to-right on the canvas
  row: number; // 0..N, stacked vertically inside a column
};

export type AgentEdge = {
  from: string;
  to: string;
  label?: string;
};

export type AgentTemplate = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  cadence: string; // human-readable schedule
  category: "Pricing" | "Retention" | "Launch" | "Growth";
  nodes: AgentNode[];
  edges: AgentEdge[];
  defaultConfig: Record<string, unknown>;
};

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "pricing-bot",
    name: "Pricing Bot",
    tagline: "Raise prices when demand says so, gently and only when the math works.",
    description:
      "Scans your catalog every morning. Looks at reviews, conversion, and peer median price. Suggests a raise only when confidence is high — surfaces the recommendation in Copilot for one-click approval.",
    icon: CircleDollarSign,
    cadence: "Every morning · 07:00 local",
    category: "Pricing",
    defaultConfig: { minConfidence: 0.7, maxRaisePct: 15 },
    nodes: [
      { id: "t", kind: "trigger", label: "Daily @ 07:00", col: 0, row: 0 },
      { id: "fetch", kind: "action", label: "Fetch catalog + orders", col: 1, row: 0 },
      { id: "score", kind: "ai", label: "Score pricing per product", col: 1, row: 1 },
      { id: "filter", kind: "condition", label: "confidence ≥ 70%", col: 2, row: 0 },
      { id: "notify", kind: "action", label: "Queue in Copilot", sub: "approval required", col: 3, row: 0 },
    ],
    edges: [
      { from: "t", to: "fetch" },
      { from: "fetch", to: "score" },
      { from: "score", to: "filter" },
      { from: "filter", to: "notify", label: "yes" },
    ],
  },
  {
    id: "review-responder",
    name: "Review Responder",
    tagline: "Drafts polite, specific replies to new reviews — you approve before posting.",
    description:
      "Watches for new reviews. Summarizes sentiment, drafts a context-aware reply referencing the buyer's name and the specific product. Never auto-posts — drops into your approval queue.",
    icon: MessageSquareText,
    cadence: "Real-time · on review.created",
    category: "Retention",
    defaultConfig: { tone: "warm", autoPost: false },
    nodes: [
      { id: "t", kind: "trigger", label: "review.created", col: 0, row: 0 },
      { id: "ctx", kind: "action", label: "Load buyer + product", col: 1, row: 0 },
      { id: "draft", kind: "ai", label: "Draft reply", sub: "warm tone", col: 2, row: 0 },
      { id: "queue", kind: "action", label: "Approval queue", col: 3, row: 0 },
    ],
    edges: [
      { from: "t", to: "ctx" },
      { from: "ctx", to: "draft" },
      { from: "draft", to: "queue" },
    ],
  },
  {
    id: "launch-copilot",
    name: "Launch Copilot",
    tagline: "Turns a new product into a launch plan, on day zero.",
    description:
      "When a product flips to PUBLISHED, builds a 7-day launch plan: email to followers, X/Twitter thread draft, affiliate-invite email, and a review-request nudge on day 5. You approve each step.",
    icon: Rocket,
    cadence: "On product.published",
    category: "Launch",
    defaultConfig: { channels: ["email", "twitter"], days: 7 },
    nodes: [
      { id: "t", kind: "trigger", label: "product.published", col: 0, row: 0 },
      { id: "plan", kind: "ai", label: "Draft 7-day plan", col: 1, row: 0 },
      { id: "email", kind: "action", label: "Email followers", col: 2, row: 0 },
      { id: "thread", kind: "action", label: "Draft X thread", col: 2, row: 1 },
      { id: "affiliate", kind: "action", label: "Invite affiliates", col: 2, row: 2 },
      { id: "review", kind: "action", label: "Day 5 review nudge", col: 3, row: 1 },
    ],
    edges: [
      { from: "t", to: "plan" },
      { from: "plan", to: "email" },
      { from: "plan", to: "thread" },
      { from: "plan", to: "affiliate" },
      { from: "affiliate", to: "review" },
    ],
  },
  {
    id: "affiliate-nudge",
    name: "Affiliate Nudge",
    tagline: "Re-engages partners who haven't referred a sale this month.",
    description:
      "Every Monday, checks partners who had ≥1 referral last month but 0 this month. Drafts a personal nudge with a fresh asset pack and your current top-performing link.",
    icon: Heart,
    cadence: "Weekly · Monday 09:00",
    category: "Growth",
    defaultConfig: { dryRun: true },
    nodes: [
      { id: "t", kind: "trigger", label: "Weekly Mon @ 09:00", col: 0, row: 0 },
      { id: "find", kind: "action", label: "Find dormant partners", col: 1, row: 0 },
      { id: "gate", kind: "condition", label: "had ≥1 ref last month", col: 2, row: 0 },
      { id: "draft", kind: "ai", label: "Draft nudge email", col: 3, row: 0 },
    ],
    edges: [
      { from: "t", to: "find" },
      { from: "find", to: "gate" },
      { from: "gate", to: "draft", label: "yes" },
    ],
  },
  {
    id: "listing-refresher",
    name: "Listing Refresher",
    tagline: "Keeps your storefront copy feeling current without lifting a finger.",
    description:
      "Once per quarter, rewrites tired listing copy where Copilot flagged a grade below B. Posts drafts to your Product Studio as suggested edits.",
    icon: Wand2,
    cadence: "Quarterly",
    category: "Retention",
    defaultConfig: { minGradeToRefresh: "C" },
    nodes: [
      { id: "t", kind: "trigger", label: "Quarterly", col: 0, row: 0 },
      { id: "scan", kind: "action", label: "Scan grades", col: 1, row: 0 },
      { id: "gate", kind: "condition", label: "grade < B", col: 2, row: 0 },
      { id: "rewrite", kind: "ai", label: "Rewrite copy", col: 3, row: 0 },
      { id: "suggest", kind: "action", label: "Post to Studio", col: 3, row: 1 },
    ],
    edges: [
      { from: "t", to: "scan" },
      { from: "scan", to: "gate" },
      { from: "gate", to: "rewrite", label: "yes" },
      { from: "rewrite", to: "suggest" },
    ],
  },
  {
    id: "support-triage",
    name: "Support Triage",
    tagline: "Sorts incoming support requests by urgency and drafts a first response.",
    description:
      "Watches for new buyer emails. Classifies refund requests, missing-download reports, and generic questions. Drafts a first response keyed to the right template.",
    icon: Bot,
    cadence: "Real-time",
    category: "Retention",
    defaultConfig: { autoCloseFAQ: false },
    nodes: [
      { id: "t", kind: "trigger", label: "email.received", col: 0, row: 0 },
      { id: "classify", kind: "ai", label: "Classify intent", col: 1, row: 0 },
      { id: "refund", kind: "action", label: "→ Refund queue", col: 2, row: 0 },
      { id: "download", kind: "action", label: "→ Re-mint link", col: 2, row: 1 },
      { id: "faq", kind: "action", label: "→ FAQ reply", col: 2, row: 2 },
    ],
    edges: [
      { from: "t", to: "classify" },
      { from: "classify", to: "refund", label: "refund" },
      { from: "classify", to: "download", label: "download" },
      { from: "classify", to: "faq", label: "faq" },
    ],
  },
];

export function findTemplate(id: string): AgentTemplate | undefined {
  return AGENT_TEMPLATES.find((t) => t.id === id);
}

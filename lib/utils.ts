import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency = "USD"): string {
  const value = cents / 100;
  const hasFraction = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Sanitize HTML from rich text editor — strip dangerous tags/attributes, keep formatting */
const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "p", "br", "hr",
  "strong", "b", "em", "i", "s", "u",
  "ul", "ol", "li",
  "a", "blockquote", "pre", "code",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
};

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  // Simple tag-level sanitizer: allow known tags, strip everything else
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";
    // For closing tags, just pass through
    if (match.startsWith("</")) return `</${lower}>`;
    // For opening tags, filter attributes
    const allowedForTag = ALLOWED_ATTRS[lower];
    if (!allowedForTag) return `<${lower}>`;
    // Extract allowed attributes
    const attrRegex = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let attrs = "";
    let m;
    while ((m = attrRegex.exec(match)) !== null) {
      const attrName = m[1].toLowerCase();
      const attrVal = m[2] ?? m[3] ?? "";
      if (allowedForTag.has(attrName)) {
        // Only allow http/https links for href
        if (attrName === "href" && !attrVal.startsWith("http://") && !attrVal.startsWith("https://")) {
          continue;
        }
        attrs += ` ${attrName}="${attrVal}"`;
      }
    }
    // Add rel="noopener noreferrer" for links with target
    if (lower === "a" && attrs.includes("target")) {
      attrs += ' rel="noopener noreferrer"';
    }
    return `<${lower}${attrs}>`;
  });
}

// Shared helpers for the course storefront — pure data transforms, no server deps.

export function formatDuration(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return "";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function formatLessonDuration(min: number | null | undefined): string {
  if (!min) return "";
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min}m`;
}

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export type FaqItem = { q: string; a: string };

export function parseFaq(value: string | null | undefined): FaqItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is FaqItem => !!item && typeof item.q === "string" && typeof item.a === "string")
      .map((item) => ({ q: item.q.trim(), a: item.a.trim() }))
      .filter((item) => item.q && item.a);
  } catch {
    return [];
  }
}

export function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  if (url.includes("vimeo.com")) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
    return url;
  }
  return url;
}

export const DEFAULT_GUARANTEES = [
  "Lifetime access to all lessons",
  "Access on desktop, tablet, and mobile",
  "Certificate of completion",
  "30-day money-back guarantee",
];

"use client";

type TrackProps = Record<string, string | number | boolean | null | undefined>;

const SESSION_KEY = "teskel_session_id";
const ANON_KEY = "teskel_anonymous_id";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;

  const payload = buildPayload(event, props);

  const debugPayload: Record<string, unknown> = {
    event,
    ...props,
    ts: Date.now(),
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(debugPayload);
  }

  window.dispatchEvent(
    new CustomEvent("teskel:track", {
      detail: debugPayload,
    }),
  );

  sendToIngest(payload);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", debugPayload);
  }
}

function buildPayload(event: string, props: TrackProps) {
  const {
    surface,
    pathname,
    referrer,
    sessionId,
    anonymousId,
    ...rest
  } = props;

  return {
    event,
    surface: toOptionalString(surface),
    pathname: toOptionalString(pathname) ?? window.location.pathname,
    referrer: toOptionalString(referrer) ?? (document.referrer || undefined),
    sessionId: toOptionalString(sessionId) ?? getOrCreateId(SESSION_KEY, "sess"),
    anonymousId: toOptionalString(anonymousId) ?? getOrCreateId(ANON_KEY, "anon"),
    properties: rest,
  };
}

function sendToIngest(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/analytics/events", blob);
      if (ok) return;
    } catch {
      // fall through to fetch
    }
  }

  void fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function getOrCreateId(key: string, prefix: string) {
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const created = `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return `${prefix}_volatile_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function toOptionalString(value: TrackProps[string]) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

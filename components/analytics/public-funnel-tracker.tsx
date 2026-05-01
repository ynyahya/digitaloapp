"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

const DEPTH_STEPS = [25, 50, 75, 90] as const;

function shouldTrackDepth(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/products" ||
    pathname === "/courses" ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/creators")
  );
}

export function PublicFunnelTracker() {
  const pathname = usePathname();
  const sentDepth = useRef<Set<number>>(new Set());

  useEffect(() => {
    sentDepth.current = new Set();
    trackEvent("page_view", { pathname, surface: "public_funnel" });
  }, [pathname]);

  useEffect(() => {
    if (!shouldTrackDepth(pathname)) return;

    const onScroll = () => {
      const full = document.documentElement.scrollHeight - window.innerHeight;
      if (full <= 0) return;

      const progress = Math.round((window.scrollY / full) * 100);
      for (const step of DEPTH_STEPS) {
        if (progress >= step && !sentDepth.current.has(step)) {
          sentDepth.current.add(step);
          trackEvent("scroll_depth", {
            pathname,
            depth_pct: step,
            surface: "public_funnel",
          });
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Stylized monochrome wordmark logos for the trust strip.
 * Vercel/Linear-style: muted by default, full ink on hover.
 */

type LogoProps = { className?: string };

const cls = "h-5 w-auto md:h-[22px] text-ink/55 transition-colors group-hover:text-ink";

function Vercel(p: LogoProps) {
  return (
    <svg viewBox="0 0 116 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <path d="M12 2 L23 22 H1 Z" fill="currentColor" />
      <text x="30" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Vercel
      </text>
    </svg>
  );
}

function Framer(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <path d="M5 2h14v8H12L5 2Zm0 8 7 8 7-8H5Zm0 8 7 8V18H5Z" fill="currentColor" />
      <text x="28" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Framer
      </text>
    </svg>
  );
}

function Linear(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.18" />
      <path d="M5 14a9 9 0 0 1 5-5l-5 5Zm0 4a9 9 0 0 1 9-9l-9 9Zm0 4a9 9 0 0 1 13-13L5 22Zm5 0 12-12v6L16 22h-6Zm10 0v-6l-6 6h6Z" fill="currentColor" />
      <text x="30" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Linear
      </text>
    </svg>
  );
}

function Stripe(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <path d="M11 4c-3.5 0-6 2-6 5 0 5.5 8 4 8 6.7 0 .9-.8 1.3-2 1.3-1.7 0-4-.7-5.6-1.6v3.4c1.7.7 3.7 1 5.5 1 3.7 0 6.3-1.8 6.3-5C17.2 9.1 9 10.6 9 8.2c0-.8.7-1.2 1.8-1.2 1.7 0 3.7.5 5.4 1.4V5C14.7 4.4 13 4 11 4Z" fill="currentColor" />
      <text x="22" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Stripe
      </text>
    </svg>
  );
}

function Notion(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.12" />
      <path d="M7 6.5h6.5l4 5V18H7V6.5Zm2 1.5v8h6v-5.5l-3-2.5H9Z" fill="currentColor" />
      <text x="26" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Notion
      </text>
    </svg>
  );
}

function Loom(p: LogoProps) {
  return (
    <svg viewBox="0 0 110 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.16" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19l14-14" stroke="currentColor" strokeWidth="0.8" />
      <text x="26" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Loom
      </text>
    </svg>
  );
}

function Polar(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="26" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Polar
      </text>
    </svg>
  );
}

function Lindy(p: LogoProps) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={cn(cls, p.className)} aria-hidden>
      <path d="M5 17V5h2v10h6v2H5Z" fill="currentColor" />
      <text x="20" y="17" fontFamily="ui-sans-serif,system-ui" fontSize="14" fontWeight="700" fill="currentColor" letterSpacing="-0.02em">
        Lindy
      </text>
    </svg>
  );
}

const LOGOS: { name: string; Cmp: (p: LogoProps) => React.JSX.Element }[] = [
  { name: "Vercel", Cmp: Vercel },
  { name: "Framer", Cmp: Framer },
  { name: "Linear", Cmp: Linear },
  { name: "Stripe", Cmp: Stripe },
  { name: "Notion", Cmp: Notion },
  { name: "Polar", Cmp: Polar },
  { name: "Loom", Cmp: Loom },
  { name: "Lindy", Cmp: Lindy },
];

export function LogoCloud({
  label = "Trusted by creators shipping products on",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
        {label}
      </p>
      <ul
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14",
          compact && "gap-x-8 md:gap-x-10",
        )}
      >
        {LOGOS.map(({ name, Cmp }) => (
          <li key={name} className="group">
            <Cmp />
            <span className="sr-only">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

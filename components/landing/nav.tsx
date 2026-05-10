"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { label: "Products", href: "/products" },
  { label: "Courses", href: "/courses" },
  { label: "Creators", href: "/creators" },
  { label: "Pricing", href: "/pricing" },
  { label: "Mission", href: "/mission" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-[backdrop-filter,background,border-color] duration-300",
        scrolled
          ? "border-b border-line bg-paper/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1360px] items-center justify-between px-5 md:h-16 md:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-lime text-[12px] font-black text-night shadow-[0_0_24px_-4px_rgba(180,243,0,0.6)]">
            T
          </span>
          <span className="text-[15px] font-bold tracking-[-0.02em] text-ink">
            TESKEL
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-muted transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink" />
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-muted transition hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/register?ref=nav"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-lime px-3.5 py-2 text-[13px] font-bold text-night transition hover:bg-lime-bright lime-shadow"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-ink-muted transition hover:bg-paper-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-line px-3 py-2.5 text-center text-[13.5px] font-semibold text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/register?ref=nav_mobile"
                className="rounded-xl bg-lime px-3 py-2.5 text-center text-[13.5px] font-bold text-night lime-shadow"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

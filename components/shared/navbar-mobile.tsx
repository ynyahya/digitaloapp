"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

export function NavbarMobile({
  items,
  authed,
}: {
  items: NavItem[];
  authed: boolean;
}) {
  const [open, setOpen] = useState(false);

  // Lock scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink/30 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] transition-opacity lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute inset-x-3 top-3 origin-top rounded-3xl border border-line bg-paper p-5 shadow-float transition-transform",
            open ? "translate-y-0 scale-100" : "-translate-y-2 scale-[0.98]",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-ink/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ul className="mt-6 flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-paper-soft px-4 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-paper-muted"
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
            {authed && (
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-paper-soft px-4 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-paper-muted"
                >
                  Dashboard
                  <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            )}
          </ul>

          {!authed && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button asChild variant="secondary" className="rounded-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Start selling
                </Link>
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-ink-subtle">
            The engine for digital product · TESKEL
          </p>
        </div>
      </div>
    </>
  );
}

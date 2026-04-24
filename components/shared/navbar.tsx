"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Marketplace", href: "/products" },
  { label: "Creators", href: "/creators" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({
  variant = "marketing",
}: {
  variant?: "marketing" | "marketplace";
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/60 backdrop-blur-md",
      )}
    >
      <Container size="wide">
        <nav className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Logo />
            <ul className="hidden items-center gap-6 lg:flex">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13.5px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            {variant === "marketplace" && (
              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-[13px] text-ink-muted transition-colors hover:border-ink/30 md:inline-flex"
              >
                <Search className="h-4 w-4" />
                Search products…
              </button>
            )}
            <Link
              href="/cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/30"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
            <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full">
              <Link href="/register">Start Selling</Link>
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}

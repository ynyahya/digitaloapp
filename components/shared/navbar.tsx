import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { NavbarScrollShell } from "@/components/shared/navbar-scroll-shell";
import { UserMenu } from "@/components/shared/user-menu";

const NAV = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Creators", href: "/creators" },
  { label: "Bundles", href: "/bundles" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({
  variant = "marketing",
}: {
  variant?: "marketing" | "marketplace";
}) {
  return (
    <NavbarScrollShell>
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
            <UserMenu />
          </div>
        </nav>
      </Container>
    </NavbarScrollShell>
  );
}

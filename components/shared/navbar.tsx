import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { NavbarSearchButton } from "@/components/shared/navbar-search-button";
import { NavbarUserMenu } from "@/components/shared/navbar-user-menu";
import { getCurrentUser } from "@/lib/auth/session";

const NAV = [
  { label: "Marketplace", href: "/products" },
  { label: "Creators", href: "/creators" },
  { label: "Pricing", href: "/pricing" },
];

export async function Navbar({
  variant = "marketing",
}: {
  variant?: "marketing" | "marketplace";
}) {
  const user = await getCurrentUser();

  return (
    <NavbarShell>
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
              {user ? (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-[13.5px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            {variant === "marketplace" ? <NavbarSearchButton /> : null}
            <Link
              href="/cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/30"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
            {user ? (
              <NavbarUserMenu
                name={user.name ?? user.email ?? "Account"}
                email={user.email ?? ""}
                image={user.image ?? null}
              />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden md:inline-flex"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full">
                  <Link href="/register">Start Selling</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </Container>
    </NavbarShell>
  );
}

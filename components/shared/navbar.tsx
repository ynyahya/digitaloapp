import Link from "next/link";
import { CartButton } from "@/components/cart/cart-button";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { NavbarSearchButton } from "@/components/shared/navbar-search-button";
import { NavbarUserMenu } from "@/components/shared/navbar-user-menu";
import { NavbarMobile } from "@/components/shared/navbar-mobile";
import { getCurrentUser } from "@/lib/auth/session";

const NAV = [
  { label: "Marketplace", href: "/products" },
  { label: "Creators", href: "/creators" },
  { label: "Pricing", href: "/pricing" },
  { label: "Mission", href: "/mission" },
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
            <ul className="hidden items-center gap-7 lg:flex">
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
            <CartButton />
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
                <Button size="sm" asChild className="hidden rounded-full md:inline-flex">
                  <Link href="/register">Start selling</Link>
                </Button>
              </>
            )}
            <NavbarMobile items={NAV} authed={!!user} />
          </div>
        </nav>
      </Container>
    </NavbarShell>
  );
}

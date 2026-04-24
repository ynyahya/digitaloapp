import Link from "next/link";
import {
  Activity,
  Box,
  LayoutDashboard,
  ShoppingBag,
  Star,
  Users,
  UserCog,
} from "lucide-react";
import { requireAdminSession } from "@/lib/admin";
import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/creators", label: "Creators", icon: Users },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: UserCog },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-paper-soft">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper px-4 py-5 lg:flex">
        <div className="px-1">
          <Logo subtitle="Mission control" />
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-0.5">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-line bg-paper-soft px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Signed in as
          </p>
          <p className="mt-1 truncate text-[12.5px] font-medium text-ink">
            {admin.name ?? admin.email}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-8">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                Digitalo · Admin
              </p>
              <span className="text-ink-subtle">·</span>
              <Link
                href="/"
                className="text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Back to store
              </Link>
            </div>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

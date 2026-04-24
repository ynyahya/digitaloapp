import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  BarChart3,
  Bot,
  Box,
  Code2,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";
import { cn } from "@/lib/utils";

const NAV: Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Box },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/payouts", label: "Payouts", icon: CreditCard },
  { href: "/dashboard/copilot", label: "AI Copilot", icon: Sparkles, group: "Intelligence" },
  { href: "/dashboard/agents", label: "Agents", icon: Bot, group: "Intelligence" },
  { href: "/dashboard/affiliate", label: "Affiliate", icon: Workflow, group: "Growth" },
  { href: "/dashboard/api-keys", label: "API keys", icon: KeyRound, group: "Developer" },
  { href: "/developers", label: "API docs", icon: Code2, group: "Developer" },
];

const BOTTOM_NAV = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help & support", icon: LifeBuoy },
];

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Ensure the user has a creator profile; otherwise send them to onboarding (stub).
  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true, displayName: true, handle: true },
  });

  // For now, if no creator profile, render a minimal empty shell rather than 404.
  if (!creator) {
    // Sprint 3 will introduce proper onboarding; for now show notFound to avoid leaks.
    return notFound();
  }

  return (
    <div className="flex min-h-screen bg-paper-soft">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-paper px-4 py-5 lg:flex">
        <div className="px-1">
          <Logo subtitle="Creator" />
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-0.5">
          {NAV.map((n, i) => {
            const prevGroup = i > 0 ? NAV[i - 1].group : undefined;
            const showLabel = n.group && n.group !== prevGroup;
            return (
              <div key={n.href}>
                {showLabel && (
                  <p className="mt-4 px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    {n.group}
                  </p>
                )}
                <SidebarLink href={n.href} label={n.label} icon={n.icon} />
              </div>
            );
          })}
          <div className="mt-auto flex flex-col gap-0.5 pt-4">
            {BOTTOM_NAV.map((n) => (
              <SidebarLink key={n.href} {...n} />
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-8">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {creator.displayName}
              </p>
              <span className="text-ink-subtle">·</span>
              <Link
                href={`/c/${creator.handle}`}
                className="text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
              >
                View storefront
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

function SidebarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

import { Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarUserMenu } from "@/components/shared/navbar-user-menu";
import { getCurrentUser } from "@/lib/auth/session";
import { BuilderCommandMenu } from "@/components/builder";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export async function Topbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/75 px-8 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <BuilderCommandMenu />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink" />
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="h-9 rounded-full border-lime/30 bg-lime/10 text-[12.5px] text-lime hover:bg-lime/15"
        >
          <Link href="/dashboard/create">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-lime" />
            Create
          </Link>
        </Button>
        <div className="mx-1 h-4 w-px bg-white/10" />
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
        {user ? (
          <NavbarUserMenu
            name={user.name ?? user.email ?? "Account"}
            email={user.email ?? ""}
            image={user.image ?? null}
          />
        ) : null}
      </div>
    </header>
  );
}

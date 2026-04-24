import { Search, Command, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarUserMenu } from "@/components/shared/navbar-user-menu";
import { getCurrentUser } from "@/lib/auth/session";

export async function Topbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-paper/80 px-8 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="group relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle transition-colors group-focus-within:text-ink" />
          <input
            type="text"
            placeholder="Search everything..."
            className="h-10 w-full rounded-xl border border-line bg-paper-soft pl-10 pr-12 text-[13px] outline-none transition-all focus:border-ink/20 focus:ring-4 focus:ring-ink/5"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-line bg-paper px-1.5 py-0.5 text-[10px] font-medium text-ink-subtle">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="h-9 rounded-full border-line bg-paper-soft text-[12.5px] hover:bg-paper-muted"
        >
          <Sparkles className="mr-2 h-3.5 w-3.5 text-ink" />
          Ask AI
        </Button>
        <div className="mx-1 h-4 w-px bg-line" />
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

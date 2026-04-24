import Link from "next/link";
import { LogOut, LayoutDashboard, Shield, UserIcon } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function UserMenu() {
  const session = await auth();
  if (!session?.user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
          <Link href="/login">Login</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/login?callbackUrl=/dashboard">Start Selling</Link>
        </Button>
      </>
    );
  }
  const { name, email, image, role } = session.user;
  const initials = (name ?? email ?? "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper pl-1 pr-3 transition-colors hover:border-ink/30"
        >
          <Avatar className="h-8 w-8">
            {image && <AvatarImage src={image} alt={name ?? email ?? ""} />}
            <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-[12.5px] font-medium text-ink md:inline">
            {name ?? email?.split("@")[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-ink-muted">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon className="mr-2 h-4 w-4" /> Account
          </Link>
        </DropdownMenuItem>
        {role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="relative flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-[13px] outline-none transition-colors hover:bg-paper-muted"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

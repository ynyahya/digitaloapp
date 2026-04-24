"use client";

import { Search } from "lucide-react";

export function NavbarSearchButton() {
  return (
    <button
      type="button"
      className="hidden h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-[13px] text-ink-muted transition-colors hover:border-ink/30 md:inline-flex"
    >
      <Search className="h-4 w-4" />
      Search products…
    </button>
  );
}

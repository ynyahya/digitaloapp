"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function CartButton() {
  const { totalItems, isMounted } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-lime/30/30"
      aria-label="Cart"
    >
      <ShoppingBag className="h-4 w-4" />
      {isMounted && totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-paper shadow-soft">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

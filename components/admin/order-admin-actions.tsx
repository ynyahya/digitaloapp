"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Undo2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { refundOrderAdmin } from "@/lib/actions/admin";

export function OrderAdminActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-paper text-ink-muted transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
          disabled={pending}
          aria-label="Order actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {status === "PAID" ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                if (!confirm("Refund this order? This action cannot be undone.")) return;
                start(async () => {
                  const res = await refundOrderAdmin(orderId);
                  if (!res.ok) {
                    setError(res.error);
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              <Undo2 className="h-4 w-4" /> Refund
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>Not refundable</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-[10px] text-ink">{error}</p>}
    </div>
  );
}

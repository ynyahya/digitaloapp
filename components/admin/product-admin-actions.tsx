"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, CircleCheck, FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setProductStatusAdmin } from "@/lib/actions/admin";

type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export function ProductAdminActions({
  productId,
  slug,
  status,
}: {
  productId: string;
  slug: string;
  status: Status;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const setStatus = (next: Status) =>
    start(async () => {
      await setProductStatusAdmin(productId, next);
      router.refresh();
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-paper text-ink-muted transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
        disabled={pending}
        aria-label="Product actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={`/p/${slug}`} target="_blank" rel="noreferrer">
            View on store
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {status !== "PUBLISHED" && (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setStatus("PUBLISHED"); }}>
            <CircleCheck className="h-4 w-4" /> Force publish
          </DropdownMenuItem>
        )}
        {status !== "DRAFT" && (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setStatus("DRAFT"); }}>
            <FileText className="h-4 w-4" /> Move to draft
          </DropdownMenuItem>
        )}
        {status !== "ARCHIVED" && (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setStatus("ARCHIVED"); }}>
            <Archive className="h-4 w-4" /> Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct, setProductStatus } from "@/lib/actions/products";

export function ProductRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onStatus(next: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    startTransition(async () => {
      await setProductStatus(id, next);
      router.refresh();
    });
  }
  function onDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open product actions"
          disabled={pending}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onSelect={() => router.push(`/dashboard/products/${id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push(`/p/${slug}`)}>
          View on store
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {status !== "PUBLISHED" && (
          <DropdownMenuItem onSelect={() => onStatus("PUBLISHED")}>
            Publish
          </DropdownMenuItem>
        )}
        {status === "PUBLISHED" && (
          <DropdownMenuItem onSelect={() => onStatus("DRAFT")}>
            Move to draft
          </DropdownMenuItem>
        )}
        {status !== "ARCHIVED" && (
          <DropdownMenuItem onSelect={() => onStatus("ARCHIVED")}>
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-ink hover:bg-paper-muted"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

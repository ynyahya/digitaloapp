"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, MoreHorizontal, Shield, ShieldOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCreatorVerified } from "@/lib/actions/admin";

export function CreatorRowActions({
  creatorId,
  verified,
  handle,
}: {
  creatorId: string;
  verified: boolean;
  handle: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-paper text-ink-muted transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
        disabled={pending}
        aria-label="Creator actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>@{handle}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={`/c/${handle}`} target="_blank" rel="noreferrer">
            <Check className="h-4 w-4" /> Open storefront
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {verified ? (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              start(async () => {
                await setCreatorVerified(creatorId, false);
                router.refresh();
              });
            }}
          >
            <ShieldOff className="h-4 w-4" /> Remove verification
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              start(async () => {
                await setCreatorVerified(creatorId, true);
                router.refresh();
              });
            }}
          >
            <Shield className="h-4 w-4" /> Mark verified
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

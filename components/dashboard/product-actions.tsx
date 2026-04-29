"use client";

import Link from "next/link";
import { 
  ExternalLink, 
  Copy, 
  Trash2, 
  Settings2, 
  Check, 
  Archive,
  MoreVertical
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  product: {
    id: string;
    slug: string;
    title: string;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-end gap-3">
      {/* Primary Action: Edit */}
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 rounded-lg px-3 text-[12px] font-bold border-line bg-paper hover:bg-paper-soft transition-all"
        asChild
      >
        <Link href={`/dashboard/studio?slug=${product.slug}`}>
          <Settings2 className="mr-2 h-3.5 w-3.5" />
          Edit
        </Link>
      </Button>

      {/* Secondary Actions: Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-soft"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-2xl border-line bg-paper shadow-float p-2">
          <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-ink-subtle">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-[13px] font-medium focus:bg-paper-soft focus:text-ink cursor-pointer">
            <Link href={`/p/${product.slug}`} target="_blank" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Storefront
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleCopyLink}
            className="rounded-xl px-3 py-2 text-[13px] font-medium focus:bg-paper-soft focus:text-ink cursor-pointer flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 border-line" />
          <DropdownMenuItem className="rounded-xl px-3 py-2 text-[13px] font-medium focus:bg-paper-soft focus:text-ink cursor-pointer flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archive Product
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl px-3 py-2 text-[13px] font-bold text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

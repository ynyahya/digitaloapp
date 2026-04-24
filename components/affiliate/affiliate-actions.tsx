"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import {
  createAffiliateLink,
  deleteAffiliateLink,
  markCommissionPaid,
} from "@/lib/actions/affiliate";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard may be blocked in some contexts — no-op */
        }
      }}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[11.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
      aria-label="Copy link"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CreateLinkButton() {
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const submit = () =>
    start(async () => {
      setError(null);
      const res = await createAffiliateLink({ label: label.trim() || undefined });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setLabel("");
      router.refresh();
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (e.g. Twitter bio)"
        maxLength={60}
        className="h-9 w-48 rounded-lg border border-line bg-paper px-3 text-[13px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink bg-ink px-3 text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Plus className="h-3.5 w-3.5" />
        {pending ? "Creating…" : "New link"}
      </button>
      {error && <span className="text-[11.5px] text-ink">{error}</span>}
    </form>
  );
}

export function DeleteLinkButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await deleteAffiliateLink(id);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.refresh();
          })
        }
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
        aria-label="Delete link"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      {error && <span className="max-w-[200px] text-[10.5px] text-ink">{error}</span>}
    </div>
  );
}

export function MarkPaidButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await markCommissionPaid(id);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.refresh();
          })
        }
        className="inline-flex h-7 items-center gap-1.5 rounded-md border border-ink bg-ink px-2.5 text-[11px] font-medium text-paper hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "…" : "Mark paid"}
      </button>
      {error && <span className="text-[10.5px] text-ink">{error}</span>}
    </div>
  );
}

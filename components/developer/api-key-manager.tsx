"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Plus, Shield } from "lucide-react";
import { createApiKey, revokeApiKey } from "@/lib/actions/api-keys";

export function NewApiKeyForm() {
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<"read" | "read-write">("read");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  const submit = () =>
    start(async () => {
      setError(null);
      const res = await createApiKey({ name: name.trim(), scopes });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setToken(res.token ?? null);
      setName("");
      router.refresh();
    });

  if (token) {
    return (
      <div className="rounded-2xl border border-ink bg-ink/5 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
          <Shield className="h-3.5 w-3.5" /> Copy this key — you won&apos;t see it again
        </div>
        <p className="mt-2 text-[12.5px] text-ink-muted">
          We only store a hash of the token. If you lose it, revoke and issue a new one.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
          <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink">
            {token}
          </code>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(token);
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              } catch {
                /* clipboard may be blocked */
              }
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink bg-ink px-2.5 text-[11.5px] font-medium text-paper hover:opacity-90"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setToken(null)}
          className="mt-4 text-[12px] font-medium text-ink-muted hover:text-ink"
        >
          Done · create another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="rounded-2xl border border-line bg-paper p-5"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        <KeyRound className="h-3.5 w-3.5" /> Issue a new key
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name (e.g. Laptop, CI, Webhook)"
          maxLength={60}
          required
          className="h-10 rounded-lg border border-line bg-paper px-3 text-[13px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
        />
        <select
          value={scopes}
          onChange={(e) => setScopes(e.target.value as "read" | "read-write")}
          className="h-10 rounded-lg border border-line bg-paper px-3 text-[13px] text-ink focus:border-ink focus:outline-none"
        >
          <option value="read">Read</option>
          <option value="read-write">Read & write</option>
        </select>
        <button
          type="submit"
          disabled={pending || name.trim().length === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink bg-ink px-4 text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          {pending ? "Issuing…" : "Issue key"}
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-ink">{error}</p>}
    </form>
  );
}

export function RevokeKeyButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await revokeApiKey(id);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.refresh();
          })
        }
        className="inline-flex h-7 items-center rounded-md border border-line px-2.5 text-[11px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink disabled:opacity-50"
      >
        {pending ? "…" : "Revoke"}
      </button>
      {error && <span className="text-[10.5px] text-ink">{error}</span>}
    </div>
  );
}

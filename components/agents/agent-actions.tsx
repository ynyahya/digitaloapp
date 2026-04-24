"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  installAgent,
  setAgentEnabled,
  uninstallAgent,
} from "@/lib/actions/agents";

export function InstallButton({ templateId }: { templateId: string }) {
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
            const res = await installAgent(templateId);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.refresh();
          })
        }
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink bg-ink px-3.5 text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Installing…" : "Install"}
      </button>
      {error && <span className="max-w-[220px] text-[11px] text-ink">{error}</span>}
    </div>
  );
}

export function EnableToggle({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) {
  const [pending, start] = useTransition();
  const [on, setOn] = useState(enabled);
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const next = !on;
          setOn(next); // optimistic
          const res = await setAgentEnabled(id, next);
          if (!res.ok) {
            setOn(!next); // rollback
            return;
          }
          router.refresh();
        })
      }
      className={
        "inline-flex h-7 w-12 items-center rounded-full border transition-colors " +
        (on
          ? "border-ink bg-ink justify-end"
          : "border-line bg-paper-soft justify-start")
      }
      aria-pressed={on}
      aria-label={on ? "Disable agent" : "Enable agent"}
    >
      <span
        className={
          "mx-0.5 h-5 w-5 rounded-full shadow-sm transition-colors " +
          (on ? "bg-paper" : "bg-ink")
        }
      />
    </button>
  );
}

export function UninstallButton({ id }: { id: string }) {
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
            const res = await uninstallAgent(id);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            router.push("/dashboard/agents");
            router.refresh();
          })
        }
        className="inline-flex h-8 items-center rounded-md border border-line px-2.5 text-[11.5px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink disabled:opacity-50"
      >
        {pending ? "…" : "Uninstall"}
      </button>
      {error && <span className="text-[11px] text-ink">{error}</span>}
    </div>
  );
}

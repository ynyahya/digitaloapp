"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  code,
  lang = "bash",
}: {
  code: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-paper-soft">
      <div className="flex items-center justify-between border-b border-line bg-paper px-3 py-1.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          {lang}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            } catch {
              /* clipboard may be blocked */
            }
          }}
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-line px-2 text-[10.5px] font-medium text-ink-muted hover:border-ink/30 hover:text-ink"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function LanguageTabs({
  tabs,
}: {
  tabs: Array<{ label: string; lang: string; code: string }>;
}) {
  return (
    <LanguageTabsClient tabs={tabs} />
  );
}

function LanguageTabsClient({
  tabs,
}: {
  tabs: Array<{ label: string; lang: string; code: string }>;
}) {
  // Intentionally avoiding state here so the component works as a server-
  // renderable default. The inner CodeBlock is still interactive for copy.
  return (
    <div className="flex flex-col gap-4">
      {tabs.map((t) => (
        <div key={t.label}>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            {t.label}
          </p>
          <CodeBlock code={t.code} lang={t.lang} />
        </div>
      ))}
    </div>
  );
}

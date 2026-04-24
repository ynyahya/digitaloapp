"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { saveProduct, type ProductFormInput } from "@/lib/actions/products";

type LicenseDraft = {
  id?: string;
  name: string;
  priceCents: number;
  description: string;
  perks: string[];
};

type IncludedDraft = { title: string; description: string };

type Initial = {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  type: "ONE_TIME" | "SUBSCRIPTION" | "BUNDLE";
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  bestSeller: boolean;
  instantDelivery: boolean;
  lifetimeUpdates: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  licenses: LicenseDraft[];
  included: IncludedDraft[];
};

const EMPTY_LICENSE: LicenseDraft = {
  name: "Personal License",
  priceCents: 4900,
  description: "For individual use — one user, one active project.",
  perks: ["All source files", "Lifetime updates", "Email support"],
};

export function ProductEditor({
  initial,
  mode,
}: {
  initial: Initial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [tagline, setTagline] = useState(initial.tagline);
  const [description, setDescription] = useState(initial.description);
  const [priceCents, setPriceCents] = useState(initial.priceCents);
  const [compareAtCents, setCompareAtCents] = useState<number | null>(
    initial.compareAtCents,
  );
  const [bestSeller, setBestSeller] = useState(initial.bestSeller);
  const [instantDelivery, setInstantDelivery] = useState(initial.instantDelivery);
  const [lifetimeUpdates, setLifetimeUpdates] = useState(initial.lifetimeUpdates);
  const [licenses, setLicenses] = useState<LicenseDraft[]>(
    initial.licenses.length ? initial.licenses : [EMPTY_LICENSE],
  );
  const [included, setIncluded] = useState<IncludedDraft[]>(
    initial.included.length
      ? initial.included
      : [
          { title: "Full source files", description: "Components, hooks, utils." },
          { title: "Production-ready", description: "Typed, tested, documented." },
        ],
  );

  function submit(publish: boolean) {
    setError(null);
    setSaved(false);
    const payload: ProductFormInput = {
      id: initial.id,
      title: title.trim(),
      slug: slug.trim() || undefined,
      tagline,
      description,
      type: initial.type,
      priceCents: Math.max(0, Math.round(priceCents)),
      compareAtCents: compareAtCents,
      currency: initial.currency,
      gallery: [],
      bestSeller,
      instantDelivery,
      lifetimeUpdates,
      licenses: licenses.map((l) => ({
        id: l.id,
        name: l.name,
        priceCents: Math.max(0, Math.round(l.priceCents)),
        description: l.description,
        perks: l.perks.filter((p) => p.trim().length > 0),
      })),
      included: included.filter((i) => i.title.trim().length > 0),
      publish,
    };

    startTransition(async () => {
      const res = await saveProduct(null, payload);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSaved(true);
      if (mode === "create") {
        router.push(`/dashboard/products/${res.id}?saved=1`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/products"
          className="text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          ← Products
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              {mode === "create" ? "New product" : "Edit product"}
            </p>
            <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
              {title || "Untitled product"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {initial.id && (
              <Button variant="secondary" asChild>
                <Link href={`/p/${slug || initial.slug}`} target="_blank">
                  <Eye className="h-4 w-4" /> Preview
                </Link>
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => submit(false)}
              disabled={pending}
            >
              {pending ? "Saving…" : "Save draft"}
            </Button>
            <Button onClick={() => submit(true)} disabled={pending}>
              {pending ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-ink/20 bg-paper-soft px-4 py-2.5 text-[12.5px] text-ink">
          {error}
        </div>
      )}
      {saved && !error && (
        <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper-soft px-4 py-2.5 text-[12.5px] text-ink-muted">
          <Check className="h-3.5 w-3.5" /> Saved
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <Section title="Basics">
            <LabeledInput
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="SaaS Starter Kit"
              autoFocus
            />
            <LabeledInput
              label="Tagline"
              value={tagline}
              onChange={setTagline}
              placeholder="Production-grade SaaS boilerplate with auth, billing, and analytics."
            />
            <LabeledInput
              label="Slug"
              value={slug}
              onChange={setSlug}
              placeholder="auto-generated from title"
              hint={slug ? `/p/${slug}` : "Leave blank to auto-generate from the title"}
            />
            <LabeledTextarea
              label="Description"
              value={description}
              onChange={setDescription}
              rows={6}
              placeholder="Long-form description. Plain text or markdown."
            />
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledMoney
                label="Base price"
                cents={priceCents}
                onChange={setPriceCents}
              />
              <LabeledMoney
                label="Compare-at (optional)"
                cents={compareAtCents ?? 0}
                onChange={(v) => setCompareAtCents(v || null)}
                hint="Shown with strikethrough if higher than the base price."
              />
            </div>
          </Section>

          <Section title="Licenses">
            <div className="flex flex-col gap-4">
              {licenses.map((l, i) => (
                <LicenseCard
                  key={i}
                  license={l}
                  onChange={(next) =>
                    setLicenses((arr) => arr.map((x, idx) => (idx === i ? next : x)))
                  }
                  onRemove={
                    licenses.length > 1
                      ? () => setLicenses((arr) => arr.filter((_, idx) => idx !== i))
                      : undefined
                  }
                />
              ))}
              <button
                type="button"
                onClick={() => setLicenses((arr) => [...arr, { ...EMPTY_LICENSE }])}
                className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-line px-3.5 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                <Plus className="h-3.5 w-3.5" /> Add license
              </button>
            </div>
          </Section>

          <Section title="What's included">
            <div className="flex flex-col gap-3">
              {included.map((i, idx) => (
                <div key={idx} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                  <input
                    value={i.title}
                    onChange={(e) =>
                      setIncluded((arr) =>
                        arr.map((x, j) => (j === idx ? { ...x, title: e.target.value } : x)),
                      )
                    }
                    placeholder="Title"
                    className={inputCls}
                  />
                  <input
                    value={i.description}
                    onChange={(e) =>
                      setIncluded((arr) =>
                        arr.map((x, j) =>
                          j === idx ? { ...x, description: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Short description"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() =>
                      setIncluded((arr) => arr.filter((_, j) => j !== idx))
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setIncluded((arr) => [...arr, { title: "", description: "" }])
                }
                className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-line px-3.5 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </button>
            </div>
          </Section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Section title="Status">
            <p className="text-[13px] text-ink-muted">
              Current: <StatusPill status={initial.status} />
            </p>
            <p className="mt-2 text-[12px] text-ink-muted">
              &quot;Save draft&quot; keeps it private. &quot;Publish&quot; makes it visible on your
              storefront and available for checkout.
            </p>
          </Section>

          <Section title="Storefront">
            <Toggle
              label="Mark as best seller"
              value={bestSeller}
              onChange={setBestSeller}
            />
            <Toggle
              label="Instant delivery"
              value={instantDelivery}
              onChange={setInstantDelivery}
            />
            <Toggle
              label="Lifetime updates"
              value={lifetimeUpdates}
              onChange={setLifetimeUpdates}
            />
          </Section>

          <Section title="Price preview">
            <div className="flex items-baseline gap-3">
              <span className="text-[26px] font-semibold tracking-tight">
                {formatCurrency(priceCents)}
              </span>
              {compareAtCents && compareAtCents > priceCents && (
                <span className="text-[14px] font-medium text-ink-muted line-through">
                  {formatCurrency(compareAtCents)}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[12px] text-ink-muted">
              {licenses.length} license{licenses.length === 1 ? "" : "s"} ·{" "}
              {included.length} included item{included.length === 1 ? "" : "s"}
            </p>
          </Section>
        </aside>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Primitives
// ──────────────────────────────────────────────────────────────────

const inputCls =
  "h-10 w-full rounded-xl border border-line bg-paper px-3 text-[13px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {title}
      </p>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputCls}
      />
      {hint && <span className="text-[11.5px] text-ink-subtle">{hint}</span>}
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="rounded-xl border border-line bg-paper px-3 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}

function LabeledMoney({
  label,
  cents,
  onChange,
  hint,
}: {
  label: string;
  cents: number;
  onChange: (cents: number) => void;
  hint?: string;
}) {
  const dollars = (cents / 100).toFixed(2);
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[13px] text-ink-subtle">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={dollars}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onChange(Number.isFinite(v) ? Math.round(v * 100) : 0);
          }}
          className={cn(inputCls, "pl-6")}
        />
      </div>
      {hint && <span className="text-[11.5px] text-ink-subtle">{hint}</span>}
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 text-left text-[13px] text-ink transition-colors hover:border-ink/30"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          value ? "bg-ink" : "bg-paper-muted",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 translate-x-0.5 rounded-full bg-paper shadow transition-transform",
            value && "translate-x-[18px]",
          )}
        />
      </span>
    </button>
  );
}

function LicenseCard({
  license,
  onChange,
  onRemove,
}: {
  license: LicenseDraft;
  onChange: (next: LicenseDraft) => void;
  onRemove?: () => void;
}) {
  const dollars = (license.priceCents / 100).toFixed(2);
  return (
    <div className="rounded-2xl border border-line bg-paper-soft p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_170px_auto]">
        <input
          value={license.name}
          onChange={(e) => onChange({ ...license, name: e.target.value })}
          placeholder="License name"
          className={inputCls}
        />
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[13px] text-ink-subtle">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={dollars}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              onChange({
                ...license,
                priceCents: Number.isFinite(v) ? Math.round(v * 100) : 0,
              });
            }}
            className={cn(inputCls, "pl-6")}
          />
        </div>
        {onRemove && (
          <button
            type="button"
            aria-label="Remove license"
            onClick={onRemove}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <textarea
        value={license.description}
        onChange={(e) => onChange({ ...license, description: e.target.value })}
        rows={2}
        placeholder="Short description of what this license covers"
        className="mt-3 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-[12.5px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
      />
      <div className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
          Perks
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {license.perks.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={p}
                onChange={(e) => {
                  const next = [...license.perks];
                  next[i] = e.target.value;
                  onChange({ ...license, perks: next });
                }}
                placeholder="e.g. Lifetime updates"
                className={inputCls}
              />
              <button
                type="button"
                aria-label="Remove perk"
                onClick={() =>
                  onChange({
                    ...license,
                    perks: license.perks.filter((_, j) => j !== i),
                  })
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...license, perks: [...license.perks, ""] })}
            className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-line px-3 py-1 text-[11.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Plus className="h-3 w-3" /> Add perk
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-ink text-paper",
    DRAFT: "bg-paper-soft text-ink-muted ring-1 ring-line",
    ARCHIVED: "bg-paper-muted text-ink-subtle",
  };
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

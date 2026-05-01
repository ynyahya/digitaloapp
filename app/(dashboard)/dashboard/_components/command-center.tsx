import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CommandHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon: Icon = Sparkles,
  accent = "from-lime/20 via-emerald-400/10 to-transparent",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon?: LucideIcon;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-night/80 p-6 text-chalk shadow-2xl shadow-black/30 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(180,243,0,0.16),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(124,92,255,0.16),transparent_34%)]" />
      <div className={cn("pointer-events-none absolute inset-0 opacity-80 bg-gradient-to-br", accent)} />
      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_420px]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
            <Icon className="h-3.5 w-3.5 text-lime" />
            {eyebrow}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-display-sm font-extrabold tracking-tight text-chalk">{title}</h1>
            <p className="max-w-2xl text-[15px] leading-7 text-chalk-muted">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {primaryHref && primaryLabel ? (
              <Button asChild className="h-11 rounded-2xl bg-lime px-5 text-[13px] font-bold text-night hover:bg-lime/90 lime-shadow">
                <Link href={primaryHref}>{primaryLabel}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Button asChild variant="outline" className="h-11 rounded-2xl border-white/[0.08] bg-white/[0.035] px-5 text-[13px] font-bold text-chalk hover:bg-white/[0.06]">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
        {children ? <div className="relative">{children}</div> : null}
      </div>
    </section>
  );
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  helper,
  tone = "lime",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper?: string;
  tone?: "lime" | "blue" | "violet" | "amber" | "rose" | "emerald";
}) {
  const tones = {
    lime: "bg-lime/10 text-lime border-lime/20",
    blue: "bg-blue-500/10 text-blue-300 border-blue-400/20",
    violet: "bg-violet-500/10 text-violet-300 border-violet-400/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-400/20",
    rose: "bg-rose-500/10 text-rose-300 border-rose-400/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  };

  return (
    <Card className="rounded-[24px] border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-lime/25">
      <CardContent className="p-5">
        <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-[25px] font-black leading-none tracking-tight text-chalk">{value}</p>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim">{label}</p>
        {helper ? <p className="mt-2 text-[12px] leading-5 text-chalk-muted">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}

export function WorkflowRail({
  title,
  items,
}: {
  title: string;
  items: { label: string; description: string; done?: boolean }[];
}) {
  return (
    <Card className="rounded-[28px] border-white/[0.08] bg-white/[0.035] shadow-none backdrop-blur-xl">
      <CardContent className="p-5">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">{title}</p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.label} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-night/60 p-3">
              <div className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold", item.done ? "border-lime/40 bg-lime/15 text-lime" : "border-white/[0.08] bg-white/[0.035] text-chalk-dim")}>
                {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <div>
                <p className="text-[13px] font-bold text-chalk">{item.label}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-chalk-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn(
      "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
      status === "PUBLISHED" || status === "PAID" || status === "COMPLETED" || status === "ACTIVE"
        ? "border border-lime/20 bg-lime/10 text-lime"
        : status === "PENDING" || status === "DRAFT"
        ? "border border-amber-300/20 bg-amber-300/10 text-amber-200"
        : "border border-rose-300/20 bg-rose-300/10 text-rose-200",
    )}>
      {status === "PUBLISHED" ? "Live" : status}
    </Badge>
  );
}

export function EmptyCommandState({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card className="rounded-[32px] border-white/[0.08] bg-night/70 shadow-2xl shadow-black/20">
      <CardContent className="flex flex-col items-center p-14 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.035]">
          <Icon className="h-9 w-9 text-lime" />
        </div>
        <h3 className="text-[22px] font-bold text-chalk">{title}</h3>
        <p className="mt-2 max-w-md text-[14px] leading-6 text-chalk-muted">{description}</p>
        <Button asChild className="mt-6 h-11 rounded-2xl bg-lime px-5 text-night hover:bg-lime/90">
          <Link href={href}>{label}<ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function PlaybookCard({
  icon: Icon,
  title,
  description,
  steps,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  steps: string[];
}) {
  return (
    <Card className="rounded-[28px] border-white/[0.08] bg-white/[0.035] shadow-none">
      <CardContent className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-night text-lime">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-[16px] font-bold text-chalk">{title}</h3>
        <p className="mt-2 text-[13px] leading-5 text-chalk-muted">{description}</p>
        <div className="mt-5 space-y-2">
          {steps.map((step) => (
            <div key={step} className="flex items-center gap-2 text-[12px] font-medium text-chalk-muted">
              <Circle className="h-2 w-2 fill-lime text-lime" />
              {step}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

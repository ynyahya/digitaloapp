import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PublicOfferingShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-night text-chalk", className)}>
      <div className="pointer-events-none fixed inset-0 bg-accent-glow opacity-50" />
      <div className="pointer-events-none fixed inset-0 grid-dark opacity-20 mask-radial-fade" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PublicHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon: Icon = Sparkles,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon?: LucideIcon;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.08]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(180,243,0,0.18),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(124,92,255,0.18),transparent_34%)]" />
      <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-eyebrow uppercase text-lime">
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </span>
          <h1 className="mt-6 max-w-4xl text-[46px] font-black leading-[0.95] tracking-[-0.055em] text-chalk md:text-[76px]">
            {title}
          </h1>
          {description ? <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-chalk-muted md:text-[20px]">{description}</p> : null}
          {meta ? <div className="mt-7 flex flex-wrap items-center gap-3 text-[13px] text-chalk-muted">{meta}</div> : null}
          {(primaryHref || secondaryHref) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryHref && primaryLabel ? (
                <Link href={primaryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow">
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              {secondaryHref && secondaryLabel ? (
                <Link href={secondaryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-6 text-[14px] font-bold text-chalk hover:bg-white/[0.06]">
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
        {children ? <div className="relative flex items-center">{children}</div> : null}
      </div>
    </section>
  );
}

export function PublicSection({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-[1240px] px-6 py-14 md:px-8 md:py-20", className)}>
      <div className="mb-8 max-w-2xl">
        {eyebrow ? <p className="text-eyebrow uppercase text-lime">{eyebrow}</p> : null}
        <h2 className="mt-3 text-[32px] font-black tracking-[-0.045em] text-chalk md:text-[44px]">{title}</h2>
        {description ? <p className="mt-3 text-[15px] leading-7 text-chalk-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function PublicGlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl", className)}>{children}</div>;
}

export function PublicMetricPill({ icon: Icon = CheckCircle2, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
      <Icon className="h-4 w-4 text-lime" />
      {children}
    </span>
  );
}

export function PublicStickyCTA({ label, href, detail }: { label: string; href: string; detail?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-night/90 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-[680px] items-center gap-3">
        {detail ? <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-chalk-muted">{detail}</p> : <div className="flex-1" />}
        <Link href={href} className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-lime px-5 text-[13px] font-bold text-night">
          {label}
        </Link>
      </div>
    </div>
  );
}

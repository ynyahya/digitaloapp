"use client";

import {
  CheckCircle2,
  AlertCircle,
  Rocket,
  ShieldCheck,
  Globe,
  Zap,
  Search,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/hooks/use-studio-state";
import { publishProduct } from "@/lib/actions/studio";
import { useState } from "react";
import { LaunchShareKit } from "./launch-share-kit";

export function LaunchCenter() {
  const { product, setField } = useStudio();
  const [isPublishing, setIsPublishing] = useState(false);
  const [showShareKit, setShowShareKit] = useState(false);

  const checks = [
    { label: "Product title and tagline", done: !!product.title && !!product.tagline },
    {
      label: "Detailed product description",
      done: !!product.description && product.description.length > 50,
    },
    {
      label: "Pricing tiers and licensing",
      done: !!(product.licenses && product.licenses.length > 0),
    },
    { label: "Product cover image", done: !!product.coverImage },
    {
      label: "Digital assets uploaded",
      done: !!((product.files && product.files.length > 0) || !product.instantDelivery),
    },
    {
      label: "SEO meta descriptions",
      done: !!product.metaTitle && !!product.metaDescription,
    },
  ];

  const completedCount = checks.filter((c) => c.done).length;
  const score = Math.round((completedCount / checks.length) * 100);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishProduct(product.id);
      setField("status", "PUBLISHED");
      setShowShareKit(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (showShareKit) {
    return <LaunchShareKit product={product} onBack={() => setShowShareKit(false)} />;
  }

  return (
    <div className="min-h-screen bg-paper-soft pt-24 pb-40">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 space-y-8">
        {/* Readiness Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-ink text-paper shadow-float">
          <div className="absolute inset-0 bg-mono-radial opacity-30 pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] items-center gap-10 p-10 md:p-12">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper/10 border border-paper/15">
                <Rocket className="h-3.5 w-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {score === 100 ? "Ready for takeoff" : "Pre-flight check"}
                </span>
              </div>
              <h2 className="text-[32px] md:text-[36px] font-bold tracking-tight leading-tight">
                Launch Command Center
              </h2>
              <p className="text-paper/65 text-[14.5px] leading-relaxed max-w-lg">
                Your product is {score}% ready to launch.{" "}
                {score < 100
                  ? "Complete the remaining steps to optimize for conversions."
                  : "Everything looks perfect. You're ready to go live."}
              </p>
            </div>

            <div className="flex md:flex-col items-center gap-4 md:gap-3">
              <div className="relative h-28 w-28 md:h-32 md:w-32">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-paper/10"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={(2 * Math.PI * 46) * (1 - score / 100)}
                    pathLength={2 * Math.PI * 46}
                    className={cn(
                      "transition-all duration-1000",
                      score === 100 ? "text-emerald-400" : "text-paper"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[28px] md:text-[30px] font-bold tracking-tight tabular-nums">
                    {score}%
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-paper/50 uppercase tracking-[0.2em]">
                Readiness Score
              </span>
            </div>
          </div>
        </section>

        {/* Audit Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AuditCard
            icon={ShieldCheck}
            label="Trust & Security"
            status="Optimized"
            score="100%"
            tone="positive"
            desc="SSL, Secure Checkout, and Terms of Service are all configured."
          />
          <AuditCard
            icon={Zap}
            label="Performance"
            status={score > 80 ? "Excellent" : "Good"}
            score={score > 80 ? "98%" : "85%"}
            tone="positive"
            desc="Asset sizes are optimized for fast global delivery."
          />
          <AuditCard
            icon={Search}
            label="SEO & Discoverability"
            status={product.metaDescription ? "Optimized" : "Action Required"}
            score={product.metaDescription ? "100%" : "0%"}
            tone={product.metaDescription ? "positive" : "warning"}
            desc={
              product.metaDescription
                ? "Meta descriptions and search indexing are active."
                : "Add a meta description to improve search ranking."
            }
          />
        </section>

        {/* Final Checklist */}
        <section className="bg-paper border border-line rounded-3xl shadow-soft overflow-hidden">
          <div className="px-8 py-6 border-b border-line flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.2em]">
                Final Validation
              </p>
              <h3 className="text-[17px] font-bold text-ink tracking-tight">
                Pre-launch checklist
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12.5px] text-ink-muted tabular-nums">
                {completedCount} of {checks.length}
              </span>
              <div className="h-1.5 w-24 rounded-full bg-paper-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    score === 100 ? "bg-emerald-500" : "bg-ink"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>

          <ul className="divide-y divide-line/70">
            {checks.map((check, i) => (
              <ValidationItem key={i} label={check.label} done={check.done} />
            ))}
          </ul>

          <div className="px-8 py-6 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-paper-soft">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-ink-subtle" />
              </div>
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.18em]">
                  Production Domain
                </p>
                <p className="text-[13px] font-mono text-ink truncate">
                  digitalo.app/p/{product.customSlug || product.slug}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {product.status === "PUBLISHED" && (
                <button
                  type="button"
                  onClick={() => setShowShareKit(true)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-ink hover:gap-2 transition-all"
                >
                  View share kit
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              <Button
                onClick={handlePublish}
                disabled={isPublishing || score < 50}
                className={cn(
                  "h-12 px-7 rounded-xl font-bold shadow-float group transition-all",
                  product.status === "PUBLISHED"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-ink text-paper hover:opacity-90",
                  (isPublishing || score < 50) && "opacity-60 cursor-not-allowed"
                )}
              >
                {isPublishing
                  ? "Publishing…"
                  : product.status === "PUBLISHED"
                  ? "Re-publish Updates"
                  : "Deploy to Production"}
                {!isPublishing && (
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuditCard({
  icon: Icon,
  label,
  status,
  score,
  tone,
  desc,
}: {
  icon: LucideIcon;
  label: string;
  status: string;
  score: string;
  tone: "positive" | "warning";
  desc: string;
}) {
  const warning = tone === "warning";
  return (
    <div className="p-6 rounded-3xl border border-line bg-paper hover:border-line-strong hover:shadow-card transition-all group flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div
          className={cn(
            "h-11 w-11 rounded-2xl flex items-center justify-center transition-colors",
            warning
              ? "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-paper-muted text-ink-subtle group-hover:bg-ink group-hover:text-paper"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-[15px] font-bold tabular-nums",
              warning ? "text-amber-600" : "text-emerald-600"
            )}
          >
            {score}
          </p>
          <p className="text-[9.5px] font-bold text-ink-subtle uppercase tracking-[0.18em]">
            {status}
          </p>
        </div>
      </div>
      <h4 className="text-[14.5px] font-bold text-ink mb-1.5">{label}</h4>
      <p className="text-[12px] text-ink-muted leading-relaxed mb-5 flex-1">
        {desc}
      </p>
      <button className="inline-flex items-center gap-1 text-[11.5px] font-bold text-ink hover:gap-1.5 transition-all self-start">
        {warning ? "Fix Now" : "View Report"}
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function ValidationItem({ label, done }: { label: string; done: boolean }) {
  return (
    <li className="px-8 py-4 flex items-center justify-between group/check hover:bg-paper-soft/50 transition-colors">
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0",
            done
              ? "bg-emerald-500 text-paper"
              : "border-2 border-line group-hover/check:border-ink/30"
          )}
        >
          {done ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <AlertCircle className="h-3 w-3 text-ink-subtle opacity-0 group-hover/check:opacity-100 transition-opacity" />
          )}
        </div>
        <span
          className={cn(
            "text-[13.5px] transition-colors",
            done ? "text-ink font-medium" : "text-ink-muted"
          )}
        >
          {label}
        </span>
      </div>
      {!done && (
        <button className="inline-flex items-center gap-1 text-[11.5px] font-bold text-ink hover:gap-1.5 transition-all">
          Complete
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </li>
  );
}

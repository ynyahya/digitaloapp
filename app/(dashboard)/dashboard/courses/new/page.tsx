"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Loader2,
  Rocket,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCourseQuickstart } from "@/lib/actions/courses";
import { cn } from "@/lib/utils";

const LEVELS = [
  { key: "BEGINNER", label: "Beginner", detail: "Foundation-first, friendly pacing" },
  { key: "INTERMEDIATE", label: "Intermediate", detail: "Practical projects and deeper systems" },
  { key: "ADVANCED", label: "Advanced", detail: "Expert workflows and architecture" },
];

const FORMATS = [
  { key: "SELF_PACED", label: "Self-paced", detail: "Evergreen course with on-demand lessons" },
  { key: "COHORT", label: "Cohort", detail: "Time-boxed class with group progress" },
  { key: "WORKSHOP", label: "Workshop", detail: "Focused replay or intensive session" },
];

function buildOutline(outcome: string, format: string) {
  const promise = outcome || "achieve the promised transformation";
  const lastModule = format === "WORKSHOP" ? "Implementation sprint" : "Launch and next steps";
  return [
    {
      title: "Foundation and context",
      lessons: [
        { title: "Welcome and course roadmap", contentType: "TEXT" },
        { title: `Define your goal: ${promise}`, contentType: "TEXT" },
      ],
    },
    {
      title: "Core workflow",
      lessons: [
        { title: "Step-by-step operating system", contentType: "VIDEO" },
        { title: "Common mistakes and decision rules", contentType: "TEXT" },
      ],
    },
    {
      title: lastModule,
      lessons: [
        { title: "Apply the framework to a real project", contentType: "ASSIGNMENT" },
        { title: "Final checklist and next action", contentType: "TEXT" },
      ],
    },
  ];
}

export default function NewCourseBlueprint() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    title: "",
    outcome: "",
    audience: "",
    level: "BEGINNER",
    format: "SELF_PACED",
    pricingModel: "ONE_TIME",
  });

  const progress = useMemo(() => Math.round((step / 4) * 100), [step]);
  const canContinue = step === 1
    ? Boolean(data.title.trim() && data.outcome.trim())
    : step === 2
    ? Boolean(data.audience.trim())
    : true;

  const submit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const course = await createCourseQuickstart({
        title: data.title.trim(),
        subtitle: data.outcome.trim(),
        audience: data.audience.trim(),
        outcomes: data.outcome.trim(),
        level: data.level,
        format: data.format,
        pricingModel: data.pricingModel,
        priceCents: data.pricingModel === "FREE" ? 0 : 99000,
        currency: "IDR",
        outline: buildOutline(data.outcome.trim(), data.format),
        thumbnailColor: "#7C5CFF",
      });
      router.push(`/dashboard/courses/${course.slug}/builder`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night text-chalk">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(124,92,255,0.2),transparent_34%),radial-gradient(circle_at_86%_16%,rgba(180,243,0,0.16),transparent_34%)]" />
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.08] bg-night/90 px-4 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-lime text-night lime-shadow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[13px] font-black text-chalk">Course Blueprint</p>
            <p className="text-[11px] text-chalk-dim">Strategy → curriculum → builder</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="icon" className="rounded-full text-chalk-muted hover:bg-white/[0.06] hover:text-chalk">
          <Link href="/dashboard/courses"><X className="h-5 w-5" /></Link>
        </Button>
      </header>

      <main className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10">
        <section className="flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">
              <span>Step {step} / 4</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 1 ? (
            <div className="max-w-3xl space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                  <Target className="h-3.5 w-3.5" /> Outcome first
                </span>
                <h1 className="mt-5 text-[44px] font-black leading-[0.96] tracking-[-0.05em] md:text-[76px]">What transformation are you selling?</h1>
                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-chalk-muted">A top-tier course starts with a promised outcome, not random lessons. Define the student transformation first.</p>
              </div>
              <Field label="Course name">
                <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} autoFocus className="h-14 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-4 text-[16px] font-bold text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="e.g. Launch Your First Paid Digital Product" />
              </Field>
              <Field label="Student outcome">
                <textarea value={data.outcome} onChange={(e) => setData({ ...data, outcome: e.target.value })} className="min-h-28 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Students will be able to package, price, and publish their first digital product." />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="max-w-3xl space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                  <Users className="h-3.5 w-3.5" /> Ideal student
                </span>
                <h1 className="mt-5 text-[44px] font-black leading-[0.96] tracking-[-0.05em] md:text-[70px]">Who is it specifically for?</h1>
                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-chalk-muted">Narrow audiences convert better and make curriculum decisions easier.</p>
              </div>
              <Field label="Target audience">
                <textarea value={data.audience} onChange={(e) => setData({ ...data, audience: e.target.value })} autoFocus className="min-h-36 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Indie creators, freelancers, and founders who have expertise but do not know how to turn it into a paid course." />
              </Field>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="max-w-4xl space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                  <Layers3 className="h-3.5 w-3.5" /> Learning model
                </span>
                <h1 className="mt-5 text-[44px] font-black leading-[0.96] tracking-[-0.05em] md:text-[70px]">Choose the course architecture.</h1>
              </div>
              <ChoiceGrid title="Level" items={LEVELS} value={data.level} onChange={(level) => setData({ ...data, level })} />
              <ChoiceGrid title="Format" items={FORMATS} value={data.format} onChange={(format) => setData({ ...data, format })} />
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">Pricing model</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[{ key: "ONE_TIME", label: "Paid course", detail: "Start with IDR 99k and refine inside builder" }, { key: "FREE", label: "Free lead magnet", detail: "Use as audience builder or preview product" }].map((item) => (
                    <button key={item.key} type="button" onClick={() => setData({ ...data, pricingModel: item.key })} className={cn("rounded-[22px] border p-5 text-left transition", data.pricingModel === item.key ? "border-lime/35 bg-lime/10" : "border-white/[0.08] bg-white/[0.035] hover:border-lime/20")}> <p className="text-[15px] font-black text-chalk">{item.label}</p><p className="mt-1 text-[12px] leading-5 text-chalk-muted">{item.detail}</p></button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-lime">
                <Rocket className="h-3.5 w-3.5" /> Generate studio
              </span>
              <h1 className="mt-5 text-[44px] font-black leading-[0.96] tracking-[-0.05em] md:text-[72px]">Ready to build the course OS.</h1>
              <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><CheckCircle2 className="h-6 w-6" /></div>
                  <div>
                    <h2 className="text-[18px] font-black text-chalk">{data.title}</h2>
                    <p className="mt-2 text-[13px] leading-6 text-chalk-muted">{data.outcome}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-chalk-muted">
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{data.level}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{data.format}</span>
                      <span className="rounded-full bg-white/[0.06] px-3 py-1">{data.pricingModel}</span>
                    </div>
                  </div>
                </div>
              </div>
              {error ? <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</div> : null}
            </div>
          ) : null}

          <div className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-6">
            <Button type="button" variant="outline" className="rounded-2xl border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.06]" onClick={() => step === 1 ? router.push("/dashboard/courses") : setStep(step - 1)} disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button type="button" className="rounded-2xl bg-lime text-night hover:bg-lime/90" disabled={!canContinue} onClick={() => setStep(step + 1)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" className="min-w-[160px] rounded-2xl bg-lime text-night hover:bg-lime/90" disabled={isSubmitting} onClick={submit}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate builder
              </Button>
            )}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Pro course standard</p>
            {[
              { icon: Target, label: "Outcome before outline", detail: "Every lesson should move toward one transformation." },
              { icon: Users, label: "Specific audience", detail: "Niche messaging beats generic course promises." },
              { icon: BookOpen, label: "3-module starter", detail: "TESKEL generates a clean curriculum foundation." },
              { icon: Zap, label: "Launch-ready defaults", detail: "Pricing, format, and readiness are prepared from day one." },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-night/70 p-4">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <div><p className="text-[12px] font-black text-chalk">{item.label}</p><p className="mt-1 text-[11px] leading-5 text-chalk-muted">{item.detail}</p></div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="text-[12px] font-bold text-chalk">{label}</span>{children}</label>;
}

function ChoiceGrid({ title, items, value, onChange }: { title: string; items: typeof LEVELS; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-chalk-dim">{title}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <button key={item.key} type="button" onClick={() => onChange(item.key)} className={cn("rounded-[22px] border p-5 text-left transition", value === item.key ? "border-lime/35 bg-lime/10" : "border-white/[0.08] bg-white/[0.035] hover:border-lime/20")}>
            <p className="text-[15px] font-black text-chalk">{item.label}</p>
            <p className="mt-1 text-[12px] leading-5 text-chalk-muted">{item.detail}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Box, Briefcase, Check, GraduationCap, Loader2, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createService } from "@/lib/actions/services";
import { createEvent } from "@/lib/actions/offerings";
import { createCourseQuickstart } from "@/lib/actions/courses";
import { cn } from "@/lib/utils";

type OfferingType = "product" | "course" | "event" | "service";

type Template = {
  id: string;
  label: string;
  description: string;
  goal: string;
};

const TYPES: Array<{ id: OfferingType; label: string; description: string; icon: typeof Box; templates: Template[] }> = [
  {
    id: "product",
    label: "Product",
    description: "Sell downloads, templates, SaaS kits, ebooks, or bundles.",
    icon: Box,
    templates: [
      { id: "digital-download", label: "Digital download", description: "A single asset or file customers can buy instantly.", goal: "Launch a downloadable product with clear value and delivery." },
      { id: "saas-kit", label: "SaaS kit", description: "A template, boilerplate, or technical starter kit.", goal: "Package a technical asset for founders or builders." },
      { id: "ebook", label: "Ebook", description: "A written guide, playbook, or knowledge product.", goal: "Turn expertise into a paid guide." },
    ],
  },
  {
    id: "course",
    label: "Course",
    description: "Build lessons, modules, student previews, and a launch-ready course.",
    icon: GraduationCap,
    templates: [
      { id: "mini-course", label: "Mini course", description: "A focused course with a short transformation.", goal: "Teach one outcome quickly." },
      { id: "self-paced", label: "Self-paced", description: "A structured course students can complete anytime.", goal: "Build a complete learning path." },
      { id: "workshop-replay", label: "Workshop replay", description: "Package a live session recording with resources.", goal: "Sell a replay with practical takeaways." },
    ],
  },
  {
    id: "event",
    label: "Event",
    description: "Launch webinars, workshops, masterclasses, and community events.",
    icon: Ticket,
    templates: [
      { id: "webinar", label: "Webinar", description: "A lead-gen or paid online presentation.", goal: "Host a clear online session with registration." },
      { id: "workshop", label: "Workshop", description: "A practical live session with exercises.", goal: "Help attendees complete a real task." },
      { id: "masterclass", label: "Masterclass", description: "A premium live teaching experience.", goal: "Deliver a high-value lesson live." },
    ],
  },
  {
    id: "service",
    label: "Service",
    description: "Package consultations, audits, coaching, design, or development offers.",
    icon: Briefcase,
    templates: [
      { id: "consultation", label: "Consultation", description: "A booked expert session with a clear result.", goal: "Sell focused expert advice." },
      { id: "audit", label: "Audit", description: "Review something and deliver recommendations.", goal: "Create a diagnostic service package." },
      { id: "build-package", label: "Build package", description: "A done-for-you delivery package.", goal: "Sell a scoped implementation service." },
    ],
  },
];

function starterDescription(type: OfferingType, template: Template, goal: string) {
  return `${template.label}: ${template.description}\n\nGoal: ${goal || template.goal}\n\nWhat buyers get:\n- Clear outcome\n- Practical deliverables\n- Launch-ready next steps`;
}

export function CreateWizardClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<OfferingType | null>(null);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedType = TYPES.find((item) => item.id === type) ?? null;
  const selectedTemplate = selectedType?.templates.find((item) => item.id === templateId) ?? selectedType?.templates[0] ?? null;
  const canContinue = step === 1 ? Boolean(type) : step === 2 ? Boolean(name.trim()) : Boolean(selectedTemplate);
  const progress = useMemo(() => Math.round((step / 4) * 100), [step]);

  async function createDraft() {
    if (!type || !selectedTemplate || !name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    const description = starterDescription(type, selectedTemplate, goal);
    try {
      if (type === "service") {
        const service = await createService({ title: name.trim(), description, category: selectedTemplate.label, priceCents: 0, currency: "IDR", deliveryDays: 7, revisions: 2 });
        router.push(`/dashboard/services/${service.slug}/builder`);
        return;
      }
      if (type === "event") {
        const event = await createEvent({ title: name.trim(), description, locationType: "ONLINE", timezone: "Asia/Jakarta", priceCents: 0, currency: "IDR" });
        router.push(`/dashboard/events/${event.slug}/builder`);
        return;
      }
      if (type === "course") {
        const course = await createCourseQuickstart({
          title: name.trim(),
          subtitle: goal || selectedTemplate.goal,
          outcomes: goal || selectedTemplate.goal,
          level: "BEGINNER",
          audience: goal || selectedTemplate.goal,
        });
        router.push(`/dashboard/courses/${course.slug}/builder`);
        return;
      }
      const res = await fetch("/api/studio/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name.trim(), description, tagline: selectedTemplate.goal }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const product = await res.json();
      router.push(`/dashboard/products/${product.slug}/builder`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create draft");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden rounded-[28px] border border-white/[0.08] bg-night-raised p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />
        <div className="absolute inset-0 grid-dark-fine opacity-30" />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-eyebrow uppercase text-lime">
            <Sparkles className="h-3.5 w-3.5" /> Creator launch workspace
          </span>
          <span className="text-[12px] font-bold text-chalk-muted">Step {step} / 4</span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-lime transition-all" style={{ width: `${progress}%` }} /></div>

        <div className="mt-10">
          {step === 1 ? (
            <div>
              <h1 className="max-w-3xl text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-chalk md:text-[72px]">What are you creating?</h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-chalk-muted md:text-[17px]">Pick an offering type and BuilderOS will generate the right starter draft.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {TYPES.map((item) => {
                  const Icon = item.icon;
                  const active = type === item.id;
                  return (
                    <button key={item.id} type="button" onClick={() => { setType(item.id); setTemplateId(item.templates[0].id); }} className={cn("rounded-[24px] border p-5 text-left transition", active ? "border-lime/35 bg-lime/10" : "border-white/[0.08] bg-white/[0.035] hover:border-lime/20 hover:bg-white/[0.055]")}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><Icon className="h-6 w-6" /></div>
                      <h2 className="mt-5 text-[19px] font-black tracking-[-0.03em] text-chalk">{item.label}</h2>
                      <p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="max-w-2xl">
              <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-chalk md:text-[64px]">Name the launch.</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-chalk-muted">Use a clear name. You can refine positioning inside the builder.</p>
              <div className="mt-8 space-y-4">
                <label className="block space-y-2"><span className="text-[12px] font-bold text-chalk">Offering name</span><input value={name} onChange={(e) => setName(e.target.value)} autoFocus className="h-14 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-4 text-[16px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Landing page audit for SaaS founders" /></label>
                <label className="block space-y-2"><span className="text-[12px] font-bold text-chalk">Goal</span><textarea value={goal} onChange={(e) => setGoal(e.target.value)} className="min-h-28 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-4 py-3 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Help founders improve conversion before launch" /></label>
              </div>
            </div>
          ) : null}

          {step === 3 && selectedType ? (
            <div>
              <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-chalk md:text-[64px]">Choose a starter template.</h1>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {selectedType.templates.map((template) => {
                  const active = selectedTemplate?.id === template.id;
                  return <button key={template.id} type="button" onClick={() => setTemplateId(template.id)} className={cn("rounded-[24px] border p-5 text-left transition", active ? "border-lime/35 bg-lime/10" : "border-white/[0.08] bg-white/[0.035] hover:border-lime/20 hover:bg-white/[0.055]")}><p className="text-[16px] font-black text-chalk">{template.label}</p><p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">{template.description}</p><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-lime">{template.goal}</p></button>;
                })}
              </div>
            </div>
          ) : null}

          {step === 4 && selectedType && selectedTemplate ? (
            <div className="max-w-3xl">
              <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-chalk md:text-[64px]">Generate your draft.</h1>
              <div className="mt-8 rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-6">
                <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><Check className="h-6 w-6" /></div><div><p className="text-[18px] font-black text-chalk">{name}</p><p className="mt-1 text-[13px] text-chalk-muted">{selectedType.label} · {selectedTemplate.label}</p><p className="mt-4 text-[13px] leading-relaxed text-chalk-muted">{goal || selectedTemplate.goal}</p></div></div>
              </div>
              {error ? <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</div> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-6">
          <Button type="button" variant="outline" className="rounded-2xl" onClick={() => step === 1 ? router.push("/dashboard") : setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
          {step < 4 ? <Button type="button" className="rounded-2xl" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue <ArrowRight className="h-4 w-4" /></Button> : <Button type="button" className="rounded-2xl" disabled={isSubmitting} onClick={createDraft}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate draft</Button>}
        </div>
      </div>
    </div>
  );
}

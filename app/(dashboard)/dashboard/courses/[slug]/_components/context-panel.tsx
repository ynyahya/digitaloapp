"use client";

import { useCourseStudio } from "@/hooks/use-course-studio";
import {
  Clock,
  Globe,
  Lock,
  Eye,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Link2,
  Calendar,
  Users,
  Hash,
} from "lucide-react";

export function ContextPanel() {
  const { activeLesson, setLessonField, course, setCourseField, state } = useCourseStudio();

  if (state.activeTab === "overview") {
    return <CourseOverviewPanel />;
  }

  if (state.activeTab === "design") {
    return <DesignPanel />;
  }

  if (state.activeTab === "settings") {
    return <CourseSettingsPanel />;
  }

  // Curriculum tab: show lesson settings
  if (!activeLesson) {
    return (
      <div className="w-[300px] border-l border-white/[0.08] bg-night flex flex-col shrink-0 h-full justify-center items-center text-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.035] border border-white/[0.08] flex items-center justify-center mb-3">
          <Eye className="h-5 w-5 text-chalk-dim" />
        </div>
        <p className="text-[12px] font-medium text-chalk-muted">Select a lesson</p>
        <p className="text-[10px] text-chalk-muted mt-1">Click a lesson from the curriculum to edit its settings</p>
      </div>
    );
  }

  return (
    <div className="w-[300px] border-l border-white/[0.08] bg-night flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-white/[0.08]">
        <h2 className="text-[13px] font-semibold text-chalk">Lesson Settings</h2>
        <p className="text-[10px] text-chalk-muted mt-0.5">{activeLesson.title}</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Status */}
        <Section title="Status">
          <div className="space-y-2">
            <ToggleOption
              active={activeLesson.isPublished}
              activeLabel="Published"
              inactiveLabel="Draft"
              activeDesc="Visible to enrolled students"
              inactiveDesc="Hidden from students"
              activeColor="emerald"
              onChange={(v) => setLessonField(activeLesson.id, "isPublished", v)}
            />
          </div>
        </Section>

        {/* Duration */}
        <Section title="Duration">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-chalk-muted" />
            <input
              type="number"
              placeholder="Minutes"
              value={activeLesson.durationMin || ""}
              onChange={(e) =>
                setLessonField(
                  activeLesson.id,
                  "durationMin",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
            />
          </div>
        </Section>

        {/* Access */}
        <Section title="Access">
          <div className="space-y-2">
            <ToggleOption
              active={activeLesson.isFree}
              activeLabel="Free Preview"
              inactiveLabel="Paid Only"
              activeDesc="Available without enrollment"
              inactiveDesc="Enrollment required"
              activeColor="emerald"
              onChange={(v) => setLessonField(activeLesson.id, "isFree", v)}
            />
          </div>
        </Section>

        {/* Drip Release */}
        <Section title="Drip Release">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-medium text-chalk-muted">
              <Calendar className="h-3.5 w-3.5" />
              Days after enrollment
            </label>
            <input
              type="number"
              placeholder="0 (immediate)"
              value={activeLesson.dripDays || ""}
              onChange={(e) =>
                setLessonField(
                  activeLesson.id,
                  "dripDays",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
            />
          </div>
        </Section>

        {/* Prerequisites */}
        <Section title="Prerequisites">
          <div className="text-[11px] text-chalk-muted">
            Select lessons that must be completed first.
          </div>
          <button className="w-full mt-2 h-9 rounded-lg border border-dashed border-white/[0.08] text-[11px] font-medium text-chalk-muted hover:border-lime/50 hover:text-lime transition-all">
            + Add prerequisite
          </button>
        </Section>

        {/* SEO */}
        <Section title="Lesson SEO">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Meta title (optional)"
              className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
            />
            <textarea
              placeholder="Meta description…"
              rows={2}
              className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-none"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 pb-4 border-b border-white/[0.08] last:border-none">
      <h3 className="text-[10px] font-bold text-chalk-muted uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function ToggleOption({
  active,
  activeLabel,
  inactiveLabel,
  activeDesc,
  inactiveDesc,
  activeColor,
  onChange,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeDesc: string;
  inactiveDesc: string;
  activeColor: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className={`flex items-start gap-3 cursor-pointer group p-2 rounded-lg transition-colors ${
          active ? "bg-emerald-500/10" : "hover:bg-white/[0.035]"
        }`}
        onClick={() => onChange(true)}
      >
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            active
              ? `border-emerald-500 bg-emerald-500`
              : "border-white/[0.08] group-hover:border-emerald-400"
          }`}
        >
          {active && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
        </div>
        <div>
          <div className="text-[12px] font-semibold text-chalk">{activeLabel}</div>
          <div className="text-[10px] text-chalk-muted">{activeDesc}</div>
        </div>
      </label>

      <label
        className={`flex items-start gap-3 cursor-pointer group p-2 rounded-lg transition-colors ${
          !active ? "bg-white/[0.035]" : "hover:bg-white/[0.035]"
        }`}
        onClick={() => onChange(false)}
      >
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            !active
              ? "border-ink-muted bg-ink-muted"
              : "border-white/[0.08] group-hover:border-ink-muted"
          }`}
        >
          {!active && <Circle className="h-2.5 w-2.5 text-paper" />}
        </div>
        <div>
          <div className="text-[12px] font-semibold text-chalk">{inactiveLabel}</div>
          <div className="text-[10px] text-chalk-muted">{inactiveDesc}</div>
        </div>
      </label>
    </div>
  );
}

function CourseOverviewPanel() {
  const { course, setCourseField } = useCourseStudio();

  return (
    <div className="w-[300px] border-l border-white/[0.08] bg-night flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-white/[0.08]">
        <h2 className="text-[13px] font-semibold text-chalk">Course Plan</h2>
        <p className="mt-0.5 text-[10px] text-chalk-muted">Promise, audience, outcomes, and positioning.</p>
      </div>
      <div className="p-4 space-y-6">
        <Section title="Promise">
          <input
            type="text"
            placeholder="Short course subtitle"
            value={course.subtitle || ""}
            onChange={(e) => setCourseField("subtitle", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
          />
          <textarea
            value={course.description || ""}
            onChange={(e) => setCourseField("description", e.target.value)}
            placeholder="Write the strategic promise and why students should care."
            rows={4}
            className="w-full mt-2 p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Target audience">
          <textarea
            value={course.audience || ""}
            onChange={(e) => setCourseField("audience", e.target.value)}
            placeholder="Creators, founders, or operators who need a specific transformation."
            rows={4}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Learning outcomes">
          <p className="text-[10.5px] text-chalk-muted mb-2">One measurable outcome per line.</p>
          <textarea
            value={course.outcomes || ""}
            onChange={(e) => setCourseField("outcomes", e.target.value)}
            placeholder={"Package a clear offer\nBuild a launch-ready page\nPublish with confidence"}
            rows={5}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Requirements">
          <textarea
            value={course.requirements || ""}
            onChange={(e) => setCourseField("requirements", e.target.value)}
            placeholder="What students need before starting."
            rows={3}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>
      </div>
    </div>
  );
}

function CourseSettingsPanel() {
  const { course, setCourseField } = useCourseStudio();

  return (
    <div className="w-[300px] border-l border-white/[0.08] bg-night flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-white/[0.08]">
        <h2 className="text-[13px] font-semibold text-chalk">Course Settings</h2>
        <p className="mt-0.5 text-[10px] text-chalk-muted">Commerce, visibility, storefront, and SEO.</p>
      </div>
      <div className="p-4 space-y-6">
        <Section title="Classification">
          <select
            value={course.level}
            onChange={(e) => setCourseField("level", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={course.category || ""}
            onChange={(e) => setCourseField("category", e.target.value)}
            className="w-full mt-2 h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          />
        </Section>

        <Section title="Pricing">
          <select
            value={course.pricingModel}
            onChange={(e) => setCourseField("pricingModel", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          >
            <option value="FREE">Free</option>
            <option value="ONE_TIME">One-time</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
          {course.pricingModel !== "FREE" && (
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-chalk-muted">
                {course.currency === "IDR" ? "Rp" : "$"}
              </span>
              <input
                type="number"
                value={course.priceCents / 100}
                onChange={(e) => setCourseField("priceCents", (parseFloat(e.target.value) || 0) * 100)}
                className="w-full h-9 pl-8 pr-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
              />
            </div>
          )}
        </Section>

        <Section title="Visibility">
          <select
            value={course.visibility}
            onChange={(e) => setCourseField("visibility", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted</option>
          </select>
        </Section>

        <Section title="Storefront · What you'll learn">
          <p className="text-[10.5px] text-chalk-muted mb-2">One outcome per line. Shown on the landing page.</p>
          <textarea
            value={course.whatYouLearn || ""}
            onChange={(e) => setCourseField("whatYouLearn", e.target.value)}
            placeholder={"Ship a production Next.js app\nDeploy to Vercel with CI/CD"}
            rows={5}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Storefront · Who this is for">
          <p className="text-[10.5px] text-chalk-muted mb-2">One audience persona per line.</p>
          <textarea
            value={course.audience || ""}
            onChange={(e) => setCourseField("audience", e.target.value)}
            placeholder={"Junior devs leveling up to senior\nIndie hackers shipping their first SaaS"}
            rows={4}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Storefront · Requirements">
          <p className="text-[10.5px] text-chalk-muted mb-2">One requirement per line.</p>
          <textarea
            value={course.requirements || ""}
            onChange={(e) => setCourseField("requirements", e.target.value)}
            placeholder={"Basic JavaScript knowledge\nA computer with Node 18+"}
            rows={3}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Storefront · Guarantees">
          <p className="text-[10.5px] text-chalk-muted mb-2">Bullets shown next to the final pricing CTA. One per line. Leave empty for defaults.</p>
          <textarea
            value={course.guarantees || ""}
            onChange={(e) => setCourseField("guarantees", e.target.value)}
            placeholder={"Lifetime access\nCertificate of completion\n30-day money-back guarantee"}
            rows={4}
            className="w-full p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
        </Section>

        <Section title="Storefront · FAQ">
          <FaqEditor
            value={course.faqJson}
            onChange={(v) => setCourseField("faqJson", v)}
          />
        </Section>

        <Section title="Storefront · Trailer poster">
          <p className="text-[10.5px] text-chalk-muted mb-2">Image shown when trailer is paused. URL.</p>
          <input
            type="text"
            placeholder="https://…/poster.jpg"
            value={course.trailerPoster || ""}
            onChange={(e) => setCourseField("trailerPoster", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
          />
        </Section>

        <Section title="SEO">
          <input
            type="text"
            placeholder="Meta title"
            value={course.metaTitle || ""}
            onChange={(e) => setCourseField("metaTitle", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none"
          />
          <textarea
            placeholder="Meta description"
            rows={3}
            value={course.metaDescription || ""}
            onChange={(e) => setCourseField("metaDescription", e.target.value)}
            className="w-full mt-2 p-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk placeholder:text-chalk-muted focus:border-lime/60 outline-none resize-none"
          />
        </Section>
      </div>
    </div>
  );
}

function FaqEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const items = (() => {
    if (!value) return [] as { q: string; a: string }[];
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((i) => i && typeof i.q === "string" && typeof i.a === "string");
    } catch {
      return [];
    }
  })();

  const update = (next: { q: string; a: string }[]) => {
    onChange(next.length === 0 ? null : JSON.stringify(next));
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-[10.5px] text-chalk-muted">No FAQ yet. Add your first question below.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-2 space-y-1.5">
          <input
            type="text"
            placeholder="Question"
            value={item.q}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], q: e.target.value };
              update(next);
            }}
            className="w-full h-8 px-2 rounded-md border border-white/[0.08] bg-night text-[11.5px] font-semibold text-chalk focus:border-lime/60 outline-none"
          />
          <textarea
            placeholder="Answer"
            rows={2}
            value={item.a}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], a: e.target.value };
              update(next);
            }}
            className="w-full p-2 rounded-md border border-white/[0.08] bg-night text-[11.5px] text-chalk-muted focus:border-lime/60 outline-none resize-y"
          />
          <button
            type="button"
            onClick={() => update(items.filter((_, j) => j !== i))}
            className="text-[10px] font-semibold text-rose-600 hover:text-rose-700"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...items, { q: "", a: "" }])}
        className="w-full h-8 rounded-lg border border-dashed border-white/[0.08] text-[11px] font-medium text-chalk-muted hover:border-lime/50 hover:text-lime transition-all"
      >
        + Add question
      </button>
    </div>
  );
}

function DesignPanel() {
  const { course, setCourseField } = useCourseStudio();

  return (
    <div className="w-[300px] border-l border-white/[0.08] bg-night flex flex-col shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-white/[0.08]">
        <h2 className="text-[13px] font-semibold text-chalk">Design</h2>
      </div>
      <div className="p-4 space-y-6">
        <Section title="Cover Image">
          <input
            type="text"
            placeholder="Image URL"
            value={course.coverImage || ""}
            onChange={(e) => setCourseField("coverImage", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          />
        </Section>
        <Section title="Brand Color">
          <div className="flex gap-2">
            <input
              type="color"
              value={course.thumbnailColor || "#6366f1"}
              onChange={(e) => setCourseField("thumbnailColor", e.target.value)}
              className="h-9 w-9 rounded-lg border border-white/[0.08] cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={course.thumbnailColor || "#6366f1"}
              onChange={(e) => setCourseField("thumbnailColor", e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
            />
          </div>
        </Section>
        <Section title="Trailer">
          <input
            type="text"
            placeholder="YouTube or Vimeo URL"
            value={course.trailerUrl || ""}
            onChange={(e) => setCourseField("trailerUrl", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-[12px] text-chalk focus:border-lime/60 outline-none"
          />
        </Section>
      </div>
    </div>
  );
}

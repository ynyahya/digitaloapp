"use client";

import { useMemo } from "react";
import { CurriculumSidebar } from "../_components/curriculum-sidebar";
import { LessonCanvas } from "../_components/lesson-canvas";
import { ContextPanel } from "../_components/context-panel";
import { BuilderLaunchCenter } from "@/components/builder";
import { Button } from "@/components/ui/button";
import { useCourseStudio } from "@/hooks/use-course-studio";
import { getCourseReadiness } from "@/lib/builder/readiness/course";
import { summarizeReadiness } from "@/lib/builder/readiness/score";
import { Sparkles } from "lucide-react";

export default function CourseBuilderRoutePage() {
  const { course, chapters, setActiveTab, setCourseField, forceSave, toggleStatus } = useCourseStudio();
  const checks = useMemo(() => getCourseReadiness({ ...course, chapters }), [course, chapters]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const publicHref = course.creatorHandle ? `/c/${course.creatorHandle}/${course.slug}?preview=1` : undefined;
  const generateStarter = () => {
    setCourseField("subtitle", course.subtitle || "A focused learning path for creators who want practical outcomes.");
    setCourseField("audience", course.audience || "Creators, founders, and operators who want a clear step-by-step path.");
    setCourseField("outcomes", course.outcomes || "Build a clear foundation\nApply the workflow to a real project\nLaunch with confidence");
    setCourseField("requirements", course.requirements || "No advanced setup required. Bring your current project or idea.");
    setCourseField("faqJson", course.faqJson || JSON.stringify([
      { q: "Who is this course for?", a: "Creators who want a practical, launch-oriented learning experience." },
      { q: "How long does it take?", a: "You can start immediately and complete the core lessons at your own pace." },
    ]));
    setCourseField("metaTitle", course.metaTitle || course.title);
    setCourseField("metaDescription", course.metaDescription || course.subtitle || "A practical course by a TESKEL creator.");
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-night text-chalk">
      <CurriculumSidebar />
      <LessonCanvas />
      <ContextPanel />
      <aside className="hidden w-[340px] shrink-0 border-l border-white/[0.08] bg-night/70 p-4 xl:block">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Course actions</p>
            <Button type="button" variant="outline" className="mt-3 w-full rounded-2xl" onClick={generateStarter}>
              <Sparkles className="h-4 w-4" />
              Generate starter copy
            </Button>
            <Button type="button" variant="outline" className="mt-2 w-full rounded-2xl" onClick={() => setActiveTab("curriculum")}>
              Review curriculum
            </Button>
          </div>
          <BuilderLaunchCenter
            checks={checks}
            onSelect={(section) => {
              if (section === "curriculum") setActiveTab("curriculum");
              if (section === "overview") setActiveTab("overview");
              if (section === "design") setActiveTab("design");
              if (section === "pricing") setActiveTab("settings");
              if (section === "settings") setActiveTab("settings");
            }}
            onPublish={async () => {
              await forceSave();
              if (summary.canPublish) await toggleStatus();
            }}
            canPublish={summary.canPublish}
            published={course.status === "PUBLISHED"}
            publicHref={publicHref}
          />
        </div>
      </aside>
    </div>
  );
}

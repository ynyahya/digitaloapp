"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Clock, FileText, Package, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderCanvas, BuilderDevicePreview, BuilderHeader, BuilderLaunchCenter, BuilderPreviewRail, BuilderReadinessPanel, BuilderShell, BuilderSidebar } from "@/components/builder";
import { useBuilderState } from "@/hooks/use-builder-state";
import { getServiceReadiness } from "@/lib/builder/readiness/service";
import { summarizeReadiness } from "@/lib/builder/readiness/score";
import { publishService, unpublishService, updateService } from "@/lib/actions/services";
import { ServiceBasicsSection } from "./service-basics-section";
import { ServiceDeliverySection } from "./service-delivery-section";
import { ServicePackagesSection } from "./service-packages-section";
import { ServicePreview } from "./service-preview";
import { ServiceProofSection } from "./service-proof-section";
import { ServiceFaqSection } from "./service-faq-section";
import { ServiceSettingsSection } from "./service-settings-section";
import type { ServiceBuilderData } from "./service-types";

function scrollToSection(id: string) {
  document.querySelector(`[data-builder-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ServiceWorkspace({ initialService }: { initialService: ServiceBuilderData }) {
  const [activeSection, setActiveSection] = useState("basics");
  const builder = useBuilderState<ServiceBuilderData>({
    initialData: initialService,
    save: (fields) => updateService(initialService.id, fields),
  });
  const service = builder.data;
  const checks = useMemo(() => getServiceReadiness(service), [service]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const sectionComplete = (id: string) => checks.filter((check) => check.targetSection === id && check.severity === "required").every((check) => check.done);
  const selectSection = (id: string) => {
    setActiveSection(id);
    scrollToSection(id);
  };
  const publish = async () => {
    if (!summary.canPublish) return;
    await builder.saveNow();
    if (service.status === "PUBLISHED") {
      await unpublishService(service.id);
      builder.setField("status", "DRAFT");
    } else {
      await publishService(service.id);
      builder.setField("status", "PUBLISHED");
    }
  };
  const generateStarterContent = () => {
    const basePrice = service.priceCents || 750000;
    builder.setFields({
      promise: service.promise || `Get a clear, launch-ready ${service.category || "service"} outcome without guessing the next step.`,
      description: service.description || `This service is designed for creators and teams who need a practical outcome fast.\n\nYou will get a focused delivery process, clear communication, and actionable next steps so you can move from idea to launch with confidence.`,
      packagesJson: JSON.stringify([
        { id: "starter", name: "Starter", description: "Focused review and practical recommendations.", priceCents: basePrice, deliveryDays: service.deliveryDays || 7, revisions: service.revisions || 1 },
        { id: "premium", name: "Premium", description: "Deeper implementation support with priority delivery.", priceCents: basePrice * 2, deliveryDays: Math.max(3, service.deliveryDays || 7), revisions: (service.revisions || 1) + 1 },
      ]),
      outcomesJson: JSON.stringify(["Clear action plan", "Buyer-ready deliverables", "Faster launch decision", "Reduced execution risk"]),
      scopeJson: JSON.stringify([
        { id: "in-1", label: "Initial discovery and requirements review", included: true },
        { id: "in-2", label: "Documented recommendations", included: true },
        { id: "in-3", label: "Delivery handoff with next steps", included: true },
        { id: "out-1", label: "Unlimited revisions", included: false },
        { id: "out-2", label: "Third-party tool subscription costs", included: false },
      ]),
      faqJson: JSON.stringify([
        { id: "faq-1", question: "What do I need to provide?", answer: "Share your goal, current assets, and any references before the project starts." },
        { id: "faq-2", question: "How does delivery work?", answer: "You will receive the final deliverables and recommendations inside the agreed timeline." },
      ]),
      proofJson: JSON.stringify(["Clear scope before work starts", "Revision policy included", "Built for fast creator launches"]),
      metaTitle: service.metaTitle || `${service.title} by ${service.category || "TESKEL creator"}`,
      metaDescription: service.metaDescription || service.promise || "A premium service package for creators and teams.",
    });
  };

  return (
    <BuilderShell
      header={
        <BuilderHeader
          eyebrow="Service BuilderOS"
          title={service.title || "Untitled service"}
          subtitle="Build → Preview → Launch"
          backHref="/dashboard/services"
          status={service.status}
          saveStatus={builder.saveStatus}
          canUndo={builder.canUndo}
          canRedo={builder.canRedo}
          canPublish={summary.canPublish}
          onSave={builder.saveNow}
          onUndo={builder.undo}
          onRedo={builder.redo}
          onPreview={() => selectSection("preview")}
          onPublish={publish}
          publishLabel={service.status === "PUBLISHED" ? "Unpublish" : "Launch"}
        >
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <a href="/dashboard/services/inquiries">View leads</a>
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={generateStarterContent}>
            <Sparkles className="h-3.5 w-3.5" />
            Generate starter
          </Button>
        </BuilderHeader>
      }
      sidebar={
        <BuilderSidebar
          activeId={activeSection}
          readinessScore={summary.score}
          onSelect={selectSection}
          items={[
            { id: "basics", label: "Define offer", description: "Title, category, cover", icon: Briefcase, complete: sectionComplete("basics") },
            { id: "packages", label: "Package pricing", description: "Price and currency", icon: Package, complete: sectionComplete("packages") },
            { id: "delivery", label: "Delivery & scope", description: "Timeline and revisions", icon: Clock, complete: sectionComplete("delivery") },
            { id: "proof", label: "Proof / FAQ", description: "Promise and objections", icon: FileText, complete: sectionComplete("proof") },
            { id: "faq", label: "FAQ", description: "Buyer objections", icon: FileText, complete: Boolean(service.faqJson) },
            { id: "settings", label: "Settings", description: "Slug and status", icon: Settings, complete: service.status === "PUBLISHED" },
          ]}
        />
      }
      inspector={
        <BuilderPreviewRail>
          <BuilderDevicePreview>
            <ServicePreview service={service} />
          </BuilderDevicePreview>
          <BuilderReadinessPanel checks={checks} onSelect={selectSection} />
        </BuilderPreviewRail>
      }
    >
      <BuilderCanvas>
        {builder.error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-[13px] text-red-100">{builder.error}</div> : null}
        <ServiceBasicsSection service={service} setField={builder.setField} complete={sectionComplete("basics")} />
        <ServicePackagesSection service={service} setField={builder.setField} complete={sectionComplete("packages")} />
        <ServiceDeliverySection service={service} setField={builder.setField} complete={sectionComplete("delivery")} />
        <ServiceProofSection service={service} setField={builder.setField} complete={sectionComplete("proof")} />
        <ServiceFaqSection service={service} setField={builder.setField} complete={Boolean(service.faqJson)} />
        <div id="preview" data-builder-section="preview" className="xl:hidden">
          <BuilderPreviewRail>
            <BuilderDevicePreview>
              <ServicePreview service={service} />
            </BuilderDevicePreview>
          </BuilderPreviewRail>
        </div>
        <ServiceSettingsSection service={service} setField={builder.setField} />
        <BuilderLaunchCenter checks={checks} onSelect={selectSection} onPublish={publish} canPublish={summary.canPublish} published={service.status === "PUBLISHED"} publicHref={`/s/${service.slug}`} />
      </BuilderCanvas>
    </BuilderShell>
  );
}

export function ServiceBuilderClient({ slug }: { slug: string }) {
  const [service, setService] = useState<ServiceBuilderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/services/${slug}`);
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        if (active) setService(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-night text-chalk"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/[0.12] border-t-lime" /><p className="mt-4 text-[13px] text-chalk-muted">Preparing your workspace...</p></div></div>;
  }

  if (error || !service) {
    return <div className="flex min-h-screen items-center justify-center bg-night p-6 text-chalk"><div className="max-w-sm rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-6 text-center"><Sparkles className="mx-auto h-8 w-8 text-lime" /><h1 className="mt-4 text-xl font-bold">Could not open service</h1><p className="mt-2 text-sm text-chalk-muted">{error ?? "Service not found"}</p><Button asChild className="mt-5 rounded-2xl"><a href="/dashboard/services">Back to services</a></Button></div></div>;
  }

  return <ServiceWorkspace initialService={service} />;
}

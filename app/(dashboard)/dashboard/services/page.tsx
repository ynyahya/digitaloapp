import { ArrowRight, Briefcase, Calendar, CheckCircle2, Clock, FileText, Package, Search, Sparkles, Star, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { getServices, getServiceStats } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";
import { CommandHero, EmptyCommandState, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Services — TESKEL ServiceOS", description: "Build, package, and sell premium professional services." };

type ServiceItem = Awaited<ReturnType<typeof getServices>>[number];

export default async function ServicesDashboard() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;
  const [services, stats] = await Promise.all([getServices(creator.id), getServiceStats(creator.id)]);

  const live = services.filter((service) => service.status === "PUBLISHED").length;
  const drafts = services.filter((service) => service.status === "DRAFT").length;
  const averageReadiness = services.length ? Math.round(services.reduce((sum, service) => sum + getServiceReadiness(service).score, 0) / services.length) : 0;
  const focusService = services.map((service) => ({ service, readiness: getServiceReadiness(service) })).sort((a, b) => a.readiness.score - b.readiness.score)[0];

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="ServiceOS Command Center"
        title="Ubah expertise jadi service offer yang jelas, premium, dan siap dijual."
        description="Kelola service seperti studio profesional: promise, package, delivery scope, proof, inquiry flow, dan launch readiness dalam satu cockpit."
        primaryHref="/dashboard/services/new"
        primaryLabel="Create premium service"
        secondaryHref="/dashboard/services/inquiries"
        secondaryLabel="View inquiries"
        icon={Briefcase}
        accent="from-indigo-400/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Service launch path"
          items={[
            { label: "Offer", description: "Define audience, category, and transformation", done: services.some((service) => Boolean(service.promise || service.description)) },
            { label: "Package", description: "Create pricing, timeline, and service tiers", done: services.some((service) => service.priceCents > 0 || Boolean(service.packagesJson)) },
            { label: "Delivery", description: "Clarify scope, revisions, and handoff", done: services.some((service) => Boolean(service.scopeJson || service.outcomesJson)) },
            { label: "Proof", description: "Handle objections with FAQ and trust signals", done: services.some((service) => Boolean(service.proofJson || service.faqJson)) },
            { label: "Launch", description: "Publish and route leads to inquiry pipeline", done: live > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Briefcase} label="Live services" value={live} helper={`${drafts} draft offer sedang disiapkan`} tone="blue" />
        <MetricTile icon={CheckCircle2} label="Completed sales" value={stats.totalSales} helper="Service orders delivered or sold" tone="emerald" />
        <MetricTile icon={Star} label="Average rating" value={stats.avgRating} helper="Proof quality across services" tone="amber" />
        <MetricTile icon={Sparkles} label="Readiness" value={`${averageReadiness}%`} helper="Average launch health" tone="lime" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-chalk">Service pipeline</h2>
              <p className="text-[13px] text-chalk-muted">{services.length} service total · prioritized by launch readiness</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-chalk-muted" />
              <Input className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search services..." />
            </div>
          </div>

          {services.length === 0 ? (
            <EmptyCommandState icon={Briefcase} title="Package your first high-trust service" description="Start with a concrete promise, clear delivery scope, premium package, and inquiry path so buyers understand exactly what they get." href="/dashboard/services/new" label="Create first service" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {services.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Next best action</p>
              {focusService ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-chalk">{focusService.service.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-chalk-muted">{focusService.readiness.nextAction}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-lime" style={{ width: `${focusService.readiness.score}%` }} />
                  </div>
                  <Button asChild className="h-10 w-full rounded-2xl bg-lime text-night">
                    <Link href={`/dashboard/services/${focusService.service.slug}/builder`}>Open builder<ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-[13px] leading-5 text-chalk-muted">Create a service to unlock readiness guidance.</p>
              )}
            </CardContent>
          </Card>

          <PlaybookCard icon={Users} title="Premium service playbook" description="Format service seperti pro agency: mudah dipahami, low-friction, dan trust-heavy." steps={["Name the outcome, not the labor", "Package timeline and revision boundary", "Show proof before asking for payment", "Route complex work into inquiry flow"]} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Briefcase, title: "Consulting", description: "Audit, advisory, and strategy sprint", steps: ["Promise", "Session", "Action plan"] },
          { icon: Calendar, title: "Retainer", description: "Monthly support with recurring scope", steps: ["Capacity", "SLA", "Reporting"] },
          { icon: Package, title: "Done-for-you", description: "Clear deliverable with premium handoff", steps: ["Assets", "Milestones", "Delivery"] },
          { icon: FileText, title: "Review", description: "Fast expert review and recommendations", steps: ["Intake", "Score", "Fix list"] },
        ].map((template) => <PlaybookCard key={template.title} icon={template.icon} title={template.title} description={template.description} steps={template.steps} />)}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const readiness = getServiceReadiness(service);

  return (
    <Link href={`/dashboard/services/${service.slug}/builder`}>
      <Card className="group h-full overflow-hidden rounded-3xl border-white/[0.08] bg-night/70 shadow-soft transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:shadow-card">
        <CardContent className="p-0">
          <div className="border-b border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-white/[0.02] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-night/70">
                  <Briefcase className="h-5 w-5 text-chalk" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[16px] font-bold text-chalk group-hover:text-lime">{service.title}</h3>
                  <p className="mt-1 text-[12px] text-chalk-muted">{service.category || "Premium service"} · {service.price}</p>
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
          </div>
          <div className="space-y-4 p-5">
            <p className="line-clamp-2 min-h-[40px] text-[13px] leading-5 text-chalk-muted">{service.promise || service.description || "Add a crisp promise so buyers know what outcome they are buying."}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat icon={Clock} value={`${service.deliveryDays}d`} label="Delivery" />
              <MiniStat icon={Package} value={service.packagesJson ? "Set" : "Basic"} label="Package" />
              <MiniStat icon={CheckCircle2} value={`${readiness.score}%`} label="Ready" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim"><span>Launch readiness</span><span>{readiness.score}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full", readiness.score >= 80 ? "bg-emerald-500" : readiness.score >= 50 ? "bg-amber-500" : "bg-lime")} style={{ width: `${readiness.score}%` }} /></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
              <p className="text-[12px] text-chalk-muted">{readiness.nextAction}</p>
              <ArrowRight className="h-4 w-4 text-chalk-dim transition-transform group-hover:translate-x-1 group-hover:text-chalk" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Clock; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-chalk-dim" />
      <p className="text-[12px] font-bold text-chalk">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-chalk-dim">{label}</p>
    </div>
  );
}

function getServiceReadiness(service: ServiceItem) {
  const checks = [
    { done: Boolean(service.title && (service.promise || service.description)), next: "Tighten the promise and buyer outcome." },
    { done: service.priceCents > 0 || Boolean(service.packagesJson), next: "Create a clear paid package." },
    { done: Boolean(service.scopeJson || service.outcomesJson), next: "Define delivery scope and outcomes." },
    { done: Boolean(service.proofJson || service.faqJson), next: "Add FAQ, proof, and objection handling." },
    { done: service.status === "PUBLISHED", next: "Launch the service and collect inquiries." },
  ];
  const score = Math.round((checks.filter((check) => check.done).length / checks.length) * 100);
  return { score, nextAction: checks.find((check) => !check.done)?.next ?? "Service is live. Improve proof and lead conversion next." };
}

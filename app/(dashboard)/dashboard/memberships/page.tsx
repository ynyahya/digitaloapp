import { ArrowRight, Award, CheckCircle2, Crown, HeartHandshake, LockKeyhole, Plus, RefreshCw, Search, Sparkles, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { getMemberships, getMembershipStats } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";
import { CommandHero, EmptyCommandState, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Memberships — TESKEL MembershipOS", description: "Manage subscription-based access and exclusive communities." };

type MembershipItem = Awaited<ReturnType<typeof getMemberships>>[number];

export default async function MembershipsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const [memberships, stats] = await Promise.all([getMemberships(creator.id), getMembershipStats(creator.id)]);
  const live = memberships.filter((membership) => membership.status === "PUBLISHED").length;
  const draft = memberships.filter((membership) => membership.status === "DRAFT").length;
  const annual = memberships.filter((membership) => membership.billingCycle === "YEARLY").length;
  const averageReadiness = memberships.length ? Math.round(memberships.reduce((sum, membership) => sum + getMembershipReadiness(membership).score, 0) / memberships.length) : 0;

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="MembershipOS Command Center"
        title="Bangun recurring revenue dengan membership yang jelas value, access, dan retention loop-nya."
        description="Kelola tier, benefit, billing, member value, dan launch readiness agar subscription tidak cuma jadi harga bulanan tanpa alasan kuat untuk stay."
        primaryHref="/dashboard/memberships/new"
        primaryLabel="Create membership tier"
        icon={Crown}
        accent="from-violet-400/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Membership growth path"
          items={[
            { label: "Value", description: "Define who it is for and why they stay", done: memberships.some((membership) => Boolean(membership.description)) },
            { label: "Access", description: "Member-only perks, content, calls, or community", done: memberships.some((membership) => Boolean(membership.benefits)) },
            { label: "Pricing", description: "Monthly or annual billing with clear value", done: memberships.some((membership) => membership.priceCents > 0) },
            { label: "Retention", description: "Create reasons to return every cycle", done: memberships.some((membership) => membership.members > 0) },
            { label: "Launch", description: "Publish tiers and start onboarding", done: live > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Crown} label="Live tiers" value={live} helper={`${draft} draft tier${draft === 1 ? "" : "s"}`} tone="violet" />
        <MetricTile icon={Users} label="Active members" value={stats.totalMembers} helper="Members across all tiers" tone="emerald" />
        <MetricTile icon={Zap} label="MRR" value={stats.mrr} helper={`${annual} annual tier${annual === 1 ? "" : "s"} available`} tone="amber" />
        <MetricTile icon={Sparkles} label="Readiness" value={`${averageReadiness}%`} helper="Average tier launch health" tone="lime" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-chalk">Tier architecture</h2>
              <p className="text-[13px] text-chalk-muted">{memberships.length} tier total · value, access, pricing, and retention health</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-chalk-muted" />
              <Input className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search tiers..." />
            </div>
          </div>

          {memberships.length === 0 ? (
            <EmptyCommandState icon={Award} title="Design your first recurring offer" description="Create a tier with clear ongoing value, specific member benefits, and billing that makes retention feel obvious." href="/dashboard/memberships/new" label="Create first tier" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {memberships.map((membership) => <MembershipCard key={membership.id} membership={membership} />)}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Membership monetization</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between"><p className="text-[13px] font-bold text-chalk">Published architecture</p><p className="text-[18px] font-bold text-chalk">{live}/{memberships.length || 0}</p></div>
                  <p className="mt-1 text-[12px] text-chalk-muted">Launch at least one simple tier before creating complexity.</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between"><p className="text-[13px] font-bold text-chalk">Member base</p><p className="text-[18px] font-bold text-chalk">{stats.totalMembers}</p></div>
                  <p className="mt-1 text-[12px] text-chalk-muted">Retention loop starts once people join and receive repeated value.</p>
                </div>
                <Button asChild className="h-10 w-full rounded-2xl bg-lime text-night"><Link href="/dashboard/memberships/new">Add strategic tier<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </CardContent>
          </Card>

          <PlaybookCard icon={RefreshCw} title="Retention-first playbook" description="Membership bukan produk satu kali. Pembeli harus tahu apa yang terjadi setiap minggu/bulan." steps={["Make value recurring", "Limit tiers to reduce confusion", "Bundle access and accountability", "Give members a next milestone"]} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: LockKeyhole, title: "Content Vault", description: "Member-only resources and replays", steps: ["Library", "Updates", "Access"] },
          { icon: Users, title: "Community", description: "Private network and peer learning", steps: ["Channels", "Rituals", "Moderation"] },
          { icon: HeartHandshake, title: "Accountability", description: "Check-ins, office hours, and progress", steps: ["Cadence", "Milestones", "Feedback"] },
          { icon: Crown, title: "VIP Tier", description: "Premium access with scarce support", steps: ["Capacity", "Calls", "Priority"] },
        ].map((template) => <PlaybookCard key={template.title} icon={template.icon} title={template.title} description={template.description} steps={template.steps} />)}
      </div>
    </div>
  );
}

function MembershipCard({ membership }: { membership: MembershipItem }) {
  const readiness = getMembershipReadiness(membership);

  return (
    <Card className="group h-full rounded-3xl border-white/[0.08] bg-night/70 shadow-soft transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:shadow-card">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]"><Crown className="h-5 w-5 text-violet-300" /></div>
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-bold text-chalk">{membership.title}</h3>
              <p className="mt-1 text-[12px] text-chalk-muted">{membership.billingCycle} · {membership.price}</p>
            </div>
          </div>
          <StatusBadge status={membership.status} />
        </div>
        <p className="line-clamp-2 min-h-[40px] text-[13px] leading-5 text-chalk-muted">{membership.description || "Add a clear member promise and reason people should keep subscribing."}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniStat icon={Users} value={String(membership.members)} label="Members" />
          <MiniStat icon={CheckCircle2} value={membership.benefits ? "Set" : "Missing"} label="Benefits" />
          <MiniStat icon={Sparkles} value={`${readiness.score}%`} label="Ready" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim"><span>Tier readiness</span><span>{readiness.score}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full", readiness.score >= 80 ? "bg-emerald-500" : readiness.score >= 50 ? "bg-amber-500" : "bg-lime")} style={{ width: `${readiness.score}%` }} /></div>
        </div>
        <div className="border-t border-white/[0.08] pt-4 text-[12px] text-chalk-muted">{readiness.nextAction}</div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-chalk-dim" />
      <p className="truncate text-[11px] font-bold text-chalk">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-chalk-dim">{label}</p>
    </div>
  );
}

function getMembershipReadiness(membership: MembershipItem) {
  const checks = [
    { done: Boolean(membership.title && membership.description), next: "Add a clear membership promise and positioning." },
    { done: Boolean(membership.benefits), next: "List member benefits and recurring value." },
    { done: membership.priceCents > 0, next: "Set paid monthly or annual pricing." },
    { done: membership.coverImage || membership.members > 0, next: "Add visual trust or start onboarding members." },
    { done: membership.status === "PUBLISHED", next: "Publish the tier when value and pricing are ready." },
  ];
  const score = Math.round((checks.filter((check) => check.done).length / checks.length) * 100);
  return { score, nextAction: checks.find((check) => !check.done)?.next ?? "Tier is live. Improve retention rituals next." };
}

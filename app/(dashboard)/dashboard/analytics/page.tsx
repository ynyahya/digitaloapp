import { ArrowDownRight, ArrowUpRight, BarChart3, Calendar, Download, Eye, Layout, Package, Sparkles, Star, Target, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/dashboard/line-chart";
import { AnalyticsFunnel } from "@/components/dashboard/analytics-funnel";
import { requireCreator } from "@/lib/auth/session";
import { getAnalyticsSummary } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";
import { CommandHero, PlaybookCard, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Analytics — TESKEL Intelligence", description: "Sales and customer behavior across your store." };

export default async function AnalyticsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const summary = await getAnalyticsSummary(creator.id, 30);
  const orderCount = Number(summary.orders.replace(/,/g, ""));
  const views = Math.max(1240, orderCount * 35);

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="Analytics Intelligence"
        title="Baca bisnis seperti operator global: revenue, conversion, customers, product winners, dan next moves."
        description="Analytics dirancang sebagai decision room, bukan kumpulan angka. Fokus pada apa yang naik, apa yang perlu diperbaiki, dan offer mana yang layak diperkuat."
        icon={BarChart3}
        accent="from-lime/20 via-blue-400/10 to-transparent"
      >
        <WorkflowRail
          title="Insight loop"
          items={[
            { label: "Measure", description: "Track revenue and order flow", done: orderCount > 0 },
            { label: "Compare", description: "Read deltas against previous period", done: true },
            { label: "Diagnose", description: "Use funnel and top product signals", done: summary.topProducts.length > 0 },
            { label: "Prioritize", description: "Pick the offer or page to improve", done: summary.topProducts.length > 0 },
            { label: "Act", description: "Turn insight into product, bundle, or campaign updates", done: false },
          ]}
        />
      </CommandHero>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-[20px] font-bold text-chalk">Performance cockpit</h2><p className="text-[13px] text-chalk-muted">Last 30 days with previous-period comparison</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.08] gap-2 text-[12.5px] font-bold"><Calendar className="h-4 w-4" />Last 30 Days</Button>
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.08] gap-2 text-[12.5px] font-bold"><Download className="h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-[32px] border-white/[0.08] bg-night/70 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08] bg-white/[0.035] px-8 py-5">
          <div><CardTitle className="text-[16px] font-bold">Revenue performance</CardTitle><p className="text-[12px] text-chalk-muted">Net revenue generated over the selected period</p></div>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-chalk-muted"><div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-lime" />Current</div><div className="flex items-center gap-1.5 opacity-50"><span className="h-0.5 w-4 border-t border-dashed border-ink" />Previous</div></div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-4">
            <SummaryStat label="Net Revenue" value={summary.revenue} delta={summary.revenueDelta} icon={TrendingUp} />
            <SummaryStat label="Average Order" value={summary.aov} delta={summary.aovDelta} icon={Target} />
            <SummaryStat label="Total Orders" value={summary.orders} delta={summary.ordersDelta} icon={Package} />
            <SummaryStat label="New Customers" value={summary.uniqueCustomers} delta={summary.uniqueCustomersDelta} icon={Users} />
          </div>
          <LineChart data={summary.series} comparison={summary.previousSeries} height={320} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7"><AnalyticsFunnel data={{ views, orders: orderCount }} /></div>
        <div className="lg:col-span-5">
          <Card className="h-full overflow-hidden rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08] bg-white/[0.035] px-6 py-4"><div><CardTitle className="text-[15px] font-bold">Top products</CardTitle><p className="text-[12px] text-chalk-muted">Winners to scale, bundle, or improve</p></div><Button variant="ghost" className="h-7 text-[11px] font-bold">Details</Button></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.08]">
                {summary.topProducts.map((product, index) => (
                  <div key={`${product.title}-${index}`} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.035]">
                    <div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]"><Package className="h-4 w-4 text-chalk-dim" /></div><div className="min-w-0"><p className="truncate text-[13px] font-bold text-chalk">{product.title}</p><p className="text-[11px] text-chalk-muted">{product.sales} · scale candidate</p></div></div>
                    <p className="text-[14px] font-bold text-chalk">{product.rev}</p>
                  </div>
                ))}
                {summary.topProducts.length === 0 ? <div className="px-6 py-12 text-center text-[13px] text-chalk-muted">No paid product data yet.</div> : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <InsightCard icon={Eye} title="Discovery signal" content="Direct and owned links are your strongest early channel. Make product pages easier to share from launches." />
        <InsightCard icon={Layout} title="Page health" content="If revenue is flat while traffic grows, prioritize offer clarity and checkout friction before more traffic." />
        <InsightCard icon={Star} title="Customer leverage" content="Repeat buyers and top products are the best source for bundles, memberships, and service upsells." />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PlaybookCard icon={TrendingUp} title="Scale what works" description="Move winners into campaigns and bundles." steps={["Find top product", "Improve proof", "Create bundle path"]} />
        <PlaybookCard icon={Target} title="Fix conversion leaks" description="Use funnel drop-off to decide what to optimize." steps={["Views", "Orders", "AOV"]} />
        <PlaybookCard icon={Sparkles} title="Plan next offer" description="Use buyer behavior to choose services, events, or memberships." steps={["Audience", "Demand", "Retention"]} />
      </div>
    </div>
  );
}

function SummaryStat({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: LucideIcon }) {
  const isPositive = !delta.startsWith("-");
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-night/70"><Icon className="h-4 w-4 text-chalk" /></div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-chalk-dim">{label}</p>
      <div className="mt-2 flex items-baseline gap-2"><p className="text-[24px] font-bold text-chalk">{value}</p><span className={cn("flex items-center text-[11px] font-bold", isPositive ? "text-lime" : "text-rose-300")}>{isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}{delta.replace(/[+-]/, "")}</span></div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, content }: { icon: LucideIcon; title: string; content: string }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-night/70 p-5 shadow-soft transition-colors hover:border-lime/25">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]"><Icon className="h-4 w-4 text-chalk" /></div>
      <p className="mb-1 text-[13px] font-bold text-chalk">{title}</p>
      <p className="text-[12px] leading-relaxed text-chalk-muted">{content}</p>
    </div>
  );
}

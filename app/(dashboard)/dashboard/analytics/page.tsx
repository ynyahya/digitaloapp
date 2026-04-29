import { Calendar, Download, ArrowUpRight, ArrowDownRight, Users, Layout, Package, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/dashboard/line-chart";
import { requireCreator } from "@/lib/auth/session";
import { getAnalyticsSummary } from "@/lib/queries/dashboard";
import { AnalyticsFunnel } from "@/components/dashboard/analytics-funnel";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Analytics",
  description: "Sales and customer behavior across your store.",
};

export default async function AnalyticsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const summary = await getAnalyticsSummary(creator.id, 30);

  return (
    <div className="space-y-8">
      {/* Header with improved actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Deep Analytics</h1>
          <p className="text-[14px] text-ink-muted">
            Tracking performance and buyer behavior for the last 30 days.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-line gap-2 text-[12.5px] font-bold">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-line gap-2 text-[12.5px] font-bold">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Revenue Chart - More Prominent */}
      <Card className="rounded-3xl border-line shadow-soft overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-line bg-paper-soft px-8 py-5">
           <div>
              <CardTitle className="text-[16px] font-bold">Revenue Performance</CardTitle>
              <p className="text-[12px] text-ink-muted">Net revenue generated over the selected period</p>
           </div>
           <div className="flex items-center gap-4 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                 <span className="h-2 w-2 rounded-full bg-ink" />
                 Current
              </div>
              <div className="flex items-center gap-1.5 opacity-50">
                 <span className="h-0.5 w-4 border-t border-dashed border-ink" />
                 Previous
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-8">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              <SummaryStat label="Net Revenue" value={summary.revenue} delta={summary.revenueDelta} />
              <SummaryStat label="Average Order" value={summary.aov} delta={summary.aovDelta} />
              <SummaryStat label="Total Orders" value={summary.orders} delta={summary.ordersDelta} />
              <SummaryStat label="New Customers" value={summary.uniqueCustomers} delta={summary.uniqueCustomersDelta} />
           </div>
           <LineChart data={summary.series} comparison={summary.previousSeries} height={320} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Conversion Funnel - NEW */}
        <div className="lg:col-span-7">
           <AnalyticsFunnel data={{ views: 1240, orders: parseInt(summary.orders) }} />
        </div>

        {/* Top Products Table - Improved */}
        <div className="lg:col-span-5">
           <Card className="h-full rounded-2xl border-line shadow-soft overflow-hidden">
            <CardHeader className="border-b border-line bg-paper-soft px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[15px] font-bold">Top Products</CardTitle>
              <Button variant="ghost" className="h-7 text-[11px] font-bold">Details</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-line">
                {summary.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-paper-soft transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                       <div className="h-8 w-8 rounded-lg bg-paper-muted flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-ink-subtle" />
                       </div>
                       <div className="min-w-0">
                         <p className="text-[13px] font-bold text-ink truncate">{p.title}</p>
                         <p className="text-[11px] text-ink-muted">{p.sales} sales · <span className="text-emerald-600 font-medium">12.5% CR</span></p>
                       </div>
                    </div>
                    <p className="text-[14px] font-bold text-ink">{p.rev}</p>
                  </div>
                ))}
              </div>
            </CardContent>
           </Card>
        </div>
      </div>

      {/* Product Discovery Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <InsightCard 
            icon={Users} 
            title="Audience Reach" 
            content="72% of your traffic comes from Direct links. Consider social sharing."
         />
         <InsightCard 
            icon={Layout} 
            title="Page Health" 
            content="Average page load time is 0.8s. Your SEO score is excellent."
         />
         <InsightCard 
            icon={Star} 
            title="Customer Loyalty" 
            content="12% of customers are repeat buyers. Loyalty is growing."
         />
      </div>
    </div>
  );
}

function SummaryStat({ label, value, delta }: { label: string; value: string; delta: string }) {
  const isPositive = !delta.startsWith("-");
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
         <p className="text-[24px] font-bold text-ink">{value}</p>
         <span className={cn("text-[11px] font-bold flex items-center", isPositive ? "text-emerald-600" : "text-red-600")}>
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {delta.replace(/[+-]/, '')}
         </span>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, content }: { icon: LucideIcon; title: string; content: string }) {
  return (
    <div className="p-5 rounded-2xl border border-line bg-paper-soft hover:border-ink/10 transition-colors">
       <div className="h-9 w-9 rounded-xl bg-paper border border-line flex items-center justify-center mb-4">
          <Icon className="h-4 w-4 text-ink" />
       </div>
       <p className="text-[13px] font-bold text-ink mb-1">{title}</p>
       <p className="text-[12px] text-ink-muted leading-relaxed">{content}</p>
    </div>
  );
}

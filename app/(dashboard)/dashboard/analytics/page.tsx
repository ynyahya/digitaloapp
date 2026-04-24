import { Calendar, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/dashboard/line-chart";
import { requireCreator } from "@/lib/auth/session";
import { getAnalyticsSummary } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Analytics",
  description: "Sales and customer behavior across your store.",
};

export default async function AnalyticsPage() {
  const creator = await requireCreator();
  if (!creator) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-8 text-[14px] text-ink-muted">
        No creator account found. Seed the database to view analytics.
      </div>
    );
  }

  const summary = await getAnalyticsSummary(creator.id, 30);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Analytics</h1>
          <p className="text-[14px] text-ink-muted">
            Deep dive into your sales performance and customer behavior.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-line gap-2 text-[12.5px]"
          >
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-line gap-2 text-[12.5px]"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue" value={summary.revenue} delta={summary.revenueDelta} />
        <MetricCard title="Orders" value={summary.orders} delta={summary.ordersDelta} />
        <MetricCard
          title="Unique Customers"
          value={summary.uniqueCustomers}
          delta={summary.uniqueCustomersDelta}
        />
        <MetricCard title="Avg. Order Value" value={summary.aov} delta={summary.aovDelta} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Revenue over time</CardTitle>
            <div className="flex items-center gap-3 text-[11px] font-medium text-ink-muted uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink" />
                Current 30d
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-px w-4 border-t border-dashed border-ink/40" />
                Previous 30d
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LineChart
              data={summary.series}
              comparison={summary.previousSeries}
              height={300}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Top products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-line">
              {summary.topProducts.length === 0 && (
                <p className="px-6 py-12 text-center text-[13px] italic text-ink-muted">
                  No sales recorded in the last 30 days.
                </p>
              )}
              {summary.topProducts.map((p) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-ink-muted">{p.sales}</p>
                  </div>
                  <p className="shrink-0 text-[13px] font-bold text-ink">{p.rev}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: string;
  delta: string;
}) {
  const positive = !delta.startsWith("-");
  return (
    <Card className="rounded-2xl border-line shadow-soft transition-all hover:shadow-card">
      <CardContent className="p-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">
          {title}
        </p>
        <p className="mt-3 text-[28px] font-semibold tracking-tight text-ink">
          {value}
        </p>
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-[12px] font-medium",
            positive ? "text-emerald-700" : "text-red-700",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {delta}
          <span className="text-ink-muted">vs prior period</span>
        </div>
      </CardContent>
    </Card>
  );
}

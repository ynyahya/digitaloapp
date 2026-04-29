import { ArrowUpRight, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentSales, getRevenueSeries } from "@/lib/queries/dashboard";
import { LineChart } from "@/components/dashboard/line-chart";
import { requireCreator } from "@/lib/auth/session";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export const metadata = {
  title: "Dashboard",
  description: "Manage your TESKEL creator account.",
};

export default async function DashboardPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found. Please seed the database.</div>;

  const [stats, sales, series] = await Promise.all([
    getDashboardStats(creator.id),
    getRecentSales(creator.id),
    getRevenueSeries(creator.id, 7),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">
            Good morning, {creator.displayName}
          </h1>
          <p className="text-[14px] text-ink-muted">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Store Online
          </div>
          <Button variant="secondary" size="sm" className="rounded-full">
            View Storefront
            <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats.revenue}
          delta={stats.revenueDelta}
          icon={DollarSign}
        />
        <StatCard
          title="Products Sold"
          value={stats.productsSold.toString()}
          delta={stats.salesDelta}
          icon={ShoppingCart}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers.toString()}
          delta={stats.customersDelta}
          icon={Users}
        />
        <StatCard
          title="Conversion Rate"
          value={stats.conversionRate}
          delta={stats.conversionDelta}
          icon={TrendingUp}
        />
      </div>

      {/* Smart Insight Banner */}
      <div className="p-1 rounded-[20px] bg-gradient-to-r from-emerald-500/10 via-ink/5 to-emerald-500/10 border border-line">
        <div className="bg-paper rounded-[16px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-ink">Creator Insight</p>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                {sales.length > 0 
                  ? `Your product "${sales[0].name}" is seeing increased traffic. This might be a good time to create a discount bundle.`
                  : "Welcome! Start by publishing your first product to see real-time insights here."}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[11px] font-bold shrink-0">
            View Analytics
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Revenue Overview</CardTitle>
            <div className="flex items-center gap-2 text-[11px] font-medium text-ink-muted uppercase tracking-wider">
              <span className="rounded-full bg-ink px-2 py-0.5 text-paper">7D</span>
              <span className="px-2">30D</span>
              <span className="px-2">90D</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LineChart data={series} height={280} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-semibold">Live Activity</CardTitle>
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
               <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ActivityFeed />
            <div className="mt-4 pt-4 border-t border-line">
              <Button variant="ghost" className="w-full h-9 rounded-xl text-[12px] font-bold text-ink-muted hover:text-ink">
                View Detailed Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  delta,
  icon: Icon,
}: {
  title: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-line shadow-soft transition-all hover:shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-paper-muted flex items-center justify-center text-ink">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {delta}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-subtle">
            {title}
          </p>
          <p className="mt-1 text-[24px] font-bold tracking-tight text-ink">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

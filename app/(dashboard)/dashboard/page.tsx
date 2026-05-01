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
          <p className="text-eyebrow uppercase text-lime">Creator command center</p>
          <h1 className="mt-3 text-[36px] font-black tracking-[-0.04em] text-chalk">
            Good morning, {creator.displayName}
          </h1>
          <p className="text-[14px] text-chalk-muted">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/10 px-3 py-1.5 text-[12px] font-medium text-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_rgba(180,243,0,0.8)]" />
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
      <div className="p-1 rounded-[20px] bg-gradient-to-r from-lime/20 via-violet/10 to-lime/20 border border-white/[0.08]">
        <div className="bg-night/90 rounded-[16px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-lime text-night flex items-center justify-center shrink-0 lime-shadow">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-chalk">Creator Insight</p>
              <p className="text-[11px] text-chalk-muted leading-relaxed">
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
        <Card className="lg:col-span-2 rounded-2xl border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/25 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08] bg-white/[0.035] px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Revenue Overview</CardTitle>
            <div className="flex items-center gap-2 text-[11px] font-medium text-chalk-muted uppercase tracking-wider">
              <span className="rounded-full bg-lime px-2 py-0.5 text-night">7D</span>
              <span className="px-2">30D</span>
              <span className="px-2">90D</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <LineChart data={series} height={280} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/25 overflow-hidden">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[15px] font-semibold">Live Activity</CardTitle>
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-lime uppercase tracking-wider">Live</span>
               <span className="flex h-2 w-2 rounded-full bg-lime animate-pulse" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ActivityFeed />
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              <Button variant="ghost" className="w-full h-9 rounded-xl text-[12px] font-bold text-chalk-muted hover:text-chalk">
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
    <Card className="rounded-2xl border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-lime/25">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-lime/10 flex items-center justify-center text-lime">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-bold text-lime bg-lime/10 px-2 py-0.5 rounded-full">
            {delta}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-chalk-dim">
            {title}
          </p>
          <p className="mt-1 text-[24px] font-bold tracking-tight text-chalk">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

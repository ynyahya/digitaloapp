import { ArrowUpRight, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentSales, getRevenueSeries } from "@/lib/queries/dashboard";
import { LineChart } from "@/components/dashboard/line-chart";
import { requireCreator } from "@/lib/auth/session";

export const metadata = {
  title: "Dashboard",
  description: "Manage your Digitalo creator account.",
};

export default async function DashboardPage() {
  // For the final SaaS, this would come from session
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
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-line">
              {sales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-paper-soft transition-colors cursor-pointer">
                  <div>
                    <p className="text-[13px] font-medium text-ink">{sale.name}</p>
                    <p className="text-[11px] text-ink-muted">by {sale.buyer} · {sale.time}</p>
                  </div>
                  <p className="text-[13px] font-bold text-ink">{sale.price}</p>
                </div>
              ))}
              {sales.length === 0 && (
                <div className="px-6 py-12 text-center text-ink-muted text-[13px] italic">
                  No sales recorded yet.
                </div>
              )}
            </div>
            <div className="p-4 border-t border-line">
              <Button variant="ghost" className="w-full text-[12.5px] font-medium text-ink-muted hover:text-ink">
                View all sales
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

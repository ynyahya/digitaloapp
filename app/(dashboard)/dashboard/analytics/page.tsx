import { Calendar, Download, TrendingUp, Users, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Analytics</h1>
          <p className="text-[14px] text-ink-muted">Deep dive into your sales performance and customer behavior.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-line gap-2 text-[12.5px]">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-line gap-2 text-[12.5px]">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Revenue" value="$42,875" delta="+12.5%" isPositive={true} />
        <MetricCard title="Store Visits" value="12,402" delta="+4.2%" isPositive={true} />
        <MetricCard title="Checkout Conv." value="3.42%" delta="-0.8%" isPositive={false} />
        <MetricCard title="Avg. Order Value" value="$48.20" delta="+2.1%" isPositive={true} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Revenue over time</CardTitle>
            <div className="flex items-center gap-2 text-[11px] font-medium text-ink-muted uppercase tracking-wider">
               <span className="h-2 w-2 rounded-full bg-ink" />
               Current Period
               <span className="h-2 w-2 rounded-full bg-paper-muted ml-4" />
               Previous Period
            </div>
          </CardHeader>
          <CardContent className="h-[400px] p-0 relative bg-grid-lines">
            <div className="absolute inset-0 flex items-center justify-center p-12">
               <svg viewBox="0 0 800 200" className="w-full text-ink opacity-10">
                 <path d="M0 150 C 100 140 150 80 200 90 S 300 160 400 130 S 550 20 650 50 S 750 80 800 40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
               </svg>
               <svg viewBox="0 0 800 200" className="absolute inset-x-12 w-[calc(100%-96px)] text-ink">
                 <path d="M0 180 C 80 170 120 110 160 120 S 240 190 320 160 S 440 50 520 80 S 600 110 640 70 S 720 30 800 10" fill="none" stroke="currentColor" strokeWidth="3" />
                 <path d="M0 180 C 80 170 120 110 160 120 S 240 190 320 160 S 440 50 520 80 S 600 110 640 70 S 720 30 800 10 L 800 200 L 0 200 Z" fill="currentColor" fillOpacity="0.03" />
               </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
            <CardTitle className="text-[15px] font-semibold">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-line">
                {[
                  { source: "twitter.com", visits: "4,201", rev: "$12,400" },
                  { source: "indiehackers.com", visits: "2,842", rev: "$8,210" },
                  { source: "producthunt.com", visits: "1,506", rev: "$4,300" },
                  { source: "news.ycombinator.com", visits: "942", rev: "$2,100" },
                  { source: "youtube.com", visits: "432", rev: "$1,240" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-medium text-ink">{r.source}</p>
                      <p className="text-[11px] text-ink-muted">{r.visits} visits</p>
                    </div>
                    <p className="text-[13px] font-bold text-ink">{r.rev}</p>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, delta, isPositive }: any) {
  return (
    <Card className="rounded-2xl border-line shadow-soft transition-all hover:shadow-card">
      <CardContent className="p-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">{title}</p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-[28px] font-bold tracking-tight text-ink">{value}</p>
          <div className={cn(
            "flex items-center gap-0.5 text-[12px] font-bold",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

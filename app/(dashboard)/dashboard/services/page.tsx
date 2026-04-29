import {
  Briefcase, Plus, Search, MoreHorizontal, Pencil, Star, CheckCircle2, Clock,
  Package, Users, TrendingUp, DollarSign, Calendar, ArrowRight, Sparkles,
  ChevronRight, Globe, Eye, Trash2, Copy, Layers,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getServices, getServiceStats } from "@/lib/queries/dashboard";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Services — Service Builder Studio", description: "Build, package, and sell your professional services." };

export default async function ServicesDashboard() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;
  const [services, stats] = await Promise.all([getServices(creator.id), getServiceStats(creator.id)]);

  const published = services.filter(s => s.status === "PUBLISHED").length;
  const drafts = services.filter(s => s.status === "DRAFT").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Service Studio</h1>
          <p className="text-[14px] text-ink-muted mt-1">Build, package, and sell your professional services.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/services/new">
            <Button className="rounded-xl h-10 px-5 bg-ink text-paper shadow-float hover:bg-ink/90 font-medium text-[13px]">
              <Plus className="mr-2 h-4 w-4" /> New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Briefcase} label="Active Services" value={published.toString()} color="bg-blue-50 text-blue-600" />
        <KpiCard icon={Pencil} label="Drafts" value={drafts.toString()} color="bg-amber-50 text-amber-600" />
        <KpiCard icon={CheckCircle2} label="Completed" value={String(stats.totalSales)} color="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={Star} label="Avg Rating" value={String(stats.avgRating)} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Service Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-ink">Your Services</h2>
            <p className="text-[13px] text-ink-muted">{services.length} service{services.length !== 1 ? "s" : ""} total · {published} live</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <Input className="h-9 pl-9 rounded-lg border-line text-[12px]" placeholder="Search services..." />
            </div>
          </div>
        </div>

        {services.length === 0 ? (
          <Card className="rounded-3xl border-line bg-paper shadow-none">
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-paper-soft border border-line flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-[20px] font-bold text-ink mb-2">Package your expertise</h3>
              <p className="text-[14px] text-ink-muted max-w-[420px] leading-relaxed mb-6">
                Monetize your skills by offering consulting, coaching, design, development, or any professional service. Set your packages, pricing, and delivery flow.
              </p>
              <Link href="/dashboard/services/new">
                <Button className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
                  <Plus className="mr-2 h-4 w-4" /> Create First Service
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((service) => (
              <Link key={service.id} href={`/dashboard/services/${service.slug}`}>
                <Card className="group rounded-2xl border-line bg-paper hover:border-indigo-200 hover:shadow-soft transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                  {/* Header bar */}
                  <div className="h-2" style={{ backgroundColor: service.category === "Consulting" ? "#6366f1" : service.category === "Design" ? "#ec4899" : service.category === "Development" ? "#10b981" : service.category === "Coaching" ? "#f59e0b" : "#6b7280" }} />
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-paper-soft border border-line flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                        <Briefcase className="h-5 w-5 text-ink-muted group-hover:text-indigo-600" />
                      </div>
                      <Badge className={cn("rounded-full text-[10px] font-bold px-2.5 py-0.5", service.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                        {service.status === "PUBLISHED" ? "Live" : "Draft"}
                      </Badge>
                    </div>

                    <h3 className="text-[15px] font-bold text-ink line-clamp-1 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                    {service.category && <p className="text-[12px] text-ink-muted mt-1">{service.category}</p>}

                    <div className="mt-auto pt-4 border-t border-line flex items-center justify-between">
                      <span className="text-[16px] font-bold text-ink">{service.price}</span>
                      <div className="flex items-center gap-3 text-[11px] text-ink-muted">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.deliveryDays}d</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {service.sales}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-[11px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Builder <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Templates */}
      <div className="space-y-4 pt-4">
        <h2 className="text-[18px] font-bold text-ink">Quick-start Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: "Consulting", desc: "1-on-1 advisory", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
            { icon: Users, label: "Coaching", desc: "Group or 1-on-1", color: "bg-amber-50 text-amber-600 border-amber-200" },
            { icon: Package, label: "Done-for-you", desc: "Full delivery", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
            { icon: Calendar, label: "Retainer", desc: "Monthly ongoing", color: "bg-violet-50 text-violet-600 border-violet-200" },
          ].map((t) => (
            <div key={t.label} className="p-4 rounded-2xl border border-line bg-paper hover:border-indigo-200 hover:shadow-soft transition-all cursor-pointer group/template">
              <div className={`w-9 h-9 rounded-xl ${t.color} flex items-center justify-center mb-3`}>
                <t.icon className="h-4 w-4" />
              </div>
              <p className="text-[13px] font-bold text-ink">{t.label}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.desc}</p>
              <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 mt-2 opacity-0 group-hover/template:opacity-100 transition-opacity">
                Use Template <ArrowRight className="h-2.5 w-2.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <Card className="rounded-2xl border-line shadow-none bg-paper">
      <CardContent className="p-5 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
        <div><p className="text-[24px] font-bold text-ink leading-none">{value}</p><p className="text-[11px] text-ink-muted font-medium">{label}</p></div>
      </CardContent>
    </Card>
  );
}

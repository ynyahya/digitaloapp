import {
  Ticket, Plus, Search, MoreHorizontal, Pencil, Calendar, Users, MapPin,
  Globe, Clock, TrendingUp, ArrowRight, Sparkles, Eye, Layers,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getEvents, getEventStats } from "@/lib/queries/dashboard";

export const metadata = { title: "Events — Digital Event Studio", description: "Host and sell tickets for live events, webinars, and workshops." };

export default async function EventsDashboard() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;
  const [events, stats] = await Promise.all([getEvents(creator.id), getEventStats(creator.id)]);

  const live = events.filter(e => e.status === "PUBLISHED").length;
  const drafts = events.filter(e => e.status === "DRAFT").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Event Studio</h1>
          <p className="text-[14px] text-ink-muted mt-1">Host and sell tickets for live events, webinars, workshops, and masterclasses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/events/new">
            <Button className="rounded-xl h-10 px-5 bg-ink text-paper shadow-float hover:bg-ink/90 font-medium text-[13px]">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Calendar} label="Upcoming" value={String(stats.upcoming)} color="bg-rose-50 text-rose-600" />
        <KpiCard icon={CheckCircle2} label="Past Events" value={String(stats.past)} color="bg-blue-50 text-blue-600" />
        <KpiCard icon={Users} label="Attendees" value={String(stats.totalAttendees)} color="bg-emerald-50 text-emerald-600" />
        <KpiCard icon={Globe} label="Live Now" value={live.toString()} color="bg-violet-50 text-violet-600" />
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-ink">Your Events</h2>
            <p className="text-[13px] text-ink-muted">{events.length} event{events.length !== 1 ? "s" : ""} · {live} live</p>
          </div>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <Input className="h-9 pl-9 rounded-lg border-line text-[12px]" placeholder="Search events..." />
          </div>
        </div>

        {events.length === 0 ? (
          <Card className="rounded-3xl border-line bg-paper shadow-none">
            <CardContent className="p-16 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-paper-soft border border-line flex items-center justify-center mb-6">
                <Ticket className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-[20px] font-bold text-ink mb-2">Host your first event</h3>
              <p className="text-[14px] text-ink-muted max-w-[420px] leading-relaxed mb-6">
                Create webinars, workshops, live classes, or virtual conferences. Sell tickets, manage registrations, and engage your audience.
              </p>
              <Link href="/dashboard/events/new">
                <Button className="rounded-xl h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
                  <Plus className="mr-2 h-4 w-4" /> Create First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {events.map((event) => (
              <Link key={event.id} href={`/dashboard/events/builder?slug=${event.slug}`}>
                <Card className="group rounded-2xl border-line bg-paper hover:border-indigo-200 hover:shadow-soft transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                  <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 flex items-center justify-center relative">
                    <Calendar className="h-8 w-8 text-white/50" />
                    <div className="absolute top-3 left-3">
                      <Badge className={cn("rounded-full text-[10px] font-bold px-2.5 py-0.5", event.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                        {event.status === "PUBLISHED" ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-bold text-ink line-clamp-1 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] text-ink-muted">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.startDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-line flex items-center justify-between">
                      <span className="text-[15px] font-bold text-ink">{event.price}</span>
                      <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                        <Users className="h-3 w-3" /> {event.registered}/{event.maxAttendees || "∞"}
                      </span>
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

      {/* Event Types */}
      <div className="space-y-4 pt-4">
        <h2 className="text-[18px] font-bold text-ink">Event Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: "Webinar", desc: "Online presentation", color: "bg-blue-50 text-blue-600 border-blue-200" },
            { icon: Users, label: "Workshop", desc: "Interactive session", color: "bg-amber-50 text-amber-600 border-amber-200" },
            { icon: Layers, label: "Masterclass", desc: "Expert deep-dive", color: "bg-violet-50 text-violet-600 border-violet-200" },
            { icon: Calendar, label: "Conference", desc: "Multi-session event", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
          ].map((t) => (
            <div key={t.label} className="p-4 rounded-2xl border border-line bg-paper hover:border-indigo-200 hover:shadow-soft transition-all cursor-pointer group/template">
              <div className={`w-9 h-9 rounded-xl ${t.color} flex items-center justify-center mb-3`}><t.icon className="h-4 w-4" /></div>
              <p className="text-[13px] font-bold text-ink">{t.label}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">{t.desc}</p>
              <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 mt-2 opacity-0 group-hover/template:opacity-100 transition-opacity">
                Create <ArrowRight className="h-2.5 w-2.5" />
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

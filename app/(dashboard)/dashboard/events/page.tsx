import { ArrowRight, Calendar, CheckCircle2, Clock, Globe, MapPin, Mic, Search, Sparkles, Ticket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { getEvents, getEventStats } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";
import { CommandHero, EmptyCommandState, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Events — TESKEL EventOS", description: "Host premium events, workshops, webinars, and masterclasses." };

type EventItem = Awaited<ReturnType<typeof getEvents>>[number];

export default async function EventsDashboard() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;
  const [events, stats] = await Promise.all([getEvents(creator.id), getEventStats(creator.id)]);

  const live = events.filter((event) => event.status === "PUBLISHED").length;
  const drafts = events.filter((event) => event.status === "DRAFT").length;
  const totalCapacity = events.reduce((sum, event) => sum + (event.maxAttendees || 0), 0);
  const fillRate = totalCapacity > 0 ? Math.round((events.reduce((sum, event) => sum + event.registered, 0) / totalCapacity) * 100) : 0;
  const focusEvent = events.map((event) => ({ event, readiness: getEventReadiness(event) })).sort((a, b) => a.readiness.score - b.readiness.score)[0];

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="EventOS Command Center"
        title="Bangun event yang terasa seperti produk premium, bukan sekadar form registrasi."
        description="Rancang konsep, schedule, ticketing, agenda, speaker trust, registration questions, dan launch readiness untuk webinar, workshop, masterclass, atau conference."
        primaryHref="/dashboard/events/new"
        primaryLabel="Create event"
        secondaryHref="/dashboard/events/builder"
        secondaryLabel="Open event builder"
        icon={Ticket}
        accent="from-rose-400/20 via-violet-400/10 to-transparent"
      >
        <WorkflowRail
          title="Event launch path"
          items={[
            { label: "Concept", description: "Outcome, audience, and event promise", done: events.some((event) => Boolean(event.description)) },
            { label: "Schedule", description: "Time, timezone, capacity, and location", done: events.some((event) => event.hasSchedule) },
            { label: "Tickets", description: "Pricing tiers and registration capacity", done: events.some((event) => event.ticketCount > 0) },
            { label: "Program", description: "Agenda, speakers, and registration questions", done: events.some((event) => event.hasAgenda || event.speakerCount > 0) },
            { label: "Launch", description: "Publish and fill the room", done: live > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Calendar} label="Upcoming" value={stats.upcoming} helper={`${drafts} draft events in production`} tone="rose" />
        <MetricTile icon={Users} label="Attendees" value={stats.totalAttendees} helper="Registered across live events" tone="emerald" />
        <MetricTile icon={CheckCircle2} label="Past events" value={stats.past} helper="Reusable proof and replay assets" tone="blue" />
        <MetricTile icon={Ticket} label="Fill rate" value={`${fillRate}%`} helper={`${live} live event${live === 1 ? "" : "s"}`} tone="lime" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-chalk">Event production board</h2>
              <p className="text-[13px] text-chalk-muted">{events.length} event total · schedule, tickets, and program health visible</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-chalk-muted" />
              <Input className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search events..." />
            </div>
          </div>

          {events.length === 0 ? (
            <EmptyCommandState icon={Ticket} title="Host your first premium event" description="Create a focused event with a strong outcome, clear ticketing, useful registration questions, and a program people want to attend." href="/dashboard/events/new" label="Create first event" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Next production move</p>
              {focusEvent ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-[18px] font-bold text-chalk">{focusEvent.event.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-chalk-muted">{focusEvent.readiness.nextAction}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-lime" style={{ width: `${focusEvent.readiness.score}%` }} /></div>
                  <Button asChild className="h-10 w-full rounded-2xl bg-lime text-night">
                    <Link href={`/dashboard/events/${focusEvent.event.slug}/builder`}>Open event builder<ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              ) : <p className="mt-4 text-[13px] leading-5 text-chalk-muted">Create an event to unlock production guidance.</p>}
            </CardContent>
          </Card>

          <PlaybookCard icon={Mic} title="High-conversion event system" description="Event premium butuh clarity sebelum ticketing." steps={["Sell the transformation", "Make schedule and capacity explicit", "Add speakers or host credibility", "Use questions to personalize follow-up"]} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Globe, title: "Webinar", description: "Fast education and demand capture", steps: ["Hook", "Teaching", "Offer"] },
          { icon: Users, title: "Workshop", description: "Interactive cohort-style session", steps: ["Outcome", "Exercise", "Q&A"] },
          { icon: Sparkles, title: "Masterclass", description: "Premium single-topic deep dive", steps: ["Authority", "Agenda", "Replay"] },
          { icon: Calendar, title: "Conference", description: "Multi-speaker event format", steps: ["Tracks", "Speakers", "Tickets"] },
        ].map((template) => <PlaybookCard key={template.title} icon={template.icon} title={template.title} description={template.description} steps={template.steps} />)}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const readiness = getEventReadiness(event);
  const capacityLabel = event.maxAttendees ? `${event.registered}/${event.maxAttendees}` : `${event.registered}/∞`;

  return (
    <Link href={`/dashboard/events/${event.slug}/builder`}>
      <Card className="group h-full overflow-hidden rounded-3xl border-white/[0.08] bg-night/70 shadow-soft transition-all hover:-translate-y-0.5 hover:border-lime/25 hover:shadow-card">
        <div className="h-24 bg-gradient-to-br from-indigo-500 via-violet-500 to-rose-500 p-4">
          <div className="flex items-start justify-between"><Ticket className="h-7 w-7 text-white/75" /><StatusBadge status={event.status} /></div>
        </div>
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="line-clamp-1 text-[16px] font-bold text-chalk group-hover:text-lime">{event.title}</h3>
            <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-chalk-muted">{event.description || "Add a clear event promise so people know why they should attend."}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat icon={Clock} value={event.startDate} label="Schedule" />
            <MiniStat icon={MapPin} value={event.locationType} label="Mode" />
            <MiniStat icon={Users} value={capacityLabel} label="Seats" />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <HealthPill label="Tickets" done={event.ticketCount > 0} />
            <HealthPill label="Agenda" done={event.hasAgenda} />
            <HealthPill label="Host" done={event.speakerCount > 0} />
            <HealthPill label="Design" done={event.hasCover} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-chalk-dim"><span>Launch readiness</span><span>{readiness.score}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className={cn("h-full rounded-full", readiness.score >= 80 ? "bg-emerald-500" : readiness.score >= 50 ? "bg-amber-500" : "bg-lime")} style={{ width: `${readiness.score}%` }} /></div>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
            <p className="text-[13px] font-bold text-chalk">{event.price}</p>
            <ArrowRight className="h-4 w-4 text-chalk-dim transition-transform group-hover:translate-x-1 group-hover:text-chalk" />
          </div>
        </CardContent>
      </Card>
    </Link>
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

function HealthPill({ label, done }: { label: string; done: boolean }) {
  return <div className={cn("rounded-full px-2 py-1 text-[10px] font-bold", done ? "border border-lime/20 bg-lime/10 text-lime" : "bg-white/[0.06] text-chalk-dim")}>{label}</div>;
}

function getEventReadiness(event: EventItem) {
  const checks = [
    { done: Boolean(event.title && event.description), next: "Write the event outcome and audience promise." },
    { done: event.hasSchedule, next: "Set the start/end schedule and timezone." },
    { done: event.ticketCount > 0, next: "Add at least one ticket tier." },
    { done: event.hasAgenda || event.speakerCount > 0, next: "Add agenda and host credibility." },
    { done: event.status === "PUBLISHED", next: "Publish the event and start filling seats." },
  ];
  const score = Math.round((checks.filter((check) => check.done).length / checks.length) * 100);
  return { score, nextAction: checks.find((check) => !check.done)?.next ?? "Event is live. Improve registration conversion next." };
}

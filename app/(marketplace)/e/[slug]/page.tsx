import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Globe, MapPin, Mic, Sparkles, Ticket, Users } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PublicGlassCard, PublicMetricPill, PublicOfferingShell, PublicSection, PublicStickyCTA } from "@/components/public-offering/public-offering";
import { creatorHref } from "@/lib/routes/public";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await db.event.findFirst({ where: { slug: params.slug, status: "PUBLISHED" }, select: { title: true, description: true, coverImage: true } });
  if (!event) return {};
  return { title: event.title, description: event.description ?? undefined, openGraph: event.coverImage ? { images: [event.coverImage] } : undefined };
}

export default async function PublicEventPage({ params }: { params: { slug: string } }) {
  const event = await db.event.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      creator: { select: { handle: true, displayName: true, avatarUrl: true, verified: true } },
      tickets: { where: { hidden: false }, orderBy: { position: "asc" } },
      speakers: { orderBy: { position: "asc" } },
      questions: { orderBy: { position: "asc" } },
    },
  });
  if (!event) notFound();

  const startDate = event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Date TBD";
  const startTime = event.startDate ? new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "Time TBD";
  const lowestTicket = event.tickets.length ? event.tickets.reduce((min, ticket) => ticket.priceCents < min.priceCents ? ticket : min, event.tickets[0]) : null;
  const priceLabel = lowestTicket ? (lowestTicket.priceCents === 0 ? "Free" : `From ${formatCurrency(lowestTicket.priceCents, event.currency)}`) : event.priceCents === 0 ? "Free" : formatCurrency(event.priceCents, event.currency);
  const locationLabel = event.locationType === "ONLINE" ? "Online event" : event.locationType === "HYBRID" ? "Hybrid event" : event.venueAddress || "Venue TBD";
  const registered = event.registeredCount;
  const capacity = event.maxAttendees || null;
  const ticketHref = "#tickets";

  return (
    <PublicOfferingShell>
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(180,243,0,0.2),transparent_34%),radial-gradient(circle_at_84%_12%,rgba(124,92,255,0.2),transparent_34%)]" />
        <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-eyebrow uppercase text-lime"><Sparkles className="h-3.5 w-3.5" /> {event.locationType === "ONLINE" ? "Online Event" : "Live Event"}</span>
            <h1 className="mt-6 max-w-4xl text-[46px] font-black leading-[0.95] tracking-[-0.055em] text-chalk md:text-[76px]">{event.title}</h1>
            {event.description ? <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-chalk-muted md:text-[20px]">{event.description}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3 text-[13px] text-chalk-muted">
              <PublicMetricPill icon={Calendar}>{startDate}</PublicMetricPill>
              <PublicMetricPill icon={Clock}>{startTime} {event.timezone}</PublicMetricPill>
              <PublicMetricPill icon={event.locationType === "ONLINE" ? Globe : MapPin}>{locationLabel}</PublicMetricPill>
              <PublicMetricPill icon={Users}>{capacity ? `${registered}/${capacity} seats` : `${registered} registered`}</PublicMetricPill>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={ticketHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow">Register now <ArrowRight className="h-4 w-4" /></a>
              <Link href={creatorHref(event.creator.handle)} className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] px-6 text-[14px] font-bold text-chalk hover:bg-white/[0.06]">Hosted by {event.creator.displayName}</Link>
            </div>
          </div>

          <PublicGlassCard className="self-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Ticket desk</p>
            <p className="mt-3 text-[42px] font-black tracking-[-0.05em] text-chalk">{priceLabel}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">Reserve your place for this session. Ticket availability and access details are confirmed at registration.</p>
            <div className="mt-5 grid gap-2 text-[13px] text-chalk-muted">
              <span className="flex items-center gap-2"><Ticket className="h-4 w-4 text-lime" /> {event.tickets.length || 1} ticket option{event.tickets.length === 1 ? "" : "s"}</span>
              <span className="flex items-center gap-2"><Mic className="h-4 w-4 text-lime" /> {event.speakers.length || 1} host/speaker</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-lime" /> {capacity ? `${Math.max(capacity - registered, 0)} seats left` : "Open capacity"}</span>
            </div>
            <a href={ticketHref} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime text-[14px] font-bold text-night lime-shadow">Select ticket <ArrowRight className="h-4 w-4" /></a>
          </PublicGlassCard>
        </div>
      </section>

      <PublicSection eyebrow="Event details" title="Everything you need before joining" description="Schedule, access, ticket options, and host context are kept clear so registration feels confident.">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={Calendar} label="Date" value={startDate} />
          <InfoCard icon={Clock} label="Time" value={`${startTime} ${event.timezone}`} />
          <InfoCard icon={event.locationType === "ONLINE" ? Globe : MapPin} label="Location" value={locationLabel} />
        </div>
      </PublicSection>

      {event.agenda ? (
        <PublicSection eyebrow="Program" title="Agenda" description="A clear flow helps attendees understand the transformation before registering.">
          <PublicGlassCard><pre className="whitespace-pre-wrap font-sans text-[14px] leading-7 text-chalk-muted">{event.agenda}</pre></PublicGlassCard>
        </PublicSection>
      ) : null}

      {event.speakers.length > 0 ? (
        <PublicSection eyebrow="Hosts" title="Speakers and facilitators">
          <div className="grid gap-4 md:grid-cols-2">
            {event.speakers.map((speaker) => (
              <PublicGlassCard key={speaker.id} className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime/10 text-[18px] font-black text-lime">{speaker.name[0]}</div>
                <div><p className="text-[16px] font-bold text-chalk">{speaker.name}</p>{speaker.title ? <p className="mt-1 text-[12px] text-chalk-muted">{speaker.title}</p> : null}{speaker.bio ? <p className="mt-3 text-[13px] leading-6 text-chalk-muted">{speaker.bio}</p> : null}</div>
              </PublicGlassCard>
            ))}
          </div>
        </PublicSection>
      ) : null}

      <PublicSection eyebrow="Registration" title="Choose your ticket" className="pb-28" >
        <div id="tickets" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {(event.tickets.length ? event.tickets : [{ id: "general", name: "General Admission", description: null, priceCents: event.priceCents, currency: event.currency, quantity: event.maxAttendees || null, remainingCount: event.maxAttendees || 0 }]).map((ticket) => (
              <PublicGlassCard key={ticket.id} className="flex items-center justify-between gap-4">
                <div><p className="text-[15px] font-bold text-chalk">{ticket.name}</p>{ticket.description ? <p className="mt-1 text-[12px] text-chalk-muted">{ticket.description}</p> : null}{ticket.quantity ? <p className="mt-2 text-[11px] text-chalk-dim">{ticket.remainingCount}/{ticket.quantity} remaining</p> : null}</div>
                <p className="text-[18px] font-black text-lime">{ticket.priceCents === 0 ? "Free" : formatCurrency(ticket.priceCents, event.currency)}</p>
              </PublicGlassCard>
            ))}
          </div>
          <PublicGlassCard className="h-fit">
            <p className="text-[13px] font-bold text-chalk">Registration note</p>
            <p className="mt-2 text-[13px] leading-6 text-chalk-muted">Ticket checkout is being prepared for this event. Use the creator profile to contact the host if registration is not yet connected.</p>
            <Link href={creatorHref(event.creator.handle)} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-lime text-[13px] font-bold text-night">View host profile</Link>
          </PublicGlassCard>
        </div>
      </PublicSection>
      <PublicStickyCTA label="Register" href="#tickets" detail={priceLabel} />
    </PublicOfferingShell>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return <PublicGlassCard><Icon className="h-5 w-5 text-lime" /><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-chalk-dim">{label}</p><p className="mt-2 text-[15px] font-bold text-chalk">{value}</p></PublicGlassCard>;
}

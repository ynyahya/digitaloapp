import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Globe, Users, Ticket, Star, ArrowLeft } from "lucide-react";
import Image from "next/image";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await db.event.findFirst({ where: { slug: params.slug, status: "PUBLISHED" }, select: { title: true, description: true } });
  if (!event) return {};
  return { title: event.title, description: event.description ?? undefined };
}

export default async function PublicEventPage({ params }: { params: { slug: string } }) {
  const event = await db.event.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      creator: { select: { handle: true, displayName: true, avatarUrl: true, verified: true } },
      tickets: { where: { hidden: false }, orderBy: { position: "asc" } },
      speakers: { orderBy: { position: "asc" } },
    },
  });
  if (!event) notFound();

  const EVENTS_THEMES: Record<string, { bg: string; accent: string }> = {
    minimal: { bg: "bg-gradient-to-br from-gray-50 to-gray-100", accent: "#374151" },
    ocean: { bg: "bg-gradient-to-br from-blue-400 to-cyan-600", accent: "#0ea5e9" },
    sunset: { bg: "bg-gradient-to-br from-orange-400 to-rose-600", accent: "#f43f5e" },
    forest: { bg: "bg-gradient-to-br from-emerald-400 to-teal-700", accent: "#10b981" },
    midnight: { bg: "bg-gradient-to-br from-slate-800 to-indigo-950", accent: "#6366f1" },
    sunrise: { bg: "bg-gradient-to-br from-amber-300 to-orange-500", accent: "#f59e0b" },
    lavender: { bg: "bg-gradient-to-br from-purple-400 to-pink-500", accent: "#a855f7" },
    mint: { bg: "bg-gradient-to-br from-teal-300 to-emerald-500", accent: "#14b8a6" },
    coral: { bg: "bg-gradient-to-br from-rose-400 to-pink-600", accent: "#e11d48" },
    slate: { bg: "bg-gradient-to-br from-slate-500 to-slate-800", accent: "#64748b" },
  };

  const theme = EVENTS_THEMES[event.themeId || "minimal"] || EVENTS_THEMES.minimal;
  const startDate = event.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Date TBD";
  const startTime = event.startDate ? new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

  return (
    <div className="min-h-screen bg-paper">
      {/* Navbar spacer + simple back nav */}
      <header className="sticky top-0 z-50 h-16 border-b border-line bg-paper/80 backdrop-blur-xl flex items-center">
        <div className="max-w-[1200px] mx-auto w-full px-6 flex items-center justify-between">
          <Link href="/" className="text-[13px] font-medium text-ink-muted hover:text-ink flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> TESKEL
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-ink">
              {event.tickets.length > 0 ? (event.tickets[0].priceCents === 0 ? "Free" : `From ${formatCurrency(Math.min(...event.tickets.map(t => t.priceCents)), event.currency)}`) : "Free"}
            </span>
            <Button className="rounded-xl h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold">
              Register Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-line">
        <div className={theme.bg + " h-64 md:h-80 flex items-end p-8 md:p-12 relative"}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 max-w-[1200px] mx-auto w-full">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider border border-white/20">
              {event.locationType === "ONLINE" ? "Online Event" : "In-Person Event"}
            </span>
            <h1 className="text-[36px] md:text-[56px] font-extrabold text-white mt-4 leading-[1.05] tracking-tight max-w-3xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16">
          {/* Left */}
          <div className="space-y-12">
            {/* Date/Time/Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-line bg-paper space-y-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <p className="text-[11px] font-bold text-ink-muted uppercase">Date</p>
                <p className="text-[15px] font-bold text-ink">{startDate}</p>
              </div>
              <div className="p-5 rounded-2xl border border-line bg-paper space-y-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                <p className="text-[11px] font-bold text-ink-muted uppercase">Time</p>
                <p className="text-[15px] font-bold text-ink">{startTime || "TBD"} {event.timezone}</p>
              </div>
              <div className="p-5 rounded-2xl border border-line bg-paper space-y-2">
                {event.locationType === "ONLINE" ? <Globe className="h-5 w-5 text-indigo-500" /> : <MapPin className="h-5 w-5 text-indigo-500" />}
                <p className="text-[11px] font-bold text-ink-muted uppercase">Location</p>
                <p className="text-[15px] font-bold text-ink">{event.locationType === "ONLINE" ? "Online" : (event.venueAddress || "TBD")}</p>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="prose prose-neutral max-w-none prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-ink-muted">
                {event.description.split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
              </div>
            )}

            {/* Speakers */}
            {event.speakers.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-[24px] font-extrabold text-ink">Speakers</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.speakers.map(speaker => (
                    <div key={speaker.id} className="flex items-center gap-4 p-5 rounded-2xl border border-line bg-paper-soft">
                      <div className="w-14 h-14 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[16px] font-bold text-indigo-600">
                        {speaker.name[0]}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-ink">{speaker.name}</p>
                        {speaker.title && <p className="text-[12px] text-ink-muted">{speaker.title}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Ticket Card */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border border-line bg-paper shadow-card overflow-hidden">
              <div className="p-6 space-y-5">
                <h3 className="text-[16px] font-extrabold text-ink">Select Ticket</h3>
                {event.tickets.length === 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-paper-soft border border-line">
                      <span className="text-[14px] font-bold text-ink">General Admission</span>
                      <span className="text-[14px] font-bold text-emerald-600">Free</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {event.tickets.map(ticket => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-paper-soft border border-line hover:border-indigo-300 transition-colors cursor-pointer">
                        <div>
                          <p className="text-[14px] font-bold text-ink">{ticket.name}</p>
                          {ticket.quantity && <p className="text-[11px] text-ink-muted">{ticket.remainingCount}/{ticket.quantity} remaining</p>}
                        </div>
                        <span className="text-[14px] font-extrabold text-ink">{ticket.priceCents === 0 ? "Free" : formatCurrency(ticket.priceCents, event.currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button className="w-full h-14 rounded-2xl text-[16px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                  Register Now
                </Button>
                <p className="text-[11px] text-center text-ink-muted">Free cancellation up to 24h before</p>
              </div>
            </div>

            {/* Creator Card */}
            <div className="p-5 rounded-2xl border border-line bg-paper-soft flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[12px] font-bold text-indigo-600">
                {event.creator.displayName[0]}
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink">Hosted by {event.creator.displayName}</p>
                <Link href={`/c/${event.creator.handle}`} className="text-[11px] text-indigo-600 font-medium">View profile →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

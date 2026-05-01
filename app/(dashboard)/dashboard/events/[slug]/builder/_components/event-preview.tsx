import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import type { EventBuilderData } from "./event-types";

export function EventPreview({ event }: { event: EventBuilderData }) {
  const start = event.startDate ? new Date(event.startDate) : null;
  const location = event.locationType === "ONLINE" ? event.onlineUrl || "Online link TBD" : event.venueAddress || "Venue TBD";
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-night-raised shadow-2xl shadow-black/30">
      <div className="relative min-h-48 border-b border-white/[0.08] bg-lime-glow p-5">
        <div className="absolute inset-0 grid-dark-fine opacity-25" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">{event.locationType}</span>
          <h3 className="mt-4 text-[28px] font-black leading-tight tracking-[-0.04em] text-chalk">{event.title || "Untitled event"}</h3>
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-chalk-muted">{event.description || "Add a compelling event description for attendees."}</p>
        </div>
      </div>
      <div className="grid gap-2 p-5 text-[12px] text-chalk-muted">
        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-lime" /> {start ? start.toLocaleString() : "Date TBD"} · {event.timezone}</span>
        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-lime" /> {location}</span>
        <span className="flex items-center gap-2"><Ticket className="h-4 w-4 text-lime" /> {event.tickets.length || 0} ticket tier{event.tickets.length === 1 ? "" : "s"}</span>
        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-lime" /> {event.maxAttendees > 0 ? `${event.maxAttendees} capacity` : "Unlimited capacity"}</span>
      </div>
      <div className="px-5 pb-5">
        <button className="flex h-11 w-full items-center justify-center rounded-2xl bg-lime text-[13px] font-bold text-night lime-shadow">Register now</button>
        {event.questions.length > 0 ? (
          <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">Registration preview</p>
            <div className="mt-3 space-y-2">
              {event.questions.slice(0, 3).map((question) => (
                <div key={question.id} className="rounded-xl border border-white/[0.08] bg-night/70 px-3 py-2">
                  <p className="text-[11px] font-bold text-chalk">{question.label}{question.required ? " *" : ""}</p>
                  <p className="mt-1 text-[10px] text-chalk-dim">{question.questionType.toLowerCase()} answer</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, FileText, MapPin, Mic, Palette, Sparkles, Ticket, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderCanvas, BuilderDevicePreview, BuilderField, BuilderHeader, BuilderInput, BuilderLaunchCenter, BuilderPreviewRail, BuilderReadinessPanel, BuilderSectionCard, BuilderShell, BuilderSidebar, BuilderTextarea } from "@/components/builder";
import { useBuilderState } from "@/hooks/use-builder-state";
import { getEventReadiness } from "@/lib/builder/readiness/event";
import { summarizeReadiness } from "@/lib/builder/readiness/score";
import { createTicketType, deleteTicketType, updateTicketType, createRegistrationQuestion, updateRegistrationQuestion, deleteRegistrationQuestion, updateSpeaker, removeSpeaker } from "@/lib/actions/events-builder";
import { updateEvent, publishEvent, unpublishEvent } from "@/lib/actions/offerings";
import { updateEventDetails, updateEventTheme, addSpeaker } from "@/lib/actions/events-builder";
import { EventPreview } from "./event-preview";
import type { EventBuilderData } from "./event-types";

function scrollToSection(id: string) {
  document.querySelector(`[data-builder-section="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toLocalInputValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function sanitizeEventFields(fields: Partial<EventBuilderData>) {
  const payload: Record<string, any> = {};
  const allowed = ["title", "description", "locationType", "venueAddress", "onlineUrl", "startDate", "endDate", "timezone", "priceCents", "currency", "maxAttendees", "status", "coverImage"];
  for (const key of allowed) {
    if (key in fields) payload[key] = (fields as Record<string, any>)[key];
  }
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);
  return payload;
}

function EventWorkspace({ initialEvent }: { initialEvent: EventBuilderData }) {
  const [activeSection, setActiveSection] = useState("details");
  const builder = useBuilderState<EventBuilderData>({
    initialData: initialEvent,
    save: async (fields) => {
      const eventFields = sanitizeEventFields(fields);
      const tasks: Promise<unknown>[] = [];
      if (Object.keys(eventFields).length > 0) tasks.push(updateEvent(initialEvent.id, eventFields));
      if ("agenda" in fields || "guestListVisibility" in fields) tasks.push(updateEventDetails(initialEvent.id, { agenda: fields.agenda, guestListVisibility: fields.guestListVisibility }));
      if ("themeId" in fields || "themeConfig" in fields) tasks.push(updateEventTheme(initialEvent.id, { themeId: fields.themeId, themeConfig: fields.themeConfig }));
      await Promise.all(tasks);
    },
  });
  const event = builder.data;
  const checks = useMemo(() => getEventReadiness(event), [event]);
  const summary = useMemo(() => summarizeReadiness(checks), [checks]);
  const sectionComplete = (id: string) => checks.filter((check) => check.targetSection === id && check.severity === "required").every((check) => check.done);
  const selectSection = (id: string) => {
    setActiveSection(id);
    scrollToSection(id);
  };
  const publish = async () => {
    if (!summary.canPublish) return;
    await builder.saveNow();
    if (event.status === "PUBLISHED") {
      await unpublishEvent(event.id);
      builder.setField("status", "DRAFT");
    } else {
      await publishEvent(event.id);
      builder.setField("status", "PUBLISHED");
    }
  };
  const addTicket = async () => {
    const ticket = await createTicketType(event.id, { name: "General Admission", priceCents: event.priceCents || 0, currency: event.currency, quantity: event.maxAttendees || null });
    builder.setField("tickets", [...event.tickets, ticket]);
  };
  const updateTicket = async (ticketId: string, fields: Record<string, string | number | boolean | null>) => {
    const ticket = await updateTicketType(ticketId, fields);
    builder.setField("tickets", event.tickets.map((item) => item.id === ticketId ? ticket : item));
  };
  const removeTicket = async (ticketId: string) => {
    await deleteTicketType(ticketId);
    builder.setField("tickets", event.tickets.filter((item) => item.id !== ticketId));
  };
  const addHost = async () => {
    const speaker = await addSpeaker(event.id, { name: "Event host", title: "Host" });
    builder.setField("speakers", [...event.speakers, speaker]);
  };
  const editSpeaker = async (speakerId: string, fields: Record<string, string | number | boolean | null>) => {
    const speaker = await updateSpeaker(speakerId, fields);
    builder.setField("speakers", event.speakers.map((item) => item.id === speakerId ? speaker : item));
  };
  const deleteSpeaker = async (speakerId: string) => {
    await removeSpeaker(speakerId);
    builder.setField("speakers", event.speakers.filter((item) => item.id !== speakerId));
  };
  const addQuestion = async () => {
    const question = await createRegistrationQuestion(event.id, { label: "What do you want to learn?", questionType: "TEXT", required: false });
    builder.setField("questions", [...event.questions, question]);
  };
  const generateEventStarter = async () => {
    const updates: Partial<EventBuilderData> = {
      description: event.description || `Join this focused ${event.locationType === "ONLINE" ? "online" : "in-person"} session to learn practical steps, see examples, and leave with a clear action plan.`,
      agenda: event.agenda || "00:00 Welcome and context\n00:10 Main teaching session\n00:40 Practical walkthrough\n00:55 Q&A and next steps",
      themeId: event.themeId || "teskel-night",
    };
    builder.setFields(updates);
    if (event.tickets.length === 0) {
      const ticket = await createTicketType(event.id, { name: "General Admission", priceCents: event.priceCents || 0, currency: event.currency, quantity: event.maxAttendees || null });
      builder.setField("tickets", [ticket]);
    }
    if (event.questions.length === 0) {
      const question = await createRegistrationQuestion(event.id, { label: "What is your main goal for this event?", questionType: "TEXT", required: false });
      builder.setField("questions", [question]);
    }
    if (event.speakers.length === 0) {
      const speaker = await addSpeaker(event.id, { name: "Event host", title: "Host", bio: "Add a short host bio to increase trust." });
      builder.setField("speakers", [speaker]);
    }
  };
  const editQuestion = async (questionId: string, fields: Record<string, string | number | boolean | null>) => {
    const question = await updateRegistrationQuestion(questionId, fields);
    builder.setField("questions", event.questions.map((item) => item.id === questionId ? question : item));
  };
  const removeQuestion = async (questionId: string) => {
    await deleteRegistrationQuestion(questionId);
    builder.setField("questions", event.questions.filter((item) => item.id !== questionId));
  };

  return (
    <BuilderShell
      header={<BuilderHeader eyebrow="Event BuilderOS" title={event.title || "Untitled event"} subtitle="Event identity → Tickets → Launch" backHref="/dashboard/events" status={event.status} saveStatus={builder.saveStatus} canUndo={builder.canUndo} canRedo={builder.canRedo} canPublish={summary.canPublish} onSave={builder.saveNow} onUndo={builder.undo} onRedo={builder.redo} onPreview={() => selectSection("preview")} onPublish={publish} publishLabel={event.status === "PUBLISHED" ? "Unpublish" : "Launch"}><Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => void generateEventStarter()}><Sparkles className="h-3.5 w-3.5" /> Generate starter</Button></BuilderHeader>}
      sidebar={<BuilderSidebar activeId={activeSection} readinessScore={summary.score} onSelect={selectSection} items={[
        { id: "details", label: "Identity", description: "Title and description", icon: FileText, complete: sectionComplete("details") },
        { id: "schedule", label: "Schedule", description: "Date and timezone", icon: Calendar, complete: sectionComplete("schedule") },
        { id: "location", label: "Location", description: "Online or venue", icon: MapPin, complete: sectionComplete("location") },
        { id: "tickets", label: "Tickets", description: "Ticket tiers", icon: Ticket, complete: sectionComplete("tickets") },
        { id: "registration", label: "Registration", description: "Questions", icon: FileText, complete: event.questions.length > 0 },
        { id: "speakers", label: "Speakers", description: "Host and speakers", icon: Mic, complete: event.speakers.length > 0 },
        { id: "agenda", label: "Agenda", description: "Session flow", icon: Users, complete: Boolean(event.agenda) },
        { id: "design", label: "Design", description: "Cover and theme", icon: Palette, complete: Boolean(event.coverImage) },
      ]} />}
      inspector={<BuilderPreviewRail><BuilderDevicePreview><EventPreview event={event} /></BuilderDevicePreview><BuilderReadinessPanel checks={checks} onSelect={selectSection} /></BuilderPreviewRail>}
    >
      <BuilderCanvas>
        {builder.error ? <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-[13px] text-red-100">{builder.error}</div> : null}
        <BuilderSectionCard id="details" eyebrow="Step 1" title="Event identity" description="Make the event easy to understand and share." complete={sectionComplete("details")}>
          <div className="grid gap-4">
            <BuilderField label="Event title"><BuilderInput value={event.title} onChange={(e) => builder.setField("title", e.target.value)} /></BuilderField>
            <BuilderField label="Description" hint="Include audience, outcome, and why they should attend."><BuilderTextarea value={event.description ?? ""} onChange={(e) => builder.setField("description", e.target.value)} /></BuilderField>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="schedule" eyebrow="Step 2" title="Schedule" description="Keep date/time and timezone obvious." complete={sectionComplete("schedule")}>
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderField label="Start"><BuilderInput type="datetime-local" value={toLocalInputValue(event.startDate)} onChange={(e) => builder.setField("startDate", e.target.value ? new Date(e.target.value).toISOString() : null)} /></BuilderField>
            <BuilderField label="End"><BuilderInput type="datetime-local" value={toLocalInputValue(event.endDate)} onChange={(e) => builder.setField("endDate", e.target.value ? new Date(e.target.value).toISOString() : null)} /></BuilderField>
            <BuilderField label="Timezone"><BuilderInput value={event.timezone} onChange={(e) => builder.setField("timezone", e.target.value)} /></BuilderField>
            <BuilderField label="Capacity"><BuilderInput type="number" min={0} value={event.maxAttendees} onChange={(e) => builder.setField("maxAttendees", Math.max(0, Number(e.target.value || 0)))} /></BuilderField>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="location" eyebrow="Step 3" title="Location" description="Support online and offline event clarity." complete={sectionComplete("location")}>
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderField label="Location type"><select className="h-11 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15" value={event.locationType} onChange={(e) => builder.setField("locationType", e.target.value)}><option value="ONLINE">Online</option><option value="OFFLINE">Venue</option><option value="HYBRID">Hybrid</option></select></BuilderField>
            <BuilderField label="Online URL"><BuilderInput value={event.onlineUrl ?? ""} onChange={(e) => builder.setField("onlineUrl", e.target.value)} placeholder="https://..." /></BuilderField>
            <BuilderField label="Venue address" className="md:col-span-2"><BuilderInput value={event.venueAddress ?? ""} onChange={(e) => builder.setField("venueAddress", e.target.value)} /></BuilderField>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="tickets" eyebrow="Step 4" title="Tickets" description="Add at least one ticket tier before launch." complete={sectionComplete("tickets")}>
          <div className="space-y-3">
            {event.maxAttendees > 0 && event.tickets.reduce((sum, ticket) => sum + (ticket.quantity ?? 0), 0) > event.maxAttendees ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-[13px] text-amber-100">
                Ticket quantity is higher than event capacity. Reduce ticket quantities or increase capacity.
              </div>
            ) : null}
            {event.tickets.map((ticket) => <div key={ticket.id} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 md:grid-cols-[1fr_150px_130px_44px]">
              <BuilderField label="Ticket name"><BuilderInput value={ticket.name} onChange={(e) => void updateTicket(ticket.id, { name: e.target.value })} /></BuilderField>
              <BuilderField label="Price"><BuilderInput type="number" min={0} value={Math.round(ticket.priceCents / 100)} onChange={(e) => void updateTicket(ticket.id, { priceCents: Math.max(0, Number(e.target.value || 0)) * 100 })} /></BuilderField>
              <BuilderField label="Quantity"><BuilderInput type="number" min={0} value={ticket.quantity ?? 0} onChange={(e) => void updateTicket(ticket.id, { quantity: Number(e.target.value || 0) || null, remainingCount: Number(e.target.value || 0) || 0 })} /></BuilderField>
              <Button type="button" variant="outline" size="icon" className="mt-6 rounded-xl text-red-200" onClick={() => void removeTicket(ticket.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>)}
            <Button type="button" variant="outline" className="rounded-2xl" onClick={addTicket}>Add ticket tier</Button>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="registration" eyebrow="Step 5" title="Registration questions" description="Collect useful context without making registration heavy." complete={event.questions.length > 0}>
          <div className="space-y-3">
            {event.questions.map((question) => <div key={question.id} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 md:grid-cols-[1fr_140px_110px_44px]">
              <BuilderField label="Question"><BuilderInput value={question.label} onChange={(e) => void editQuestion(question.id, { label: e.target.value })} /></BuilderField>
              <BuilderField label="Type"><select className="h-11 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15" value={question.questionType} onChange={(e) => void editQuestion(question.id, { questionType: e.target.value })}><option value="TEXT">Text</option><option value="EMAIL">Email</option><option value="SELECT">Select</option></select></BuilderField>
              <BuilderField label="Required"><select className="h-11 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15" value={question.required ? "yes" : "no"} onChange={(e) => void editQuestion(question.id, { required: e.target.value === "yes" })}><option value="no">Optional</option><option value="yes">Required</option></select></BuilderField>
              <Button type="button" variant="outline" size="icon" className="mt-6 rounded-xl text-red-200" onClick={() => void removeQuestion(question.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>)}
            <Button type="button" variant="outline" className="rounded-2xl" onClick={addQuestion}>Add question</Button>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="speakers" eyebrow="Step 5" title="Speakers" description="Speaker cards make the event more trustworthy." complete={event.speakers.length > 0}>
          <div className="space-y-3">
            {event.speakers.map((speaker) => <div key={speaker.id} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 md:grid-cols-[1fr_1fr_44px]">
              <BuilderField label="Name"><BuilderInput value={speaker.name} onChange={(e) => void editSpeaker(speaker.id, { name: e.target.value })} /></BuilderField>
              <BuilderField label="Title"><BuilderInput value={speaker.title ?? ""} onChange={(e) => void editSpeaker(speaker.id, { title: e.target.value })} /></BuilderField>
              <Button type="button" variant="outline" size="icon" className="mt-6 rounded-xl text-red-200" onClick={() => void deleteSpeaker(speaker.id)}><Trash2 className="h-4 w-4" /></Button>
              <BuilderField label="Bio" className="md:col-span-3"><BuilderTextarea value={speaker.bio ?? ""} onChange={(e) => void editSpeaker(speaker.id, { bio: e.target.value })} /></BuilderField>
            </div>)}
            <Button type="button" variant="outline" className="rounded-2xl" onClick={addHost}>Add host</Button>
          </div>
        </BuilderSectionCard>
        <BuilderSectionCard id="agenda" eyebrow="Step 6" title="Agenda" description="Give attendees a clear session flow." complete={Boolean(event.agenda)}>
          <BuilderField label="Agenda"><BuilderTextarea value={event.agenda ?? ""} onChange={(e) => builder.setField("agenda", e.target.value)} placeholder="10:00 Welcome\n10:10 Main session\n10:50 Q&A" /></BuilderField>
        </BuilderSectionCard>
        <BuilderSectionCard id="design" eyebrow="Step 7" title="Design" description="Keep the event premium dark/lime by default." complete={Boolean(event.coverImage)}>
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderField label="Cover image URL"><BuilderInput value={event.coverImage ?? ""} onChange={(e) => builder.setField("coverImage", e.target.value)} /></BuilderField>
            <BuilderField label="Theme"><select className="h-11 w-full rounded-2xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15" value={event.themeId ?? "teskel-night"} onChange={(e) => builder.setField("themeId", e.target.value)}><option value="teskel-night">TESKEL Night</option><option value="lime-glow">Lime Glow</option><option value="midnight-minimal">Midnight Minimal</option></select></BuilderField>
          </div>
        </BuilderSectionCard>
        <div id="preview" data-builder-section="preview" className="xl:hidden"><BuilderPreviewRail><BuilderDevicePreview><EventPreview event={event} /></BuilderDevicePreview></BuilderPreviewRail></div>
        <BuilderLaunchCenter checks={checks} onSelect={selectSection} onPublish={publish} canPublish={summary.canPublish} published={event.status === "PUBLISHED"} publicHref={`/e/${event.slug}`} />
      </BuilderCanvas>
    </BuilderShell>
  );
}

export function EventBuilderClient({ slug }: { slug: string }) {
  const [event, setEvent] = useState<EventBuilderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        if (active) setEvent(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-night text-chalk"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/[0.12] border-t-lime" /><p className="mt-4 text-[13px] text-chalk-muted">Preparing your workspace...</p></div></div>;
  if (error || !event) return <div className="flex min-h-screen items-center justify-center bg-night p-6 text-chalk"><div className="max-w-sm rounded-[24px] border border-white/[0.08] bg-white/[0.035] p-6 text-center"><h1 className="text-xl font-bold">Could not open event</h1><p className="mt-2 text-sm text-chalk-muted">{error ?? "Event not found"}</p><Button asChild className="mt-5 rounded-2xl"><a href="/dashboard/events">Back to events</a></Button></div></div>;
  return <EventWorkspace initialEvent={event} />;
}

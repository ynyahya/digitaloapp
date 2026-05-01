"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Loader2, CheckCircle2, AlertCircle, Calendar, MapPin,
  Globe, Users, Ticket, Palette, Eye, Rocket, Plus, Trash2,
  FileText, Settings, Clock, Sparkles, Mic, ListChecks, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  createTicketType, deleteTicketType,
  createRegistrationQuestion, deleteRegistrationQuestion,
  addSpeaker, removeSpeaker, updateEventTheme, updateEventDetails,
} from "@/lib/actions/events-builder";
import { updateEvent, publishEvent, unpublishEvent } from "@/lib/actions/offerings";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

// ── Theme Presets ────────────────────────────────────────────

const EVENTS_THEMES = [
  { id: "minimal", name: "Minimal", bg: "bg-gradient-to-br from-gray-50 to-gray-100", accent: "#374151" },
  { id: "ocean", name: "Ocean", bg: "bg-gradient-to-br from-blue-400 to-cyan-600", accent: "#0ea5e9" },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-br from-orange-400 to-rose-600", accent: "#f43f5e" },
  { id: "forest", name: "Forest", bg: "bg-gradient-to-br from-emerald-400 to-teal-700", accent: "#10b981" },
  { id: "midnight", name: "Midnight", bg: "bg-gradient-to-br from-slate-800 to-indigo-950", accent: "#6366f1" },
  { id: "sunrise", name: "Sunrise", bg: "bg-gradient-to-br from-amber-300 to-orange-500", accent: "#f59e0b" },
  { id: "lavender", name: "Lavender", bg: "bg-gradient-to-br from-purple-400 to-pink-500", accent: "#a855f7" },
  { id: "mint", name: "Mint", bg: "bg-gradient-to-br from-teal-300 to-emerald-500", accent: "#14b8a6" },
  { id: "coral", name: "Coral", bg: "bg-gradient-to-br from-rose-400 to-pink-600", accent: "#e11d48" },
  { id: "slate", name: "Slate", bg: "bg-gradient-to-br from-slate-500 to-slate-800", accent: "#64748b" },
];

// ── Types ─────────────────────────────────────────────────────

type TicketType = { id: string; name: string; description: string | null; priceCents: number; currency: string; quantity: number | null; remainingCount: number; requireApproval: boolean; hidden: boolean; position: number };
type RegQuestion = { id: string; label: string; required: boolean; questionType: string; options: string | null; position: number };
type Speaker = { id: string; name: string; title: string | null; bio: string | null; photoUrl: string | null; socialLinks: string | null; position: number };
type EventData = {
  id: string; slug: string; title: string; description: string | null;
  locationType: string; venueAddress: string | null; onlineUrl: string | null;
  startDate: string | null; endDate: string | null; timezone: string;
  priceCents: number; currency: string; status: string;
  maxAttendees: number; coverImage: string | null;
  themeId: string | null; themeConfig: string | null;
  agenda: string | null; guestListVisibility: boolean;
  tickets: TicketType[]; questions: RegQuestion[]; speakers: Speaker[];
};

const SECTIONS = [
  { id: "details", label: "Details", icon: FileText },
  { id: "location", label: "Location & Time", icon: Clock },
  { id: "description", label: "Description", icon: FileText },
  { id: "design", label: "Design", icon: Palette },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "questions", label: "Registration", icon: ListChecks },
  { id: "speakers", label: "Speakers", icon: Mic },
  { id: "settings", label: "Settings", icon: Settings },
];

// ── Live Preview ──────────────────────────────────────────────

function LivePreview({ event, themeId }: { event: EventData | null; themeId: string }) {
  const theme = EVENTS_THEMES.find((t) => t.id === themeId) || EVENTS_THEMES[0];
  const startDate = event?.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Date TBD";
  const startTime = event?.startDate ? new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-muted mb-2 text-center">Live Preview</p>
      <div className="w-[280px] mx-auto rounded-[32px] bg-slate-900 p-2 shadow-2xl">
        <div className="rounded-[24px] overflow-hidden bg-white">
          <div className={cn("h-40 flex items-end p-4 relative", theme.bg)}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <p className="text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">{startDate}{startTime ? ` · ${startTime}` : ""}</p>
              <h3 className="text-white text-[15px] font-bold leading-tight mt-1 line-clamp-2">{event?.title || "Event Title"}</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              {event?.locationType === "ONLINE" ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              <span>{event?.locationType === "ONLINE" ? "Online Event" : (event?.venueAddress || "Venue TBD")}</span>
            </div>
            {event?.maxAttendees ? <div className="flex items-center gap-2 text-[12px] text-slate-600"><Users className="h-3.5 w-3.5" /><span>{event.maxAttendees} spots</span></div> : null}
            {event?.tickets && event.tickets.length > 0 && (
              <div className="flex items-center gap-2 text-[12px] text-slate-600">
                <Ticket className="h-3.5 w-3.5" />
                <span>{event.tickets.length === 1 && event.tickets[0].priceCents === 0 ? "Free" : `From ${event.currency} ${(Math.min(...event.tickets.map((t) => t.priceCents)) / 100).toLocaleString()}`}</span>
              </div>
            )}
            <div className="w-full py-2 rounded-lg bg-night text-chalk text-center text-[13px] font-bold cursor-pointer hover:opacity-90 transition-opacity">Register</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

function EventBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("details");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [themeId, setThemeId] = useState("minimal");

  // New item states
  const [newTicket, setNewTicket] = useState({ name: "", priceCents: 0, quantity: 0 });
  const [newQuestion, setNewQuestion] = useState({ label: "", questionType: "TEXT", required: false });
  const [newSpeaker, setNewSpeaker] = useState({ name: "", title: "" });

  // Auto-save timer
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (slug) router.replace(`/dashboard/events/${slug}/builder`);
  }, [router, slug]);

  useEffect(() => {
    (async () => {
      try {
        if (!slug) { setError("No event slug provided"); setLoading(false); return; }
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error(`Event not found (${res.status})`);
        const data = await res.json();
        setEvent(data);
        if (data.themeId) setThemeId(data.themeId);
      } catch (err: any) {
        setError(err.message);
      } finally { setLoading(false); }
    })();
  }, [slug]);

  // Auto-save event fields
  useEffect(() => {
    if (dirtyFields.size === 0 || !event) return;
    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const data: Record<string, any> = {};
        for (const f of dirtyFields) {
          const val = (event as any)[f];
          if (f === "startDate" || f === "endDate") data[f] = val ? new Date(val).toISOString() : null;
          else data[f] = val;
        }
        await updateEvent(event.id, data);
        setDirtyFields(new Set());
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); }
    }, 1500);
    return () => clearTimeout(timer);
  }, [dirtyFields, event]);

  const refreshEvent = async () => {
    if (!slug) return;
    const res = await fetch(`/api/events/${slug}`);
    if (res.ok) setEvent(await res.json());
  };

  const setField = (field: string, value: any) => {
    if (!event) return;
    setEvent({ ...event, [field]: value });
    setDirtyFields(new Set([...dirtyFields, field]));
  };

  const handleThemeChange = async (newThemeId: string) => {
    if (!event) return;
    setThemeId(newThemeId);
    setSaveStatus("saving");
    try { await updateEventTheme(event.id, { themeId: newThemeId }); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); }
  };

  const handlePublish = async () => {
    if (!event) return;
    setSaveStatus("saving");
    try {
      if (event.status === "PUBLISHED") await unpublishEvent(event.id);
      else await publishEvent(event.id);
      setEvent({ ...event, status: event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" });
      setSaveStatus("saved");
    } catch { setSaveStatus("error"); }
  };

  const handleAddTicket = async () => {
    if (!event || !newTicket.name.trim()) return;
    setSaveStatus("saving");
    try { await createTicketType(event.id, { name: newTicket.name.trim(), priceCents: newTicket.priceCents * 100, quantity: newTicket.quantity || undefined }); setNewTicket({ name: "", priceCents: 0, quantity: 0 }); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); }
  };
  const handleDeleteTicket = async (tId: string) => { if (!confirm("Delete ticket?")) return; setSaveStatus("saving"); try { await deleteTicketType(tId); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); } };

  const handleAddQuestion = async () => {
    if (!event || !newQuestion.label.trim()) return;
    setSaveStatus("saving");
    try { await createRegistrationQuestion(event.id, { label: newQuestion.label.trim(), questionType: newQuestion.questionType, required: newQuestion.required }); setNewQuestion({ label: "", questionType: "TEXT", required: false }); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); }
  };
  const handleDeleteQuestion = async (qId: string) => { if (!confirm("Delete question?")) return; setSaveStatus("saving"); try { await deleteRegistrationQuestion(qId); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); } };

  const handleAddSpeaker = async () => {
    if (!event || !newSpeaker.name.trim()) return;
    setSaveStatus("saving");
    try { await addSpeaker(event.id, { name: newSpeaker.name.trim(), title: newSpeaker.title || null }); setNewSpeaker({ name: "", title: "" }); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); }
  };
  const handleDeleteSpeaker = async (sId: string) => { if (!confirm("Remove speaker?")) return; setSaveStatus("saving"); try { await removeSpeaker(sId); setSaveStatus("saved"); await refreshEvent(); } catch { setSaveStatus("error"); } };

  // ── Loading / Error ──
  if (slug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night text-chalk">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/[0.12] border-t-lime" />
          <p className="mt-4 text-[13px] text-chalk-muted">Opening the new Event BuilderOS...</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="fixed inset-0 bg-night z-[100] flex items-center justify-center gap-3"><Loader2 className="h-5 w-5 animate-spin text-chalk-muted" /><span className="text-[13px] text-chalk-muted">Loading Event Builder...</span></div>;
  if (error || !event) return <div className="fixed inset-0 bg-night z-[100] flex flex-col items-center justify-center gap-3"><p className="text-[14px] font-bold text-chalk">{error || "Event not found"}</p><Link href="/dashboard/events" className="text-[12px] text-lime font-medium">← Back to Events</Link></div>;

  return (
    <div className="fixed inset-0 bg-night z-[100] flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="h-14 border-b border-white/[0.08] bg-night flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild><Link href="/dashboard/events"><ArrowLeft className="h-4 w-4 text-chalk-muted" /></Link></Button>
          <div className="w-px h-4 bg-white/[0.08]" />
          <h1 className="text-[13px] font-semibold text-chalk truncate max-w-[260px]">{event.title}</h1>
          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0", event.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-200 border-emerald-400/25" : "bg-amber-500/10 text-amber-200 border-amber-400/25")}>{event.status === "PUBLISHED" ? "LIVE" : "DRAFT"}</span>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && <span className="flex items-center gap-1 text-[11px] text-chalk-muted"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>}
          {saveStatus === "saved" && <span className="flex items-center gap-1 text-[11px] text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Saved</span>}
          <Link href={`/e/${event.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[11px] font-medium text-chalk-muted hover:text-chalk transition-colors"><Eye className="h-3 w-3" /> Preview</Link>
          <Button onClick={handlePublish} className={cn("h-8 rounded-lg text-[11px] font-medium px-4", event.status === "PUBLISHED" ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-lime hover:bg-lime/90 text-night")}><Globe className="h-3 w-3 mr-1.5" /> {event.status === "PUBLISHED" ? "Unpublish" : "Publish"}</Button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section Nav */}
        <aside className="w-52 border-r border-white/[0.08] bg-white/[0.035] shrink-0 overflow-y-auto">
          <div className="p-3 space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors text-[13px] font-medium", activeSection === s.id ? "bg-lime text-night" : "text-chalk-muted hover:text-chalk hover:bg-white/[0.06]")}><Icon className="h-4 w-4 shrink-0" /> {s.label}</button>;
            })}
          </div>
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 overflow-y-auto bg-night">
          <div className="max-w-[720px] mx-auto p-8 space-y-8">

            {/* Details */}
            {activeSection === "details" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Event Details</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5"><Label className="text-[12px] font-semibold">Event Title</Label><Input value={event.title} onChange={(e) => setField("title", e.target.value)} className="h-10 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" placeholder="e.g. Design Systems Masterclass" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-[12px] font-semibold">Start Date & Time</Label><Input type="datetime-local" value={event.startDate ? event.startDate.slice(0, 16) : ""} onChange={(e) => setField("startDate", e.target.value ? new Date(e.target.value).toISOString() : null)} className="h-10 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
                    <div className="space-y-1.5"><Label className="text-[12px] font-semibold">End Date & Time</Label><Input type="datetime-local" value={event.endDate ? event.endDate.slice(0, 16) : ""} onChange={(e) => setField("endDate", e.target.value ? new Date(e.target.value).toISOString() : null)} className="h-10 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-[12px] font-semibold">Timezone</Label><Input value={event.timezone} onChange={(e) => setField("timezone", e.target.value)} className="h-10 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {activeSection === "location" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Location & Time</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1 p-1 bg-white/[0.035] rounded-xl border border-white/[0.08]">
                    {["ONLINE", "VENUE"].map((t) => <button key={t} onClick={() => setField("locationType", t)} className={cn("flex-1 py-2 text-[13px] font-medium rounded-lg transition-all", event.locationType === t ? "bg-night text-chalk shadow-soft border border-white/[0.08]" : "text-chalk-muted hover:text-chalk")}>{t === "ONLINE" ? "🌐 Online" : "📍 Venue"}</button>)}
                  </div>
                  {event.locationType === "ONLINE" ? <div className="space-y-1.5"><Label className="text-[12px] font-semibold">Meeting URL</Label><Input value={event.onlineUrl || ""} onChange={(e) => setField("onlineUrl", e.target.value)} placeholder="https://zoom.us/j/..." className="h-10 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
                    : <div className="space-y-1.5"><Label className="text-[12px] font-semibold">Venue Address</Label><Textarea value={event.venueAddress || ""} onChange={(e) => setField("venueAddress", e.target.value)} rows={3} className="resize-none rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" placeholder="Full venue address..." /></div>}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {activeSection === "description" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Description</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <RichTextEditor value={event.description || ""} onChange={(val) => setField("description", val)} placeholder="Describe your event — what attendees will learn, agenda highlights, who should attend..." />
                </CardContent>
              </Card>
            )}

            {/* Design */}
            {activeSection === "design" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Design & Theme</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {EVENTS_THEMES.map((t) => (
                      <button key={t.id} onClick={() => handleThemeChange(t.id)} className={cn("rounded-xl overflow-hidden border-2 transition-all", themeId === t.id ? "border-lime shadow-md scale-105" : "border-white/[0.08] hover:border-lime/30")}>
                        <div className={cn("h-16", t.bg)} />
                        <div className="px-2 py-1.5 bg-night"><p className="text-[10px] font-medium text-chalk">{t.name}</p></div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tickets */}
            {activeSection === "tickets" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Ticket Types</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-3">
                  {event.tickets.map((ticket) => (
                    <div key={ticket.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="text-[13px] font-semibold text-chalk">{ticket.name}</p><p className="text-[11px] text-chalk-muted">{ticket.priceCents === 0 ? "Free" : `${ticket.currency} ${(ticket.priceCents / 100).toLocaleString()}`}{ticket.quantity ? ` · ${ticket.remainingCount}/${ticket.quantity} left` : " · Unlimited"}</p></div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-500/10" onClick={() => handleDeleteTicket(ticket.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-2 sm:flex-row sm:items-center">
                    <Input className="h-9 flex-1 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" placeholder="Ticket name..." value={newTicket.name} onChange={(e) => setNewTicket(p => ({ ...p, name: e.target.value }))} />
                    <Input type="number" className="h-9 w-24 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" placeholder="Price" value={newTicket.priceCents || ""} onChange={(e) => setNewTicket(p => ({ ...p, priceCents: parseInt(e.target.value) || 0 }))} />
                    <Button size="icon" className="h-9 w-9 rounded-lg shrink-0" onClick={handleAddTicket} disabled={!newTicket.name.trim()}><Plus className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Questions */}
            {activeSection === "questions" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Registration Questions</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-3">
                  {event.questions.map((q) => (
                    <div key={q.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="text-[13px] font-medium text-chalk">{q.label}</p><p className="text-[11px] text-chalk-muted">{q.questionType}{q.required ? " · Required" : ""}</p></div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-500/10" onClick={() => handleDeleteQuestion(q.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-2 sm:flex-row sm:items-center">
                    <Input className="h-9 flex-1 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" placeholder="Question..." value={newQuestion.label} onChange={(e) => setNewQuestion(p => ({ ...p, label: e.target.value }))} />
                    <select className="h-9 rounded-lg border border-white/[0.08] bg-night px-2 text-[12px] text-chalk" value={newQuestion.questionType} onChange={(e) => setNewQuestion(p => ({ ...p, questionType: e.target.value }))}>
                      <option value="TEXT">Text</option><option value="TEXTAREA">Long Text</option><option value="SELECT">Select</option><option value="PHONE">Phone</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-[11px] text-chalk-muted shrink-0"><Switch checked={newQuestion.required} onCheckedChange={(v) => setNewQuestion(p => ({ ...p, required: !!v }))} />Req</label>
                    <Button size="icon" className="h-9 w-9 rounded-lg shrink-0" onClick={handleAddQuestion} disabled={!newQuestion.label.trim()}><Plus className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers */}
            {activeSection === "speakers" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Speakers & Hosts</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-3">
                  {event.speakers.map((s) => (
                    <div key={s.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-night border border-white/[0.08] flex items-center justify-center text-[11px] font-bold text-chalk-muted">{s.name.charAt(0)}</div>
                        <div><p className="text-[13px] font-semibold text-chalk">{s.name}</p>{s.title && <p className="text-[11px] text-chalk-muted">{s.title}</p>}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-500/10" onClick={() => handleDeleteSpeaker(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-2 sm:flex-row sm:items-center">
                    <Input className="h-9 flex-1 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" placeholder="Name..." value={newSpeaker.name} onChange={(e) => setNewSpeaker(p => ({ ...p, name: e.target.value }))} />
                    <Input className="h-9 w-40 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" placeholder="Title..." value={newSpeaker.title} onChange={(e) => setNewSpeaker(p => ({ ...p, title: e.target.value }))} />
                    <Button size="icon" className="h-9 w-9 rounded-lg shrink-0" onClick={handleAddSpeaker} disabled={!newSpeaker.name.trim()}><Plus className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings */}
            {activeSection === "settings" && (
              <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
                <CardHeader className="border-b border-white/[0.08] px-6 py-4"><CardTitle className="text-[15px] font-semibold">Settings</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[13px] font-medium text-chalk">Show Guest List</p><p className="text-[11px] text-chalk-muted">Guests can see who else is attending</p></div><Switch checked={event.guestListVisibility} onCheckedChange={(v) => setField("guestListVisibility", !!v)} /></div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[13px] font-medium text-chalk">Max Attendees</p><p className="text-[11px] text-chalk-muted">0 = unlimited</p></div><Input type="number" className="h-9 w-24 rounded-lg border-white/[0.08] bg-night text-[12px] text-chalk placeholder:text-chalk-muted" value={event.maxAttendees || ""} onChange={(e) => setField("maxAttendees", parseInt(e.target.value) || 0)} /></div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/25"><p className="text-[13px] font-bold text-rose-200">Danger Zone</p><p className="text-[11px] text-rose-300 mt-0.5 mb-3">Permanently delete this event and all data.</p><Button variant="outline" className="h-8 rounded-lg border-rose-200 text-rose-300 text-[11px]">Delete Event</Button></div>
                </CardContent>
              </Card>
            )}

          </div>
        </main>

        {/* Right: Preview */}
        <aside className="w-[340px] border-l border-white/[0.08] bg-white/[0.035] shrink-0 overflow-y-auto p-4 hidden xl:block">
          <LivePreview event={event} themeId={themeId} />
        </aside>
      </div>
    </div>
  );
}

export default function EventBuilderPage() {
  return <Suspense fallback={<div className="fixed inset-0 bg-night z-[100] flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-chalk-muted" /></div>}><EventBuilderContent /></Suspense>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent } from "@/lib/actions/offerings";

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("ONLINE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [price, setPrice] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Event title is required."); return; }
    setIsSubmitting(true); setError(null);
    try {
      const priceNum = parseInt(price) || 0;
      const result = await createEvent({
        title: title.trim(),
        description: description || null,
        locationType,
        venueAddress: venueAddress || null,
        onlineUrl: onlineUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        timezone: "Asia/Jakarta",
        priceCents: priceNum * 100,
        currency: "IDR",
        maxAttendees: parseInt(maxAttendees) || 0,
      });
      router.push(`/dashboard/events/${result.slug}/builder`);
    } catch (err: any) {
      console.error("Create event error:", err);
      setError(err?.message || "Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.08]" asChild><Link href="/dashboard/events"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div><h1 className="text-[28px] font-semibold tracking-tight text-chalk">Create Event</h1><p className="text-[14px] text-chalk-muted">Host a webinar, workshop, or live experience.</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button variant="outline" className="h-11 rounded-xl border-white/[0.08] bg-white/[0.035] px-6 text-chalk hover:bg-white/[0.08]" asChild><Link href="/dashboard/events">Cancel</Link></Button>
          <Button onClick={handleCreate} className="h-11 rounded-xl bg-lime px-6 text-night hover:bg-lime/90" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create & Open Builder"}
          </Button>
        </div>
      </div>

      {error && <div className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 p-4 text-[13px] text-rose-200"><span className="shrink-0 mt-0.5">⚠</span><span>{error}</span></div>}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4"><CardTitle className="text-[15px] font-semibold text-chalk">Event Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Event Title <span className="text-rose-400">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Performance Masterclass" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
            <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your event..." rows={3} className="resize-none rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Start Date & Time</Label><Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="datetime-local" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">End Date & Time</Label><Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="datetime-local" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4"><CardTitle className="text-[15px] font-semibold text-chalk">Location & Pricing</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Location Type</Label>
              <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.035] p-1">
                {["ONLINE", "VENUE"].map(t => (
                  <button key={t} type="button" onClick={() => setLocationType(t)} className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition-all ${locationType === t ? "border border-white/[0.08] bg-night text-chalk shadow-sm" : "text-chalk-muted hover:text-chalk"}`}>{t === "ONLINE" ? "🌐 Online" : "📍 Venue"}</button>
                ))}
              </div>
            </div>
            {locationType === "ONLINE"
              ? <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Meeting URL</Label><Input value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
              : <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Venue Address</Label><Textarea value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Full venue address..." rows={3} className="resize-none rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
            }
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Ticket Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="0 for free" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Max Attendees</Label><Input value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} type="number" min="0" placeholder="0 = unlimited" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

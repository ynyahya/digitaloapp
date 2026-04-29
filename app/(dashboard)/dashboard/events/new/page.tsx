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
      router.push(`/dashboard/events/builder?slug=${result.slug}`);
    } catch (err: any) {
      console.error("Create event error:", err);
      setError(err?.message || "Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-xl" asChild><Link href="/dashboard/events"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div><h1 className="text-[28px] font-semibold tracking-tight text-ink">Create Event</h1><p className="text-[14px] text-ink-muted">Host a webinar, workshop, or live experience.</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild><Link href="/dashboard/events">Cancel</Link></Button>
          <Button onClick={handleCreate} className="rounded-xl h-11 px-6 bg-ink text-paper" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create & Open Builder"}
          </Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2"><span className="shrink-0 mt-0.5">⚠</span><span>{error}</span></div>}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Event Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium">Event Title <span className="text-red-500">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Performance Masterclass" className="h-11 rounded-xl border-line" /></div>
            <div className="space-y-2"><Label className="text-[13px] font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your event..." rows={3} className="rounded-xl border-line resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-[13px] font-medium">Start Date & Time</Label><Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="datetime-local" className="h-11 rounded-xl border-line" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium">End Date & Time</Label><Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="datetime-local" className="h-11 rounded-xl border-line" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Location & Pricing</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium">Location Type</Label>
              <div className="flex gap-1 p-1 bg-paper-soft rounded-xl border border-line">
                {["ONLINE", "VENUE"].map(t => (
                  <button key={t} type="button" onClick={() => setLocationType(t)} className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${locationType === t ? "bg-paper text-ink shadow-soft border border-line" : "text-ink-muted hover:text-ink"}`}>{t === "ONLINE" ? "🌐 Online" : "📍 Venue"}</button>
                ))}
              </div>
            </div>
            {locationType === "ONLINE"
              ? <div className="space-y-2"><Label className="text-[13px] font-medium">Meeting URL</Label><Input value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="h-11 rounded-xl border-line" /></div>
              : <div className="space-y-2"><Label className="text-[13px] font-medium">Venue Address</Label><Textarea value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Full venue address..." rows={3} className="rounded-xl border-line resize-none" /></div>
            }
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-[13px] font-medium">Ticket Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="0 for free" className="h-11 rounded-xl border-line" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium">Max Attendees</Label><Input value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} type="number" min="0" placeholder="0 = unlimited" className="h-11 rounded-xl border-line" /></div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

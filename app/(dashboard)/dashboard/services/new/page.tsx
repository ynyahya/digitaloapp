"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createService } from "@/lib/actions/services";

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("7");
  const [revisions, setRevisions] = useState("2");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Service title is required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const priceNum = parseInt(price) || 0;
      const result = await createService({
        title: title.trim(),
        description: description || null,
        category: category || null,
        priceCents: priceNum * 100,
        currency: "IDR",
        deliveryDays: parseInt(deliveryDays) || 1,
        revisions: parseInt(revisions) || 0,
      });
      router.push(`/dashboard/services/${result.slug}/builder`);
    } catch (err: any) {
      console.error("Create service error:", err);
      setError(err?.message || "Failed to create service. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.08]" asChild>
            <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-chalk">Create Service</h1>
            <p className="text-[14px] text-chalk-muted">Package your expertise as a sellable professional service.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button variant="outline" className="h-11 rounded-xl border-white/[0.08] bg-white/[0.035] px-6 text-chalk hover:bg-white/[0.08]" asChild>
            <Link href="/dashboard/services">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} className="h-11 rounded-xl bg-lime px-6 text-night hover:bg-lime/90" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create & Open Builder"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 p-4 text-[13px] text-rose-200">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4"><CardTitle className="text-[15px] font-semibold text-chalk">Service Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-chalk">Service Title <span className="text-rose-400">*</span></Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Brand Identity Design Package" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-chalk">Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 w-full rounded-xl border border-white/[0.08] bg-night px-3 text-[13px] text-chalk">
                <option value="">Select category...</option>
                {["Consulting", "Coaching", "Design", "Development", "Marketing", "Writing", "Video", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-chalk">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief overview of your service..." rows={3} className="resize-none rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/[0.08] bg-white/[0.035] shadow-none">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4"><CardTitle className="text-[15px] font-semibold text-chalk">Pricing & Delivery</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="500000" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Delivery (Days)</Label><Input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} type="number" min="1" placeholder="7" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium text-chalk">Revisions</Label><Input value={revisions} onChange={(e) => setRevisions(e.target.value)} type="number" min="0" placeholder="2" className="h-11 rounded-xl border-white/[0.08] bg-night text-chalk placeholder:text-chalk-muted" /></div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

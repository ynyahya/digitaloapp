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
      router.push(`/dashboard/services/${result.slug}`);
    } catch (err: any) {
      console.error("Create service error:", err);
      setError(err?.message || "Failed to create service. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-xl" asChild>
            <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-ink">Create Service</h1>
            <p className="text-[14px] text-ink-muted">Package your expertise as a sellable professional service.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild>
            <Link href="/dashboard/services">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} className="rounded-xl h-11 px-6 bg-ink text-paper" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create & Open Builder"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Service Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium">Service Title <span className="text-red-500">*</span></Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Brand Identity Design Package" className="h-11 rounded-xl border-line" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium">Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 rounded-xl border border-line bg-paper px-3 text-[13px]">
                <option value="">Select category...</option>
                {["Consulting", "Coaching", "Design", "Development", "Marketing", "Writing", "Video", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief overview of your service..." rows={3} className="rounded-xl border-line resize-none" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Pricing & Delivery</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label className="text-[13px] font-medium">Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="500000" className="h-11 rounded-xl border-line" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium">Delivery (Days)</Label><Input value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)} type="number" min="1" placeholder="7" className="h-11 rounded-xl border-line" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium">Revisions</Label><Input value={revisions} onChange={(e) => setRevisions(e.target.value)} type="number" min="0" placeholder="2" className="h-11 rounded-xl border-line" /></div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMembership } from "@/lib/actions/offerings";

const BILLING_CYCLES = ["MONTHLY", "YEARLY"];

export default function NewMembershipPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState<string[]>([""]);

  function addBenefit() { setBenefits([...benefits, ""]); }
  function removeBenefit(index: number) { setBenefits(benefits.filter((_, i) => i !== index)); }
  function updateBenefit(index: number, value: string) { const nb = [...benefits]; nb[index] = value; setBenefits(nb); }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Tier name is required."); return; }
    setIsSubmitting(true); setError(null);
    try {
      const priceNum = parseInt(price) || 0;
      const validBenefits = benefits.filter(b => b.trim());
      await createMembership({
        title: title.trim(),
        description: description || null,
        priceCents: priceNum * 100,
        currency: "IDR",
        billingCycle,
        benefits: validBenefits.length > 0 ? JSON.stringify(validBenefits) : null,
      });
      router.push("/dashboard/memberships");
    } catch (err: any) {
      console.error("Create membership error:", err);
      setError(err?.message || "Failed to create membership tier.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-xl" asChild><Link href="/dashboard/memberships"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div><h1 className="text-[28px] font-semibold tracking-tight text-ink">Create Membership Tier</h1><p className="text-[14px] text-ink-muted">Build a subscription tier for your community.</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild><Link href="/dashboard/memberships">Cancel</Link></Button>
          <Button onClick={handleCreate} className="rounded-xl h-11 px-6 bg-ink text-paper" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create Tier"}
          </Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">⚠ {error}</div>}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Tier Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium">Tier Name <span className="text-red-500">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Premium Supporter" className="h-11 rounded-xl border-line" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-[13px] font-medium">Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="50000" className="h-11 rounded-xl border-line" /></div>
              <div className="space-y-2"><Label className="text-[13px] font-medium">Billing Cycle</Label>
                <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} className="w-full h-11 rounded-xl border border-line bg-paper px-3 text-[13px]">
                  {BILLING_CYCLES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-[13px] font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what members get..." rows={3} className="rounded-xl border-line resize-none" /></div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Member Benefits</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={b} onChange={(e) => updateBenefit(i, e.target.value)} placeholder="e.g. Exclusive monthly content" className="h-11 rounded-xl border-line flex-1" />
                {benefits.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-xl" onClick={() => removeBenefit(i)}><X className="h-4 w-4" /></Button>}
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full h-11 rounded-xl" onClick={addBenefit}><Plus className="h-4 w-4 mr-2" /> Add Benefit</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

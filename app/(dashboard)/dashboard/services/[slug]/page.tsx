"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Loader2, Check, Eye, Rocket, Globe, Clock,
  Package, FileText, Star, Settings, Sparkles, DollarSign, RefreshCw,
  Briefcase, ListChecks, MessageSquare, Plus, Trash2, GripVertical,
  ChevronRight, ImageIcon, Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { updateService, publishService, unpublishService } from "@/lib/actions/services";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type ServiceData = {
  id: string; slug: string; title: string; description: string | null;
  category: string | null; priceCents: number; currency: string;
  deliveryDays: number; revisions: number; status: string;
  coverImage: string | null; salesCount: number; ratingAvg: number;
};

const SECTIONS = [
  { id: "basics", label: "Basic Info", icon: FileText },
  { id: "pricing", label: "Pricing & Packages", icon: DollarSign },
  { id: "delivery", label: "Delivery & Scope", icon: Package },
  { id: "description", label: "Description", icon: FileText },
  { id: "faq", label: "FAQ", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ServiceBuilderPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("basics");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const saveTimer = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load service
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/services/${params.slug}`);
        if (!res.ok) throw new Error("Service not found");
        setService(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally { setLoading(false); }
    })();
  }, [params.slug]);

  // Auto-save
  useEffect(() => {
    if (dirtyFields.size === 0) return;
    const timer = setTimeout(async () => {
      if (!service) return;
      setSaveStatus("saving");
      try {
        const data: Record<string, any> = {};
        for (const f of dirtyFields) data[f] = (service as any)[f];
        await updateService(service.id, data);
        setDirtyFields(new Set());
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch { setSaveStatus("error"); }
    }, 1500);
    return () => clearTimeout(timer);
  }, [dirtyFields, service]);

  const setField = (field: string, value: any) => {
    if (!service) return;
    setService({ ...service, [field]: value });
    setDirtyFields(new Set([...dirtyFields, field]));
  };

  const handlePublish = async () => {
    if (!service) return;
    setSaveStatus("saving");
    try {
      if (service.status === "PUBLISHED") await unpublishService(service.id);
      else await publishService(service.id);
      setService({ ...service, status: service.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" });
      setSaveStatus("saved");
    } catch { setSaveStatus("error"); }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-paper z-[100] flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
        <span className="text-[13px] text-ink-muted">Loading Service Builder...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="fixed inset-0 bg-paper z-[100] flex flex-col items-center justify-center gap-3">
        <p className="text-[14px] font-bold text-ink">Service not found</p>
        <Link href="/dashboard/services" className="text-[12px] text-indigo-600 font-medium">← Back to Services</Link>
      </div>
    );
  }

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free";
    return `${service.currency === "IDR" ? "Rp" : "$"} ${(cents / 100).toLocaleString("id-ID")}`;
  };

  return (
    <div className="fixed inset-0 bg-paper z-[100] flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="h-14 border-b border-line bg-paper flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
            <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4 text-ink-muted" /></Link>
          </Button>
          <div className="w-px h-4 bg-line" />
          <h1 className="text-[13px] font-semibold text-ink truncate max-w-[260px]">{service.title}</h1>
          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0", service.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
            {service.status === "PUBLISHED" ? "LIVE" : "DRAFT"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === "saving" && <span className="flex items-center gap-1 text-[11px] text-ink-muted"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>}
          {saveStatus === "saved" && <span className="flex items-center gap-1 text-[11px] text-emerald-600"><Check className="h-3 w-3" /> Saved</span>}

          <Link href={`/s/${service.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line text-[11px] font-medium text-ink-muted hover:text-ink hover:bg-paper-soft transition-colors">
            <Eye className="h-3 w-3" /> Preview
          </Link>

          <Button onClick={handlePublish} className={cn("h-8 rounded-lg text-[11px] font-medium px-4", service.status === "PUBLISHED" ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white")}>
            <Globe className="h-3 w-3 mr-1.5" /> {service.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/* ── Body: 3-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section Nav */}
        <aside className="w-52 border-r border-line bg-paper-soft shrink-0 overflow-y-auto">
          <div className="p-3 space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors text-[13px] font-medium", activeSection === s.id ? "bg-ink text-paper" : "text-ink-muted hover:text-ink hover:bg-paper")}>
                  <Icon className="h-4 w-4 shrink-0" /> {s.label}
                </button>
              );
            })}
          </div>
          <div className="p-3 pt-2 border-t border-line mx-3">
            <Button variant="ghost" className="w-full justify-start h-8 rounded-lg text-[11px] text-ink-muted gap-2">
              <Sparkles className="h-3 w-3" /> AI Assistant
            </Button>
          </div>
        </aside>

        {/* Center: Editor */}
        <main className="flex-1 overflow-y-auto bg-[#fbfbfc]">
          <div className="max-w-[720px] mx-auto p-8 space-y-8">

            {/* Basic Info */}
            {activeSection === "basics" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Basic Information</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-ink">Service Title</label>
                    <Input value={service.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Product Design Consultation" className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-ink">Category</label>
                    <div className="flex gap-2 flex-wrap">
                      {["Consulting", "Coaching", "Design", "Development", "Marketing", "Writing", "Video", "Other"].map((cat) => (
                        <button key={cat} onClick={() => setField("category", cat)} className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all", service.category === cat ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "text-ink-muted border-line hover:border-indigo-200")}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-ink">Short Description</label>
                    <Textarea value={service.description || ""} onChange={(e) => setField("description", e.target.value)} placeholder="Brief overview of what you offer..." rows={3} className="rounded-xl resize-none" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing */}
            {activeSection === "pricing" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Pricing</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-ink">Price ({service.currency})</label>
                      <Input type="number" value={service.priceCents / 100} onChange={(e) => setField("priceCents", (parseInt(e.target.value) || 0) * 100)} placeholder="0" className="h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-ink">Currency</label>
                      <select value={service.currency} onChange={(e) => setField("currency", e.target.value)} className="w-full h-10 rounded-xl border border-line bg-paper px-3 text-[13px]">
                        <option value="IDR">IDR (Rp)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-paper-soft border border-line flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-ink">Price preview</p>
                      <p className="text-[20px] font-bold text-ink">{formatPrice(service.priceCents)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery & Scope */}
            {activeSection === "delivery" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Delivery & Scope</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-ink">Delivery Time (Days)</label>
                      <Input type="number" value={service.deliveryDays} onChange={(e) => setField("deliveryDays", parseInt(e.target.value) || 1)} min={1} className="h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-semibold text-ink">Revisions Included</label>
                      <Input type="number" value={service.revisions} onChange={(e) => setField("revisions", parseInt(e.target.value) || 0)} min={0} className="h-10 rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-paper-soft border border-line flex items-center gap-3">
                      <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                      <div><p className="text-[11px] text-ink-muted">Delivery</p><p className="text-[15px] font-bold text-ink">{service.deliveryDays} day{service.deliveryDays !== 1 ? "s" : ""}</p></div>
                    </div>
                    <div className="p-4 rounded-xl bg-paper-soft border border-line flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-indigo-500 shrink-0" />
                      <div><p className="text-[11px] text-ink-muted">Revisions</p><p className="text-[15px] font-bold text-ink">{service.revisions}</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {activeSection === "description" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Full Description</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <RichTextEditor value={service.description || ""} onChange={(val) => setField("description", val)} placeholder="Describe your service in detail — what's included, process, outcomes..." />
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {activeSection === "faq" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Frequently Asked Questions</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { q: "What's included in this service?", a: "You'll receive everything described in the scope section, delivered within the specified timeframe." },
                    { q: "How do revisions work?", a: `You get up to ${service.revisions} revision round${service.revisions !== 1 ? "s" : ""} included. Additional revisions can be requested.` },
                    { q: "What's your refund policy?", a: "If you're not satisfied with the initial delivery, you can request a full refund within 7 days." },
                  ].map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-paper-soft border border-line space-y-2">
                      <p className="text-[13px] font-bold text-ink">{faq.q}</p>
                      <p className="text-[12px] text-ink-muted leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                  <button className="w-full border-2 border-dashed border-line rounded-xl py-3 flex items-center justify-center gap-2 text-[12px] font-medium text-ink-muted hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    <Plus className="h-3.5 w-3.5" /> Add FAQ
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Settings */}
            {activeSection === "settings" && (
              <Card className="rounded-2xl border-line shadow-none">
                <CardHeader className="border-b border-line px-6 py-4"><CardTitle className="text-[15px] font-semibold">Settings</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-ink">Cover Image URL</label>
                    <Input value={service.coverImage || ""} onChange={(e) => setField("coverImage", e.target.value)} placeholder="https://..." className="h-10 rounded-xl" />
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                    <p className="text-[13px] font-bold text-rose-700">Danger Zone</p>
                    <p className="text-[11px] text-rose-600 mt-0.5 mb-3">Once deleted, this service and all its data will be permanently removed.</p>
                    <Button variant="outline" className="h-8 rounded-lg border-rose-200 text-rose-600 text-[11px]">Delete Service</Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </main>

        {/* Right: Live Preview */}
        <aside className="w-[340px] border-l border-line bg-paper-soft shrink-0 overflow-y-auto hidden xl:block">
          <div className="p-4">
            <p className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-3 text-center">Live Preview</p>
            {/* Preview Card */}
            <div className="rounded-2xl border border-line bg-paper overflow-hidden shadow-sm">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                {service.coverImage ? (
                  <img src={service.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="h-10 w-10 text-white/40" />
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  {service.category && <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">{service.category}</p>}
                  <h3 className="text-[16px] font-bold text-ink leading-snug">{service.title || "Service Title"}</h3>
                </div>

                <div className="flex items-center gap-3 text-[12px] text-ink-muted">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.deliveryDays} day{service.deliveryDays !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5" /> {service.revisions} revision{service.revisions !== 1 ? "s" : ""}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-line">
                  <span className="text-[20px] font-extrabold text-ink">{formatPrice(service.priceCents)}</span>
                  {service.ratingAvg > 0 && (
                    <span className="flex items-center gap-1 text-[12px] text-ink-muted">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {service.ratingAvg.toFixed(1)}
                    </span>
                  )}
                </div>

                <Button className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold">
                  Book This Service
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Layers, Loader2, X, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

// We'll use a server action defined in offerings.ts
import { createMembership } from "@/lib/actions/offerings";

export default function NewBundlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/studio/products?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.filter((p: any) => !selectedProducts.find(sp => sp.id === p.id)));
      }
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  }

  function addProduct(product: any) {
    setSelectedProducts([...selectedProducts, product]);
    setSearchResults(searchResults.filter(p => p.id !== product.id));
  }

  function removeProduct(id: string) {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  }

  const totalOriginalPrice = selectedProducts.reduce((sum, p) => sum + p.priceCents, 0);
  const bundlePrice = parseInt(price) || 0;
  const savingsPercent = totalOriginalPrice > 0 ? Math.round((1 - bundlePrice / totalOriginalPrice) * 100) : 0;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Bundle title is required."); return; }
    if (selectedProducts.length < 2) { setError("Select at least 2 products."); return; }
    setIsSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/studio/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description || null,
          priceCents: bundlePrice,
          currency: "IDR",
          productIds: selectedProducts.map(p => p.id),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      const bundle = await res.json();
      router.push("/dashboard/bundles");
    } catch (err: any) {
      console.error("Create bundle error:", err);
      setError(err?.message || "Failed to create bundle.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-xl" asChild><Link href="/dashboard/bundles"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div><h1 className="text-[28px] font-semibold tracking-tight text-ink">Create Bundle</h1><p className="text-[14px] text-ink-muted">Combine products into a discounted bundle.</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-11 px-6" asChild><Link href="/dashboard/bundles">Cancel</Link></Button>
          <Button onClick={handleCreate} className="rounded-xl h-11 px-6 bg-ink text-paper" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Creating..." : "Create Bundle"}
          </Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px]">⚠ {error}</div>}

      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Bundle Details</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2"><Label className="text-[13px] font-medium">Bundle Title <span className="text-red-500">*</span></Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ultimate Creator Pack" className="h-11 rounded-xl border-line" /></div>
            <div className="space-y-2"><Label className="text-[13px] font-medium">Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's included in this bundle..." className="h-11 rounded-xl border-line" /></div>
            <div className="space-y-2"><Label className="text-[13px] font-medium">Bundle Price (IDR)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="Bundle price..." className="h-11 rounded-xl border-line" /></div>
            {bundlePrice > 0 && totalOriginalPrice > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[13px] text-emerald-700 font-bold">{savingsPercent}% savings</span>
                <span className="text-[12px] text-emerald-600">Original: Rp {totalOriginalPrice.toLocaleString("id-ID")} → Bundle: Rp {bundlePrice.toLocaleString("id-ID")}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-line shadow-soft">
          <CardHeader className="border-b border-line bg-paper-soft px-6 py-4"><CardTitle className="text-[15px] font-semibold">Products in Bundle ({selectedProducts.length})</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Selected products */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                {selectedProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-paper-soft border border-line">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-paper border border-line flex items-center justify-center text-[10px] font-bold text-ink-muted">{p.title[0]}</div>
                      <div><p className="text-[13px] font-medium text-ink">{p.title}</p><p className="text-[11px] text-ink-muted">Rp {(p.priceCents/100).toLocaleString("id-ID")}</p></div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-50" onClick={() => removeProduct(p.id)}><X className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            )}

            {/* Search products */}
            <div className="flex gap-2 pt-2 border-t border-line">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())} placeholder="Search your products..." className="h-10 pl-9 rounded-xl border-line text-[13px]" />
              </div>
              <Button type="button" variant="outline" className="h-10 rounded-xl px-4" onClick={handleSearch} disabled={searching}>{searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}</Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-1">
                {searchResults.map(p => (
                  <button key={p.id} type="button" onClick={() => addProduct(p)} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-left">
                    <span className="text-[13px] font-medium text-ink">{p.title}</span>
                    <span className="text-[12px] text-ink-muted">Rp {(p.priceCents/100).toLocaleString("id-ID")}</span>
                    <Plus className="h-3.5 w-3.5 text-indigo-500" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

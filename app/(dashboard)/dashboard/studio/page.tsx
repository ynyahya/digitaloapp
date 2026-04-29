"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StudioProvider, type StudioProduct } from "@/hooks/use-studio-state";
import { StudioHeader } from "@/components/studio/studio-header";
import { StudioCanvas } from "@/components/studio/studio-canvas";
import { StudioBuildBlocks } from "@/components/studio/studio-blocks";
import { PreviewMode } from "@/components/studio/preview-mode";
import { LaunchCenter } from "@/components/studio/launch-center";
import { UtilityDock } from "@/components/studio/utility-dock";
import { StudioCopilot } from "@/components/studio/studio-copilot";
import { publishProduct } from "@/lib/actions/studio";

function StudioContent() {
  const [activeMode, setActiveMode] = useState<"build" | "preview" | "launch">("build");
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const isNew = searchParams.get("new") === "1";

  const [product, setProduct] = useState<StudioProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrCreateProduct = async () => {
      try {
        if (slug) {
          // Load existing product by slug
          const res = await fetch(`/api/products/${slug}`);
          if (!res.ok) throw new Error(`Product not found (${res.status})`);
          const data = await res.json();
          setProduct(data);
        } else if (isNew) {
          // Create a new draft product
          const createRes = await fetch("/api/studio/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Untitled Product" }),
          });
          if (!createRes.ok) {
            const err = await createRes.json();
            throw new Error(err.error || "Failed to create product");
          }
          const data = await createRes.json();
          setProduct(data);
        } else {
          // Default: try to load the first product, or create one
          const res = await fetch("/api/products/saas-starter-kit");
          if (res.ok) {
            const data = await res.json();
            setProduct(data);
          } else {
            throw new Error("No product found. Create one from the Products page.");
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch/create product", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateProduct();
  }, [slug, isNew]);

  const handlePublish = async () => {
    if (!product) return;
    try {
      await publishProduct(product.id);
      setProduct({ ...product, status: "PUBLISHED", publishedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  // Listen for "Complete" clicks from Launch Center — switch to build mode and scroll
  useEffect(() => {
    const handler = (e: Event) => {
      const { field } = (e as CustomEvent).detail || {};
      setActiveMode("build");
      // Scroll to the relevant block after a short delay for mode switch
      setTimeout(() => {
        const targets: Record<string, string> = {
          title: "[data-block='hero']",
          description: "[data-block='hero']",
          coverImage: "[data-block='cover']",
          pricing: "[data-block='pricing']",
          assets: "[data-block='assets']",
          seo: "[data-block='seo']",
          faq: "[data-block='faq']",
          tags: "[data-block='tags']",
          analytics: "[data-block='analytics']",
          automations: "[data-block='automations']",
          reviews: "[data-block='reviews']",
          bundle: "[data-block='bundle']",
        };
        const selector = targets[field] || "[data-block='hero']";
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };
    window.addEventListener("studio-scroll-to", handler);
    return () => window.removeEventListener("studio-scroll-to", handler);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-paper z-[100] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-[3px] border-line border-t-ink animate-spin" />
        <div className="space-y-1 text-center">
          <p className="text-[14px] font-bold text-ink">Loading Studio</p>
          <p className="text-[12px] text-ink-muted">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="fixed inset-0 bg-paper z-[100] flex flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-[24px]">⚠️</span>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[14px] font-bold text-ink">Product not found</p>
          <p className="text-[12px] text-ink-muted max-w-xs">{error || "The product you're looking for doesn't exist or you don't have access."}</p>
        </div>
        <a href="/dashboard/products" className="mt-2 text-[12px] font-bold text-ink underline underline-offset-4 hover:opacity-70">
          ← Back to Products
        </a>
      </div>
    );
  }

  return (
    <StudioProvider initialProduct={product}>
      <div className="fixed inset-0 bg-paper z-[100] flex flex-col overflow-y-auto custom-scrollbar">
        <StudioHeader 
          activeMode={activeMode} 
          onModeChange={setActiveMode} 
          onPublish={handlePublish}
        />

        {activeMode === "build" && (
          <StudioCanvas>
            <StudioBuildBlocks />
          </StudioCanvas>
        )}

        {activeMode === "preview" && <PreviewMode />}

        {activeMode === "launch" && <LaunchCenter />}

        {activeMode === "build" && <UtilityDock />}

        <StudioCopilot />
      </div>
    </StudioProvider>
  );
}

export default function ProductStudioPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-paper z-[100] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-[3px] border-line border-t-ink animate-spin" />
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}

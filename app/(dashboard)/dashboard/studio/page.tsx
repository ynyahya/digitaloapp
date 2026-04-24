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
  const slug = searchParams.get("slug") || "saas-starter-kit";

  const [product, setProduct] = useState<StudioProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error(`Product not found (${res.status})`);
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        console.error("Failed to fetch product", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handlePublish = async () => {
    if (!product) return;
    try {
      await publishProduct(product.id);
      setProduct({ ...product, status: "PUBLISHED", publishedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

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

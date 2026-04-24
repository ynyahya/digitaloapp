"use client";

import { Search, Link as LinkIcon, Globe } from "lucide-react";
import { useStudio } from "@/hooks/use-studio-state";
import { BlockWrapper } from "./block-wrapper";

export function SEOBlock({ className }: { className?: string }) {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper 
      icon={Search} 
      label="SEO & Metadata" 
      className={className}
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Meta Title</label>
            <span className="text-[10px] text-ink-muted">{product.metaTitle?.length || 0}/60</span>
          </div>
          <input 
            type="text" 
            value={product.metaTitle || ""}
            onChange={(e) => setField("metaTitle", e.target.value)}
            maxLength={60}
            className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-[13px] text-ink focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all outline-none"
            placeholder={product.title || "Product Meta Title"}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Meta Description</label>
            <span className="text-[10px] text-ink-muted">{product.metaDescription?.length || 0}/160</span>
          </div>
          <textarea 
            value={product.metaDescription || ""}
            onChange={(e) => setField("metaDescription", e.target.value)}
            maxLength={160}
            className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-[13px] text-ink focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all outline-none resize-none h-24"
            placeholder="Write a compelling description for search results..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Custom Slug</label>
          <div className="flex items-center border border-line rounded-xl bg-paper overflow-hidden focus-within:border-ink/30 focus-within:ring-4 focus-within:ring-ink/5 transition-all">
            <span className="pl-4 pr-2 text-[13px] text-ink-muted bg-paper-soft border-r border-line py-3 flex items-center gap-2">
              <LinkIcon className="h-3.5 w-3.5" />
              digitalo.app/p/
            </span>
            <input 
              type="text" 
              value={product.customSlug || product.slug}
              onChange={(e) => setField("customSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="flex-1 bg-transparent px-3 py-3 text-[13px] text-ink outline-none"
              placeholder="custom-product-url"
            />
          </div>
        </div>

        {/* SERP Preview */}
        <div className="pt-4 mt-2 border-t border-line">
          <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider mb-3 block flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" /> Google Preview
          </label>
          <div className="p-4 rounded-xl border border-line bg-white shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-paper-muted flex items-center justify-center">
                <Globe className="w-3 h-3 text-ink" />
              </div>
              <div>
                <p className="text-[12px] text-[#202124] leading-tight">Digitalo</p>
                <p className="text-[11px] text-[#4d5156] leading-tight">https://digitalo.app/p/{product.customSlug || product.slug}</p>
              </div>
            </div>
            <h4 className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-snug">
              {product.metaTitle || product.title || "Product Title"}
            </h4>
            <p className="text-[13px] text-[#4d5156] leading-snug">
              {product.metaDescription || "Product meta description will appear here in search engine results. Write something compelling to increase click-through rates."}
            </p>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

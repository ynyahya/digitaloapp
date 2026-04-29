"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  const next = () =>
    setLightboxIdx((i) => (i === null ? 0 : (i + 1) % images.length));
  const prev = () =>
    setLightboxIdx((i) =>
      i === null ? 0 : (i - 1 + images.length) % images.length,
    );

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Gallery
              </p>
              <h2 className="mt-2 text-balance text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[28px]">
                Screenshots & previews
              </h2>
            </div>
            <p className="hidden text-[12.5px] text-ink-muted md:block">
              {images.length} {images.length === 1 ? "image" : "images"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
            {images.slice(0, 6).map((src, idx) => (
              <button
                type="button"
                key={src}
                onClick={() => setLightboxIdx(idx)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-line bg-paper-muted",
                  idx === 0
                    ? "md:col-span-4 md:row-span-2 aspect-[16/10]"
                    : "md:col-span-2 aspect-[4/3]",
                )}
              >
                <Image
                  src={src}
                  alt={`${title} screenshot ${idx + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
              </button>
            ))}
          </div>

          {images.length > 6 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.slice(6).map((src, idx) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setLightboxIdx(idx + 6)}
                  className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-line"
                >
                  <Image
                    src={src}
                    alt={`${title} screenshot ${idx + 7}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-6 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div
            className="relative h-[80vh] w-[90vw] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIdx]}
              alt={`${title} screenshot ${lightboxIdx + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] font-medium text-paper/70">
            {lightboxIdx + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}

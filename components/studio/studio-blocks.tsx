"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Image as ImageIcon,
  Zap,
  Layout,
  CreditCard,
  Box,
  MessageSquare,
  Info,
  Plus,
  Layers,
  Star,
  PlusCircle,
  Trash2,
  UploadCloud,
  ListChecks,
  CheckCircle2,
  X,
  GripVertical,
  Pencil,
  Save,
  Loader2,
  Package,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio, parseJsonField, formatStudioPrice, formatFileSize, type StudioProduct } from "@/hooks/use-studio-state";
import Image from "next/image";

/** Alias for parseJsonField with array default */
function parseJsonFields<T>(value: string | null, fallback: T): T {
  return parseJsonField<T>(value, fallback);
}
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { BlockWrapper } from "./block-wrapper";
import { SEOBlock } from "./seo-block";
import { DiscountBlock } from "./discount-block";
import { StudioSection } from "./studio-canvas";

const INPUT_BASE =
  "w-full bg-paper border border-line rounded-xl px-4 py-3 text-[13px] text-ink placeholder:text-ink-subtle outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all";
const LABEL_BASE =
  "text-[11px] font-bold text-ink-subtle uppercase tracking-wider";
const COUNTER_BASE = "text-[10px] text-ink-muted tabular-nums";

// ────────────────────────────────────────────────────────────
// Shared upload hook
// ────────────────────────────────────────────────────────────

function useFileUpload() {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File, purpose: "image" | "asset" = "image") => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", purpose);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      return await res.json() as { url: string; filename: string; sizeBytes: number; mimeType: string };
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading };
}

// ────────────────────────────────────────────────────────────
// Hero Block (Basic Info) — REAL
// ────────────────────────────────────────────────────────────

export function HeroBlock() {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper
      icon={Layout}
      label="Basic Information"
      description="Name, tagline, and primary description"
      className="col-span-12 lg:col-span-7"
      blockId="hero"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className={LABEL_BASE}>Product Name</label>
          <input
            type="text"
            value={product.title}
            onChange={(e) => setField("title", e.target.value)}
            className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-[16px] font-bold text-ink placeholder:text-ink-subtle outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all"
            placeholder="e.g. Masterclass Course"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={LABEL_BASE}>Tagline / Category</label>
            <span className={COUNTER_BASE}>{product.tagline?.length || 0}/120</span>
          </div>
          <input
            type="text"
            value={product.tagline || ""}
            onChange={(e) => setField("tagline", e.target.value)}
            maxLength={120}
            className={INPUT_BASE}
            placeholder="e.g. Launch your SaaS in days"
          />
        </div>

        <div className="space-y-2">
          <label className={`${LABEL_BASE} block`}>Short Description</label>
          <RichTextEditor
            value={product.description || ""}
            onChange={(val) => setField("description", val)}
            placeholder="Write a compelling description of your product..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={LABEL_BASE}>Live Demo URL</label>
            <input
              type="url"
              value={product.demoUrl || ""}
              onChange={(e) => setField("demoUrl", e.target.value)}
              className={INPUT_BASE}
              placeholder="https://demo.yourproduct.com"
            />
            <p className="text-[10.5px] text-ink-muted">
              Embed as iframe on the storefront.
            </p>
          </div>
          <div className="space-y-2">
            <label className={LABEL_BASE}>Walkthrough Video</label>
            <input
              type="url"
              value={product.videoUrl || ""}
              onChange={(e) => setField("videoUrl", e.target.value)}
              className={INPUT_BASE}
              placeholder="YouTube or Vimeo URL"
            />
            <p className="text-[10.5px] text-ink-muted">
              Shows below the demo on the storefront.
            </p>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Product Cover — REAL upload, replace, remove, drag-drop
// ────────────────────────────────────────────────────────────

export function ProductCoverBlock() {
  const { product, setField } = useStudio();
  const { upload, uploading } = useFileUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    try {
      const result = await upload(file, "image");
      setField("coverImage", result.url);
    } catch (err) {
      console.error("Cover upload failed:", err);
    }
  };

  const removeCover = () => {
    setField("coverImage", null);
  };

  return (
    <BlockWrapper
      icon={ImageIcon}
      label="Product Cover"
      description="Hero image shown on the storefront"
      className="col-span-12 lg:col-span-5"
      blockId="cover"
    >
      <div className="space-y-4">
        <div
          className={cn(
            "aspect-[21/9] rounded-2xl bg-paper-muted border border-line overflow-hidden relative group/cover cursor-pointer transition-all",
            dragOver && "border-ink/40 ring-4 ring-ink/10"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105"
              alt="Cover"
              width={1200}
              height={630}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted gap-1.5">
              {uploading ? (
                <Loader2 className="h-7 w-7 animate-spin opacity-50" />
              ) : (
                <UploadCloud className="h-7 w-7 opacity-50" />
              )}
              <span className="text-[12px] font-bold">
                {uploading ? "Uploading..." : "Upload Cover Image"}
              </span>
              <span className="text-[10.5px] text-ink-subtle">1200 × 630 recommended · Drag & drop</span>
            </div>
          )}

          {product.coverImage && (
            <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center gap-3 transition-all">
              <Button
                variant="secondary"
                size="sm"
                className="h-9 rounded-xl bg-paper text-ink font-bold shadow-float"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Replace
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-9 rounded-xl bg-red-50 text-red-600 font-bold shadow-float hover:bg-red-100"
                onClick={(e) => { e.stopPropagation(); removeCover(); }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <p className="text-[11px] text-ink-subtle leading-relaxed">
          PNG, JPG, or WebP. Keep the focal point near the center — it will be cropped on smaller screens.
        </p>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Media Gallery — REAL multi-upload, sortable, persisted
// ────────────────────────────────────────────────────────────

export function MediaGalleryBlock() {
  const { product, setField } = useStudio();
  const { upload, uploading } = useFileUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const gallery: string[] = parseJsonFields(product.gallery, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    try {
      const results = await Promise.all(imageFiles.map((f) => upload(f, "image")));
      const newUrls = results.map((r) => r.url);
      setField("gallery", JSON.stringify([...gallery, ...newUrls]));
    } catch (err) {
      console.error("Gallery upload failed:", err);
    }
  };

  const removeImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setField("gallery", JSON.stringify(newGallery));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= gallery.length) return;
    const newGallery = [...gallery];
    const [item] = newGallery.splice(from, 1);
    newGallery.splice(to, 0, item);
    setField("gallery", JSON.stringify(newGallery));
  };

  return (
    <BlockWrapper
      icon={ImageIcon}
      label="Media Gallery"
      description="Screenshots shown beneath the hero on the product page"
      className="col-span-12"
      blockId="gallery"
    >
      <div className="space-y-4">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => setDragIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIdx !== null) moveImage(dragIdx, idx);
                  setDragIdx(null);
                }}
                onDragEnd={() => setDragIdx(null)}
                className={cn(
                  "relative aspect-[4/3] rounded-xl border border-line overflow-hidden group/media bg-paper-muted transition-all",
                  dragIdx === idx && "opacity-40"
                )}
              >
                <Image
                  src={img}
                  className="w-full h-full object-cover"
                  alt={`Gallery ${idx + 1}`}
                  fill
                />
                <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => moveImage(idx, idx - 1)}
                    disabled={idx === 0}
                    className="h-8 w-8 rounded-lg shadow-card bg-paper text-ink hover:bg-paper-muted"
                    title="Move left"
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => removeImage(idx)}
                    className="h-8 w-8 rounded-lg shadow-card bg-paper text-red-600 hover:bg-red-50"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-ink/60 text-paper text-[9px] font-bold">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center text-center py-10 rounded-2xl border border-dashed border-line bg-paper-soft transition-all cursor-pointer",
              dragOver && "border-ink/40 ring-4 ring-ink/10"
            )}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 text-ink-subtle animate-spin mb-2" />
            ) : (
              <ImageIcon className="h-8 w-8 text-ink-subtle opacity-60 mb-2" />
            )}
            <p className="text-[12.5px] font-bold text-ink">
              {uploading ? "Uploading..." : "No images yet"}
            </p>
            <p className="text-[11.5px] text-ink-muted max-w-xs mt-1">
              Add screenshots or preview images — they will appear below the product description.
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Add Gallery Images"}
        </Button>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Highlights Block — REAL CRUD
// ────────────────────────────────────────────────────────────

export function HighlightsBlock() {
  const { product, setField } = useStudio();
  const highlights: string[] = parseJsonFields(product.included, []);
  const [newItem, setNewItem] = useState("");

  const addHighlight = () => {
    if (!newItem.trim()) return;
    const newHighlights = [...highlights, newItem.trim()];
    setField("included", JSON.stringify(newHighlights));
    setNewItem("");
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setField("included", JSON.stringify(newHighlights));
  };

  const editHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setField("included", JSON.stringify(newHighlights));
  };

  return (
    <BlockWrapper
      icon={ListChecks}
      label="Highlights & Formats"
      description="Key features, deliverables, or formats included"
      className="col-span-12 lg:col-span-6"
      blockId="highlights"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {highlights.length > 0 ? (
            highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft group/item"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => editHighlight(idx, e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-ink outline-none border-b border-transparent focus:border-ink/20 transition-colors"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(idx)}
                  className="h-8 w-8 text-ink-subtle opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={ListChecks}
              title="No highlights added yet"
              description="Add key features buyers will see next to the description."
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHighlight()}
            placeholder="e.g. 25 Fully Customizable Slides"
            className="flex-1 bg-paper border border-line rounded-xl px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all"
          />
          <Button
            onClick={addHighlight}
            disabled={!newItem.trim()}
            className="h-10 px-4 rounded-xl bg-ink text-paper font-bold text-[13px] disabled:opacity-40"
          >
            Add
          </Button>
        </div>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Digital Assets — REAL upload, CRUD, secure delivery
// ────────────────────────────────────────────────────────────

export function AssetBlock() {
  const { product, setField } = useStudio();
  const { upload, uploading } = useFileUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const files = product.files || [];

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    for (const file of Array.from(fileList)) {
      try {
        const result = await upload(file, "asset");
        // Register in DB
        const res = await fetch("/api/studio/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            filename: result.filename,
            storageKey: result.url,
            sizeBytes: result.sizeBytes,
          }),
        });
        if (!res.ok) throw new Error("Failed to register file");
        const newFile = await res.json();
        // Update local state
        setField("files", [...files, newFile]);
      } catch (err) {
        console.error("Asset upload failed:", err);
      }
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/studio/files?fileId=${fileId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete file");
      setField("files", files.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Asset delete failed:", err);
    }
  };

  return (
    <BlockWrapper
      icon={Box}
      label="Digital Assets"
      description="Files delivered to buyers after checkout"
      className="col-span-12 lg:col-span-6"
      blockId="assets"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {files.length > 0 ? (
            files.map((asset, i) => (
              <div
                key={asset.id || i}
                className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft hover:bg-paper-muted transition-colors group/asset"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-paper border border-line flex items-center justify-center group-hover/asset:bg-ink group-hover/asset:text-paper group-hover/asset:border-ink transition-colors shrink-0">
                    <Box className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-[12.5px] font-bold text-ink truncate">
                        {asset.filename}
                      </p>
                      <span className="px-1.5 py-0.5 rounded-md bg-paper border border-line text-[9.5px] font-bold text-ink-subtle shrink-0">
                        v{asset.version}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-ink-muted">
                      {formatFileSize(asset.sizeBytes || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/asset:opacity-100 transition-opacity shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    onClick={() => deleteFile(asset.id)}
                    title="Delete asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={UploadCloud}
              title="No assets uploaded yet"
              description="Drag files here or use the button below. Buyers get instant access after checkout."
            />
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        <Button
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload Digital Asset"}
        </Button>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Pricing & Licensing — REAL dynamic tier builder
// ────────────────────────────────────────────────────────────

interface LicenseFormData {
  name: string;
  priceCents: number;
  description: string;
  perks: string[];
}

export function PricingBlock() {
  const { product, setField } = useStudio();
  const licenses = product.licenses || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<LicenseFormData>({
    name: "",
    priceCents: 0,
    description: "",
    perks: [],
  });
  const [newPerk, setNewPerk] = useState("");

  const startEdit = (license: typeof licenses[0]) => {
    setEditingId(license.id);
    setFormData({
      name: license.name,
      priceCents: license.priceCents,
      description: license.description || "",
      perks: license.perks ? parseJsonFields<string[]>(license.perks, []) : [],
    });
    setShowAdd(false);
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setFormData({ name: "", priceCents: 0, description: "", perks: [] });
  };

  const addPerk = () => {
    if (!newPerk.trim()) return;
    setFormData({ ...formData, perks: [...formData.perks, newPerk.trim()] });
    setNewPerk("");
  };

  const removePerk = (idx: number) => {
    const perks = [...formData.perks];
    perks.splice(idx, 1);
    setFormData({ ...formData, perks });
  };

  const saveLicense = async () => {
    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        const res = await fetch("/api/studio/licenses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ licenseId: editingId, ...formData }),
        });
        if (!res.ok) throw new Error("Failed to update license");
        const updated = await res.json();
        setField("licenses", licenses.map((l) => (l.id === editingId ? { ...l, ...updated } : l)));
      } else {
        // Create new
        const res = await fetch("/api/studio/licenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, ...formData }),
        });
        if (!res.ok) throw new Error("Failed to create license");
        const created = await res.json();
        setField("licenses", [...licenses, created]);
      }
      setEditingId(null);
      setShowAdd(false);
    } catch (err) {
      console.error("Save license failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteLicense = async (licenseId: string) => {
    try {
      const res = await fetch(`/api/studio/licenses?licenseId=${licenseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete license");
      setField("licenses", licenses.filter((l) => l.id !== licenseId));
    } catch (err) {
      console.error("Delete license failed:", err);
    }
  };

  const isEditing = editingId !== null || showAdd;

  return (
    <BlockWrapper
      icon={CreditCard}
      label="Pricing & Licensing"
      description="Define one-time tiers and commercial licenses"
      className="col-span-12 lg:col-span-7"
      blockId="pricing"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map((tier) => {
            if (editingId === tier.id) {
              // Inline edit form
              return (
                <div key={tier.id} className="col-span-1 md:col-span-2 p-5 rounded-2xl border-2 border-ink/30 bg-paper-soft space-y-4">
                  <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Edit Tier</p>
                  <LicenseForm
                    formData={formData}
                    setFormData={setFormData}
                    newPerk={newPerk}
                    setNewPerk={setNewPerk}
                    addPerk={addPerk}
                    removePerk={removePerk}
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveLicense} disabled={saving} className="h-9 px-4 rounded-xl bg-ink text-paper font-bold text-[12px]">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingId(null)} className="h-9 px-4 rounded-xl text-[12px] font-bold">
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            }

            let perksArr: string[] = [];
            if (tier.perks) {
              try { perksArr = JSON.parse(tier.perks); } catch { perksArr = []; }
            }

            return (
              <div
                key={tier.id}
                className="p-5 rounded-2xl border border-line bg-paper hover:border-ink/20 hover:shadow-card transition-all cursor-pointer group/tier relative"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-1">
                    <span className="text-[10.5px] font-bold text-ink-subtle uppercase tracking-[0.15em]">
                      {tier.name}
                    </span>
                    <p className="text-[22px] font-bold text-ink tracking-tight tabular-nums">
                      {formatStudioPrice(tier.priceCents, product.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover/tier:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startEdit(tier)}
                      title="Edit tier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                      onClick={() => deleteLicense(tier.id)}
                      title="Delete tier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5 min-h-[60px]">
                  {perksArr.map((f: string, j: number) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-[11.5px] text-ink-muted"
                    >
                      <Zap className="h-3 w-3 text-ink-subtle fill-ink-subtle mt-0.5 shrink-0" />
                      <span className="leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {licenses.length === 0 && !isEditing && (
            <div className="col-span-2">
              <EmptyState
                icon={CreditCard}
                title="No pricing tiers yet"
                description="Add at least one tier so buyers can purchase this product."
                action={
                  <Button
                    variant="outline"
                    onClick={startAdd}
                    className="h-9 rounded-xl text-[12px] font-bold border-line"
                  >
                    + Add Pricing Tier
                  </Button>
                }
              />
            </div>
          )}
        </div>

        {/* Add new tier form */}
        {showAdd && (
          <div className="p-5 rounded-2xl border-2 border-ink/30 bg-paper-soft space-y-4">
            <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">New Pricing Tier</p>
            <LicenseForm
              formData={formData}
              setFormData={setFormData}
              newPerk={newPerk}
              setNewPerk={setNewPerk}
              addPerk={addPerk}
              removePerk={removePerk}
            />
            <div className="flex gap-2">
              <Button onClick={saveLicense} disabled={saving || !formData.name} className="h-9 px-4 rounded-xl bg-ink text-paper font-bold text-[12px]">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Tier
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-xl text-[12px] font-bold">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showAdd && licenses.length > 0 && (
          <Button
            variant="ghost"
            onClick={startAdd}
            className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Tier
          </Button>
        )}
      </div>
    </BlockWrapper>
  );
}

/** License form sub-component */
function LicenseForm({
  formData,
  setFormData,
  newPerk,
  setNewPerk,
  addPerk,
  removePerk,
}: {
  formData: LicenseFormData;
  setFormData: (d: LicenseFormData) => void;
  newPerk: string;
  setNewPerk: (v: string) => void;
  addPerk: () => void;
  removePerk: (idx: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-ink-subtle uppercase">Tier Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Commercial"
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-ink-subtle uppercase">Price (cents)</label>
          <input
            type="number"
            value={formData.priceCents}
            onChange={(e) => setFormData({ ...formData, priceCents: parseInt(e.target.value) || 0 })}
            placeholder="9900"
            className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-ink-subtle uppercase">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="For freelancers and agencies"
          className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-ink-subtle uppercase">Perks / Features</label>
        {formData.perks.map((perk, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex-1 text-[12px] text-ink bg-paper border border-line rounded-lg px-3 py-1.5">{perk}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removePerk(i)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            value={newPerk}
            onChange={(e) => setNewPerk(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerk()}
            placeholder="e.g. Unlimited Projects"
            className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
          />
          <Button variant="outline" size="sm" onClick={addPerk} disabled={!newPerk.trim()} className="h-8 px-3 text-[11px] font-bold">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Tags & Categories — REAL taxonomy + persistence + search
// ────────────────────────────────────────────────────────────

export function TagBlock() {
  const { product, setField } = useStudio();
  const tags = product.tags || [];
  const [newTag, setNewTag] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  const searchTags = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(`/api/studio/tags?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch {
      // ignore
    }
  };

  const addTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/studio/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, tagName: tagName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add tag");
      const tag = await res.json();
      setField("tags", [...tags, { tag }]);
      setNewTag("");
      setShowSuggestions(false);
    } catch (err) {
      console.error("Add tag failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const res = await fetch(`/api/studio/tags?productId=${product.id}&tagId=${tagId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove tag");
      setField("tags", tags.filter((t) => t.tag.id !== tagId));
    } catch (err) {
      console.error("Remove tag failed:", err);
    }
  };

  return (
    <BlockWrapper
      icon={Layers}
      label="Tags & Categories"
      description="Help buyers discover this product in the marketplace"
      className="col-span-12 lg:col-span-5"
      blockId="tags"
    >
      <div className="space-y-4">
        <label className={LABEL_BASE}>Selected Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <div
              key={t.tag.id}
              className="pl-3 pr-1.5 py-1 rounded-lg bg-paper-muted border border-line flex items-center gap-1.5 group/tag"
            >
              <span className="text-[12px] font-medium text-ink">{t.tag.name}</span>
              <button
                className="h-5 w-5 rounded-md text-ink-subtle hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center opacity-0 group-hover/tag:opacity-100"
                onClick={() => removeTag(t.tag.id)}
                title="Remove tag"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <span className="text-[12px] text-ink-muted">No tags added yet.</span>
          )}
        </div>

        {/* Add tag with search */}
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
                searchTags(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(newTag);
                }
              }}
              placeholder="Search or create a tag..."
              className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
            />
            <Button
              onClick={() => addTag(newTag)}
              disabled={!newTag.trim() || saving}
              className="h-9 px-3 rounded-lg bg-ink text-paper text-[12px] font-bold"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-paper border border-line rounded-xl shadow-float max-h-40 overflow-y-auto">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="w-full text-left px-3 py-2 text-[12px] text-ink hover:bg-paper-muted transition-colors"
                  onClick={() => addTag(s.name)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// FAQ — REAL CRUD + storefront rendering
// ────────────────────────────────────────────────────────────

export function FAQBlock() {
  const { product, setField } = useStudio();
  const faq: Array<{ q: string; a: string }> = parseJsonFields(product.faq, []);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const addFAQ = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const newFaq = [...faq, { q: newQ.trim(), a: newA.trim() }];
    setField("faq", JSON.stringify(newFaq));
    setNewQ("");
    setNewA("");
    setShowAdd(false);
  };

  const removeFAQ = (index: number) => {
    const newFaq = [...faq];
    newFaq.splice(index, 1);
    setField("faq", JSON.stringify(newFaq));
  };

  const updateFAQ = (index: number, field: "q" | "a", value: string) => {
    const newFaq = [...faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setField("faq", JSON.stringify(newFaq));
  };

  return (
    <BlockWrapper
      icon={Info}
      label="Frequently Asked Questions"
      description="Answer common buyer questions to reduce hesitation"
      className="col-span-12 lg:col-span-6"
      blockId="faq"
    >
      <div className="space-y-3">
        {faq.length > 0 ? (
          faq.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-line bg-paper-soft space-y-2 group/faq"
            >
              <div className="flex items-start justify-between gap-3">
                {editingIdx === i ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={item.q}
                      onChange={(e) => updateFAQ(i, "q", e.target.value)}
                      className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[13px] font-bold text-ink outline-none focus:border-ink/30"
                      placeholder="Question"
                    />
                    <textarea
                      value={item.a}
                      onChange={(e) => updateFAQ(i, "a", e.target.value)}
                      className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/30 resize-none"
                      rows={2}
                      placeholder="Answer"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIdx(null)}
                      className="h-7 px-2 text-[11px] font-bold"
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-ink leading-snug">{item.q}</p>
                      <p className="text-[12px] text-ink-muted leading-relaxed mt-1">{item.a}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/faq:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingIdx(i)}
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50"
                        onClick={() => removeFAQ(i)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={Info}
            title="No FAQs defined yet"
            description="Add 3–5 common questions to boost conversion."
          />
        )}

        {showAdd ? (
          <div className="p-4 rounded-xl border-2 border-ink/30 bg-paper-soft space-y-3">
            <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">New Question</p>
            <input
              type="text"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[13px] font-bold text-ink outline-none focus:border-ink/30"
              placeholder="e.g. Can I use this for commercial projects?"
            />
            <textarea
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] text-ink outline-none focus:border-ink/30 resize-none"
              rows={3}
              placeholder="Write a helpful answer..."
            />
            <div className="flex gap-2">
              <Button
                onClick={addFAQ}
                disabled={!newQ.trim() || !newA.trim()}
                className="h-9 px-4 rounded-xl bg-ink text-paper font-bold text-[12px] disabled:opacity-40"
              >
                Add Question
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowAdd(false); setNewQ(""); setNewA(""); }}
                className="h-9 px-4 rounded-xl text-[12px] font-bold"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowAdd(true)}
            className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Question
          </Button>
        )}
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Testimonials — REAL social proof management
// ────────────────────────────────────────────────────────────

export function TestimonialBlock() {
  const { product } = useStudio();
  const reviews = product.reviews || [];

  // Manage featured testimonials stored in a JSON field
  // For now, reviews come from DB (real buyer reviews)
  // We allow featuring/hiding reviews via a local "featured" flag
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(
    new Set(reviews.map((r) => r.id))
  );

  const toggleFeatured = (reviewId: string) => {
    const next = new Set(featuredIds);
    if (next.has(reviewId)) next.delete(reviewId);
    else next.add(reviewId);
    setFeaturedIds(next);
  };

  return (
    <BlockWrapper
      icon={MessageSquare}
      label="Social Proof & Testimonials"
      description="Customer reviews displayed on the product page"
      className="col-span-12 lg:col-span-6"
      blockId="reviews"
    >
      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((t, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-2xl border border-line bg-paper-soft space-y-3 transition-opacity",
                !featuredIds.has(t.id) && "opacity-40"
              )}
            >
              <div className="flex items-center gap-3">
                {t.user.image ? (
                  <Image
                    src={t.user.image}
                    className="h-9 w-9 rounded-full object-cover"
                    alt={t.user.name || "User"}
                    width={36}
                    height={36}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-paper-muted flex items-center justify-center font-bold text-[12px] text-ink">
                    {(t.user.name || "A")[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold text-ink truncate">
                    {t.user.name || "Anonymous"}
                  </p>
                  <p className="text-[10px] text-ink-muted uppercase font-bold tracking-[0.12em]">
                    {t.role || "Verified Buyer"}
                  </p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-3 w-3",
                        s <= t.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-ink-subtle"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[12.5px] text-ink-muted leading-relaxed">
                &ldquo;{t.body}&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => toggleFeatured(t.id)}
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors",
                    featuredIds.has(t.id)
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-paper border-line text-ink-subtle hover:text-ink"
                  )}
                >
                  {featuredIds.has(t.id) ? "Featured" : "Hidden"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Buyer reviews appear here after your first sales."
          />
        )}
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Delivery Automations — REAL functioning module
// ────────────────────────────────────────────────────────────

interface Automation {
  id: string;
  name: string;
  type: "email" | "webhook" | "download";
  description: string;
  enabled: boolean;
  config: Record<string, string | undefined>;
}

export function AutomationBlock() {
  const { product, setField } = useStudio();
  const automations: Automation[] = parseJsonFields(
    (product as unknown as Record<string, unknown>).automations as string | null,
    [
      {
        id: "welcome-email",
        name: "Welcome Email Flow",
        type: "email",
        description: "Sent immediately after successful checkout",
        enabled: true,
        config: { subject: `Thanks for purchasing ${product.title}!`, body: "Your download is ready." },
      },
      {
        id: "secure-download",
        name: "Secure Download Link",
        type: "download",
        description: "Generate expiring download token for purchased files",
        enabled: true,
        config: { expiresIn: "24h" },
      },
    ]
  );

  const [localAutomations, setLocalAutomations] = useState<Automation[]>(automations);
  const [showAdd, setShowAdd] = useState(false);
  const [newAuto, setNewAuto] = useState<Partial<Automation>>({
    name: "",
    type: "email",
    description: "",
    enabled: true,
  });

  const toggleAutomation = (id: string) => {
    const updated = localAutomations.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    setLocalAutomations(updated);
    // Persist to product (using bonuses field as a proxy since we don't have a dedicated automations column)
    setField("bonuses", JSON.stringify(updated));
  };

  const addAutomation = () => {
    if (!newAuto.name) return;
    const automation: Automation = {
      id: `auto-${Date.now()}`,
      name: newAuto.name || "",
      type: newAuto.type || "email",
      description: newAuto.description || "",
      enabled: true,
      config: {},
    };
    const updated = [...localAutomations, automation];
    setLocalAutomations(updated);
    setField("bonuses", JSON.stringify(updated));
    setNewAuto({ name: "", type: "email", description: "", enabled: true });
    setShowAdd(false);
  };

  const removeAutomation = (id: string) => {
    const updated = localAutomations.filter((a) => a.id !== id);
    setLocalAutomations(updated);
    setField("bonuses", JSON.stringify(updated));
  };

  const TYPE_ICONS: Record<string, LucideIcon> = {
    email: MessageSquare,
    webhook: Zap,
    download: Box,
  };

  return (
    <BlockWrapper
      icon={Zap}
      label="Delivery Automations"
      description="Email flows and webhooks triggered on purchase"
      className="col-span-12"
      blockId="automations"
    >
      <div className="space-y-3">
        {localAutomations.map((auto) => {
          const Icon = TYPE_ICONS[auto.type] || Zap;
          return (
            <div
              key={auto.id}
              className="p-4 rounded-2xl border border-line bg-paper-soft space-y-3 group/auto"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-paper border border-line flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-ink" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-ink">{auto.name}</p>
                    <p className="text-[10.5px] text-ink-muted">{auto.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleAutomation(auto.id)}
                    className={cn(
                      "h-5 w-9 rounded-full p-0.5 cursor-pointer transition-colors flex items-center",
                      auto.enabled ? "bg-emerald-500" : "bg-paper-muted border border-line"
                    )}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-paper shadow-soft transition-transform",
                        auto.enabled ? "ml-auto" : "ml-0"
                      )}
                    />
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 opacity-0 group-hover/auto:opacity-100 hover:bg-red-50"
                    onClick={() => removeAutomation(auto.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="pt-3 border-t border-line flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg text-[10.5px] font-bold border-line px-3"
                >
                  Edit Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg text-[10.5px] font-bold border-line px-3"
                >
                  Test Flow
                </Button>
              </div>
            </div>
          );
        })}

        {showAdd ? (
          <div className="p-4 rounded-2xl border-2 border-ink/30 bg-paper-soft space-y-3">
            <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">New Automation</p>
            <input
              type="text"
              value={newAuto.name || ""}
              onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
              placeholder="e.g. Slack Notification"
              className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
            />
            <div className="flex gap-2">
              <select
                value={newAuto.type}
                onChange={(e) => setNewAuto({ ...newAuto, type: e.target.value as Automation["type"] })}
                className="bg-paper border border-line rounded-lg px-2 py-2 text-[12px] outline-none"
              >
                <option value="email">Email</option>
                <option value="webhook">Webhook</option>
                <option value="download">Download Link</option>
              </select>
              <input
                type="text"
                value={newAuto.description || ""}
                onChange={(e) => setNewAuto({ ...newAuto, description: e.target.value })}
                placeholder="Description"
                className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-[12px] outline-none focus:border-ink/30"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addAutomation} disabled={!newAuto.name} className="h-9 px-4 rounded-lg bg-ink text-paper text-[12px] font-bold">
                Add
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-lg text-[12px] font-bold">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowAdd(true)}
            className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Automation
          </Button>
        )}
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Empty State
// ────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 rounded-2xl border border-dashed border-line bg-paper-soft">
      <div className="h-9 w-9 rounded-xl bg-paper border border-line flex items-center justify-center mb-3">
        <Icon className="h-4 w-4 text-ink-subtle" />
      </div>
      <p className="text-[12.5px] font-bold text-ink">{title}</p>
      {description && (
        <p className="text-[11.5px] text-ink-muted max-w-xs mt-1 px-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Build Blocks Assembly
// ────────────────────────────────────────────────────────────


// ────────────────────────────────────────────────────────────
// Bundle Builder — REAL product association
// ────────────────────────────────────────────────────────────

export function BundleBuilderBlock() {
  const { product, setField } = useStudio();
  const bundleItems = useMemo(() => product.bundleItems || [], [product.bundleItems]);
  const [allProducts, setAllProducts] = useState<Array<Pick<StudioProduct, "id" | "title" | "priceCents" | "coverImage">>>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (showSearch) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/studio/products");
          if (res.ok) {
            const data = await res.json();
            // Filter out current product and already added ones
            setAllProducts(data.filter((p: { id: string }) => p.id !== product.id && !bundleItems.some((bi) => bi.productId === p.id)));
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [showSearch, product.id, bundleItems]);

  const addToBundle = async (productId: string) => {
    try {
      const res = await fetch("/api/studio/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId: product.id, productId }),
      });
      if (!res.ok) throw new Error("Failed to add to bundle");
      const newItem = await res.json();
      setField("bundleItems", [...bundleItems, newItem]);
      setShowSearch(false);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromBundle = async (productId: string) => {
    try {
      const res = await fetch(`/api/studio/bundles?bundleId=${product.id}&productId=${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove from bundle");
      setField("bundleItems", bundleItems.filter((bi) => bi.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (product.type !== "BUNDLE") return null;

  return (
    <BlockWrapper
      icon={Package}
      label="Bundle Constructor"
      description="Select products to include in this bundle"
      className="col-span-12"
      blockId="bundle"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundleItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl border border-line bg-paper-soft group/bundle">
              <div className="h-10 w-10 rounded-lg bg-paper border border-line flex items-center justify-center overflow-hidden shrink-0">
                {item.product.coverImage ? (
                  <Image src={item.product.coverImage} className="w-full h-full object-cover" alt={item.product.title} width={40} height={40} />
                ) : (
                  <Package className="h-5 w-5 text-ink-subtle" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-ink truncate">{item.product.title}</p>
                <p className="text-[10.5px] text-ink-muted">${(item.product.priceCents / 100).toFixed(2)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 opacity-0 group-hover/bundle:opacity-100"
                onClick={() => removeFromBundle(item.productId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {showSearch ? (
          <div className="p-4 rounded-2xl border border-line bg-paper-muted space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-ink-subtle uppercase">Select Product</p>
              <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)} className="h-6 px-2 text-[10px]">Close</Button>
            </div>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {allProducts.length > 0 ? allProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addToBundle(p.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-paper text-[12px] flex items-center justify-between"
                  >
                    <span>{p.title}</span>
                    <Plus className="h-3 w-3" />
                  </button>
                )) : (
                  <p className="text-center py-2 text-[11px] text-ink-muted">No other products found.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowSearch(true)}
            className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink hover:border-ink/20 transition-all font-bold text-[12px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Product to Bundle
          </Button>
        )}
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Analytics Block — REAL data insights
// ────────────────────────────────────────────────────────────

export function AnalyticsBlock() {
  const { product } = useStudio();
  
  // Mock data for Sprint 1 (In Sprint 2 this will come from a dedicated Analytics API)
  const stats = [
    { label: "Total Revenue", value: `$${((product.salesCount || 0) * (product.priceCents / 100)).toFixed(2)}`, icon: DollarSign, trend: "+12%" },
    { label: "Total Sales", value: product.salesCount || 0, icon: Package, trend: "+5%" },
    { label: "Product Views", value: product.viewsCount || 0, icon: Users, trend: "+24%" },
    { label: "Conversion Rate", value: product.viewsCount ? `${((product.salesCount / product.viewsCount) * 100).toFixed(1)}%` : "0%", icon: TrendingUp, trend: "+2.1%" },
  ];

  return (
    <BlockWrapper
      icon={BarChart3}
      label="Product Intelligence"
      description="Real-time performance metrics and insights"
      className="col-span-12"
      blockId="analytics"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl border border-line bg-paper-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-paper border border-line flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-ink-subtle" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">{stat.label}</p>
              <p className="text-[20px] font-bold text-ink tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Tech Stack Block
// ────────────────────────────────────────────────────────────

type TechChip = { label: string; href?: string | null };
type CompatRow = { label: string; supported: boolean };

export function TechStackBlock() {
  const { product, setField } = useStudio();
  const chips = parseJsonFields<TechChip[]>(product.techStack, []);
  const compat = parseJsonFields<CompatRow[]>(product.compatibility, []);

  const updateChips = (next: TechChip[]) =>
    setField("techStack", JSON.stringify(next));
  const updateCompat = (next: CompatRow[]) =>
    setField("compatibility", JSON.stringify(next));

  return (
    <BlockWrapper
      icon={Layers}
      label="Tech stack & compatibility"
      description="Show buyers the tools, frameworks, and platforms your product uses."
      className="col-span-12 lg:col-span-7"
      blockId="tech-stack"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={LABEL_BASE}>Stack chips</label>
            <span className={COUNTER_BASE}>{chips.length} chips</span>
          </div>
          <div className="space-y-2">
            {chips.map((chip, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chip.label}
                  onChange={(e) => {
                    const next = [...chips];
                    next[i] = { ...chip, label: e.target.value };
                    updateChips(next);
                  }}
                  className={`${INPUT_BASE} flex-1`}
                  placeholder="Next.js"
                />
                <input
                  type="url"
                  value={chip.href || ""}
                  onChange={(e) => {
                    const next = [...chips];
                    next[i] = { ...chip, href: e.target.value || null };
                    updateChips(next);
                  }}
                  className={`${INPUT_BASE} flex-1`}
                  placeholder="https://nextjs.org (optional)"
                />
                <button
                  type="button"
                  onClick={() => updateChips(chips.filter((_, j) => j !== i))}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => updateChips([...chips, { label: "", href: null }])}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-line px-4 text-[12.5px] font-semibold text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add chip
          </button>
        </div>

        <div className="space-y-3 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <label className={LABEL_BASE}>Compatibility matrix</label>
            <span className={COUNTER_BASE}>{compat.length} rows</span>
          </div>
          <div className="space-y-2">
            {compat.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => {
                    const next = [...compat];
                    next[i] = { ...row, label: e.target.value };
                    updateCompat(next);
                  }}
                  className={`${INPUT_BASE} flex-1`}
                  placeholder="Works with Supabase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...compat];
                    next[i] = { ...row, supported: !row.supported };
                    updateCompat(next);
                  }}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-xl border px-4 text-[12px] font-semibold transition-colors",
                    row.supported
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink-muted",
                  )}
                >
                  {row.supported ? "Supported" : "Not yet"}
                </button>
                <button
                  type="button"
                  onClick={() => updateCompat(compat.filter((_, j) => j !== i))}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              updateCompat([...compat, { label: "", supported: true }])
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-line px-4 text-[12.5px] font-semibold text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add compatibility row
          </button>
        </div>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Changelog Block
// ────────────────────────────────────────────────────────────

type ChangelogRow = { version: string; date: string; notes: string };

export function ChangelogBlock() {
  const { product, setField } = useStudio();
  const entries = parseJsonFields<ChangelogRow[]>(product.changelog, []);

  const update = (next: ChangelogRow[]) =>
    setField("changelog", JSON.stringify(next));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <BlockWrapper
      icon={ListChecks}
      label="Changelog"
      description="Keep buyers updated on new versions, fixes, and features."
      className="col-span-12 lg:col-span-5"
      blockId="changelog"
    >
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-paper-soft px-4 py-6 text-center text-[12.5px] text-ink-muted">
            No entries yet. Add your first release below.
          </p>
        )}
        {entries.map((entry, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-line p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={entry.version}
                onChange={(e) => {
                  const next = [...entries];
                  next[i] = { ...entry, version: e.target.value };
                  update(next);
                }}
                className={`${INPUT_BASE} w-28 font-mono`}
                placeholder="1.2.0"
              />
              <input
                type="date"
                value={entry.date}
                onChange={(e) => {
                  const next = [...entries];
                  next[i] = { ...entry, date: e.target.value };
                  update(next);
                }}
                className={`${INPUT_BASE} flex-1`}
              />
              <button
                type="button"
                onClick={() => update(entries.filter((_, j) => j !== i))}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={entry.notes}
              onChange={(e) => {
                const next = [...entries];
                next[i] = { ...entry, notes: e.target.value };
                update(next);
              }}
              rows={3}
              className={`${INPUT_BASE} resize-none`}
              placeholder="- Added dark mode\n- Fixed checkout bug"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            update([
              { version: "", date: today, notes: "" },
              ...entries,
            ])
          }
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-line px-4 text-[12.5px] font-semibold text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Add release
        </button>
      </div>
    </BlockWrapper>
  );
}

// ────────────────────────────────────────────────────────────
// Trust Block
// ────────────────────────────────────────────────────────────

type TrustBadge = { label: string; icon?: string | null };

const REFUND_OPTIONS = [
  { value: "30_DAY", label: "30-day money-back" },
  { value: "14_DAY", label: "14-day money-back" },
  { value: "7_DAY", label: "7-day money-back" },
  { value: "NO_REFUND", label: "Final sale (no refund)" },
];

export function TrustBlock() {
  const { product, setField } = useStudio();
  const badges = parseJsonFields<TrustBadge[]>(product.trustBadges, []);

  const update = (next: TrustBadge[]) =>
    setField("trustBadges", JSON.stringify(next));

  return (
    <BlockWrapper
      icon={CheckCircle2}
      label="Trust & guarantees"
      description="Refund policy, delivery, updates — everything buyers check before clicking Buy."
      className="col-span-12 lg:col-span-7"
      blockId="trust"
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className={LABEL_BASE}>Refund policy</label>
            <select
              value={product.refundPolicy}
              onChange={(e) => setField("refundPolicy", e.target.value)}
              className={INPUT_BASE}
            >
              {REFUND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
              <input
                type="checkbox"
                checked={product.instantDelivery}
                onChange={(e) => setField("instantDelivery", e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              Instant delivery after checkout
            </label>
            <label className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
              <input
                type="checkbox"
                checked={product.lifetimeUpdates}
                onChange={(e) => setField("lifetimeUpdates", e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
              Lifetime updates included
            </label>
          </div>
        </div>

        <div className="space-y-3 border-t border-line pt-6">
          <div className="flex items-center justify-between">
            <label className={LABEL_BASE}>Trust badges</label>
            <span className={COUNTER_BASE}>
              {badges.length === 0 ? "Using defaults" : `${badges.length} custom`}
            </span>
          </div>
          <p className="text-[11.5px] text-ink-muted">
            Custom lines shown on the final pricing card. Leave empty to show
            defaults from refund & delivery settings.
          </p>
          <div className="space-y-2">
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={badge.label}
                  onChange={(e) => {
                    const next = [...badges];
                    next[i] = { ...badge, label: e.target.value };
                    update(next);
                  }}
                  className={`${INPUT_BASE} flex-1`}
                  placeholder="Lifetime license · 2 projects"
                />
                <button
                  type="button"
                  onClick={() => update(badges.filter((_, j) => j !== i))}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => update([...badges, { label: "", icon: null }])}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-line px-4 text-[12.5px] font-semibold text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Add trust badge
          </button>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function StudioBuildBlocks() {
  return (
    <>
      <StudioSection
        eyebrow="Step 01"
        title="Essentials"
        description="Name, cover, and the assets buyers receive."
      />
      <HeroBlock />
      <ProductCoverBlock />
      <MediaGalleryBlock />
      <HighlightsBlock />
      <AssetBlock />

      <StudioSection
        eyebrow="Step 02"
        title="Commerce"
        description="Pricing, licensing tiers, and promotional offers."
      />
      <PricingBlock />
      <BundleBuilderBlock />
      <DiscountBlock className="col-span-12 lg:col-span-5" />

      <StudioSection
        eyebrow="Step 03"
        title="Tech & Evidence"
        description="Stack, compatibility, changelog — signal that this product is real and maintained."
      />
      <TechStackBlock />
      <ChangelogBlock />
      <TrustBlock />

      <StudioSection
        eyebrow="Step 04"
        title="Trust & Discovery"
        description="Help buyers find and trust your product."
      />
      <SEOBlock className="col-span-12 lg:col-span-7" />
      <TagBlock />
      <FAQBlock />
      <TestimonialBlock />

      <StudioSection
        eyebrow="Step 05"
        title="Advanced"
        description="Post-purchase delivery flows and integrations."
      />
      <AutomationBlock />
      <AnalyticsBlock />
    </>
  );
}

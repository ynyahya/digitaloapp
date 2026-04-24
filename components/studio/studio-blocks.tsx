"use client";

import { useState } from "react";
import { 
  GripVertical, MoreHorizontal, Sparkles, Image as ImageIcon, Zap, Layout, 
  CreditCard, Box, MessageSquare, Info, Settings2, Plus, Target, Layers, 
  Monitor, Smartphone, History, FileText, Star, PlusCircle, Copy, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { BlockWrapper } from "./block-wrapper";
import { SEOBlock } from "./seo-block";
import { DiscountBlock } from "./discount-block";

export function HeroBlock() {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper icon={Layout} label="Basic Information" className="lg:col-span-2">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Product Name</label>
          <input 
            type="text" 
            value={product.title}
            onChange={(e) => setField("title", e.target.value)}
            className="w-full bg-transparent text-[18px] font-bold text-ink outline-none border-b border-transparent focus:border-line transition-all pb-1"
            placeholder="e.g. Masterclass Course"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Tagline / Category</label>
            <span className="text-[10px] text-ink-muted">{product.tagline?.length || 0}/120</span>
          </div>
          <input 
            type="text" 
            value={product.tagline || ""}
            onChange={(e) => setField("tagline", e.target.value)}
            maxLength={120}
            className="w-full bg-transparent text-[13px] font-medium text-ink-muted outline-none border-b border-transparent focus:border-line transition-all pb-1"
            placeholder="e.g. Launch your SaaS in days"
          />
        </div>
        <div className="space-y-1.5 pt-4">
          <label className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider mb-2 block">Short Description</label>
          <RichTextEditor 
            value={product.description || ""}
            onChange={(val) => setField("description", val)}
            placeholder="Write a compelling description of your product..."
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

export function ProductCoverBlock() {
  const { product, setField } = useStudio();

  return (
    <BlockWrapper 
      icon={ImageIcon} 
      label="Product Cover" 
      className="lg:col-span-1"
    >
      <div className="space-y-4">
        <div className="aspect-[21/9] rounded-[24px] bg-paper-muted border border-line overflow-hidden relative group/cover cursor-pointer shadow-soft">
          {product.coverImage ? (
            <img src={product.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105" alt="Cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted">
              <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-[12px] font-bold">Upload Cover Image</span>
              <span className="text-[10px] mt-1">Recommended size: 1200x630px</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover/cover:opacity-100 flex flex-col items-center justify-center transition-all gap-3">
             <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="h-9 rounded-xl bg-paper text-ink font-bold shadow-float" onClick={() => setField("coverImage", "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop")}>
                   <ImageIcon className="h-4 w-4 mr-2" />
                   Replace (Demo)
                </Button>
             </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function PricingBlock() {
  const { product, setField } = useStudio();
  const licenses = product.licenses || [];

  return (
    <BlockWrapper icon={CreditCard} label="Pricing & Licensing" className="lg:col-span-2">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          {licenses.map((tier, i) => (
            <div key={tier.id || i} className="p-6 rounded-[24px] border border-line bg-paper shadow-soft hover:border-ink/20 transition-all cursor-pointer group/tier relative">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                   <span className="text-[13px] font-bold text-ink uppercase tracking-wider">{tier.name}</span>
                   <p className="text-[24px] font-bold text-ink">${(tier.priceCents / 100).toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Settings2 className="h-4 w-4" /></Button>
              </div>
              
              <div className="space-y-3 mb-6">
                 {(() => {
                   let perksArr: string[] = [];
                   if (tier.perks) {
                     try {
                       perksArr = JSON.parse(tier.perks);
                     } catch {
                       perksArr = typeof tier.perks === 'string' ? tier.perks.split(',').map(s => s.trim()) : [];
                     }
                   }
                   return perksArr.map((f: string, j: number) => (
                     <div key={j} className="flex items-center gap-2 text-[11px] text-ink-muted">
                        <Zap className="h-3 w-3 text-ink-subtle fill-ink-subtle" />
                        {f}
                     </div>
                   ));
                 })()}
              </div>
              
              <Button variant="outline" className="w-full h-9 rounded-xl text-[12px] font-bold border-line group-hover/tier:bg-ink group-hover/tier:text-paper group-hover/tier:border-none transition-all">
                Edit Tier
              </Button>
            </div>
          ))}
          {licenses.length === 0 && (
             <div className="col-span-2 p-6 rounded-[24px] border border-line bg-paper shadow-soft">
               <p className="text-[12px] text-ink-muted mb-4">No pricing tiers defined yet.</p>
               <Button variant="outline" className="h-9 rounded-xl text-[12px] font-bold border-line">
                 + Add Pricing Tier
               </Button>
             </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

export function AssetBlock() {
  const { product } = useStudio();
  const files = product.files || [];

  return (
    <BlockWrapper icon={Box} label="Digital Assets" className="lg:col-span-1">
      <div className="space-y-4">
        <div className="space-y-2">
           <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-widest">Source Files</p>
           {files.map((asset, i) => (
             <div key={asset.id || i} className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper hover:bg-paper-muted transition-colors cursor-pointer group/asset">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-paper-muted flex items-center justify-center group-hover/asset:bg-ink group-hover/asset:text-paper transition-colors">
                   <Box className="h-4 w-4" />
                 </div>
                 <div className="space-y-0.5">
                   <div className="flex items-center gap-2">
                      <p className="text-[12px] font-bold text-ink">{asset.filename}</p>
                      <span className="px-1.5 py-0.5 rounded-md bg-paper-muted text-[9px] font-bold text-ink-subtle">v{asset.version}</span>
                   </div>
                   <p className="text-[10px] text-ink-muted">{(asset.sizeBytes || 0) / 1024 / 1024} MB</p>
                 </div>
               </div>
               <div className="flex items-center gap-1 opacity-0 group-hover/asset:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Trash2 className="h-3.5 w-3.5" /></Button>
               </div>
             </div>
           ))}
           {files.length === 0 && (
             <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">No assets uploaded yet.</p>
           )}
        </div>

        <Button variant="ghost" className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink transition-all font-bold text-[12px] gap-2">
          <PlusCircle className="h-4 w-4" />
          Upload Digital Asset
        </Button>
      </div>
    </BlockWrapper>
  );
}

export function TagBlock() {
  const { product, setField } = useStudio();
  // Simulated tags for now
  const tags = product.tags?.map(t => t.tag.name) || [];

  return (
    <BlockWrapper icon={Layers} label="Product Tags & Categories" className="lg:col-span-1">
       <div className="space-y-6">
          <div className="space-y-3">
             <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-widest">Selected Tags</p>
             <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                   <div key={tag} className="px-3 py-1.5 rounded-lg bg-paper-muted border border-line flex items-center gap-2">
                      <span className="text-[12px] font-medium text-ink">{tag}</span>
                      <button className="text-ink-subtle hover:text-ink"><Plus className="h-3 w-3 rotate-45" /></button>
                   </div>
                ))}
                {tags.length === 0 && <span className="text-[12px] text-ink-muted">No tags added yet.</span>}
             </div>
             <button className="px-3 py-1.5 rounded-lg border border-dashed border-line text-[12px] font-bold text-ink-muted hover:border-ink/20 transition-all mt-2">
                + Add Tag
             </button>
          </div>
       </div>
    </BlockWrapper>
  );
}

export function FAQBlock() {
  const { product, setField } = useStudio();
  let faq: any[] = [];
  try {
    faq = product.faq ? JSON.parse(product.faq) : [];
  } catch {
    faq = [];
  }

  return (
    <BlockWrapper icon={Info} label="Frequently Asked Questions" className="lg:col-span-1">
       <div className="space-y-4">
          {faq.map((item: any, i: number) => (
             <div key={i} className="p-4 rounded-xl border border-line bg-paper-soft space-y-2">
                <div className="flex items-center justify-between">
                   <p className="text-[13px] font-bold text-ink">{item.q}</p>
                   <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <p className="text-[12px] text-ink-muted leading-relaxed">{item.a}</p>
             </div>
          ))}
          {faq.length === 0 && (
             <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">No FAQs defined yet.</p>
          )}
          <Button variant="ghost" className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink transition-all font-bold text-[12px] gap-2">
             <PlusCircle className="h-4 w-4" />
             Add Question
          </Button>
       </div>
    </BlockWrapper>
  );
}

export function TestimonialBlock() {
  const { product } = useStudio();
  const reviews = product.reviews || [];

  return (
    <BlockWrapper icon={MessageSquare} label="Social Proof & Testimonials" className="lg:col-span-1">
       <div className="space-y-4">
          {reviews.map((t, i) => (
             <div key={i} className="p-5 rounded-2xl border border-line bg-paper-soft space-y-3">
                <div className="flex items-center gap-3">
                   {t.user.image ? (
                     <img src={t.user.image} className="h-10 w-10 rounded-full object-cover" alt={t.user.name || "User"} />
                   ) : (
                     <div className="h-10 w-10 rounded-full bg-paper-muted flex items-center justify-center font-bold text-[12px]">
                       {(t.user.name || "A")[0]}
                     </div>
                   )}
                   <div>
                      <p className="text-[12px] font-bold text-ink">{t.user.name || "Anonymous"}</p>
                      <p className="text-[10px] text-ink-muted uppercase font-bold tracking-widest">{t.role || "Verified Buyer"}</p>
                   </div>
                   <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={cn("h-3 w-3", s <= t.rating ? "text-amber-500 fill-amber-500" : "text-ink-subtle")} />)}
                   </div>
                </div>
                <p className="text-[12px] text-ink-muted leading-relaxed italic">"{t.body}"</p>
             </div>
          ))}
          {reviews.length === 0 && (
             <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">No reviews yet. Check back after your first few sales!</p>
          )}
       </div>
    </BlockWrapper>
  );
}

export function AutomationBlock() {
  return (
    <BlockWrapper icon={Zap} label="Delivery Automations" className="lg:col-span-1">
      <div className="space-y-4">
        <div className="p-5 rounded-2xl border border-line bg-paper-soft space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-ink" />
                <span className="text-[12px] font-bold text-ink">Welcome Email Flow</span>
             </div>
             <div className="h-5 w-9 rounded-full bg-ink p-1 cursor-pointer">
                <div className="h-3 w-3 rounded-full bg-paper ml-4" />
             </div>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">Sent automatically to buyers immediately after successful checkout.</p>
          <div className="pt-2 border-t border-line flex gap-2">
             <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold border-line px-3">Edit Template</Button>
             <Button variant="outline" size="sm" className="h-7 rounded-lg text-[10px] font-bold border-line px-3">Test Flow</Button>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function MediaGalleryBlock() {
  const { product, setField } = useStudio();
  let gallery: string[] = [];
  try {
    gallery = product.gallery ? JSON.parse(product.gallery) : [];
  } catch {
    gallery = [];
  }

  const addDemoImage = () => {
    const demos = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80"
    ];
    const newGallery = [...gallery, demos[gallery.length % demos.length]];
    setField("gallery", JSON.stringify(newGallery));
  };

  const removeImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setField("gallery", JSON.stringify(newGallery));
  };

  return (
    <BlockWrapper icon={ImageIcon} label="Media Gallery" className="lg:col-span-full">
      <div className="space-y-4">
         <p className="text-[12px] text-ink-muted leading-relaxed">
           Upload additional screenshots or preview images. These will be displayed below your product description.
         </p>
         
         {gallery.length > 0 && (
           <div className="grid grid-cols-2 gap-4">
             {gallery.map((img, idx) => (
               <div key={idx} className="relative aspect-video rounded-xl border border-line overflow-hidden group">
                 <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx+1}`} />
                 <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Button variant="destructive" size="icon" onClick={() => removeImage(idx)} className="h-8 w-8 rounded-lg shadow-card">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             ))}
           </div>
         )}
         
         <Button variant="ghost" onClick={addDemoImage} className="w-full h-11 rounded-xl border border-dashed border-line text-ink-muted hover:text-ink transition-all font-bold text-[12px] gap-2">
           <PlusCircle className="h-4 w-4" />
           Add Gallery Image (Demo)
         </Button>
      </div>
    </BlockWrapper>
  );
}

import { ListChecks, CheckCircle2 } from "lucide-react";

export function HighlightsBlock() {
  const { product, setField } = useStudio();
  let highlights: string[] = [];
  try {
    highlights = product.included ? JSON.parse(product.included) : [];
  } catch {
    highlights = [];
  }

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

  return (
    <BlockWrapper icon={ListChecks} label="Product Highlights & Formats" className="lg:col-span-1">
      <div className="space-y-4">
         <p className="text-[12px] text-ink-muted leading-relaxed">
           List the key features, deliverables, or file formats included in this product. These will appear in the right sidebar next to the description.
         </p>
         
         <div className="space-y-2">
           {highlights.map((item, idx) => (
             <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft group">
               <div className="flex items-center gap-3">
                 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                 <span className="text-[13px] text-ink">{item}</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => removeHighlight(idx)} className="h-8 w-8 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
           ))}
           {highlights.length === 0 && (
             <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">No highlights added yet.</p>
           )}
         </div>
         
         <div className="flex items-center gap-2 pt-2">
           <input
             type="text"
             value={newItem}
             onChange={(e) => setNewItem(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && addHighlight()}
             placeholder="e.g. 25 Fully Customizable Slides"
             className="flex-1 bg-paper border border-line rounded-xl px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink/30 transition-all"
           />
           <Button onClick={addHighlight} className="h-10 px-4 rounded-xl bg-ink text-paper font-bold text-[13px]">
             Add
           </Button>
         </div>
      </div>
    </BlockWrapper>
  );
}

export function StudioBuildBlocks() {
  return (
    <>
      <HeroBlock />
      <ProductCoverBlock />
      <MediaGalleryBlock />
      <HighlightsBlock />
      <AssetBlock />
      <PricingBlock />
      <DiscountBlock className="lg:col-span-1" />
      <TagBlock />
      <FAQBlock />
      <SEOBlock className="lg:col-span-1" />
      <TestimonialBlock />
      <AutomationBlock />
    </>
  );
}

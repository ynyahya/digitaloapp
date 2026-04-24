"use client";

import { CheckCircle2, AlertCircle, Rocket, ShieldCheck, Globe, Zap, Search, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/hooks/use-studio-state";
import { publishProduct } from "@/lib/actions/studio";
import { useState } from "react";
import { LaunchShareKit } from "./launch-share-kit";

export function LaunchCenter() {
  const { product, setField } = useStudio();
  const [isPublishing, setIsPublishing] = useState(false);
  const [showShareKit, setShowShareKit] = useState(product.status === "PUBLISHED");

  const checks = [
    { label: "Product title and tagline", done: !!product.title && !!product.tagline, block: "HeroBlock" },
    { label: "Detailed product description", done: !!product.description && product.description.length > 50, block: "HeroBlock" },
    { label: "Pricing tiers and licensing", done: product.licenses && product.licenses.length > 0, block: "PricingBlock" },
    { label: "Product cover image", done: !!product.coverImage, block: "ProductCoverBlock" },
    { label: "Digital assets uploaded", done: (product.files && product.files.length > 0) || !product.instantDelivery, block: "AssetBlock" },
    { label: "SEO meta descriptions", done: !!product.metaTitle && !!product.metaDescription, block: "SEOBlock" },
  ];

  const completedCount = checks.filter(c => c.done).length;
  const score = Math.round((completedCount / checks.length) * 100);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishProduct(product.id);
      setField("status", "PUBLISHED");
      setShowShareKit(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (showShareKit) {
    return <LaunchShareKit product={product} onBack={() => setShowShareKit(false)} />;
  }

  return (
    <div className="min-h-screen bg-paper pt-32 pb-40 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-12">
        {/* Readiness Header */}
        <div className="flex items-center justify-between p-10 rounded-[32px] bg-ink text-paper shadow-float relative overflow-hidden">
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-paper/10 border border-paper/20 w-fit">
                 <Rocket className="h-3.5 w-3.5" />
                 <span className="text-[11px] font-bold uppercase tracking-widest">
                   {score === 100 ? "Ready for takeoff" : "Pre-flight check"}
                 </span>
              </div>
              <h2 className="text-[32px] font-bold tracking-tight">Launch Command Center</h2>
              <p className="text-paper/60 text-[15px] max-w-md">
                Your product is {score}% ready to launch. {score < 100 ? "Complete the remaining steps to optimize for conversions." : "Everything looks perfect. You're ready to go live!"}
              </p>
           </div>
           
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-32 w-32 rounded-full border-[10px] border-paper/10 flex items-center justify-center relative">
                 <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="339.29" strokeDashoffset={(339.29 * (100 - score)) / 100} className="text-emerald-400 transition-all duration-1000" />
                 </svg>
                 <span className="text-[28px] font-bold">{score}%</span>
              </div>
              <span className="text-[11px] font-bold text-paper/40 uppercase tracking-widest">Readiness Score</span>
           </div>

           <div className="absolute top-0 right-0 w-1/2 h-full bg-mono-radial opacity-20" />
        </div>

        {/* Audit Grid */}
        <div className="grid grid-cols-3 gap-6">
           <AuditCard 
              icon={ShieldCheck} 
              label="Trust & Security" 
              status="Optimized" 
              score="100%" 
              color="text-emerald-500" 
              desc="SSL, Secure Checkout, and Terms of Service are all configured."
           />
           <AuditCard 
              icon={Zap} 
              label="Performance" 
              status={score > 80 ? "Excellent" : "Good"} 
              score={score > 80 ? "98%" : "85%"} 
              color="text-emerald-500" 
              desc="Asset sizes are optimized for fast global delivery."
           />
           <AuditCard 
              icon={Search} 
              label="SEO & Discoverability" 
              status={product.metaDescription ? "Optimized" : "Action Required"} 
              score={product.metaDescription ? "100%" : "0%"} 
              color={product.metaDescription ? "text-emerald-500" : "text-amber-500"} 
              desc={product.metaDescription ? "Meta descriptions and search indexing are active." : "Add a meta description to improve search ranking."}
              warning={!product.metaDescription}
           />
        </div>

        {/* Final Checklist */}
        <div className="bg-paper border border-line rounded-[32px] p-10 space-y-8 shadow-soft">
           <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-ink">Final Validation</h3>
              <span className="text-[13px] text-ink-muted">{completedCount} of {checks.length} steps completed</span>
           </div>

           <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {checks.map((check, i) => (
                <ValidationItem key={i} label={check.label} done={check.done} />
              ))}
           </div>

           <div className="pt-8 border-t border-line flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-paper-muted flex items-center justify-center">
                    <Globe className="h-5 w-5 text-ink-subtle" />
                 </div>
                 <div>
                    <p className="text-[13px] font-bold text-ink">Production Domain</p>
                    <p className="text-[11px] text-ink-muted">digitalo.app/p/{product.customSlug || product.slug}</p>
                 </div>
              </div>
              <Button 
                onClick={handlePublish}
                disabled={isPublishing || score < 50}
                className={cn(
                  "h-12 px-8 rounded-xl font-bold shadow-float group transition-all",
                  product.status === "PUBLISHED" ? "bg-emerald-600 text-white" : "bg-ink text-paper"
                )}
              >
                 {isPublishing ? "Publishing..." : product.status === "PUBLISHED" ? "Re-publish Updates" : "Deploy to Production"}
                 {!isPublishing && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AuditCard({ icon: Icon, label, status, score, color, desc, warning }: any) {
  return (
    <div className="p-8 rounded-[32px] border border-line bg-paper hover:shadow-card transition-all group">
       <div className="flex items-center justify-between mb-6">
          <div className={cn(
             "h-12 w-12 rounded-[18px] flex items-center justify-center transition-colors",
             warning ? "bg-amber-50 text-amber-600" : "bg-paper-muted text-ink-subtle group-hover:bg-ink group-hover:text-paper"
          )}>
             <Icon className="h-6 w-6" />
          </div>
          <div className="text-right">
             <p className={cn("text-[16px] font-bold", color)}>{score}</p>
             <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">{status}</p>
          </div>
       </div>
       <h4 className="text-[15px] font-bold text-ink mb-2">{label}</h4>
       <p className="text-[12px] text-ink-muted leading-relaxed mb-6">{desc}</p>
       <Button variant="ghost" className="p-0 h-auto text-[11px] font-bold text-ink hover:bg-transparent group/link">
          {warning ? "Fix Now" : "View Report"}
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
       </Button>
    </div>
  );
}

function ValidationItem({ label, done }: any) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-3">
          <div className={cn(
             "h-5 w-5 rounded-full flex items-center justify-center transition-all",
             done ? "bg-emerald-500 text-paper" : "border-2 border-line group-hover:border-ink/20"
          )}>
             {done ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3 text-ink-subtle opacity-0 group-hover:opacity-100" />}
          </div>
          <span className={cn("text-[14px] transition-colors", done ? "text-ink font-medium" : "text-ink-muted")}>{label}</span>
       </div>
       {!done && <Button variant="ghost" className="h-auto p-0 text-[11px] font-bold text-ink">Complete</Button>}
    </div>
  );
}

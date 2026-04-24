"use client";

import { Check, Copy, ExternalLink, Globe, LayoutTemplate, Linkedin, Mail, Twitter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LaunchShareKit({ product, onBack }: { product: any, onBack: () => void }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const productUrl = `https://digitalo.app/p/${product.customSlug || product.slug}`;
  
  const embedCode = `<script src="https://digitalo.app/embed.js" async></script>
<a href="${productUrl}" class="digitalo-checkout-button" data-digitalo-product="${product.id}">
  Buy ${product.title}
</a>`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const shareText = `I just launched ${product.title}! 🚀\n\n${product.tagline || ""}\n\nGet it here: ${productUrl}`;

  return (
    <div className="min-h-screen bg-paper pt-24 pb-40 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-4xl px-4 space-y-12">
        
        {/* Success Header */}
        <div className="text-center space-y-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Launch Center
          </Button>
          <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Check className="h-10 w-10" />
          </div>
          <h1 className="text-[42px] font-bold tracking-tight text-ink">It's Live!</h1>
          <p className="text-[16px] text-ink-muted max-w-lg mx-auto">
            "{product.title}" is now published and ready to accept payments globally.
          </p>
        </div>

        {/* Share Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Direct Link */}
          <div className="p-8 rounded-[32px] border border-line bg-paper shadow-soft space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-paper-muted flex items-center justify-center">
                <Globe className="h-6 w-6 text-ink" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-ink">Direct Link</h3>
                <p className="text-[12px] text-ink-muted">Share your hosted sales page</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded-xl bg-paper-soft border border-line">
              <input 
                readOnly 
                value={productUrl} 
                className="flex-1 bg-transparent px-3 text-[13px] text-ink font-medium outline-none" 
              />
              <Button 
                variant="secondary" 
                className="h-9 px-4 rounded-lg text-[12px] font-bold"
                onClick={() => copyToClipboard(productUrl, setCopiedLink)}
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="pt-4 border-t border-line">
              <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-widest mb-4">Share on Social</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors" asChild>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors" asChild>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-ink hover:text-white hover:border-ink transition-colors" asChild>
                  <a href={`mailto:?subject=${encodeURIComponent(`Check out ${product.title}`)}&body=${encodeURIComponent(shareText)}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Checkout Embed */}
          <div className="p-8 rounded-[32px] border border-line bg-paper shadow-soft space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-paper-muted flex items-center justify-center">
                <LayoutTemplate className="h-6 w-6 text-ink" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-ink">Checkout Overlay</h3>
                <p className="text-[12px] text-ink-muted">Sell directly on your existing website</p>
              </div>
            </div>
            
            <div className="relative group">
              <pre className="p-4 rounded-xl bg-ink text-paper/80 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap">
                {embedCode}
              </pre>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-2 right-2 h-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(embedCode, setCopiedEmbed)}
              >
                {copiedEmbed ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            
            <p className="text-[11.5px] text-ink-muted leading-relaxed">
              Add this code to any HTML page (WordPress, Webflow, Notion, etc.) to trigger a secure popup checkout without leaving your site.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

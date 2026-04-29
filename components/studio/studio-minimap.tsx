"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Layout, 
  Image as ImageIcon, 
  CreditCard, 
  Box, 
  Search, 
  MessageSquare, 
  Info, 
  Zap,
  Tag,
  Percent,
  ListChecks,
  Package,
  BarChart3
} from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "Essentials", icon: Layout },
  { id: "cover", label: "Cover", icon: ImageIcon },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "highlights", label: "Highlights", icon: ListChecks },
  { id: "assets", label: "Assets", icon: Box },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "bundle", label: "Bundles", icon: Package },
  { id: "discounts", label: "Discounts", icon: Percent },
  { id: "seo", label: "SEO", icon: Search },
  { id: "tags", label: "Tags", icon: Tag },
  { id: "faq", label: "FAQ", icon: Info },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "automations", label: "Automations", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function StudioMiniMap() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const isManualScrolling = useRef(false);

  useEffect(() => {
    const container = document.querySelector(".custom-scrollbar");
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;

        // Find the entry that is most prominent or closest to the top
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) => {
            return (prev.boundingClientRect.top < curr.boundingClientRect.top) ? prev : curr;
          });
          setActiveSection(topEntry.target.id);
        }
      },
      { 
        root: container,
        threshold: [0, 0.1, 0.5, 1.0], 
        rootMargin: "-120px 0px -70% 0px" 
      }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    const container = document.querySelector(".custom-scrollbar");
    
    if (el && container) {
      isManualScrolling.current = true;
      setActiveSection(id);

      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const containerScrollTop = container.scrollTop;
      const containerTop = container.getBoundingClientRect().top;
      
      const offsetPosition = elementPosition + containerScrollTop - containerTop - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Re-enable observer after scroll finish
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <aside className="fixed left-6 top-24 hidden xl:block w-52 space-y-1">
        <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-[0.2em] mb-4 px-3">
          Editor Navigation
        </p>
        
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 scrollbar-hide">
          <nav className="space-y-0.5 pb-8">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12.5px] font-medium transition-all group",
                    isActive 
                      ? "bg-paper text-ink shadow-soft border border-line" 
                      : "text-ink-muted hover:text-ink hover:bg-paper-soft"
                  )}
                >
                  <div className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-ink text-paper" : "bg-paper-muted text-ink-subtle group-hover:bg-paper group-hover:text-ink"
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">{section.label}</span>
                  {isActive && (
                    <div className="ml-auto h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="pt-4 mt-2 border-t border-line">
           <div className="px-3 py-3 rounded-2xl bg-paper-soft border border-line">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-bold text-ink-subtle uppercase">Shortcuts</span>
              </div>
              <div className="space-y-2">
                 <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Save</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-paper border border-line text-[9px]">⌘S</kbd>
                 </div>
                 <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Preview</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-paper border border-line text-[9px]">⌘P</kbd>
                 </div>
              </div>
           </div>
        </div>
      </aside>
    </>
  );
}

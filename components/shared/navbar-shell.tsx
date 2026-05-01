"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NavbarShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      const height = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = height > 0 ? Math.min((y / height) * 100, 100) : 0;
      setProgress(ratio);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-line bg-paper/90 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/70 backdrop-blur-md",
      )}
    >
      {children}
      <div className="h-[1.5px] w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/70 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

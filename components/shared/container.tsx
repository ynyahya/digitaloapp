import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8 lg:px-10",
        size === "default" && "max-w-[1200px]",
        size === "wide" && "max-w-[1360px]",
        size === "narrow" && "max-w-[960px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

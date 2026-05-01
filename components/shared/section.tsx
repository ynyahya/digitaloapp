import * as React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-lime",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-8",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight text-chalk md:text-[34px]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-pretty text-[15px] leading-relaxed text-chalk-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

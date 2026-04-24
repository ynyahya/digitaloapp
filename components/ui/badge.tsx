import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium leading-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-line bg-paper text-ink-muted",
        ink: "border-ink bg-ink text-paper",
        soft: "border-transparent bg-paper-muted text-ink-soft",
        outline: "border-line-strong bg-transparent text-ink",
        success: "border-transparent bg-emerald-50 text-emerald-700",
      },
      size: {
        sm: "h-5 text-[10px] px-2",
        md: "h-6 text-[11px] px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium leading-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-white/[0.08] bg-white/[0.035] text-chalk-muted",
        ink: "border-lime/20 bg-lime/10 text-lime",
        soft: "border-transparent bg-white/[0.06] text-chalk",
        outline: "border-white/[0.16] bg-transparent text-chalk",
        success: "border-transparent bg-lime/10 text-lime",
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

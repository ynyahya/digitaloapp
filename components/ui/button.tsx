import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background,box-shadow,transform,color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        // primary = signature lime CTA on dark text (top conversion button)
        primary:
          "bg-accent text-paper font-bold shadow-[0_0_0_1px_rgba(180,243,0,0.5),0_8px_28px_-8px_rgba(180,243,0,0.55)] hover:-translate-y-[0.5px] hover:bg-accent-strong",
        // secondary = high-contrast inverted button (light on dark)
        secondary:
          "border border-white/[0.08] bg-white/[0.035] text-chalk hover:bg-white/[0.06] hover:shadow-soft",
        ghost:
          "bg-transparent text-chalk hover:bg-white/[0.06]",
        outline:
          "border border-white/[0.08] bg-white/[0.035] text-chalk hover:border-lime/30 hover:bg-white/[0.06]",
        subtle:
          "bg-white/[0.06] text-chalk hover:bg-night",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        md: "h-10 px-5",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

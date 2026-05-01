import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BuilderCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto flex w-full max-w-4xl flex-col gap-5", className)}>{children}</div>;
}

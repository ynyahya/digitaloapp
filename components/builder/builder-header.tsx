import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Eye, Rocket, RotateCcw, RotateCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BuilderSaveIndicator, type BuilderSaveStatus } from "./builder-save-indicator";
import { BuilderStatusBadge } from "./builder-status-badge";
import { BuilderCommandMenu } from "./builder-command-menu";

export function BuilderHeader({
  eyebrow,
  title,
  subtitle,
  backHref,
  status,
  saveStatus,
  canUndo,
  canRedo,
  canPublish = true,
  onSave,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
  publishLabel = "Launch",
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backHref: string;
  status?: string;
  saveStatus: BuilderSaveStatus;
  canUndo?: boolean;
  canRedo?: boolean;
  canPublish?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  publishLabel?: string;
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-night/85 backdrop-blur-xl">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-3 py-3 sm:flex-nowrap sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl text-chalk-muted hover:text-chalk">
            <Link href={backHref} aria-label="Back to dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-eyebrow uppercase text-lime">{eyebrow}</p>
              {status ? <BuilderStatusBadge label={status} tone={status === "PUBLISHED" ? "success" : "neutral"} /> : null}
              <BuilderSaveIndicator status={saveStatus} />
            </div>
            <h1 className="mt-1 max-w-[220px] truncate text-[18px] font-black tracking-[-0.035em] text-chalk sm:max-w-[360px] md:text-[24px] xl:max-w-[520px]">{title}</h1>
            {subtitle ? <p className="truncate text-[12px] text-chalk-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:justify-end sm:pb-0">
          {children}
          <BuilderCommandMenu triggerClassName="hidden h-9 w-44 max-w-none rounded-xl text-[12px] lg:block" />
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onUndo} disabled={!onUndo || !canUndo}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onRedo} disabled={!onRedo || !canRedo}>
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onSave} disabled={!onSave}>
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={onPreview} disabled={!onPreview}>
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Button size="sm" className={cn("rounded-xl", !canPublish && "opacity-60")} onClick={onPublish} disabled={!onPublish || !canPublish}>
            <Rocket className="h-3.5 w-3.5" />
            {publishLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}

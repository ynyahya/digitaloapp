import { Copy, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderReadinessPanel } from "./builder-readiness-panel";
import type { ReadinessCheck } from "@/lib/builder/readiness/types";

export function BuilderLaunchCenter({ checks, publicHref, onSelect, onPublish, canPublish, published }: { checks: ReadinessCheck[]; publicHref?: string; onSelect: (section: string) => void; onPublish: () => void; canPublish: boolean; published?: boolean }) {
  return (
    <div className="space-y-5">
      <BuilderReadinessPanel checks={checks} onSelect={onSelect} />
      <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><Rocket className="h-5 w-5" /></div>
          <div>
            <h3 className="text-[16px] font-bold text-chalk">{published ? "Share your live page" : "Ready to launch"}</h3>
            <p className="text-[12px] text-chalk-muted">{published ? "Copy the public URL or view it live." : "Complete required checks, then publish."}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onPublish} disabled={!canPublish} className="rounded-2xl" size="sm">{published ? "Unpublish" : "Publish"}</Button>
          {publicHref ? <Button asChild variant="outline" className="rounded-2xl" size="sm"><a href={publicHref} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /> View live</a></Button> : null}
          {publicHref ? <Button variant="outline" className="rounded-2xl" size="sm" onClick={() => navigator.clipboard?.writeText(window.location.origin + publicHref)}><Copy className="h-3.5 w-3.5" /> Copy link</Button> : null}
        </div>
      </div>
    </div>
  );
}

import { GripVertical, Plus, Eye } from "lucide-react";

export function SellPanel() {
  return (
    <div className="relative h-full overflow-hidden p-5 md:p-7">
      {/* fake builder canvas */}
      <div className="grid h-full grid-cols-[140px_1fr] gap-3 md:gap-4">
        {/* blocks palette */}
        <div className="flex flex-col gap-2">
          <p className="text-[9.5px] font-bold uppercase tracking-wider text-chalk-dim">Blocks</p>
          {["Hero", "Features", "Pricing", "FAQ", "Testimonial", "CTA"].map((b, i) => (
            <div
              key={b}
              className={[
                "flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-[10.5px] font-medium text-chalk-muted transition",
                i === 1 ? "ring-1 ring-lime/40" : "",
              ].join(" ")}
            >
              <GripVertical className="h-3 w-3 text-chalk-dim" />
              {b}
            </div>
          ))}
          <button className="mt-1 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 bg-transparent px-2 py-1.5 text-[10.5px] font-semibold text-chalk-muted transition hover:border-lime/40 hover:text-lime">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        {/* preview canvas */}
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015]">
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
            <span className="text-[9.5px] font-mono text-chalk-dim">store.teskel.com</span>
            <Eye className="h-3 w-3 text-chalk-dim" />
          </div>

          <div className="space-y-3 p-4">
            <div className="space-y-1.5">
              <div className="h-2 w-2/3 rounded bg-white/15" />
              <div className="h-2 w-1/2 rounded bg-white/10" />
            </div>

            <div className="rounded-lg border border-lime/40 bg-lime/[0.06] p-3 ring-2 ring-lime/30">
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-lime">Features</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-md bg-white/[0.04] p-2">
                    <div className="h-1.5 w-1/2 rounded bg-white/15" />
                    <div className="mt-1 h-1 w-full rounded bg-white/10" />
                    <div className="mt-0.5 h-1 w-3/4 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="h-1.5 w-1/3 rounded bg-white/12" />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-md bg-white/[0.03] p-1.5">
                    <div className="h-6 w-full rounded bg-white/[0.05]" />
                    <div className="mt-1 h-1 w-1/2 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="h-1.5 w-1/3 rounded bg-white/12" />
              <div className="h-5 w-12 rounded bg-lime" />
            </div>
          </div>

          {/* drop indicator */}
          <div className="pointer-events-none absolute inset-x-3 top-[calc(50%+10px)] h-[2px] rounded-full bg-lime shadow-[0_0_10px_rgba(180,243,0,0.7)]" />
        </div>
      </div>

      {/* floating cursor */}
      <div className="pointer-events-none absolute right-12 top-32 hidden md:block">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-lime/30 blur-xl" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 fill-lime drop-shadow-[0_0_8px_rgba(180,243,0,0.7)]">
            <path d="M5 3l14 7-6 1.5L11 19z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

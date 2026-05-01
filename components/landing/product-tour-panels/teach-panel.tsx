import { Calendar, Award, Play, CheckCircle2 } from "lucide-react";

export function TeachPanel() {
  return (
    <div className="grid h-full grid-cols-1 gap-3 p-5 md:p-7 lg:grid-cols-2 lg:gap-4">
      {/* curriculum + drip */}
      <div className="space-y-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-lime" />
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Drip schedule</p>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { t: "Module 01 — Foundations", d: "Day 1", on: true },
              { t: "Module 02 — Building offer", d: "Day 4", on: true },
              { t: "Module 03 — Checkout flow", d: "Day 7", live: true },
              { t: "Module 04 — Email loop", d: "Day 10", on: false },
            ].map((m) => (
              <div
                key={m.t}
                className={[
                  "flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px]",
                  m.live
                    ? "border-lime/30 bg-lime/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02]",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  {m.on || m.live ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-white/20" />
                  )}
                  <span className={m.live ? "text-lime" : "text-chalk-muted"}>{m.t}</span>
                </div>
                <span className="font-mono text-[10px] text-chalk-dim">{m.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-violet" />
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Certificate</p>
          </div>
          <div className="mt-3 grid place-items-center rounded-lg border border-violet/20 bg-gradient-to-br from-violet/15 via-night to-night p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet/20 ring-1 ring-violet/30">
              <Award className="h-4 w-4 text-violet" />
            </div>
            <p className="mt-2 text-[11px] font-bold text-chalk">Certificate of Completion</p>
            <p className="text-[9.5px] text-chalk-muted">Auto-issued · Verifiable</p>
          </div>
        </div>
      </div>

      {/* lesson player */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="relative aspect-video bg-gradient-to-br from-violet/30 via-night-raised to-night">
          <div className="absolute inset-0 grid place-items-center">
            <button className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur-xl ring-1 ring-white/20 transition hover:scale-110">
              <Play className="h-4 w-4 fill-chalk text-chalk" />
            </button>
          </div>
          <div className="absolute inset-x-3 bottom-3">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[42%] rounded-full bg-lime" />
            </div>
            <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-chalk-muted">
              <span>10:32</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
        <div className="p-3.5">
          <p className="text-[9.5px] font-bold uppercase tracking-wider text-lime">M03 · L04</p>
          <p className="mt-1 text-[12.5px] font-bold text-chalk">Designing checkout flows that convert</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {["#B4F300", "#7C5CFF", "#FF5C28"].map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full border border-night"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span className="text-[10px] text-chalk-muted">+1.2K students</span>
          </div>
        </div>
      </div>
    </div>
  );
}

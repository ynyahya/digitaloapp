import { TrendingUp, Zap, Mail, Link2 } from "lucide-react";

export function ScalePanel() {
  return (
    <div className="grid h-full grid-cols-1 gap-3 p-5 md:p-7 lg:grid-cols-[1.4fr_1fr] lg:gap-4">
      {/* funnel chart */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Funnel · last 30d</p>
            <p className="mt-0.5 text-[18px] font-black tracking-tight text-chalk">23,491 visits</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            <TrendingUp className="h-2.5 w-2.5" /> +18%
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {[
            { label: "Visited", value: 23491, pct: 100, c: "#B4F300" },
            { label: "Viewed pricing", value: 8120, pct: 35, c: "#9DD400" },
            { label: "Started checkout", value: 3604, pct: 16, c: "#7FB300" },
            { label: "Purchased", value: 1129, pct: 5, c: "#7C5CFF" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-chalk-muted">{row.label}</span>
                <span className="font-mono text-chalk">{row.value.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.pct}%`,
                    background: `linear-gradient(90deg, ${row.c}, ${row.c}aa)`,
                    boxShadow: `0 0 12px ${row.c}66`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* automations + integrations */}
      <div className="space-y-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-lime" />
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Live automation</p>
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              { i: Mail, t: "Welcome series → 3 emails", on: true },
              { i: Mail, t: "Cart abandoned → reminder", on: true },
              { i: Link2, t: "Affiliate payout → Stripe", on: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5">
                <div className="flex min-w-0 items-center gap-2 text-[10.5px] text-chalk-muted">
                  <row.i className="h-3 w-3 text-chalk-dim" />
                  <span className="truncate">{row.t}</span>
                </div>
                <span
                  className={[
                    "h-3.5 w-6 flex-shrink-0 rounded-full p-0.5 transition",
                    row.on ? "bg-lime" : "bg-white/10",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-2.5 w-2.5 rounded-full bg-night transition-transform",
                      row.on ? "translate-x-2.5" : "translate-x-0",
                    ].join(" ")}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Integrations</p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {["S", "R", "N", "Z", "G", "M", "D", "+"].map((c, i) => (
              <div
                key={i}
                className={[
                  "grid aspect-square place-items-center rounded-lg text-[11px] font-bold",
                  c === "+"
                    ? "border border-dashed border-white/15 text-chalk-muted"
                    : "border border-white/[0.06] bg-white/[0.03] text-chalk",
                ].join(" ")}
              >
                {c}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-chalk-dim">+40 native integrations</p>
        </div>
      </div>
    </div>
  );
}

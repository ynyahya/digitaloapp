import { Database, Tag, Download, ShieldCheck } from "lucide-react";

export function OwnPanel() {
  const members = [
    { n: "Maya Lin", e: "maya@studio.com", tag: "VIP", c: "#B4F300" },
    { n: "Tomás Rivera", e: "tomas@build.io", tag: "Cohort 04", c: "#7C5CFF" },
    { n: "Aisha K.", e: "aisha@design.co", tag: "Refund 0", c: "#22D3EE" },
    { n: "Jordan Park", e: "jp@indie.dev", tag: "Affiliate", c: "#FF5C28" },
    { n: "Riya Mehta", e: "riya@founder.club", tag: "VIP", c: "#B4F300" },
  ];

  return (
    <div className="grid h-full grid-cols-1 gap-3 p-5 md:p-7 lg:grid-cols-[1.6fr_1fr] lg:gap-4">
      {/* CRM table */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-lime" />
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Members · 12,427</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] font-semibold text-chalk-muted transition hover:text-chalk">
            <Download className="h-2.5 w-2.5" /> Export CSV
          </button>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {members.map((m) => (
            <div
              key={m.e}
              className="flex items-center gap-3 px-3.5 py-2.5 transition hover:bg-white/[0.015]"
            >
              <div
                className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-[10px] font-bold text-night"
                style={{ background: m.c }}
              >
                {m.n
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-semibold text-chalk">{m.n}</p>
                <p className="truncate text-[10px] text-chalk-muted">{m.e}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9.5px] font-semibold text-chalk-muted">
                <Tag className="h-2.5 w-2.5" /> {m.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* segments + ownership */}
      <div className="space-y-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-chalk-dim">Segments</p>
          <div className="mt-3 space-y-1.5">
            {[
              { t: "VIP buyers (3+ orders)", v: 1284, c: "#B4F300" },
              { t: "Cohort 04 active", v: 312, c: "#7C5CFF" },
              { t: "At-risk (no login 30d)", v: 894, c: "#FF5C28" },
            ].map((s) => (
              <div key={s.t} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
                <div className="flex items-center gap-2 text-[10.5px] text-chalk-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
                  {s.t}
                </div>
                <span className="font-mono text-[10.5px] text-chalk">{s.v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-400">No lock-in</p>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-chalk-muted">
            Your members. Your data. Export the full CRM to CSV anytime — no
            algorithm decides who sees you.
          </p>
        </div>
      </div>
    </div>
  );
}

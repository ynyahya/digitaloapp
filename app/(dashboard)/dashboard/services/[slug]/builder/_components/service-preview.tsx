import { ArrowRight, Clock, RefreshCw, Star } from "lucide-react";
import type { ServiceBuilderData } from "./service-types";

function readLines(value: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function ServicePreview({ service }: { service: ServiceBuilderData }) {
  const price = Math.round((service.priceCents ?? 0) / 100);
  const outcomes = readLines(service.outcomesJson);
  const proof = readLines(service.proofJson);
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-night-raised shadow-2xl shadow-black/30">
      <div className="relative min-h-40 border-b border-white/[0.08] bg-accent-glow p-5">
        <div className="absolute inset-0 grid-dark-fine opacity-25" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-lime">{service.category || "Service"}</span>
          <h3 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.04em] text-chalk">{service.title || "Untitled service"}</h3>
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-chalk-muted">{service.promise || service.description || "Add a crisp promise and describe what buyers will receive."}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="rounded-[22px] border border-lime/20 bg-lime/10 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">Signature package</p>
          <p className="mt-2 text-[28px] font-black tracking-[-0.05em] text-chalk">{service.currency} {price.toLocaleString()}</p>
          <div className="mt-3 grid gap-2 text-[12px] text-chalk-muted">
            <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-lime" /> {service.deliveryDays} day delivery</span>
            <span className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-lime" /> {service.revisions} revisions</span>
            <span className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-lime" /> {service.ratingAvg ? `${service.ratingAvg.toFixed(1)} rating` : "New creator offer"}</span>
          </div>
        </div>
        {outcomes.length > 0 ? <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">Outcomes</p><ul className="mt-2 space-y-1 text-[12px] text-chalk-muted">{outcomes.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
        {proof.length > 0 ? <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">Proof</p><ul className="mt-2 space-y-1 text-[12px] text-chalk-muted">{proof.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
        <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-lime text-[13px] font-bold text-night lime-shadow">
          Book this service <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

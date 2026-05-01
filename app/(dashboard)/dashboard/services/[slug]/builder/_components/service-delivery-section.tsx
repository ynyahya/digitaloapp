import { Clock, RefreshCw } from "lucide-react";
import { BuilderField, BuilderInput, BuilderSectionCard } from "@/components/builder";
import { BuilderTextarea } from "@/components/builder";
import type { ServiceBuilderData } from "./service-types";

function readScope(value: string | null) {
  if (!value) return { included: "", excluded: "" };
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return { included: "", excluded: "" };
    return {
      included: parsed.filter((item) => item.included).map((item) => item.label).join("\n"),
      excluded: parsed.filter((item) => !item.included).map((item) => item.label).join("\n"),
    };
  } catch {
    return { included: "", excluded: "" };
  }
}

function writeScope(included: string, excluded: string) {
  return JSON.stringify([
    ...included.split("\n").map((label) => label.trim()).filter(Boolean).map((label, index) => ({ id: `in-${index}`, label, included: true })),
    ...excluded.split("\n").map((label) => label.trim()).filter(Boolean).map((label, index) => ({ id: `out-${index}`, label, included: false })),
  ]);
}

export function ServiceDeliverySection({ service, setField, complete }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void; complete?: boolean }) {
  const scope = readScope(service.scopeJson);
  return (
    <BuilderSectionCard id="delivery" eyebrow="Step 3" title="Delivery and scope" description="Set expectations before customers buy." complete={complete}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-lime" /><p className="text-[13px] font-bold text-chalk">Delivery timeline</p></div>
          <p className="mt-3 text-[12px] leading-relaxed text-chalk-muted">Buyers see a delivery promise of <span className="font-bold text-chalk">{service.deliveryDays} day{service.deliveryDays === 1 ? "" : "s"}</span>.</p>
        </div>
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="flex items-center gap-3"><RefreshCw className="h-5 w-5 text-lime" /><p className="text-[13px] font-bold text-chalk">Revision policy</p></div>
          <p className="mt-3 text-[12px] leading-relaxed text-chalk-muted">Included revisions: <span className="font-bold text-chalk">{service.revisions}</span>.</p>
        </div>
        <BuilderField label="Delivery days">
          <BuilderInput type="number" min={1} value={service.deliveryDays} onChange={(event) => setField("deliveryDays", Math.max(1, Number(event.target.value || 1)))} />
        </BuilderField>
        <BuilderField label="Revisions included">
          <BuilderInput type="number" min={0} value={service.revisions} onChange={(event) => setField("revisions", Math.max(0, Number(event.target.value || 0)))} />
        </BuilderField>
        <BuilderField label="Included scope" className="md:col-span-1">
          <BuilderTextarea value={scope.included} onChange={(event) => setField("scopeJson", writeScope(event.target.value, scope.excluded))} placeholder={"Landing page audit\nCopy recommendations\nAction plan"} />
        </BuilderField>
        <BuilderField label="Not included" className="md:col-span-1">
          <BuilderTextarea value={scope.excluded} onChange={(event) => setField("scopeJson", writeScope(scope.included, event.target.value))} placeholder={"Full implementation\nPaid ad setup\nUnlimited revisions"} />
        </BuilderField>
      </div>
    </BuilderSectionCard>
  );
}

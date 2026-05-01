import { Package } from "lucide-react";
import { BuilderField, BuilderInput, BuilderSectionCard } from "@/components/builder";
import { Button } from "@/components/ui/button";
import type { ServiceBuilderData, ServicePackage } from "./service-types";

function readPackages(service: ServiceBuilderData): ServicePackage[] {
  try {
    const parsed = service.packagesJson ? JSON.parse(service.packagesJson) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [{
    id: "signature",
    name: "Signature package",
    description: service.promise || "Clear scope, timeline, and revision policy.",
    priceCents: service.priceCents ?? 0,
    deliveryDays: service.deliveryDays ?? 1,
    revisions: service.revisions ?? 0,
  }];
}

export function ServicePackagesSection({ service, setField, complete }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void; complete?: boolean }) {
  const price = Math.round((service.priceCents ?? 0) / 100);
  const packages = readPackages(service);
  const updatePackage = (id: string, fields: Partial<ServicePackage>) => {
    const next = packages.map((pkg) => pkg.id === id ? { ...pkg, ...fields } : pkg);
    setField("packagesJson", JSON.stringify(next));
    if (id === packages[0]?.id) {
      if (fields.priceCents !== undefined) setField("priceCents", fields.priceCents);
      if (fields.deliveryDays !== undefined) setField("deliveryDays", fields.deliveryDays);
      if (fields.revisions !== undefined) setField("revisions", fields.revisions);
    }
  };
  const addPackage = () => {
    const next = [...packages, { id: `pkg-${Date.now()}`, name: "Premium package", description: "Expanded support and faster delivery.", priceCents: service.priceCents * 2 || 200000, deliveryDays: service.deliveryDays, revisions: service.revisions + 1 }];
    setField("packagesJson", JSON.stringify(next));
  };
  return (
    <BuilderSectionCard id="packages" eyebrow="Step 2" title="Package pricing" description="Start with one clear package. Multi-package persistence can be added after schema upgrade." complete={complete}>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="rounded-[22px] border border-lime/20 bg-lime/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-night lime-shadow"><Package className="h-5 w-5" /></div>
              <div>
                <p className="text-[13px] font-bold text-chalk">{packages[0]?.name || "Signature package"}</p>
                <p className="text-[11px] text-chalk-muted">{packages[0]?.description || "Clear scope, timeline, and revision policy."}</p>
              </div>
            </div>
            <p className="mt-5 text-[34px] font-black tracking-[-0.05em] text-chalk">{service.currency} {price.toLocaleString()}</p>
            <p className="mt-1 text-[12px] text-chalk-muted">Delivered in {service.deliveryDays} day{service.deliveryDays === 1 ? "" : "s"} with {service.revisions} revision round{service.revisions === 1 ? "" : "s"}.</p>
          </div>
          <div className="space-y-4">
          <BuilderField label="Price">
            <BuilderInput type="number" min={0} value={price} onChange={(event) => updatePackage(packages[0].id, { priceCents: Math.max(0, Number(event.target.value || 0)) * 100 })} />
          </BuilderField>
          <BuilderField label="Currency">
            <BuilderInput value={service.currency} onChange={(event) => setField("currency", event.target.value.toUpperCase())} />
          </BuilderField>
          </div>
        </div>
        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="grid gap-3 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4 md:grid-cols-2">
              <BuilderField label="Package name"><BuilderInput value={pkg.name} onChange={(event) => updatePackage(pkg.id, { name: event.target.value })} /></BuilderField>
              <BuilderField label="Package price"><BuilderInput type="number" min={0} value={Math.round(pkg.priceCents / 100)} onChange={(event) => updatePackage(pkg.id, { priceCents: Math.max(0, Number(event.target.value || 0)) * 100 })} /></BuilderField>
              <BuilderField label="Description" className="md:col-span-2"><BuilderInput value={pkg.description} onChange={(event) => updatePackage(pkg.id, { description: event.target.value })} /></BuilderField>
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-2xl" onClick={addPackage}>Add package</Button>
        </div>
      </div>
    </BuilderSectionCard>
  );
}

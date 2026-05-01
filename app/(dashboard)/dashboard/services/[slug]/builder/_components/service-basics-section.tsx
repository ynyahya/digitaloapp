import { BuilderField, BuilderInput, BuilderSectionCard } from "@/components/builder";
import type { ServiceBuilderData } from "./service-types";

export function ServiceBasicsSection({ service, setField, complete }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void; complete?: boolean }) {
  return (
    <BuilderSectionCard id="basics" eyebrow="Step 1" title="Define the offer" description="Make the promise clear before buyers read the details." complete={complete}>
      <div className="grid gap-4 md:grid-cols-2">
        <BuilderField label="Service title" hint="Use a result-focused name buyers can understand quickly." className="md:col-span-2">
          <BuilderInput value={service.title} onChange={(event) => setField("title", event.target.value)} placeholder="Landing page audit for SaaS founders" />
        </BuilderField>
        <BuilderField label="Category">
          <BuilderInput value={service.category ?? ""} onChange={(event) => setField("category", event.target.value)} placeholder="Design, Development, Coaching" />
        </BuilderField>
        <BuilderField label="Cover image URL">
          <BuilderInput value={service.coverImage ?? ""} onChange={(event) => setField("coverImage", event.target.value)} placeholder="https://..." />
        </BuilderField>
      </div>
    </BuilderSectionCard>
  );
}

import { BuilderField, BuilderInput, BuilderSectionCard } from "@/components/builder";
import type { ServiceBuilderData } from "./service-types";

export function ServiceSettingsSection({ service, setField }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void }) {
  return (
    <BuilderSectionCard id="settings" eyebrow="Settings" title="Publishing details" description="Keep operational settings simple and launch-ready.">
      <div className="grid gap-4 md:grid-cols-2">
        <BuilderField label="Slug">
          <BuilderInput value={service.slug} disabled />
        </BuilderField>
        <BuilderField label="Status">
          <BuilderInput value={service.status} onChange={(event) => setField("status", event.target.value)} />
        </BuilderField>
        <BuilderField label="SEO title">
          <BuilderInput value={service.metaTitle ?? ""} onChange={(event) => setField("metaTitle", event.target.value)} placeholder="Service title for search/share" />
        </BuilderField>
        <BuilderField label="SEO description">
          <BuilderInput value={service.metaDescription ?? ""} onChange={(event) => setField("metaDescription", event.target.value)} placeholder="Short conversion-focused meta description" />
        </BuilderField>
      </div>
    </BuilderSectionCard>
  );
}

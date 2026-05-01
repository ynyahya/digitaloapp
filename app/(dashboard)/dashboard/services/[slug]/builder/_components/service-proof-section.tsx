import { BuilderField, BuilderSectionCard, BuilderTextarea } from "@/components/builder";
import { BuilderInput } from "@/components/builder";
import type { ServiceBuilderData } from "./service-types";

function readLines(value: string | null) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join("\n") : "";
  } catch {
    return "";
  }
}

function writeLines(value: string) {
  return JSON.stringify(value.split("\n").map((item) => item.trim()).filter(Boolean));
}

export function ServiceProofSection({ service, setField, complete }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void; complete?: boolean }) {
  return (
    <BuilderSectionCard id="proof" eyebrow="Step 4" title="Promise, proof, and FAQ" description="Use this section for the sales copy until dedicated FAQ/scope fields are added." complete={complete}>
      <div className="space-y-4">
        <BuilderField label="Service promise" hint="One sentence that tells buyers the result they get.">
          <BuilderInput value={service.promise ?? ""} onChange={(event) => setField("promise", event.target.value)} placeholder="I will help you turn your offer into a high-converting landing page." />
        </BuilderField>
        <BuilderField label="Service description" hint="Include outcome, deliverables, process, who it is for, and common objections.">
          <BuilderTextarea value={service.description ?? ""} onChange={(event) => setField("description", event.target.value)} placeholder="I will help you..." />
        </BuilderField>
        <BuilderField label="Outcomes" hint="One outcome per line. These are persisted separately for preview/readiness.">
          <BuilderTextarea value={readLines(service.outcomesJson)} onChange={(event) => setField("outcomesJson", writeLines(event.target.value))} placeholder={"Clear offer positioning\nSharper hero copy\nLaunch-ready page structure"} />
        </BuilderField>
        <BuilderField label="Proof notes" hint="Add proof, credentials, or case-study bullets.">
          <BuilderTextarea value={readLines(service.proofJson)} onChange={(event) => setField("proofJson", writeLines(event.target.value))} placeholder={"Worked with 20+ SaaS founders\nIncludes teardown and improvement plan"} />
        </BuilderField>
      </div>
    </BuilderSectionCard>
  );
}

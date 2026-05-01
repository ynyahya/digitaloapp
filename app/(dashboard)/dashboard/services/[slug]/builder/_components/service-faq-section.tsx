import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderField, BuilderInput, BuilderSectionCard, BuilderTextarea } from "@/components/builder";
import type { ServiceBuilderData, ServiceFaq } from "./service-types";

function readFaq(value: string | null): ServiceFaq[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ServiceFaqSection({ service, setField, complete }: { service: ServiceBuilderData; setField: <K extends keyof ServiceBuilderData>(field: K, value: ServiceBuilderData[K]) => void; complete?: boolean }) {
  const faqs = readFaq(service.faqJson);
  const updateFaq = (id: string, fields: Partial<ServiceFaq>) => {
    setField("faqJson", JSON.stringify(faqs.map((faq) => faq.id === id ? { ...faq, ...fields } : faq)));
  };
  const addFaq = () => {
    setField("faqJson", JSON.stringify([...faqs, { id: `faq-${Date.now()}`, question: "What is included?", answer: "Add a clear answer for buyers." }]));
  };
  const removeFaq = (id: string) => {
    setField("faqJson", JSON.stringify(faqs.filter((faq) => faq.id !== id)));
  };

  return (
    <BuilderSectionCard id="faq" eyebrow="Step 5" title="FAQ builder" description="Answer common buyer objections before launch." complete={complete}>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-3">
                <BuilderField label="Question"><BuilderInput value={faq.question} onChange={(event) => updateFaq(faq.id, { question: event.target.value })} /></BuilderField>
                <BuilderField label="Answer"><BuilderTextarea value={faq.answer} onChange={(event) => updateFaq(faq.id, { answer: event.target.value })} /></BuilderField>
              </div>
              <Button type="button" variant="outline" size="icon" className="mt-6 rounded-xl text-red-200" onClick={() => removeFaq(faq.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" className="rounded-2xl" onClick={addFaq}><Plus className="h-4 w-4" /> Add FAQ</Button>
      </div>
    </BuilderSectionCard>
  );
}

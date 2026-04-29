import { sanitizeHtml } from "@/lib/utils";

interface ProductOverviewProps {
  description: string | null;
}

export function ProductOverview({ description }: ProductOverviewProps) {
  if (!description) return null;
  return (
    <section id="overview-content" className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Overview
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
          About this product
        </h2>
      </div>
      <div
        className="prose prose-neutral mt-6 max-w-none prose-p:text-[15px] prose-p:leading-[1.75] prose-p:text-ink prose-headings:text-ink prose-headings:font-semibold prose-strong:text-ink prose-em:text-ink-muted prose-li:text-ink prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-a:text-ink prose-a:underline prose-a:underline-offset-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
      />
    </section>
  );
}

import { sanitizeHtml } from "@/lib/utils";

interface ProductOverviewProps {
  description: string | null;
}

export function ProductOverview({ description }: ProductOverviewProps) {
  if (!description) return null;
  return (
    <section id="overview-content" className="scroll-mt-24">
      <div className="border-b border-white/[0.08] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chalk-dim">
          Overview
        </p>
        <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-chalk md:text-[26px]">
          About this product
        </h2>
      </div>
      <div
        className="prose prose-invert mt-6 max-w-none prose-p:text-[15px] prose-p:leading-[1.75] prose-p:text-chalk prose-headings:text-chalk prose-headings:font-semibold prose-strong:text-chalk prose-em:text-chalk-muted prose-li:text-chalk prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-a:text-chalk prose-a:underline prose-a:underline-offset-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
      />
    </section>
  );
}

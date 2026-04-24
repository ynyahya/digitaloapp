import {
  Zap,
  ShieldCheck,
  LineChart,
  Globe2,
  CreditCard,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";

const PILLARS = [
  {
    icon: Zap,
    title: "Launch in minutes",
    description:
      "Pre-built storefronts, instant checkout, and license keys ready out of the box.",
  },
  {
    icon: CreditCard,
    title: "Creator-first economics",
    description:
      "Transparent pricing. Down to 0% transaction fee on Business — keep what you earn.",
  },
  {
    icon: LineChart,
    title: "Real analytics",
    description:
      "Per-product revenue, top customers, conversion. Not vanity charts — real signal.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance handled",
    description:
      "Tax, VAT, refunds, and license enforcement managed for you across 120+ countries.",
  },
  {
    icon: Workflow,
    title: "Studio you can ship from",
    description:
      "Block-based product pages, live preview, launch checklist — design like a pro.",
  },
  {
    icon: Globe2,
    title: "Built to scale",
    description:
      "From your first $1 to $1M+ in payouts on the same platform. No re-platforming.",
  },
];

export function WhyDigitalo() {
  return (
    <section className="border-t border-line bg-paper-soft/40 py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Why Digitalo"
          title="The unfair advantage for creators"
          description="A commerce platform engineered like the tools you actually want to use."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col gap-4 bg-paper p-7 transition-colors hover:bg-paper-soft"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

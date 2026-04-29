import Link from "next/link";
import { ArrowRight, Boxes, Rocket, Wand2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";

const STEPS = [
  {
    step: "01",
    icon: Wand2,
    title: "Compose your product",
    description:
      "Write, upload, and design block by block in Studio — pricing, files, license keys, and rich product pages with live preview.",
    bullets: ["Block-based editor", "Live preview", "Drafts & versions"],
  },
  {
    step: "02",
    icon: Boxes,
    title: "Wire your storefront",
    description:
      "Pick a theme, set your domain, plug in checkout. Stripe, taxes, license delivery, and customer portal — done.",
    bullets: ["Custom domain", "Stripe + tax-ready", "Delivery & licenses"],
  },
  {
    step: "03",
    icon: Rocket,
    title: "Launch and scale",
    description:
      "Hit publish. Get paid. Watch real signal in Analytics — top customers, conversion, country, and product-level revenue.",
    bullets: ["Real-time analytics", "Affiliates & bundles", "Automated payouts"],
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From idea to first sale in under 15 minutes."
          description="A guided path from blank canvas to live storefront — without stitching ten tools together."
        />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-3">
          {STEPS.map(({ step, icon: Icon, title, description, bullets }, idx) => (
            <li
              key={step}
              className="relative flex flex-col gap-5 bg-paper p-7 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                  Step {step}
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-paper-muted text-ink">
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <h3 className="text-[20px] font-semibold tracking-tight text-ink">
                {title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                {description}
              </p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="inline-flex items-center rounded-full border border-line bg-paper-soft px-2.5 py-1 text-[11.5px] font-medium text-ink-muted"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              {idx < STEPS.length - 1 && (
                <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper text-ink-muted lg:inline-flex">
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[13px] text-ink-muted">
          <span>Already selling elsewhere?</span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 font-semibold text-ink hover:gap-2 transition-all"
          >
            Migrate your store
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

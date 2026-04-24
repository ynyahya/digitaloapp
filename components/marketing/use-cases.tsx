import {
  Sparkles,
  Building2,
  Users,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";

const USE_CASES = [
  {
    icon: Sparkles,
    title: "Solo creators",
    description:
      "Ship templates, ebooks, plugins, and packs from a single creator dashboard. Launch in minutes — not weeks.",
    metric: "From idea to first sale in <15 min",
  },
  {
    icon: Building2,
    title: "Agencies & studios",
    description:
      "Productize your work. Sell agency templates, design systems, and SaaS boilerplates on autopilot.",
    metric: "Up to 0% transaction fee",
  },
  {
    icon: Users,
    title: "Indie teams",
    description:
      "A storefront, license manager, and payouts in one — with seats and roles for the whole team.",
    metric: "Multi-seat creator OS",
  },
  {
    icon: GraduationCap,
    title: "Educators & coaches",
    description:
      "Sell courses, cohorts, swipe files, and worksheets with built-in delivery and customer access.",
    metric: "Built-in license + drip delivery",
  },
];

export function UseCases() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Use cases"
          title="Built for every kind of creator"
          description="From solo makers to agencies — Digitalo scales with the way you work."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map(({ icon: Icon, title, description, metric }) => (
            <li
              key={title}
              className="group relative flex flex-col rounded-2xl border border-line bg-paper p-6 transition-all hover:border-ink/20 hover:shadow-soft"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                {description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-[12px] font-medium text-ink">
                {metric}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import Link from "next/link";
import {
  Sparkles,
  ArrowUpRight,
  Compass,
  Wallet,
  Globe2,
  ShieldCheck,
  HeartHandshake,
  Rocket,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata = {
  title: "Mission — Why we built Digitalo",
  description:
    "We believe the next generation of businesses will be built by independent creators. Digitalo is the operating system to help them ship.",
};

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    title: "Creators first, always",
    desc: "Every product decision starts with creators. If it doesn't help them ship and earn more, we don't ship it.",
  },
  {
    icon: Wallet,
    title: "Transparent economics",
    desc: "No surprise fees. No revenue cliffs. Down to 0% transaction fee on Business — what you earn is yours.",
  },
  {
    icon: Globe2,
    title: "Global by default",
    desc: "Tax, VAT, currency, refunds — handled across 120+ countries from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Trust as a product surface",
    desc: "Reliability, security, and predictability are features. We treat them with the same craft as the UI.",
  },
  {
    icon: Compass,
    title: "Craft over convention",
    desc: "We sweat type, spacing, motion, and copy. Tools should feel as good to use as the products you make.",
  },
  {
    icon: Rocket,
    title: "Ship to learn",
    desc: "Real shipped products beat perfect plans. We move fast, we listen, and we improve in public.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The first creators",
    desc: "Digitalo opens to a small group of indie makers shipping templates, kits, and ebooks.",
  },
  {
    year: "2025",
    title: "Studio + Marketplace",
    desc: "Block-based product Studio launches alongside a curated marketplace and creator profiles.",
  },
  {
    year: "Now",
    title: "Operating system for creators",
    desc: "Storefronts, payouts, analytics, and automation — one platform for the modern digital creator.",
  },
  {
    year: "Next",
    title: "$1B paid to creators",
    desc: "Building toward a future where independent creators are a generational economic force.",
  },
];

export default function MissionPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-paper pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="absolute inset-x-0 top-0 h-[460px] bg-mono-radial" />
        <Container size="wide" className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <Sparkles className="h-3.5 w-3.5" />
              Our mission
            </span>
            <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[60px]">
              The operating system for the
              <br /> creator economy.
            </h1>
            <p className="mt-6 text-pretty text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
              We believe the next generation of great businesses will be built by independent
              creators — designers, makers, educators, and operators. Digitalo exists to give them
              the tools to ship, sell, and scale on their own terms.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Join the platform
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">Explore the marketplace</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="narrow">
          <div className="prose prose-neutral max-w-none">
            <h2 className="text-balance text-[28px] font-semibold leading-tight tracking-tight text-ink md:text-[34px]">
              Why we&apos;re building Digitalo.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-muted md:text-[16.5px]">
              For the first time in history, anyone with an idea and an internet connection can
              build a global business. But the tools haven&apos;t kept up. Creators stitch together
              checkout, file delivery, license keys, customer support, taxes, and analytics across
              a dozen platforms — losing time, margin, and trust along the way.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-muted md:text-[16.5px]">
              Digitalo brings every part of the creator commerce stack into one intentional,
              opinionated, beautifully designed platform. Not a no-code generator. Not a
              marketplace tax. An operating system — built with the same care as the products our
              creators ship.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-paper-soft/40 py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            align="center"
            eyebrow="Operating principles"
            title="What we believe."
            description="Six principles that guide every product, design, and engineering decision."
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex flex-col gap-4 bg-paper p-7">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted text-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <SectionHeading
            eyebrow="Timeline"
            title="Where we&apos;ve been. Where we&apos;re going."
            description="A platform built one shipped product at a time."
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {TIMELINE.map((t) => (
              <li key={t.year} className="flex flex-col gap-3 bg-paper p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                  {t.year}
                </span>
                <h3 className="text-[16px] font-semibold tracking-tight text-ink">{t.title}</h3>
                <p className="text-[13px] leading-relaxed text-ink-muted">{t.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}

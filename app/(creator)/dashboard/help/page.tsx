import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Help · Digitalo" };

const FAQ = [
  {
    q: "When do I get paid?",
    a: "Payouts ship via Stripe Connect every 14 days, on a rolling 7-day hold to cover refunds. Once Stripe Connect is linked (Sprint 3), your first payout is automatic.",
  },
  {
    q: "What does Digitalo take?",
    a: "5% platform fee + Stripe's standard 2.9% + 30¢ per order. No monthly fees. No listing fees. You keep the rest.",
  },
  {
    q: "Can I sell subscriptions or bundles?",
    a: "Yes — the schema supports ONE_TIME, SUBSCRIPTION, and BUNDLE product types. Subscription checkout lands in Sprint 3; bundles already work today via the bundle item model.",
  },
  {
    q: "How do downloads work?",
    a: "Every paid order mints one-time download tokens per file with a 30-day expiry. Customers see them on the receipt page and in their email confirmation.",
  },
  {
    q: "How do I migrate from another platform?",
    a: "Email support — we'll import your product catalog + customer list and redirect your existing storefront URLs.",
  },
];

const RESOURCES = [
  { label: "Creator handbook", href: "#" },
  { label: "Digitalo brand kit", href: "#" },
  { label: "Community (Discord)", href: "#" },
  { label: "Changelog", href: "#" },
];

export default async function HelpPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/help");

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Help & support
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Answers, fast
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Email{" "}
          <a
            href="mailto:support@digitalo.app"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            support@digitalo.app
          </a>{" "}
          if you don&apos;t see your answer below.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-paper">
        <div className="border-b border-line px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Frequently asked
          </p>
        </div>
        <dl className="flex flex-col">
          {FAQ.map((f, i) => (
            <div
              key={i}
              className="border-b border-line px-5 py-5 last:border-b-0"
            >
              <dt className="text-[14px] font-semibold text-ink">{f.q}</dt>
              <dd className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-line bg-paper p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Resources
        </p>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <li key={r.label}>
              <Link
                href={r.href}
                className="group flex items-center justify-between rounded-xl border border-line bg-paper-soft px-4 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-ink/30"
              >
                {r.label}
                <ArrowUpRight className="h-4 w-4 text-ink-subtle transition-colors group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

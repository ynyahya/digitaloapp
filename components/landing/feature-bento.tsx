import {
  Globe,
  CreditCard,
  Zap,
  KeyRound,
  Mail,
  BarChart3,
  Users,
} from "lucide-react";

export function FeatureBento() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-eyebrow uppercase text-violet">
            <span className="h-1 w-1 rounded-full bg-violet" />
            Feature suite
          </span>
          <h2 className="mt-5 text-balance text-[36px] font-black leading-[1.05] tracking-[-0.035em] text-chalk md:text-[56px]">
            Everything you'd build —{" "}
            <span className="gradient-text-violet">already shipped.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-chalk-muted md:text-[16.5px]">
            Stop wiring Stripe + Notion + Mailchimp + Circle + Teachable. We
            built it once, properly.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4">
          {/* Storefront builder — large */}
          <BentoCard className="md:col-span-4 md:row-span-2">
            <div className="grid h-full gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col">
                <Tag icon={Globe} label="Storefront" />
                <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-chalk md:text-[26px]">
                  Drag-drop pages with developer-grade output.
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-chalk-muted">
                  No-code visual editor. Custom domain, custom code, custom
                  fonts. Looks like you hired a design studio.
                </p>
                <ul className="mt-4 space-y-1.5 text-[12.5px] text-chalk-muted">
                  {["Custom domain & CSS", "20+ pre-made blocks", "Mobile-first by default"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-lime" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <BuilderMock />
            </div>
          </BentoCard>

          {/* Course cohorts — narrow */}
          <BentoCard className="md:col-span-2 md:row-span-1">
            <div className="flex h-full flex-col">
              <Tag icon={Users} label="Cohorts" />
              <h3 className="mt-3 text-[18px] font-bold leading-tight tracking-tight text-chalk">
                Live cohorts, drip lessons.
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
                Run live programs with calendar, progress, and certificates.
              </p>
              <CohortMini className="mt-4" />
            </div>
          </BentoCard>

          {/* License keys */}
          <BentoCard className="md:col-span-2 md:row-span-1">
            <div className="flex h-full flex-col">
              <Tag icon={KeyRound} label="Licensing" />
              <h3 className="mt-3 text-[18px] font-bold leading-tight tracking-tight text-chalk">
                License keys, instantly.
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
                Generate, revoke, and validate via API. SaaS-ready.
              </p>
              <KeyMini className="mt-4" />
            </div>
          </BentoCard>

          {/* Checkout — full-width */}
          <BentoCard className="md:col-span-3">
            <div className="flex h-full flex-col">
              <Tag icon={CreditCard} label="Checkout" />
              <h3 className="mt-3 text-[20px] font-bold leading-tight tracking-tight text-chalk">
                Checkout that converts 2× higher.
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
                One-click upsells, multi-currency, Apple Pay, tax handled.
              </p>
              <CheckoutMini className="mt-4" />
            </div>
          </BentoCard>

          {/* Email */}
          <BentoCard className="md:col-span-3">
            <div className="flex h-full flex-col">
              <Tag icon={Mail} label="Email" />
              <h3 className="mt-3 text-[20px] font-bold leading-tight tracking-tight text-chalk">
                Email automations, native.
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
                Welcome flows, abandoned carts, cohort drips — without
                Mailchimp.
              </p>
              <EmailMini className="mt-4" />
            </div>
          </BentoCard>

          {/* Affiliate */}
          <BentoCard className="md:col-span-2">
            <Tag icon={Zap} label="Affiliates" />
            <h3 className="mt-3 text-[18px] font-bold leading-tight tracking-tight text-chalk">
              Auto-payout affiliate program.
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
              Recruit promoters. We track, attribute, and pay out.
            </p>
          </BentoCard>

          {/* Analytics */}
          <BentoCard className="md:col-span-2">
            <Tag icon={BarChart3} label="Analytics" />
            <h3 className="mt-3 text-[18px] font-bold leading-tight tracking-tight text-chalk">
              Real-time funnel analytics.
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
              See where revenue leaks. Fix it the same hour.
            </p>
          </BentoCard>

          {/* Members */}
          <BentoCard className="md:col-span-2">
            <Tag icon={Users} label="Community" />
            <h3 className="mt-3 text-[18px] font-bold leading-tight tracking-tight text-chalk">
              Member-only spaces.
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-chalk-muted">
              Private chat, threads, and content gates per tier.
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ───────── helpers ───────── */

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-lime/25 hover:bg-white/[0.035] md:p-6",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_0%,rgba(180,243,0,0.08),transparent_70%)] opacity-0 transition group-hover:opacity-100" />
      {children}
    </div>
  );
}

function Tag({
  icon: Icon,
  label,
}: {
  icon: typeof Globe;
  label: string;
}) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-chalk-muted">
      <Icon className="h-3 w-3 text-lime" />
      {label}
    </span>
  );
}

function BuilderMock() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-night-well">
      <div className="flex items-center gap-1 border-b border-white/[0.06] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-1/3 rounded bg-white/15" />
          <div className="ml-auto h-5 w-12 rounded bg-lime" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2"
            >
              <div className="h-1 w-1/2 rounded bg-white/12" />
              <div className="mt-1 h-1 w-full rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
        <div className="rounded-md border border-lime/40 bg-lime/[0.05] p-2 ring-1 ring-lime/20">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-lime">
              Selected: Pricing block
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 rounded bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CohortMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-xl border border-white/[0.06] bg-night-well p-3",
        className,
      ].join(" ")}
    >
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 14 }).map((_, i) => {
          const active = [4, 7, 11].includes(i);
          const past = i < 5;
          return (
            <div
              key={i}
              className={[
                "aspect-square rounded grid place-items-center text-[8.5px] font-mono",
                active
                  ? "bg-lime text-night font-bold"
                  : past
                    ? "bg-white/[0.04] text-chalk-dim"
                    : "border border-white/[0.06] text-chalk-muted",
              ].join(" ")}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeyMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-xl border border-white/[0.06] bg-night-well p-3 font-mono text-[10px]",
        className,
      ].join(" ")}
    >
      {[
        { k: "TSK-A29F-…-LX2", s: "active" },
        { k: "TSK-7B14-…-MN8", s: "active" },
        { k: "TSK-D502-…-QZ0", s: "revoked" },
      ].map((row) => (
        <div
          key={row.k}
          className="flex items-center justify-between border-t border-white/[0.04] py-1.5 first:border-t-0"
        >
          <span className="text-chalk">{row.k}</span>
          <span
            className={[
              "rounded px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider",
              row.s === "active"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-white/[0.04] text-chalk-dim",
            ].join(" ")}
          >
            {row.s}
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckoutMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "grid grid-cols-2 gap-2 rounded-xl border border-white/[0.06] bg-night-well p-3",
        className,
      ].join(" ")}
    >
      <div className="space-y-1.5 text-[10px]">
        <div className="rounded border border-white/10 bg-white/[0.02] px-2 py-1.5 text-chalk-muted">
          maya@studio.com
        </div>
        <div className="flex items-center justify-between rounded border border-lime/40 bg-white/[0.02] px-2 py-1.5 ring-1 ring-lime/20">
          <span className="font-mono text-chalk">•••• 4242</span>
          <span className="font-mono text-chalk-muted">12/29</span>
        </div>
        <button className="w-full rounded bg-lime py-1.5 text-[10.5px] font-bold text-night">
          Pay $129
        </button>
      </div>
      <div className="space-y-1 rounded border border-white/[0.06] bg-white/[0.02] p-2 text-[10px]">
        <div className="flex justify-between text-chalk-muted">
          <span>Subtotal</span>
          <span className="text-chalk">$129</span>
        </div>
        <div className="flex justify-between text-emerald-400">
          <span>Discount</span>
          <span>−$13</span>
        </div>
        <div className="flex justify-between border-t border-white/[0.06] pt-1 font-bold text-chalk">
          <span>Total</span>
          <span>$116</span>
        </div>
      </div>
    </div>
  );
}

function EmailMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-xl border border-white/[0.06] bg-night-well p-3",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {[
          { t: "Trigger", c: "bg-violet/20 text-violet" },
          { t: "Wait 1d", c: "bg-white/[0.04] text-chalk-muted" },
          { t: "Email A", c: "bg-lime/15 text-lime" },
          { t: "Wait 3d", c: "bg-white/[0.04] text-chalk-muted" },
          { t: "Email B", c: "bg-lime/15 text-lime" },
        ].map((node, i, arr) => (
          <div key={node.t} className="flex items-center gap-2">
            <span
              className={[
                "rounded-md px-2 py-1 text-[9.5px] font-bold",
                node.c,
              ].join(" ")}
            >
              {node.t}
            </span>
            {i < arr.length - 1 && (
              <span className="h-px w-3 bg-white/10" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-chalk-muted">Open rate</span>
        <span className="font-mono font-bold text-chalk">62%</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-[62%] rounded-full bg-lime" />
      </div>
    </div>
  );
}

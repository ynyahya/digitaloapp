import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payouts · Digitalo" };

export default async function PayoutsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/payouts");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true, stripeAccountId: true },
  });
  if (!creator) redirect("/dashboard");

  const [paidAgg, refundedAgg] = await Promise.all([
    db.order.aggregate({
      where: {
        status: "PAID",
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
    }),
    db.order.aggregate({
      where: {
        status: "REFUNDED",
        items: { some: { product: { creatorId: creator.id } } },
      },
      _sum: { totalCents: true },
    }),
  ]);

  const gross = paidAgg._sum.totalCents ?? 0;
  const refunded = refundedAgg._sum.totalCents ?? 0;
  // Digitalo take rate placeholder: 5% platform fee + Stripe 2.9% + 30¢ per order.
  const platformFee = Math.round(gross * 0.05);
  const processingFee = Math.round(gross * 0.029);
  const net = Math.max(0, gross - refunded - platformFee - processingFee);

  const connected = Boolean(creator.stripeAccountId);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Payouts
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Get paid, every two weeks
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Earnings are paid out via Stripe Connect. Fees shown are estimates.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Gross" value={formatCurrency(gross)} />
        <KpiCard label="Refunds" value={`−${formatCurrency(refunded)}`} />
        <KpiCard label="Fees" value={`−${formatCurrency(platformFee + processingFee)}`} />
        <KpiCard label="Net" value={formatCurrency(net)} highlight />
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Stripe Connect
            </p>
            <p className="mt-1 text-[15px] font-semibold text-ink">
              {connected ? "Connected" : "Not connected"}
            </p>
            <p className="mt-1 max-w-md text-[13px] text-ink-muted">
              {connected
                ? "Payouts land in your connected Stripe account every 14 days after a 7-day rolling hold."
                : "Link a Stripe account to start receiving payouts. Digitalo never holds your money — Stripe does."}
            </p>
          </div>
          <Button variant={connected ? "secondary" : "primary"} disabled>
            {connected ? "Manage account" : "Connect Stripe"}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-4 text-[11.5px] text-ink-subtle">
          Connect onboarding ships in Sprint 3. Net earnings are held until then.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Fee breakdown
        </p>
        <dl className="mt-4 grid gap-3 text-[13px] md:grid-cols-3">
          <FeeRow label="Platform fee" value="5%" />
          <FeeRow label="Stripe processing" value="2.9% + $0.30" />
          <FeeRow label="Payout cadence" value="Every 14 days" />
        </dl>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-2xl border p-5 " +
        (highlight
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink")
      }
    >
      <p
        className={
          "text-[11px] font-semibold uppercase tracking-[0.14em] " +
          (highlight ? "text-paper/60" : "text-ink-subtle")
        }
      >
        {label}
      </p>
      <p className="mt-2 text-[26px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-paper-soft px-3.5 py-2.5">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}

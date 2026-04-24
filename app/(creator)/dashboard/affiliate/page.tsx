import { redirect } from "next/navigation";
import { ArrowUpRight, Users2, Workflow } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  CopyButton,
  CreateLinkButton,
  DeleteLinkButton,
  MarkPaidButton,
} from "@/components/affiliate/affiliate-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Affiliate · Digitalo" };

const DEFAULT_RATE_BPS = 1500; // 15% commission

export default async function AffiliatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/affiliate");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    select: { id: true, handle: true },
  });
  if (!creator) redirect("/dashboard");

  const [links, pending, paid, paidLifetime] = await Promise.all([
    db.affiliateLink.findMany({
      where: { creatorId: creator.id },
      include: {
        _count: { select: { referrals: true } },
        referrals: {
          select: {
            commission: { select: { amountCents: true, status: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.commission.findMany({
      where: {
        status: "PENDING",
        referral: { link: { creatorId: creator.id } },
      },
      include: {
        referral: {
          include: {
            link: { select: { code: true, label: true } },
            order: { select: { id: true, email: true, totalCents: true, createdAt: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.commission.findMany({
      where: {
        status: "PAID",
        referral: { link: { creatorId: creator.id } },
      },
      include: {
        referral: {
          include: {
            link: { select: { code: true, label: true } },
            order: { select: { totalCents: true, createdAt: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 20,
    }),
    // Separate aggregate for the "Paid out · Lifetime" KPI so it stays
    // correct after the 20th payout. The `paid` list above is display-only
    // (Recent payouts section) and intentionally capped at 20.
    db.commission.aggregate({
      where: {
        status: "PAID",
        referral: { link: { creatorId: creator.id } },
      },
      _sum: { amountCents: true },
    }),
  ]);

  const origin = process.env.AUTH_URL ?? "http://localhost:3000";
  const baseUrl = origin.replace(/\/$/, "");

  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);
  const totalConversions = links.reduce((a, l) => a + l._count.referrals, 0);
  const pendingCents = pending.reduce((a, c) => a + c.amountCents, 0);
  const paidCents = paidLifetime._sum.amountCents ?? 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <Workflow className="h-3.5 w-3.5" />
          Affiliate & Growth OS · Partner portal
        </div>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Turn your best customers into your biggest channel
        </h1>
        <p className="max-w-2xl text-[13.5px] text-ink-muted">
          Give partners a short link, track clicks and conversions, pay them fairly. Default commission is{" "}
          {(DEFAULT_RATE_BPS / 100).toFixed(0)}% of order total; configurable per link in an upcoming release.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active links" value={links.length.toString()} sub={`${totalClicks} total clicks`} />
        <KpiCard
          label="Conversion"
          value={`${conversionRate.toFixed(1)}%`}
          sub={`${totalConversions} conversions`}
        />
        <KpiCard
          label="Pending commissions"
          value={formatCurrency(pendingCents)}
          sub={`${pending.length} awaiting payout`}
        />
        <KpiCard label="Paid out" value={formatCurrency(paidCents)} sub="Lifetime" highlight />
      </div>

      <section className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Your links
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
              Mint as many as you need
            </h2>
          </div>
          <CreateLinkButton />
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <tr>
                <Th>Link</Th>
                <Th>Label</Th>
                <Th>Clicks</Th>
                <Th>Refs</Th>
                <Th>Earnings</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {links.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-ink-muted">
                    No links yet. Mint your first one above to start attributing sales.
                  </td>
                </tr>
              )}
              {links.map((l) => {
                const earned = l.referrals.reduce(
                  (a, r) => a + (r.commission?.amountCents ?? 0),
                  0,
                );
                const url = `${baseUrl}/a/${l.code}`;
                return (
                  <tr key={l.id} className="hover:bg-paper-soft">
                    <Td>
                      <div className="flex items-center gap-2">
                        <code className="rounded-md border border-line bg-paper-soft px-2 py-0.5 text-[11.5px] text-ink">
                          /a/{l.code}
                        </code>
                        <CopyButton text={url} />
                      </div>
                    </Td>
                    <Td className="text-ink-muted">{l.label ?? "—"}</Td>
                    <Td>{l.clicks.toLocaleString()}</Td>
                    <Td>{l._count.referrals.toLocaleString()}</Td>
                    <Td>{formatCurrency(earned)}</Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end">
                        <DeleteLinkButton id={l.id} />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11.5px] text-ink-subtle">
          Any visit to <code className="text-ink-muted">/a/CODE</code> drops a 30-day attribution cookie and
          redirects to <code className="text-ink-muted">/c/{creator.handle}</code>.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Pending commissions
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Payout queue</h2>
          </div>
          <span className="hidden items-center gap-1 text-[12px] text-ink-muted md:inline-flex">
            <Users2 className="h-3.5 w-3.5" /> {pending.length} partner
            {pending.length === 1 ? "" : "s"} waiting
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <tr>
                <Th>When</Th>
                <Th>Link</Th>
                <Th>Order</Th>
                <Th>Rate</Th>
                <Th>Amount</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pending.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-ink-muted">
                    No pending payouts. Ship a few referrals and they&apos;ll queue up here.
                  </td>
                </tr>
              )}
              {pending.map((c) => (
                <tr key={c.id} className="hover:bg-paper-soft">
                  <Td className="text-ink-muted">
                    {c.createdAt.toISOString().slice(0, 10)}
                  </Td>
                  <Td>
                    <code className="rounded-md border border-line bg-paper-soft px-2 py-0.5 text-[11.5px] text-ink">
                      /a/{c.referral.link.code}
                    </code>
                  </Td>
                  <Td className="text-ink-muted">
                    {c.referral.order ? (
                      <>
                        {c.referral.order.email} ·{" "}
                        {formatCurrency(c.referral.order.totalCents)}
                      </>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>{(c.rateBps / 100).toFixed(0)}%</Td>
                  <Td>{formatCurrency(c.amountCents)}</Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end">
                      <MarkPaidButton id={c.id} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {paid.length > 0 && (
        <section className="rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                Recent payouts
              </p>
              <h2 className="mt-1 text-[18px] font-semibold tracking-tight">Paid this cycle</h2>
            </div>
            <span className="hidden items-center gap-1 text-[12px] text-ink-muted md:inline-flex">
              <ArrowUpRight className="h-3.5 w-3.5" /> Last 20
            </span>
          </div>
          <ul className="mt-5 flex flex-col divide-y divide-line rounded-xl border border-line">
            {paid.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-[13px]"
              >
                <div className="flex items-center gap-3">
                  <code className="rounded-md border border-line bg-paper-soft px-2 py-0.5 text-[11.5px] text-ink">
                    /a/{c.referral.link.code}
                  </code>
                  <span className="text-ink-muted">
                    {c.paidAt?.toISOString().slice(0, 10) ?? "—"}
                  </span>
                </div>
                <span className="font-medium">{formatCurrency(c.amountCents)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
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
      <p
        className={
          "mt-1 text-[12px] " + (highlight ? "text-paper/70" : "text-ink-muted")
        }
      >
        {sub}
      </p>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={"px-4 py-2.5 text-[11px] font-semibold " + className}>{children}</th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={"px-4 py-3 text-ink " + className}>{children}</td>;
}

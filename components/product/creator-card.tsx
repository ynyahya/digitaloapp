import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

type Props = {
  creator: {
    handle: string;
    displayName: string;
    tagline: string | null;
    verified: boolean;
    metrics: {
      customers: number;
      totalSalesCents: number;
      productsSold: number;
    } | null;
  };
};

export function CreatorMiniCard({ creator }: Props) {
  const initials = creator.displayName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2);

  const customers = creator.metrics?.customers ?? 0;
  const totalSalesCents = creator.metrics?.totalSalesCents ?? 0;
  const productsSold = creator.metrics?.productsSold ?? 0;

  return (
    <section className="border-y border-line bg-paper-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8">
        <Link
          href={`/c/${creator.handle}`}
          className="group flex items-center gap-4"
        >
          <Avatar className="h-14 w-14 border border-line">
            <AvatarFallback className="text-[15px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold text-ink group-hover:underline">
                {creator.displayName}
              </p>
              {creator.verified && (
                <BadgeCheck className="h-4 w-4 text-ink" />
              )}
            </div>
            <p className="mt-0.5 truncate text-[12.5px] text-ink-muted">
              @{creator.handle}
              {creator.tagline && (
                <>
                  <span className="mx-1.5 text-line">·</span>
                  {creator.tagline}
                </>
              )}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-[12.5px]">
          {customers > 0 && (
            <Stat label="Customers" value={`${formatCompactNumber(customers)}+`} />
          )}
          {productsSold > 0 && (
            <Stat label="Products" value={String(productsSold)} />
          )}
          {totalSalesCents > 0 && (
            <Stat
              label="Total sales"
              value={`${formatCurrency(totalSalesCents).replace(".00", "")}+`}
            />
          )}
          <Link
            href={`/c/${creator.handle}`}
            className="inline-flex h-9 items-center rounded-full border border-line bg-paper px-4 text-[12px] font-semibold text-ink hover:border-ink/30"
          >
            View storefront
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </p>
      <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}

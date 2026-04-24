import Link from "next/link";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    .join("")
    .slice(0, 2);
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <div className="grid items-center gap-8 rounded-3xl border border-line bg-paper p-8 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-[18px]">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[18px] font-semibold">{creator.displayName}</p>
                {creator.verified && (
                  <span className="inline-flex h-5 items-center gap-1 rounded-full bg-ink px-2 text-[10px] font-medium text-paper">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] text-ink-muted">@{creator.handle}</p>
              {creator.tagline && (
                <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-ink-muted">
                  {creator.tagline}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button size="sm" asChild>
                  <Link href={`/c/${creator.handle}`}>View Storefront</Link>
                </Button>
                <Button size="sm" variant="secondary">
                  Follow
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Customers" value={`${formatCompactNumber(creator.metrics?.customers ?? 0)}+`} />
            <Stat
              label="Total Sales"
              value={`${formatCurrency(creator.metrics?.totalSalesCents ?? 0).replace(".00", "")}+`}
            />
            <Stat label="Products" value={String(creator.metrics?.productsSold ?? 0)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-soft p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </p>
      <p className="mt-1 text-[20px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}

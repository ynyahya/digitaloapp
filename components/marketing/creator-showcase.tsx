import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCompactNumber } from "@/lib/utils";

type Creator = {
  handle: string;
  displayName: string;
  verified: boolean;
  metrics: { productsSold: number; totalSalesCents: number } | null;
};

export function CreatorShowcase({ creators }: { creators: Creator[] }) {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          eyebrow="Creators"
          title="Featured Creators"
          description="Top-performing makers shipping premium digital products."
          action={
            <Link
              href="/creators"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink/30"
            >
              View all creators
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {creators.map((c) => {
            const initials = c.displayName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <Link
                key={c.handle}
                href={`/c/${c.handle}`}
                className="group flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  {c.verified && (
                    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-ink px-2 text-[10px] font-medium text-paper">
                      <Check className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{c.displayName}</p>
                  <p className="text-[12.5px] text-ink-muted">@{c.handle}</p>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-line pt-4 text-[11.5px]">
                  <div>
                    <p className="text-ink-subtle">Products</p>
                    <p className="mt-0.5 font-semibold text-ink">
                      {c.metrics?.productsSold ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink-subtle">Sales</p>
                    <p className="mt-0.5 font-semibold text-ink">
                      {c.metrics
                        ? formatCompactNumber(c.metrics.totalSalesCents / 100) + "+"
                        : "—"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

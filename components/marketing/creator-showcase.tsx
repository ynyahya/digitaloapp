import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/shared/container";
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
    <section className="bg-paper py-20 md:py-32">
      <Container size="wide">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-[28px] font-black tracking-tight text-ink md:text-[40px]">
                Top Creators
             </h2>
             <p className="mt-2 text-[15px] text-ink-muted md:text-[17px]">
                Discover the best makers in the digital ecosystem.
             </p>
          </div>
          <Link
            href="/creators"
            className="group hidden items-center gap-2 text-[14px] font-bold text-ink-muted transition-colors hover:text-ink md:flex"
          >
            All creators
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="group relative flex flex-col items-center rounded-[32px] border border-line bg-paper-soft/40 p-8 text-center transition-all duration-500 hover:bg-paper hover:shadow-2xl"
              >
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-paper shadow-xl">
                    <AvatarFallback className="bg-ink text-[24px] font-black text-paper">{initials}</AvatarFallback>
                  </Avatar>
                  {c.verified && (
                    <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 border-4 border-paper text-paper shadow-sm">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-[18px] font-black text-ink">{c.displayName}</h3>
                  <p className="text-[13px] font-bold text-ink-muted">@{c.handle}</p>
                </div>

                <div className="mt-8 grid w-full grid-cols-2 gap-4 border-t border-line/60 pt-6">
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-ink-subtle">Sales</p>
                      <p className="mt-1 text-[16px] font-black text-ink">
                        {c.metrics ? formatCompactNumber(c.metrics.productsSold) : "0"}
                      </p>
                   </div>
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-ink-subtle">Revenue</p>
                      <p className="mt-1 text-[16px] font-black text-ink">
                        {c.metrics ? "$" + formatCompactNumber(c.metrics.totalSalesCents / 100) : "—"}
                      </p>
                   </div>
                </div>

                <div className="mt-8 h-10 w-full rounded-full border border-line bg-paper px-4 flex items-center justify-center text-[13px] font-bold text-ink transition-all group-hover:bg-ink group-hover:text-paper">
                   View Profile
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

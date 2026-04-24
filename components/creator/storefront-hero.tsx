import { Check, Globe, Github, Twitter } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

type Props = {
  creator: {
    handle: string;
    displayName: string;
    tagline: string | null;
    verified: boolean;
    socials: Record<string, string>;
    tools: string[];
    metrics: {
      customers: number;
      totalSalesCents: number;
      productsSold: number;
      avgRating: number;
    } | null;
  };
};

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  github: Github,
  website: Globe,
};

export function StorefrontHero({ creator }: Props) {
  const initials = creator.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="absolute inset-x-0 top-0 h-[320px] bg-mono-radial" />
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarFallback className="text-[20px]">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[28px] font-semibold tracking-tight md:text-[36px]">
                  {creator.displayName}
                </h1>
                {creator.verified && (
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-ink px-2.5 text-[11px] font-medium text-paper">
                    <Check className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13.5px] text-ink-muted">
                @{creator.handle} · Joined in 2024
              </p>
            </div>
          </div>

          {creator.tagline && (
            <p className="max-w-xl text-pretty text-[15.5px] leading-relaxed text-ink-muted md:text-[16.5px]">
              {creator.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button size="md">Follow</Button>
            <Button size="md" variant="secondary">
              Message
            </Button>
            <div className="ml-1 flex items-center gap-1.5">
              {Object.entries(creator.socials).map(([k, v]) => {
                const Icon = SOCIAL_ICONS[k] ?? Globe;
                return (
                  <a
                    key={k}
                    href={`https://${v}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric
            label="Customers"
            value={`${formatCompactNumber(creator.metrics?.customers ?? 0)}+`}
          />
          <Metric
            label="Total Sales"
            value={`${formatCurrency(creator.metrics?.totalSalesCents ?? 0).replace(".00", "")}+`}
          />
          <Metric label="Products" value={String(creator.metrics?.productsSold ?? 0)} />
          <Metric label="Rating" value={creator.metrics?.avgRating.toFixed(1) ?? "–"} />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-5 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </p>
      <p className="mt-1 text-[20px] font-semibold tracking-tight">{value}</p>
    </div>
  );
}

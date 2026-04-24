import { Lock, RefreshCw, Shield, Zap } from "lucide-react";
import { MonoMockup } from "@/components/shared/mono-mockup";
import { formatCurrency } from "@/lib/utils";

type SummaryItem = {
  title: string;
  license: string;
  priceCents: number;
};

export function OrderSummary({ item }: { item: SummaryItem }) {
  const fee = 0;
  const subtotal = item.priceCents;
  const total = subtotal + fee;
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper p-6 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
        Order Summary
      </p>

      <div className="flex gap-4">
        <MonoMockup label={item.title} ratio="aspect-square" className="w-20 shrink-0" />
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[13.5px] font-semibold leading-tight">{item.title}</p>
            <p className="mt-1 text-[11.5px] text-ink-muted">{item.license} License</p>
          </div>
          <p className="text-[13.5px] font-semibold">{formatCurrency(item.priceCents)}</p>
        </div>
      </div>

      <div className="border-t border-line pt-4 text-[13px]">
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
        <SummaryRow label="Processing fee" value={formatCurrency(fee)} />
      </div>
      <div className="flex items-center justify-between border-t border-line pt-4 text-[15px] font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3 text-[11.5px]">
        <Trust icon={Zap} label="Instant delivery" />
        <Trust icon={RefreshCw} label="Lifetime updates" />
        <Trust icon={Shield} label="30-day guarantee" />
        <Trust icon={Lock} label="Secure checkout" />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-ink-muted">
      <span>{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function Trust({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-ink-muted">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

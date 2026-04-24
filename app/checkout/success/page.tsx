import Link from "next/link";
import { Check, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonoMockup } from "@/components/shared/mono-mockup";

export default function CheckoutSuccess() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-10 px-5 py-20 md:px-8">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
        <Check className="h-6 w-6" />
      </span>
      <div className="text-center">
        <h1 className="text-balance text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Thank you for your purchase
        </h1>
        <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-ink-muted">
          Your digital products are ready to download. We&apos;ve emailed your receipt and access
          links — check your inbox.
        </p>
      </div>

      <div className="w-full rounded-3xl border border-line bg-paper p-6 shadow-soft md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Your downloads
        </p>
        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-paper-soft p-4">
          <MonoMockup label="SaaS Starter Kit" ratio="aspect-square" className="w-20 shrink-0" />
          <div className="flex flex-1 flex-col">
            <p className="text-[14px] font-semibold">SaaS Starter Kit</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">Personal License · v1.4.0 · 184 MB</p>
          </div>
          <Button size="sm">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-[12.5px] text-ink-muted">
          <div className="rounded-xl border border-line bg-paper p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Order ID
            </p>
            <p className="mt-1 font-mono text-[12px] text-ink">DG-8F4K-0021</p>
          </div>
          <div className="rounded-xl border border-line bg-paper p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Total
            </p>
            <p className="mt-1 text-[14px] font-semibold text-ink">$49.00</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/account/orders">
            <Mail className="h-4 w-4" /> View receipt
          </Link>
        </Button>
      </div>
    </div>
  );
}

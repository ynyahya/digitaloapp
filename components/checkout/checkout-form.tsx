"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const METHODS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Wallet },
  { id: "google", label: "Google Pay", icon: Wallet },
];

export function CheckoutForm() {
  const router = useRouter();
  const [method, setMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Sprint 1: UI stub. Sprint 2 will call /api/checkout → Stripe.
    await new Promise((r) => setTimeout(r, 700));
    router.push("/checkout/success");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <SectionHeading step="1" title="Contact" />
        <Input label="Email" type="email" placeholder="you@work.com" required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" placeholder="Alex" required />
          <Input label="Last name" placeholder="Morgan" required />
        </div>
        <Select label="Country / Region" required>
          <option>United States</option>
          <option>Indonesia</option>
          <option>United Kingdom</option>
          <option>India</option>
          <option>Singapore</option>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading step="2" title="Payment" />
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-ink/30",
                )}
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        {method === "card" && (
          <div className="mt-2 space-y-3">
            <Input label="Card number" placeholder="1234 1234 1234 1234" inputMode="numeric" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Expiry" placeholder="MM / YY" />
              <Input label="CVC" placeholder="123" />
            </div>
            <Input label="Name on card" placeholder="Alex Morgan" />
          </div>
        )}
      </div>

      <Button size="lg" type="submit" disabled={submitting} className="mt-2 w-full justify-center">
        <Lock className="h-4 w-4" />
        {submitting ? "Processing…" : "Complete Purchase"}
      </Button>

      <p className="flex items-center justify-center gap-2 text-[11.5px] text-ink-muted">
        <Shield className="h-3.5 w-3.5" />
        Secured by Stripe · 256-bit encryption
      </p>
    </form>
  );
}

function SectionHeading({ step, title }: { step: string; title: string }) {
  return (
    <div className="mb-1 flex items-center gap-3">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
        {step}
      </span>
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <input
        {...props}
        className="h-11 rounded-xl border border-line bg-paper px-4 text-[14px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
      />
    </label>
  );
}

function Select({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </span>
      <select
        {...props}
        className="h-11 rounded-xl border border-line bg-paper px-4 text-[14px] text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
      >
        {children}
      </select>
    </label>
  );
}

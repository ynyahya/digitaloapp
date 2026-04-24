"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, AlertCircle, ShoppingCart, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerAction, type AuthFormState } from "@/lib/actions/auth";

type Role = "BUYER" | "CREATOR";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="h-11 w-full rounded-xl shadow-float"
      disabled={pending}
    >
      {pending ? "Creating account…" : "Create account"}
      {!pending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
}

export function RegisterForm() {
  const [role, setRole] = useState<Role>("CREATOR");
  const [state, formAction] = useFormState<AuthFormState, FormData>(
    registerAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <RoleCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="I'm a Buyer"
          description="Discover and buy products."
          selected={role === "BUYER"}
          onSelect={() => setRole("BUYER")}
        />
        <RoleCard
          icon={<Rocket className="h-5 w-5" />}
          label="I'm a Creator"
          description="Build and sell products."
          selected={role === "CREATOR"}
          onSelect={() => setRole("CREATOR")}
        />
      </div>
      <input type="hidden" name="role" value={role} />

      {state?.error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-line bg-paper-muted/60 p-3 text-[13px] text-ink"
        >
          <AlertCircle className="mt-[1px] h-4 w-4 shrink-0 text-ink" />
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Alex Morgan"
            autoComplete="name"
            required
            aria-invalid={!!state?.fieldErrors?.name}
          />
          {state?.fieldErrors?.name?.[0] ? (
            <p className="text-[12px] text-ink-muted">
              {state.fieldErrors.name[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            aria-invalid={!!state?.fieldErrors?.email}
          />
          {state?.fieldErrors?.email?.[0] ? (
            <p className="text-[12px] text-ink-muted">
              {state.fieldErrors.email[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            aria-invalid={!!state?.fieldErrors?.password}
          />
          {state?.fieldErrors?.password?.[0] ? (
            <p className="text-[12px] text-ink-muted">
              {state.fieldErrors.password[0]}
            </p>
          ) : null}
        </div>
      </div>

      <SubmitButton />

      <p className="text-center text-[12px] text-ink-subtle">
        By creating an account, you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}

function RoleCard({
  icon,
  label,
  description,
  selected,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col items-start rounded-2xl border bg-paper p-4 text-left transition-all",
        selected
          ? "border-ink shadow-float"
          : "border-line hover:border-ink/30 hover:shadow-soft",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          selected ? "bg-ink text-paper" : "bg-paper-muted text-ink",
        )}
      >
        {icon}
      </div>
      <p className="mt-3 text-[14px] font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-[12px] text-ink-muted">{description}</p>
      <span
        className={cn(
          "absolute right-3 top-3 h-4 w-4 rounded-full border transition-colors",
          selected ? "border-ink bg-ink" : "border-line",
        )}
        aria-hidden
      >
        {selected ? (
          <span className="absolute inset-0 m-auto block h-1.5 w-1.5 rounded-full bg-paper" />
        ) : null}
      </span>
    </button>
  );
}

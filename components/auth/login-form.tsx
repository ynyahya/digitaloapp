"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type AuthFormState } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="h-11 w-full rounded-xl shadow-float"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Sign in"}
      {!pending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
}

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const [state, formAction] = useFormState<AuthFormState, FormData>(
    loginAction,
    initialError ? { error: initialError } : null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-line bg-paper-muted/60 p-3 text-[13px] text-ink"
        >
          <AlertCircle className="mt-[1px] h-4 w-4 shrink-0 text-ink" />
          <span>{state.error}</span>
        </div>
      ) : null}

      <input type="hidden" name="redirectTo" value={redirectTo ?? "/dashboard"} />

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
          <p className="text-[12px] text-ink-muted">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-[12px] font-medium text-ink-muted hover:text-ink"
          >
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!state?.fieldErrors?.password}
        />
        {state?.fieldErrors?.password?.[0] ? (
          <p className="text-[12px] text-ink-muted">
            {state.fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  );
}

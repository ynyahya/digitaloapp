"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCreatorAction,
  type CreatorFormState,
} from "@/lib/actions/onboarding";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="h-11 w-full rounded-xl shadow-float"
      disabled={pending}
    >
      {pending ? "Creating profile…" : "Create profile"}
      {!pending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
    </Button>
  );
}

export function OnboardingForm({
  defaultHandle,
  defaultName,
}: {
  defaultHandle: string;
  defaultName: string;
}) {
  const [state, formAction] = useFormState<CreatorFormState, FormData>(
    createCreatorAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-line bg-paper-muted/60 p-3 text-[13px] text-ink"
        >
          <AlertCircle className="mt-[1px] h-4 w-4 shrink-0 text-ink" />
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          required
          defaultValue={defaultName}
          placeholder="Alex Morgan"
          aria-invalid={!!state?.fieldErrors?.displayName}
        />
        {state?.fieldErrors?.displayName?.[0] ? (
          <p className="text-[12px] text-ink-muted">
            {state.fieldErrors.displayName[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="handle">Storefront handle</Label>
        <div className="flex items-center overflow-hidden rounded-xl border border-line bg-paper-soft focus-within:border-ink/20 focus-within:ring-4 focus-within:ring-ink/5">
          <span className="px-3 text-[13px] text-ink-subtle">
            digitalo.app/
          </span>
          <input
            id="handle"
            name="handle"
            required
            defaultValue={defaultHandle}
            pattern="[a-z0-9-]+"
            placeholder="alexmorgan"
            className="h-10 w-full bg-transparent pr-3 text-[13px] outline-none"
            aria-invalid={!!state?.fieldErrors?.handle}
          />
        </div>
        {state?.fieldErrors?.handle?.[0] ? (
          <p className="text-[12px] text-ink-muted">
            {state.fieldErrors.handle[0]}
          </p>
        ) : (
          <p className="text-[12px] text-ink-subtle">
            Lowercase letters, numbers, and hyphens only.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tagline">Tagline (optional)</Label>
        <Input
          id="tagline"
          name="tagline"
          placeholder="Premium SaaS templates for builders."
        />
      </div>

      <SubmitButton />
    </form>
  );
}

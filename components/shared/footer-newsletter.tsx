"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function FooterNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      id="newsletter"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex h-11 max-w-sm items-center gap-1 rounded-full border border-line bg-paper p-1 shadow-soft"
    >
      {submitted ? (
        <span className="flex h-full w-full items-center justify-center gap-2 text-[13px] font-medium text-ink">
          <Check className="h-4 w-4 text-emerald-600" />
          Subscribed — thank you.
        </span>
      ) : (
        <>
          <input
            type="email"
            required
            placeholder="you@studio.com"
            aria-label="Email address"
            className="h-full flex-1 rounded-full bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-ink-subtle"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[12.5px] font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Subscribe
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </form>
  );
}

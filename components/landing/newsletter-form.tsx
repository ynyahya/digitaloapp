"use client";

import * as React from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [done, setDone] = React.useState(false);

  return (
    <form
      className="mt-6 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-1 pl-3"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="Get product updates"
        disabled={done}
        className="flex-1 bg-transparent py-2 text-[13px] text-chalk placeholder:text-chalk-dim focus:outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={done}
        className="inline-flex items-center gap-1 rounded-lg bg-lime px-3 py-2 text-[12px] font-bold text-night transition hover:bg-lime-bright disabled:opacity-80"
      >
        {done ? (
          <>
            <Check className="h-3 w-3" /> Subscribed
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}

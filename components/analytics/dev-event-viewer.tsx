"use client";

import { useEffect, useMemo, useState } from "react";

type TrackPayload = Record<string, unknown>;

type LogItem = {
  id: string;
  at: number;
  payload: TrackPayload;
};

const MAX_ITEMS = 24;

export function DevEventViewer() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [open, setOpen] = useState(false);

  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (!isDev) return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent<TrackPayload>;
      const payload = custom.detail ?? {};

      setLogs((prev) => {
        const next: LogItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          at: Date.now(),
          payload,
        };
        return [next, ...prev].slice(0, MAX_ITEMS);
      });
    };

    window.addEventListener("teskel:track", handler as EventListener);
    return () => window.removeEventListener("teskel:track", handler as EventListener);
  }, [isDev]);

  const lastEvent = useMemo(() => logs[0]?.payload?.event, [logs]);

  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] hidden max-w-[360px] md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="surface-glass inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-ink"
      >
        <span>Event Viewer (dev)</span>
        <span className="ml-3 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold text-ink-muted">
          {String(logs.length).padStart(2, "0")}
        </span>
      </button>

      {open && (
        <div className="surface-glass mt-2 max-h-[420px] overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center justify-between border-b border-line px-3 py-2 text-[11px] text-ink-muted">
            <span>Last event: {String(lastEvent ?? "—")}</span>
            <button
              type="button"
              className="text-[11px] font-semibold text-ink hover:opacity-80"
              onClick={() => setLogs([])}
            >
              Clear
            </button>
          </div>

          <ul className="max-h-[370px] space-y-2 overflow-y-auto p-2">
            {logs.length === 0 ? (
              <li className="rounded-lg border border-line bg-paper px-3 py-2 text-[11px] text-ink-muted">
                No events captured yet.
              </li>
            ) : (
              logs.map((item) => (
                <li key={item.id} className="rounded-lg border border-line bg-paper p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
                    {new Date(item.at).toLocaleTimeString()}
                  </p>
                  <pre className="mt-1 overflow-x-auto text-[10.5px] leading-relaxed text-ink-muted">
                    {JSON.stringify(item.payload, null, 2)}
                  </pre>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

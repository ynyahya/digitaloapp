import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar, Circle } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { findTemplate } from "@/lib/agents/templates";
import { AgentCanvas } from "@/components/agents/canvas";
import {
  EnableToggle,
  UninstallButton,
} from "@/components/agents/agent-actions";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/login?callbackUrl=/dashboard/agents/${params.id}`);

  const flow = await db.agentWorkflow.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      runs: { orderBy: { createdAt: "desc" }, take: 20 },
      _count: { select: { runs: true } },
    },
  });
  if (!flow) notFound();

  const tpl = findTemplate(flow.template);
  if (!tpl) notFound();

  const Icon = tpl.icon;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All agents
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-paper-soft">
              <Icon className="h-5 w-5 text-ink" />
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">
                {flow.name}
              </h1>
              <p className="mt-1 max-w-2xl text-[13.5px] text-ink-muted">
                {tpl.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={
                "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide " +
                (flow.enabled
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper-soft text-ink-muted")
              }
            >
              {flow.enabled ? "Running" : "Paused"}
            </span>
            <EnableToggle id={flow.id} enabled={flow.enabled} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {tpl.cadence}
          </span>
          <span>·</span>
          <span>{flow._count.runs} run{flow._count.runs === 1 ? "" : "s"}</span>
          <span>·</span>
          <span>Category: {tpl.category}</span>
        </div>
      </header>

      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Workflow canvas
        </p>
        <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
          Every step, visible and interruptible
        </h2>
        <div className="mt-4">
          <AgentCanvas nodes={tpl.nodes} edges={tpl.edges} />
        </div>
        <p className="mt-3 text-[11.5px] text-ink-subtle">
          Solid nodes fire automatically. Dashed nodes are conditional gates.
          AI nodes use a local heuristic today — the hook for swapping in an
          LLM is already wired up, config lives in the workflow&apos;s{" "}
          <code className="text-ink-muted">config</code> JSON.
        </p>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Activity
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
              Recent runs
            </h2>
          </div>
          <UninstallButton id={flow.id} />
        </div>
        <ul className="mt-4 flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {flow.runs.length === 0 && (
            <li className="px-5 py-12 text-center text-[13px] text-ink-muted">
              No runs yet. Enable the agent and wait for the next trigger.
            </li>
          )}
          {flow.runs.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-4 px-5 py-3 text-[13px]"
            >
              <StatusDot status={r.status} />
              <span className="w-28 shrink-0 text-ink-muted">
                {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </span>
              <span className="min-w-0 flex-1 truncate text-ink">
                {r.summary ?? r.status}
              </span>
              <span className="w-16 shrink-0 text-right text-[11.5px] text-ink-subtle">
                {r.durationMs != null ? `${r.durationMs} ms` : "—"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "SUCCEEDED"
      ? "text-ink"
      : status === "RUNNING"
        ? "text-ink-muted"
        : "text-ink";
  return (
    <Circle
      className={
        "h-2.5 w-2.5 " +
        cls +
        (status === "SUCCEEDED" ? " fill-ink" : " fill-transparent")
      }
      aria-label={status}
    />
  );
}

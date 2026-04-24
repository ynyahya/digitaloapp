import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Calendar, ChevronRight, Sparkles, Wand2 } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AGENT_TEMPLATES, findTemplate } from "@/lib/agents/templates";
import { EnableToggle, InstallButton } from "@/components/agents/agent-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Agents · Digitalo" };

export default async function AgentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/agents");

  const installed = await db.agentWorkflow.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { runs: true } },
      runs: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { status: true, createdAt: true, summary: true },
      },
    },
  });
  const installedSlugs = new Set(installed.map((i) => i.slug));
  const available = AGENT_TEMPLATES.filter((t) => !installedSlugs.has(t.id));

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <Sparkles className="h-3.5 w-3.5" />
          AI Agent Control Center
        </div>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Small autonomous helpers, always one toggle away
        </h1>
        <p className="max-w-2xl text-[13.5px] text-ink-muted">
          Install pre-built agents for pricing, launches, support and growth.
          Every agent is transparent — inspect its workflow canvas, pause it
          any time, and approve every outbound action before it ships.
        </p>
      </div>

      {installed.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Installed
            </p>
            <span className="text-[12px] text-ink-muted">
              {installed.filter((a) => a.enabled).length} of {installed.length} enabled
            </span>
          </div>
          <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
            {installed.map((a) => {
              const tpl = findTemplate(a.template);
              const Icon = tpl?.icon ?? Bot;
              const lastRun = a.runs[0];
              return (
                <li key={a.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-paper-soft">
                    <Icon className="h-4.5 w-4.5 text-ink" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/agents/${a.id}`}
                      className="inline-flex items-center gap-1 text-[14.5px] font-semibold tracking-tight text-ink hover:underline"
                    >
                      {a.name}
                      <ChevronRight className="h-3.5 w-3.5 text-ink-subtle" />
                    </Link>
                    <p className="mt-0.5 text-[12.5px] text-ink-muted">
                      {tpl?.cadence ?? "Custom schedule"} · {a._count.runs} run
                      {a._count.runs === 1 ? "" : "s"}
                      {lastRun ? (
                        <> · last: {lastRun.summary ?? lastRun.status}</>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        "hidden rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide md:inline-flex " +
                        (a.enabled
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-paper-soft text-ink-muted")
                      }
                    >
                      {a.enabled ? "Running" : "Paused"}
                    </span>
                    <EnableToggle id={a.id} enabled={a.enabled} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Gallery
            </p>
            <h2 className="mt-1 text-[20px] font-semibold tracking-tight">
              Pre-built agents
            </h2>
          </div>
          <span className="hidden items-center gap-1 text-[12px] text-ink-muted md:inline-flex">
            <Wand2 className="h-3.5 w-3.5" /> Custom workflows arrive with the agent SDK
          </span>
        </div>
        {available.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper-soft px-6 py-10 text-center text-[13px] text-ink-muted">
            You&apos;ve installed every built-in agent. Custom workflows are coming
            with the agent SDK — ping us if you want early access.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {available.map((t) => {
              const Icon = t.icon;
              return (
                <article
                  key={t.id}
                  className="flex flex-col rounded-2xl border border-line bg-paper p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper-soft">
                      <Icon className="h-4.5 w-4.5 text-ink" />
                    </div>
                    <span className="rounded-full border border-line bg-paper-soft px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-4 text-[15.5px] font-semibold tracking-tight">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[12.5px] text-ink-muted">{t.tagline}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-ink-subtle">
                    <Calendar className="h-3.5 w-3.5" /> {t.cadence}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/dashboard/agents/preview/${t.id}`}
                      className="text-[12px] font-medium text-ink-muted hover:text-ink"
                    >
                      Preview workflow →
                    </Link>
                    <InstallButton templateId={t.id} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

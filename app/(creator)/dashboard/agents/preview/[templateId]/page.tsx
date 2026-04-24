import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { auth } from "@/auth";
import { findTemplate } from "@/lib/agents/templates";
import { AgentCanvas } from "@/components/agents/canvas";
import { InstallButton } from "@/components/agents/agent-actions";

export const dynamic = "force-dynamic";

export default async function AgentPreviewPage({
  params,
}: {
  params: { templateId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=/dashboard/agents/preview/${params.templateId}`,
    );
  }
  const tpl = findTemplate(params.templateId);
  if (!tpl) notFound();

  const Icon = tpl.icon;

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <Link
        href="/dashboard/agents"
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to gallery
      </Link>
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-paper-soft">
            <Icon className="h-5 w-5 text-ink" />
          </div>
          <div>
            <span className="rounded-full border border-line bg-paper-soft px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {tpl.category}
            </span>
            <h1 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[32px]">
              {tpl.name}
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-[13.5px] text-ink-muted">{tpl.description}</p>
        <p className="inline-flex items-center gap-1 text-[12px] text-ink-muted">
          <Calendar className="h-3.5 w-3.5" /> {tpl.cadence}
        </p>
      </header>

      <div>
        <AgentCanvas nodes={tpl.nodes} edges={tpl.edges} />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-paper-soft p-5">
        <div>
          <p className="text-[13.5px] font-semibold">Install to your workspace</p>
          <p className="text-[12px] text-ink-muted">
            Agents start paused. Review the canvas, flip the toggle when ready.
          </p>
        </div>
        <InstallButton templateId={tpl.id} />
      </div>
    </div>
  );
}

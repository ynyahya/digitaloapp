"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { findTemplate } from "@/lib/agents/templates";

type Result =
  | { ok: true; id?: string }
  | { ok: false; error: string };

async function requireUserId(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in" };
  return { ok: true, userId: session.user.id };
}

export async function installAgent(templateId: string): Promise<Result> {
  const me = await requireUserId();
  if (!me.ok) return { ok: false, error: me.error };
  const tpl = findTemplate(templateId);
  if (!tpl) return { ok: false, error: "Unknown agent template" };

  try {
    const flow = await db.agentWorkflow.create({
      data: {
        userId: me.userId,
        slug: tpl.id,
        name: tpl.name,
        description: tpl.tagline,
        template: tpl.id,
        config: JSON.stringify(tpl.defaultConfig),
        enabled: false,
      },
      select: { id: true },
    });
    revalidatePath("/dashboard/agents");
    return { ok: true, id: flow.id };
  } catch (err) {
    // @@unique([userId, slug]) enforces one install per template per user.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        ok: false,
        error: "You've already installed this agent. Open it from the list above.",
      };
    }
    throw err;
  }
}

export async function setAgentEnabled(
  id: string,
  enabled: boolean,
): Promise<Result> {
  const me = await requireUserId();
  if (!me.ok) return { ok: false, error: me.error };

  const flow = await db.agentWorkflow.findFirst({
    where: { id, userId: me.userId },
    select: { id: true, enabled: true },
  });
  if (!flow) return { ok: false, error: "Agent not found" };
  if (flow.enabled === enabled) return { ok: true, id: flow.id };

  await db.agentWorkflow.update({
    where: { id: flow.id },
    data: { enabled },
  });

  // Log a synthetic "enabled" or "disabled" run so the timeline on the detail
  // page shows the lifecycle event alongside real runs.
  await db.agentRun.create({
    data: {
      workflowId: flow.id,
      status: "SUCCEEDED",
      summary: enabled
        ? "Agent enabled — will fire on next matching trigger."
        : "Agent paused.",
      durationMs: 0,
    },
  });

  revalidatePath("/dashboard/agents");
  revalidatePath(`/dashboard/agents/${id}`);
  return { ok: true, id: flow.id };
}

export async function uninstallAgent(id: string): Promise<Result> {
  const me = await requireUserId();
  if (!me.ok) return { ok: false, error: me.error };
  const flow = await db.agentWorkflow.findFirst({
    where: { id, userId: me.userId },
    select: { id: true },
  });
  if (!flow) return { ok: false, error: "Agent not found" };
  await db.agentWorkflow.delete({ where: { id: flow.id } });
  revalidatePath("/dashboard/agents");
  return { ok: true };
}

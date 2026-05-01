import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const payloadSchema = z.object({
  event: z.string().min(1).max(120),
  surface: z.string().max(120).optional(),
  pathname: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(120).optional(),
  anonymousId: z.string().max(120).optional(),
  properties: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

    await db.funnelEvent.create({
      data: {
        event: parsed.data.event,
        surface: parsed.data.surface,
        pathname: parsed.data.pathname,
        referrer: parsed.data.referrer,
        sessionId: parsed.data.sessionId,
        anonymousId: parsed.data.anonymousId,
        userAgent,
        properties: parsed.data.properties,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/auth/session";
import type { Prisma } from "@prisma/client";

// ────────────────────────────────────────────────────────────
// Ticket Types
// ────────────────────────────────────────────────────────────

export async function createTicketType(
  eventId: string,
  data: {
    name: string;
    description?: string | null;
    priceCents?: number;
    currency?: string;
    quantity?: number | null;
    salesStart?: Date | null;
    salesEnd?: Date | null;
    requireApproval?: boolean;
    hidden?: boolean;
    position?: number;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  const maxPosition = await db.ticketType.aggregate({
    where: { eventId },
    _max: { position: true },
  });
  const nextPos = data.position ?? (maxPosition._max.position ?? -1) + 1;

  const ticket = await db.ticketType.create({
    data: {
      eventId,
      name: data.name,
      description: data.description || null,
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      quantity: data.quantity ?? null,
      remainingCount: data.quantity ?? 0,
      salesStart: data.salesStart || null,
      salesEnd: data.salesEnd || null,
      requireApproval: data.requireApproval ?? false,
      hidden: data.hidden ?? false,
      position: nextPos,
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return ticket;
}

export async function updateTicketType(ticketId: string, data: Record<string, string | number | boolean | null | Date>) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const ticket = await db.ticketType.findUnique({
    where: { id: ticketId },
    include: { event: true },
  });
  if (!ticket || ticket.event.creatorId !== creator.id) throw new Error("Ticket not found");

  const allowed = [
    "name", "description", "priceCents", "currency", "quantity",
    "remainingCount", "salesStart", "salesEnd", "requireApproval", "hidden", "position",
  ];
  const sanitized: Record<string, string | number | boolean | null | Date> = {};
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const updated = await db.ticketType.update({
    where: { id: ticketId },
    data: sanitized as Prisma.TicketTypeUpdateInput,
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return updated;
}

export async function deleteTicketType(ticketId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const ticket = await db.ticketType.findUnique({
    where: { id: ticketId },
    include: { event: true },
  });
  if (!ticket || ticket.event.creatorId !== creator.id) throw new Error("Ticket not found");

  await db.ticketType.delete({ where: { id: ticketId } });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Registration Questions
// ────────────────────────────────────────────────────────────

export async function createRegistrationQuestion(
  eventId: string,
  data: {
    label: string;
    required?: boolean;
    questionType: string;
    options?: string | null;
    position?: number;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  const maxPosition = await db.registrationQuestion.aggregate({
    where: { eventId },
    _max: { position: true },
  });
  const nextPos = data.position ?? (maxPosition._max.position ?? -1) + 1;

  const question = await db.registrationQuestion.create({
    data: {
      eventId,
      label: data.label,
      required: data.required ?? false,
      questionType: data.questionType,
      options: data.options || null,
      position: nextPos,
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return question;
}

export async function updateRegistrationQuestion(
  questionId: string,
  data: Record<string, string | number | boolean | null>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const question = await db.registrationQuestion.findUnique({
    where: { id: questionId },
    include: { event: true },
  });
  if (!question || question.event.creatorId !== creator.id) throw new Error("Question not found");

  const allowed = ["label", "required", "questionType", "options", "position"];
  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const updated = await db.registrationQuestion.update({
    where: { id: questionId },
    data: sanitized as Prisma.RegistrationQuestionUpdateInput,
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return updated;
}

export async function deleteRegistrationQuestion(questionId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const question = await db.registrationQuestion.findUnique({
    where: { id: questionId },
    include: { event: true },
  });
  if (!question || question.event.creatorId !== creator.id) throw new Error("Question not found");

  await db.registrationQuestion.delete({ where: { id: questionId } });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return { success: true };
}

export async function reorderQuestions(eventId: string, orderedIds: string[]) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.registrationQuestion.updateMany({
        where: { id, eventId },
        data: { position: index },
      })
    )
  );

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Speakers
// ────────────────────────────────────────────────────────────

export async function addSpeaker(
  eventId: string,
  data: {
    name: string;
    title?: string | null;
    bio?: string | null;
    photoUrl?: string | null;
    socialLinks?: string | null;
    position?: number;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  const maxPosition = await db.eventSpeaker.aggregate({
    where: { eventId },
    _max: { position: true },
  });
  const nextPos = data.position ?? (maxPosition._max.position ?? -1) + 1;

  const speaker = await db.eventSpeaker.create({
    data: {
      eventId,
      name: data.name,
      title: data.title || null,
      bio: data.bio || null,
      photoUrl: data.photoUrl || null,
      socialLinks: data.socialLinks || null,
      position: nextPos,
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return speaker;
}

export async function updateSpeaker(speakerId: string, data: Record<string, string | number | boolean | null>) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const speaker = await db.eventSpeaker.findUnique({
    where: { id: speakerId },
    include: { event: true },
  });
  if (!speaker || speaker.event.creatorId !== creator.id) throw new Error("Speaker not found");

  const allowed = ["name", "title", "bio", "photoUrl", "socialLinks", "position"];
  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const updated = await db.eventSpeaker.update({
    where: { id: speakerId },
    data: sanitized as Prisma.EventSpeakerUpdateInput,
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return updated;
}

export async function removeSpeaker(speakerId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const speaker = await db.eventSpeaker.findUnique({
    where: { id: speakerId },
    include: { event: true },
  });
  if (!speaker || speaker.event.creatorId !== creator.id) throw new Error("Speaker not found");

  await db.eventSpeaker.delete({ where: { id: speakerId } });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Event Theme & Details
// ────────────────────────────────────────────────────────────

export async function updateEventTheme(eventId: string, data: { themeId?: string | null; themeConfig?: string | null }) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  const updated = await db.event.update({
    where: { id: eventId },
    data: {
      ...(data.themeId !== undefined && { themeId: data.themeId }),
      ...(data.themeConfig !== undefined && { themeConfig: data.themeConfig }),
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return updated;
}

export async function updateEventDetails(
  eventId: string,
  data: {
    thumbnailUrl?: string | null;
    guestListVisibility?: boolean;
    agenda?: string | null;
  }
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!event) throw new Error("Event not found");

  const updated = await db.event.update({
    where: { id: eventId },
    data: {
      ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
      ...(data.guestListVisibility !== undefined && { guestListVisibility: data.guestListVisibility }),
      ...(data.agenda !== undefined && { agenda: data.agenda }),
    },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/events/builder");
  return updated;
}

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireCreator } from "@/lib/auth/session";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function makeUniqueSlug(base: string) {
  return `${base}-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(-4)}`;
}

// ────────────────────────────────────────────────────────────
// Courses
// ────────────────────────────────────────────────────────────

export async function createCourse(data: {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  level?: string;
  category?: string | null;
  priceCents?: number;
  currency?: string;
  totalLessons?: number;
  totalHours?: number;
}) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const baseSlug = slugify(data.title);
  const slug = makeUniqueSlug(baseSlug);

  const course = await db.course.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      level: data.level || "BEGINNER",
      category: data.category || null,
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      totalLessons: data.totalLessons ?? 0,
      totalHours: data.totalHours ?? 0,
    },
  });

  revalidatePath("/dashboard/courses");
  return course;
}

export async function updateCourse(
  courseId: string,
  data: Record<string, string | number | boolean | null | Date>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const existing = await db.course.findFirst({
    where: { id: courseId, creatorId: creator.id },
  });
  if (!existing) throw new Error("Course not found");

  const sanitized: Record<string, string | number | boolean | null | Date> = {};
  const allowed = [
    "title", "subtitle", "description", "level", "category",
    "priceCents", "currency", "totalLessons", "totalHours",
    "status", "coverImage",
  ];
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const course = await db.course.update({
    where: { id: courseId },
    data: sanitized,
  });

  revalidatePath("/dashboard/courses");
  return course;
}

export async function publishCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.updateMany({
    where: { id: courseId, creatorId: creator.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  revalidatePath("/dashboard/courses");
  return course;
}

export async function unpublishCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const course = await db.course.updateMany({
    where: { id: courseId, creatorId: creator.id },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/courses");
  return course;
}

export async function deleteCourse(courseId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  await db.course.deleteMany({
    where: { id: courseId, creatorId: creator.id },
  });

  revalidatePath("/dashboard/courses");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Services
// ────────────────────────────────────────────────────────────

export async function createService(data: {
  title: string;
  description?: string | null;
  category?: string | null;
  priceCents?: number;
  currency?: string;
  deliveryDays?: number;
  revisions?: number;
}) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const baseSlug = slugify(data.title);
  const slug = makeUniqueSlug(baseSlug);

  const service = await db.service.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title,
      description: data.description || null,
      category: data.category || null,
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      deliveryDays: data.deliveryDays ?? 1,
      revisions: data.revisions ?? 0,
    },
  });

  revalidatePath("/dashboard/services");
  return service;
}

export async function updateService(
  serviceId: string,
  data: Record<string, string | number | boolean | null | Date>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const existing = await db.service.findFirst({
    where: { id: serviceId, creatorId: creator.id },
  });
  if (!existing) throw new Error("Service not found");

  const sanitized: Record<string, string | number | boolean | null | Date> = {};
  const allowed = [
    "title", "description", "category", "priceCents", "currency",
    "deliveryDays", "revisions", "status", "coverImage",
  ];
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const service = await db.service.update({
    where: { id: serviceId },
    data: sanitized,
  });

  revalidatePath("/dashboard/services");
  return service;
}

export async function publishService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const service = await db.service.updateMany({
    where: { id: serviceId, creatorId: creator.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  revalidatePath("/dashboard/services");
  return service;
}

export async function unpublishService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const service = await db.service.updateMany({
    where: { id: serviceId, creatorId: creator.id },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/services");
  return service;
}

export async function deleteService(serviceId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  await db.service.deleteMany({
    where: { id: serviceId, creatorId: creator.id },
  });

  revalidatePath("/dashboard/services");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Events
// ────────────────────────────────────────────────────────────

export async function createEvent(data: {
  title: string;
  description?: string | null;
  locationType?: string;
  venueAddress?: string | null;
  onlineUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  timezone?: string;
  priceCents?: number;
  currency?: string;
  maxAttendees?: number;
  ticketTypes?: string | null;
}) {
  if (!data.title || !data.title.trim()) {
    throw new Error("Event title is required");
  }
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const baseSlug = slugify(data.title.trim());
  const slug = makeUniqueSlug(baseSlug || "event");

  const event = await db.event.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title,
      description: data.description || null,
      locationType: data.locationType || "ONLINE",
      venueAddress: data.venueAddress || null,
      onlineUrl: data.onlineUrl || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      timezone: data.timezone || "Asia/Jakarta",
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      maxAttendees: data.maxAttendees ?? 0,
      ticketTypes: data.ticketTypes || null,
    },
  });

  revalidatePath("/dashboard/events");
  return event;
}

export async function updateEvent(
  eventId: string,
  data: Record<string, string | number | boolean | null | Date>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const existing = await db.event.findFirst({
    where: { id: eventId, creatorId: creator.id },
  });
  if (!existing) throw new Error("Event not found");

  const sanitized: Record<string, string | number | boolean | null | Date> = {};
  const allowed = [
    "title", "description", "locationType", "venueAddress", "onlineUrl",
    "startDate", "endDate", "timezone", "priceCents", "currency",
    "maxAttendees", "ticketTypes", "status", "coverImage",
  ];
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const event = await db.event.update({
    where: { id: eventId },
    data: sanitized,
  });

  revalidatePath("/dashboard/events");
  return event;
}

export async function publishEvent(eventId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.updateMany({
    where: { id: eventId, creatorId: creator.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  revalidatePath("/dashboard/events");
  return event;
}

export async function unpublishEvent(eventId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const event = await db.event.updateMany({
    where: { id: eventId, creatorId: creator.id },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/events");
  return event;
}

export async function deleteEvent(eventId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  await db.event.deleteMany({
    where: { id: eventId, creatorId: creator.id },
  });

  revalidatePath("/dashboard/events");
  return { success: true };
}

// ────────────────────────────────────────────────────────────
// Memberships
// ────────────────────────────────────────────────────────────

export async function createMembership(data: {
  title: string;
  description?: string | null;
  priceCents?: number;
  currency?: string;
  billingCycle?: string;
  benefits?: string | null;
}) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const baseSlug = slugify(data.title);
  const slug = makeUniqueSlug(baseSlug);

  const membership = await db.membership.create({
    data: {
      creatorId: creator.id,
      slug,
      title: data.title,
      description: data.description || null,
      priceCents: data.priceCents ?? 0,
      currency: data.currency || "IDR",
      billingCycle: data.billingCycle || "MONTHLY",
      benefits: data.benefits || null,
    },
  });

  revalidatePath("/dashboard/memberships");
  return membership;
}

export async function updateMembership(
  membershipId: string,
  data: Record<string, string | number | boolean | null | Date>
) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const existing = await db.membership.findFirst({
    where: { id: membershipId, creatorId: creator.id },
  });
  if (!existing) throw new Error("Membership not found");

  const sanitized: Record<string, string | number | boolean | null | Date> = {};
  const allowed = [
    "title", "description", "priceCents", "currency",
    "billingCycle", "benefits", "status", "coverImage",
  ];
  for (const key of allowed) {
    if (key in data) sanitized[key] = data[key];
  }

  const membership = await db.membership.update({
    where: { id: membershipId },
    data: sanitized,
  });

  revalidatePath("/dashboard/memberships");
  return membership;
}

export async function publishMembership(membershipId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const membership = await db.membership.updateMany({
    where: { id: membershipId, creatorId: creator.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  revalidatePath("/dashboard/memberships");
  return membership;
}

export async function unpublishMembership(membershipId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  const membership = await db.membership.updateMany({
    where: { id: membershipId, creatorId: creator.id },
    data: { status: "DRAFT" },
  });

  revalidatePath("/dashboard/memberships");
  return membership;
}

export async function deleteMembership(membershipId: string) {
  const creator = await requireCreator();
  if (!creator) throw new Error("Unauthorized");

  await db.membership.deleteMany({
    where: { id: membershipId, creatorId: creator.id },
  });

  revalidatePath("/dashboard/memberships");
  return { success: true };
}

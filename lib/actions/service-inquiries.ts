"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireCreator } from "@/lib/auth/session";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createServiceInquiry(formData: FormData) {
  const serviceId = requiredString(formData, "serviceId");
  const slug = requiredString(formData, "slug");
  const name = requiredString(formData, "name");
  const email = requiredString(formData, "email");
  const company = requiredString(formData, "company");
  const message = requiredString(formData, "message");
  const budget = requiredString(formData, "budget");
  const timeline = requiredString(formData, "timeline");

  if (!serviceId || !slug || !name || !email || !message) {
    throw new Error("Name, email, and project details are required");
  }

  const service = await db.service.findFirst({
    where: { id: serviceId, slug, status: "PUBLISHED" },
    select: { id: true, creatorId: true },
  });
  if (!service) throw new Error("Service not found");

  await db.serviceInquiry.create({
    data: {
      serviceId: service.id,
      creatorId: service.creatorId,
      name,
      email,
      company: company || null,
      message,
      budget: budget || null,
      timeline: timeline || null,
      source: "public_service_page",
    },
  });

  revalidatePath(`/s/${slug}`);
  revalidatePath("/dashboard/services/inquiries");
  redirect(`/s/${slug}?inquiry=sent#inquiry`);
}

export async function updateServiceInquiryStatus(formData: FormData) {
  const creator = await requireCreator();
  const inquiryId = requiredString(formData, "inquiryId");
  const status = requiredString(formData, "status");

  if (!inquiryId || !["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"].includes(status)) {
    throw new Error("Invalid inquiry update");
  }

  await db.serviceInquiry.updateMany({
    where: { id: inquiryId, creatorId: creator.id },
    data: { status },
  });

  revalidatePath("/dashboard/services/inquiries");
}

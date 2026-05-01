import type { ReadinessCheck } from "./types";

export type EventReadinessData = {
  title?: string | null;
  description?: string | null;
  startDate?: string | Date | null;
  timezone?: string | null;
  locationType?: string | null;
  venueAddress?: string | null;
  onlineUrl?: string | null;
  coverImage?: string | null;
  tickets?: unknown[];
  speakers?: unknown[];
  agenda?: string | null;
};

const hasText = (value?: string | null, min = 1) => Boolean(value && value.trim().length >= min);

export function getEventReadiness(event: EventReadinessData): ReadinessCheck[] {
  const isOnline = event.locationType === "ONLINE";
  return [
    {
      id: "title",
      label: "Event title",
      description: "Make the event easy to understand at a glance.",
      severity: "required",
      done: hasText(event.title, 3),
      actionLabel: "Edit title",
      targetSection: "details",
    },
    {
      id: "description",
      label: "Event description",
      description: "Explain who it is for and why they should attend.",
      severity: "required",
      done: hasText(event.description, 40),
      actionLabel: "Improve description",
      targetSection: "details",
    },
    {
      id: "schedule",
      label: "Date and time",
      description: "Set a clear start time so attendees can plan.",
      severity: "required",
      done: Boolean(event.startDate) && hasText(event.timezone),
      actionLabel: "Set schedule",
      targetSection: "schedule",
    },
    {
      id: "location",
      label: isOnline ? "Online URL" : "Venue address",
      description: "Tell attendees where the event happens.",
      severity: "required",
      done: isOnline ? hasText(event.onlineUrl) : hasText(event.venueAddress),
      actionLabel: "Set location",
      targetSection: "location",
    },
    {
      id: "tickets",
      label: "Ticket tier",
      description: "Add at least one ticket tier before launch.",
      severity: "required",
      done: Boolean(event.tickets?.length),
      actionLabel: "Add ticket",
      targetSection: "tickets",
    },
    {
      id: "speaker",
      label: "Host or speaker",
      description: "Speaker details increase trust and conversion.",
      severity: "recommended",
      done: Boolean(event.speakers?.length),
      actionLabel: "Add speaker",
      targetSection: "speakers",
    },
    {
      id: "agenda",
      label: "Agenda",
      description: "Give attendees a clear flow for the session.",
      severity: "recommended",
      done: hasText(event.agenda, 20),
      actionLabel: "Add agenda",
      targetSection: "agenda",
    },
    {
      id: "cover",
      label: "Cover image",
      description: "A strong cover improves share previews.",
      severity: "recommended",
      done: hasText(event.coverImage),
      actionLabel: "Add cover",
      targetSection: "design",
    },
  ];
}

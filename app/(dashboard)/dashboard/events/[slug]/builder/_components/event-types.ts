export type EventTicket = { id: string; name: string; description: string | null; priceCents: number; currency: string; quantity: number | null; remainingCount: number; requireApproval: boolean; hidden: boolean; position: number };
export type EventQuestion = { id: string; label: string; required: boolean; questionType: string; options: string | null; position: number };
export type EventSpeaker = { id: string; name: string; title: string | null; bio: string | null; photoUrl: string | null; socialLinks: string | null; position: number };

export type EventBuilderData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  locationType: string;
  venueAddress: string | null;
  onlineUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  timezone: string;
  priceCents: number;
  currency: string;
  status: string;
  maxAttendees: number;
  coverImage: string | null;
  themeId: string | null;
  themeConfig: string | null;
  agenda: string | null;
  guestListVisibility: boolean;
  tickets: EventTicket[];
  questions: EventQuestion[];
  speakers: EventSpeaker[];
};

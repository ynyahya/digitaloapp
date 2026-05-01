import { EventBuilderClient } from "./_components/event-builder-client";

export default function EventBuilderPage({ params }: { params: { slug: string } }) {
  return <EventBuilderClient slug={params.slug} />;
}

import { ServiceBuilderClient } from "./_components/service-builder-client";

export default function ServiceBuilderPage({ params }: { params: { slug: string } }) {
  return <ServiceBuilderClient slug={params.slug} />;
}

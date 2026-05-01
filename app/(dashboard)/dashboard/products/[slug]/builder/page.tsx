import { ProductBuilderRouteClient } from "./product-builder-route-client";

export default function ProductBuilderRoute({ params }: { params: { slug: string } }) {
  return <ProductBuilderRouteClient slug={params.slug} />;
}

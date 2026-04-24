import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { getProductBySlug } from "@/lib/queries/products";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { product?: string; license?: string };
}) {
  if (!searchParams.product) {
    // Allow direct navigation to /checkout to preview with a default demo product.
    const product = await getProductBySlug("saas-starter-kit");
    if (!product) notFound();
    const license = product.licenses[0];
    return render(product, license);
  }

  const product = await getProductBySlug(searchParams.product);
  if (!product) notFound();
  const license =
    product.licenses.find((l) => l.id === searchParams.license) ?? product.licenses[0];

  return render(product, license);
}

function render(
  product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>,
  license: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>["licenses"][number] | undefined,
) {
  const li = license ?? { id: "", name: "Standard", priceCents: product.priceCents };
  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-line bg-paper p-6 md:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Checkout
        </p>
        <h1 className="mt-2 text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">
          Complete your purchase
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-muted">
          Instant access, lifetime updates, 30-day money-back guarantee.
        </p>
        <div className="mt-8">
          <CheckoutForm />
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          item={{ title: product.title, license: li.name, priceCents: li.priceCents }}
        />
      </div>
    </div>
  );
}

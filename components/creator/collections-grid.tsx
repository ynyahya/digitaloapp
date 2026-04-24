import Link from "next/link";
import { MonoMockup } from "@/components/shared/mono-mockup";

type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  products: { id: string }[];
};

export function CollectionsGrid({
  collections,
  creatorHandle,
}: {
  collections: Collection[];
  creatorHandle: string;
}) {
  if (!collections.length) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Collections
        </p>
        <h2 className="mt-2 text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">
          Curated collections
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/c/${creatorHandle}/collections/${c.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <MonoMockup label={c.name} ratio="aspect-[4/3]" className="rounded-xl" />
              <div>
                <p className="text-[14.5px] font-semibold text-ink">{c.name}</p>
                {c.description && (
                  <p className="mt-1 line-clamp-2 text-[12.5px] text-ink-muted">
                    {c.description}
                  </p>
                )}
                <p className="mt-3 text-[11.5px] text-ink-subtle">
                  {c.products.length} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SectionHeading } from "./course-outcomes";

interface RelatedCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  coverImage: string | null;
  thumbnailUrl: string | null;
  priceCents: number;
  currency: string;
  level: string;
  totalLessons: number;
  creator: { handle: string; displayName: string };
  _count: { enrollments: number };
}

export function CourseRelated({
  courses,
  creatorName,
}: {
  courses: RelatedCourse[];
  creatorName: string;
}) {
  if (courses.length === 0) return null;
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <SectionHeading
          eyebrow="Keep learning"
          title={`More from ${creatorName}`}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const poster = c.coverImage || c.thumbnailUrl;
            return (
              <Link
                key={c.id}
                href={`/c/${c.creator.handle}/${c.slug}`}
                className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-night transition-all hover:shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.06]">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={c.title}
                      fill
                      sizes="(min-width: 1024px) 340px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper-sunken to-paper-muted">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime/10">
                        <Play className="h-4 w-4 text-chalk" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-chalk-muted">
                    {c.level.toLowerCase()}
                  </p>
                  <h3 className="mt-2 text-[15.5px] font-bold leading-snug text-chalk line-clamp-2">
                    {c.title}
                  </h3>
                  {c.subtitle && (
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-chalk-muted">
                      {c.subtitle}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-chalk tabular-nums">
                      {c.priceCents === 0 ? "Free" : formatCurrency(c.priceCents, c.currency)}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-chalk-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-chalk" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

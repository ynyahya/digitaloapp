import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./course-outcomes";

interface CourseInstructorProps {
  creator: {
    handle: string;
    displayName: string;
    tagline: string | null;
    bio: string | null;
    avatarUrl: string | null;
    verified: boolean;
  };
  enrollmentCount: number;
  courseCount?: number;
}

export function CourseInstructor({ creator, enrollmentCount, courseCount }: CourseInstructorProps) {
  return (
    <section id="instructor" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-24">
        <SectionHeading eyebrow="Instructor" title="Meet your instructor" />

        <div className="mt-12 grid gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-14 lg:gap-20">
          <div className="flex items-start md:block">
            <div className="relative h-[180px] w-[180px] overflow-hidden rounded-3xl border border-line bg-paper-muted md:h-[220px] md:w-[220px]">
              {creator.avatarUrl ? (
                <Image
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink text-[56px] font-extrabold text-paper">
                  {creator.displayName[0]}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[28px] font-extrabold leading-tight tracking-[-0.01em] text-ink">
                {creator.displayName}
              </h3>
              {creator.verified && (
                <span className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            {creator.tagline && (
              <p className="mt-2 text-[15px] font-medium text-ink-muted">{creator.tagline}</p>
            )}

            {/* Stats */}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Stat label="Students" value={enrollmentCount.toLocaleString()} />
              {typeof courseCount === "number" && courseCount > 0 && (
                <Stat label="Courses" value={courseCount.toString()} />
              )}
            </div>

            {creator.bio && (
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-ink-muted">
                {creator.bio}
              </p>
            )}

            <Link
              href={`/c/${creator.handle}`}
              className="mt-8 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-ink transition-colors hover:text-ink-soft"
            >
              View creator profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[22px] font-extrabold tabular-nums text-ink">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
    </div>
  );
}

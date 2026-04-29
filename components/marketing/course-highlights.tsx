"use client";

import { Container } from "@/components/shared/container";
import { PublicCourseCard, type PublicCourseCardData } from "@/components/marketplace/public-course-card";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CourseHighlights({
  courses,
}: {
  courses: PublicCourseCardData[];
}) {
  if (courses.length === 0) return null;

  return (
    <section className="bg-paper py-20 md:py-32 border-t border-line">
      <Container size="wide">
        <div className="flex flex-col">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-soft px-3 py-1.5 text-[12px] font-medium text-violet-600">
              <GraduationCap className="h-3.5 w-3.5" />
              Learn from Experts
            </span>
            <div className="mt-6 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
              <div className="max-w-2xl">
                <h2 className="text-[32px] font-black leading-tight tracking-tight text-ink md:text-[48px]">
                  Trending Courses.
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
                  Level up your skills with comprehensive video courses created by industry leaders.
                  Learn at your own pace with lifetime access.
                </p>
              </div>
              <Button variant="outline" size="lg" className="hidden rounded-full md:inline-flex" asChild>
                <Link href="/courses">
                  Browse all courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.slice(0, 4).map((c) => (
                <PublicCourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <Button variant="outline" size="lg" className="w-full rounded-full" asChild>
              <Link href="/courses">
                Browse all courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

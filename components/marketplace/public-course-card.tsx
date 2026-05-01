import Link from "next/link";
import { Star, Clock, BookOpen, GraduationCap, Play } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export interface PublicCourseCardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  creatorName: string;
  creatorHandle: string;
  creatorImage?: string | null;
  priceCents: number;
  currency: string;
  ratingAvg: number;
  ratingCount: number;
  enrollments: number;
  totalLessons: number;
  totalHours: number;
  coverImage: string | null;
  level: string;
}

export function PublicCourseCard({ course }: { course: PublicCourseCardData }) {
  return (
    <div className="group relative">
      <Link
        href={`/c/${course.creatorHandle}/${course.slug}`}
        className="flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-night transition-all duration-500 hover:border-lime/30 hover:shadow-2xl h-full"
      >
        {/* Visual Preview */}
        <div className="relative aspect-video w-full overflow-hidden bg-line">
          {course.coverImage ? (
            <Image src={course.coverImage} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-paper-muted to-line/50 flex items-center justify-center">
              <Play className="h-10 w-10 text-chalk/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded-full bg-night/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-chalk shadow-sm uppercase tracking-widest">
              {course.level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6 border border-white/[0.08]">
              <AvatarImage src={course.creatorImage || undefined} />
              <AvatarFallback className="bg-lime text-[10px] font-bold text-night">
                {course.creatorHandle.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] font-bold text-chalk-muted">{course.creatorName}</span>
          </div>

          <h3 className="text-[18px] font-bold tracking-tight text-chalk mb-2 line-clamp-2">
            {course.title}
          </h3>

          <div className="flex items-center gap-4 text-[12px] text-chalk-muted mb-6">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{Math.round(course.totalHours)}h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{course.enrollments}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-1 text-[13px] font-bold text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{course.ratingAvg.toFixed(1)}</span>
              <span className="text-chalk-muted font-normal text-[11px]">({course.ratingCount})</span>
            </div>
            
            <span className="text-[18px] font-black tracking-tight text-chalk">
              {course.priceCents === 0 ? "Free" : formatCurrency(course.priceCents, course.currency)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

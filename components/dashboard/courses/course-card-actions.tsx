"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  ExternalLink,
  Copy,
  Archive,
  ArchiveRestore,
  Trash2,
  Share2,
  BarChart3,
  CheckCircle2,
  Rocket,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  archiveCourse,
  unarchiveCourse,
  deleteCourse,
  duplicateCourse,
  publishCourse,
  unpublishCourse,
} from "@/lib/actions/courses";

type Props = {
  course: {
    id: string;
    slug: string;
    title: string;
    status: string;
  };
  variant?: "icon" | "inline";
};

export function CourseCardActions({ course, variant = "icon" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const isArchived = course.status === "ARCHIVED";
  const isPublished = course.status === "PUBLISHED";

  const handleCopy = () => {
    const url = `${window.location.origin}/c/${course.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <button
            className="h-8 w-8 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-soft transition-colors flex items-center justify-center"
            disabled={isPending}
            aria-label="Course actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-[12px] font-bold border-line">
            <MoreHorizontal className="h-3.5 w-3.5 mr-1.5" />
            More
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-line bg-paper shadow-float p-1.5">
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
          Course actions
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer">
          <Link href={`/dashboard/courses/${course.slug}`}>
            <Pencil className="h-3.5 w-3.5" />
            Open Builder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer">
          <Link href={`/c/${course.slug}`} target="_blank">
            <Eye className="h-3.5 w-3.5" />
            Preview store page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer">
          <Link href={`/dashboard/analytics`}>
            <BarChart3 className="h-3.5 w-3.5" />
            View analytics
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCopy}
          className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Link copied
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              Copy share link
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => run(() => duplicateCourse(course.id))}
          className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!isPublished ? (
          <DropdownMenuItem
            onClick={() => run(() => publishCourse(course.id))}
            className="rounded-lg px-2.5 py-2 text-[13px] font-bold gap-2 cursor-pointer text-emerald-700 focus:bg-emerald-50"
          >
            <Rocket className="h-3.5 w-3.5" />
            Publish course
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => run(() => unpublishCourse(course.id))}
            className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer"
          >
            <ArchiveRestore className="h-3.5 w-3.5" />
            Unpublish
          </DropdownMenuItem>
        )}
        {!isArchived ? (
          <DropdownMenuItem
            onClick={() => run(() => archiveCourse(course.id))}
            className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer"
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => run(() => unarchiveCourse(course.id))}
            className="rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2 cursor-pointer"
          >
            <ArchiveRestore className="h-3.5 w-3.5" />
            Restore
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            if (confirm(`Delete '${course.title}'? This cannot be undone.`)) {
              run(() => deleteCourse(course.id));
            }
          }}
          className="rounded-lg px-2.5 py-2 text-[13px] font-bold gap-2 cursor-pointer text-red-600 focus:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import Link from "next/link";
import { LayoutTemplate, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "notion-mastery", title: "Notion Mastery", chapters: 8, lessons: 42, duration: "6h", category: "Productivity", palette: "from-neutral-900 to-neutral-700" },
  { id: "web3-101", title: "Web3 Fundamentals", chapters: 6, lessons: 28, duration: "4h 30m", category: "Crypto", palette: "from-emerald-700 to-emerald-400" },
  { id: "photo-bootcamp", title: "Photography Bootcamp", chapters: 10, lessons: 56, duration: "8h 15m", category: "Creative", palette: "from-zinc-900 to-zinc-600" },
  { id: "ig-growth", title: "Instagram Growth Lab", chapters: 5, lessons: 24, duration: "3h", category: "Marketing", palette: "from-slate-900 to-slate-600" },
  { id: "writing-craft", title: "Writing That Sells", chapters: 7, lessons: 30, duration: "5h", category: "Writing", palette: "from-neutral-800 to-neutral-500" },
  { id: "ai-prompting", title: "AI Prompt Engineering", chapters: 6, lessons: 26, duration: "4h", category: "AI", palette: "from-zinc-800 to-zinc-500" },
  { id: "design-system", title: "Design Systems 101", chapters: 9, lessons: 48, duration: "7h", category: "Design", palette: "from-neutral-900 to-neutral-600" },
  { id: "music-production", title: "Music Production Basics", chapters: 8, lessons: 36, duration: "6h 30m", category: "Music", palette: "from-slate-800 to-slate-500" },
];

export function TemplateRail() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-subtle">
            Curated templates
          </p>
          <h3 className="text-[20px] font-bold tracking-tight text-ink mt-1 leading-tight">
            Start from a proven curriculum
          </h3>
          <p className="text-[12.5px] text-ink-muted mt-0.5">
            12 template blueprints used by best-selling creators on TESKEL.
          </p>
        </div>
        <Link
          href="/dashboard/courses/new?mode=template"
          className="text-[12px] font-bold text-ink hover:underline underline-offset-4 inline-flex items-center gap-1"
        >
          Browse all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {TEMPLATES.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/courses/new?template=${t.id}`}
            className="group min-w-[260px] snap-start rounded-2xl border border-line bg-paper shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all overflow-hidden"
          >
            <div className={cn("aspect-[16/9] bg-gradient-to-br relative", t.palette)}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-paper/15 text-paper text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm">
                {t.category}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <LayoutTemplate className="h-3.5 w-3.5 text-paper/80" />
                <p className="text-[11px] text-paper/80 font-bold uppercase tracking-[0.14em]">
                  Template
                </p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[13.5px] font-bold text-ink leading-snug group-hover:underline underline-offset-4 decoration-ink/30">
                {t.title}
              </p>
              <p className="text-[11.5px] text-ink-muted">
                {t.chapters} chapters · {t.lessons} lessons · {t.duration}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

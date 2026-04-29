import { Container } from "@/components/shared/container";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    id: "ui-kits",
    name: "UI Kits",
    tags: "Figma, Sketch, Adobe XD",
    color: "from-blue-500/20 to-indigo-500/20",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "templates",
    name: "Templates",
    tags: "React, Next.js, HTML",
    color: "from-emerald-500/20 to-teal-500/20",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "illustrations",
    name: "Illustrations",
    tags: "SVG, AI, Figma",
    color: "from-amber-500/20 to-orange-500/20",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "mockups",
    name: "Mockups",
    tags: "Photoshop, Figma",
    color: "from-rose-500/20 to-pink-500/20",
    image: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3d-assets",
    name: "3D Assets",
    tags: "Blender, C4D, OBJ",
    color: "from-violet-500/20 to-purple-500/20",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "fonts",
    name: "Fonts",
    tags: "TTF, OTF, WOFF",
    color: "from-sky-500/20 to-blue-500/20",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
  }
];

export function CategoryBrowseSection() {
  return (
    <section className="bg-paper-soft py-20 md:py-32">
      <Container size="wide">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-black tracking-tight text-ink md:text-[40px]">
              Browse by category
            </h2>
            <p className="mt-2 text-[15px] text-ink-muted md:text-[17px]">
              Explore over 12,000+ high-quality digital assets.
            </p>
          </div>
          <Link
            href="/categories"
            className="group hidden items-center gap-2 text-[14px] font-bold text-ink-muted transition-colors hover:text-ink md:flex"
          >
            All categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group relative overflow-hidden rounded-[32px] border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-2xl"
            >
              <div className={cn("aspect-[16/10] bg-gradient-to-br transition-opacity duration-500 group-hover:opacity-80", cat.color)}>
                 <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700"
                 />
              </div>
              <div className="flex items-center justify-between p-8">
                <div>
                  <h3 className="text-[20px] font-black text-ink">{cat.name}</h3>
                  <p className="mt-1 text-[12px] font-bold text-ink-muted uppercase tracking-wider">{cat.tags}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-muted text-ink-muted transition-all group-hover:bg-ink group-hover:text-paper">
                   <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-ink"
          >
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

import { ExternalLink } from "lucide-react";
import { getEmbedUrl, isSafeDemoUrl } from "./product-helpers";

interface ProductDemoEmbedProps {
  demoUrl: string | null;
  videoUrl: string | null;
  title: string;
}

export function ProductDemoEmbed({
  demoUrl,
  videoUrl,
  title,
}: ProductDemoEmbedProps) {
  const embedVideo = getEmbedUrl(videoUrl);
  const demoSafe = isSafeDemoUrl(demoUrl);
  if (!embedVideo && !demoSafe) return null;

  return (
    <section id="demo" className="scroll-mt-24">
      <div className="border-b border-line pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Live preview
            </p>
            <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-ink md:text-[26px]">
              {embedVideo && demoSafe
                ? "Watch the walkthrough or try the live demo"
                : embedVideo
                  ? "Watch the walkthrough"
                  : "Try it live"}
            </h2>
          </div>
          {demoSafe && (
            <a
              href={demoUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-4 text-[12.5px] font-semibold text-ink transition-colors hover:border-ink/30"
            >
              Open demo <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-ink">
        {embedVideo ? (
          <div className="relative aspect-video">
            <iframe
              src={embedVideo}
              title={`${title} walkthrough`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : demoSafe ? (
          <div className="relative aspect-[16/10]">
            <iframe
              src={demoUrl!}
              title={`${title} demo`}
              className="absolute inset-0 h-full w-full bg-paper"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

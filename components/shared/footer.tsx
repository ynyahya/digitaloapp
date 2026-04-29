import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { FooterNewsletter } from "@/components/shared/footer-newsletter";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Marketplace", href: "/products" },
      { label: "Creators", href: "/creators" },
      { label: "Pricing", href: "/pricing" },
      { label: "Bundles", href: "/products?sort=trending" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Start selling", href: "/register" },
      { label: "Sign in", href: "/login" },
      { label: "Become a creator", href: "/register" },
      { label: "Studio", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Mission", href: "/mission" },
      { label: "Manifesto", href: "/mission" },
      { label: "Contact", href: "mailto:hello@teskel.app" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-soft pt-16 pb-10">
      <Container size="wide">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex max-w-sm flex-col gap-5 md:col-span-3">
            <Logo />
            <p className="text-[13.5px] leading-relaxed text-ink-muted">
              The engine for digital product. Build, sell, and scale your digital
              creations on a platform engineered like the tools you actually want to use.
            </p>

            {/* Newsletter */}
            <FooterNewsletter />

            <div className="flex items-center gap-2 text-ink-muted">
              {[
                { l: "X", h: "https://x.com" },
                { l: "YT", h: "https://youtube.com" },
                { l: "GH", h: "https://github.com" },
                { l: "IG", h: "https://instagram.com" },
              ].map((s) => (
                <a
                  key={s.l}
                  href={s.h}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-[10px] font-semibold transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {s.l}
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-[12px] text-ink-subtle md:flex-row">
          <p>© {new Date().getFullYear()} TESKEL. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </p>
          <p>Crafted for creators and founders shipping the next indie empire.</p>
        </div>
      </Container>
    </footer>
  );
}

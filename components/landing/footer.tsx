import Link from "next/link";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Storefront", href: "/products" },
      { label: "Courses", href: "/courses" },
      { label: "Creators", href: "/creators" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Mission", href: "/mission" },
      { label: "Changelog", href: "/changelog" },
      { label: "Docs", href: "/docs" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/mission" },
      { label: "Customers", href: "/creators" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Refund", href: "/legal/refund" },
      { label: "Security", href: "/legal/security" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-night">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-lime-fade opacity-60 mask-fade-edges-x" />
      <div className="mx-auto w-full max-w-[1360px] px-5 py-16 md:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-[13px] font-black text-night shadow-[0_0_28px_-6px_rgba(180,243,0,0.7)]">
                T
              </span>
              <span className="text-[16px] font-bold tracking-[-0.02em] text-chalk">
                TESKEL
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-chalk-muted">
              The operating system for digital creators. Sell products, run
              cohorts, grow your audience — all in one place.
            </p>

            <div className="mt-6 flex items-center gap-2 text-[12px] font-medium text-chalk-muted">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse-soft" />
              All systems normal
            </div>

            <form
              className="mt-6 flex max-w-sm items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-1 pl-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Get product updates"
                className="flex-1 bg-transparent py-2 text-[13px] text-chalk placeholder:text-chalk-dim focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-lime px-3 py-2 text-[12px] font-bold text-night transition hover:bg-lime-bright"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-eyebrow uppercase text-chalk-dim">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-chalk-muted transition hover:text-chalk"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/[0.06] pt-6 md:flex-row md:items-center">
          <p className="text-[12px] text-chalk-dim">
            © {new Date().getFullYear()} TESKEL. Built for creators worldwide.
          </p>
          <div className="flex items-center gap-1">
            {[
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Github, href: "https://github.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Youtube, href: "https://youtube.com" },
            ].map(({ icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-chalk-muted transition hover:bg-white/[0.04] hover:text-chalk"
                aria-label={href}
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

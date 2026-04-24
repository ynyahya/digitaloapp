import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Browse Products", href: "/products" },
      { label: "Top Creators", href: "/creators" },
      { label: "Bundles", href: "/bundles" },
      { label: "New Arrivals", href: "/products?filter=new" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Help Center", href: "/help" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Docs", href: "/developers/docs" },
      { label: "Integrations", href: "/developers/integrations" },
      { label: "Webhooks", href: "/developers/webhooks" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy & Terms", href: "/legal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper pt-16 pb-10">
      <Container size="wide">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex max-w-xs flex-col gap-4">
            <Logo />
            <p className="text-[13px] leading-relaxed text-ink-muted">
              The premium marketplace for digital products and creators. Templates,
              SaaS boilerplates, UI kits and assets beautifully curated.
            </p>
            <div className="flex items-center gap-3 text-ink-muted">
              {["X", "YT", "IG", "GH"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-[10px] font-semibold transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
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
          <p>© {new Date().getFullYear()} Digitalo, Inc. All rights reserved.</p>
          <p>Crafted for creators and founders shipping the next indie empire.</p>
        </div>
      </Container>
    </footer>
  );
}

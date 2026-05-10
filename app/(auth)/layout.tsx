import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-theme grain-overlay relative flex min-h-screen flex-col overflow-hidden bg-paper text-ink">
      <div className="pointer-events-none absolute inset-0 bg-accent-glow opacity-70" />
      <div className="pointer-events-none absolute inset-0 grid-dark opacity-30 mask-radial-fade" />
      <header className="relative z-10 flex h-20 items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group inline-flex items-center gap-2 transition-opacity hover:opacity-90">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-[13px] font-black text-night lime-shadow">
            T
          </span>
          <span className="text-[16px] font-bold tracking-[-0.02em] text-ink">
            TESKEL
          </span>
        </Link>
        <Link
          href="/products"
          className="hidden rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-muted transition hover:text-ink md:inline-flex"
        >
          Explore marketplace
        </Link>
        <ThemeToggle className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition hover:text-ink" />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-line bg-paper-soft shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden border-r border-line bg-paper p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-lime-glow opacity-70" />
            <div className="absolute inset-0 grid-dark-fine opacity-35" />
            <div className="relative">
              <p className="text-eyebrow uppercase text-lime">Creator operating system</p>
              <h2 className="mt-5 max-w-md text-display-sm gradient-text-lime">
                Build, ship, and sell from one luminous dashboard.
              </h2>
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-muted">
                Join a dark-mode studio designed around premium products, smooth checkout, and creator growth.
              </p>
            </div>
            <div className="relative grid grid-cols-3 gap-3">
              {[
                ["$2.4M+", "GMV tracked"],
                ["12k+", "Creators"],
                ["99.9%", "Uptime"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-line bg-paper-soft p-4">
                  <p className="text-[20px] font-black text-ink">{value}</p>
                  <p className="mt-1 text-[11px] text-ink-subtle">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="mx-auto w-full max-w-[420px] rounded-3xl border border-line bg-paper/70 p-6 shadow-2xl shadow-black/25 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      <footer className="relative z-10 p-8 text-center">
        <p className="text-[12px] text-ink-subtle">
          &copy; {new Date().getFullYear()} TESKEL. Built for creators.
        </p>
      </footer>
    </div>
  );
}

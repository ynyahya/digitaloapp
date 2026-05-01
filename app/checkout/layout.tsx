import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-theme grain-overlay relative flex min-h-screen flex-col overflow-hidden bg-night text-chalk">
      <div className="pointer-events-none absolute inset-0 bg-accent-glow opacity-50" />
      <div className="pointer-events-none absolute inset-0 grid-dark opacity-20 mask-radial-fade" />
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-night/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-[13px] font-black text-night lime-shadow">T</span>
            <span className="text-[16px] font-bold tracking-[-0.02em] text-chalk">TESKEL</span>
            <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-chalk-muted">Checkout</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-chalk-muted">
            <div className="flex items-center gap-2 text-lime">
               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime text-[10px] text-night">1</span>
               Details
            </div>
            <div className="flex items-center gap-2 opacity-40">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-[10px]">2</span>
               Payment
            </div>
            <div className="flex items-center gap-2 opacity-40">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-[10px]">3</span>
               Success
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-bold text-lime">
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Secure Session</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>
      <main className="relative z-[1] flex-1">{children}</main>
      <footer className="relative z-[1] border-t border-white/[0.08] py-10 bg-night/80">
        <div className="mx-auto max-w-[1200px] px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-chalk-dim font-medium">
          <p>© {new Date().getFullYear()} TESKEL, Inc. · All transactions are secured.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-chalk transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-chalk transition-colors">Privacy</Link>
            <Link href="/help" className="hover:text-chalk transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

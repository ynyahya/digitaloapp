import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Lock } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-soft">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Logo subtitle="Checkout" />
          
          <div className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-ink-muted">
            <div className="flex items-center gap-2 text-ink">
               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-paper">1</span>
               Details
            </div>
            <div className="flex items-center gap-2 opacity-40">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px]">2</span>
               Payment
            </div>
            <div className="flex items-center gap-2 opacity-40">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px]">3</span>
               Success
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600">
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Secure Session</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-10 bg-paper">
        <div className="mx-auto max-w-[1200px] px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-ink-subtle font-medium">
          <p>© {new Date().getFullYear()} TESKEL, Inc. · All transactions are secured.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link href="/help" className="hover:text-ink transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

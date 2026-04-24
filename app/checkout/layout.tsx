import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Lock } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-soft">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Logo subtitle="Checkout" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <Lock className="h-3.5 w-3.5" />
            Secure session
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-6 text-center text-[11.5px] text-ink-subtle">
        © {new Date().getFullYear()} Digitalo, Inc. · All transactions are secured.
      </footer>
    </div>
  );
}

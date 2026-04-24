import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Logo />
          <Link href="/" className="text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink">
            Back to home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-16 md:px-8">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="border-t border-line py-6 text-center text-[11.5px] text-ink-subtle">
        © {new Date().getFullYear()} Digitalo, Inc.
      </footer>
    </div>
  );
}

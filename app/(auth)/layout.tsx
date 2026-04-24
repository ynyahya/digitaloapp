import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-20 items-center px-6 lg:px-10">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="p-10 text-center">
        <p className="text-[13px] text-ink-subtle">
          &copy; {new Date().getFullYear()} Digitalo. Built for creators.
        </p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = { title: "Check your inbox · Digitalo" };

export default function VerifyRequestPage() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper-soft">
        <Mail className="h-6 w-6 text-ink" />
      </span>
      <h1 className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">
        Check your inbox
      </h1>
      <p className="max-w-sm text-pretty text-[14px] leading-relaxed text-ink-muted">
        A magic sign-in link is on its way. The link expires in 10 minutes — click it on the
        device you&apos;d like to sign in with.
      </p>
      <Link
        href="/login"
        className="text-[12.5px] font-medium text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        Try a different email
      </Link>
    </div>
  );
}

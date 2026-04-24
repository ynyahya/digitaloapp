import Link from "next/link";
import { Mail } from "lucide-react";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sign in · Digitalo" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl = searchParams.callbackUrl ?? "/";

  async function signInWithEmail(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: callbackUrl,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Sign in to Digitalo
        </h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          We&apos;ll email you a magic link. No passwords required.
        </p>
      </div>

      {searchParams.error && (
        <div className="rounded-xl border border-ink/20 bg-paper-soft p-3 text-center text-[12.5px] text-ink-muted">
          Something went wrong. Please try again.
        </div>
      )}

      <form action={signInWithEmail} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@work.com"
            className="h-11 rounded-xl border border-line bg-paper px-4 text-[14px] text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </label>
        <Button size="lg" type="submit" className="w-full justify-center">
          <Mail className="h-4 w-4" />
          Send magic link
        </Button>
      </form>

      <p className="text-center text-[12px] text-ink-muted">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4 hover:text-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

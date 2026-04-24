import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your Digitalo account.",
};

type SearchParams = { redirectTo?: string; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { redirectTo, error } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="text-[14px] text-ink-muted">
          Sign in to keep building, shipping, and selling.
        </p>
      </div>

      <LoginForm redirectTo={redirectTo} initialError={error} />

      <p className="text-center text-[14px] text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-ink hover:underline">
          Create one
        </Link>
      </p>

      <div className="rounded-xl border border-line bg-paper-muted/40 p-4 text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
          Demo account
        </p>
        <p className="mt-1 text-[13px] text-ink-muted">
          <span className="font-mono text-ink">alex@digitalo.app</span>
          {" / "}
          <span className="font-mono text-ink">digitalo123</span>
        </p>
      </div>
    </div>
  );
}

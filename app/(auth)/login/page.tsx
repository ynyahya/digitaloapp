import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your TESKEL account.",
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
        <p className="text-eyebrow uppercase text-lime">Welcome back</p>
        <h1 className="text-[34px] font-black tracking-[-0.04em] text-chalk">
          Welcome back
        </h1>
        <p className="text-[14px] text-chalk-muted">
          Sign in to keep building, shipping, and selling.
        </p>
      </div>

      <LoginForm redirectTo={redirectTo} initialError={error} />

      <p className="text-center text-[14px] text-chalk-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-lime hover:text-lime-bright">
          Create one
        </Link>
      </p>

    </div>
  );
}

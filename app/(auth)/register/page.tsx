import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account",
  description: "Create your Digitalo account.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">
          Join Digitalo
        </h1>
        <p className="text-[14px] text-ink-muted">
          Start as a buyer or creator — you can switch later.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-[14px] text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

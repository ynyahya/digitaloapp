import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account",
  description: "Create your TESKEL account.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-eyebrow uppercase text-lime">Start free</p>
        <h1 className="text-[34px] font-black tracking-[-0.04em] text-chalk">
          Join TESKEL
        </h1>
        <p className="text-[14px] text-chalk-muted">
          Start as a buyer or creator - you can switch later.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-[14px] text-chalk-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-lime hover:text-lime-bright">
          Sign in
        </Link>
      </p>
    </div>
  );
}

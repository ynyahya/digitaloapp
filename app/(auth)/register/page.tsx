import Link from "next/link";
import { ArrowRight, ShoppingCart, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
  title: "Register",
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
          Start your journey as a buyer or creator
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="group relative flex cursor-pointer flex-col rounded-2xl border border-line bg-paper p-4 transition-all hover:border-ink/20 hover:shadow-soft">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted transition-colors group-hover:bg-ink group-hover:text-paper">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <p className="mt-3 text-[14px] font-semibold">I&apos;m a Buyer</p>
          <p className="text-[12px] text-ink-muted">I want to discover and buy products</p>
          <input type="radio" name="role" className="absolute inset-0 opacity-0 cursor-pointer" defaultChecked />
          <div className="absolute top-4 right-4 h-4 w-4 rounded-full border border-line group-hover:border-ink group-hover:bg-ink after:content-[''] after:hidden after:group-has-[:checked]:block after:h-2 after:w-2 after:bg-paper after:rounded-full after:m-auto after:absolute after:inset-0" />
        </div>
        <div className="group relative flex cursor-pointer flex-col rounded-2xl border border-line bg-paper p-4 transition-all hover:border-ink/20 hover:shadow-soft">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-muted transition-colors group-hover:bg-ink group-hover:text-paper">
            <Rocket className="h-5 w-5" />
          </div>
          <p className="mt-3 text-[14px] font-semibold">I&apos;m a Creator</p>
          <p className="text-[12px] text-ink-muted">I want to build and sell products</p>
          <input type="radio" name="role" className="absolute inset-0 opacity-0 cursor-pointer" />
          <div className="absolute top-4 right-4 h-4 w-4 rounded-full border border-line group-hover:border-ink after:content-[''] after:hidden after:group-has-[:checked]:block after:h-2 after:w-2 after:bg-paper after:rounded-full after:m-auto after:absolute after:inset-0" />
        </div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="Alex" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Morgan" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>

        <Button className="w-full h-11 rounded-xl shadow-float mt-2">
          Create Account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-[14px] text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

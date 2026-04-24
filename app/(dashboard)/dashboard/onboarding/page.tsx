import { redirect } from "next/navigation";
import { Rocket } from "lucide-react";
import { OnboardingForm } from "@/components/dashboard/onboarding-form";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata = {
  title: "Create your creator profile",
};

export default async function OnboardingPage() {
  const user = await requireUser();
  const existing = await db.creator.findUnique({
    where: { userId: user.id },
  });
  if (existing) redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center pt-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-paper">
        <Rocket className="h-5 w-5 text-ink" />
      </span>
      <h1 className="mt-6 text-balance text-center text-[28px] font-semibold tracking-tight text-ink">
        Set up your creator profile
      </h1>
      <p className="mt-2 max-w-md text-center text-[14px] text-ink-muted">
        A handle and display name is all we need to publish your storefront.
        Everything else can be edited from settings later.
      </p>

      <div className="mt-8 w-full rounded-2xl border border-line bg-paper p-6 shadow-soft">
        <OnboardingForm
          defaultName={user.name ?? ""}
          defaultHandle={(user.name ?? user.email ?? "creator")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 20)}
        />
      </div>
    </div>
  );
}

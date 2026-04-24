import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings · Digitalo" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/settings");

  const creator = await db.creator.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { email: true, name: true, image: true } } },
  });
  if (!creator) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Settings
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Profile & account
        </h1>
      </div>

      <Section title="Account">
        <Row label="Email" value={creator.user.email} />
        <Row label="Name" value={creator.user.name ?? "—"} />
        <Row
          label="Role"
          value={session.user.role ?? "CREATOR"}
          hint="Account role determines which surfaces you can access."
        />
      </Section>

      <Section title="Storefront">
        <Row label="Display name" value={creator.displayName} />
        <Row
          label="Handle"
          value={`/c/${creator.handle}`}
          action={
            <Link
              href={`/c/${creator.handle}`}
              className="inline-flex items-center gap-1 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              View <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <Row
          label="Verified"
          value={creator.verified ? "Yes" : "No"}
          hint="Verified creators are eligible for editorial placement."
        />
      </Section>

      <Section title="Danger zone">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
        <p className="mt-3 text-[11.5px] text-ink-subtle">
          Full profile editing, avatar upload, and Stripe Connect onboarding land in
          Sprint 3.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
        {title}
      </p>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-paper-soft px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
          {label}
        </p>
        <p className="mt-1 truncate text-[13.5px] font-medium text-ink">{value}</p>
        {hint && <p className="mt-1 text-[11.5px] text-ink-subtle">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

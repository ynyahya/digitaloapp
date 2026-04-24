import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, KeyRound } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  NewApiKeyForm,
  RevokeKeyButton,
} from "@/components/developer/api-key-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "API keys · Digitalo" };

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toISOString().slice(0, 10);
}

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/api-keys");

  const keys = await db.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: [{ revokedAt: "asc" }, { createdAt: "desc" }],
  });
  const active = keys.filter((k) => !k.revokedAt);
  const revoked = keys.filter((k) => k.revokedAt);

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <KeyRound className="h-3.5 w-3.5" />
          Developer · API keys
        </div>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Hand the Digitalo API a pair of hands
        </h1>
        <p className="max-w-2xl text-[13.5px] text-ink-muted">
          Every key is a long-lived bearer token. We only store the SHA-256 hash
          — Digitalo can never print your key back to you. Scope keys to{" "}
          <span className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            read
          </span>{" "}
          where possible; write keys can mutate your catalog and orders.
        </p>
        <p className="text-[12.5px] text-ink-muted">
          See the full reference at{" "}
          <Link href="/developers" className="inline-flex items-center gap-0.5 text-ink hover:underline">
            /developers
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          .
        </p>
      </div>

      <NewApiKeyForm />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Active keys
          </p>
          <span className="text-[12px] text-ink-muted">
            {active.length} key{active.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <tr>
                <Th>Name</Th>
                <Th>Prefix</Th>
                <Th>Scopes</Th>
                <Th>Last used</Th>
                <Th>Created</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {active.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-ink-muted">
                    No active keys. Issue your first one above.
                  </td>
                </tr>
              )}
              {active.map((k) => (
                <tr key={k.id} className="hover:bg-paper-soft">
                  <Td className="font-medium">{k.name}</Td>
                  <Td>
                    <code className="rounded-md border border-line bg-paper-soft px-2 py-0.5 text-[11.5px] text-ink">
                      {k.prefix}…
                    </code>
                  </Td>
                  <Td className="text-ink-muted">{k.scopes}</Td>
                  <Td className="text-ink-muted">{fmtDate(k.lastUsed)}</Td>
                  <Td className="text-ink-muted">{fmtDate(k.createdAt)}</Td>
                  <Td>
                    <RevokeKeyButton id={k.id} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {revoked.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            Revoked
          </p>
          <ul className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-paper">
            {revoked.map((k) => (
              <li
                key={k.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-[13px] text-ink-muted"
              >
                <div className="flex items-center gap-3">
                  <span className="text-ink">{k.name}</span>
                  <code className="rounded-md border border-line bg-paper-soft px-2 py-0.5 text-[11.5px]">
                    {k.prefix}…
                  </code>
                </div>
                <span className="text-[11.5px]">Revoked {fmtDate(k.revokedAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={"px-4 py-2.5 text-[11px] font-semibold " + className}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={"px-4 py-3 text-ink " + className}>{children}</td>;
}

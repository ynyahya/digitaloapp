import { db } from "@/lib/db";
import { formatRelativeTime } from "@/lib/utils";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { requireAdminSession } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users · Digitalo Admin" };

const ROLES = ["ALL", "BUYER", "CREATOR", "ADMIN"] as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { role?: string };
}) {
  const me = await requireAdminSession();
  const active = (searchParams?.role ?? "ALL").toUpperCase();
  const filter = ROLES.includes(active as (typeof ROLES)[number]) ? active : "ALL";

  const users = await db.user.findMany({
    where: filter !== "ALL" ? { role: filter } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      _count: { select: { orders: true } },
      creator: { select: { handle: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Users
        </p>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[36px]">
          Everyone with a Digitalo account
        </h1>
        <p className="text-[13.5px] text-ink-muted">
          Role promotes / demotes take effect immediately. You can&apos;t demote
          your own admin role — have another admin do it.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ROLES.map((r) => (
          <a
            key={r}
            href={r === "ALL" ? "/admin/users" : `/admin/users?role=${r}`}
            className={`inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium transition-colors ${
              filter === r
                ? "bg-ink text-paper"
                : "border border-line bg-paper text-ink-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            {r[0] + r.slice(1).toLowerCase()}
          </a>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Creator</th>
              <th className="px-4 py-3 text-right font-semibold">Orders</th>
              <th className="px-4 py-3 text-right font-semibold">Joined</th>
              <th className="px-4 py-3 text-right font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-[13px] text-ink-muted"
                >
                  No users match this filter.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {u.name ?? u.email.split("@")[0]}
                  </p>
                  <p className="text-[11.5px] text-ink-subtle">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {u.creator?.handle ? `@${u.creator.handle}` : "—"}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {u._count.orders}
                </td>
                <td className="px-4 py-3 text-right text-ink-muted">
                  {formatRelativeTime(u.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <UserRoleSelect
                    userId={u.id}
                    role={u.role as "BUYER" | "CREATOR" | "ADMIN"}
                    self={u.id === me.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

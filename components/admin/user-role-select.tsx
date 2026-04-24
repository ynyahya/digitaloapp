"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/lib/actions/admin";

type Role = "BUYER" | "CREATOR" | "ADMIN";

export function UserRoleSelect({
  userId,
  role,
  self,
}: {
  userId: string;
  role: Role;
  self: boolean;
}) {
  const [value, setValue] = useState<Role>(role);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        className="h-7 rounded-md border border-line bg-paper px-2 text-[12px] font-medium text-ink disabled:opacity-50"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Role;
          const prev = value;
          setValue(next);
          setError(null);
          start(async () => {
            const res = await setUserRole(userId, next);
            if (!res.ok) {
              setError(res.error);
              setValue(prev);
              return;
            }
            router.refresh();
          });
        }}
      >
        <option value="BUYER">Buyer</option>
        <option value="CREATOR">Creator</option>
        <option value="ADMIN">Admin</option>
      </select>
      {self && (
        <p className="text-[10px] text-ink-subtle">That&apos;s you</p>
      )}
      {error && <p className="text-[10px] text-ink">{error}</p>}
    </div>
  );
}

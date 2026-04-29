import { Award, Plus, Search, Filter, MoreHorizontal, Pencil, Users, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getMemberships, getMembershipStats } from "@/lib/queries/dashboard";

export const metadata = {
  title: "Memberships",
  description: "Manage subscription-based access and exclusive communities.",
};

export default async function MembershipsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const [memberships, stats] = await Promise.all([
    getMemberships(creator.id),
    getMembershipStats(creator.id),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Memberships</h1>
          <p className="text-[14px] text-ink-muted">Build recurring revenue with subscription tiers and exclusive content.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6" asChild>
          <Link href="/dashboard/memberships/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border-line shadow-soft">
          <CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
              <Crown className="h-5 w-5 text-violet-600" />
            </div>
            <p className="text-[24px] font-bold tracking-tight text-ink">{stats.totalTiers}</p>
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-subtle">Active Tiers</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-line shadow-soft">
          <CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-[24px] font-bold tracking-tight text-ink">{stats.totalMembers}</p>
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-subtle">Active Members</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-line shadow-soft">
          <CardContent className="p-6">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-[24px] font-bold tracking-tight text-ink">{stats.mrr}</p>
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-ink-subtle">MRR (Monthly Recurring)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
        <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-72 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle group-focus-within:text-ink transition-colors" />
                <Input className="h-9 pl-9 rounded-lg border-line text-[13px]" placeholder="Search tiers..." />
              </div>
              <Button variant="outline" size="sm" className="h-9 rounded-lg gap-2 text-[12px] border-line">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </Button>
            </div>
            <p className="text-[12px] font-medium text-ink-subtle">{memberships.length} tiers total</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper-muted/20">
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Tier</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle text-center">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Billing</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Members</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Price</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {memberships.map((m) => (
                <tr key={m.id} className="group hover:bg-paper-soft transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors overflow-hidden">
                        <span className="text-[10px] font-bold">{m.title.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-ink">{m.title}</p>
                        <p className="text-[11px] text-ink-muted">{m.billingCycle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="soft" className={cn(
                      "rounded-full text-[10px] uppercase font-bold px-2 py-0.5",
                      m.status === "PUBLISHED" && "bg-emerald-50 text-emerald-700",
                      m.status === "DRAFT" && "bg-paper-muted text-ink-muted",
                      m.status === "ARCHIVED" && "bg-red-50 text-red-700",
                    )}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">{m.billingCycle}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">{m.members}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-ink">{m.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                        <Link href={`/dashboard/memberships/edit/${m.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {memberships.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted text-[13px]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-paper-muted border border-line flex items-center justify-center">
                        <Award className="h-8 w-8 text-ink-subtle" />
                      </div>
                      <p className="font-medium">No membership tiers yet</p>
                      <p className="text-[12px] max-w-sm">Create a sustainable income stream with exclusive content, community access, and member-only perks.</p>
                      <Button className="rounded-xl h-10 px-6 mt-2" asChild>
                        <Link href="/dashboard/memberships/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Tier
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

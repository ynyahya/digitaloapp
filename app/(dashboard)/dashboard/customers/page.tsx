import { ArrowRight, Crown, Mail, Search, ShoppingBag, Sparkles, UserPlus, Users, WalletCards } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { getCustomers } from "@/lib/queries/dashboard";
import { CommandHero, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Customers — TESKEL CRM", description: "View and manage your audience and buyers." };

export default async function CustomersPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const customers = await getCustomers(creator.id);
  const totalSpend = customers.reduce((sum, customer) => sum + customer.totalSpentCents, 0);
  const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);
  const repeatCustomers = customers.filter((customer) => customer.totalOrders > 1).length;
  const averageSpend = customers.length ? totalSpend / customers.length : 0;
  const topCustomers = [...customers].sort((a, b) => b.totalSpentCents - a.totalSpentCents).slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="CustomerOS CRM"
        title="Ubah daftar buyer menjadi customer intelligence untuk retention, upsell, dan support."
        description="Lihat pelanggan berdasarkan order, spend, recency, dan relationship potential. Fokus bukan hanya siapa membeli, tapi siapa yang perlu dirawat berikutnya."
        icon={Users}
        accent="from-blue-400/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Customer lifecycle"
          items={[
            { label: "Acquire", description: "New customers from checkout", done: customers.length > 0 },
            { label: "Understand", description: "Segment by spend and order behavior", done: totalOrders > 0 },
            { label: "Support", description: "Keep contact context visible", done: customers.some((customer) => Boolean(customer.email)) },
            { label: "Retain", description: "Identify repeat buyers and champions", done: repeatCustomers > 0 },
            { label: "Upsell", description: "Use high-value customers for next offers", done: topCustomers.length > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={Users} label="Customers" value={customers.length} helper="Buyers with at least one order" tone="blue" />
        <MetricTile icon={ShoppingBag} label="Orders" value={totalOrders} helper="Total order relationships" tone="emerald" />
        <MetricTile icon={WalletCards} label="Avg spend" value={`$${(averageSpend / 100).toLocaleString()}`} helper="Average customer value" tone="amber" />
        <MetricTile icon={Crown} label="Repeat buyers" value={repeatCustomers} helper="Customers with 2+ orders" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-dim" />
                <Input className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search customers..." />
              </div>
              <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.08] text-[12px]"><UserPlus className="mr-2 h-3.5 w-3.5" />Add customer</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/[0.08]">
              {customers.map((customer) => (
                <div key={customer.id} className="grid gap-4 px-6 py-5 transition-colors hover:bg-white/[0.035] lg:grid-cols-[1.4fr_110px_130px_130px_90px] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] text-[12px] font-bold text-chalk">
                      {customer.avatar ? <Image src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" width={44} height={44} /> : customer.name.charAt(0)}
                    </div>
                    <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-chalk">{customer.name}</p><p className="truncate text-[11px] text-chalk-muted">{customer.email}</p></div>
                  </div>
                  <div><StatusBadge status={customer.status} /></div>
                  <div><p className="text-[13px] font-bold text-chalk">{customer.totalOrders} orders</p><p className="text-[11px] text-chalk-muted">Purchase count</p></div>
                  <div><p className="text-[13px] font-bold text-chalk">{customer.totalSpent}</p><p className="text-[11px] text-chalk-muted">Total spend</p></div>
                  <div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl"><Mail className="h-4 w-4" /></Button><ArrowRight className="h-4 w-4 text-chalk-dim" /></div>
                </div>
              ))}
              {customers.length === 0 ? <div className="px-6 py-16 text-center text-[13px] text-chalk-muted">No customers yet. Customer profiles appear after the first purchase.</div> : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Top customer value</p>
              <div className="mt-4 space-y-3">
                {topCustomers.length ? topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <div><p className="text-[13px] font-bold text-chalk">#{index + 1} {customer.name}</p><p className="mt-1 text-[11px] text-chalk-muted">{customer.totalOrders} orders · {customer.lastOrder}</p></div>
                    <p className="text-[13px] font-bold text-chalk">{customer.totalSpent}</p>
                  </div>
                )) : <p className="text-[13px] leading-5 text-chalk-muted">No buyers yet. Your high-value customer list will appear here.</p>}
              </div>
            </CardContent>
          </Card>
          <PlaybookCard icon={Sparkles} title="Customer growth playbook" description="Gunakan data buyer untuk membuat next offer yang lebih tepat." steps={["Find repeat customers first", "Segment high spend buyers", "Send support before upsell", "Build bundles from buying patterns"]} />
        </div>
      </div>
    </div>
  );
}

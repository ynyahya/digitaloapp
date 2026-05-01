import { AlertCircle, ArrowRight, CheckCircle2, Clock, Download, RotateCcw, Search, ShieldCheck, ShoppingCart, TrendingUp, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { requireCreator } from "@/lib/auth/session";
import { getOrders } from "@/lib/queries/dashboard";
import { refundOrderAction, completeOrderAction } from "@/lib/actions/commerce";
import { cn } from "@/lib/utils";
import { CommandHero, MetricTile, PlaybookCard, StatusBadge, WorkflowRail } from "../_components/command-center";

export const metadata = { title: "Orders — TESKEL Ops", description: "Monitor and manage store transactions." };

type SearchParams = { q?: string; status?: string };

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  let orders = await getOrders(creator.id);
  const allOrders = orders;

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    orders = orders.filter((order) => order.customer.toLowerCase().includes(q) || order.product.toLowerCase().includes(q) || order.displayId.toLowerCase().includes(q));
  }
  if (searchParams.status) orders = orders.filter((order) => order.status === searchParams.status);

  const paid = allOrders.filter((order) => order.status === "PAID").length;
  const completed = allOrders.filter((order) => order.status === "COMPLETED").length;
  const pending = allOrders.filter((order) => order.status === "PENDING").length;
  const refunded = allOrders.filter((order) => order.status === "REFUNDED").length;
  const revenue = allOrders.filter((order) => order.status === "PAID" || order.status === "COMPLETED").reduce((sum, order) => sum + order.amountCents, 0);
  const needsAction = paid + pending;

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="Commerce Ops Center"
        title="Kelola order seperti fulfillment desk profesional: paid, pending, complete, refund, dan revenue signal."
        description="Orders sekarang ditata sebagai operating cockpit, bukan tabel pasif. Fokuskan perhatian ke transaksi yang butuh follow-up dan menjaga buyer experience."
        icon={ShoppingCart}
        accent="from-emerald-400/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Order ops workflow"
          items={[
            { label: "Capture", description: "Paid orders masuk dari checkout", done: allOrders.length > 0 },
            { label: "Review", description: "Periksa paid/pending sebelum delivery", done: needsAction > 0 },
            { label: "Fulfill", description: "Mark paid order as complete", done: completed > 0 },
            { label: "Support", description: "Handle refund or issue resolution", done: refunded > 0 },
            { label: "Analyze", description: "Use order data for offer decisions", done: revenue > 0 },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={TrendingUp} label="Net paid revenue" value={`$${(revenue / 100).toLocaleString()}`} helper="Paid and completed orders" tone="emerald" />
        <MetricTile icon={Clock} label="Needs attention" value={needsAction} helper={`${paid} paid · ${pending} pending`} tone="amber" />
        <MetricTile icon={CheckCircle2} label="Completed" value={completed} helper="Fulfillment marked complete" tone="blue" />
        <MetricTile icon={RotateCcw} label="Refunded" value={refunded} helper="Support / reversal queue" tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
          <CardHeader className="border-b border-white/[0.08] bg-white/[0.035] px-6 py-4">
            <form className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chalk-dim" />
                  <Input name="q" defaultValue={searchParams.q} className="h-10 rounded-xl border-white/[0.08] pl-9 text-[13px]" placeholder="Search order, buyer, product..." />
                </div>
                <select name="status" defaultValue={searchParams.status || ""} className="h-10 rounded-xl border border-white/[0.08] bg-night/70 px-3 text-[12px] font-medium text-chalk">
                  <option value="">All status</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <Button type="submit" variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.08] text-[12px]">Filter</Button>
              </div>
              <Button type="button" variant="outline" size="sm" className="h-10 rounded-xl border-white/[0.08] text-[12px]"><Download className="mr-2 h-3.5 w-3.5" />Export</Button>
            </form>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/[0.08]">
              {orders.map((order) => <OrderRow key={order.id} order={order} />)}
              {orders.length === 0 ? <div className="px-6 py-16 text-center text-[13px] text-chalk-muted">No orders found for this filter.</div> : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
            <CardContent className="p-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-chalk-dim">Ops priority</p>
              <div className="mt-4 space-y-3">
                <PriorityItem icon={Clock} label="Paid orders to complete" value={paid} tone="text-amber-300" />
                <PriorityItem icon={AlertCircle} label="Pending payment review" value={pending} tone="text-rose-300" />
                <PriorityItem icon={ShieldCheck} label="Completed and safe" value={completed} tone="text-lime" />
              </div>
            </CardContent>
          </Card>
          <PlaybookCard icon={Truck} title="Fulfillment standard" description="Jaga buyer trust setelah pembayaran." steps={["Complete paid orders quickly", "Refund only after checking ownership", "Use status filters daily", "Review products with frequent support issues"]} />
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Awaited<ReturnType<typeof getOrders>>[number] }) {
  return (
    <div className="grid gap-4 px-6 py-5 transition-colors hover:bg-white/[0.035] lg:grid-cols-[130px_1.2fr_1.4fr_110px_130px_110px] lg:items-center">
      <div><p className="font-mono text-[12px] font-bold text-chalk">#{order.displayId}</p><p className="mt-1 text-[11px] text-chalk-muted">{order.date}</p></div>
      <div><p className="text-[13px] font-bold text-chalk">{order.customer}</p><p className="mt-1 text-[11px] text-chalk-muted">{order.country || "Unknown country"}</p></div>
      <div><p className="line-clamp-1 text-[13px] font-medium text-chalk">{order.product}</p><p className="mt-1 text-[11px] text-chalk-muted">{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</p></div>
      <div><StatusBadge status={order.status} /></div>
      <div className="text-[14px] font-bold text-chalk lg:text-right">{order.amount}</div>
      <div className="flex items-center gap-1 lg:justify-end">
        {order.status === "PAID" ? (
          <form action={completeOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" type="submit" title="Mark complete"><CheckCircle2 className="h-4 w-4 text-lime" /></Button>
          </form>
        ) : null}
        {order.status === "PAID" || order.status === "COMPLETED" ? (
          <form action={refundOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" type="submit" title="Refund"><RotateCcw className="h-4 w-4 text-rose-300" /></Button>
          </form>
        ) : null}
        <ArrowRight className="h-4 w-4 text-chalk-dim" />
      </div>
    </div>
  );
}

function PriorityItem({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
      <div className="flex items-center gap-3"><Icon className={cn("h-4 w-4", tone)} /><span className="text-[13px] font-medium text-chalk">{label}</span></div>
      <span className="text-[18px] font-bold text-chalk">{value}</span>
    </div>
  );
}

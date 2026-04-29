import { Search, Download, MoreHorizontal, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getOrders } from "@/lib/queries/dashboard";
import { refundOrderAction, completeOrderAction } from "@/lib/actions/commerce";

export default async function OrdersPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  let orders = await getOrders(creator.id);

  // Server-side filter
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    orders = orders.filter(o => o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }
  if (searchParams.status) {
    orders = orders.filter(o => o.status === searchParams.status);
  }

  const completed = orders.filter(o => o.status === "PAID" || o.status === "COMPLETED").length;
  const pending = orders.filter(o => o.status === "PENDING").length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Orders</h1>
          <p className="text-[14px] text-ink-muted">Monitor and manage your store transactions.</p>
        </div>
      </div>

      <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
        <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
          <form className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-72 group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <Input name="q" defaultValue={searchParams.q} className="h-9 pl-9 rounded-lg border-line text-[13px]" placeholder="Search orders..." />
              </div>
              <select name="status" defaultValue={searchParams.status || ""} className="h-9 rounded-lg border border-line bg-paper text-[12px] px-2">
                <option value="">All Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <Button type="submit" variant="outline" size="sm" className="h-9 rounded-lg text-[12px]">Filter</Button>
            </div>
            <div className="flex items-center gap-4 text-[12px] font-medium text-ink-subtle">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {completed} Completed</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-amber-500" /> {pending} Pending</span>
            </div>
          </form>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper-muted/20">
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Order</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Customer</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Product</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle text-center">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle text-right">Amount</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="group hover:bg-paper-soft transition-colors">
                  <td className="px-6 py-4"><span className="text-[13px] font-mono font-medium text-ink-muted">{o.id}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-paper-muted border border-line flex items-center justify-center text-[10px] font-bold">{o.customer.charAt(0)}</div>
                      <span className="text-[13.5px] font-medium text-ink">{o.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-ink">{o.product}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge className={cn("rounded-full text-[10px] font-bold px-2 py-0.5", o.status === "PAID" || o.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : o.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-ink text-right">{o.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {o.status === "PAID" && (
                        <form action={completeOrderAction}>
                          <input type="hidden" name="orderId" value={o.id} />
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" type="submit" title="Mark Complete"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /></Button>
                        </form>
                      )}
                      {(o.status === "PAID" || o.status === "COMPLETED") && (
                        <form action={refundOrderAction}>
                          <input type="hidden" name="orderId" value={o.id} />
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" type="submit" title="Refund"><RotateCcw className="h-3.5 w-3.5 text-rose-500" /></Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-ink-muted text-[13px]">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

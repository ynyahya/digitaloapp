import { Search, Filter, MoreHorizontal, Mail, ExternalLink, ArrowUpDown, UserPlus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getCustomers } from "@/lib/queries/dashboard";

export default async function CustomersPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const customers = await getCustomers(creator.id);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Customers</h1>
          <p className="text-[14px] text-ink-muted">View and manage your audience and buyers.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
        <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="relative w-72 group">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle group-focus-within:text-ink transition-colors" />
                 <Input className="h-9 pl-9 rounded-lg border-line text-[13px]" placeholder="Search customers..." />
               </div>
               <Button variant="outline" size="sm" className="h-9 rounded-lg gap-2 text-[12px] border-line">
                 <Filter className="h-3.5 w-3.5" />
                 Filters
               </Button>
             </div>
             <p className="text-[12px] font-medium text-ink-subtle">{customers.length} active customers</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper-muted/20">
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Customer</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle text-center">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Orders</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Total Spend</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Last Active</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c) => (
                <tr key={c.id} className="group hover:bg-paper-soft transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-xl bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors shadow-soft overflow-hidden">
                         {c.avatar ? <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" /> : <span className="text-[11px] font-bold">{c.name.charAt(0)}</span>}
                       </div>
                       <div>
                         <p className="text-[13.5px] font-semibold text-ink">{c.name}</p>
                         <p className="text-[11px] text-ink-muted">{c.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="soft" className={cn(
                      "rounded-full text-[10px] uppercase font-bold px-2 py-0.5",
                      c.status === "ACTIVE" && "bg-emerald-50 text-emerald-700",
                      c.status === "INACTIVE" && "bg-paper-muted text-ink-muted",
                    )}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">{c.totalOrders} items</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-ink">{c.totalSpent}</td>
                  <td className="px-6 py-4 text-[12px] text-ink-muted">{c.lastOrder}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted text-[13px] italic">
                    No customers found.
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

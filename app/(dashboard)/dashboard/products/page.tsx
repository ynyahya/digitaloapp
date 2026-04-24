import { Plus, Search, Filter, MoreHorizontal, ExternalLink, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireCreator } from "@/lib/auth/session";
import { getProducts } from "@/lib/queries/dashboard";

export default async function ProductsPage() {
  const creator = await requireCreator();
  if (!creator) return <div>No creator found.</div>;

  const products = await getProducts(creator.id);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Products</h1>
          <p className="text-[14px] text-ink-muted">Manage your digital assets and sales channels.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6" asChild>
          <Link href="/dashboard/studio">
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-line shadow-soft overflow-hidden">
        <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="relative w-72 group">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle group-focus-within:text-ink transition-colors" />
                 <Input className="h-9 pl-9 rounded-lg border-line text-[13px]" placeholder="Search products..." />
               </div>
               <Button variant="outline" size="sm" className="h-9 rounded-lg gap-2 text-[12px] border-line">
                 <Filter className="h-3.5 w-3.5" />
                 Filters
               </Button>
             </div>
             <p className="text-[12px] font-medium text-ink-subtle">{products.length} products total</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-paper-muted/20">
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Product</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle text-center">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-ink transition-colors">
                    Sales <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Price</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle">Category</th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-subtle"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-paper-soft transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors overflow-hidden">
                        <span className="text-[10px] font-bold">{p.title.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-ink">{p.title}</p>
                        <p className="text-[11px] text-ink-muted truncate max-w-[200px]">digitalo.app/p/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="soft" className={cn(
                      "rounded-full text-[10px] uppercase font-bold px-2 py-0.5",
                      p.status === "PUBLISHED" && "bg-emerald-50 text-emerald-700",
                      p.status === "DRAFT" && "bg-paper-muted text-ink-muted",
                      p.status === "ARCHIVED" && "bg-red-50 text-red-700",
                    )}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink">{p.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-ink">{p.price}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-ink-muted">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                        <Link href={`/p/${p.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted text-[13px] italic">
                    No products found.
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

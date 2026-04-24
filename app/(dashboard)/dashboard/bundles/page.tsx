import { Plus, Layers, Search, MoreHorizontal, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BUNDLES = [
  { id: "1", name: "SaaS Ultimate Stack", products: 4, price: "$99", value: "$166", sales: 124, status: "ACTIVE" },
  { id: "2", name: "Creator Design Kit", products: 2, price: "$49", value: "$78", sales: 56, status: "DRAFT" },
];

export default function BundlesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Bundles</h1>
          <p className="text-[14px] text-ink-muted">Combine products to increase your average order value.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper">
          <Plus className="mr-2 h-4 w-4" />
          Create Bundle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BUNDLES.map((bundle) => (
          <Card key={bundle.id} className="group relative rounded-3xl border-line bg-paper shadow-soft transition-all hover:shadow-card overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors shadow-soft">
                  <Layers className="h-6 w-6" />
                </div>
                <Badge variant="soft" className={cn(
                  "rounded-full text-[10px] font-bold tracking-wider",
                  bundle.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-paper-muted text-ink-muted"
                )}>
                  {bundle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-[18px] font-bold text-ink">{bundle.name}</h3>
                <p className="text-[13px] text-ink-muted">{bundle.products} products included</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-paper-soft border border-line">
                <div>
                   <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">Bundle Price</p>
                   <p className="text-[20px] font-bold text-ink">{bundle.price} <span className="text-[13px] font-medium text-ink-muted line-through ml-1">{bundle.value}</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">Total Sales</p>
                   <p className="text-[18px] font-semibold text-ink">{bundle.sales}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <Button className="flex-1 h-10 rounded-xl bg-ink text-paper text-[12.5px] font-bold group">
                   Edit Bundle
                   <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                   <MoreHorizontal className="h-4 w-4" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <button className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-line bg-paper-soft/50 p-8 transition-all hover:bg-paper-muted hover:border-ink/20 group min-h-[300px]">
           <div className="h-14 w-14 rounded-full bg-paper border border-line flex items-center justify-center text-ink-subtle group-hover:bg-ink group-hover:text-paper transition-all">
             <Plus className="h-6 w-6" />
           </div>
           <div className="text-center">
             <p className="text-[15px] font-bold text-ink">Add New Bundle</p>
             <p className="text-[12px] text-ink-muted max-w-[180px] mx-auto mt-1">Combine your top-performing products with AI suggestions.</p>
           </div>
        </button>
      </div>

      <Card className="rounded-3xl border-ink bg-ink p-8 text-paper shadow-float">
         <div className="flex items-start justify-between">
           <div className="space-y-2">
             <div className="flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-paper" />
               <h3 className="text-[18px] font-bold">Bundle Intelligence</h3>
             </div>
             <p className="text-[14px] opacity-80 max-w-[500px]">
               Our AI detected that customers who buy <strong>SaaS Starter Kit</strong> also frequently purchase <strong>UI Kit Pro</strong>. Create a bundle now to potentially increase revenue by <strong>18.5%</strong>.
             </p>
           </div>
           <Button variant="secondary" className="h-11 px-6 rounded-xl bg-paper text-ink border-none hover:bg-paper-soft font-bold">
             Auto-generate Bundle
           </Button>
         </div>
      </Card>
    </div>
  );
}

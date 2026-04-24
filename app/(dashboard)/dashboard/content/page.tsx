import { FileText, Sparkles, Send, MessageCircle, Twitter, Globe, MoreHorizontal, Plus, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CONTENT = [
  { id: "1", title: "Launch Thread", type: "X_POST", product: "SaaS Starter Kit", status: "SCHEDULED", date: "Tomorrow, 9:00 AM" },
  { id: "2", title: "Product Description", type: "MARKETING", product: "Notion Finance", status: "DRAFT", date: "Edited 2h ago" },
  { id: "3", title: "SEO Blog Post", type: "BLOG", product: "SaaS Starter Kit", status: "PUBLISHED", date: "Published 3d ago" },
];

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">Content Studio</h1>
          <p className="text-[14px] text-ink-muted">Generate and manage marketing copy for your products.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
         <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl border-line bg-paper shadow-soft overflow-hidden">
              <CardHeader className="border-b border-line bg-paper-soft px-5 py-3">
                <CardTitle className="text-[13px] font-bold uppercase tracking-widest text-ink-subtle">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                 <div className="space-y-1">
                    <CategoryItem icon={Twitter} label="Social Media" count={4} active={true} />
                    <CategoryItem icon={FileText} label="Product Copy" count={12} />
                    <CategoryItem icon={Globe} label="Landing Pages" count={3} />
                    <CategoryItem icon={Send} label="Email Campaigns" count={8} />
                 </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-line bg-paper shadow-soft p-5 space-y-4">
               <div className="flex items-center gap-1.5 text-emerald-600">
                <Badge variant="soft" className="bg-emerald-50 text-emerald-600 rounded-full h-5 px-1.5 border-0">Live</Badge>
                <span className="text-[12px] font-medium tracking-tight">Active Campaign</span>
              </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-medium text-ink-muted">
                    <span>Credits Used</span>
                    <span>1,240 / 5,000</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-paper-muted overflow-hidden">
                    <div className="h-full w-[25%] bg-ink rounded-full" />
                  </div>
               </div>
               <Button variant="outline" className="w-full h-9 rounded-lg border-line text-[12px]">
                 Upgrade Plan
               </Button>
            </Card>
         </div>

         <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
               <div className="relative w-80 group">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle group-focus-within:text-ink transition-colors" />
                 <Input className="h-10 pl-10 rounded-xl border-line text-[13px]" placeholder="Search content..." />
               </div>
               <div className="flex items-center gap-2">
                  <Badge variant="soft" className="rounded-full bg-paper-soft text-ink-muted border-line">All</Badge>
                  <Badge variant="soft" className="rounded-full bg-ink text-paper border-ink">Drafts</Badge>
                  <Badge variant="soft" className="rounded-full bg-paper-soft text-ink-muted border-line">Scheduled</Badge>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {CONTENT.map((item) => (
                 <Card key={item.id} className="group relative rounded-2xl border-line bg-paper p-5 shadow-soft hover:shadow-card transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-paper-muted border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors">
                             {item.type === "X_POST" && <Twitter className="h-5 w-5" />}
                             {item.type === "MARKETING" && <FileText className="h-5 w-5" />}
                             {item.type === "BLOG" && <Globe className="h-5 w-5" />}
                          </div>
                          <div className="space-y-0.5">
                             <div className="flex items-center gap-2">
                               <h3 className="text-[15px] font-bold text-ink">{item.title}</h3>
                               <Badge variant="outline" className="rounded-full text-[9px] px-1.5 py-0 border-line bg-paper-soft text-ink-subtle uppercase">
                                 {item.type.replace("_", " ")}
                               </Badge>
                             </div>
                             <p className="text-[12px] text-ink-muted">Linked to <strong>{item.product}</strong> · {item.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <Badge variant="soft" className={cn(
                             "rounded-full text-[10px] font-bold uppercase",
                             item.status === "SCHEDULED" && "bg-blue-50 text-blue-700",
                             item.status === "DRAFT" && "bg-paper-muted text-ink-muted",
                             item.status === "PUBLISHED" && "bg-emerald-50 text-emerald-700",
                          )}>
                             {item.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                 </Card>
               ))}

               <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper-soft/30 p-6 transition-all hover:bg-paper-muted hover:border-ink/20 group">
                  <div className="h-8 w-8 rounded-full border border-line flex items-center justify-center text-ink-subtle group-hover:bg-ink group-hover:text-paper transition-all">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-[14px] font-bold text-ink-muted group-hover:text-ink transition-colors">Create new marketing piece</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function CategoryItem({ icon: Icon, label, count, active }: any) {
  return (
    <button className={cn(
      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
      active ? "bg-paper-muted text-ink shadow-soft" : "text-ink-muted hover:bg-paper-soft hover:text-ink"
    )}>
       <div className="flex items-center gap-3">
         <Icon className={cn("h-4 w-4", active ? "text-ink" : "text-ink-subtle")} />
         {label}
       </div>
       <span className="text-[11px] font-bold opacity-40">{count}</span>
    </button>
  );
}

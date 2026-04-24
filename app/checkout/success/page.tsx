import Link from "next/link";
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  LayoutDashboard, 
  FileText, 
  MessageSquare,
  Globe,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink flex flex-col">
      {/* Header */}
      <header className="border-b border-line bg-paper px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo noLink />
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-xl text-[13px]" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl w-full space-y-12">
          {/* Success Hero */}
          <div className="space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mx-auto shadow-soft">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-[40px] font-bold tracking-tight">Your product is ready.</h1>
              <p className="text-[16px] text-ink-muted max-w-[500px] mx-auto">
                Thank you for your purchase! We&apos;ve sent a receipt and access details to <strong>alex@example.com</strong>.
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2">
             <ActionCard 
                title="Download Files" 
                description="Get your SaaS Starter Kit (ZIP, 142MB)" 
                icon={Download} 
                primary
             />
             <ActionCard 
                title="View License" 
                description="Personal Use License (ID: #DIG-7241)" 
                icon={FileText} 
             />
             <ActionCard 
                title="Documentation" 
                description="Read the setup guide and API docs" 
                icon={Globe} 
             />
             <ActionCard 
                title="Join Community" 
                description="Connect with other builders on Discord" 
                icon={MessageSquare} 
             />
          </div>

          {/* Upsell / Next Step */}
          <Card className="rounded-3xl border-line bg-paper-soft p-8 shadow-soft">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                <div className="space-y-2">
                   <h3 className="text-[20px] font-bold">Start your first project</h3>
                   <p className="text-[14px] text-ink-muted">
                     Head to your dashboard to manage your downloads and start building your marketplace.
                   </p>
                </div>
                <Button className="h-12 px-8 rounded-2xl bg-ink text-paper font-bold shadow-float group" asChild>
                   <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                   </Link>
                </Button>
             </div>
          </Card>

          <p className="text-[13px] text-ink-muted">
            Order ID: <strong>#ORD-7241</strong> · Need help? <Link href="/support" className="font-semibold text-ink underline underline-offset-4">Contact Support</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-8 px-6 text-center text-[12px] text-ink-subtle">
        © 2026 Digitalo. Built for creators by creators.
      </footer>
    </div>
  );
}

function ActionCard({ title, description, icon: Icon, primary }: any) {
  return (
    <Card className={cn(
      "rounded-3xl border-line transition-all hover:shadow-card cursor-pointer group text-left p-6",
      primary ? "bg-ink text-paper" : "bg-paper hover:border-ink/20"
    )}>
       <div className="flex items-start gap-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
            primary ? "bg-paper text-ink" : "bg-paper-muted text-ink group-hover:bg-ink group-hover:text-paper"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
             <h3 className="text-[16px] font-bold">{title}</h3>
             <p className={cn("text-[13px]", primary ? "opacity-70" : "text-ink-muted")}>{description}</p>
          </div>
       </div>
    </Card>
  );
}

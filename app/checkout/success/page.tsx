import Link from "next/link";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId;
  let order = null;

  if (orderId) {
    order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
  }

  return (
    <div className="landing-theme grain-overlay relative min-h-screen bg-night text-chalk flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-accent-glow opacity-60" />
      <div className="pointer-events-none absolute inset-0 grid-dark opacity-25 mask-radial-fade" />
      <div className="relative z-[1] w-20 h-20 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-lime" />
      </div>
      <h1 className="relative z-[1] text-[42px] font-black tracking-[-0.04em] gradient-text-lime mb-2">Payment Successful!</h1>
      <p className="relative z-[1] text-[15px] text-chalk-muted max-w-md mb-8">
        Thank you for your purchase. You now have instant access to your products.
      </p>

      {order && (
        <div className="relative z-[1] w-full max-w-md space-y-3 mb-8">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.035]">
              <span className="text-[14px] font-medium text-chalk">{item.product.title}</span>
              <Download className="h-4 w-4 text-lime" />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-[1] flex items-center gap-3">
        <Button asChild className="rounded-xl h-11 px-6 lime-shadow">
          <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl h-11 px-6">
          <Link href="/products">Browse More</Link>
        </Button>
      </div>
    </div>
  );
}

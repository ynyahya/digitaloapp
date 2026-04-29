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
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <h1 className="text-[32px] font-extrabold text-ink mb-2">Payment Successful!</h1>
      <p className="text-[15px] text-ink-muted max-w-md mb-8">
        Thank you for your purchase. You now have instant access to your products.
      </p>

      {order && (
        <div className="w-full max-w-md space-y-3 mb-8">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-line bg-paper-soft">
              <span className="text-[14px] font-medium text-ink">{item.product.title}</span>
              <Download className="h-4 w-4 text-indigo-500" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button asChild className="rounded-xl h-11 px-6">
          <Link href="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl h-11 px-6">
          <Link href="/products">Browse More</Link>
        </Button>
      </div>
    </div>
  );
}

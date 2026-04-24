"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Star,
  ShoppingBag,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries/products";
import { db } from "@/lib/db";
import { createOrder } from "@/lib/actions/checkout";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { product: string; license?: string };
}) {
  const product = await getProductBySlug(searchParams.product);
  if (!product) notFound();

  const selectedLicense = product.licenses.find(l => l.id === searchParams.license) || product.licenses[0];
  const priceCents = selectedLicense ? selectedLicense.priceCents : product.priceCents;

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* Checkout Header */}
      <header className="border-b border-line bg-paper px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo noLink />
          </Link>
          <div className="flex items-center gap-8 text-[13px] font-medium text-ink-muted">
            <div className="flex items-center gap-2 text-ink">
               <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-paper">1</span>
               Checkout
            </div>
            <div className="flex items-center gap-2">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px]">2</span>
               Payment
            </div>
            <div className="flex items-center gap-2">
               <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px]">3</span>
               Success
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <form action={createOrder}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="licenseId" value={selectedLicense?.id || ""} />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-bold tracking-tight">Customer Information</h2>
                  <p className="text-[13px] text-ink-muted">
                    Already have an account? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link>
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="alex@example.com" required className="h-11 rounded-xl" />
                    <p className="text-[11px] text-ink-muted">Your product will be delivered to this email.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="Alex" required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Morgan" required className="h-11 rounded-xl" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-[20px] font-bold tracking-tight">Payment Method</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <PaymentOption active icon={CreditCard} label="Credit Card" />
                    <PaymentOption icon={ShoppingBag} label="PayPal" />
                  </div>
                  
                  <Card className="rounded-2xl border-ink/20 bg-paper-soft shadow-soft">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="cardNum">Card Number</Label>
                        <div className="relative">
                          <Input id="cardNum" placeholder="0000 0000 0000 0000" className="h-11 rounded-xl pl-11" />
                          <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM / YY" className="h-11 rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="cvc">CVC</Label>
                            <div className="relative">
                              <Input id="cvc" placeholder="•••" className="h-11 rounded-xl" />
                              <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                            </div>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-[20px] font-bold tracking-tight">Selected License</h2>
                <div className="grid grid-cols-1 gap-4">
                   <div className="flex flex-col gap-1 rounded-xl border border-ink bg-ink/5 ring-1 ring-ink p-4 relative">
                      <p className="text-[14px] font-bold">{selectedLicense?.name || "Standard License"}</p>
                      <p className="text-[20px] font-bold">${(priceCents / 100).toFixed(2)}</p>
                      <p className="text-[12px] text-ink-muted leading-tight">{selectedLicense?.description || "Full access to the product files."}</p>
                      <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-ink" />
                   </div>
                </div>
              </section>

              <div className="pt-4">
                <Button type="submit" className="h-14 w-full rounded-2xl bg-ink text-[16px] font-bold shadow-float">
                  Complete Secure Purchase
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="mt-6 flex items-center justify-center gap-6 text-[11px] font-medium text-ink-muted">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    SSL Encrypted
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3" />
                    Instant Delivery
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Refund Guarantee
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-6">
                <Card className="rounded-3xl border-line bg-paper-soft shadow-soft">
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-paper border border-line flex items-center justify-center text-ink shadow-soft overflow-hidden">
                          {product.coverImage ? (
                            <img src={product.coverImage} className="w-full h-full object-cover" />
                          ) : (
                            <Zap className="h-10 w-10" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[18px] font-bold">{product.title}</h3>
                            {product.bestSeller && (
                              <Badge variant="soft" className="rounded-full bg-ink text-paper text-[9px] px-1.5 py-0">BESTSELLER</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[12px] text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-current" />
                            {product.ratingAvg} <span className="text-ink-muted font-medium ml-1">({product.ratingCount.toLocaleString()} reviews)</span>
                          </div>
                          <p className="text-[13px] text-ink-muted">v1.0.0 · Digital Download</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-line">
                        <div className="flex justify-between text-[14px]">
                          <span className="text-ink-muted">Subtotal</span>
                          <span className="font-semibold">${(priceCents / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[14px]">
                          <span className="text-ink-muted">Platform Fee</span>
                          <span className="font-semibold">$0.00</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-line text-[20px] font-bold">
                          <span>Total</span>
                          <span>${(priceCents / 100).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">Promo Code</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Enter code" className="h-10 rounded-xl" />
                          <Button variant="secondary" className="h-10 rounded-xl px-4 border-line">Apply</Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Seal */}
                <div className="rounded-2xl border border-line bg-paper-soft p-4 flex items-start gap-3">
                    <Info className="h-4 w-4 text-ink-subtle mt-0.5" />
                    <p className="text-[12px] text-ink-muted leading-relaxed">
                      By completing your purchase, you agree to Digitalo&apos;s <strong>Terms of Service</strong> and <strong>Refund Policy</strong>.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}

function PaymentOption({ active, icon: Icon, label }: any) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border p-4 transition-all cursor-pointer",
      active ? "border-ink bg-ink/5 ring-1 ring-ink" : "border-line bg-paper hover:border-line-strong"
    )}>
       <Icon className={cn("h-5 w-5", active ? "text-ink" : "text-ink-subtle")} />
       <span className="text-[14px] font-semibold">{label}</span>
       {active && <CheckCircle2 className="ml-auto h-4 w-4 text-ink" />}
    </div>
  );
}

function LicenseOption({ title, price, desc, active }: any) {
  return (
    <div className={cn(
      "flex flex-col gap-1 rounded-xl border p-4 transition-all cursor-pointer relative",
      active ? "border-ink bg-ink/5 ring-1 ring-ink" : "border-line bg-paper hover:border-line-strong"
    )}>
       <p className="text-[13px] font-bold">{title}</p>
       <p className="text-[18px] font-bold">{price}</p>
       <p className="text-[11px] text-ink-muted leading-tight">{desc}</p>
       {active && <CheckCircle2 className="absolute top-3 right-3 h-3.5 w-3.5 text-ink" />}
    </div>
  );
}

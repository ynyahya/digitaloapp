"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { createOrder } from "@/lib/actions/checkout";
import Image from "next/image";

export function CheckoutContent({ 
  initialProduct 
}: { 
  initialProduct?: {
    id: string;
    slug: string;
    title: string;
    priceCents: number;
    coverImage: string | null;
    licenseId: string;
    licenseName: string;
    creatorId: string;
    ratingAvg: number;
    ratingCount: number;
    bestSeller: boolean;
  }
}) {
  const { items, subtotalCents, isMounted } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setCheckoutItems([{
        productId: initialProduct.id,
        licenseId: initialProduct.licenseId,
        slug: initialProduct.slug,
        title: initialProduct.title,
        priceCents: initialProduct.priceCents,
        coverImage: initialProduct.coverImage,
        licenseName: initialProduct.licenseName,
        creatorId: initialProduct.creatorId,
        qty: 1
      }]);
    } else if (isMounted) {
      setCheckoutItems(items);
    }
  }, [initialProduct, items, isMounted]);

  const totalCents = initialProduct ? initialProduct.priceCents : subtotalCents;

  if (!isMounted) {
    return <div className="min-h-screen bg-paper flex items-center justify-center">Loading checkout...</div>;
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center py-20 text-center px-6">
        <ShoppingBag className="h-16 w-16 text-ink-subtle mb-6" />
        <h2 className="text-[24px] font-bold mb-2">No items to checkout</h2>
        <p className="text-ink-muted mb-8">Your cart is empty and no product was selected.</p>
        <Button asChild>
          <Link href="/products">Browse Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans text-ink">
      <form action={createOrder}>
        <input type="hidden" name="items" value={JSON.stringify(checkoutItems)} />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-12">
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
                    <Input id="email" name="email" type="email" placeholder="you@email.com" required className="h-11 rounded-xl" />
                    <p className="text-[11px] text-ink-muted">Your product will be delivered to this email.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="First name" required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Last name" required className="h-11 rounded-xl" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-[20px] font-bold tracking-tight">Payment Method</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-xl border p-4 border-ink bg-ink/5 ring-1 ring-ink">
                       <CreditCard className="h-5 w-5 text-ink" />
                       <span className="text-[14px] font-semibold">Credit Card</span>
                       <CheckCircle2 className="ml-auto h-4 w-4 text-ink" />
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border p-4 border-line bg-paper opacity-50 cursor-not-allowed">
                       <ShoppingBag className="h-5 w-5 text-ink-subtle" />
                       <span className="text-[14px] font-semibold">PayPal</span>
                    </div>
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

              <div className="pt-4">
                <Button type="submit" className="h-14 w-full rounded-2xl bg-ink text-[16px] font-bold shadow-float">
                  Complete Secure Purchase — {formatCurrency(totalCents)}
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

            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-6">
                <Card className="rounded-3xl border-line bg-paper-soft shadow-soft">
                  <CardContent className="p-8 space-y-6">
                    <h3 className="text-[16px] font-bold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {checkoutItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 border-b border-line last:border-0 last:pb-0">
                          <div className="h-16 w-16 rounded-xl bg-paper border border-line flex items-center justify-center text-ink shadow-soft overflow-hidden shrink-0">
                            {item.coverImage ? (
                              <Image 
                                src={item.coverImage} 
                                className="w-full h-full object-cover" 
                                alt={item.title}
                                width={64}
                                height={64}
                              />
                            ) : (
                              <Zap className="h-8 w-8 text-ink-subtle opacity-20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-bold truncate">{item.title}</h4>
                            <p className="text-[12px] text-ink-muted">{item.licenseName} {item.qty > 1 && `x ${item.qty}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-bold">{formatCurrency(item.priceCents * item.qty)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-6 border-t border-line">
                        <div className="flex justify-between text-[14px]">
                          <span className="text-ink-muted">Subtotal</span>
                          <span className="font-semibold">{formatCurrency(totalCents)}</span>
                        </div>
                        <div className="flex justify-between text-[14px]">
                          <span className="text-ink-muted">Platform Fee</span>
                          <span className="font-semibold text-emerald-600">Free</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-line text-[20px] font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(totalCents)}</span>
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

                <div className="rounded-2xl border border-line bg-paper-soft p-4 flex items-start gap-3">
                    <Info className="h-4 w-4 text-ink-subtle mt-0.5" />
                    <p className="text-[12px] text-ink-muted leading-relaxed">
                      By completing your purchase, you agree to TESKEL&apos;s <strong>Terms of Service</strong> and <strong>Refund Policy</strong>.
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

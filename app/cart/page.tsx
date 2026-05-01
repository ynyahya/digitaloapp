"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Zap, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems, subtotalCents, isMounted } = useCart();

  if (!isMounted) {
    return <div className="min-h-screen bg-night text-chalk flex items-center justify-center">Loading cart...</div>;
  }

  return (
    <div className="landing-theme grain-overlay relative min-h-screen overflow-hidden bg-night font-sans text-chalk">
      <div className="pointer-events-none absolute inset-0 bg-accent-glow opacity-60" />
      <div className="pointer-events-none absolute inset-0 grid-dark opacity-20 mask-radial-fade" />
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-night/75 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-[13px] font-black text-night lime-shadow">T</span>
            <span className="text-[16px] font-bold tracking-[-0.02em] text-chalk">TESKEL</span>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1.5 text-[13px] font-medium text-lime">
            <ShoppingBag className="h-4 w-4" />
            <span>{totalItems} items in cart</span>
          </div>
          <Link href="/products" className="text-[12px] font-semibold text-chalk-muted hover:text-chalk transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3 w-3" />
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="relative z-[1] mx-auto max-w-7xl px-6 py-12">
        <p className="text-eyebrow uppercase text-lime">Secure cart</p>
        <h1 className="mb-8 mt-3 text-[44px] font-black tracking-[-0.045em] text-chalk">Your Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center mb-6">
              <ShoppingBag className="h-10 w-10 text-lime" />
            </div>
            <h2 className="text-[20px] font-bold tracking-tight mb-2">Your cart is empty</h2>
            <p className="text-[14px] text-chalk-muted mb-8 max-w-[300px]">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Button size="lg" className="rounded-xl px-8" asChild>
              <Link href="/products">
                Browse Marketplace
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] overflow-hidden shadow-2xl shadow-black/25">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-widest text-chalk-dim bg-white/[0.035]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Price</div>
                </div>

                <ul className="divide-y divide-white/[0.08]">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.licenseId}`} className="p-6 sm:px-8 sm:py-6 group">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        <div className="sm:col-span-6 flex gap-4">
                          <div className="h-20 w-20 shrink-0 rounded-2xl bg-night border border-white/[0.08] flex items-center justify-center text-chalk-dim overflow-hidden relative">
                            {item.coverImage ? (
                              <Image 
                                src={item.coverImage} 
                                alt={item.title} 
                                className="h-full w-full object-cover" 
                                width={80}
                                height={80}
                              />
                            ) : (
                              <ImageIcon className="h-8 w-8 opacity-20" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <Link href={`/p/${item.slug}`} className="text-[15px] font-bold text-chalk truncate hover:text-lime">
                              {item.title}
                            </Link>
                            <p className="text-[12.5px] text-chalk-muted mt-0.5">{item.licenseName}</p>
                            <button
                              onClick={() => removeItem(item.productId, item.licenseId)}
                              className="mt-2 text-[11px] font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 self-start"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-3 flex sm:justify-center items-center">
                          <div className="flex items-center rounded-xl border border-white/[0.08] bg-night h-10 w-28 overflow-hidden">
                            <button
                              className="w-10 h-full flex items-center justify-center text-chalk-muted hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                              onClick={() => updateQty(item.productId, item.licenseId, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <div className="flex-1 text-center text-[13px] font-semibold">
                              {item.qty}
                            </div>
                            <button
                              className="w-10 h-full flex items-center justify-center text-chalk-muted hover:bg-white/[0.06] transition-colors"
                              onClick={() => updateQty(item.productId, item.licenseId, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-3 flex justify-between sm:block text-right">
                          <span className="sm:hidden text-[12px] text-chalk-muted">Total</span>
                          <span className="text-[16px] font-bold">{formatCurrency(item.priceCents * item.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <Card className="rounded-3xl border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/30">
                  <CardContent className="p-8 space-y-8">
                    <h2 className="text-[18px] font-bold">Order Summary</h2>

                    <div className="space-y-3 pt-6 border-t border-white/[0.08]">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-chalk-muted">Subtotal ({totalItems} items)</span>
                        <span className="font-semibold">{formatCurrency(subtotalCents)}</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-chalk-muted">Platform Fee</span>
                        <span className="font-semibold text-lime">Free</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-white/[0.08] text-[20px] font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(subtotalCents)}</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full h-14 rounded-2xl text-[15px] font-bold lime-shadow" asChild>
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="flex flex-col gap-3 text-[11px] font-medium text-chalk-muted">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-lime" />
                        Safe and secure checkout
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Instant access after purchase
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

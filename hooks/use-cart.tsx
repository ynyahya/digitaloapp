"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CartItem {
  productId: string;
  licenseId: string;
  slug: string;
  title: string;
  priceCents: number;
  coverImage: string | null;
  licenseName: string;
  creatorId: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: string, licenseId: string) => void;
  updateQty: (productId: string, licenseId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalCents: number;
  isMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("teskel-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse cart:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("teskel-cart", JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = useCallback((newItem: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.licenseId === newItem.licenseId
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.licenseId === newItem.licenseId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...newItem, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, licenseId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.licenseId === licenseId))
    );
  }, []);

  const updateQty = useCallback((productId: string, licenseId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.licenseId === licenseId ? { ...i, qty } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotalCents = items.reduce((acc, item) => acc + item.priceCents * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        subtotalCents,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

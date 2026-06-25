import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
};

let cart: CartItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return cart;
  },
  add(item: Omit<CartItem, "qty">) {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      cart = cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      cart = [...cart, { ...item, qty: 1 }];
    }
    emit();
  },
  setQty(id: string, qty: number) {
    cart = qty <= 0 ? cart.filter((c) => c.id !== id) : cart.map((c) => (c.id === id ? { ...c, qty } : c));
    emit();
  },
  remove(id: string) {
    cart = cart.filter((c) => c.id !== id);
    emit();
  },
  clear() {
    cart = [];
    emit();
  },
};

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.get);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

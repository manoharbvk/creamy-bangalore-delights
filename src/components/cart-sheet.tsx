import { useState } from "react";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { cartStore, cartTotal, useCart } from "@/lib/cart-store";

const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  address: z.string().trim().min(8, "Enter a delivery address").max(400),
  area: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(400).optional(),
});

export function CartButton({ onOpen }: { onOpen: () => void }) {
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <button
      onClick={onOpen}
      className="relative inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
    >
      <ShoppingBag className="h-4 w-4" />
      Cart
      {count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCart();
  const total = cartTotal(items);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "", area: "", notes: "" });

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");

    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: parsed.data.customer_name,
      phone: parsed.data.phone,
      address: parsed.data.address,
      area: parsed.data.area || null,
      notes: parsed.data.notes || null,
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, unit: i.unit })),
      total,
    });
    setSubmitting(false);
    if (error) return toast.error("Could not place order. " + error.message);
    toast.success("Order placed! We'll call you shortly to confirm.");
    cartStore.clear();
    setForm({ customer_name: "", phone: "", address: "", area: "", notes: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-2xl">Your Cart</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">Cart is empty. Add a product to get started.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{it.price} {it.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-border">
                    <button onClick={() => cartStore.setQty(it.id, it.qty - 1)} className="p-1.5 hover:bg-secondary rounded-l-full">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{it.qty}</span>
                    <button onClick={() => cartStore.setQty(it.id, it.qty + 1)} className="p-1.5 hover:bg-secondary rounded-r-full">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="w-16 text-right font-medium">₹{it.price * it.qty}</p>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <form className="mt-6 space-y-3" onSubmit={onSubmit}>
              <h3 className="font-display text-lg">Delivery details</h3>
              {(
                [
                  ["customer_name", "Full name", "text"],
                  ["phone", "Phone number", "tel"],
                  ["area", "Area / Neighborhood", "text"],
                ] as const
              ).map(([k, label, type]) => (
                <input
                  key={k}
                  type={type}
                  placeholder={label}
                  value={form[k as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-ring/40"
                />
              ))}
              <textarea
                placeholder="Address (door no, street, landmark)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-ring/40"
              />
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-ring/40"
              />
            </form>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border bg-card px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl">₹{total}</span>
            </div>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

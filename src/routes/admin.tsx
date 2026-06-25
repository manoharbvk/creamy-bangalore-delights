import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Green Pastures" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  area: string | null;
  notes: string | null;
  items: Array<{ id: string; name: string; qty: number; price: number; unit: string }>;
  total: number;
  status: string;
  created_at: string;
};

function AdminPage() {
  const [session, setSession] = useState<{ userId: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user ? { userId: s.user.id } : null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ? { userId: data.session.user.id } : null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!session) return <SignIn />;
  if (isAdmin === null) return <div className="grid min-h-screen place-items-center text-muted-foreground">Checking access…</div>;
  if (!isAdmin) return <NotAdmin email={session.userId} />;
  return <Orders />;
}

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created. You may sign in now.");
    }
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/30 px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div>
          <h1 className="font-display text-3xl">Admin {mode === "signin" ? "Sign In" : "Sign Up"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Green Pastures order management</p>
        </div>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-ring/40" />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-ring/40" />
        <button disabled={busy} className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
          {busy ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

function NotAdmin({ email }: { email: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-secondary/30 px-6">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
        <h1 className="font-display text-2xl">No admin access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account ({email.slice(0, 8)}…) isn't an admin yet. Open the Cloud backend and add a row to <code className="rounded bg-secondary px-1.5 py-0.5">user_roles</code> with your user id and role <code className="rounded bg-secondary px-1.5 py-0.5">admin</code>.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="mt-6 rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary">
          Sign out
        </button>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders((data as unknown as Order[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("orders-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        toast.success("New order received");
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Admin</p>
            <h1 className="font-display text-2xl">Orders ({orders.length})</h1>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl gap-2 px-6 pb-4 text-sm">
          {["all", "new", "confirmed", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 capitalize transition ${filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading ? (
          <p className="text-muted-foreground">Loading orders…</p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No orders here yet.</p>
        ) : (
          <div className="space-y-4">
            {visible.map((o) => (
              <article key={o.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl">{o.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      <a href={`tel:${o.phone}`} className="underline-offset-2 hover:underline">{o.phone}</a>
                      {o.area ? ` · ${o.area}` : ""}
                    </p>
                    <p className="mt-1 text-sm">{o.address}</p>
                    {o.notes && <p className="mt-1 text-sm italic text-muted-foreground">"{o.notes}"</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-primary">₹{o.total}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                    <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs capitalize">{o.status}</span>
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-background text-sm">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between px-4 py-2">
                      <span>{it.qty} × {it.name}</span>
                      <span className="text-muted-foreground">₹{it.price * it.qty}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["new", "confirmed", "delivered", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(o.id, s)}
                      className={`rounded-full px-3 py-1 text-xs capitalize transition ${o.status === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

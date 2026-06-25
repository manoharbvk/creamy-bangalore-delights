import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-dairy.jpg";
import milkImg from "@/assets/product-milk.jpg";
import gheeImg from "@/assets/product-ghee.jpg";
import curdImg from "@/assets/product-curd.jpg";
import paneerImg from "@/assets/product-paneer.jpg";
import { CartButton, CartSheet } from "@/components/cart-sheet";
import { cartStore } from "@/lib/cart-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Green Pastures — Farm-fresh milk & ghee in Bangalore" },
      { name: "description", content: "Morning-fresh A2 milk, bilona ghee, curd and paneer delivered to your door across select Bangalore neighborhoods." },
      { property: "og:title", content: "Green Pastures Dairy" },
      { property: "og:description", content: "Farm-fresh dairy, delivered by sunrise across Bangalore." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Landing,
});

const products = [
  { id: "milk-500", name: "A2 Cow Milk", price: 84, priceLabel: "₹84", unit: "/ 500ml bottle", img: milkImg, tag: "Bestseller", desc: "From desi Gir cows, glass-bottled within 4 hours of milking." },
  { id: "ghee-500", name: "Bilona A2 Ghee", price: 1499, priceLabel: "₹1,499", unit: "/ 500ml jar", img: gheeImg, tag: "Hand-churned", desc: "Slow-cooked from cultured curd. Golden, grainy, deeply aromatic." },
  { id: "curd-400", name: "Fresh Set Curd", price: 65, priceLabel: "₹65", unit: "/ 400g tub", img: curdImg, tag: "Daily", desc: "Hung overnight in earthen pots for the perfect tang." },
  { id: "paneer-250", name: "Soft Paneer", price: 120, priceLabel: "₹120", unit: "/ 250g block", img: paneerImg, tag: "Made today", desc: "Pressed fresh each morning. No starch, no fillers, no preservatives." },
];

const areas = ["Indiranagar", "Koramangala", "HSR Layout", "Jayanagar", "JP Nagar", "Whitefield", "Sarjapur", "Bellandur"];

function Landing() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onCart={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <Products onAdd={() => setCartOpen(true)} />
      <Promise />
      <Areas />
      <Testimonials />
      <CTA />
      <Footer />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function Nav({ onCart }: { onCart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">G</span>
          <span className="font-display text-xl tracking-tight">Green Pastures</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#products" className="hover:text-foreground transition">Products</a>
          <a href="#promise" className="hover:text-foreground transition">Our Promise</a>
          <a href="#areas" className="hover:text-foreground transition">Delivery Areas</a>
          <a href="#contact" className="hover:text-foreground transition">Contact</a>
        </nav>
        <CartButton onOpen={onCart} />
      </div>
    </header>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-16 pb-24 md:grid-cols-2 md:items-center md:pt-24 md:pb-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Now serving 8 Bangalore neighborhoods
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Milk that <em className="not-italic text-primary">remembers</em> the pasture.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            We milk our desi Gir cows at dawn and pour it into your bottle by 7 a.m. — pure A2, glass-bottled,
            never homogenised. Just the way your grandmother knew it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition hover:translate-y-[-1px] hover:shadow-lg">
              Shop Products →
            </a>
            <a href="#promise" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-secondary">
              Why Green Pastures
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
            {[
              ["4 hrs", "farm to bottle"],
              ["2,400+", "Bangalore homes"],
              ["100%", "A2 desi breed"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl text-primary">{n}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/20 blur-3xl" aria-hidden />
          <img
            src={heroImg}
            alt="Glass bottle of fresh milk and a jar of golden ghee on a wooden table with cows grazing in the background"
            width={1536}
            height={1024}
            className="relative rounded-[2rem] object-cover shadow-2xl"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-xl md:block">
            <p className="font-display text-2xl text-primary">★ 4.9</p>
            <p className="text-xs text-muted-foreground">from 1,200+ subscribers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Hormone-free", "No homogenisation", "Glass bottles", "Returned & reused", "A2 Gir cows", "Bilona-churned ghee", "Same-day delivery"];
  return (
    <div className="border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-4 text-sm font-medium">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function Products() {
  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The shelf</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A small range. Each one done properly.</h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          We only sell what we'd serve our own children. Order one-off or set a daily subscription — pause anytime.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <article key={p.name} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img src={p.img} alt={p.name} width={800} height={800} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                {p.tag}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-xl">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-end justify-between">
                <p>
                  <span className="font-display text-2xl text-foreground">{p.price}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{p.unit}</span>
                </p>
                <button className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90">
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Promise() {
  const items = [
    { n: "01", t: "Single-source farm", d: "Every drop comes from our own herd in Doddaballapur — no aggregators, no co-ops, no surprises." },
    { n: "02", t: "Milked at dawn", d: "Hand-milked by 4 a.m., chilled instantly, and on its way to your door before sunrise." },
    { n: "03", t: "Returnable glass", d: "We deliver in glass, collect the bottle next morning, and sterilise it on the farm. No plastic, no waste." },
    { n: "04", t: "Vet-attended herd", d: "Zero hormones. Zero antibiotics. Independent lab tested every fortnight — results in your inbox." },
  ];
  return (
    <section id="promise" className="bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our promise</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Four rules we don't break.</h2>
            <p className="mt-6 text-muted-foreground">
              Industrial dairy gave us shelf-stable convenience and forgot the taste. We rebuilt the chain from the cow up.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
            {items.map((i) => (
              <div key={i.n} className="bg-card p-8">
                <p className="font-display text-3xl text-accent">{i.n}</p>
                <h3 className="mt-4 font-display text-xl">{i.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section id="areas" className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-[2.5rem] border border-border bg-primary px-8 py-16 text-primary-foreground sm:px-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Delivery</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Sunrise delivery, eight neighborhoods.</h2>
            <p className="mt-6 text-primary-foreground/80">
              We deliver to your door between 5:30 and 7:30 a.m. — every single morning, including Sundays.
              Don't see your area yet? Drop us your pincode and we'll let you know when we're nearby.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {areas.map((a) => (
              <span key={a} className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-2.5 text-sm">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "The taste actually reminded me of milk from my village in Coorg. My kids notice the difference.", a: "Priya R.", l: "HSR Layout" },
    { q: "The ghee is the real thing — grainy, golden, smells like Sunday cooking at amma's house.", a: "Karthik S.", l: "Indiranagar" },
    { q: "Reliable like clockwork. Six months in and never a missed delivery.", a: "Ananya M.", l: "Jayanagar" },
  ];
  return (
    <section className="bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Kind words</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">Families who switched and stayed.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.map((x) => (
            <figure key={x.a} className="flex flex-col rounded-3xl border border-border bg-card p-8">
              <blockquote className="flex-1 font-display text-xl leading-snug">"{x.q}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                <p className="font-medium">{x.a}</p>
                <p className="text-muted-foreground">{x.l}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 rounded-[2.5rem] border border-border bg-card p-10 md:grid-cols-2 md:items-center md:p-16">
        <div>
          <h2 className="font-display text-4xl md:text-5xl">Try a week. On us.</h2>
          <p className="mt-4 text-muted-foreground">
            Your first week of A2 milk is free when you start a 1-month subscription. Cancel anytime — keep the glass bottles.
          </p>
        </div>
        <form id="contact" className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Your Bangalore pincode"
            className="rounded-full border border-input bg-background px-6 py-4 text-base outline-none ring-ring/40 transition focus:ring-2"
          />
          <button className="rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Check availability
          </button>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Or call us at <a href="tel:+918041234567" className="underline underline-offset-2">+91 80 4123 4567</a>
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">G</span>
            <span className="font-display text-xl">Green Pastures</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A small family dairy outside Bangalore, delivering milk and ghee the way it was meant to taste.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#products" className="hover:text-foreground">A2 Milk</a></li>
            <li><a href="#products" className="hover:text-foreground">Bilona Ghee</a></li>
            <li><a href="#products" className="hover:text-foreground">Curd</a></li>
            <li><a href="#products" className="hover:text-foreground">Paneer</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@greenpastures.in</li>
            <li>+91 80 4123 4567</li>
            <li>Doddaballapur, Bangalore Rural</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Green Pastures Dairy. All rights reserved.</p>
          <p>Made with ♥ in Bangalore</p>
        </div>
      </div>
    </footer>
  );
}

import { readDb } from "@/lib/db";
import Nav from "@/components/Nav";
import Link from "next/link";

export const runtime = "nodejs";

function parseINR(s: string) {
  return Number(String(s).replace(/[^\d]/g, "")) || 0;
}

export default function Dashboard() {
  const db = readDb();
  const pending = db.reservations.filter((r) => r.status === "pending").length;
  const confirmed = db.reservations.filter((r) => r.status === "confirmed").length;
  const newOrders = db.orders.filter((o) => o.status === "new").length;
  const activeOrders = db.orders.filter(
    (o) => o.status === "new" || o.status === "preparing" || o.status === "ready"
  ).length;
  const revenue =
    db.orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + parseINR(o.total), 0);

  const stats = [
    { label: "Total Reservations", value: db.reservations.length, href: "/reservations", accent: "text-gold" },
    { label: "Pending", value: pending, href: "/reservations", accent: "text-terracotta" },
    { label: "Confirmed", value: confirmed, href: "/reservations", accent: "text-sage" },
    { label: "Total Orders", value: db.orders.length, href: "/orders", accent: "text-gold" },
    { label: "Active Orders", value: activeOrders, href: "/orders", accent: "text-terracotta" },
    { label: "New Orders", value: newOrders, href: "/orders", accent: "text-gold" },
  ];

  const recentRes = db.reservations.slice(0, 5);
  const recentOrders = db.orders.slice(0, 5);

  return (
    <main className="min-h-screen">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-baseline gap-4 mb-8">
          <h1 className="text-3xl font-heading text-cream">Dashboard</h1>
          <p className="font-script text-gold text-2xl">Benvenuto</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-wine border-2 border-gold/30 rounded-2xl p-5 hover:border-gold/70 transition-colors"
            >
              <div className={`text-4xl font-heading ${s.accent}`}>{s.value}</div>
              <div className="text-cream/70 text-xs font-semibold mt-2 uppercase tracking-wide">
                {s.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-wine border-2 border-gold/30 rounded-2xl p-6">
            <h2 className="font-heading text-2xl text-gold mb-4">Recent Reservations</h2>
            <ul className="space-y-3">
              {recentRes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 border-b border-gold/20 pb-3"
                >
                  <div className="min-w-0">
                    <p className="text-cream font-semibold truncate">{r.name}</p>
                    <p className="text-cream/50 text-xs">
                      {r.date} at {r.time} &middot; {r.guests}
                    </p>
                  </div>
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                        r.status === "confirmed"
                          ? "text-sage border-sage/60"
                          : r.status === "pending"
                          ? "text-terracotta border-terracotta/60"
                          : "text-cream/60 border-gold/40"
                      }`}
                    >
                      {r.status}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/reservations" className="inline-block mt-4 text-gold text-sm font-semibold hover:underline">
              View all reservations &rarr;
            </Link>
          </section>

          <section className="bg-wine border-2 border-gold/30 rounded-2xl p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-heading text-2xl text-gold">Recent Orders</h2>
              <span className="text-cream/70 font-semibold text-lg">₹{revenue.toLocaleString("en-IN")}</span>
            </div>
            <ul className="space-y-3">
              {recentOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 border-b border-gold/20 pb-3"
                >
                  <div className="min-w-0">
                    <p className="text-cream font-semibold truncate">{o.customer}</p>
                    <p className="text-cream/50 text-xs truncate">
                      {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gold font-bold">{o.total}</p>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                        o.status === "new"
                          ? "text-terracotta border-terracotta/60"
                          : o.status === "completed"
                          ? "text-sage border-sage/60"
                          : "text-cream/60 border-gold/40"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/orders" className="inline-block mt-4 text-gold text-sm font-semibold hover:underline">
              View all orders &rarr;
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
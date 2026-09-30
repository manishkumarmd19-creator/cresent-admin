"use client";

import { useCallback, useEffect, useState } from "react";
import Nav from "@/components/Nav";

export type OrderItem = { name: string; qty: number; price: string };

type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "preparing", "ready", "completed", "cancelled"];

export default function OrdersPage() {
  const [data, setData] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (res.ok) {
      const j = (await res.json()) as { orders: Order[] };
      setData(j.orders);
      setError("");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(o: Order, status: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: o.id, status }),
    });
    load();
  }

  async function remove(o: Order) {
    if (!confirm(`Delete order for ${o.customer}?`)) return;
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: o.id }),
    });
    load();
  }

  return (
    <main className="min-h-screen">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-baseline gap-4 mb-8">
          <h1 className="text-3xl font-heading text-cream">Food Orders</h1>
          <p className="font-script text-gold text-2xl">
            {data ? `${data.length} total` : "..."}
          </p>
        </div>

        {!data && !error && <p className="text-cream/60">Loading...</p>}
        {error && <p className="text-terracotta">{error}</p>}

        <div className="bg-wine border-2 border-gold/30 rounded-2xl overflow-hidden">
          {data && data.length === 0 && (
            <p className="text-cream/60 p-8 text-center">No orders yet.</p>
          )}
          {data &&
            data.map((o) => (
              <div
                key={o.id}
                className="grid md:grid-cols-[1fr_auto] items-center gap-4 p-5 border-b border-gold/20 last:border-0 hover:bg-wine-dark/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading text-xl text-cream">{o.customer}</h3>
                    <span className="text-gold font-bold text-lg">{o.total}</span>
                  </div>
                  <p className="text-cream/60 text-sm mt-1">{o.phone}</p>
                  <ul className="text-cream/80 text-sm mt-1 space-y-0.5">
                    {o.items.map((i, idx) => (
                      <li key={idx}>
                        {i.name} &times; {i.qty} <span className="text-cream/40">({i.price} each)</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-cream/30 text-xs mt-1">
                    Placed {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o, e.target.value)}
                    className="bg-cream text-cocoa text-sm font-semibold px-3 py-2 rounded-full border-2 border-gold focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(o)}
                    className="px-3 py-2 rounded-full text-sm font-semibold text-terracotta border border-terracotta/50 hover:bg-burgundy hover:text-cream transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
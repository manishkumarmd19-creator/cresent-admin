import { randomUUID } from "node:crypto";
import { readDb, writeDb, type Order, type OrderItem } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_STATUSES = ["new", "preparing", "ready", "completed", "cancelled"];

export async function GET() {
  const db = readDb();
  return NextResponse.json(
    { orders: db.orders },
    { headers: { "Cache-Control": "no-store" } }
  );
}

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      customer?: string;
      phone?: string;
      items?: OrderItem[];
    };
    const customer = String(body.customer ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const items = Array.isArray(body.items)
      ? body.items
          .filter((i) => i && i.name && i.qty > 0)
          .map((i) => ({
            name: String(i.name),
            qty: Number(i.qty),
            price: String(i.price ?? "₹0"),
          }))
      : [];
    if (!customer || !phone || items.length === 0) {
      return NextResponse.json({ error: "Customer, phone and items are required" }, { status: 400 });
    }
    const total = items.reduce((sum, i) => {
      const n = Number(String(i.price).replace(/[^\d]/g, ""));
      return sum + n * i.qty;
    }, 0);
    const order: Order = {
      id: randomUUID(),
      customer,
      phone,
      items,
      total: formatINR(total),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    const db = readDb();
    db.orders.unshift(order);
    writeDb(db);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as { id?: string; status?: string };
    if (!body.id || !VALID_STATUSES.includes(body.status ?? "")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const db = readDb();
    const o = db.orders.find((x) => x.id === body.id);
    if (!o) return NextResponse.json({ error: "Not found" }, { status: 404 });
    o.status = body.status as string;
    writeDb(db);
    return NextResponse.json({ order: o });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { id?: string };
    const db = readDb();
    db.orders = db.orders.filter((x) => x.id !== body.id);
    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
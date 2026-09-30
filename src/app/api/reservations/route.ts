import { randomUUID } from "node:crypto";
import { readDb, writeDb, type Reservation } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_STATUSES = ["pending", "confirmed", "refused", "cancelled"];

export async function GET() {
  const db = readDb();
  return NextResponse.json(
    { reservations: db.reservations },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Reservation>;
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }
    const reservation: Reservation = {
      id: randomUUID(),
      name,
      phone,
      guests: String(body.guests ?? "1 Guest"),
      date: String(body.date ?? ""),
      time: String(body.time ?? ""),
      message: String(body.message ?? ""),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const db = readDb();
    db.reservations.unshift(reservation);
    writeDb(db);
    return NextResponse.json({ reservation }, { status: 201 });
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
    const r = db.reservations.find((x) => x.id === body.id);
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    r.status = body.status as string;
    writeDb(db);
    return NextResponse.json({ reservation: r });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { id?: string };
    const db = readDb();
    db.reservations = db.reservations.filter((x) => x.id !== body.id);
    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
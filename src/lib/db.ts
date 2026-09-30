import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  message: string;
  status: string;
  createdAt: string;
};

export type OrderItem = { name: string; qty: number; price: string };

export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: string;
};

export type DB = { reservations: Reservation[]; orders: Order[] };

const isVercel = process.env.VERCEL === "1";
// Locally store next to the project; on Vercel the cwd is read-only, so use /tmp.
const dir = isVercel
  ? "/tmp/cresent-admin"
  : path.join(process.cwd(), "data");
const file = path.join(dir, "db.json");

function seed(): DB {
  const now = new Date();
  return {
    reservations: [
      {
        id: randomUUID(),
        name: "Aarav Mehta",
        phone: "+91 98765 43210",
        guests: "4 Guests",
        date: "2026-10-02",
        time: "20:00",
        message: "Anniversary dinner, window table please",
        status: "pending",
        createdAt: now.toISOString(),
      },
      {
        id: randomUUID(),
        name: "Sophie Laurent",
        phone: "+33 6 12 34 56 78",
        guests: "2 Guests",
        date: "2026-10-03",
        time: "19:30",
        message: "",
        status: "confirmed",
        createdAt: now.toISOString(),
      },
      {
        id: randomUUID(),
        name: "David Chen",
        phone: "+1 555 018 2299",
        guests: "5+ Guests",
        date: "2026-10-05",
        time: "21:00",
        message: "Corporate dinner",
        status: "pending",
        createdAt: now.toISOString(),
      },
    ],
    orders: [
      {
        id: randomUUID(),
        customer: "Riya Kapoor",
        phone: "+91 90000 12345",
        items: [
          { name: "Coq au Vin", qty: 1, price: "₹2,850" },
          { name: "Crème Brûlée", qty: 2, price: "₹2,800" },
        ],
        total: "₹8,450",
        status: "new",
        createdAt: now.toISOString(),
      },
      {
        id: randomUUID(),
        customer: "Olivia Turner",
        phone: "+44 7700 900123",
        items: [
          { name: "Bœuf Bourguignon", qty: 1, price: "₹2,950" },
          { name: "Tarte Tatin", qty: 1, price: "₹2,700" },
        ],
        total: "₹5,650",
        status: "preparing",
        createdAt: now.toISOString(),
      },
    ],
  };
}

export function readDb(): DB {
  if (!fs.existsSync(file)) {
    const s = seed();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(s, null, 2));
    return s;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as DB;
  } catch {
    const s = seed();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(s, null, 2));
    return s;
  }
}

export function writeDb(db: DB) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

export function uid() {
  return randomUUID();
}
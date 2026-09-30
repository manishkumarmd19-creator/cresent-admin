import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
  return res;
}
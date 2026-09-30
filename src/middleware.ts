import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

const ALLOWED_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const PUBLIC_API = ["/api/auth/login"];
// Public submission endpoints: guests can POST a reservation or an order from the website.
const PUBLIC_POST = ["/api/reservations", "/api/orders"];

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allow = ALLOWED_ORIGIN.test(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const host = `${url.protocol}//${url.host}`;
  const allowedHost = ALLOWED_ORIGIN.test(host) ? host : "";

  if (path.startsWith("/api")) {
    const allowOrigin =
      allowedHost && allowedHost !== `${host}` ? allowedHost : corsHeaders(req)["Access-Control-Allow-Origin"];

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
    }

    const isPublic =
      PUBLIC_API.some((p) => path === p) ||
      (PUBLIC_POST.includes(path) && req.method === "POST");
    if (!isPublic) {
      const ok = await verifySession(req.cookies.get(COOKIE)?.value);
      if (!ok) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401, headers: corsHeaders(req) }
        );
      }
    }
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", corsHeaders(req)["Access-Control-Allow-Origin"]);
    return res;
  }

  if (path !== "/login") {
    const ok = await verifySession(req.cookies.get(COOKIE)?.value);
    if (!ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/reservations", "/orders", "/api/:path*"],
};
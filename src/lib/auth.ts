// Session helpers (edge + node safe via Web Crypto)
const ADMIN_PASSWORD = "crescent@123";
const SECRET = "the-crescent-admin-secret-key-2026";
export const COOKIE = "crescent_admin_session";

const enc = new TextEncoder();

function b64url(data: string) {
  return btoa(data)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(data: string) {
  const pad = "=".repeat((4 - (data.length % 4)) % 4);
  return atob(data.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

function bufToB64url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return b64url(bin);
}

function bufFromB64url(data: string) {
  const bin = fromB64url(data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export function checkPassword(pw: string) {
  return pw === ADMIN_PASSWORD;
}

export async function createSession() {
  const payload = b64url(
    JSON.stringify({ role: "admin", exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })
  );
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${bufToB64url(sig)}`;
}

export async function verifySession(token: string | undefined | null) {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  try {
    const data = JSON.parse(fromB64url(payload)) as { role?: string; exp?: number };
    if (data.role !== "admin") return false;
    if (!data.exp || data.exp < Date.now()) return false;
    const key = await hmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      bufFromB64url(sig),
      enc.encode(payload)
    );
    return valid;
  } catch {
    return false;
  }
}
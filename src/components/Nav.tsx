"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/reservations", label: "Reservations" },
  { href: "/orders", label: "Orders" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-wine-dark/95 backdrop-blur border-b-2 border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-3 shrink-0">
          <span className="font-heading text-2xl text-cream">THE CRESCENT</span>
          <span className="font-script text-gold text-xl hidden sm:inline">Admin</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                pathname === l.href
                  ? "bg-gold text-wine-dark"
                  : "text-cream/80 hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-terracotta border border-terracotta/50 hover:bg-burgundy hover:text-cream transition-colors"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
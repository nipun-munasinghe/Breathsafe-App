"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sensors", label: "Sensors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/support", label: "Support" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href ? "text-emerald-950" : "text-gray-500 hover:text-emerald-950";

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-green-100 to-orange-100 ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                <path
                  d="M5 12c0-3.866 3.134-7 7-7a7 7 0 0 1 0 14h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3.25a.75.75 0 0 0-1.5 0V18A2 2 0 0 1 5 20"
                  fill="currentColor"
                  className="text-lime-600"
                />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-blue-gray-900">
              Breath<span className="text-lime-600">Safe</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-normal ${isActive(item.href)} transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA(s) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:text-emerald-950 hover:border-emerald-950 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-lg bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-950 transition-colors"
            >
              Create account
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-black/5 text-blue-gray-900 hover:text-emerald-950"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4">
          <nav className="grid gap-1 rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2 text-sm ${
                  pathname === item.href
                    ? "bg-white text-emerald-950"
                    : "text-gray-500 hover:bg-white/70 hover:text-emerald-950"
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-emerald-950 hover:border-emerald-950"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-lime-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-950"
              >
                Join now
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

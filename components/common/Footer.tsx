"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Heart, ChevronRight } from "lucide-react";

type LinkItem = { label: string; href: string; external?: boolean };
type LinkGroup = { heading: string; links: LinkItem[] };

const LINK_GROUPS: LinkGroup[] = [
  {
    heading: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Sensors", href: "/sensors" },
      { label: "Analytics", href: "/analytics" },
      { label: "Request Sensor", href: "/create-request" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/support" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "API", href: "/api" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const SOCIAL_LINKS: { label: string; href: string; icon: React.ReactNode; aria: string; external?: boolean }[] = [
  {
    label: "GitHub",
    href: "https://github.com",
    aria: "GitHub",
    icon: <Github className="h-5 w-5" />,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:contact@example.com",
    aria: "Email",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    aria: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    external: true,
  },
];

type FooterProps = {
  showNewsletter?: boolean;
  variant?: "dark" | "darker";
};

export default function Footer({ showNewsletter = true, variant = "dark" }: FooterProps) {
  const year = React.useMemo(() => new Date().getFullYear(), []);
  const bgClass =
    variant === "darker"
      ? "bg-neutral-950"
      : "bg-neutral-900";

  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    console.log("Newsletter subscribe:", email);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <footer className={`relative border-t border-white/10 ${bgClass} text-neutral-300`}>
      {/* Decorative subtle glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-64 w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-600/15 via-lime-400/5 to-amber-400/15 blur-2xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand / Intro */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-lime-600 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-900/30">
                <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 text-white">
                  <path
                    d="M5 12c0-3.866 3.134-7 7-7a7 7 0 0 1 0 14h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3.25a.75.75 0 0 0-1.5 0V18A2 2 0 0 1 5 20"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="text-xl font-semibold tracking-tight text-white">
                Breath<span className="text-lime-400">Safe</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Reliable air quality monitoring & sensor management. Actionable analytics to keep environments safer.
            </p>

            {showNewsletter && (
              <form
                onSubmit={handleNewsletterSubmit}
                className="mt-6 flex max-w-md overflow-hidden rounded-xl border border-white/10 bg-neutral-800/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/50"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
                  aria-label="Email for newsletter"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="group flex items-center gap-1 bg-gradient-to-br from-emerald-600 to-lime-600 px-4 text-sm font-medium text-white transition hover:from-emerald-500 hover:to-lime-500"
                >
                  Join
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </form>
            )}
          </div>

          {/* Link groups (navigation) */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((l) => {
                  const base =
                    "text-sm text-neutral-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1";
                  return l.external ? (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={base}
                      >
                        {l.label}
                        <span className="text-[10px] opacity-60">↗</span>
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className={base}>
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
          <p className="flex items-center gap-1 text-center md:text-left">
            © {isFinite(year as unknown as number) ? year : new Date().getFullYear()} BreathSafe. Built with
            <Heart className="h-4 w-4 text-rose-400" aria-hidden />
            care.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/status"
              className="hover:text-neutral-300 transition-colors"
            >
              Status
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) =>
              s.external ? (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 ring-1 ring-white/10 hover:ring-emerald-500/40 hover:text-emerald-300 transition"
                  aria-label={s.aria}
                >
                  {s.icon}
                </a>
              ) : (
                <Link
                  key={s.label}
                  href={s.href}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 ring-1 ring-white/10 hover:ring-emerald-500/40 hover:text-emerald-300 transition"
                  aria-label={s.aria}
                >
                  {s.icon}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

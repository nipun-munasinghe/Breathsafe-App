"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Bell, ChevronDown, LogOut, UserRound, Settings } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import type { loggedInUser } from "@/types/user/types";

type NavItem = { href: string; label: string };
const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sensors", label: "Sensors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/support", label: "Support" },
  
  
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function isExact(pathname: string, href: string) {
  return pathname === href;
}
function fullName(u: loggedInUser | null) {
  if (!u) return "User";
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return name || u.username || "User";
}

/** Common avatar fields we might get from different auth providers */
type Avatarish = {
  avatarUrl?: string | null;
  image?: string | null;
  avatar?: string | null;
  photoURL?: string | null;
};

/** Attempts to derive an avatar URL from the user, or returns null. */
function avatarFromUser(u: loggedInUser | null): string | null {
  if (!u) return null;
  const v = u as unknown as Avatarish;
  return v.avatarUrl ?? v.image ?? v.avatar ?? v.photoURL ?? null;
}

function NotificationsButton({ solid }: { solid: boolean }) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className={cx(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
        solid
          ? "ring-1 ring-black/5 text-slate-900 hover:text-emerald-950"
          : "ring-1 ring-white/20 text-white/90 hover:text-white"
      )}
    >
      <Bell className="h-5 w-5" />
      <span
        className={cx(
          "absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full ring-2",
          solid ? "bg-red-500 ring-white" : "bg-red-400 ring-slate-900/30"
        )}
      />
    </button>
  );
}

function AvatarImg({ src, alt }: { src?: string | null; alt: string }) {
  const getSrc = (s?: string | null) => s || "/profile-pic.jpg";
  return (
    <Image
      src={getSrc(src)}
      alt={alt}
      width={32}
      height={32}
      className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5"
      onError={(e) => {
        const t = e.currentTarget as HTMLImageElement;
        if (!t.src.endsWith("/profile-pic.jpg")) t.src = "/profile-pic.jpg";
      }}
    />
  );
}

function AuthButtons({
  layout = "inline",
  onItemClick,
  solid,
}: {
  layout?: "inline" | "grid";
  onItemClick?: () => void;
  solid: boolean;
}) {
  const base =
    "rounded-xl px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";
  return (
    <div className={cx(layout === "grid" ? "grid grid-cols-2 gap-2" : "flex items-center gap-3")}>
      <Link
        href="/signin"
        onClick={onItemClick}
        className={cx(
          base,
          solid
            ? "border border-slate-200 text-center font-medium text-slate-600 hover:text-emerald-950 hover:border-emerald-950"
            : "border border-white/30 text-center font-medium text-white hover:text-white hover:border-white"
        )}
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        onClick={onItemClick}
        className={cx(
          base,
          solid
            ? "bg-lime-600 text-center font-semibold text-white hover:bg-emerald-950"
            : "bg-white/15 text-center font-semibold text-white backdrop-blur hover:bg-white/25"
        )}
      >
        Create account
      </Link>
    </div>
  );
}

function NavLink({ item, active, solid }: { item: NavItem; active: boolean; solid: boolean }) {
  return (
    <Link
      href={item.href}
      className={cx(
        "rounded px-1.5 py-1 text-sm font-normal transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
        solid
          ? active
            ? "text-emerald-950"
            : "text-slate-500 hover:text-emerald-950"
          : active
          ? "text-white"
          : "text-white/80 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}

function MenuLink({
  href,
  children,
  onSelect,
}: {
  href: string;
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
      onClick={onSelect}
    >
      {children}
    </Link>
  );
}

function MenuButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function UserMenu({
  user,
  solid,
  onSignOut,
}: {
  user: loggedInUser;
  solid: boolean;
  onSignOut: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx(
          "group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
          solid ? "ring-1 ring-black/5 hover:bg-slate-50" : "ring-1 ring-white/20 hover:bg-white/10"
        )}
      >
        <span className="flex items-center gap-2">
          <AvatarImg src={avatarFromUser(user)} alt="Profile" />
          <span
            className={cx(
              "text-sm font-medium",
              solid ? "text-slate-900 group-hover:text-emerald-950" : "text-white group-hover:text-white"
            )}
          >
            {fullName(user)}
          </span>
        </span>
        <ChevronDown
          className={cx(
            "h-4 w-4",
            solid ? "text-slate-500 group-hover:text-emerald-950" : "text-white/80 group-hover:text-white"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cx(
            "absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg",
            solid ? "border-slate-100" : "border-white/20"
          )}
        >
          <MenuLink href="/userProfile" onSelect={() => setOpen(false)}>
            <UserRound className="h-4 w-4" />
            Profile
          </MenuLink>
          <MenuLink href="/settings" onSelect={() => setOpen(false)}>
            <Settings className="h-4 w-4" />
            Settings
          </MenuLink>
          <MenuButton
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </MenuButton>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Scroll shadow / solid header
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sign out helper + global event hook
  const handleSignOut = React.useCallback(() => {
    logout();
    router.push("/signin");
  }, [logout, router]);

  const onAppSignOut = React.useCallback(() => {
    handleSignOut();
  }, [handleSignOut]);

  React.useEffect(() => {
    window.addEventListener("app:signout", onAppSignOut);
    return () => window.removeEventListener("app:signout", onAppSignOut);
  }, [onAppSignOut]);

  const solid = scrolled;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 w-full transition-colors",
        solid
          ? "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-xl"
          : "bg-transparent"
      )}
    >
      {/* Outer container */}
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <span
              className={cx(
                "inline-grid h-9 w-9 place-items-center rounded-xl ring-1",
                solid ? "bg-gradient-to-br from-green-100 to-orange-100 ring-black/5" : "bg-white/10 ring-white/20"
              )}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                <path
                  d="M5 12c0-3.866 3.134-7 7-7a7 7 0 0 1 0 14h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3.25a.75.75 0 0 0-1.5 0V18A2 2 0 0 1 5 20"
                  fill="currentColor"
                  className={cx(solid ? "text-lime-600" : "text-white")}
                />
              </svg>
            </span>
            <span className={cx("text-xl font-bold tracking-tight", solid ? "text-slate-900" : "text-white")}>
              Breath<span className={cx(solid ? "text-lime-600" : "text-white/80")}>Safe</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} active={isExact(pathname, item.href)} solid={solid} />
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!isInitialized ? null : !isLoggedIn || !user ? (
              <AuthButtons solid={solid} />
            ) : (
              <div className="flex items-center gap-2">
                <NotificationsButton solid={solid} />
                <UserMenu user={user} solid={solid} onSignOut={handleSignOut} />
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cx(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
              solid ? "ring-1 ring-black/5 text-slate-900 hover:text-emerald-950" : "ring-1 ring-white/20 text-white hover:text-white"
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet (independent of header scroll) */}
      <div
        className={cx(
          "md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out",
          open ? "max-h-[calc(100dvh-5.5rem)]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4">
          <nav className="grid gap-2 rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 p-2">
            {/* Mobile: header area */}
            {!isInitialized || !isLoggedIn || !user ? null : (
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={avatarFromUser(user) || "/profile-pic.jpg"}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{fullName(user)}</span>
                    <span className="text-xs text-slate-500">{user.username}</span>
                  </div>
                </div>
                <NotificationsButton solid={true} />
              </div>
            )}

            {/* Mobile: nav links */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm transition-colors",
                  isExact(pathname, item.href) ? "bg-white text-emerald-950" : "text-slate-600 hover:bg-white/70 hover:text-emerald-950"
                )}
                aria-current={isExact(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile: auth buttons */}
            {!isInitialized || isLoggedIn ? null : (
              <AuthButtons layout="grid" onItemClick={() => setOpen(false)} solid={true} />
            )}

            {/* Mobile: user actions */}
            {!isInitialized || !isLoggedIn || !user ? null : (
              <div className="grid gap-1 rounded-xl bg-white/70 p-2">
                <MenuLink href="/userProfile" onSelect={() => setOpen(false)}>
                  <UserRound className="h-4 w-4" />
                  Profile
                </MenuLink>
                <MenuLink href="/settings" onSelect={() => setOpen(false)}>
                  <Settings className="h-4 w-4" />
                  Settings
                </MenuLink>
                <MenuButton
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </MenuButton>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

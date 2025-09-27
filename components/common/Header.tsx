"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
  Users,
  LayoutDashboard,
  Shield,
  Settings,
  GaugeCircle,
  Wrench,
  Activity,
  PlusCircle
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import type { loggedInUser } from "@/types/user/types";

type Role = "USER" | "ADMIN" | "SENSOR_ADMIN";
type NavItem = { href: string; label: string };

type DropdownItem =
  | { label: string; href: string; icon: React.ReactNode }
  | { label: string; action: "signout"; icon: React.ReactNode };

// Top navigation items
const NAV_CONFIG: Record<"COMMON" | Role, NavItem[]> = {
  COMMON: [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/sensors", label: "Sensors" },
    { href: "/analytics", label: "Analytics" },
  ],
  USER: [
    { href: "/create-request", label: "Request Sensor" },
  ],
  SENSOR_ADMIN: [
    { href: "/sensor-admin/overview", label: "Sensor Admin" },
    { href: "/sensor-admin/queue", label: "Pending Queue" },
  ],
  ADMIN: [
    { href: "/admin", label: "Admin" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
  ],
};

// Dropdown (user menu) items per role
const DROPDOWN_CONFIG: Record<Role, DropdownItem[]> = {
  USER: [
    { label: "Profile", href: "/profile", icon: <UserRound className="h-4 w-4" /> },
    { label: "My Requests", href: "/my-requests", icon: <Users className="h-4 w-4" /> },
    { label: "Create Request", href: "/create-request", icon: <PlusCircle className="h-4 w-4" /> },
    { label: "Sign out", action: "signout", icon: <LogOut className="h-4 w-4" /> },
  ],
  SENSOR_ADMIN: [
    { label: "Profile", href: "/profile", icon: <UserRound className="h-4 w-4" /> },
    { label: "Sensor Overview", href: "/sensor-admin/overview", icon: <GaugeCircle className="h-4 w-4" /> },
    { label: "Manage Sensors", href: "/sensor-admin/manage", icon: <Wrench className="h-4 w-4" /> },
    { label: "Activity Log", href: "/sensor-admin/activity", icon: <Activity className="h-4 w-4" /> },
    { label: "Sign out", action: "signout", icon: <LogOut className="h-4 w-4" /> },
  ],
  ADMIN: [
    { label: "Admin Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "User Management", href: "/admin/users", icon: <Shield className="h-4 w-4" /> },
    { label: "System Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
    { label: "Profile", href: "/profile", icon: <UserRound className="h-4 w-4" /> },
    { label: "Sign out", action: "signout", icon: <LogOut className="h-4 w-4" /> },
  ],
};

/* =========================================================
   UTILS
   ========================================================= */

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

type Avatarish = {
  avatarUrl?: string | null;
  image?: string | null;
  avatar?: string | null;
  photoURL?: string | null;
};
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

function DropdownList({
  items,
  onAction,
  onNavigate,
}: {
  items: DropdownItem[];
  onAction: (action: string) => void;
  onNavigate: () => void;
}) {
  return (
    <>
      {items.map((it, i) => {
        if ("href" in it) {
          return (
            <Link
              key={i}
              href={it.href}
              onClick={onNavigate}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {it.icon}
              {it.label}
            </Link>
          );
        }
        return (
          <button
            key={i}
            onClick={() => onAction(it.action)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </>
  );
}

function UserMenu({
  user,
  solid,
  onSignOut,
  items,
}: {
  user: loggedInUser;
  solid: boolean;
  onSignOut: () => void;
  items: DropdownItem[];
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

  function handleAction(action: string) {
    if (action === "signout") {
      setOpen(false);
      onSignOut();
    }
  }

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
              "text-sm font-medium flex items-center gap-1",
              solid ? "text-slate-900 group-hover:text-emerald-950" : "text-white group-hover:text-white"
            )}
          >
            {fullName(user)}
            {user.role && (
              <span
                className={cx(
                  "text-[10px] font-semibold tracking-wide rounded px-1 py-0.5 border",
                  solid
                    ? "border-lime-600/30 text-lime-700 bg-lime-100/70"
                    : "border-white/30 text-white/80 bg-white/10"
                )}
              >
                {user.role}
              </span>
            )}
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
            "absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg",
            solid ? "border-slate-100" : "border-white/20"
          )}
        >
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/60">
            <p className="text-xs font-semibold text-slate-500">Signed in as</p>
            <p className="text-sm font-medium text-slate-800 break-all">{user.username}</p>
          </div>
          <DropdownList
            items={items}
            onAction={handleAction}
            onNavigate={() => setOpen(false)}
          />
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

  // Scroll effect
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sign out
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

  // CHANGE: Keep transparent only on home ("/") at top; solid everywhere else for better readability
  const solid = pathname !== "/" || scrolled;

  // Determine role and build menus
  const role: Role | undefined = (user?.role as Role) || undefined;

  const navItems: NavItem[] = React.useMemo(() => {
    const aggregated = [
      ...NAV_CONFIG.COMMON,
      ...(role ? NAV_CONFIG[role] : []),
    ];
    const seen = new Set<string>();
    return aggregated.filter((i) => {
      if (seen.has(i.href)) return false;
      seen.add(i.href);
      return true;
    });
  }, [role]);

  const dropdownItems: DropdownItem[] = React.useMemo(() => {
    if (!role) return DROPDOWN_CONFIG.USER; // Fallback if role missing
    return DROPDOWN_CONFIG[role];
  }, [role]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-2000 w-full transition-colors",
        solid
          ? "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-xl"
          : "bg-transparent"
      )}
    >
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
                <UserMenu
                  user={user}
                  solid={solid}
                  onSignOut={handleSignOut}
                  items={dropdownItems}
                />
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

      {/* Mobile sheet */}
      <div
        className={cx(
          "md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out",
          open ? "max-h-[calc(100dvh-5.5rem)]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4">
          <nav className="grid gap-2 rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 p-2">
            {/* Mobile header user block */}
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
                    <span className="text-xs text-slate-500">
                      {user.username}{user.role ? ` • ${user.role}` : ""}
                    </span>
                  </div>
                </div>
                <NotificationsButton solid={true} />
              </div>
            )}

            {/* Mobile nav items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm transition-colors",
                  isExact(pathname, item.href)
                    ? "bg-white text-emerald-950"
                    : "text-slate-600 hover:bg-white/70 hover:text-emerald-950"
                )}
                aria-current={isExact(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile auth */}
            {!isInitialized || isLoggedIn ? null : (
              <AuthButtons layout="grid" onItemClick={() => setOpen(false)} solid={true} />
            )}

            {/* Mobile dropdown action list */}
            {!isInitialized || !isLoggedIn || !user ? null : (
              <div className="grid gap-1 rounded-xl bg-white/70 p-2">
                <DropdownList
                  items={dropdownItems}
                  onAction={(a) => {
                    if (a === "signout") {
                      setOpen(false);
                      handleSignOut();
                    }
                  }}
                  onNavigate={() => setOpen(false)}
                />
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

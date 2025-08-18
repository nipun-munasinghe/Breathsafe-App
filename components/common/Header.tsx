
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    Menu,
    X,
    Bell,
    ChevronDown,
    LogOut,
    UserRound,
    Settings,
} from "lucide-react";

// Types & Constants
type NavItem = { href: string; label: string };
type UserInfo = { name: string; avatar?: string | null };

const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/sensors", label: "Sensors" },
    { href: "/analytics", label: "Analytics" },
    { href: "/support", label: "Support" },
];

// Small utilities
function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function isExact(pathname: string, href: string) {
    return pathname === href;
}

// Reusable bits
function NotificationsButton() {
    return (
        <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/5 text-slate-900 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
            <Bell className="h-5 w-5" />
            {/* Example unread badge */}
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
    );
}

function AvatarImg({ src, alt }: { src?: string | null; alt: string }) {
    const getAvatarSrc = (s?: string | null) => s || "/profile-pic.jpg";

    return (
        <Image
            src={getAvatarSrc(src)}
            alt={alt}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5"
            onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith("/profile-pic.jpg")) {
                    target.src = "/profile-pic.jpg";
                }
            }}
        />
    );
}

function AuthButtons({
    layout = "inline",
    onItemClick,
}: {
    layout?: "inline" | "grid";
    onItemClick?: () => void;
}) {
    const baseLink =
        "rounded-xl px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";
    return (
        <div
            className={cx(
                layout === "grid"
                    ? "grid grid-cols-2 gap-2"
                    : "flex items-center gap-3"
            )}
        >
            <Link
                href="/auth/login"
                onClick={onItemClick}
                className={cx(
                    baseLink,
                    "border border-slate-200 text-center font-medium text-slate-600 hover:text-emerald-950 hover:border-emerald-950"
                )}
            >
                Sign in
            </Link>
            <Link
                href="/auth/register"
                onClick={onItemClick}
                className={cx(
                    baseLink,
                    "bg-lime-600 text-center font-semibold text-white hover:bg-emerald-950"
                )}
            >
                Create account
            </Link>
        </div>
    );
}

function UserQuickActions({ user }: { user: UserInfo }) {
    return (
        <div className="flex items-center gap-2">
            <NotificationsButton />
            <UserMenu user={user} />
        </div>
    );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
    return (
        <Link
            href={item.href}
            className={cx(
                "rounded px-1.5 py-1 text-sm font-normal transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                active ? "text-emerald-950" : "text-slate-500 hover:text-emerald-950"
            )}
            aria-current={active ? "page" : undefined}
        >
            {item.label}
        </Link>
    );
}

function UserMenu({ user }: { user: UserInfo }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
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
                className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 ring-1 ring-black/5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
                <span className="flex items-center gap-2">
                    <AvatarImg src={user.avatar} alt="Profile" />
                    <span className="text-sm font-medium text-slate-900 group-hover:text-emerald-950">
                        {user.name}
                    </span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-emerald-950" />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg"
                >
                    <MenuLink href="/profile" onSelect={() => setOpen(false)}>
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
                            const event = new CustomEvent("app:signout");
                            window.dispatchEvent(event);
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

function MenuButton({
    onClick,
    children,
}: {
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

// Main Component
export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);

    // Replace with auth integration
    const [user, setUser] = React.useState<UserInfo | null>({
        name: "Anupa",
        avatar: "",
    });

    // Sign out listener
    React.useEffect(() => {
        function onSignOut() {
            setUser(null);
        }
        window.addEventListener("app:signout", onSignOut);
        return () => window.removeEventListener("app:signout", onSignOut);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-xl">
            {/* Outer container */}
            <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="group inline-flex items-center gap-2">
                        <span className="inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-100 to-orange-100 ring-1 ring-black/5">
                            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                                <path
                                    d="M5 12c0-3.866 3.134-7 7-7a7 7 0 0 1 0 14h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3.25a.75.75 0 0 0-1.5 0V18A2 2 0 0 1 5 20"
                                    fill="currentColor"
                                    className="text-lime-600"
                                />
                            </svg>
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Breath<span className="text-lime-600">Safe</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.href}
                                item={item}
                                active={isExact(pathname, item.href)}
                            />
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {!user ? <AuthButtons /> : <UserQuickActions user={user} />}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        aria-label="Toggle Menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-black/5 text-slate-900 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:hidden"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile sheet */}
            <div
                className={cx(
                    "md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out",
                    open ? "max-h-[calc(100dvh-5.5rem]" : "max-h-0"
                )}
            >
                <div className="px-3 sm:px-6 lg:px-8 pb-4">
                    <nav className="grid gap-2 rounded-2xl bg-gradient-to-br from-green-100 to-orange-100 p-2">
                        {/* Mobile: header area */}
                        {!user ? null : (
                            <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={user.avatar || "/profile-pic.jpg"}
                                        alt="Profile"
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900">{user.name}</span>
                                        <span className="text-xs text-slate-500">Online</span>
                                    </div>
                                </div>
                                <NotificationsButton />
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
                                    isExact(pathname, item.href)
                                        ? "bg-white text-emerald-950"
                                        : "text-slate-600 hover:bg-white/70 hover:text-emerald-950"
                                )}
                                aria-current={isExact(pathname, item.href) ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile: auth buttons */}
                        {user ? null : (
                            <AuthButtons layout="grid" onItemClick={() => setOpen(false)} />
                        )}

                        {/* Mobile: user actions */}
                        {user ? (
                            <div className="grid gap-1 rounded-xl bg-white/70 p-2">
                                <MenuLink href="/profile" onSelect={() => setOpen(false)}>
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
                                        const event = new CustomEvent("app:signout");
                                        window.dispatchEvent(event);
                                    }}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </MenuButton>
                            </div>
                        ) : null}
                    </nav>
                </div>
            </div>
        </header>
    );
}

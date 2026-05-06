"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

interface AdminShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { number: "01", label: "Dashboard", href: "/admin" },
  { number: "02", label: "Products", href: "/admin/products" },
  { number: "03", label: "Collections", href: "/admin/collections" },
  { number: "04", label: "Orders", href: "/admin/orders" },
];

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrating, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isHydrating) return;
    if (!user) {
      router.replace("/account?next=/admin");
      return;
    }
    if (!user.isAdmin) {
      router.replace("/");
    }
  }, [isHydrating, user, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  if (isHydrating) {
    return <BootScreen text="resolving_session" />;
  }

  if (!user || !user.isAdmin) {
    return <BootScreen text="access_denied // redirecting" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <ScanlinesAndNoise />

      <div className="relative z-10 flex flex-col md:grid md:grid-cols-[260px_1fr] md:min-h-screen">
        <MobileBar
          onToggle={() => setDrawerOpen((v) => !v)}
          drawerOpen={drawerOpen}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[280px] md:w-auto md:static md:translate-x-0 transform transition-transform duration-300 ease-out bg-[#0a0a0a] border-r border-white/8 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar
            pathname={pathname}
            userEmail={user.email}
            onLogout={logout}
          />
        </aside>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 pt-[60px] md:pt-0">{children}</main>
      </div>
    </div>
  );
}

function ScanlinesAndNoise() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
    </>
  );
}

function MobileBar({
  onToggle,
  drawerOpen,
}: {
  onToggle: () => void;
  drawerOpen: boolean;
}) {
  return (
    <header className="fixed top-0 inset-x-0 h-[60px] z-50 md:hidden bg-[#0a0a0a]/90 backdrop-blur border-b border-white/8 flex items-center justify-between px-5">
      <Link href="/admin" className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan">
          ctl/
        </span>
        <span className="font-display text-lg tracking-tight">Console</span>
      </Link>
      <button
        onClick={onToggle}
        className="w-10 h-10 -mr-2 flex items-center justify-center text-white/80"
        aria-label="Toggle admin menu"
      >
        <div className="relative w-[18px] h-[14px]">
          <span
            className={`absolute left-0 w-full h-[1.5px] bg-white transition-all duration-300 ease-in-out origin-center ${
              drawerOpen ? "top-[6px] rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-[6px] w-full h-[1.5px] bg-white transition-all duration-200 ${
              drawerOpen ? "opacity-0 scale-x-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 w-full h-[1.5px] bg-white transition-all duration-300 ease-in-out origin-center ${
              drawerOpen ? "top-[6px] -rotate-45" : "top-[12px]"
            }`}
          />
        </div>
      </button>
    </header>
  );
}

function Sidebar({
  pathname,
  userEmail,
  onLogout,
}: {
  pathname: string;
  userEmail: string;
  onLogout: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col h-full px-6 py-8 gap-10 relative">
      <Link
        href="/admin"
        className="group block"
        aria-label="Admin home"
      >
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block">
          ctl_terminal // v0_1
        </span>
        <span className="font-display text-2xl tracking-tight leading-none mt-1.5 block group-hover:text-glitch-cyan transition-colors">
          Console
        </span>
        <span className="font-mono text-[10px] tracking-wider text-white/30 block mt-2">
          replace_me_gently / inventory_ops
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">
          channels /
        </span>
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-baseline gap-3 py-3 pl-3 pr-2 border-l-2 transition-colors duration-150 ${
                active
                  ? "border-glitch-cyan text-glitch-cyan bg-glitch-cyan/[0.04]"
                  : "border-transparent text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              <span
                className={`font-mono text-[10px] tracking-wider ${
                  active ? "text-glitch-cyan" : "text-white/30"
                }`}
              >
                {item.number}
              </span>
              <span className="font-display text-[18px] tracking-tight leading-none">
                {item.label}
              </span>
              {active && (
                <span
                  aria-hidden
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-glitch-cyan animate-pulse"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="space-y-3 border-t border-white/8 pt-6">
        <div className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
          operator
        </div>
        <div className="font-mono text-[11px] text-white/80 truncate" title={userEmail}>
          {userEmail}
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse"
          />
          <span className="font-mono text-[10px] tracking-wider text-white/30">
            status: operational
          </span>
        </div>

        <div className="flex flex-col gap-1.5 pt-2">
          <Link
            href="/"
            className="font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-cyan transition-colors"
          >
            ← exit_to_storefront
          </Link>
          <button
            onClick={() => onLogout()}
            className="text-left font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-red transition-colors"
          >
            sign_out
          </button>
        </div>
      </div>
    </div>
  );
}

function BootScreen({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="text-center space-y-3">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-glitch-cyan/70 block">
          ctl_terminal
        </span>
        <span className="font-display text-2xl tracking-tight block">
          Authenticating
        </span>
        <span className="font-mono text-[11px] tracking-wider text-white/40 block">
          {text}
        </span>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse [animation-delay:200ms]" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}

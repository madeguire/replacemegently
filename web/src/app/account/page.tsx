"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageView from "@/components/PageView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrambleText from "@/components/ScrambleText";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "register";

export default function AccountPage() {
  const { user, isHydrating, isSubmitting, error, login, register, logout, clearError } =
    useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearError();
  }, [mode, clearError]);

  const minPasswordOk = password.length >= 8;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        if (!minPasswordOk) return;
        await register(email.trim(), password, fullName.trim() || undefined);
      }
      setPassword("");
    } catch {
      // error is exposed via the context
    }
  }

  return (
    <>
      <PageView page="account" />
      <Header />
      <main className="flex-1">
        {user ? (
          <Dashboard
            user={user}
            onLogout={logout}
            isLoggingOut={isSubmitting}
          />
        ) : (
          <AuthForm
            mode={mode}
            setMode={setMode}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            isHydrating={isHydrating}
            error={error}
            minPasswordOk={minPasswordOk}
            onSubmit={onSubmit}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

interface AuthFormProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isSubmitting: boolean;
  isHydrating: boolean;
  error: string | null;
  minPasswordOk: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function AuthForm({
  mode,
  setMode,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  isHydrating,
  error,
  minPasswordOk,
  onSubmit,
}: AuthFormProps) {
  return (
    <>
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            animation: "hero-scanline-drift 0.4s linear infinite",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
            identity_verification
          </span>
          <h1
            className="font-display text-4xl md:text-5xl text-white tracking-tight"
            style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
          >
            {mode === "login" ? "Prove You're Human" : "Register as Human"}
          </h1>
          <p className="font-mono text-[11px] tracking-wider text-white/40 mt-3">
            {mode === "login"
              ? "// re-enter the archive"
              : "// new entry in the human registry"}
          </p>
        </div>
      </section>

      <section className="max-w-md mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center gap-1 mb-10 border border-border p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 font-mono text-[11px] tracking-wider py-2.5 transition-all duration-200 ${
              mode === "login"
                ? "bg-foreground text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 font-mono text-[11px] tracking-wider py-2.5 transition-all duration-200 ${
              mode === "register"
                ? "bg-foreground text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {mode === "register" && (
            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                Full Name
                <span className="ml-2 text-muted/40 normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your actual human name"
                autoComplete="name"
                className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
              />
            </div>
          )}

          <div>
            <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@still-employed.com"
              autoComplete="email"
              className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                Password
              </label>
              {mode === "register" && password.length > 0 && (
                <span
                  className={`font-mono text-[9px] tracking-wider ${
                    minPasswordOk ? "text-glitch-cyan-on-light" : "text-glitch-red"
                  }`}
                >
                  {minPasswordOk ? "ok" : `${password.length}/8 chars`}
                </span>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register"
                  ? "8+ chars a machine can't guess"
                  : "Something a machine can't guess"
              }
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
            />
          </div>

          {mode === "register" && (
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="human-check"
                required
                className="mt-1 accent-[#0e7c7b]"
              />
              <label
                htmlFor="human-check"
                className="font-body text-xs text-muted leading-relaxed"
              >
                I confirm I am a biological human being and not a large language
                model pretending to shop.
              </label>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="relative border border-glitch-red/30 bg-glitch-red/5 px-4 py-3"
            >
              <span className="absolute -top-2 left-3 px-2 bg-background font-mono text-[9px] tracking-[0.25em] uppercase text-glitch-red">
                error
              </span>
              <p className="font-mono text-[11px] text-foreground/80 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isHydrating ||
              !email.trim() ||
              !password ||
              (mode === "register" && !minPasswordOk)
            }
            className="w-full bg-[#0a0a0a] text-white font-body text-[14px] font-semibold py-4 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0a0a0a]"
          >
            {isSubmitting ? (
              <span className="font-mono text-[12px] tracking-[0.25em] uppercase text-white/70">
                transmitting<DotPulse />
              </span>
            ) : (
              <ScrambleText
                text={mode === "login" ? "Verify Identity" : "Create Account"}
                duration={800}
              />
            )}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-3">
          <span className="block flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted/50">
            transcript
          </span>
          <span className="block flex-1 h-px bg-border" />
        </div>

        <p className="font-mono text-[10px] text-muted/50 tracking-wider text-center mt-5 leading-relaxed">
          {mode === "login" ? (
            <>
              No account yet?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-glitch-cyan-on-light hover:underline underline-offset-2"
              >
                file a registration
              </button>
            </>
          ) : (
            <>
              Already in the archive?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-glitch-cyan-on-light hover:underline underline-offset-2"
              >
                log back in
              </button>
            </>
          )}
        </p>
        <p className="font-mono text-[9px] text-muted/40 tracking-wider text-center mt-4">
          Your data is stored on human-operated servers. Probably.
        </p>
      </section>
    </>
  );
}

interface DashboardProps {
  user: { id: number; email: string; fullName: string | null; createdAt: string };
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

function Dashboard({ user, onLogout, isLoggingOut }: DashboardProps) {
  const created = useMemo(() => new Date(user.createdAt), [user.createdAt]);
  const memberSince = useMemo(
    () =>
      created.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [created],
  );
  const [memberDays, setMemberDays] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const days = Math.max(
        0,
        Math.floor((Date.now() - created.getTime()) / 86_400_000),
      );
      setMemberDays(days);
    };
    const initialId = window.setTimeout(tick, 0);
    const intervalId = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
  }, [created]);
  const initials = useMemo(() => makeInitials(user.fullName, user.email), [user]);
  const greetingName = user.fullName?.trim() || user.email.split("@")[0];
  const idTag = useMemo(() => `HUM-${String(user.id).padStart(6, "0")}`, [user.id]);

  return (
    <>
      {/* Dossier hero */}
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            animation: "hero-scanline-drift 0.4s linear infinite",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Telemetry strip */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 pt-5 pb-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-glitch-cyan/60 font-mono text-[9px] tracking-[0.25em] uppercase">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
            link.live
          </span>
          <span>session.persistent</span>
          <span>verified.human</span>
          <span className="ml-auto opacity-60">
            t+{(memberDays ?? 0).toString().padStart(4, "0")}d
          </span>
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 pb-20 pt-8 md:pt-12 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-end">
          {/* ID badge */}
          <div className="relative">
            <div className="relative w-32 h-32 md:w-40 md:h-40 border border-glitch-cyan/40 bg-black/40 flex items-center justify-center overflow-hidden">
              <span
                className="font-display text-5xl md:text-6xl text-white tracking-tight"
                style={{ animation: "hero-glitch-text 6s ease-in-out infinite" }}
              >
                {initials}
              </span>
              {/* corner ticks */}
              <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-glitch-cyan/70" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-glitch-cyan/70" />
              <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-glitch-cyan/70" />
              <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-glitch-cyan/70" />
            </div>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 bg-[#0a0a0a] font-mono text-[9px] tracking-[0.3em] text-glitch-cyan/80 uppercase whitespace-nowrap">
              {idTag}
            </span>
          </div>

          {/* Greeting */}
          <div className="min-w-0">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              re-entry_acknowledged
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight leading-[0.95] truncate"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Welcome back, {greetingName}
            </h1>
            <p className="font-mono text-[11px] tracking-wider text-white/40 mt-4">
              {"// your shelf in the archive is intact"}
            </p>
          </div>
        </div>
      </section>

      {/* Dossier grid */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-12 md:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12">
        {/* Left: dossier card */}
        <div className="relative border border-border bg-background p-7 md:p-9">
          <span className="absolute -top-2 left-6 px-2 bg-background font-mono text-[9px] tracking-[0.3em] uppercase text-glitch-cyan-on-light">
            dossier_open
          </span>
          <span className="absolute top-1.5 right-3 font-mono text-[9px] tracking-[0.3em] uppercase text-muted/40">
            file_01
          </span>

          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-foreground">
            Account record
          </h2>
          <p className="font-mono text-[11px] text-muted mt-2">
            Filed by a human. Verified by paranoia.
          </p>

          <dl className="mt-8 divide-y divide-border">
            <DossierRow
              label="full_name"
              value={user.fullName ?? "— unspecified —"}
              dim={!user.fullName}
            />
            <DossierRow label="email" value={user.email} mono />
            <DossierRow label="member_since" value={memberSince} />
            <DossierRow
              label="duration"
              value={
                memberDays === null
                  ? "calculating…"
                  : `${memberDays} day${memberDays === 1 ? "" : "s"} on file`
              }
              dim={memberDays === null}
            />
            <DossierRow label="status" value="active // human-verified" />
          </dl>
        </div>

        {/* Right: actions stack */}
        <div className="space-y-6">
          <ActionCard
            tag="archive_actions"
            title="Browse the shelf"
            body="Continue rummaging through the human-made objects."
            href="/shop"
            cta="Open shop"
          />
          <ActionCard
            tag="cargo_manifest"
            title="Cart inventory"
            body="Items waiting to be shipped by an actual person."
            href="/cart"
            cta="View cart"
          />
          <button
            type="button"
            onClick={() => {
              void onLogout();
            }}
            disabled={isLoggingOut}
            className="group relative w-full border border-border hover:border-glitch-red/60 transition-colors p-6 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute -top-2 left-4 px-2 bg-background font-mono text-[9px] tracking-[0.3em] uppercase text-glitch-red/80">
              session_close
            </span>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl tracking-tight text-foreground">
                  Sign out
                </h3>
                <p className="font-mono text-[11px] text-muted mt-1">
                  Erase the session cookie. Stay analog for a while.
                </p>
              </div>
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted group-hover:text-glitch-red transition-colors">
                {isLoggingOut ? "ending…" : "end →"}
              </span>
            </div>
          </button>
        </div>
      </section>
    </>
  );
}

function DossierRow({
  label,
  value,
  mono,
  dim,
}: {
  label: string;
  value: string;
  mono?: boolean;
  dim?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-6 py-3.5 items-baseline">
      <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
        {label}
      </dt>
      <dd
        className={`${mono ? "font-mono text-sm" : "font-body text-base"} ${
          dim ? "text-muted/60 italic" : "text-foreground"
        } break-words`}
      >
        {value}
      </dd>
    </div>
  );
}

function ActionCard({
  tag,
  title,
  body,
  href,
  cta,
}: {
  tag: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block border border-border hover:border-glitch-cyan-on-light/60 transition-colors p-6"
    >
      <span className="absolute -top-2 left-4 px-2 bg-background font-mono text-[9px] tracking-[0.3em] uppercase text-glitch-cyan-on-light">
        {tag}
      </span>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl tracking-tight text-foreground">
            {title}
          </h3>
          <p className="font-mono text-[11px] text-muted mt-1">{body}</p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted group-hover:text-glitch-cyan-on-light transition-colors">
          {cta} →
        </span>
      </div>
    </Link>
  );
}

function DotPulse() {
  return (
    <span className="inline-flex w-6 ml-1 align-baseline">
      <span className="animate-pulse">.</span>
      <span className="animate-pulse" style={{ animationDelay: "120ms" }}>
        .
      </span>
      <span className="animate-pulse" style={{ animationDelay: "240ms" }}>
        .
      </span>
    </span>
  );
}

function makeInitials(fullName: string | null, email: string): string {
  const name = fullName?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  const local = email.split("@")[0] ?? "";
  if (!local) return "??";
  return local.slice(0, 2).toUpperCase();
}

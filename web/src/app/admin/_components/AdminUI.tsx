"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { OrderStatus } from "@/lib/admin-api";

// ── Page header ──────────────────────────────────────────────────────────────

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-white/8 pb-6 mb-8 relative">
      <div
        aria-hidden
        className="absolute -bottom-px left-0 w-24 h-px bg-glitch-cyan"
        style={{ animation: "hero-corruption-1 8s step-end infinite" }}
      />
      <div className="space-y-2 max-w-2xl">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/80 block">
          {eyebrow}
        </span>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="font-mono text-[11px] tracking-wider text-white/50 max-w-xl pt-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

// ── Page container ───────────────────────────────────────────────────────────

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="px-6 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
      {children}
    </div>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const baseBtn =
  "inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 border transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-glitch-cyan text-[#0a0a0a] border-glitch-cyan hover:bg-white hover:border-white"
      : variant === "secondary"
        ? "bg-transparent text-white/80 border-white/20 hover:border-white hover:text-white"
        : variant === "danger"
          ? "bg-transparent text-glitch-red border-glitch-red/40 hover:bg-glitch-red/10 hover:border-glitch-red"
          : "bg-transparent text-white/60 border-transparent hover:text-white";
  return (
    <button {...props} className={`${baseBtn} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: LinkButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-glitch-cyan text-[#0a0a0a] border-glitch-cyan hover:bg-white hover:border-white"
      : variant === "secondary"
        ? "bg-transparent text-white/80 border-white/20 hover:border-white hover:text-white"
        : variant === "danger"
          ? "bg-transparent text-glitch-red border-glitch-red/40 hover:bg-glitch-red/10 hover:border-glitch-red"
          : "bg-transparent text-white/60 border-transparent hover:text-white";
  return (
    <Link href={href} className={`${baseBtn} ${variantClass} ${className}`}>
      {children}
    </Link>
  );
}

// ── Form inputs ──────────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-white/5 border border-white/12 px-4 py-3 font-mono text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-glitch-cyan focus:bg-white/8 transition-colors";

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, required, error, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 flex items-center gap-2">
        {label}
        {required && <span className="text-glitch-cyan/80">*</span>}
        {hint && (
          <span className="text-white/25 normal-case tracking-wider text-[10px]">
            {`// ${hint}`}
          </span>
        )}
      </span>
      {children}
      {error && (
        <span className="font-mono text-[10px] tracking-wider text-glitch-red block pt-1">
          err: {error}
        </span>
      )}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[88px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={`${inputClass} appearance-none pr-10 ${props.className ?? ""}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300fff0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "14px",
      }}
    />
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-white/30 text-white/60 bg-white/5",
  processing:
    "border-glitch-cyan/60 text-glitch-cyan bg-glitch-cyan/[0.06]",
  shipped: "border-white/60 text-white bg-white/[0.08]",
  delivered:
    "border-glitch-cyan/30 text-glitch-cyan/70 bg-glitch-cyan/[0.04]",
  cancelled:
    "border-glitch-red/40 text-glitch-red/80 bg-glitch-red/[0.05]",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 border font-mono text-[10px] tracking-[0.18em] uppercase ${STATUS_STYLES[status]} ${className}`}
    >
      <span
        aria-hidden
        className="inline-block w-1 h-1 rounded-full bg-current"
      />
      {status}
    </span>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-white/8 border-dashed py-20 px-6 text-center space-y-4">
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/60 block">
        no_signal
      </span>
      <p className="font-display text-2xl tracking-tight">{title}</p>
      <p className="font-mono text-[11px] text-white/40 max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-white/8 bg-white/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}

// ── Inline error / banner ────────────────────────────────────────────────────

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="border border-glitch-red/40 bg-glitch-red/[0.05] text-glitch-red font-mono text-[11px] tracking-wider px-4 py-3 flex items-start gap-3">
      <span className="text-glitch-red/80 shrink-0">err //</span>
      <span className="text-white/80">{message}</span>
    </div>
  );
}

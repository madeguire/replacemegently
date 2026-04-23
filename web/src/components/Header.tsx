"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrambleText from "./ScrambleText";
import { useCart } from "@/context/CartContext";

const navItems = ["Shop", "Collections", "About", "Journal"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, justAdded } = useCart();
  const [glitchKey, setGlitchKey] = useState(0);

  useEffect(() => {
    if (justAdded) setGlitchKey((k) => k + 1);
  }, [justAdded]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-[60] border-b transition-colors duration-300 ${
          mobileOpen
            ? "bg-transparent border-transparent"
            : "bg-white border-border"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/human-logo.png"
                alt="Human™"
                width={140}
                height={36}
                className={`object-contain h-auto transition-all duration-300 ${mobileOpen ? "invert" : ""}`}
                priority
              />
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="font-mono text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  <ScrambleText text={item} duration={800} />
                </Link>
              ))}
            </nav>

            {/* Right actions with icons */}
            <div className="hidden md:flex items-center gap-5">
              <Link href="/search" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Link>
              <Link href="/account" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </Link>

              {/* Cart icon with glitch badge */}
              <Link
                href="/cart"
                className="relative group text-foreground/60 hover:text-foreground transition-colors"
                aria-label={`Cart with ${totalItems} items`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={justAdded ? "cart-icon-glitching" : ""}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span
                    key={glitchKey}
                    className="cart-glitch-badge absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center bg-[#0a0a0a] text-glitch-cyan font-mono text-[10px] font-bold leading-none px-1 border border-glitch-cyan/30"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: cart + toggle */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile cart icon */}
              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center"
                aria-label={`Cart with ${totalItems} items`}
                onClick={() => setMobileOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${mobileOpen ? "text-white/70" : "text-foreground/60"} ${justAdded ? "cart-icon-glitching" : ""}`}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span
                    key={glitchKey}
                    className="cart-glitch-badge absolute top-0.5 right-0 min-w-[16px] h-[16px] flex items-center justify-center bg-[#0a0a0a] text-glitch-cyan font-mono text-[9px] font-bold leading-none px-0.5 border border-glitch-cyan/30"
                  >
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center -mr-2"
                aria-label="Toggle menu"
              >
                <div className="relative w-[18px] h-[14px]">
                  <span
                    className={`absolute left-0 w-full h-[1.5px] transition-all duration-300 ease-in-out origin-center ${
                      mobileOpen
                        ? "bg-white top-[6px] rotate-45"
                        : "bg-foreground top-0 rotate-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[6px] w-full h-[1.5px] transition-all duration-200 ease-in-out ${
                      mobileOpen
                        ? "bg-white opacity-0 scale-x-0"
                        : "bg-foreground opacity-100 scale-x-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 w-full h-[1.5px] transition-all duration-300 ease-in-out origin-center ${
                      mobileOpen
                        ? "bg-white top-[6px] -rotate-45"
                        : "bg-foreground top-[12px] rotate-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-[#0a0a0a] transition-all duration-500 ease-in-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scan lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
            animation: "hero-scanline-drift 0.4s linear infinite",
          }}
        />

        {/* Noise */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            animation: "hero-noise-drift 0.5s steps(3) infinite",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full pt-[100px] pb-10 px-8">
          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item, i) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="group block"
                style={{
                  transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: mobileOpen ? 1 : 0,
                  transition: `transform 0.4s ease ${i * 0.07 + 0.15}s, opacity 0.4s ease ${i * 0.07 + 0.15}s`,
                }}
              >
                <div className="flex items-baseline gap-4 py-4 border-b border-white/8">
                  <span className="font-mono text-[10px] text-glitch-cyan/40 tracking-wider">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[32px] text-white/90 tracking-tight leading-none group-hover:text-glitch-cyan transition-colors duration-200">
                    {item}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div
            className="space-y-6"
            style={{
              transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
              opacity: mobileOpen ? 1 : 0,
              transition: "transform 0.4s ease 0.5s, opacity 0.4s ease 0.5s",
            }}
          >
            <div className="flex items-center gap-6">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[11px] text-white/40 tracking-wider hover:text-glitch-cyan transition-colors"
              >
                Search
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[11px] text-white/40 tracking-wider hover:text-glitch-cyan transition-colors"
              >
                Account
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[11px] text-white/60 tracking-wider hover:text-glitch-cyan transition-colors"
              >
                Cart{totalItems > 0 ? ` (${totalItems})` : ""}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
              <span className="font-mono text-[10px] text-white/20 tracking-wider">
                status: operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

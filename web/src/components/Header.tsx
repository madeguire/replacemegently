"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrambleText from "./ScrambleText";

const navItems = ["Shop", "Collections", "About", "Journal"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/human-logo.png"
              alt="Human™"
              width={140}
              height={36}
              className="object-contain h-auto"
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
            {/* Search */}
            <Link href="/search" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
            {/* Account */}
            <Link href="/account" className="text-foreground/60 hover:text-foreground transition-colors" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </Link>
            {/* Cart */}
            <Link
              href="/cart"
              className="font-body text-[14px] font-semibold text-foreground hover:text-foreground/70 transition-colors ml-1"
            >
              Cart (0)
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-px bg-foreground transition-transform duration-200 ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`}
            />
            <span
              className={`w-5 h-px bg-foreground transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-5 h-px bg-foreground transition-transform duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block font-body text-base font-medium text-foreground"
              >
                {item}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link href="/search" className="block font-body text-sm text-muted">
                Search
              </Link>
              <Link href="/account" className="block font-body text-sm text-muted">
                Account
              </Link>
              <Link href="/cart" className="block font-body text-sm text-foreground font-medium">
                Cart (0)
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

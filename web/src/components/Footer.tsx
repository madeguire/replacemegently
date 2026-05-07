"use client";

import { useState } from "react";
import Link from "next/link";
import { brandCopy } from "@/data/store";
import RmgLogo from "./RmgLogo";
import ScrambleText from "./ScrambleText";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new" },
  { label: "Best Sellers", href: "/best-sellers" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Subtle scan lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
        }}
      />

      {/* Corruption accents */}
      <div
        className="pointer-events-none absolute w-16 h-1.5 bg-glitch-cyan/10"
        style={{ top: "15%", right: "10%", animation: "hero-corruption-1 8s step-end infinite" }}
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-5">
              <RmgLogo
                variant="long"
                className="block w-[160px] h-auto text-white"
              />
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed">
              Tools and objects for designers<br />coping with the age of AI.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
              <span className="font-mono text-[10px] text-white/20 tracking-wider">
                status: operational
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/50 mb-4">
              [shop]
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-glitch-cyan transition-colors"
                  >
                    <ScrambleText text={link.label} duration={600} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/50 mb-4">
              [company]
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-glitch-cyan transition-colors"
                  >
                    <ScrambleText text={link.label} duration={600} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/50 mb-4">
              [{brandCopy.newsletter.heading.toLowerCase().replace(/\s/g, "_")}]
            </h4>
            <p className="font-body text-sm text-white/40 mb-4">
              {brandCopy.newsletter.description}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@still-employed.com"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 font-mono text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-glitch-cyan/40 transition-colors"
              />
              <button
                type="submit"
                className="bg-glitch-cyan text-[#0a0a0a] font-mono text-[11px] font-semibold tracking-wider uppercase px-5 py-3 hover:bg-glitch-cyan/80 transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-white/20 tracking-wider">
            &copy; {new Date().getFullYear()} Human™. All rights reserved.
          </p>
          <p
            className="font-mono text-[10px] text-white/15 tracking-wider"
            style={{ animation: "glitch-flicker 6s step-end infinite" }}
          >
            {brandCopy.microcopy}
          </p>
        </div>
      </div>
    </footer>
  );
}

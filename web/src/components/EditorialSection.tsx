"use client";

import Link from "next/link";
import { brandCopy } from "@/data/store";
import ScrambleText from "./ScrambleText";

export default function EditorialSection() {
  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Scan lines */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          animation: "hero-scanline-drift 0.4s linear infinite",
        }}
      />

      {/* Noise grain */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          animation: "hero-noise-drift 0.5s steps(3) infinite",
        }}
      />

      {/* Corruption blocks */}
      <div
        className="pointer-events-none absolute w-20 h-2 bg-glitch-cyan/20 z-10"
        style={{ top: "20%", left: "8%", animation: "hero-corruption-1 6s step-end infinite" }}
      />
      <div
        className="pointer-events-none absolute w-12 h-3 bg-glitch-red/15 z-10"
        style={{ bottom: "25%", right: "12%", animation: "hero-corruption-2 7s step-end infinite" }}
      />

      {/* Horizontal glitch bars */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-[1px] bg-glitch-cyan/30 z-10 mix-blend-screen"
        style={{ animation: "hero-hbar 10s ease-in-out infinite" }}
      />

      <div className="relative z-20 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/60 mb-6">
            transmission_003
          </span>

          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]"
            style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
          >
            {brandCopy.editorial.headline}
          </h2>

          <p className="font-body text-base md:text-lg text-white/40 mt-6 md:mt-8 leading-relaxed max-w-xl mx-auto">
            {brandCopy.editorial.body}
          </p>

          <div className="mt-10 flex items-center justify-center gap-8">
            <Link
              href="/about"
              className="font-mono text-[12px] tracking-wider text-white/60 hover:text-glitch-cyan transition-colors border-b border-white/20 hover:border-glitch-cyan/40 pb-0.5"
            >
              <ScrambleText text="Our story" duration={800} />
            </Link>
            <span className="text-white/10">|</span>
            <Link
              href="/shop"
              className="font-mono text-[12px] tracking-wider text-white/60 hover:text-glitch-cyan transition-colors border-b border-white/20 hover:border-glitch-cyan/40 pb-0.5"
            >
              <ScrambleText text="Shop all" duration={800} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

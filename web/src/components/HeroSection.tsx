"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { brandCopy } from "@/data/store";
import StatCard from "./StatCard";

interface ScanSlide {
  image: string;
  alt: string;
  scanId: string;
  material: string;
  origin: string;
  state: string;
  mode: string;
  confidence: number;
  classification: string;
  replacementLikelihood: number;
}

const slides: ScanSlide[] = [
  {
    image: "/hero.png",
    alt: "Human™ Mug — Still manually caffeinated.",
    scanId: "001",
    material: "ceramic",
    origin: "human",
    state: "active",
    mode: "manual",
    confidence: 62,
    classification: "legacy_tool",
    replacementLikelihood: 87,
  },
  {
    image: "/product-pixels-hoodie.png",
    alt: "Human™ Hoodie — I used to move pixels.",
    scanId: "002",
    material: "cotton",
    origin: "human",
    state: "worn",
    mode: "analog",
    confidence: 73,
    classification: "wearable_artifact",
    replacementLikelihood: 73,
  },
  {
    image: "/product-water-bottle.png",
    alt: "Human™ Water Bottle — Stay hydrated. Stay replaceable.",
    scanId: "003",
    material: "steel",
    origin: "human",
    state: "hydrating",
    mode: "survival",
    confidence: 44,
    classification: "coping_device",
    replacementLikelihood: 44,
  },
];

const INTERVAL = 5000;

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [glitching, setGlitching] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (idx === active) return;
    setGlitching(true);
    setTimeout(() => {
      setActive(idx);
      setTimeout(() => setGlitching(false), 150);
    }, 150);
  }, [active]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [active, goTo]);

  const s = slides[active];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* ── Scan lines overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          animation: "hero-scanline-drift 0.4s linear infinite",
        }}
      />

      {/* ── Noise grain overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          animation: "hero-noise-drift 0.5s steps(3) infinite",
        }}
      />

      {/* ── Horizontal glitch bars ── */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-[2px] bg-glitch-cyan/60 z-30 mix-blend-screen"
        style={{ animation: "hero-hbar 8s ease-in-out infinite" }}
      />

      {/* ── Data corruption blocks ── */}
      <div
        className="pointer-events-none absolute w-24 h-3 bg-glitch-cyan/30 z-30"
        style={{ top: "18%", left: "12%", animation: "hero-corruption-1 6s step-end infinite" }}
      />
      <div
        className="pointer-events-none absolute w-8 h-4 bg-glitch-cyan/20 z-30 hidden md:block"
        style={{ bottom: "20%", left: "30%", animation: "hero-corruption-2 9s step-end infinite 1s" }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 items-stretch md:min-h-[680px]">

          {/* Left — copy */}
          <div className="relative py-10 pb-8 md:py-24 space-y-6 md:space-y-8 flex flex-col justify-center w-full max-w-[660px] md:ml-auto px-5 md:pl-10 md:pr-12">
            <div className="animate-fade-up">
              <span
                className="inline-block font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-glitch-cyan/80 border border-glitch-cyan/20 px-3 py-1.5"
                style={{ animation: "glitch-flicker 6s step-end infinite" }}
              >
                signal_detected
              </span>
            </div>

            <div className="space-y-4 md:space-y-5">
              <h1
                className="font-display text-[40px] md:text-[64px] lg:text-[80px] text-white leading-[1.05] tracking-tight animate-fade-up"
                style={{ animation: "fade-up 0.8s ease-out both, hero-glitch-text 6s ease-in-out 1s infinite" }}
              >
                Replace me<br />
                <span className="relative inline-block">
                  gently
                  <span className="text-glitch-cyan">.</span>
                </span>
              </h1>
              <p className="font-body text-sm md:text-lg text-white/50 leading-relaxed max-w-sm animate-fade-up-delay-1">
                {brandCopy.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-5 animate-fade-up-delay-2">
              <Link
                href="/shop"
                className="group/cta inline-flex items-center gap-2.5 bg-white text-[#0a0a0a] font-body text-[13px] md:text-[14px] font-semibold pl-6 pr-4 md:pl-7 md:pr-5 py-3 md:py-3.5 rounded-full hover:bg-glitch-cyan hover:text-[#0a0a0a] transition-colors duration-200"
              >
                Shop Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 transition-transform group-hover/cta:translate-x-0.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <span className="font-mono text-[10px] md:text-[11px] text-white/30 tracking-wider">
                v2.0_human
              </span>
            </div>

            <div className="flex items-center gap-2 animate-fade-up-delay-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
              <p className="font-mono text-[10px] md:text-[11px] text-white/40 tracking-wide">
                {brandCopy.microcopy}
              </p>
            </div>
          </div>

          {/* Right — Object Scan HUD Slider */}
          <div className="relative animate-fade-up-delay-1">
            <div className="relative w-full h-full min-h-[420px] md:min-h-0 bg-[#e8e6e3] overflow-hidden">

              {/* Glitch flash on transition */}
              {glitching && (
                <div className="absolute inset-0 z-[20] pointer-events-none">
                  <div className="absolute inset-0 bg-glitch-cyan/10 mix-blend-screen" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px)",
                    }}
                  />
                  <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-white/20" />
                </div>
              )}

              {/* ── HUD top bar ── */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 md:px-5 md:py-4">
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a]/50">
                  object_scan / {s.scanId}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a]/50 flex items-center gap-1.5">
                  <span className="hidden sm:inline">status:</span> human-made
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-glitch-cyan animate-pulse" />
                </span>
              </div>

              {/* ── Stat card — upper right ── */}
              <div className="absolute top-9 md:top-10 right-2 md:right-4 z-10">
                <StatCard
                  label="Replacement likelihood"
                  value={s.replacementLikelihood}
                  className="w-36 md:w-52 shadow-md"
                />
              </div>

              {/* ── Product image ── */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  key={s.scanId}
                  src={s.image}
                  alt={s.alt}
                  width={520}
                  height={520}
                  className="relative z-[1] w-[240px] md:w-[440px] h-auto transition-opacity duration-200"
                  style={{ opacity: glitching ? 0 : 1 }}
                  priority
                />
              </div>

              {/* ── Bounding box reticle ── */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
                <div className="relative w-[72%] h-[65%] md:h-[70%]">
                  <div className="absolute -top-0 -left-0 w-4 md:w-5 h-4 md:h-5 border-t border-l border-[#0a0a0a]/30" />
                  <div className="absolute -top-0 -left-0 w-1.5 h-1.5 bg-[#0a0a0a]/20 mt-[-3px] ml-[-3px]" />
                  <div className="absolute -top-0 -right-0 w-4 md:w-5 h-4 md:h-5 border-t border-r border-[#0a0a0a]/30" />
                  <div className="absolute -top-0 -right-0 w-1.5 h-1.5 bg-[#0a0a0a]/20 mt-[-3px] mr-[-3px]" />
                  <div className="absolute -bottom-0 -left-0 w-4 md:w-5 h-4 md:h-5 border-b border-l border-[#0a0a0a]/30" />
                  <div className="absolute -bottom-0 -left-0 w-1.5 h-1.5 bg-[#0a0a0a]/20 mb-[-3px] ml-[-3px]" />
                  <div className="absolute -bottom-0 -right-0 w-4 md:w-5 h-4 md:h-5 border-b border-r border-[#0a0a0a]/30" />
                  <div className="absolute -bottom-0 -right-0 w-1.5 h-1.5 bg-[#0a0a0a]/20 mb-[-3px] mr-[-3px]" />
                  <div className="absolute inset-0 border border-dashed border-[#0a0a0a]/15" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#0a0a0a]/30">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ── Annotation: material + origin (left) ── */}
              <div className="absolute left-3 md:left-5 top-[38%] md:top-[40%] z-[3] flex items-center gap-1.5 md:gap-2">
                <div className="text-right">
                  <p className="font-mono text-[8px] md:text-[10px] text-[#0a0a0a]/50 tracking-wider">
                    material / {s.material}
                  </p>
                  <p className="font-mono text-[8px] md:text-[10px] text-[#0a0a0a]/50 tracking-wider">
                    origin / {s.origin}
                  </p>
                </div>
                <div className="flex items-center gap-0">
                  <div className="w-4 md:w-10 h-px bg-[#0a0a0a]/20" />
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full border border-[#0a0a0a]/30 bg-transparent shrink-0" />
                </div>
              </div>

              {/* ── Annotation: state (right) ── */}
              <div className="absolute right-3 md:right-5 top-[55%] z-[3] flex items-center gap-1.5 md:gap-2">
                <div className="flex items-center gap-0">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full border border-[#0a0a0a]/30 bg-transparent shrink-0" />
                  <div className="w-4 md:w-10 h-px bg-[#0a0a0a]/20" />
                </div>
                <p className="font-mono text-[8px] md:text-[10px] text-[#0a0a0a]/50 tracking-wider">
                  state / {s.state}
                </p>
              </div>

              {/* ── Annotation: mode (bottom center) ── */}
              <div className="absolute bottom-10 md:bottom-10 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-1">
                <div className="w-px h-3 md:h-4 bg-[#0a0a0a]/20" />
                <p className="font-mono text-[8px] md:text-[10px] text-[#0a0a0a]/50 tracking-wider">
                  mode / {s.mode}
                </p>
              </div>

              {/* ── Bottom metadata bar ── */}
              <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-5 py-2.5 md:py-3">
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.15em] uppercase text-[#0a0a0a]/40">
                  confidence: <span className="text-[#0e7c7b]">{s.confidence}%</span>
                </span>
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.15em] uppercase text-[#0a0a0a]/40">
                  classification: <span className="text-[#0e7c7b]">{s.classification}</span>
                </span>
              </div>

              {/* ── Slide indicators ── */}
              <div className="absolute bottom-2.5 md:bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`View product ${i + 1}`}
                    className={`relative h-1 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-6 bg-[#0e7c7b]"
                        : "w-2 bg-[#0a0a0a]/20 hover:bg-[#0a0a0a]/40"
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

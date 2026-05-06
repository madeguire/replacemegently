"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "glitch" | "fade">("idle");
  const prevPath = useRef(pathname);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    setPhase("glitch");

    const t1 = setTimeout(() => setPhase("fade"), 350);
    const t2 = setTimeout(() => setPhase("idle"), 700);
    timeouts.current = [t1, t2];

    return () => timeouts.current.forEach(clearTimeout);
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        opacity: phase === "glitch" ? 1 : 0,
        transition: "opacity 0.35s ease-out",
      }}
    >
      {/* Dark wash — the main "blink" */}
      <div
        className="absolute inset-0 bg-[#0a0a0a]"
        style={{
          animation: "page-wash 0.35s ease-out forwards",
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 4px)",
          animation: "hero-scanline-drift 0.1s linear infinite",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          animation: "hero-noise-drift 0.3s steps(4) infinite",
        }}
      />

      {/* Horizontal glitch bars — thicker, brighter */}
      <div
        className="absolute left-0 right-0 h-[3px] bg-glitch-cyan/50"
        style={{
          top: "25%",
          animation: "page-glitch-bar 0.3s step-end forwards",
        }}
      />
      <div
        className="absolute left-0 right-0 h-[2px] bg-glitch-cyan/35"
        style={{
          top: "55%",
          animation: "page-glitch-bar 0.3s step-end 0.06s forwards",
        }}
      />
      <div
        className="absolute left-0 right-0 h-[2px] bg-glitch-cyan/30"
        style={{
          top: "80%",
          animation: "page-glitch-bar 0.3s step-end 0.12s forwards",
        }}
      />

      {/* Block corruption — larger, more visible */}
      <div
        className="absolute bg-glitch-cyan/15 h-[4px]"
        style={{
          top: "18%",
          left: "3%",
          width: "200px",
          animation: "page-glitch-block 0.3s step-end forwards",
        }}
      />
      <div
        className="absolute bg-glitch-cyan/14 h-[3px]"
        style={{
          top: "42%",
          right: "5%",
          width: "160px",
          animation: "page-glitch-block 0.3s step-end 0.08s forwards",
        }}
      />
      <div
        className="absolute bg-glitch-cyan/10 h-[5px]"
        style={{
          top: "68%",
          left: "15%",
          width: "120px",
          animation: "page-glitch-block 0.3s step-end 0.15s forwards",
        }}
      />

      {/* Center signal text */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: "page-signal-text 0.35s ease-out forwards" }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-glitch-cyan/40">
          loading_signal
        </span>
      </div>
    </div>
  );
}

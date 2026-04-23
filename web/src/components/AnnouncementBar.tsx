"use client";

import { brandCopy } from "@/data/store";

export default function AnnouncementBar() {
  const text = brandCopy.announcement;
  const repeated = `${text} ◆ ${text} ◆ ${text} ◆ ${text} ◆ `;

  return (
    <div
      className="relative bg-[#0a0a0a] text-white/70 py-2.5 overflow-hidden"
      style={{ animation: "glitch-flicker 8s step-end infinite" }}
    >
      {/* Scrolling marquee */}
      <div className="flex whitespace-nowrap" style={{ animation: "marquee-scroll 30s linear infinite" }}>
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase shrink-0 px-4">
          {repeated}
        </span>
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase shrink-0 px-4" aria-hidden="true">
          {repeated}
        </span>
      </div>

      {/* Corruption accent */}
      <div
        className="absolute top-0 left-[15%] w-12 h-full bg-glitch-cyan/10 pointer-events-none"
        style={{ animation: "hero-corruption-1 6s step-end infinite" }}
      />
    </div>
  );
}

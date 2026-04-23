"use client";

import { useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  hoverOnly?: boolean;
}

export default function GlitchText({
  text,
  className = "",
  as: Tag = "span",
  hoverOnly = false,
}: GlitchTextProps) {
  const [hovering, setHovering] = useState(false);

  const shouldAnimate = hoverOnly ? hovering : true;

  return (
    <Tag
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        animation: shouldAnimate
          ? "glitch-shift 4s ease-in-out infinite, glitch-flicker 6s step-end infinite"
          : "none",
      }}
    >
      {text}
    </Tag>
  );
}

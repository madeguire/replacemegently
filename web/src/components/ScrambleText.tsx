"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const GLITCH_CHARS = "!@#$%&*_+=/?<>{}[]01";

interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "span" | "h2" | "h3" | "h4";
  duration?: number;
  /** When true, scramble is triggered by an external parent hover instead of self-managed mouseenter */
  active?: boolean;
}

export default function ScrambleText({
  text,
  className = "",
  as: Tag = "span",
  duration = 1200,
  active,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);
  const prevActive = useRef(active);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scramble = useCallback(() => {
    cleanup();
    frameRef.current = 0;

    const chars = text.split("");
    const totalFrames = Math.max(chars.length * 3, 20);
    const frameMs = Math.round(duration / totalFrames);

    intervalRef.current = setInterval(() => {
      frameRef.current += 1;
      const progress = frameRef.current / totalFrames;
      const resolvedCount = Math.floor(progress * chars.length);

      const next = chars.map((char, i) => {
        if (char === " ") return " ";
        if (i < resolvedCount) return char;
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      });

      setDisplay(next.join(""));

      if (frameRef.current >= totalFrames) {
        cleanup();
        setDisplay(text);
      }
    }, frameMs);
  }, [text, duration, cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setDisplay(text);
  }, [text, cleanup]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    if (active === undefined) return;
    if (active && !prevActive.current) {
      scramble();
    } else if (!active && prevActive.current) {
      reset();
    }
    prevActive.current = active;
  }, [active, scramble, reset]);

  const selfManaged = active === undefined;

  return (
    <Tag
      className={className}
      onMouseEnter={selfManaged ? scramble : undefined}
      onMouseLeave={selfManaged ? reset : undefined}
      aria-label={text}
    >
      {display}
    </Tag>
  );
}

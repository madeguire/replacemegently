"use client";

export default function BlinkingCursor() {
  return (
    <span
      className="inline-block w-[3px] h-[0.85em] bg-foreground ml-1 align-baseline translate-y-[0.05em]"
      style={{ animation: "blink-caret 1s step-end infinite" }}
    />
  );
}

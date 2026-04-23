"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrambleText from "@/components/ScrambleText";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              identity_verification
            </span>
            <h1
              className="font-display text-4xl md:text-5xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              {mode === "login" ? "Prove You're Human" : "Register as Human"}
            </h1>
          </div>
        </section>

        <section className="max-w-md mx-auto px-6 py-12 md:py-20">
          {/* Toggle */}
          <div className="flex items-center gap-1 mb-10 border border-border p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 font-mono text-[11px] tracking-wider py-2.5 transition-all duration-200 ${
                mode === "login"
                  ? "bg-foreground text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 font-mono text-[11px] tracking-wider py-2.5 transition-all duration-200 ${
                mode === "register"
                  ? "bg-foreground text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your actual human name"
                  className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
                />
              </div>
            )}

            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@still-employed.com"
                className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Something a machine can't guess"
                className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
              />
            </div>

            {mode === "register" && (
              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" id="human-check" className="mt-1 accent-[#0e7c7b]" />
                <label htmlFor="human-check" className="font-body text-xs text-muted leading-relaxed">
                  I confirm I am a biological human being and not a large language model pretending to shop.
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0a0a0a] text-white font-body text-[14px] font-semibold py-4 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200 mt-2"
            >
              <ScrambleText
                text={mode === "login" ? "Verify Identity" : "Create Account"}
                duration={800}
              />
            </button>
          </form>

          <p className="font-mono text-[10px] text-muted/40 tracking-wider text-center mt-8">
            Your data is stored on human-operated servers. Probably.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ScrambleText from "@/components/ScrambleText";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              transaction_complete
            </span>
            <h1
              className="font-display text-4xl md:text-5xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Order Confirmed
            </h1>
          </div>
        </section>

        <section className="max-w-[640px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-block mb-8">
              <div className="relative w-24 h-24 mx-auto border border-dashed border-border flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-glitch-cyan-on-light">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-foreground/15" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-foreground/15" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-foreground/15" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-foreground/15" />
              </div>
            </div>

            <span
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-4"
              style={{ animation: "glitch-flicker 6s step-end infinite" }}
            >
              payment_verified
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-3">
              Thank you for your order
            </h2>
            <p className="font-body text-base text-muted max-w-sm mx-auto mb-3">
              A real human will pack and ship your artifacts. You&apos;ll get a
              confirmation email from Stripe with your receipt.
            </p>
            <p className="font-mono text-[10px] text-muted/50 tracking-wider mb-8">
              Estimated processing: 1-2 business days. Shipping: 3-7 business days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2.5 bg-[#0a0a0a] text-white font-body text-[14px] font-semibold px-7 py-3.5 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200"
              >
                <ScrambleText text="Continue Shopping" duration={600} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2.5 border border-border text-foreground font-body text-[14px] font-semibold px-7 py-3.5 rounded-full hover:bg-surface transition-colors duration-200"
              >
                <ScrambleText text="Back to Home" duration={600} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

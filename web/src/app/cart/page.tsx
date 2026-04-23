"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ScrambleText from "@/components/ScrambleText";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

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
              cargo_manifest
            </span>
            <h1
              className="font-display text-4xl md:text-5xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Your Cart
            </h1>
            {totalItems > 0 && (
              <p className="font-mono text-[11px] text-white/40 tracking-wider mt-2">
                {totalItems} artifact{totalItems !== 1 ? "s" : ""} in manifest
              </p>
            )}
          </div>
        </section>

        {items.length === 0 ? (
          <section className="max-w-[900px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-block mb-8">
                <div className="relative w-24 h-24 mx-auto border border-dashed border-border flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted/40">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
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
                cargo_empty
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight mb-3">
                Nothing here yet
              </h2>
              <p className="font-body text-base text-muted max-w-sm mx-auto mb-8">
                Your cart is as empty as a designer&apos;s inbox after AI took over the briefs.
                Fill it with human-made artifacts.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 bg-[#0a0a0a] text-white font-body text-[14px] font-semibold px-7 py-3.5 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200"
              >
                Browse the Archive
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </section>
        ) : (
          <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
              {/* Items */}
              <div className="lg:col-span-2">
                {/* Column headers */}
                <div className="hidden md:grid grid-cols-[1fr_120px_100px_60px] gap-4 pb-3 border-b border-border font-mono text-[9px] tracking-[0.2em] uppercase text-muted">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                <div className="space-y-0">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_60px] gap-4 md:items-center py-5 border-b border-border"
                    >
                      {/* Product info */}
                      <div className="flex gap-4">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="relative w-20 h-20 bg-[#f2f2f2] shrink-0 overflow-hidden"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-foreground/10" />
                          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-foreground/10" />
                        </Link>
                        <div className="flex flex-col justify-center min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-body text-sm font-medium text-foreground hover:text-glitch-cyan-on-light transition-colors truncate"
                          >
                            {item.product.name}
                          </Link>
                          <span className="font-mono text-[10px] text-muted tracking-wider mt-0.5">
                            size: {item.size} · ${item.product.price}
                          </span>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-mono text-[14px] text-muted hover:text-foreground hover:bg-surface transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-mono text-[12px] text-foreground border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-mono text-[14px] text-muted hover:text-foreground hover:bg-surface transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <p className="font-mono text-sm font-semibold text-foreground text-right tabular-nums">
                        ${item.product.price * item.quantity}
                      </p>

                      {/* Remove */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="font-mono text-[10px] text-muted hover:text-glitch-red transition-colors tracking-wider"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5">
                  <button
                    onClick={clearCart}
                    className="font-mono text-[10px] tracking-wider text-muted hover:text-glitch-red transition-colors"
                  >
                    <ScrambleText text="Clear all" duration={600} />
                  </button>
                  <Link
                    href="/shop"
                    className="font-mono text-[10px] tracking-wider text-muted hover:text-glitch-cyan-on-light transition-colors"
                  >
                    <ScrambleText text="Continue shopping →" duration={600} />
                  </Link>
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="border border-border p-6 sticky top-[90px]">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-5">
                    order_summary
                  </span>

                  <div className="space-y-3 pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                        Subtotal
                      </span>
                      <span className="font-mono text-sm text-foreground tabular-nums">
                        ${totalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                        Shipping
                      </span>
                      <span className="font-mono text-sm text-foreground tabular-nums">
                        {totalPrice >= 75 ? "Free" : "$8"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 pb-5">
                    <span className="font-mono text-[11px] tracking-wider text-foreground font-semibold uppercase">
                      Total
                    </span>
                    <span className="font-mono text-lg text-foreground font-bold tabular-nums">
                      ${totalPrice >= 75 ? totalPrice : totalPrice + 8}
                    </span>
                  </div>

                  {totalPrice < 75 && (
                    <div className="mb-5 p-3 bg-surface/60">
                      <p className="font-mono text-[10px] text-muted tracking-wider">
                        ${75 - totalPrice} away from free shipping
                      </p>
                      <div className="w-full h-1 bg-border mt-2 overflow-hidden">
                        <div
                          className="h-full bg-glitch-cyan-on-light transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalPrice / 75) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button className="w-full bg-[#0a0a0a] text-white font-body text-[14px] font-semibold py-4 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200">
                    <ScrambleText text="Checkout" duration={800} />
                  </button>

                  <p className="font-mono text-[9px] text-muted/40 tracking-wider text-center mt-4">
                    Processed by humans. Secured by paranoia.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

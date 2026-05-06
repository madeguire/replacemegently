"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/store";

interface SearchInterfaceProps {
  products: Product[];
}

export default function SearchInterface({ products }: SearchInterfaceProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query, products]);

  return (
    <>
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            animation: "hero-scanline-drift 0.4s linear infinite",
          }}
        />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-5">
            query_interface
          </span>
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for human-made artifacts..."
              autoFocus
              className="w-full bg-transparent border-b-2 border-white/20 focus:border-glitch-cyan/60 text-white font-display text-2xl md:text-4xl tracking-tight py-3 placeholder:text-white/20 focus:outline-none transition-colors"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-wider"
                >
                  clear
                </button>
              )}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
        {query.trim() && (
          <p className="font-mono text-[11px] text-muted tracking-wider mb-8">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {query.trim() && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-20">
            <span
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-4"
              style={{ animation: "glitch-flicker 6s step-end infinite" }}
            >
              no_signal
            </span>
            <h2 className="font-display text-2xl text-foreground tracking-tight mb-2">
              Nothing found
            </h2>
            <p className="font-body text-sm text-muted">
              No artifacts match that query. Try another search — or accept that some things are irreplaceable.
            </p>
          </div>
        )}

        {!query.trim() && (
          <div className="text-center py-16">
            <p className="font-mono text-[11px] text-muted/50 tracking-wider">
              Start typing to scan the archive...
            </p>
          </div>
        )}
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ScrambleText from "@/components/ScrambleText";
import { products } from "@/data/store";

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

export default function ShopPage() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        {/* Hero strip */}
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-glitch-cyan/40 z-10"
            style={{ animation: "hero-hbar 8s ease-in-out infinite" }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              catalog_index
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              All Products
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              Objects for the soon-to-be-obsolete. Browse while browsing still requires a human.
            </p>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
          <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-12">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mr-2">
              filter /
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`font-mono text-[11px] tracking-wider px-3 py-1.5 border transition-all duration-200 ${
                  active === cat
                    ? "border-glitch-cyan-on-light text-glitch-cyan-on-light bg-glitch-cyan-on-light/5"
                    : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <ScrambleText text={cat} duration={600} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-mono text-sm text-muted">
                No products found. The machines haven&apos;t made these yet.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

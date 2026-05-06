"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ScrambleText from "@/components/ScrambleText";
import type { Product } from "@/data/store";

interface ShopGridProps {
  products: Product[];
}

export default function ShopGrid({ products }: ShopGridProps) {
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
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
  );
}

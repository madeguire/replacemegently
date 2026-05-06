import Link from "next/link";
import { getProducts } from "@/lib/catalog-api";
import ProductCard from "./ProductCard";
import ScrambleText from "./ScrambleText";

export default async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section className="relative max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-14">
      {/* Floating corruption blocks */}
      <div
        className="absolute top-24 right-12 w-16 h-2 bg-glitch-cyan-on-light/12 pointer-events-none"
        style={{ animation: "hero-corruption-2 7s step-end infinite" }}
      />
      <div
        className="absolute bottom-32 left-8 w-24 h-1.5 bg-glitch-cyan/10 pointer-events-none"
        style={{ animation: "hero-corruption-1 9s step-end infinite 2s" }}
      />

      <div className="flex flex-col items-center text-center mb-6 md:mb-8 space-y-4">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light">
            featured_items
          </span>
          <ScrambleText
            text="Featured"
            as="h2"
            className="font-display text-2xl md:text-3xl text-foreground tracking-tight"
            duration={1200}
          />
          <p className="font-mono text-[11px] text-muted tracking-wide max-w-md mx-auto">
            Best sellers. While humans still buy things.
          </p>
        </div>
        <Link
          href="/shop"
          className="font-mono text-[11px] tracking-wider text-muted hover:text-glitch-cyan-on-light transition-colors"
        >
          <ScrambleText text="View all →" duration={600} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}

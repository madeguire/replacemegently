"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/store";
import ProductCard from "@/components/ProductCard";
import ScrambleText from "@/components/ScrambleText";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState("M");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-[1320px] mx-auto px-6 md:px-10 py-20 text-center">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-4">
            error_404
          </span>
          <h1 className="font-display text-3xl text-foreground tracking-tight mb-3">
            Product not found
          </h1>
          <p className="font-body text-muted mb-6">
            This artifact may have been deprecated. Or the machines got to it first.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white font-body text-sm font-semibold px-6 py-3 rounded-full hover:bg-glitch-cyan-on-light transition-colors"
          >
            Back to shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const sizes = ["XS", "S", "M", "L", "XL"];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAdded(true);
  };

  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-6 pb-2">
          <nav className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground/70 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Product detail */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-square bg-[#f2f2f2] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
                  }}
                />
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-foreground/15" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-foreground/15" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-foreground/15" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-foreground/15" />
              </div>
              <div className="flex items-center justify-between mt-3 font-mono text-[9px] tracking-[0.15em] uppercase text-muted">
                <span>scan_id: {product.id}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-glitch-cyan-on-light/50" />
                  human_verified
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light mb-2">
                {product.category}
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="font-body text-base text-muted mt-3">
                {product.tagline}
              </p>
              <p className="font-mono text-2xl font-semibold text-foreground mt-5 tabular-nums">
                ${product.price}
              </p>

              {/* Replacement likelihood bar */}
              <div className="mt-6 p-4 border border-border bg-surface/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                    replacement_likelihood
                  </span>
                  <span className="font-mono text-[12px] text-glitch-cyan-on-light font-semibold">
                    {product.replacementLikelihood}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-border overflow-hidden">
                  <div
                    className="h-full bg-glitch-cyan-on-light transition-all duration-700"
                    style={{ width: `${product.replacementLikelihood}%` }}
                  />
                </div>
              </div>

              {/* Size selector */}
              <div className="mt-6">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-3">
                  size /
                </span>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`font-mono text-[11px] tracking-wider w-10 h-10 border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-foreground text-foreground bg-foreground/5"
                          : "border-border text-muted hover:border-foreground/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className={`mt-8 w-full font-body text-[14px] font-semibold py-4 rounded-full transition-all duration-300 ${
                  added
                    ? "bg-glitch-cyan-on-light text-white"
                    : "bg-[#0a0a0a] text-white hover:bg-glitch-cyan-on-light"
                }`}
              >
                {added ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13.25 4.75 6 12 2.75 8.75" />
                    </svg>
                    Added to Cart
                  </span>
                ) : (
                  <ScrambleText text="Add to Cart" duration={800} />
                )}
              </button>

              {/* Details */}
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-muted tracking-wider w-24 shrink-0 uppercase">
                    Collection
                  </span>
                  <span className="font-body text-sm text-foreground">
                    {product.collection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-muted tracking-wider w-24 shrink-0 uppercase">
                    Origin
                  </span>
                  <span className="font-body text-sm text-foreground">
                    Human-made. Verified analog.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-muted tracking-wider w-24 shrink-0 uppercase">
                    Shipping
                  </span>
                  <span className="font-body text-sm text-foreground">
                    Free over $75. Shipped by actual people.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16 border-t border-border">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-2">
            related_artifacts
          </span>
          <h2 className="font-display text-2xl text-foreground tracking-tight mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

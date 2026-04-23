"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/store";
import ScrambleText from "./ScrambleText";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group glitch-card block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square mb-4 overflow-hidden bg-[#f2f2f2]">
        <div className="glitch-card-image relative w-full h-full transition-transform duration-300 group-hover:scale-[1.02]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>

        {/* Hover overlay scan lines */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,240,0.02) 2px, rgba(0,255,240,0.02) 4px)",
          }}
        />

        {/* Glitch bottom accent */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-glitch-cyan/60 group-hover:w-full transition-all duration-300" />

        {product.replacementLikelihood >= 80 && (
          <span
            className="absolute top-3 right-3 font-mono text-[10px] tracking-wider uppercase text-glitch-cyan bg-[#0a0a0a]/80 backdrop-blur-sm px-2.5 py-1 border border-glitch-cyan/20"
            style={{ animation: "glitch-flicker 6s step-end infinite" }}
          >
            {product.replacementLikelihood}% replaceable
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-body text-sm font-medium text-foreground leading-snug group-hover:text-glitch-cyan-on-light transition-colors duration-200">
          <ScrambleText text={product.name} as="span" duration={1000} active={hovered} />
        </h3>
        <p className="font-body text-xs text-muted">{product.tagline}</p>
        <p className="font-mono text-sm font-semibold text-foreground tabular-nums">
          ${product.price}
        </p>
      </div>
    </Link>
  );
}

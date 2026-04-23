"use client";

import Link from "next/link";
import Image from "next/image";
import type { Collection } from "@/data/store";

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export default function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group glitch-card block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2f2]">
        <div className="glitch-card-image relative w-full h-full transition-transform duration-300 group-hover:scale-[1.02]">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        </div>

        {/* Hover overlay with scan lines */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,240,0.02) 2px, rgba(0,255,240,0.02) 4px)",
          }}
        />

        {/* Glitch accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-glitch-cyan/60 group-hover:w-full transition-all duration-300" />
      </div>

      <div className="mt-3">
        <h3 className="font-body text-[14px] font-semibold text-foreground leading-snug">
          {collection.name}
        </h3>
        <p className="font-mono text-[11px] text-muted/60 mt-0.5">
          [{String(index).padStart(2, "0")}] {collection.itemCount} items
        </p>
      </div>
    </Link>
  );
}

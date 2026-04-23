import Link from "next/link";
import { collections } from "@/data/store";
import CollectionCard from "./CollectionCard";

export default function CollectionGrid() {
  return (
    <section className="relative max-w-[1320px] mx-auto px-6 md:px-10 pt-10 md:pt-14">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light">
            catalog_index
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight glitch-heading">
            Shop by collection
          </h2>
        </div>
        <Link
          href="/collections"
          className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-muted hover:text-glitch-cyan-on-light transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {collections.map((collection, i) => (
          <CollectionCard key={collection.id} collection={collection} index={i + 1} />
        ))}
      </div>

      {/* Glitch divider — equal spacing above and below */}
      <div className="glitch-divider my-10 md:my-14" />
    </section>
  );
}

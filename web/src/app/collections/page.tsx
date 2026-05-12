export const dynamic = "force-dynamic";

import PageView from "@/components/PageView";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/catalog-api";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <PageView page="collections" />
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
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              archive_clusters
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Collections
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              Curated groupings of human-made artifacts. Organized by emotional state.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {collections.map((col, i) => (
              <Link
                key={col.id}
                href={`/shop?collection=${col.id}`}
                className="group relative overflow-hidden bg-[#f2f2f2] aspect-[4/3]"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scan lines on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2]"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,240,0.03) 2px, rgba(0,255,240,0.03) 4px)",
                  }}
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-[3]" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 z-[4] p-5 md:p-7">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-glitch-cyan/70 block mb-1.5">
                    cluster_0{i + 1} / {col.itemCount} items
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl text-white tracking-tight leading-tight">
                    {col.name}
                  </h2>
                  <p className="font-body text-sm text-white/50 mt-1">
                    {col.description}
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20 z-[4]" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20 z-[4]" />

                {/* Glitch accent on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-glitch-cyan/60 group-hover:w-full transition-all duration-500 z-[5]" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

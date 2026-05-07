export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog-api";

export default async function BestSellersPage() {
  const products = await getProducts();
  const bestSellers = [...products]
    .sort((a, b) => b.replacementLikelihood - a.replacementLikelihood)
    .slice(0, 4);

  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-glitch-cyan-on-light/25 z-10"
            style={{ animation: "hero-hbar 8s ease-in-out 1s infinite" }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              high_demand_artifacts
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Best Sellers
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              The most purchased coping mechanisms. Ranked by existential demand.
            </p>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
            {bestSellers.map((product, i) => (
              <div key={product.id} className="relative">
                <span className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-[#0a0a0a] text-white font-mono text-[10px] flex items-center justify-center border border-glitch-cyan/30">
                  #{i + 1}
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductNotFound() {
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

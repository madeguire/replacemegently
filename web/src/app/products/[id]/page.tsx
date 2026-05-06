import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProducts } from "@/lib/catalog-api";
import ProductDetail from "./ProductDetail";

export default async function ProductPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 pt-6 pb-2">
          <nav className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground/70 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        <ProductDetail product={product} />

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

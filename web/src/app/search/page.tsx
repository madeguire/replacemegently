export const dynamic = "force-dynamic";

import PageView from "@/components/PageView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/catalog-api";
import SearchInterface from "./SearchInterface";

export default async function SearchPage() {
  const products = await getProducts();

  return (
    <>
      <PageView page="search" />
      <Header />
      <main className="flex-1">
        <SearchInterface products={products} />
      </main>
      <Footer />
    </>
  );
}

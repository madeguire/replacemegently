"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Button,
  EmptyState,
  ErrorBanner,
  LinkButton,
  PageHeader,
  PageShell,
  Panel,
} from "../_components/AdminUI";
import { deleteProduct, fetchProducts } from "@/lib/admin-api";
import type { Product } from "@/data/store";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, []);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((current) => current?.filter((p) => p.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = products?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q)
    );
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow="inventory / 02"
        title="Products"
        description="Every SKU in the catalog. Edit or remove an item, or file a new one into the archive."
        action={<LinkButton href="/admin/products/new">+ new_product</LinkButton>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          query /
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="filter by id, name, category, or collection…"
          className="flex-1 min-w-[240px] bg-white/5 border border-white/12 px-4 py-2 font-mono text-[12px] text-white placeholder:text-white/25 focus:outline-none focus:border-glitch-cyan"
        />
        {products && (
          <span className="font-mono text-[10px] tracking-wider text-white/40">
            {filtered?.length}/{products.length} shown
          </span>
        )}
      </div>

      {!products && !error && (
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_inventory
        </div>
      )}

      {products && filtered && filtered.length === 0 && (
        <EmptyState
          title={products.length === 0 ? "No products yet" : "No matches"}
          description={
            products.length === 0
              ? "Add your first product to start populating the storefront."
              : "Try a different filter or clear the query."
          }
          action={
            products.length === 0 ? (
              <LinkButton href="/admin/products/new">+ new_product</LinkButton>
            ) : (
              <Button variant="secondary" onClick={() => setSearch("")}>
                clear_query
              </Button>
            )
          }
        />
      )}

      {products && filtered && filtered.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-white/8">
                <Th>slug</Th>
                <Th>name</Th>
                <Th>category</Th>
                <Th>collection</Th>
                <Th align="right">price</Th>
                <Th align="right">replace%</Th>
                <Th align="right">actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025] transition-colors animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                >
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-[11px] text-glitch-cyan/80">
                      {p.id}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top max-w-0">
                    <div className="font-body text-[13px] text-white truncate">
                      {p.name}
                    </div>
                    {p.tagline && (
                      <div className="font-mono text-[10px] text-white/30 truncate mt-1">
                        {p.tagline}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-[11px] text-white/70">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-[11px] text-white/50">
                      {p.collection}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top text-right font-mono text-[13px] text-white">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 align-top text-right font-mono text-[11px] text-white/50">
                    {p.replacementLikelihood}%
                  </td>
                  <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/products/${encodeURIComponent(p.id)}/edit`}
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-glitch-cyan transition-colors"
                      >
                        edit
                      </Link>
                      <span className="text-white/15">·</span>
                      <button
                        onClick={() => onDelete(p.id, p.name)}
                        disabled={deletingId === p.id}
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 hover:text-glitch-red transition-colors disabled:opacity-40"
                      >
                        {deletingId === p.id ? "deleting…" : "delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </PageShell>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

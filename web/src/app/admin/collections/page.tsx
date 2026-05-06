"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  EmptyState,
  ErrorBanner,
  LinkButton,
  PageHeader,
  PageShell,
  Panel,
} from "../_components/AdminUI";
import { deleteCollection, fetchCollections } from "@/lib/admin-api";
import type { Collection } from "@/data/store";

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      const data = await fetchCollections();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collections");
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
      await deleteCollection(id);
      setCollections((current) => current?.filter((c) => c.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="inventory / 03"
        title="Collections"
        description="Curated groupings that anchor the storefront's narrative. A collection cannot be deleted while it still hosts products."
        action={
          <LinkButton href="/admin/collections/new">+ new_collection</LinkButton>
        }
      />

      {error && <ErrorBanner message={error} />}

      {!collections && !error && (
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_collections
        </div>
      )}

      {collections && collections.length === 0 && (
        <EmptyState
          title="No collections yet"
          description="Create your first collection — products must belong to one to be listed."
          action={
            <LinkButton href="/admin/collections/new">+ new_collection</LinkButton>
          }
        />
      )}

      {collections && collections.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-white/8">
                <Th>slug</Th>
                <Th>name</Th>
                <Th>description</Th>
                <Th align="right">items</Th>
                <Th align="right">actions</Th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025] transition-colors animate-fade-up"
                  style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                >
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-[11px] text-glitch-cyan/80">
                      {c.id}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top max-w-0">
                    <div className="font-display text-[16px] text-white truncate">
                      {c.name}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top max-w-md">
                    <div className="font-mono text-[11px] text-white/50 line-clamp-2">
                      {c.description || (
                        <span className="text-white/20 italic">— no description —</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-right font-mono text-[12px] text-white/70">
                    {c.itemCount}
                  </td>
                  <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/admin/collections/${encodeURIComponent(c.id)}/edit`}
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-glitch-cyan transition-colors"
                      >
                        edit
                      </Link>
                      <span className="text-white/15">·</span>
                      <button
                        onClick={() => onDelete(c.id, c.name)}
                        disabled={deletingId === c.id || c.itemCount > 0}
                        title={
                          c.itemCount > 0
                            ? "Move or delete its products first"
                            : undefined
                        }
                        className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 hover:text-glitch-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {deletingId === c.id ? "deleting…" : "delete"}
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

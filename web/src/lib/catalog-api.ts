import "server-only";

import type { Product, Collection } from "@/data/store";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { tags: ["catalog"], revalidate: 60 },
    });
    if (!res.ok) return fallback;
    return res.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export function getProducts(params?: {
  category?: string;
  collection?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.collection) query.set("collection", params.collection);
  const qs = query.toString();
  return apiFetch<Product[]>(`/products${qs ? `?${qs}` : ""}`, []);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, {
      next: { tags: ["catalog", `product:${id}`], revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}

export function getCollections(): Promise<Collection[]> {
  return apiFetch<Collection[]>("/collections", []);
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  try {
    const res = await fetch(`${API_URL}/collections/${encodeURIComponent(id)}`, {
      next: { tags: ["catalog", `collection:${id}`], revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as Collection;
  } catch {
    return null;
  }
}

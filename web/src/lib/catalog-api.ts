import "server-only";

import type { Product, Collection } from "@/data/store";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { tags: ["catalog"], revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Catalog API ${res.status} for ${path}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export function getProducts(params?: {
  category?: string;
  collection?: string;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.collection) query.set("collection", params.collection);
  const qs = query.toString();
  return apiFetch<Product[]>(`/products${qs ? `?${qs}` : ""}`);
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, {
    next: { tags: ["catalog", `product:${id}`], revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Catalog API ${res.status} for /products/${id}: ${await res.text()}`);
  }
  return (await res.json()) as Product;
}

export function getCollections(): Promise<Collection[]> {
  return apiFetch<Collection[]>("/collections");
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  const res = await fetch(`${API_URL}/collections/${encodeURIComponent(id)}`, {
    next: { tags: ["catalog", `collection:${id}`], revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Catalog API ${res.status} for /collections/${id}: ${await res.text()}`);
  }
  return (await res.json()) as Collection;
}

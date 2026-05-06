import type { Collection, Product } from "@/data/store";

// ── Catalog reads (public, but proxied through /api/catalog/* for same-origin) ──

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/catalog/products", { cache: "no-store" });
  if (!res.ok) throw await parseError(res, "Failed to load products");
  return (await res.json()) as Product[];
}

export async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch("/api/catalog/collections", { cache: "no-store" });
  if (!res.ok) throw await parseError(res, "Failed to load collections");
  return (await res.json()) as Collection[];
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export interface OrderItem {
  id: string;
  productId: string;
  productName: string | null;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderSummary {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  notes: string | null;
  total: number;
  itemCount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductWritePayload {
  id: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  replacementLikelihood: number;
  image: string;
  collection: string;
}

export type ProductUpdatePayload = Partial<Omit<ProductWritePayload, "id">>;

export interface CollectionWritePayload {
  id: string;
  name: string;
  description: string;
  image: string;
}

export type CollectionUpdatePayload = Partial<
  Omit<CollectionWritePayload, "id">
>;

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  priceAtPurchase?: number;
}

export interface OrderCreatePayload {
  customerName: string;
  customerEmail: string;
  status?: OrderStatus;
  notes?: string | null;
  items: OrderItemPayload[];
}

export interface OrderUpdatePayload {
  status?: OrderStatus;
  notes?: string | null;
  customerName?: string;
  customerEmail?: string;
}

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

interface ErrorPayload {
  detail?: unknown;
}

async function parseError(res: Response, fallback: string): Promise<AdminApiError> {
  let detail = fallback;
  try {
    const data = (await res.json()) as ErrorPayload;
    if (typeof data?.detail === "string" && data.detail.length > 0) {
      detail = data.detail;
    } else if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0] as { msg?: unknown } | undefined;
      if (first && typeof first.msg === "string") detail = first.msg;
    }
  } catch {}
  return new AdminApiError(detail, res.status);
}

async function request<T>(
  path: string,
  init: RequestInit & { fallback: string },
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw await parseError(res, init.fallback);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Products ──────────────────────────────────────────────────────────────────

export function createProduct(payload: ProductWritePayload): Promise<Product> {
  return request<Product>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
    fallback: "Failed to create product",
  });
}

export function updateProduct(
  id: string,
  payload: ProductUpdatePayload,
): Promise<Product> {
  return request<Product>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    fallback: "Failed to update product",
  });
}

export function deleteProduct(id: string): Promise<void> {
  return request<void>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallback: "Failed to delete product",
  });
}

// ── Collections ───────────────────────────────────────────────────────────────

export function createCollection(
  payload: CollectionWritePayload,
): Promise<Collection> {
  return request<Collection>("/api/admin/collections", {
    method: "POST",
    body: JSON.stringify(payload),
    fallback: "Failed to create collection",
  });
}

export function updateCollection(
  id: string,
  payload: CollectionUpdatePayload,
): Promise<Collection> {
  return request<Collection>(`/api/admin/collections/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    fallback: "Failed to update collection",
  });
}

export function deleteCollection(id: string): Promise<void> {
  return request<void>(`/api/admin/collections/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallback: "Failed to delete collection",
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function listOrders(params?: {
  status?: OrderStatus;
}): Promise<OrderSummary[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString();
  return request<OrderSummary[]>(`/api/admin/orders${query ? `?${query}` : ""}`, {
    method: "GET",
    fallback: "Failed to load orders",
  });
}

export function getOrder(id: string): Promise<Order> {
  return request<Order>(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "GET",
    fallback: "Failed to load order",
  });
}

export function createOrder(payload: OrderCreatePayload): Promise<Order> {
  return request<Order>("/api/admin/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    fallback: "Failed to create order",
  });
}

export function updateOrder(
  id: string,
  payload: OrderUpdatePayload,
): Promise<Order> {
  return request<Order>(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    fallback: "Failed to update order",
  });
}

export function deleteOrder(id: string): Promise<void> {
  return request<void>(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallback: "Failed to delete order",
  });
}

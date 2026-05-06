"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  ErrorBanner,
  Field,
  LinkButton,
  PageHeader,
  PageShell,
  Panel,
  Select,
  TextArea,
  TextInput,
} from "../../_components/AdminUI";
import {
  createOrder,
  fetchProducts,
  ORDER_STATUSES,
  type OrderItemPayload,
  type OrderStatus,
} from "@/lib/admin-api";
import type { Product } from "@/data/store";

interface ItemDraft {
  key: string;
  productId: string;
  quantity: string;
  priceOverride: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([
    { key: uid(), productId: "", quantity: "1", priceOverride: "" },
  ]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((ps) => {
        if (cancelled) return;
        setProducts(ps);
        if (ps.length > 0) {
          setItems((prev) =>
            prev.map((item) =>
              item.productId ? item : { ...item, productId: ps[0]!.id },
            ),
          );
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  const previewTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      const qty = parseInt(item.quantity || "0", 10) || 0;
      const overridden = parseFloat(item.priceOverride);
      const unit = !Number.isNaN(overridden)
        ? overridden
        : product
          ? product.price
          : 0;
      return sum + unit * qty;
    }, 0);
  }, [items, productMap]);

  function updateItem(key: string, patch: Partial<ItemDraft>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        key: uid(),
        productId: products[0]?.id ?? "",
        quantity: "1",
        priceOverride: "",
      },
    ]);
  }

  function removeItem(key: string) {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((it) => it.key !== key),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) return setError("Customer name is required");
    if (!customerEmail.trim()) return setError("Customer email is required");
    if (items.length === 0) return setError("Add at least one line item");

    const payloadItems: OrderItemPayload[] = [];
    for (const [i, item] of items.entries()) {
      if (!item.productId) return setError(`Item ${i + 1}: pick a product`);
      const qty = parseInt(item.quantity, 10);
      if (Number.isNaN(qty) || qty < 1)
        return setError(`Item ${i + 1}: quantity must be 1 or more`);
      const entry: OrderItemPayload = {
        productId: item.productId,
        quantity: qty,
      };
      if (item.priceOverride.trim().length > 0) {
        const override = parseFloat(item.priceOverride);
        if (Number.isNaN(override) || override < 0)
          return setError(`Item ${i + 1}: price override must be a non-negative number`);
        entry.priceAtPurchase = override;
      }
      payloadItems.push(entry);
    }

    setSubmitting(true);
    try {
      const created = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        status,
        notes: notes.trim() ? notes : null,
        items: payloadItems,
      });
      router.push(`/admin/orders/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="orders / new_entry"
        title="File a manual order"
        description="Use this until the Stripe pipeline is wired in. Line item prices snapshot the catalog at creation; you can override per item."
      />

      <form onSubmit={onSubmit} className="space-y-6">
        {error && <ErrorBanner message={error} />}

        <Panel className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="customer_name" required>
              <TextInput
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ada Lovelace"
                required
              />
            </Field>
            <Field label="customer_email" required>
              <TextInput
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="ada@analytical-engine.org"
                required
              />
            </Field>
            <Field label="status">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0a0a0a]">
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="notes" hint="internal only">
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this order…"
                />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel className="p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/80">
              line_items
            </span>
            <button
              type="button"
              onClick={addItem}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 hover:text-glitch-cyan transition-colors"
            >
              + add_item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const product = productMap.get(item.productId);
              return (
                <div
                  key={item.key}
                  className="grid grid-cols-12 gap-3 items-start border-l-2 border-white/10 pl-4 py-1"
                >
                  <div className="col-span-12 md:col-span-5">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-1.5">
                      product · #{idx + 1}
                    </span>
                    <Select
                      value={item.productId}
                      onChange={(e) => updateItem(item.key, { productId: e.target.value })}
                      disabled={loadingProducts || products.length === 0}
                    >
                      {products.length === 0 && (
                        <option value="">no products available</option>
                      )}
                      {products.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#0a0a0a]">
                          {p.name} — ${p.price.toFixed(2)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-1.5">
                      qty
                    </span>
                    <TextInput
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.key, { quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-5 md:col-span-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-1.5">
                      price_override
                    </span>
                    <TextInput
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={
                        product ? `default ${product.price.toFixed(2)}` : ""
                      }
                      value={item.priceOverride}
                      onChange={(e) =>
                        updateItem(item.key, { priceOverride: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      disabled={items.length === 1}
                      className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 hover:text-glitch-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-end justify-between border-t border-white/8 pt-5">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
              preview_total
            </span>
            <span className="font-display text-3xl tracking-tight text-glitch-cyan">
              ${previewTotal.toFixed(2)}
            </span>
          </div>
        </Panel>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting || products.length === 0}>
            {submitting ? "filing…" : "file_order"}
          </Button>
          <LinkButton href="/admin/orders" variant="secondary">
            cancel
          </LinkButton>
        </div>
      </form>
    </PageShell>
  );
}

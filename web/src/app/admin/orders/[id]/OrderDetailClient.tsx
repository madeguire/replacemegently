"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Button,
  ErrorBanner,
  Field,
  PageHeader,
  PageShell,
  Panel,
  Select,
  StatusBadge,
  TextArea,
  TextInput,
} from "../../_components/AdminUI";
import {
  deleteOrder,
  getOrder,
  ORDER_STATUSES,
  updateOrder,
  type Order,
  type OrderStatus,
} from "@/lib/admin-api";

export default function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [status, setStatus] = useState<OrderStatus>("pending");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(null);
    setError(null);
    getOrder(id)
      .then((o) => {
        if (cancelled) return;
        setOrder(o);
        setStatus(o.status);
        setNotes(o.notes ?? "");
        setCustomerName(o.customerName);
        setCustomerEmail(o.customerEmail);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load order");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateOrder(order.id, {
        status,
        notes: notes.trim() ? notes : null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
      });
      setOrder(updated);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!order) return;
    if (!confirm(`Delete order ${order.id}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteOrder(order.id);
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
  }

  if (!order && !error) {
    return (
      <PageShell>
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_order
        </div>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        {error && <ErrorBanner message={error} />}
        <div className="pt-6">
          <Link
            href="/admin/orders"
            className="font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-cyan transition-colors"
          >
            ← back_to_orders
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-cyan transition-colors"
        >
          ← orders
        </Link>
      </div>

      <PageHeader
        eyebrow={`orders / ${order.id}`}
        title={order.customerName}
        description={order.customerEmail}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      {savedFlash && (
        <div
          className="border border-glitch-cyan/40 bg-glitch-cyan/[0.05] text-glitch-cyan font-mono text-[11px] tracking-wider px-4 py-3 mb-6"
          style={{ animation: "glitch-shift 0.6s steps(8) 1" }}
        >
          ack // saved at {new Date().toISOString().slice(11, 19)}Z
        </div>
      )}

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8">
        <Panel className="p-6 md:p-8">
          <div className="space-y-1 mb-6">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block">
              line_items
            </span>
            <h2 className="font-display text-xl tracking-tight">Cargo manifest</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                <Th>product</Th>
                <Th align="right">qty</Th>
                <Th align="right">unit_price</Th>
                <Th align="right">subtotal</Th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="font-body text-[13px] text-white">
                      {item.productName ?? item.productId}
                    </div>
                    <div className="font-mono text-[10px] text-white/40 mt-0.5">
                      {item.productId}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[12px] text-white/80">
                    × {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[12px] text-white/60">
                    ${item.priceAtPurchase.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-[13px] text-white">
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-4 py-5 text-right font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                  total
                </td>
                <td className="px-4 py-5 text-right font-display text-3xl tracking-tight text-glitch-cyan">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="border-t border-white/8 mt-2 pt-5 grid grid-cols-2 gap-4 font-mono text-[10px] tracking-wider text-white/40">
            <div>
              <span className="block text-white/30 uppercase tracking-[0.2em]">received</span>
              <span className="text-white/70 mt-1 block">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="block text-white/30 uppercase tracking-[0.2em]">last_update</span>
              <span className="text-white/70 mt-1 block">{formatDate(order.updatedAt)}</span>
            </div>
          </div>
        </Panel>

        <form onSubmit={onSave} className="space-y-6">
          <Panel className="p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block">
                operations
              </span>
              <h2 className="font-display text-xl tracking-tight">Update record</h2>
            </div>

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

            <Field label="customer_name">
              <TextInput
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Field>

            <Field label="customer_email">
              <TextInput
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </Field>

            <Field label="notes" hint="internal only">
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes…"
              />
            </Field>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "transmitting…" : "save_changes"}
              </Button>
            </div>
          </Panel>

          <Panel className="p-6 md:p-8 space-y-3 border-glitch-red/20">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-red/70 block">
              danger_zone
            </span>
            <p className="font-mono text-[11px] text-white/50">
              Permanently delete this order and all of its line items. This cannot be undone.
            </p>
            <div>
              <Button
                type="button"
                variant="danger"
                onClick={onDelete}
                disabled={deleting}
              >
                {deleting ? "deleting…" : "delete_order"}
              </Button>
            </div>
          </Panel>
        </form>
      </div>
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
      className={`px-4 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 font-normal ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 19)}Z`;
}

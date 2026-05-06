"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  EmptyState,
  ErrorBanner,
  LinkButton,
  PageHeader,
  PageShell,
  Panel,
  StatusBadge,
} from "../_components/AdminUI";
import {
  listOrders,
  ORDER_STATUSES,
  type OrderStatus,
  type OrderSummary,
} from "@/lib/admin-api";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "all" },
  ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
];

export default function OrdersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as OrderStatus | null) ?? null;
  const [filter, setFilter] = useState<OrderStatus | "all">(
    initialStatus && ORDER_STATUSES.includes(initialStatus) ? initialStatus : "all",
  );
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(null);
    setError(null);
    listOrders({ status: filter === "all" ? undefined : filter })
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load orders");
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  function selectFilter(next: OrderStatus | "all") {
    setFilter(next);
    const sp = new URLSearchParams();
    if (next !== "all") sp.set("status", next);
    const qs = sp.toString();
    router.replace(`/admin/orders${qs ? `?${qs}` : ""}`);
  }

  const counts = useMemo(() => {
    const result: Record<OrderStatus | "all", number> = {
      all: orders?.length ?? 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders ?? []) result[o.status] += 1;
    return result;
  }, [orders]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="orders / 04"
        title="Order channel"
        description="Track every order. Filter by state, drill into a record, or file a manual entry. Stripe pipeline arrives later."
        action={<LinkButton href="/admin/orders/new">+ new_order</LinkButton>}
      />

      {error && <ErrorBanner message={error} />}

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mr-1">
          filter /
        </span>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => selectFilter(f.value)}
              className={`font-mono text-[11px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-150 ${
                active
                  ? "border-glitch-cyan text-glitch-cyan bg-glitch-cyan/[0.06]"
                  : "border-white/12 text-white/50 hover:border-white/40 hover:text-white"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-2 text-white/30">{counts[f.value]}</span>
              )}
            </button>
          );
        })}
      </div>

      {!orders && !error && (
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_orders
        </div>
      )}

      {orders && orders.length === 0 && (
        <EmptyState
          title="No orders match"
          description={
            filter === "all"
              ? "No orders yet. Create one manually or wait for the Stripe pipeline."
              : `No orders with status "${filter}". Try another filter.`
          }
          action={
            filter === "all" ? (
              <LinkButton href="/admin/orders/new">+ new_order</LinkButton>
            ) : undefined
          }
        />
      )}

      {orders && orders.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-white/8">
                <Th>order_id</Th>
                <Th>customer</Th>
                <Th>status</Th>
                <Th align="right">items</Th>
                <Th align="right">total</Th>
                <Th>received</Th>
                <Th align="right">{""}</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025] transition-colors animate-fade-up cursor-pointer"
                  style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-[12px] text-glitch-cyan">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top max-w-0">
                    <div className="font-body text-[13px] text-white truncate">
                      {order.customerName}
                    </div>
                    <div className="font-mono text-[10px] text-white/40 truncate">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 align-top text-right font-mono text-[11px] text-white/60">
                    {order.itemCount}
                  </td>
                  <td className="px-5 py-4 align-top text-right font-mono text-[13px] text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 align-top font-mono text-[10px] text-white/40">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 hover:text-glitch-cyan transition-colors"
                    >
                      open →
                    </Link>
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)}`;
}

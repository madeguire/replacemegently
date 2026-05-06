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
  StatusBadge,
} from "./_components/AdminUI";
import {
  fetchCollections,
  fetchProducts,
  listOrders,
  ORDER_STATUSES,
  type OrderStatus,
  type OrderSummary,
} from "@/lib/admin-api";
import type { Collection, Product } from "@/data/store";

interface DashboardData {
  products: Product[];
  collections: Collection[];
  recentOrders: OrderSummary[];
  statusCounts: Record<OrderStatus, number>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, collections, orders] = await Promise.all([
          fetchProducts(),
          fetchCollections(),
          listOrders(),
        ]);

        const counts: Record<OrderStatus, number> = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        };
        for (const o of orders) counts[o.status] += 1;

        if (!cancelled) {
          setData({
            products,
            collections,
            recentOrders: orders.slice(0, 6),
            statusCounts: counts,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load console");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell>
      <PageHeader
        eyebrow="dashboard / 01"
        title="Console overview"
        description="Operational telemetry across inventory and order channels. Read-only summary; deep ops live in the channels to the left."
        action={<LinkButton href="/admin/orders/new">+ new_order</LinkButton>}
      />

      {error && <ErrorBanner message={error} />}

      {!data && !error && (
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_telemetry
        </div>
      )}

      {data && (
        <div className="space-y-12 animate-fade-up">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              eyebrow="inventory.products"
              value={data.products.length}
              footer="total_skus"
            />
            <StatCard
              eyebrow="inventory.collections"
              value={data.collections.length}
              footer="curated_groups"
            />
            <StatCard
              eyebrow="orders.open"
              value={
                data.statusCounts.pending + data.statusCounts.processing
              }
              footer={`pending: ${data.statusCounts.pending} / processing: ${data.statusCounts.processing}`}
              accent
            />
            <StatCard
              eyebrow="orders.completed"
              value={data.statusCounts.delivered}
              footer={`shipped: ${data.statusCounts.shipped} / cancelled: ${data.statusCounts.cancelled}`}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block">
                  status_distribution
                </span>
                <h2 className="font-display text-xl tracking-tight">
                  Orders by state
                </h2>
              </div>
              <Link
                href="/admin/orders"
                className="font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-cyan transition-colors"
              >
                view_all →
              </Link>
            </div>
            <Panel className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-white/8">
              {ORDER_STATUSES.map((status) => (
                <Link
                  key={status}
                  href={`/admin/orders?status=${status}`}
                  className="px-5 py-5 hover:bg-white/[0.03] transition-colors"
                >
                  <StatusBadge status={status} />
                  <div className="font-display text-3xl tracking-tight mt-3">
                    {data.statusCounts[status]}
                  </div>
                </Link>
              ))}
            </Panel>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block">
                  recent_orders
                </span>
                <h2 className="font-display text-xl tracking-tight">
                  Latest signals
                </h2>
              </div>
              <Link
                href="/admin/orders"
                className="font-mono text-[10px] tracking-wider text-white/40 hover:text-glitch-cyan transition-colors"
              >
                all_orders →
              </Link>
            </div>

            {data.recentOrders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                description="Once orders start flowing in, the latest 6 will appear here. You can also create one manually."
                action={
                  <LinkButton href="/admin/orders/new">+ new_order</LinkButton>
                }
              />
            ) : (
              <Panel>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8">
                      <Th>order_id</Th>
                      <Th>customer</Th>
                      <Th>status</Th>
                      <Th align="right">total</Th>
                      <Th>received</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order, i) => (
                      <tr
                        key={order.id}
                        className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.025] transition-colors animate-fade-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono text-[12px] text-glitch-cyan hover:text-white transition-colors"
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-5 py-4 max-w-0">
                          <div className="font-body text-[13px] text-white truncate">
                            {order.customerName}
                          </div>
                          <div className="font-mono text-[10px] text-white/40 truncate">
                            {order.customerEmail}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-[13px] text-white">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px] text-white/40">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}

function StatCard({
  eyebrow,
  value,
  footer,
  accent,
}: {
  eyebrow: string;
  value: number;
  footer: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative border bg-white/[0.02] px-5 py-6 overflow-hidden ${
        accent ? "border-glitch-cyan/40" : "border-white/8"
      }`}
    >
      {accent && (
        <div
          aria-hidden
          className="absolute top-0 left-0 h-px w-12 bg-glitch-cyan"
          style={{ animation: "hero-corruption-1 6s step-end infinite" }}
        />
      )}
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 block">
        {eyebrow}
      </span>
      <div
        className={`font-display text-5xl tracking-tight mt-4 leading-none ${
          accent ? "text-glitch-cyan" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="font-mono text-[10px] tracking-wider text-white/30 mt-3">
        {footer}
      </div>
    </div>
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

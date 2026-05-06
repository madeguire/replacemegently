import { Suspense } from "react";

import OrdersClient from "./OrdersClient";

export default function OrdersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-[11px] tracking-wider text-white/30">
          ··· loading_orders
        </div>
      }
    >
      <OrdersClient />
    </Suspense>
  );
}

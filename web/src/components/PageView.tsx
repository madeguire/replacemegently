"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export interface PageViewProps {
  /** Stable route key, e.g. "shop", "product" */
  page: string;
  /** Product slug/id for PDP */
  productId?: string;
}

export default function PageView({ page, productId }: PageViewProps) {
  useEffect(() => {
    track(
      "page_view",
      productId ? { page, product_id: productId } : { page }
    );
  }, [page, productId]);

  return null;
}

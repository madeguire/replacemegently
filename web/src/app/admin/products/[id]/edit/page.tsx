import { notFound } from "next/navigation";

import { PageHeader, PageShell } from "../../../_components/AdminUI";
import { getProductById } from "@/lib/catalog-api";
import ProductForm from "../../ProductForm";

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">,
) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <PageShell>
      <PageHeader
        eyebrow={`inventory / edit / ${product.id}`}
        title={product.name}
        description="Modify any field except the slug. Changes propagate immediately to the storefront."
      />
      <ProductForm mode="edit" initial={product} />
    </PageShell>
  );
}

import { PageHeader, PageShell } from "../../_components/AdminUI";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="inventory / new_product"
        title="File a new SKU"
        description="Add a new product to the catalog. Slug becomes the URL path; pick the host collection carefully — it cannot move easily."
      />
      <ProductForm mode="create" />
    </PageShell>
  );
}

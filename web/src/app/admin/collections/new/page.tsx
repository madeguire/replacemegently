import { PageHeader, PageShell } from "../../_components/AdminUI";
import CollectionForm from "../CollectionForm";

export default function NewCollectionPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="inventory / new_collection"
        title="Open a new collection"
        description="A collection groups products under a shared narrative. Slug becomes the URL path."
      />
      <CollectionForm mode="create" />
    </PageShell>
  );
}

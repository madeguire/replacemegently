import { notFound } from "next/navigation";

import { PageHeader, PageShell } from "../../../_components/AdminUI";
import { getCollectionById } from "@/lib/catalog-api";
import CollectionForm from "../../CollectionForm";

export default async function EditCollectionPage(
  props: PageProps<"/admin/collections/[id]/edit">,
) {
  const { id } = await props.params;
  const collection = await getCollectionById(id);
  if (!collection) notFound();

  return (
    <PageShell>
      <PageHeader
        eyebrow={`inventory / edit / ${collection.id}`}
        title={collection.name}
        description="Update the collection's narrative and cover image. The slug is permanent."
      />
      <CollectionForm mode="edit" initial={collection} />
    </PageShell>
  );
}

import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage(
  props: PageProps<"/admin/orders/[id]">,
) {
  const { id } = await props.params;
  return <OrderDetailClient id={id} />;
}

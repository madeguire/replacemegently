import { proxyAdmin } from "../../_shared";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">,
) {
  const { id } = await context.params;
  return proxyAdmin({
    method: "PUT",
    path: `/admin/catalog/products/${encodeURIComponent(id)}`,
    request,
  });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/products/[id]">,
) {
  const { id } = await context.params;
  return proxyAdmin({
    method: "DELETE",
    path: `/admin/catalog/products/${encodeURIComponent(id)}`,
  });
}

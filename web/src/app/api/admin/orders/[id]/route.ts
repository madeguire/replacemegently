import { proxyAdmin } from "../../_shared";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/orders/[id]">,
) {
  const { id } = await context.params;
  return proxyAdmin({
    method: "GET",
    path: `/admin/orders/${encodeURIComponent(id)}`,
  });
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/orders/[id]">,
) {
  const { id } = await context.params;
  return proxyAdmin({
    method: "PUT",
    path: `/admin/orders/${encodeURIComponent(id)}`,
    request,
  });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/orders/[id]">,
) {
  const { id } = await context.params;
  return proxyAdmin({
    method: "DELETE",
    path: `/admin/orders/${encodeURIComponent(id)}`,
  });
}

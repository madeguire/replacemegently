import { proxyAdmin } from "../_shared";

export async function POST(request: Request) {
  return proxyAdmin({ method: "POST", path: "/admin/catalog/collections", request });
}

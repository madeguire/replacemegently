import { proxyAdmin } from "../_shared";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qs = url.search;
  return proxyAdmin({ method: "GET", path: `/admin/orders${qs}` });
}

export async function POST(request: Request) {
  return proxyAdmin({ method: "POST", path: "/admin/orders", request });
}

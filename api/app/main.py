from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.routers import (
    admin_catalog,
    admin_orders,
    auth,
    checkout,
    collections,
    health,
    products,
)

API_DESCRIPTION = """
Catalog API for the **Replace me gently** storefront — human-made objects for the age of AI.

Read-only endpoints backed by PostgreSQL that power the Next.js web app.

- Browse products with `GET /products` (filter by `category` or `collection`).
- Look up a single product with `GET /products/{product_id}`.
- Browse collections with `GET /collections` (response includes a computed `itemCount`).
- Liveness check at `GET /health`.

> Auth and write endpoints are intentionally out of scope for this slice.
"""

TAGS_METADATA = [
    {"name": "health", "description": "Service liveness checks."},
    {"name": "products", "description": "Browse and look up products in the catalog."},
    {
        "name": "collections",
        "description": "Curated groupings of products. Item counts are computed on read.",
    },
    {
        "name": "auth",
        "description": "Account registration, login, and current-user lookup. Bearer JWTs.",
    },
    {
        "name": "admin",
        "description": (
            "Admin-only write endpoints for inventory and orders. Requires a bearer token "
            "for a user with `is_admin = true`."
        ),
    },
]

STATIC_DIR = Path(__file__).parent / "static"
SWAGGER_CSS_PATH = STATIC_DIR / "swagger-skillful.css"


def _swagger_css_url() -> str:
    try:
        version = int(SWAGGER_CSS_PATH.stat().st_mtime)
    except OSError:
        version = 0
    return f"/static/swagger-skillful.css?v={version}"


def _branded_swagger_html(openapi_url: str, title: str) -> HTMLResponse:
    """Render Swagger UI wrapped in the Analog API branded shell."""
    base = get_swagger_ui_html(
        openapi_url=openapi_url,
        title=f"{title} — archive",
        swagger_css_url=_swagger_css_url(),
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
        swagger_ui_parameters={
            "defaultModelsExpandDepth": 1,
            "displayRequestDuration": True,
            "tryItOutEnabled": True,
            "docExpansion": "list",
            "filter": True,
            "syntaxHighlight.theme": "obsidian",
        },
    )
    body = base.body.decode("utf-8")

    topbar = """
    <header class="skillful-topbar">
      <div class="skillful-topbar__telemetry" aria-hidden="true">
        <span class="skillful-topbar__telemetry-item skillful-topbar__telemetry-item--rec">
          <span class="skillful-topbar__telemetry-dot"></span>REC
        </span>
        <span class="skillful-topbar__telemetry-item">tape_03 / track_01</span>
        <span class="skillful-topbar__telemetry-item">channel: catalog</span>
        <span class="skillful-topbar__telemetry-item">uplink: -42dB</span>
        <span class="skillful-topbar__telemetry-item">frame 002,341,887</span>
        <span class="skillful-topbar__telemetry-item skillful-topbar__telemetry-item--coord">
          N40&deg;44&apos;56&quot; W74&deg;00&apos;21&quot;
        </span>
        <span class="skillful-topbar__telemetry-item skillful-topbar__telemetry-item--ts">
          2026.04.28&nbsp;02:14:07Z
        </span>
      </div>

      <div class="skillful-topbar__inner">
        <div class="skillful-topbar__brand">
          <span class="skillful-topbar__eyebrow">api_archive_v0_1_0</span>
          <h1 class="skillful-topbar__title"><em data-text="Analog">Analog</em> API</h1>
          <span class="skillful-topbar__sub">
            human_verified // observed_not_watched // tape_remaining: 21%
          </span>
        </div>
        <div class="skillful-topbar__meta">
          <span class="skillful-topbar__chip skillful-topbar__chip--warn">WARN &#x25AE; unencrypted_session</span>
          <span class="skillful-topbar__chip">signal: nominal</span>
          <span class="skillful-topbar__chip">
            <a href="/redoc">/redoc</a>
            <span aria-hidden="true">&middot;</span>
            <a href="/openapi.json">/openapi.json</a>
            <span aria-hidden="true">&middot;</span>
            <a href="http://localhost:3000">storefront</a>
          </span>
        </div>
      </div>
    </header>
    """

    footer = """
    <footer class="skillful-footer">
      <span>analog_api / catalog / read-only</span>
      <span class="skillful-footer__signal">human_verified // designed by people. for now.</span>
    </footer>
    """

    body = body.replace("<body>", f"<body>{topbar}", 1)
    body = body.replace("</body>", f"{footer}</body>", 1)
    return HTMLResponse(content=body, media_type="text/html")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Analog API",
        version="0.1.0",
        summary="Verified analog. Catalog API for the Replace me gently storefront.",
        description=API_DESCRIPTION,
        openapi_tags=TAGS_METADATA,
        contact={"name": "Replace me gently", "url": "http://localhost:3000"},
        license_info={"name": "MIT"},
        docs_url=None,
        redoc_url=None,
        openapi_url="/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    @app.get("/docs", include_in_schema=False)
    def custom_swagger_ui() -> HTMLResponse:
        return _branded_swagger_html(
            openapi_url=app.openapi_url or "/openapi.json",
            title=app.title,
        )

    @app.get("/redoc", include_in_schema=False)
    def custom_redoc() -> HTMLResponse:
        return get_redoc_html(
            openapi_url=app.openapi_url or "/openapi.json",
            title=f"{app.title} — reference",
            redoc_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
        )

    app.include_router(health.router)
    app.include_router(products.router)
    app.include_router(collections.router)
    app.include_router(auth.router)
    app.include_router(checkout.router)
    app.include_router(admin_catalog.router)
    app.include_router(admin_orders.router)

    return app


app = create_app()

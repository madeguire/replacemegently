from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    summary="Liveness check",
    description="Returns a static `{ \"status\": \"ok\" }` payload. Used by uptime checks and the web smoke test.",
    responses={200: {"content": {"application/json": {"example": {"status": "ok"}}}}},
)
def health() -> dict[str, str]:
    return {"status": "ok"}

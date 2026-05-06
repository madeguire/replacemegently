from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Product
from app.schemas.product import ProductRead

router = APIRouter(prefix="/products", tags=["products"])


@router.get(
    "",
    response_model=list[ProductRead],
    response_model_by_alias=True,
    summary="List products",
    description=(
        "Returns all products ordered by name. "
        "Optionally filter by `category` (exact match, case-sensitive) or by `collection` slug."
    ),
)
def list_products(
    category: str | None = Query(
        default=None,
        description="Exact category name to filter on, e.g. `Apparel`.",
        examples=["Apparel"],
    ),
    collection_id: str | None = Query(
        default=None,
        alias="collection",
        description="Collection slug to filter on, e.g. `ai-does-it-better`.",
        examples=["ai-does-it-better"],
    ),
    db: Session = Depends(get_db),
) -> list[Product]:
    stmt = select(Product).order_by(Product.name)
    if category:
        stmt = stmt.where(Product.category == category)
    if collection_id:
        stmt = stmt.where(Product.collection_id == collection_id)
    return list(db.scalars(stmt).all())


@router.get(
    "/{product_id}",
    response_model=ProductRead,
    response_model_by_alias=True,
    summary="Get a product by id",
    description="Look up a single product by its slug. Returns `404` if no such product exists.",
    responses={
        404: {
            "description": "Product not found.",
            "content": {"application/json": {"example": {"detail": "Product not found"}}},
        },
    },
)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

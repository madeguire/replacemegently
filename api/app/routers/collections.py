from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.collection import Collection
from app.models.product import Product
from app.schemas.collection import CollectionRead

router = APIRouter(prefix="/collections", tags=["collections"])


def _serialize(collection: Collection, item_count: int) -> CollectionRead:
    return CollectionRead.model_validate(
        {
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "image_url": collection.image_url,
            "item_count": item_count,
        }
    )


@router.get(
    "",
    response_model=list[CollectionRead],
    response_model_by_alias=True,
    summary="List collections",
    description=(
        "Returns all collections ordered by name. "
        "`itemCount` is computed from a `COUNT(*)` of related products at request time."
    ),
)
def list_collections(db: Session = Depends(get_db)) -> list[CollectionRead]:
    stmt = (
        select(Collection, func.count(Product.id).label("item_count"))
        .outerjoin(Product, Product.collection_id == Collection.id)
        .group_by(Collection.id)
        .order_by(Collection.name)
    )
    rows = db.execute(stmt).all()
    return [_serialize(collection, item_count) for collection, item_count in rows]


@router.get(
    "/{collection_id}",
    response_model=CollectionRead,
    response_model_by_alias=True,
    summary="Get a collection by id",
    description="Look up a single collection by its slug. Returns `404` if no such collection exists.",
    responses={
        404: {
            "description": "Collection not found.",
            "content": {"application/json": {"example": {"detail": "Collection not found"}}},
        },
    },
)
def get_collection(
    collection_id: str,
    db: Session = Depends(get_db),
) -> CollectionRead:
    collection = db.get(Collection, collection_id)
    if collection is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    item_count = db.scalar(
        select(func.count(Product.id)).where(Product.collection_id == collection_id)
    ) or 0
    return _serialize(collection, int(item_count))

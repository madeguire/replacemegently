"""Admin write endpoints for the catalog (products + collections)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.collection import Collection
from app.models.product import Product
from app.schemas.collection import CollectionCreate, CollectionRead, CollectionUpdate
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate

router = APIRouter(
    prefix="/admin/catalog",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
    responses={
        401: {"description": "Missing or invalid token."},
        403: {"description": "Admin privileges required."},
    },
)


# ── Products ──────────────────────────────────────────────────────────────────


@router.post(
    "/products",
    response_model=ProductRead,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Create a product",
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
) -> Product:
    if db.get(Product, payload.id) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product with that id already exists",
        )
    if db.get(Collection, payload.collection) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Collection does not exist",
        )

    product = Product(
        id=payload.id,
        name=payload.name,
        price=payload.price,
        category=payload.category,
        tagline=payload.tagline,
        replacement_likelihood=payload.replacement_likelihood,
        image_url=payload.image,
        collection_id=payload.collection,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put(
    "/products/{product_id}",
    response_model=ProductRead,
    response_model_by_alias=True,
    summary="Update a product",
)
def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    data = payload.model_dump(exclude_unset=True)

    if "collection" in data:
        new_collection = data.pop("collection")
        if db.get(Collection, new_collection) is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Collection does not exist",
            )
        product.collection_id = new_collection

    if "image" in data:
        product.image_url = data.pop("image")

    for field, value in data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete(
    "/products/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Delete a product",
)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
) -> Response:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ── Collections ───────────────────────────────────────────────────────────────


def _serialize_collection(collection: Collection, item_count: int) -> CollectionRead:
    return CollectionRead.model_validate(
        {
            "id": collection.id,
            "name": collection.name,
            "description": collection.description,
            "image_url": collection.image_url,
            "item_count": item_count,
        }
    )


@router.post(
    "/collections",
    response_model=CollectionRead,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Create a collection",
)
def create_collection(
    payload: CollectionCreate,
    db: Session = Depends(get_db),
) -> CollectionRead:
    if db.get(Collection, payload.id) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Collection with that id already exists",
        )

    collection = Collection(
        id=payload.id,
        name=payload.name,
        description=payload.description,
        image_url=payload.image,
    )
    db.add(collection)
    db.commit()
    db.refresh(collection)
    return _serialize_collection(collection, 0)


@router.put(
    "/collections/{collection_id}",
    response_model=CollectionRead,
    response_model_by_alias=True,
    summary="Update a collection",
)
def update_collection(
    collection_id: str,
    payload: CollectionUpdate,
    db: Session = Depends(get_db),
) -> CollectionRead:
    collection = db.get(Collection, collection_id)
    if collection is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

    data = payload.model_dump(exclude_unset=True)
    if "image" in data:
        collection.image_url = data.pop("image")
    for field, value in data.items():
        setattr(collection, field, value)

    db.commit()
    db.refresh(collection)
    item_count = db.scalar(
        select(func.count(Product.id)).where(Product.collection_id == collection_id)
    ) or 0
    return _serialize_collection(collection, int(item_count))


@router.delete(
    "/collections/{collection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Delete a collection",
)
def delete_collection(
    collection_id: str,
    db: Session = Depends(get_db),
) -> Response:
    collection = db.get(Collection, collection_id)
    if collection is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    try:
        db.delete(collection)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Collection still has products. Move or delete products first.",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)

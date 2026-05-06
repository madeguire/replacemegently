"""Admin endpoints for managing customer orders."""
from __future__ import annotations

import secrets
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, selectinload

from app.core.security import require_admin
from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import (
    OrderCreate,
    OrderItemRead,
    OrderRead,
    OrderSummary,
    OrderUpdate,
)

router = APIRouter(
    prefix="/admin/orders",
    tags=["admin"],
    dependencies=[Depends(require_admin)],
    responses={
        401: {"description": "Missing or invalid token."},
        403: {"description": "Admin privileges required."},
    },
)


def _new_order_id() -> str:
    """Short, URL-safe order id, e.g. `ORD-A8KQ2P`."""
    return f"ORD-{secrets.token_hex(4).upper()}"


def _new_item_id() -> str:
    return f"ITM-{secrets.token_hex(4).upper()}"


def _order_total(items: list[OrderItem]) -> Decimal:
    return sum((item.price_at_purchase * item.quantity for item in items), start=Decimal("0"))


def _serialize_order(order: Order) -> OrderRead:
    items: list[OrderItemRead] = []
    for item in order.items:
        items.append(
            OrderItemRead.model_validate(
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product.name if item.product else None,
                    "quantity": item.quantity,
                    "price_at_purchase": item.price_at_purchase,
                }
            )
        )
    return OrderRead.model_validate(
        {
            "id": order.id,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "status": order.status,
            "notes": order.notes,
            "total": _order_total(order.items),
            "item_count": sum(item.quantity for item in order.items),
            "items": items,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
        }
    )


def _serialize_summary(order: Order, total: Decimal, item_count: int) -> OrderSummary:
    return OrderSummary.model_validate(
        {
            "id": order.id,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "status": order.status,
            "total": total,
            "item_count": item_count,
            "created_at": order.created_at,
        }
    )


@router.get(
    "",
    response_model=list[OrderSummary],
    response_model_by_alias=True,
    summary="List orders",
    description=(
        "Returns the most recent orders first. Filter by `status` (pending / processing / "
        "shipped / delivered / cancelled). `total` and `itemCount` are computed on read."
    ),
)
def list_orders(
    status_filter: OrderStatus | None = Query(
        default=None,
        alias="status",
        description="Optional status to filter on.",
    ),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[OrderSummary]:
    stmt = (
        select(
            Order,
            func.coalesce(
                func.sum(OrderItem.price_at_purchase * OrderItem.quantity), 0
            ).label("total"),
            func.coalesce(func.sum(OrderItem.quantity), 0).label("item_count"),
        )
        .outerjoin(OrderItem, OrderItem.order_id == Order.id)
        .group_by(Order.id)
        .order_by(desc(Order.created_at))
        .limit(limit)
        .offset(offset)
    )
    if status_filter is not None:
        stmt = stmt.where(Order.status == status_filter)

    rows = db.execute(stmt).all()
    return [_serialize_summary(order, Decimal(total), int(item_count)) for order, total, item_count in rows]


@router.get(
    "/{order_id}",
    response_model=OrderRead,
    response_model_by_alias=True,
    summary="Get an order by id",
    responses={
        404: {
            "description": "Order not found.",
            "content": {"application/json": {"example": {"detail": "Order not found"}}},
        },
    },
)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
) -> OrderRead:
    order = db.scalar(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.id == order_id)
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return _serialize_order(order)


@router.post(
    "",
    response_model=OrderRead,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    summary="Create an order",
    description=(
        "Manually create an order with one or more line items. If `priceAtPurchase` is omitted "
        "for a line item, the current product price is snapshotted."
    ),
)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
) -> OrderRead:
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item",
        )

    product_ids = [item.product_id for item in payload.items]
    products: dict[str, Product] = {
        p.id: p for p in db.scalars(select(Product).where(Product.id.in_(product_ids))).all()
    }
    missing = [pid for pid in product_ids if pid not in products]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown product id(s): {', '.join(missing)}",
        )

    order = Order(
        id=_new_order_id(),
        customer_name=payload.customer_name,
        customer_email=str(payload.customer_email),
        status=payload.status,
        notes=payload.notes,
    )
    db.add(order)

    for line in payload.items:
        product = products[line.product_id]
        price = line.price_at_purchase if line.price_at_purchase is not None else product.price
        order.items.append(
            OrderItem(
                id=_new_item_id(),
                product_id=line.product_id,
                quantity=line.quantity,
                price_at_purchase=price,
            )
        )

    db.commit()

    refreshed = db.scalar(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.id == order.id)
    )
    assert refreshed is not None
    return _serialize_order(refreshed)


@router.put(
    "/{order_id}",
    response_model=OrderRead,
    response_model_by_alias=True,
    summary="Update an order's status, customer info, or notes",
)
def update_order(
    order_id: str,
    payload: OrderUpdate,
    db: Session = Depends(get_db),
) -> OrderRead:
    order = db.scalar(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.id == order_id)
    )
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        if field == "customer_email" and value is not None:
            setattr(order, field, str(value))
        else:
            setattr(order, field, value)

    db.commit()
    db.refresh(order)
    return _serialize_order(order)


@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Delete an order",
)
def delete_order(
    order_id: str,
    db: Session = Depends(get_db),
) -> Response:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    db.delete(order)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

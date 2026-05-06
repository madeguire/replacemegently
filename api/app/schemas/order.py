from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    """Line item input when creating an order."""

    model_config = ConfigDict(populate_by_name=True)

    product_id: str = Field(
        validation_alias="productId",
        serialization_alias="productId",
        description="Slug of an existing product.",
    )
    quantity: int = Field(ge=1)
    price_at_purchase: Decimal | None = Field(
        default=None,
        ge=0,
        validation_alias="priceAtPurchase",
        serialization_alias="priceAtPurchase",
        description="Optional explicit price; defaults to the current product price.",
    )


class OrderItemRead(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    product_id: str = Field(
        serialization_alias="productId",
        validation_alias="product_id",
    )
    product_name: str | None = Field(
        default=None,
        serialization_alias="productName",
    )
    quantity: int
    price_at_purchase: Decimal = Field(
        serialization_alias="priceAtPurchase",
        validation_alias="price_at_purchase",
    )

    @field_serializer("price_at_purchase")
    def _serialize_price(self, value: Decimal) -> float:
        return float(value)


class OrderCreate(BaseModel):
    """Payload for `POST /admin/orders`."""

    model_config = ConfigDict(populate_by_name=True)

    customer_name: str = Field(
        min_length=1,
        max_length=160,
        validation_alias="customerName",
        serialization_alias="customerName",
    )
    customer_email: EmailStr = Field(
        validation_alias="customerEmail",
        serialization_alias="customerEmail",
    )
    status: OrderStatus = OrderStatus.PENDING
    notes: str | None = Field(default=None, max_length=2000)
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderUpdate(BaseModel):
    """Payload for `PUT /admin/orders/{id}` — status + notes only for now."""

    model_config = ConfigDict(populate_by_name=True)

    status: OrderStatus | None = None
    notes: str | None = Field(default=None, max_length=2000)
    customer_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=160,
        validation_alias="customerName",
        serialization_alias="customerName",
    )
    customer_email: EmailStr | None = Field(
        default=None,
        validation_alias="customerEmail",
        serialization_alias="customerEmail",
    )


class OrderRead(BaseModel):
    """Order detail with line items."""

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    customer_name: str = Field(
        serialization_alias="customerName",
        validation_alias="customer_name",
    )
    customer_email: str = Field(
        serialization_alias="customerEmail",
        validation_alias="customer_email",
    )
    status: OrderStatus
    notes: str | None = None
    total: Decimal = Field(default=Decimal(0))
    item_count: int = Field(
        default=0,
        serialization_alias="itemCount",
        validation_alias="item_count",
    )
    items: list[OrderItemRead] = Field(default_factory=list)
    created_at: datetime = Field(
        serialization_alias="createdAt",
        validation_alias="created_at",
    )
    updated_at: datetime = Field(
        serialization_alias="updatedAt",
        validation_alias="updated_at",
    )

    @field_serializer("total")
    def _serialize_total(self, value: Decimal) -> float:
        return float(value)


class OrderSummary(BaseModel):
    """Compact order shape for list views."""

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    customer_name: str = Field(
        serialization_alias="customerName",
        validation_alias="customer_name",
    )
    customer_email: str = Field(
        serialization_alias="customerEmail",
        validation_alias="customer_email",
    )
    status: OrderStatus
    total: Decimal = Field(default=Decimal(0))
    item_count: int = Field(
        default=0,
        serialization_alias="itemCount",
    )
    created_at: datetime = Field(
        serialization_alias="createdAt",
        validation_alias="created_at",
    )

    @field_serializer("total")
    def _serialize_total(self, value: Decimal) -> float:
        return float(value)

"""Public checkout endpoints — Stripe Checkout Session creation and webhook handling."""
from __future__ import annotations

import logging
import secrets
from decimal import Decimal

import stripe
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/checkout", tags=["checkout"])

FREE_SHIPPING_THRESHOLD = Decimal("75")
SHIPPING_COST = Decimal("8")


class LineItem(BaseModel):
    product_id: str = Field(alias="productId")
    size: str
    quantity: int = Field(ge=1)


class CreateCheckoutRequest(BaseModel):
    items: list[LineItem] = Field(min_length=1)
    success_url: str = Field(alias="successUrl")
    cancel_url: str = Field(alias="cancelUrl")


class CreateCheckoutResponse(BaseModel):
    url: str


def _get_stripe_client() -> stripe.StripeClient:
    settings = get_settings()
    return stripe.StripeClient(settings.stripe_secret_key)


@router.post(
    "/create-session",
    response_model=CreateCheckoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Create a Stripe Checkout Session",
)
def create_checkout_session(
    payload: CreateCheckoutRequest,
    db: Session = Depends(get_db),
) -> CreateCheckoutResponse:
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

    subtotal = sum(
        products[item.product_id].price * item.quantity for item in payload.items
    )
    shipping = Decimal("0") if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST

    line_items: list[dict] = []
    for item in payload.items:
        product = products[item.product_id]
        product_data: dict = {
            "name": product.name,
            "description": f"Size: {item.size}",
            "metadata": {"product_id": product.id, "size": item.size},
        }
        if product.image_url and product.image_url.startswith("http"):
            product_data["images"] = [product.image_url]

        line_items.append({
            "price_data": {
                "currency": "usd",
                "unit_amount": int(product.price * 100),
                "product_data": product_data,
            },
            "quantity": item.quantity,
        })

    if shipping > 0:
        line_items.append({
            "price_data": {
                "currency": "usd",
                "unit_amount": int(shipping * 100),
                "product_data": {"name": "Shipping"},
            },
            "quantity": 1,
        })

    client = _get_stripe_client()

    try:
        session = client.v1.checkout.sessions.create(
            params={
                "mode": "payment",
                "line_items": line_items,
                "success_url": payload.success_url + "?session_id={CHECKOUT_SESSION_ID}",
                "cancel_url": payload.cancel_url,
                "metadata": {
                    "shipping_cost": str(shipping),
                },
            }
        )
    except stripe.StripeError as e:
        logger.error("Stripe session creation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Payment provider error. Please try again.",
        )

    if not session.url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Payment provider returned no redirect URL.",
        )

    return CreateCheckoutResponse(url=session.url)


def _new_order_id() -> str:
    return f"ORD-{secrets.token_hex(4).upper()}"


def _new_item_id() -> str:
    return f"ITM-{secrets.token_hex(4).upper()}"


def _fulfill_order(session: stripe.checkout.Session, db: Session) -> None:
    """Create a DB order from a completed Stripe Checkout Session."""
    existing = db.scalar(
        select(Order).where(Order.stripe_checkout_session_id == session.id)
    )
    if existing:
        logger.info("Order already exists for session %s — skipping", session.id)
        return

    client = _get_stripe_client()
    full_session = client.v1.checkout.sessions.retrieve(
        session.id,
        params={"expand": ["line_items.data.price.product"]},
    )

    customer_email = full_session.customer_details.email if full_session.customer_details else "unknown@example.com"
    customer_name = full_session.customer_details.name if full_session.customer_details else "Customer"
    shipping_cost = Decimal(full_session.metadata.get("shipping_cost", "0")) if full_session.metadata else Decimal("0")

    order = Order(
        id=_new_order_id(),
        customer_name=customer_name or "Customer",
        customer_email=customer_email or "unknown@example.com",
        status=OrderStatus.PAID,
        stripe_checkout_session_id=session.id,
        stripe_payment_intent_id=full_session.payment_intent if isinstance(full_session.payment_intent, str) else None,
        shipping_cost=shipping_cost,
    )
    db.add(order)

    if full_session.line_items and full_session.line_items.data:
        for li in full_session.line_items.data:
            metadata = {}
            if li.price and li.price.product and hasattr(li.price.product, "metadata"):
                metadata = li.price.product.metadata or {}

            product_id = metadata.get("product_id")
            if not product_id:
                continue

            product = db.get(Product, product_id)
            if not product:
                continue

            order.items.append(
                OrderItem(
                    id=_new_item_id(),
                    product_id=product_id,
                    quantity=li.quantity or 1,
                    price_at_purchase=product.price,
                )
            )

    db.commit()
    logger.info("Created order %s from Stripe session %s", order.id, session.id)


@router.post(
    "/webhook",
    status_code=status.HTTP_200_OK,
    summary="Stripe webhook receiver",
    include_in_schema=False,
)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="stripe-signature", default=""),
    db: Session = Depends(get_db),
) -> dict:
    settings = get_settings()
    payload = await request.body()

    if settings.stripe_webhook_secret:
        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=stripe_signature,
                secret=settings.stripe_webhook_secret,
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        import json
        event = stripe.Event.construct_from(json.loads(payload), stripe.api_key or "")

    if event.type == "checkout.session.completed":
        session = event.data.object
        _fulfill_order(session, db)

    return {"status": "ok"}

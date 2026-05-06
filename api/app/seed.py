"""Idempotent seed of catalog data mirrored from web/src/data/store.ts.

Run from api/ with the virtualenv active:
  python -m app.seed
  python -m app.seed make-admin user@example.com
"""
from __future__ import annotations

import sys
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from app.db.session import SessionLocal
from app.models.collection import Collection
from app.models.product import Product
from app.models.user import User

COLLECTIONS: list[dict] = [
    {
        "id": "ai-does-it-better",
        "name": "For When AI Does It Better",
        "description": "Tools for accepting the inevitable.",
        "image_url": "/product-pixels-hoodie.png",
    },
    {
        "id": "legacy-skills",
        "name": "Legacy Skills",
        "description": "Celebrating the crafts that got us here.",
        "image_url": "/product-notebook.png",
    },
    {
        "id": "existential-crisis",
        "name": "For Your Existential Crisis",
        "description": "Because you're more than your Figma files.",
        "image_url": "/product-deprecated-tote.png",
    },
    {
        "id": "career-pivot",
        "name": "Career Pivot Essentials",
        "description": "New chapter. Same anxiety.",
        "image_url": "/product-career-pivot-pack.png",
    },
    {
        "id": "denial-phase",
        "name": "Denial Phase",
        "description": "Everything is fine. This is fine.",
        "image_url": "/product-water-bottle.png",
    },
]

PRODUCTS: list[dict] = [
    {
        "id": "automated-mug",
        "name": "This Could've Been Automated Mug",
        "price": Decimal("28"),
        "category": "Mugs",
        "tagline": "Your morning ritual, soon to be optimized.",
        "replacement_likelihood": 87,
        "collection_id": "ai-does-it-better",
        "image_url": "/product-mug.png",
    },
    {
        "id": "pixels-hoodie",
        "name": "I Used to Move Pixels Hoodie",
        "price": Decimal("65"),
        "category": "Apparel",
        "tagline": "A warm reminder of manual labor.",
        "replacement_likelihood": 73,
        "collection_id": "legacy-skills",
        "image_url": "/product-pixels-hoodie.png",
    },
    {
        "id": "deprecated-tote",
        "name": "Human Touch (Deprecated) Tote",
        "price": Decimal("34"),
        "category": "Bags",
        "tagline": "Carry your emotional baggage in style.",
        "replacement_likelihood": 62,
        "collection_id": "existential-crisis",
        "image_url": "/product-deprecated-tote.png",
    },
    {
        "id": "research-notebook",
        "name": "User Research Said Nothing Notebook",
        "price": Decimal("22"),
        "category": "Notebooks",
        "tagline": "192 pages of unvalidated assumptions.",
        "replacement_likelihood": 91,
        "collection_id": "ai-does-it-better",
        "image_url": "/product-notebook.png",
    },
    {
        "id": "pivot-pack",
        "name": "Career Pivot Starter Pack",
        "price": Decimal("48"),
        "category": "Kits",
        "tagline": "Everything you need to start over. Again.",
        "replacement_likelihood": 95,
        "collection_id": "career-pivot",
        "image_url": "/product-career-pivot-pack.png",
    },
    {
        "id": "thinking-bottle",
        "name": "Design Thinking\u2122 Water Bottle",
        "price": Decimal("32"),
        "category": "Bottles",
        "tagline": "Stay hydrated through the ideation phase.",
        "replacement_likelihood": 44,
        "collection_id": "denial-phase",
        "image_url": "/product-water-bottle.png",
    },
    {
        "id": "replace-stickers",
        "name": "Replace Me Gently Sticker Pack",
        "price": Decimal("18"),
        "category": "Stickers",
        "tagline": "Apply to laptop. Apply to life.",
        "replacement_likelihood": 56,
        "collection_id": "existential-crisis",
        "image_url": "/product-sticker-pack.png",
    },
    {
        "id": "prompt-tee",
        "name": "Prompt Engineer (Emotionally) Tee",
        "price": Decimal("42"),
        "category": "Apparel",
        "tagline": "You've been re-titled, not replaced.",
        "replacement_likelihood": 79,
        "collection_id": "career-pivot",
        "image_url": "/product-prompt-tee.png",
    },
]


def seed() -> None:
    with SessionLocal() as session:
        collection_stmt = insert(Collection).values(COLLECTIONS)
        collection_stmt = collection_stmt.on_conflict_do_update(
            index_elements=[Collection.id],
            set_={
                "name": collection_stmt.excluded.name,
                "description": collection_stmt.excluded.description,
                "image_url": collection_stmt.excluded.image_url,
            },
        )
        session.execute(collection_stmt)

        product_stmt = insert(Product).values(PRODUCTS)
        product_stmt = product_stmt.on_conflict_do_update(
            index_elements=[Product.id],
            set_={
                "name": product_stmt.excluded.name,
                "price": product_stmt.excluded.price,
                "category": product_stmt.excluded.category,
                "tagline": product_stmt.excluded.tagline,
                "replacement_likelihood": product_stmt.excluded.replacement_likelihood,
                "collection_id": product_stmt.excluded.collection_id,
                "image_url": product_stmt.excluded.image_url,
            },
        )
        session.execute(product_stmt)

        session.commit()

    print(f"Seeded {len(COLLECTIONS)} collections and {len(PRODUCTS)} products.")


def make_admin(email: str) -> None:
    """Promote an existing user to admin. Raises if the user does not exist."""
    with SessionLocal() as session:
        user = session.scalar(select(User).where(User.email == email))
        if user is None:
            raise SystemExit(f"No user found with email: {email}")
        if user.is_admin:
            print(f"User {email} is already an admin.")
            return
        user.is_admin = True
        session.commit()
        print(f"Promoted {email} to admin.")


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "make-admin":
        if len(sys.argv) < 3:
            raise SystemExit("Usage: python -m app.seed make-admin <email>")
        make_admin(sys.argv[2])
    else:
        seed()

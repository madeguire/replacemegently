"""add stripe payment fields to orders

Revision ID: e8b4c2d1f5a7
Revises: d7a3b9e1f2c4
Create Date: 2026-05-12 12:00:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op


revision: str = 'e8b4c2d1f5a7'
down_revision: Union[str, None] = 'd7a3b9e1f2c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'paid' BEFORE 'processing'")

    op.execute("""
        ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT UNIQUE,
            ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
            ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0
    """)


def downgrade() -> None:
    op.execute("""
        ALTER TABLE orders
            DROP COLUMN IF EXISTS shipping_cost,
            DROP COLUMN IF EXISTS stripe_payment_intent_id,
            DROP COLUMN IF EXISTS stripe_checkout_session_id
    """)
    # PostgreSQL doesn't support removing enum values; the 'paid' value will remain.

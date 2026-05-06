"""add orders and order_items tables

Revision ID: d7a3b9e1f2c4
Revises: c2e9f1a4d8b3
Create Date: 2026-05-06 12:30:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op


revision: str = 'd7a3b9e1f2c4'
down_revision: Union[str, None] = 'c2e9f1a4d8b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use raw SQL throughout to avoid SQLAlchemy's ORM-level Enum type events,
    # which fire on op.create_table even when create_type=False is set on the
    # inline Enum — because env.py imports the Order model whose mapped Enum
    # has create_type=True and gets resolved from global metadata.
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE order_status AS ENUM
                ('pending','processing','shipped','delivered','cancelled');
        EXCEPTION WHEN duplicate_object THEN null;
        END $$
    """)

    op.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id              TEXT        NOT NULL PRIMARY KEY,
            customer_name   TEXT        NOT NULL,
            customer_email  TEXT        NOT NULL,
            status          order_status NOT NULL DEFAULT 'pending',
            notes           TEXT,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_orders_customer_email ON orders (customer_email)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_orders_status ON orders (status)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders (created_at)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id               TEXT           NOT NULL PRIMARY KEY,
            order_id         TEXT           NOT NULL
                REFERENCES orders(id) ON DELETE CASCADE,
            product_id       TEXT           NOT NULL
                REFERENCES products(id) ON DELETE RESTRICT,
            quantity         INTEGER        NOT NULL DEFAULT 1,
            price_at_purchase NUMERIC(10,2) NOT NULL
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items (order_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_order_items_product_id ON order_items (product_id)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_order_items_product_id")
    op.execute("DROP INDEX IF EXISTS ix_order_items_order_id")
    op.execute("DROP TABLE IF EXISTS order_items")

    op.execute("DROP INDEX IF EXISTS ix_orders_created_at")
    op.execute("DROP INDEX IF EXISTS ix_orders_status")
    op.execute("DROP INDEX IF EXISTS ix_orders_customer_email")
    op.execute("DROP TABLE IF EXISTS orders")

    op.execute("DROP TYPE IF EXISTS order_status")

"""add is_admin to users

Revision ID: c2e9f1a4d8b3
Revises: b1f4d5a8c2e0
Create Date: 2026-05-06 12:20:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c2e9f1a4d8b3'
down_revision: Union[str, None] = 'b1f4d5a8c2e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'is_admin',
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:
    op.drop_column('users', 'is_admin')

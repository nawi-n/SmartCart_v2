"""Add is_active column to users table

Revision ID: add_users_table
Revises: 8bd3e14862ed
Create Date: 2024-04-06 22:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_users_table'
down_revision: Union[str, None] = '8bd3e14862ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add is_active column to users table."""
    # Add is_active column with default value True
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'))


def downgrade() -> None:
    """Remove is_active column from users table."""
    op.drop_column('users', 'is_active')
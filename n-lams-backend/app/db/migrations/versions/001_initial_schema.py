"""Initial N-LAMS database schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-12 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Schema tables are created directly via Base.metadata.create_all() for zero friction
    pass

def downgrade():
    pass

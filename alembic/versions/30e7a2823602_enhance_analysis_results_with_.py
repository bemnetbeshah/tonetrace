"""enhance_analysis_results_with_versioning_and_metadata

Revision ID: 30e7a2823602
Revises: 42f01ba3b0b7
Create Date: 2025-08-09 23:34:38.969270

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '30e7a2823602'
down_revision: Union[str, Sequence[str], None] = '42f01ba3b0b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add new columns to analysis_results table
    op.add_column('analysis_results', sa.Column('analyzer_version', sa.String(50), nullable=True, server_default='v1'))
    op.add_column('analysis_results', sa.Column('status', sa.String(20), nullable=True, server_default='ok'))
    op.add_column('analysis_results', sa.Column('error_message', sa.String(500), nullable=True))
    op.add_column('analysis_results', sa.Column('duration_ms', sa.Integer(), nullable=True))
    
    # Create submission_summaries table
    op.create_table('submission_summaries',
        sa.Column('submission_id', sa.Integer(), nullable=False),
        sa.Column('sentiment_score', sa.Float(), nullable=True),
        sa.Column('tone_primary', sa.String(100), nullable=True),
        sa.Column('readability_grade', sa.Float(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['submission_id'], ['submissions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('submission_id')
    )
    
    # Create composite index for analysis_results
    op.create_index('ix_analysis_results_submission_analyzer', 'analysis_results', ['submission_id', 'analyzer_name'])
    
    # Create GIN index on result_json for efficient JSON queries
    op.execute('CREATE INDEX ix_analysis_results_jsonb ON analysis_results USING GIN (result_json)')


def downgrade() -> None:
    """Downgrade schema."""
    # Drop GIN index
    op.execute('DROP INDEX IF EXISTS ix_analysis_results_jsonb')
    
    # Drop composite index
    op.drop_index('ix_analysis_results_submission_analyzer', table_name='analysis_results')
    
    # Drop submission_summaries table
    op.drop_table('submission_summaries')
    
    # Drop columns from analysis_results table
    op.drop_column('analysis_results', 'duration_ms')
    op.drop_column('analysis_results', 'error_message')
    op.drop_column('analysis_results', 'status')
    op.drop_column('analysis_results', 'analyzer_version')

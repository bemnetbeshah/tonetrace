"""rename_users_to_students_and_add_name

Revision ID: 4166ebc15bbd
Revises: 30e7a2823602
Create Date: 2025-08-12 18:26:29.420865

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4166ebc15bbd'
down_revision: Union[str, Sequence[str], None] = '30e7a2823602'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename users table to students
    op.rename_table('users', 'students')
    
    # Add name column to students table
    op.add_column('students', sa.Column('name', sa.String(255), nullable=True))
    
    # Update foreign key references in submissions table
    op.drop_constraint('submissions_user_id_fkey', 'submissions', type_='foreignkey')
    op.create_foreign_key('submissions_student_id_fkey', 'submissions', 'students', ['user_id'], ['id'], ondelete='CASCADE')
    
    # Rename the user_id column to student_id in submissions table
    op.alter_column('submissions', 'user_id', new_column_name='student_id')
    
    # Update the foreign key constraint name to match the new column name
    op.drop_constraint('submissions_student_id_fkey', 'submissions', type_='foreignkey')
    op.create_foreign_key('submissions_student_id_fkey', 'submissions', 'students', ['student_id'], ['id'], ondelete='CASCADE')
    
    # Update index names
    op.drop_index('ix_users_email', table_name='students')
    op.drop_index('ix_users_id', table_name='students')
    op.create_index('ix_students_email', 'students', ['email'], unique=True)
    op.create_index('ix_students_id', 'students', ['id'], unique=False)
    
    # Update submissions table index
    op.drop_index('ix_submissions_user_id', table_name='submissions')
    op.create_index('ix_submissions_student_id', 'submissions', ['student_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Revert index changes
    op.drop_index('ix_submissions_student_id', table_name='submissions')
    op.create_index('ix_submissions_user_id', 'submissions', ['user_id'], unique=False)
    
    op.drop_index('ix_students_email', table_name='students')
    op.drop_index('ix_students_id', table_name='students')
    op.create_index('ix_users_email', 'students', ['email'], unique=True)
    op.create_index('ix_users_id', 'students', ['id'], unique=False)
    
    # Revert foreign key changes
    op.drop_constraint('submissions_student_id_fkey', 'submissions', type_='foreignkey')
    op.create_foreign_key('submissions_user_id_fkey', 'submissions', 'students', ['student_id'], ['id'], ondelete='CASCADE')
    
    # Revert column name change
    op.alter_column('submissions', 'student_id', new_column_name='user_id')
    
    # Update foreign key constraint to match
    op.drop_constraint('submissions_user_id_fkey', 'submissions', type_='foreignkey')
    op.create_foreign_key('submissions_user_id_fkey', 'submissions', 'students', ['user_id'], ['id'], ondelete='CASCADE')
    
    # Remove name column
    op.drop_column('students', 'name')
    
    # Rename table back to users
    op.rename_table('students', 'users')

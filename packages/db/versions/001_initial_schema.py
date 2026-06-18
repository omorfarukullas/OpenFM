"""initial_schema

Revision ID: 001
Revises: 
Create Date: 2026-06-18 20:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. users
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('email', sa.Text(), nullable=False),
        sa.Column('username', sa.Text(), nullable=False),
        sa.Column('hashed_password', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )

    # 2. leagues
    op.create_table('leagues',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('country', sa.Text(), nullable=False),
        sa.Column('season', sa.Integer(), nullable=False),
        sa.Column('total_matchdays', sa.Integer(), server_default='38', nullable=False),
        sa.Column('current_matchday', sa.Integer(), server_default='0', nullable=False),
        sa.Column('status', postgresql.ENUM('pending', 'active', 'finished', name='leaguestatus'), server_default='pending', nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # 3. clubs
    op.create_table('clubs',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('stadium_name', sa.Text(), nullable=True),
        sa.Column('country', sa.Text(), nullable=True),
        sa.Column('league_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('budget', sa.BigInteger(), server_default='50000000', nullable=False),
        sa.Column('reputation', sa.SmallInteger(), server_default='5', nullable=False),
        sa.Column('tactics', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
        sa.Column('is_user_club', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('reputation >= 1 AND reputation <= 20', name='check_reputation'),
        sa.ForeignKeyConstraint(['league_id'], ['leagues.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 4. players
    op.create_table('players',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('age', sa.SmallInteger(), nullable=True),
        sa.Column('nationality', sa.Text(), nullable=True),
        sa.Column('position', postgresql.ENUM('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', name='player_position'), nullable=True),
        sa.Column('pace', sa.SmallInteger(), nullable=True),
        sa.Column('shooting', sa.SmallInteger(), nullable=True),
        sa.Column('passing', sa.SmallInteger(), nullable=True),
        sa.Column('dribbling', sa.SmallInteger(), nullable=True),
        sa.Column('defending', sa.SmallInteger(), nullable=True),
        sa.Column('physical', sa.SmallInteger(), nullable=True),
        sa.Column('goalkeeping', sa.SmallInteger(), nullable=True),
        sa.Column('potential', sa.SmallInteger(), nullable=True),
        sa.Column('overall', sa.SmallInteger(), sa.Computed('(pace + shooting + passing + dribbling + defending + physical + goalkeeping) / 7', persisted=True), nullable=True),
        sa.Column('market_value', sa.BigInteger(), nullable=True),
        sa.Column('weak_foot', sa.SmallInteger(), server_default='3', nullable=True),
        sa.Column('form', sa.SmallInteger(), server_default='50', nullable=True),
        sa.Column('morale', sa.SmallInteger(), server_default='70', nullable=True),
        sa.Column('archived', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('defending >= 1 AND defending <= 99', name='check_defending'),
        sa.CheckConstraint('dribbling >= 1 AND dribbling <= 99', name='check_dribbling'),
        sa.CheckConstraint('form >= 0 AND form <= 100', name='check_form'),
        sa.CheckConstraint('goalkeeping >= 1 AND goalkeeping <= 99', name='check_goalkeeping'),
        sa.CheckConstraint('morale >= 0 AND morale <= 100', name='check_morale'),
        sa.CheckConstraint('pace >= 1 AND pace <= 99', name='check_pace'),
        sa.CheckConstraint('passing >= 1 AND passing <= 99', name='check_passing'),
        sa.CheckConstraint('physical >= 1 AND physical <= 99', name='check_physical'),
        sa.CheckConstraint('potential >= 1 AND potential <= 99', name='check_potential'),
        sa.CheckConstraint('shooting >= 1 AND shooting <= 99', name='check_shooting'),
        sa.CheckConstraint('weak_foot >= 1 AND weak_foot <= 5', name='check_weak_foot'),
        sa.ForeignKeyConstraint(['club_id'], ['clubs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_players_club_id', 'players', ['club_id'], unique=False)

    # 5. matches
    op.create_table('matches',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('league_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('home_club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('away_club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('matchday', sa.SmallInteger(), nullable=True),
        sa.Column('home_goals', sa.SmallInteger(), nullable=True),
        sa.Column('away_goals', sa.SmallInteger(), nullable=True),
        sa.Column('home_xg', sa.Numeric(precision=4, scale=2), nullable=True),
        sa.Column('away_xg', sa.Numeric(precision=4, scale=2), nullable=True),
        sa.Column('status', postgresql.ENUM('scheduled', 'live', 'finished', name='matchstatus'), server_default='scheduled', nullable=False),
        sa.Column('engine_seed', sa.BigInteger(), nullable=True),
        sa.Column('played_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['away_club_id'], ['clubs.id'], ),
        sa.ForeignKeyConstraint(['home_club_id'], ['clubs.id'], ),
        sa.ForeignKeyConstraint(['league_id'], ['leagues.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_matches_league_matchday', 'matches', ['league_id', 'matchday'], unique=False)

    # 6. match_events
    op.create_table('match_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('match_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('minute', sa.SmallInteger(), nullable=True),
        sa.Column('type', postgresql.ENUM('goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'own_goal', name='matcheventtype'), nullable=True),
        sa.Column('player_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('detail', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
        sa.ForeignKeyConstraint(['club_id'], ['clubs.id'], ),
        sa.ForeignKeyConstraint(['match_id'], ['matches.id'], ),
        sa.ForeignKeyConstraint(['player_id'], ['players.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_match_events_match_id', 'match_events', ['match_id'], unique=False)

    # 7. transfers
    op.create_table('transfers',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('player_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('from_club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('to_club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('fee', sa.BigInteger(), server_default='0', nullable=False),
        sa.Column('transfer_type', postgresql.ENUM('permanent', 'loan', 'free', name='transfertype'), nullable=True),
        sa.Column('season', sa.Integer(), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['from_club_id'], ['clubs.id'], ),
        sa.ForeignKeyConstraint(['player_id'], ['players.id'], ),
        sa.ForeignKeyConstraint(['to_club_id'], ['clubs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 8. training_sessions
    op.create_table('training_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('week_start', sa.Date(), nullable=True),
        sa.Column('focus', postgresql.ENUM('shooting', 'passing', 'defending', 'fitness', 'tactics', 'set_pieces', name='trainingfocus'), nullable=True),
        sa.Column('intensity', sa.SmallInteger(), server_default='3', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint('intensity >= 1 AND intensity <= 5', name='check_intensity'),
        sa.ForeignKeyConstraint(['club_id'], ['clubs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 9. injuries
    op.create_table('injuries',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('player_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('injury_type', sa.Text(), nullable=True),
        sa.Column('severity_weeks', sa.SmallInteger(), nullable=True),
        sa.Column('started_at', sa.Date(), nullable=True),
        sa.Column('expected_return', sa.Date(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.ForeignKeyConstraint(['player_id'], ['players.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 10. youth_players
    op.create_table('youth_players',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.Text(), nullable=True),
        sa.Column('age', sa.SmallInteger(), server_default='16', nullable=False),
        sa.Column('position', sa.Text(), nullable=True),
        sa.Column('potential', sa.SmallInteger(), nullable=True),
        sa.Column('promoted', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('scouted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['club_id'], ['clubs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 11. standings
    op.create_table('standings',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('league_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('club_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('played', sa.Integer(), server_default='0', nullable=False),
        sa.Column('won', sa.Integer(), server_default='0', nullable=False),
        sa.Column('drawn', sa.Integer(), server_default='0', nullable=False),
        sa.Column('lost', sa.Integer(), server_default='0', nullable=False),
        sa.Column('goals_for', sa.Integer(), server_default='0', nullable=False),
        sa.Column('goals_against', sa.Integer(), server_default='0', nullable=False),
        sa.Column('goal_difference', sa.Integer(), sa.Computed('goals_for - goals_against', persisted=True), nullable=True),
        sa.Column('points', sa.Integer(), sa.Computed('won * 3 + drawn', persisted=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['club_id'], ['clubs.id'], ),
        sa.ForeignKeyConstraint(['league_id'], ['leagues.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('league_id', 'club_id', name='uq_standings_league_club')
    )
    op.create_index('idx_standings_league_id', 'standings', ['league_id'], unique=False)

def downgrade() -> None:
    op.drop_table('standings')
    op.drop_table('youth_players')
    op.drop_table('injuries')
    op.drop_table('training_sessions')
    op.drop_table('transfers')
    op.drop_table('match_events')
    op.drop_table('matches')
    op.drop_table('players')
    op.drop_table('clubs')
    op.drop_table('leagues')
    op.drop_table('users')
    
    sa.Enum('pending', 'active', 'finished', name='leaguestatus').drop(op.get_bind())
    sa.Enum('GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', name='player_position').drop(op.get_bind())
    sa.Enum('scheduled', 'live', 'finished', name='matchstatus').drop(op.get_bind())
    sa.Enum('goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'own_goal', name='matcheventtype').drop(op.get_bind())
    sa.Enum('permanent', 'loan', 'free', name='transfertype').drop(op.get_bind())
    sa.Enum('shooting', 'passing', 'defending', 'fitness', 'tactics', 'set_pieces', name='trainingfocus').drop(op.get_bind())

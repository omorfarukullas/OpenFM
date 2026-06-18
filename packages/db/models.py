import uuid
import enum
from typing import Any, Optional
from datetime import datetime, date
from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Date,
    ForeignKey,
    BigInteger,
    SmallInteger,
    Numeric,
    Enum,
    Computed,
    JSON,
    CheckConstraint,
    Index,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class LeagueStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    finished = "finished"


class Position(str, enum.Enum):
    GK = "GK"
    CB = "CB"
    LB = "LB"
    RB = "RB"
    CDM = "CDM"
    CM = "CM"
    CAM = "CAM"
    LW = "LW"
    RW = "RW"
    ST = "ST"


class MatchStatus(str, enum.Enum):
    scheduled = "scheduled"
    live = "live"
    finished = "finished"


class MatchEventType(str, enum.Enum):
    goal = "goal"
    assist = "assist"
    yellow_card = "yellow_card"
    red_card = "red_card"
    substitution = "substitution"
    own_goal = "own_goal"


class TransferType(str, enum.Enum):
    permanent = "permanent"
    loan = "loan"
    free = "free"


class TrainingFocus(str, enum.Enum):
    shooting = "shooting"
    passing = "passing"
    defending = "defending"
    fitness = "fitness"
    tactics = "tactics"
    set_pieces = "set_pieces"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    email: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    username: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    hashed_password: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true")

    clubs: Mapped[list["Club"]] = relationship("Club", back_populates="user")


class League(Base):
    __tablename__ = "leagues"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name: Mapped[str] = mapped_column(Text, nullable=False)
    country: Mapped[str] = mapped_column(Text, nullable=False)
    season: Mapped[int] = mapped_column(Integer, nullable=False)
    total_matchdays: Mapped[int] = mapped_column(Integer, server_default="38")
    current_matchday: Mapped[int] = mapped_column(Integer, server_default="0")
    status: Mapped[LeagueStatus] = mapped_column(Enum(LeagueStatus), server_default="pending")

    clubs: Mapped[list["Club"]] = relationship("Club", back_populates="league")
    matches: Mapped[list["Match"]] = relationship("Match", back_populates="league")
    standings: Mapped[list["Standing"]] = relationship("Standing", back_populates="league")


class Club(Base):
    __tablename__ = "clubs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    stadium_name: Mapped[Optional[str]] = mapped_column(Text)
    country: Mapped[Optional[str]] = mapped_column(Text)
    league_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("leagues.id"))
    budget: Mapped[int] = mapped_column(BigInteger, server_default="50000000")
    reputation: Mapped[int] = mapped_column(SmallInteger, server_default="5")
    tactics: Mapped[Any] = mapped_column(JSONB, server_default="'{}'::jsonb")
    is_user_club: Mapped[bool] = mapped_column(Boolean, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("reputation >= 1 AND reputation <= 20", name="check_reputation"),
    )

    user: Mapped[Optional[User]] = relationship("User", back_populates="clubs")
    league: Mapped[Optional[League]] = relationship("League", back_populates="clubs")
    players: Mapped[list["Player"]] = relationship("Player", back_populates="club")
    home_matches: Mapped[list["Match"]] = relationship("Match", foreign_keys="Match.home_club_id", back_populates="home_club")
    away_matches: Mapped[list["Match"]] = relationship("Match", foreign_keys="Match.away_club_id", back_populates="away_club")
    standings: Mapped[list["Standing"]] = relationship("Standing", back_populates="club")


class Player(Base):
    __tablename__ = "players"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    age: Mapped[Optional[int]] = mapped_column(SmallInteger)
    nationality: Mapped[Optional[str]] = mapped_column(Text)
    position: Mapped[Optional[Position]] = mapped_column(Enum(Position, name="player_position"))
    
    pace: Mapped[Optional[int]] = mapped_column(SmallInteger)
    shooting: Mapped[Optional[int]] = mapped_column(SmallInteger)
    passing: Mapped[Optional[int]] = mapped_column(SmallInteger)
    dribbling: Mapped[Optional[int]] = mapped_column(SmallInteger)
    defending: Mapped[Optional[int]] = mapped_column(SmallInteger)
    physical: Mapped[Optional[int]] = mapped_column(SmallInteger)
    goalkeeping: Mapped[Optional[int]] = mapped_column(SmallInteger)
    potential: Mapped[Optional[int]] = mapped_column(SmallInteger)
    
    overall: Mapped[Optional[int]] = mapped_column(SmallInteger, Computed("(pace + shooting + passing + dribbling + defending + physical + goalkeeping) / 7", persisted=True))
    
    market_value: Mapped[Optional[int]] = mapped_column(BigInteger)
    weak_foot: Mapped[Optional[int]] = mapped_column(SmallInteger, server_default="3")
    form: Mapped[Optional[int]] = mapped_column(SmallInteger, server_default="50")
    morale: Mapped[Optional[int]] = mapped_column(SmallInteger, server_default="70")
    archived: Mapped[bool] = mapped_column(Boolean, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("pace >= 1 AND pace <= 99", name="check_pace"),
        CheckConstraint("shooting >= 1 AND shooting <= 99", name="check_shooting"),
        CheckConstraint("passing >= 1 AND passing <= 99", name="check_passing"),
        CheckConstraint("dribbling >= 1 AND dribbling <= 99", name="check_dribbling"),
        CheckConstraint("defending >= 1 AND defending <= 99", name="check_defending"),
        CheckConstraint("physical >= 1 AND physical <= 99", name="check_physical"),
        CheckConstraint("goalkeeping >= 1 AND goalkeeping <= 99", name="check_goalkeeping"),
        CheckConstraint("potential >= 1 AND potential <= 99", name="check_potential"),
        CheckConstraint("weak_foot >= 1 AND weak_foot <= 5", name="check_weak_foot"),
        CheckConstraint("form >= 0 AND form <= 100", name="check_form"),
        CheckConstraint("morale >= 0 AND morale <= 100", name="check_morale"),
        Index("idx_players_club_id", "club_id"),
    )

    club: Mapped[Optional[Club]] = relationship("Club", back_populates="players")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    league_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("leagues.id"))
    home_club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    away_club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    matchday: Mapped[Optional[int]] = mapped_column(SmallInteger)
    home_goals: Mapped[Optional[int]] = mapped_column(SmallInteger)
    away_goals: Mapped[Optional[int]] = mapped_column(SmallInteger)
    home_xg: Mapped[Optional[float]] = mapped_column(Numeric(4, 2))
    away_xg: Mapped[Optional[float]] = mapped_column(Numeric(4, 2))
    status: Mapped[MatchStatus] = mapped_column(Enum(MatchStatus), server_default="scheduled")
    engine_seed: Mapped[Optional[int]] = mapped_column(BigInteger)
    played_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_matches_league_matchday", "league_id", "matchday"),
    )

    league: Mapped[Optional[League]] = relationship("League", back_populates="matches")
    home_club: Mapped[Optional[Club]] = relationship("Club", foreign_keys=[home_club_id], back_populates="home_matches")
    away_club: Mapped[Optional[Club]] = relationship("Club", foreign_keys=[away_club_id], back_populates="away_matches")
    events: Mapped[list["MatchEvent"]] = relationship("MatchEvent", back_populates="match")


class MatchEvent(Base):
    __tablename__ = "match_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    match_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("matches.id"))
    minute: Mapped[Optional[int]] = mapped_column(SmallInteger)
    type: Mapped[Optional[MatchEventType]] = mapped_column(Enum(MatchEventType))
    player_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("players.id"))
    club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    detail: Mapped[Any] = mapped_column(JSONB, server_default="'{}'::jsonb")

    __table_args__ = (
        Index("idx_match_events_match_id", "match_id"),
    )

    match: Mapped[Optional[Match]] = relationship("Match", back_populates="events")


class Transfer(Base):
    __tablename__ = "transfers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    player_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("players.id"))
    from_club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True)
    to_club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"), nullable=True)
    fee: Mapped[int] = mapped_column(BigInteger, server_default="0")
    transfer_type: Mapped[Optional[TransferType]] = mapped_column(Enum(TransferType))
    season: Mapped[Optional[int]] = mapped_column(Integer)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    week_start: Mapped[Optional[date]] = mapped_column(Date)
    focus: Mapped[Optional[TrainingFocus]] = mapped_column(Enum(TrainingFocus))
    intensity: Mapped[int] = mapped_column(SmallInteger, server_default="3")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("intensity >= 1 AND intensity <= 5", name="check_intensity"),
    )


class Injury(Base):
    __tablename__ = "injuries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    player_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("players.id"))
    injury_type: Mapped[Optional[str]] = mapped_column(Text)
    severity_weeks: Mapped[Optional[int]] = mapped_column(SmallInteger)
    started_at: Mapped[Optional[date]] = mapped_column(Date)
    expected_return: Mapped[Optional[date]] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true")


class YouthPlayer(Base):
    __tablename__ = "youth_players"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    name: Mapped[Optional[str]] = mapped_column(Text)
    age: Mapped[int] = mapped_column(SmallInteger, server_default="16")
    position: Mapped[Optional[str]] = mapped_column(Text)
    potential: Mapped[Optional[int]] = mapped_column(SmallInteger)
    promoted: Mapped[bool] = mapped_column(Boolean, server_default="false")
    scouted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Standing(Base):
    __tablename__ = "standings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    league_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("leagues.id"))
    club_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("clubs.id"))
    played: Mapped[int] = mapped_column(Integer, server_default="0")
    won: Mapped[int] = mapped_column(Integer, server_default="0")
    drawn: Mapped[int] = mapped_column(Integer, server_default="0")
    lost: Mapped[int] = mapped_column(Integer, server_default="0")
    goals_for: Mapped[int] = mapped_column(Integer, server_default="0")
    goals_against: Mapped[int] = mapped_column(Integer, server_default="0")
    
    goal_difference: Mapped[int] = mapped_column(Integer, Computed("goals_for - goals_against", persisted=True))
    points: Mapped[int] = mapped_column(Integer, Computed("won * 3 + drawn", persisted=True))
    
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_standings_league_id", "league_id"),
        UniqueConstraint("league_id", "club_id", name="uq_standings_league_club"),
    )

    league: Mapped[Optional[League]] = relationship("League", back_populates="standings")
    club: Mapped[Optional[Club]] = relationship("Club", back_populates="standings")


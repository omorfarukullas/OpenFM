from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid

class StandingRow(BaseModel):
    id: uuid.UUID
    club_id: uuid.UUID
    club_name: Optional[str] = None
    played: int
    won: int
    drawn: int
    lost: int
    goals_for: int
    goals_against: int
    goal_difference: int
    points: int
    rank: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)

class LeagueResponse(BaseModel):
    id: uuid.UUID
    name: str
    country: str
    season: int
    total_matchdays: int
    current_matchday: int
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class LeagueDetailResponse(LeagueResponse):
    standings: List[StandingRow]

class FixtureResponse(BaseModel):
    id: uuid.UUID
    matchday: int
    home_club_id: uuid.UUID
    away_club_id: uuid.UUID
    home_club_name: Optional[str] = None
    away_club_name: Optional[str] = None
    home_goals: Optional[int] = None
    away_goals: Optional[int] = None
    status: str
    played_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
import uuid

class MatchEventResponse(BaseModel):
    id: uuid.UUID
    minute: int
    type: str
    player_id: Optional[uuid.UUID] = None
    player_name: Optional[str] = None
    club_id: Optional[uuid.UUID] = None
    detail: Any

    model_config = ConfigDict(from_attributes=True)

class MatchResponse(BaseModel):
    id: uuid.UUID
    league_id: uuid.UUID
    home_club_id: uuid.UUID
    away_club_id: uuid.UUID
    home_club_name: Optional[str] = None
    away_club_name: Optional[str] = None
    matchday: int
    home_goals: Optional[int] = None
    away_goals: Optional[int] = None
    home_xg: Optional[float] = None
    away_xg: Optional[float] = None
    status: str
    played_at: Optional[datetime] = None
    events: List[MatchEventResponse] = []

    model_config = ConfigDict(from_attributes=True)

class MatchSimulateResponse(BaseModel):
    status: str
    match: MatchResponse

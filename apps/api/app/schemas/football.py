from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime, date
import uuid

class LeagueResponse(BaseModel):
    id: uuid.UUID
    name: str
    country: str
    season: int
    total_matchdays: int
    current_matchday: int
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class ClubResponse(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID]
    name: str
    stadium_name: Optional[str]
    country: Optional[str]
    league_id: Optional[uuid.UUID]
    budget: int
    reputation: int
    is_user_club: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PlayerResponse(BaseModel):
    id: uuid.UUID
    club_id: Optional[uuid.UUID]
    name: str
    age: Optional[int]
    nationality: Optional[str]
    position: Optional[str]
    pace: Optional[int]
    shooting: Optional[int]
    passing: Optional[int]
    dribbling: Optional[int]
    defending: Optional[int]
    physical: Optional[int]
    goalkeeping: Optional[int]
    potential: Optional[int]
    overall: Optional[int]
    market_value: Optional[int]
    weak_foot: Optional[int]
    form: Optional[int]
    morale: Optional[int]
    archived: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class SquadSummary(BaseModel):
    total_players: int
    by_position: Dict[str, int]

class ClubCreate(BaseModel):
    name: str
    stadium_name: Optional[str] = None
    country: Optional[str] = None
    league_id: uuid.UUID

class ClubUpdate(BaseModel):
    tactics: Dict[str, Any]

class ClubResponse(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID]
    name: str
    stadium_name: Optional[str]
    country: Optional[str]
    league_id: Optional[uuid.UUID]
    league_name: Optional[str] = None
    budget: int
    reputation: int
    is_user_club: bool
    tactics: Dict[str, Any]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

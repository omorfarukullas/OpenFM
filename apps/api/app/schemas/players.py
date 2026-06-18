from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

class PlayerListItem(BaseModel):
    id: uuid.UUID
    name: str
    age: Optional[int]
    nationality: Optional[str]
    position: Optional[str]
    overall: Optional[int]
    market_value: Optional[int]
    
    model_config = ConfigDict(from_attributes=True)

class PlayerResponse(PlayerListItem):
    club_id: Optional[uuid.UUID]
    pace: Optional[int]
    shooting: Optional[int]
    passing: Optional[int]
    dribbling: Optional[int]
    defending: Optional[int]
    physical: Optional[int]
    goalkeeping: Optional[int]
    potential: Optional[int]
    weak_foot: Optional[int]
    form: Optional[int]
    morale: Optional[int]
    archived: bool
    created_at: datetime

class PlayerSearch(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    min_overall: Optional[int] = None
    max_age: Optional[int] = None
    club_id: Optional[uuid.UUID] = None

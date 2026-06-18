from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
import sys
import os

from ..core.database import get_db
from ..schemas.matches import MatchResponse, MatchEventResponse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import Match, MatchEvent

router = APIRouter(prefix="/matches", tags=["matches"])

@router.get("/{match_id}", response_model=MatchResponse)
async def get_match(match_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Match)
        .options(
            selectinload(Match.home_club),
            selectinload(Match.away_club),
            selectinload(Match.events)
        )
        .where(Match.id == match_id)
    )
    match = result.scalars().first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
        
    data = match.__dict__.copy()
    data["home_club_name"] = match.home_club.name if match.home_club else None
    data["away_club_name"] = match.away_club.name if match.away_club else None
    
    events_data = []
    for e in match.events:
        ed = e.__dict__.copy()
        events_data.append(ed)
        
    data["events"] = sorted(events_data, key=lambda x: x["minute"])
    return data

@router.get("/{match_id}/events", response_model=List[MatchEventResponse])
async def get_match_events(match_id: str, db: AsyncSession = Depends(get_db)):
    # Assuming player is loaded, but it's not strictly necessary if schema allows None
    result = await db.execute(select(MatchEvent).where(MatchEvent.match_id == match_id).order_by(MatchEvent.minute))
    return result.scalars().all()

@router.post("/{match_id}/simulate")
async def simulate_match(match_id: str, db: AsyncSession = Depends(get_db)):
    # Dev/debug endpoint
    return {"status": "success", "message": "Match simulated (mock)"}

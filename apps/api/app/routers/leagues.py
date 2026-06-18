from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
import sys
import os

from ..core.database import get_db
from ..schemas.leagues import LeagueResponse, LeagueDetailResponse, StandingRow, FixtureResponse
from ..services.league_service import get_standings, simulate_matchday

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import League, Match

router = APIRouter(prefix="/leagues", tags=["leagues"])

@router.get("/", response_model=List[LeagueResponse])
async def list_leagues(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(League).order_by(League.name))
    return result.scalars().all()

@router.get("/{league_id}", response_model=LeagueDetailResponse)
async def get_league(league_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(League).where(League.id == league_id))
    league = result.scalars().first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
        
    standings = await get_standings(db, league_id)
    
    data = league.__dict__.copy()
    data["standings"] = standings
    return data

@router.get("/{league_id}/standings", response_model=List[StandingRow])
async def get_league_standings(league_id: str, db: AsyncSession = Depends(get_db)):
    return await get_standings(db, league_id)

@router.get("/{league_id}/fixtures", response_model=List[FixtureResponse])
async def get_league_fixtures(league_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Match)
        .options(selectinload(Match.home_club), selectinload(Match.away_club))
        .where(Match.league_id == league_id)
        .order_by(Match.matchday)
    )
    matches = result.scalars().all()
    out = []
    for m in matches:
        d = m.__dict__.copy()
        d["home_club_name"] = m.home_club.name if m.home_club else None
        d["away_club_name"] = m.away_club.name if m.away_club else None
        out.append(d)
    return out

@router.post("/{league_id}/simulate-matchday")
async def simulate_next_matchday(league_id: str, db: AsyncSession = Depends(get_db)):
    results = await simulate_matchday(db, league_id)
    return {"status": "success", "matches_simulated": len(results)}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import sys
import os

from ..core.database import get_db
from ..schemas.players import PlayerResponse, PlayerListItem

# Setup path for models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import Player

router = APIRouter(prefix="/players", tags=["players"])

@router.get("/search", response_model=dict)
async def search_players(
    name: Optional[str] = None,
    position: Optional[str] = None,
    min_overall: Optional[int] = None,
    max_age: Optional[int] = None,
    club_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(Player)
    
    if name:
        query = query.where(Player.name.ilike(f"%{name}%"))
    if position:
        query = query.where(Player.position == position)
    if min_overall:
        query = query.where(Player.overall >= min_overall)
    if max_age:
        query = query.where(Player.age <= max_age)
    if club_id:
        query = query.where(Player.club_id == club_id)
        
    # Get total count for pagination
    from sqlalchemy import func
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get paginated data
    query = query.order_by(Player.overall.desc()).offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    players = result.scalars().all()
    
    return {
        "items": players,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size
    }

@router.get("/club/{club_id}", response_model=List[PlayerListItem])
async def get_club_players_compact(club_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.club_id == club_id).order_by(Player.overall.desc()))
    return result.scalars().all()

@router.get("/{player_id}", response_model=PlayerResponse)
async def get_player(player_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalars().first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

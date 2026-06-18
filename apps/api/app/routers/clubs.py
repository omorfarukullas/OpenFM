from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
import sys
import os

from ..core.database import get_db
from ..middleware.auth import get_current_user
from ..schemas.clubs import ClubCreate, ClubResponse, ClubUpdate
from ..schemas.players import PlayerResponse
from ..services.club_service import create_club, get_squad_summary

# Setup path for models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import Club, Player, User

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.post("/", response_model=ClubResponse, status_code=status.HTTP_201_CREATED)
async def create_user_club(club_data: ClubCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if user already has a club
    existing = await db.execute(select(Club).where(Club.user_id == current_user.id))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="User already manages a club")
        
    club = await create_club(db, str(current_user.id), club_data.model_dump())
    
    return club

@router.get("/my", response_model=ClubResponse)
async def get_my_club(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Club).options(selectinload(Club.league)).where(Club.user_id == current_user.id))
    club = result.scalars().first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    club_dict = club.__dict__.copy()
    if club.league:
        club_dict["league_name"] = club.league.name
    return club_dict

@router.get("/{club_id}", response_model=dict)
async def get_club(club_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Club).options(selectinload(Club.league)).where(Club.id == club_id))
    club = result.scalars().first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    squad_summary = await get_squad_summary(db, club_id)
    
    club_dict = club.__dict__.copy()
    if club.league:
        club_dict["league_name"] = club.league.name
        
    return {
        "club": club_dict,
        "squad_summary": squad_summary
    }

@router.get("/{club_id}/squad", response_model=List[PlayerResponse])
async def get_club_squad(club_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Player).where(Player.club_id == club_id).order_by(Player.overall.desc()))
    return result.scalars().all()

@router.patch("/{club_id}/tactics")
async def update_tactics(club_id: str, update_data: ClubUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Club).where(Club.id == club_id))
    club = result.scalars().first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    if str(club.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to edit this club's tactics")
        
    club.tactics = update_data.tactics
    await db.commit()
    return {"status": "success", "tactics": club.tactics}

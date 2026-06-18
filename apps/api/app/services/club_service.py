from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import sys
import os
import uuid

# Load Models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/db")))
from models import Club, Player, League

# Load Engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../packages/engine")))
from player_generator import generate_squad

async def create_club(db: AsyncSession, user_id: str, club_data: dict) -> Club:
    # Get league to determine country
    result = await db.execute(select(League).where(League.id == str(club_data["league_id"])))
    league = result.scalars().first()
    
    country = club_data.get("country") or (league.country if league else "England")
    
    new_club = Club(
        id=uuid.uuid4(),
        user_id=uuid.UUID(user_id),
        name=club_data["name"],
        stadium_name=club_data.get("stadium_name"),
        country=country,
        league_id=uuid.UUID(str(club_data["league_id"])),
        is_user_club=True,
        budget=10000000,
        reputation=5
    )
    db.add(new_club)
    
    # Generate the squad via engine
    players_data = generate_squad(str(new_club.id), country=country, count=25)
    for p_data in players_data:
        p_data.pop("overall", None) # Handled by PG GENERATED ALWAYS
        player = Player(**p_data)
        db.add(player)
        
    await db.commit()
    await db.refresh(new_club)
    return new_club

async def get_squad_summary(db: AsyncSession, club_id: str) -> dict:
    result = await db.execute(select(Player.position, func.count(Player.id)).where(Player.club_id == club_id).group_by(Player.position))
    counts = dict(result.all())
    total = sum(counts.values())
    return {"total_players": total, "by_position": counts}

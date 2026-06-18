from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import sys
import os
import uuid
from datetime import datetime

# Models
_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
sys.path.append(os.path.join(_BASE, "packages", "db"))
from models import League, Club, Match, MatchEvent, Player, Standing

# Services
from .standings_service import update_standings_for_match

# Engine
sys.path.append(os.path.join(_BASE, "packages", "engine"))
from match_engine import MatchEngine

async def get_standings(db: AsyncSession, league_id: str):
    query = select(Standing).options(selectinload(Standing.club)).where(Standing.league_id == league_id).order_by(
        Standing.points.desc(),
        Standing.goal_difference.desc(),
        Standing.goals_for.desc()
    )
    result = await db.execute(query)
    rows = []
    for rank, standing in enumerate(result.scalars().all(), 1):
        row = standing.__dict__.copy()
        row["rank"] = rank
        row["club_name"] = standing.club.name if standing.club else None
        rows.append(row)
    return rows

async def schedule_season(db: AsyncSession, league_id: str):
    res = await db.execute(select(Club).where(Club.league_id == league_id))
    clubs = res.scalars().all()
    if not clubs:
        return []

    # Initialize standings to 0
    for club in clubs:
        std_res = await db.execute(select(Standing).where(Standing.league_id == league_id, Standing.club_id == club.id))
        if not std_res.scalars().first():
            db.add(Standing(league_id=league_id, club_id=club.id))

    club_ids = [str(c.id) for c in clubs]
    if len(club_ids) % 2 != 0:
        club_ids.append(None) # Bye
        
    num_days = len(club_ids) - 1
    half_size = len(club_ids) // 2
    
    matches = []
    for matchday in range(1, num_days + 1):
        for i in range(half_size):
            home = club_ids[i]
            away = club_ids[len(club_ids) - 1 - i]
            
            if home is not None and away is not None:
                if matchday % 2 == 1:
                    matches.append((matchday, home, away))
                else:
                    matches.append((matchday, away, home))
                    
        # Rotate list
        club_ids = [club_ids[0]] + [club_ids[-1]] + club_ids[1:-1]
        
    # Schedule full season (Home and Away)
    total_matches = []
    for m in matches:
        match_obj = Match(id=uuid.uuid4(), league_id=league_id, home_club_id=m[1], away_club_id=m[2], matchday=m[0], status="scheduled")
        db.add(match_obj)
        total_matches.append(match_obj)
        
        match_obj_rev = Match(id=uuid.uuid4(), league_id=league_id, home_club_id=m[2], away_club_id=m[1], matchday=m[0] + num_days, status="scheduled")
        db.add(match_obj_rev)
        total_matches.append(match_obj_rev)
        
    await db.commit()
    return total_matches

async def simulate_matchday(db: AsyncSession, league_id: str):
    res = await db.execute(select(League).where(League.id == league_id))
    league = res.scalars().first()
    if not league:
        return []
        
    current_matchday = league.current_matchday + 1
    
    matches_res = await db.execute(select(Match).where(Match.league_id == league_id))
    if not matches_res.scalars().first():
        await schedule_season(db, league_id)
        
    day_matches_res = await db.execute(
        select(Match)
        .options(selectinload(Match.home_club), selectinload(Match.away_club))
        .where(Match.league_id == league_id, Match.matchday == current_matchday)
    )
    day_matches = day_matches_res.scalars().all()
    
    # Pre-fetch all players for all participating clubs in one query to avoid N+1 queries
    club_ids = set()
    for match in day_matches:
        if match.status != "finished":
            club_ids.add(match.home_club_id)
            club_ids.add(match.away_club_id)
            
    players_by_club = {cid: [] for cid in club_ids}
    if club_ids:
        all_players_res = await db.execute(select(Player).where(Player.club_id.in_(club_ids)))
        for p in all_players_res.scalars().all():
            players_by_club[p.club_id].append(p)
    
    results = []
    for match in day_matches:
        if match.status == "finished":
            continue
            
        home_squad = players_by_club.get(match.home_club_id, [])
        away_squad = players_by_club.get(match.away_club_id, [])
        
        sim_data = MatchEngine.simulate(home_squad, away_squad)
        
        match.home_goals = sim_data["home_goals"]
        match.away_goals = sim_data["away_goals"]
        match.home_xg = sim_data["home_xg"]
        match.away_xg = sim_data["away_xg"]
        match.status = "finished"
        match.played_at = datetime.utcnow()
        
        for ev in sim_data["events"]:
            event = MatchEvent(
                match_id=match.id,
                minute=ev["minute"],
                type=ev["type"],
                club_id=ev["club_id"],
                player_id=ev["player_id"],
                detail=ev["detail"]
            )
            db.add(event)
            
        await update_standings_for_match(db, league_id, match.home_club_id, match.away_club_id, match.home_goals, match.away_goals)
        
        # Build response dict
        m_dict = match.__dict__.copy()
        m_dict["home_club_name"] = match.home_club.name if match.home_club else None
        m_dict["away_club_name"] = match.away_club.name if match.away_club else None
        m_dict["events"] = []
        results.append(m_dict)
        
    if day_matches:
        league.current_matchday = current_matchday
        if league.current_matchday >= league.total_matchdays:
            league.status = "finished"
        else:
            league.status = "active"
            
    await db.commit()
    return results

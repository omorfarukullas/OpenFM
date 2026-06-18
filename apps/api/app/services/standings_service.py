from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../packages/db")))
from models import Standing, Match

async def update_standings_for_match(db: AsyncSession, league_id: str, home_club_id: str, away_club_id: str, home_goals: int, away_goals: int):
    # Update Home
    home_res = await db.execute(select(Standing).where(Standing.league_id == league_id, Standing.club_id == home_club_id))
    home_std = home_res.scalars().first()
    if not home_std:
        home_std = Standing(league_id=league_id, club_id=home_club_id)
        db.add(home_std)
        
    # Update Away
    away_res = await db.execute(select(Standing).where(Standing.league_id == league_id, Standing.club_id == away_club_id))
    away_std = away_res.scalars().first()
    if not away_std:
        away_std = Standing(league_id=league_id, club_id=away_club_id)
        db.add(away_std)

    home_std.played += 1
    away_std.played += 1
    home_std.goals_for += home_goals
    home_std.goals_against += away_goals
    away_std.goals_for += away_goals
    away_std.goals_against += home_goals

    if home_goals > away_goals:
        home_std.won += 1
        away_std.lost += 1
    elif home_goals < away_goals:
        home_std.lost += 1
        away_std.won += 1
    else:
        home_std.drawn += 1
        away_std.drawn += 1

async def recalculate_standings(db: AsyncSession, league_id: str):
    # Reset all to 0
    stds = await db.execute(select(Standing).where(Standing.league_id == league_id))
    for s in stds.scalars().all():
        s.played = s.won = s.drawn = s.lost = s.goals_for = s.goals_against = 0
        
    await db.commit()

    # Re-apply all finished matches
    matches = await db.execute(select(Match).where(Match.league_id == league_id, Match.status == "finished"))
    for m in matches.scalars().all():
        await update_standings_for_match(db, league_id, m.home_club_id, m.away_club_id, m.home_goals, m.away_goals)

    await db.commit()

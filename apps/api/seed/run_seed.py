import asyncio
import json
import os
import sys

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Add models path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../packages/db")))
from models import Base, League, Club, Player

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://openfm:openfm@localhost:5432/openfm")
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/seed"))

async def run_seed():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    with open(os.path.join(DATA_DIR, "leagues.json"), "r") as f:
        leagues_data = json.load(f)

    with open(os.path.join(DATA_DIR, "clubs.json"), "r") as f:
        clubs_data = json.load(f)

    with open(os.path.join(DATA_DIR, "players.json"), "r") as f:
        players_data = json.load(f)

    async with async_session() as session:
        async with session.begin():
            # Create Leagues
            for l_data in leagues_data:
                league = League(**l_data)
                session.add(league)

            # Create Clubs
            for c_data in clubs_data:
                club = Club(**c_data)
                session.add(club)

            # Create Players
            for p_data in players_data:
                # remove computed columns from payload just in case
                p_data.pop("overall", None) 
                player = Player(**p_data)
                session.add(player)

        await session.commit()

    await engine.dispose()
    print("Seed data inserted successfully.")

if __name__ == "__main__":
    asyncio.run(run_seed())

import json
import os
import uuid
import random
import numpy as np

# Set seeds for reproducibility
np.random.seed(42)
random.seed(42)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/seed"))
os.makedirs(DATA_DIR, exist_ok=True)

# Fake names for different regions
ENGLISH_FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"]
ENGLISH_LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]

SPANISH_FIRST_NAMES = ["Jose", "Antonio", "Juan", "Manuel", "Francisco", "Luis", "Javier", "Miguel", "Carlos", "Jesus"]
SPANISH_LAST_NAMES = ["Garcia", "Gonzalez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gomez", "Martin"]

BD_FIRST_NAMES = ["Rahim", "Karim", "Tariq", "Hasan", "Arif", "Imran", "Mehedi", "Sakib", "Tamim", "Mashrafe"]
BD_LAST_NAMES = ["Islam", "Rahman", "Hossain", "Uddin", "Ahmed", "Ali", "Chowdhury", "Khan", "Sikder", "Miah"]

def generate_name(nationality):
    if nationality == "England":
        return f"{random.choice(ENGLISH_FIRST_NAMES)} {random.choice(ENGLISH_LAST_NAMES)}"
    elif nationality == "Spain":
        return f"{random.choice(SPANISH_FIRST_NAMES)} {random.choice(SPANISH_LAST_NAMES)}"
    else:
        return f"{random.choice(BD_FIRST_NAMES)} {random.choice(BD_LAST_NAMES)}"

def calc_overall(stats):
    return int(sum(stats.values()) / len(stats))

def calc_potential(age, overall):
    if age < 22:
        return min(99, overall + random.randint(5, 20))
    else:
        return min(99, overall + random.randint(0, 5))

def calc_market_value(age, overall):
    base = 100000 * (overall ** 2) / 100
    if age <= 23:
        multiplier = 1.5
    elif age <= 28:
        multiplier = 1.2
    elif age <= 32:
        multiplier = 0.8
    else:
        multiplier = 0.5
    return int(base * multiplier)

leagues = [
    {
        "id": str(uuid.uuid4()),
        "name": "Premier League",
        "country": "England",
        "season": 2026,
        "total_matchdays": 38,
        "current_matchday": 0,
        "status": "pending"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "La Liga",
        "country": "Spain",
        "season": 2026,
        "total_matchdays": 38,
        "current_matchday": 0,
        "status": "pending"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bangladesh Premier League",
        "country": "Bangladesh",
        "season": 2026,
        "total_matchdays": 18,
        "current_matchday": 0,
        "status": "pending"
    }
]

clubs_data = {
    "England": [f"English Club {i+1}" for i in range(20)],
    "Spain": [f"Spanish Club {i+1}" for i in range(20)],
    "Bangladesh": ["Dhaka Warriors", "Chittagong Tigers", "Sylhet Strikers", "Rajshahi United", "Khulna FC", "Barisal City", "Cumilla Athletic", "Mymensingh FC", "Rangpur Rovers", "Narayanganj XI"]
}

clubs = []
players = []

for league in leagues:
    league_clubs = clubs_data[league["country"]]
    for club_name in league_clubs:
        club_id = str(uuid.uuid4())
        clubs.append({
            "id": club_id,
            "name": club_name,
            "country": league["country"],
            "league_id": league["id"],
            "budget": random.randint(10, 200) * 1000000,
            "reputation": random.randint(5, 20) if league["country"] != "Bangladesh" else random.randint(1, 10),
            "is_user_club": False
        })
        
        # Generate 25 players
        squad_structure = [
            ("GK", 2),
            ("CB", 2), ("LB", 2), ("RB", 2),
            ("CDM", 2), ("CM", 2), ("CAM", 2), ("LW", 1), ("RW", 1),
            ("ST", 3), ("LW", 1), ("RW", 1),
            ("CM", 4) # Utility
        ]
        
        for pos, count in squad_structure:
            for _ in range(count):
                age = int(np.clip(np.random.normal(24, 4), 16, 36))
                
                # Base attributes logic
                if pos == "GK":
                    stats = {
                        "goalkeeping": random.randint(60, 85),
                        "pace": random.randint(40, 60),
                        "defending": random.randint(40, 65),
                        "shooting": random.randint(30, 50),
                        "passing": random.randint(30, 50),
                        "dribbling": random.randint(30, 50),
                        "physical": random.randint(30, 50)
                    }
                elif pos in ["CB", "LB", "RB"]:
                    stats = {
                        "goalkeeping": random.randint(10, 30),
                        "pace": random.randint(55, 75),
                        "defending": random.randint(60, 82),
                        "shooting": random.randint(40, 65),
                        "passing": random.randint(40, 65),
                        "dribbling": random.randint(40, 65),
                        "physical": random.randint(60, 80)
                    }
                elif pos in ["CDM", "CM", "CAM"]:
                    stats = {
                        "goalkeeping": random.randint(10, 30),
                        "pace": random.randint(55, 75),
                        "defending": random.randint(40, 70),
                        "shooting": random.randint(40, 70),
                        "passing": random.randint(60, 82),
                        "dribbling": random.randint(55, 78),
                        "physical": random.randint(40, 70)
                    }
                else: # ST, LW, RW
                    stats = {
                        "goalkeeping": random.randint(10, 30),
                        "pace": random.randint(65, 85),
                        "defending": random.randint(20, 45),
                        "shooting": random.randint(65, 88),
                        "passing": random.randint(40, 70),
                        "dribbling": random.randint(60, 82),
                        "physical": random.randint(40, 70)
                    }

                overall = calc_overall(stats)
                
                players.append({
                    "id": str(uuid.uuid4()),
                    "club_id": club_id,
                    "name": generate_name(league["country"]),
                    "age": age,
                    "nationality": league["country"],
                    "position": pos,
                    "pace": stats["pace"],
                    "shooting": stats["shooting"],
                    "passing": stats["passing"],
                    "dribbling": stats["dribbling"],
                    "defending": stats["defending"],
                    "physical": stats["physical"],
                    "goalkeeping": stats["goalkeeping"],
                    "potential": calc_potential(age, overall),
                    "overall": overall,
                    "market_value": calc_market_value(age, overall),
                    "weak_foot": random.randint(1, 5),
                    "form": random.randint(0, 100),
                    "morale": random.randint(0, 100),
                    "archived": False
                })

# Save files
with open(os.path.join(DATA_DIR, "leagues.json"), "w") as f:
    json.dump(leagues, f, indent=2)

with open(os.path.join(DATA_DIR, "clubs.json"), "w") as f:
    json.dump(clubs, f, indent=2)

with open(os.path.join(DATA_DIR, "players.json"), "w") as f:
    json.dump(players, f, indent=2)

print(f"Generated {len(leagues)} leagues, {len(clubs)} clubs, and {len(players)} players.")

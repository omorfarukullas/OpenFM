import uuid
import random
import numpy as np

ENGLISH_FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"]
ENGLISH_LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
SPANISH_FIRST_NAMES = ["Jose", "Antonio", "Juan", "Manuel", "Francisco", "Luis", "Javier", "Miguel", "Carlos", "Jesus"]
SPANISH_LAST_NAMES = ["Garcia", "Gonzalez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gomez", "Martin"]
BD_FIRST_NAMES = ["Rahim", "Karim", "Tariq", "Hasan", "Arif", "Imran", "Mehedi", "Sakib", "Tamim", "Mashrafe"]
BD_LAST_NAMES = ["Islam", "Rahman", "Hossain", "Uddin", "Ahmed", "Ali", "Chowdhury", "Khan", "Sikder", "Miah"]

def generate_name(country):
    if country == "England":
        return f"{random.choice(ENGLISH_FIRST_NAMES)} {random.choice(ENGLISH_LAST_NAMES)}"
    elif country == "Spain":
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

def generate_squad(club_id: str, country: str = "England", count: int = 25, seed: int = None) -> list[dict]:
    if seed is not None:
        np.random.seed(seed)
        random.seed(seed)
        
    squad_structure = [
        ("GK", 2),
        ("CB", 2), ("LB", 2), ("RB", 2),
        ("CDM", 2), ("CM", 2), ("CAM", 2), ("LW", 1), ("RW", 1),
        ("ST", 3), ("LW", 1), ("RW", 1),
        ("CM", count - 21) # Utility
    ]
    
    players = []
    for pos, c in squad_structure:
        for _ in range(c):
            age = int(np.clip(np.random.normal(24, 4), 16, 36))
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
                "club_id": str(club_id),
                "name": generate_name(country),
                "age": age,
                "nationality": country,
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
    return players

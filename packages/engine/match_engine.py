import random

class MatchEngine:
    @staticmethod
    def simulate(home_squad, away_squad):
        # Basic mock simulation engine logic
        home_goals = random.randint(0, 4)
        away_goals = random.randint(0, 3)
        home_xg = home_goals * random.uniform(0.7, 1.2)
        away_xg = away_goals * random.uniform(0.7, 1.2)
        
        events = []
        for _ in range(home_goals):
            events.append({
                "minute": random.randint(1, 90),
                "type": "goal",
                "club_id": str(home_squad[0].club_id) if home_squad else None,
                "player_id": str(random.choice(home_squad).id) if home_squad else None,
                "detail": {}
            })
            
        for _ in range(away_goals):
            events.append({
                "minute": random.randint(1, 90),
                "type": "goal",
                "club_id": str(away_squad[0].club_id) if away_squad else None,
                "player_id": str(random.choice(away_squad).id) if away_squad else None,
                "detail": {}
            })
            
        return {
            "home_goals": home_goals,
            "away_goals": away_goals,
            "home_xg": round(home_xg, 2),
            "away_xg": round(away_xg, 2),
            "events": sorted(events, key=lambda x: x["minute"])
        }

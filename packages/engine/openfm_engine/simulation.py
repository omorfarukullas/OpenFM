import random

class MatchSimulator:
    def __init__(self, home_team: str, away_team: str):
        self.home_team = home_team
        self.away_team = away_team

    def simulate(self) -> dict:
        home_score = random.randint(0, 4)
        away_score = random.randint(0, 4)
        return {
            "home_team": self.home_team,
            "away_team": self.away_team,
            "home_score": home_score,
            "away_score": away_score,
            "winner": self.home_team if home_score > away_score else (self.away_team if away_score > home_score else None)
        }

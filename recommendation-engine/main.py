from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from scoring import recommend_activities

app = FastAPI(title="Spotly Recommendation Engine")

class Preferences(BaseModel):
    category: Optional[str] = None
    indoor_outdoor: Optional[str] = None
    free_only: Optional[bool] = False
    searchCenter: Optional[Dict[str, float]] = None
    radiusMeters: Optional[float] = None

class Activity(BaseModel):
    id: int
    name: str
    distance: float
    fee: Optional[bool] = None
    indoor_outdoor: Optional[str] = None
    categories: Optional[List[Dict[str, Any]]] = []

class ScoringRequest(BaseModel):
    preferences: Preferences
    activities: List[Activity]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/recommend/scoring")
def score_activities(payload: ScoringRequest):
    if not payload.activities:
        return {"recommendations": []}

    ranked_activities = recommend_activities(
        activities=[act.dict() for act in payload.activities],
        preferences=payload.preferences.dict()
    )

    return {"recommendations": ranked_activities}
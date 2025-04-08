from pydantic import BaseModel
from typing import List, Optional

class PersonaRequest(BaseModel):
    customer_id: str

class PersonaResponse(BaseModel):
    customer_id: str
    persona_traits: List[str]
    psychographic_profile: str
    match_score: float
    
    class Config:
        from_attributes = True 
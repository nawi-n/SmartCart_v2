from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    customer_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggested_actions: List[str]
    
    class Config:
        from_attributes = True 
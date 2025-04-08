from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class BehaviorRequest(BaseModel):
    customer_id: str
    action_type: str  # e.g., "view", "purchase", "like", "skip"
    product_id: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    details: Optional[Dict[str, Any]] = None

class BehaviorResponse(BaseModel):
    status: str
    message: str
    updated_fields: List[str]
    
    class Config:
        from_attributes = True 
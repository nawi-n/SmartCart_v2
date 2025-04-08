from pydantic import BaseModel
from typing import List, Optional

class ProductRecommendationRequest(BaseModel):
    customer_id: str
    mood: Optional[str] = None
    limit: Optional[int] = 10

class ProductRecommendationResponse(BaseModel):
    product_id: str
    name: str
    category: str
    price: float
    match_score: float
    explanation: str
    
    class Config:
        from_attributes = True

class ProductStoryRequest(BaseModel):
    product_id: str
    customer_id: Optional[str] = None

class ProductStoryResponse(BaseModel):
    product_id: str
    story: str
    
    class Config:
        from_attributes = True 
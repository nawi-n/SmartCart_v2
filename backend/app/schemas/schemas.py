from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool = True
    preferences: Optional[dict] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserResponse):
    shopping_lists: List['ShoppingList'] = []
    behaviors: List['Behavior'] = []
    mood_states: List['MoodState'] = []
    personas: List['Persona'] = []

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    nutritional_info: Optional[Dict[str, Any]] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    description: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ShoppingListBase(BaseModel):
    name: str

class ShoppingListCreate(ShoppingListBase):
    pass

class ShoppingList(ShoppingListBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    items: List['ShoppingListItem']

    class Config:
        from_attributes = True

class ShoppingListItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class ShoppingListItemCreate(ShoppingListItemBase):
    pass

class ShoppingListItem(ShoppingListItemBase):
    id: int
    shopping_list_id: int
    created_at: datetime
    product: Product

    class Config:
        from_attributes = True

class BehaviorBase(BaseModel):
    product_id: int
    action_type: str
    context: Dict[str, Any]

class BehaviorCreate(BehaviorBase):
    pass

class Behavior(BehaviorBase):
    id: int
    user_id: int
    created_at: datetime
    product: Product

    class Config:
        from_attributes = True

class MoodStateBase(BaseModel):
    mood: str
    intensity: float
    context: Dict[str, Any]

class MoodStateCreate(MoodStateBase):
    pass

class MoodState(MoodStateBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PersonaBase(BaseModel):
    traits: Dict[str, Any]
    shopping_style: Dict[str, Any]
    interests: Dict[str, Any]

class PersonaCreate(PersonaBase):
    pass

class Persona(PersonaBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationBase(BaseModel):
    product_id: int
    score: float
    context: Dict[str, Any]

class RecommendationCreate(RecommendationBase):
    pass

class Recommendation(RecommendationBase):
    id: int
    user_id: int
    created_at: datetime
    product: Product

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Update(BaseModel):
    message: str
    type: str  # info, success, warning, error
    timestamp: datetime

class ShoppingPatterns(BaseModel):
    dates: List[str]
    frequencies: List[int]

class MoodTrends(BaseModel):
    dates: List[str]
    intensities: List[float]

class CategoryDistribution(BaseModel):
    categories: List[str]
    counts: List[int]

class RecommendationPerformance(BaseModel):
    products: List[str]
    scores: List[float] 
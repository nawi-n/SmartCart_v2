from sqlalchemy import Column, String, Integer, Float, JSON, Text
from .base import BaseModel

class Customer(BaseModel):
    __tablename__ = "customers"

    customer_id = Column(String, unique=True, index=True)
    age = Column(Integer)
    gender = Column(String)
    location = Column(String)
    browsing_history = Column(JSON)  # Store as JSON array
    purchase_history = Column(JSON)  # Store as JSON array
    customer_segment = Column(String)
    avg_order_value = Column(Float)
    current_mood = Column(String)
    persona_traits = Column(JSON)  # Store personality traits as JSON
    psychographic_profile = Column(Text)  # Store detailed psychographic profile
    interaction_history = Column(JSON)  # Store interaction logs 
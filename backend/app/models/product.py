from sqlalchemy import Column, String, Integer, Float, JSON, Text
from .base import BaseModel

class Product(BaseModel):
    __tablename__ = "products"

    product_id = Column(String, unique=True, index=True)
    category = Column(String)
    price = Column(Float)
    brand = Column(String)
    average_rating = Column(Float)
    product_rating = Column(Float)
    review_sentiment_score = Column(Float)
    holiday = Column(String)
    season = Column(String)
    geographical_location = Column(String)
    similar_products = Column(JSON)  # Store as JSON array
    probability_of_recommendation = Column(Float)
    ai_description = Column(Text)  # Store Gemini-generated description
    psychographic_tags = Column(JSON)  # Store psychographic matching tags
    mood_tags = Column(JSON)  # Store mood-based tags 
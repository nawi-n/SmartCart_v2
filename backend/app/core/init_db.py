import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path
import json

from app.models.base import Base
from app.models.customer import Customer
from app.models.product import Product
from app.core.database import engine, SessionLocal

def init_db():
    # Create database directory if it doesn't exist
    db_dir = Path(__file__).parent.parent.parent / "database"
    db_dir.mkdir(exist_ok=True)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    db = SessionLocal()
    
    try:
        # Load customer data
        customer_df = pd.read_csv("../../customer_data_collection.csv")
        
        for _, row in customer_df.iterrows():
            customer = Customer(
                customer_id=str(row['Customer_ID']),
                age=int(row['Age']),
                gender=str(row['Gender']),
                location=str(row['Location']),
                browsing_history=json.dumps({"categories": []}),  # Initialize empty
                purchase_history=json.dumps([]),  # Initialize empty
                customer_segment=str(row['Customer_Segment']),
                avg_order_value=float(row['Avg_Order_Value']),
                current_mood="neutral",  # Default mood
                persona_traits=json.dumps([]),  # Initialize empty
                psychographic_profile="",  # Initialize empty
                interaction_history=json.dumps([])  # Initialize empty
            )
            db.add(customer)
        
        # Load product data
        product_df = pd.read_csv("../../product_recommendation_data.csv")
        
        for _, row in product_df.iterrows():
            product = Product(
                product_id=str(row['Product_ID']),
                category=str(row['Category']),
                price=float(row['Price']),
                brand=str(row['Brand']),
                average_rating=float(row['Average_Rating_of_Similar_Products']),
                product_rating=float(row['Product_Rating']),
                review_sentiment_score=float(row['Customer_Review_Sentiment_Score']),
                holiday=str(row['Holiday']),
                season=str(row['Season']),
                geographical_location=str(row['Geographical_Location']),
                similar_products=json.dumps([]),  # Initialize empty
                probability_of_recommendation=float(row['Probability_of_Recommendation']),
                ai_description="",  # Initialize empty
                psychographic_tags=json.dumps([]),  # Initialize empty
                mood_tags=json.dumps([])  # Initialize empty
            )
            db.add(product)
        
        # Commit the changes
        db.commit()
        print("Database initialized successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv

from app.core.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.product import (
    ProductRecommendationRequest,
    ProductRecommendationResponse,
    ProductStoryRequest,
    ProductStoryResponse
)

router = APIRouter()

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@router.post("/recommend_products", response_model=List[ProductRecommendationResponse])
async def recommend_products(
    request: ProductRecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Get personalized product recommendations based on customer profile and mood.
    """
    try:
        # Get customer data
        customer = db.query(Customer).filter(
            Customer.customer_id == request.customer_id
        ).first()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Get products based on customer preferences and mood
        products = db.query(Product).filter(
            Product.category.in_(customer.browsing_history.get("categories", [])),
            Product.price <= customer.avg_order_value * 1.5  # Example filter
        ).limit(10).all()
        
        # Generate personalized recommendations
        recommendations = []
        for product in products:
            # Calculate match score (simplified example)
            match_score = 0.7  # In reality, this would be a complex calculation
            
            recommendations.append(ProductRecommendationResponse(
                product_id=product.product_id,
                name=product.brand,
                category=product.category,
                price=product.price,
                match_score=match_score,
                explanation=f"This product matches your {customer.customer_segment} profile and current mood."
            ))
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/product_storytelling", response_model=ProductStoryResponse)
async def generate_product_story(
    request: ProductStoryRequest,
    db: Session = Depends(get_db)
):
    """
    Generate an engaging product story using Gemini AI.
    """
    try:
        # Get product data
        product = db.query(Product).filter(
            Product.product_id == request.product_id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Prepare prompt for Gemini
        prompt = f"""
        Create an engaging and personalized product story for:
        Brand: {product.brand}
        Category: {product.category}
        Price: {product.price}
        Average Rating: {product.average_rating}
        
        The story should:
        1. Highlight key features
        2. Create emotional connection
        3. Include social proof
        4. Be concise and engaging
        """
        
        # Generate story using Gemini
        response = model.generate_content(prompt)
        
        return ProductStoryResponse(
            product_id=product.product_id,
            story=response.text
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.persona import PersonaResponse, PersonaRequest

router = APIRouter()

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@router.post("/generate_persona", response_model=PersonaResponse)
async def generate_persona(
    request: PersonaRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a customer persona using Gemini AI based on customer data.
    """
    try:
        # Get customer data from database
        customer = db.query(Customer).filter(
            Customer.customer_id == request.customer_id
        ).first()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Prepare prompt for Gemini
        prompt = f"""
        Generate a detailed psychographic profile for a customer with the following characteristics:
        - Age: {customer.age}
        - Gender: {customer.gender}
        - Location: {customer.location}
        - Customer Segment: {customer.customer_segment}
        - Average Order Value: {customer.avg_order_value}
        - Browsing History: {customer.browsing_history}
        - Purchase History: {customer.purchase_history}
        
        Please provide:
        1. Personality traits (as JSON array)
        2. Shopping preferences
        3. Lifestyle characteristics
        4. Values and motivations
        5. Shopping behavior patterns
        """
        
        # Generate persona using Gemini
        response = model.generate_content(prompt)
        
        # Parse the response and update customer record
        # Note: In a real implementation, you would parse the Gemini response
        # and structure it according to your needs
        
        return PersonaResponse(
            customer_id=customer.customer_id,
            persona_traits=["trait1", "trait2"],  # Example traits
            psychographic_profile=response.text,
            match_score=0.85  # Example match score
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
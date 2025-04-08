from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Handle customer queries through the conversational shopping assistant.
    """
    try:
        # Get customer data if customer_id is provided
        customer_context = ""
        if request.customer_id:
            customer = db.query(Customer).filter(
                Customer.customer_id == request.customer_id
            ).first()
            
            if customer:
                customer_context = f"""
                Customer Profile:
                - Age: {customer.age}
                - Gender: {customer.gender}
                - Location: {customer.location}
                - Customer Segment: {customer.customer_segment}
                - Current Mood: {customer.current_mood}
                - Recent Purchases: {customer.purchase_history}
                """
        
        # Prepare context-aware prompt for Gemini
        prompt = f"""
        You are a helpful shopping assistant for SmartCart. 
        {customer_context}
        
        Customer Query: {request.message}
        
        Please provide a helpful, personalized response that:
        1. Addresses the customer's specific question
        2. Takes into account their profile and preferences
        3. Suggests relevant products if appropriate
        4. Maintains a friendly and professional tone
        """
        
        # Generate response using Gemini
        response = model.generate_content(prompt)
        
        return ChatResponse(
            response=response.text,
            suggested_actions=["browse_products", "view_recommendations"]  # Example actions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
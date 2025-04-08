from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.behavior import BehaviorRequest, BehaviorResponse

router = APIRouter()

@router.post("/submit_behavior", response_model=BehaviorResponse)
async def submit_behavior(
    request: BehaviorRequest,
    db: Session = Depends(get_db)
):
    """
    Track and store customer behavior for learning and personalization.
    """
    try:
        # Get customer data
        customer = db.query(Customer).filter(
            Customer.customer_id == request.customer_id
        ).first()
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Update customer's interaction history
        interaction = {
            "timestamp": datetime.utcnow().isoformat(),
            "action_type": request.action_type,
            "product_id": request.product_id,
            "details": request.details
        }
        
        # Get current interaction history
        current_history = customer.interaction_history or []
        current_history.append(interaction)
        
        # Update customer record
        customer.interaction_history = current_history
        
        # Update browsing history if it's a view action
        if request.action_type == "view":
            current_browsing = customer.browsing_history or {}
            categories = current_browsing.get("categories", [])
            if request.category and request.category not in categories:
                categories.append(request.category)
            current_browsing["categories"] = categories
            customer.browsing_history = current_browsing
        
        # Update purchase history if it's a purchase action
        if request.action_type == "purchase":
            current_purchases = customer.purchase_history or []
            current_purchases.append({
                "product_id": request.product_id,
                "timestamp": datetime.utcnow().isoformat(),
                "price": request.price
            })
            customer.purchase_history = current_purchases
            
            # Update average order value
            if request.price:
                total_purchases = len(current_purchases)
                current_avg = customer.avg_order_value or 0
                new_avg = ((current_avg * (total_purchases - 1)) + request.price) / total_purchases
                customer.avg_order_value = new_avg
        
        # Save changes
        db.commit()
        
        return BehaviorResponse(
            status="success",
            message="Behavior tracked successfully",
            updated_fields=["interaction_history", "browsing_history", "purchase_history", "avg_order_value"]
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 
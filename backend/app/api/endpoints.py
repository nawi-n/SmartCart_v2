from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict
from backend.database.database import get_db
from backend.app.core.security import (
    get_current_active_user, create_access_token, get_password_hash,
    verify_password, authenticate_user
)
from backend.app.models.models import User, Product, ShoppingList, ShoppingListItem, Recommendation, Persona, MoodState, Behavior
from backend.app.schemas.schemas import (
    UserCreate, UserBase, User as UserSchema,
    ProductCreate, Product as ProductSchema,
    ShoppingListCreate, ShoppingList as ShoppingListSchema,
    ShoppingListItemCreate, ShoppingListItem as ShoppingListItemSchema,
    BehaviorCreate, Behavior as BehaviorSchema,
    MoodStateCreate, MoodState as MoodStateSchema,
    PersonaCreate, Persona as PersonaSchema,
    RecommendationCreate, Recommendation as RecommendationSchema,
    Token, TokenData,
    ShoppingPatterns, MoodTrends, CategoryDistribution, RecommendationPerformance
)
from backend.app.services.genai_service import GenAIService
from backend.app.services.agents import PersonaAgent, MoodAgent, BehaviorAgent, AgentCollaboration
from datetime import timedelta, datetime
import os
import asyncio

# Initialize services
genai_service = GenAIService()
persona_agent = PersonaAgent()
mood_agent = MoodAgent()
behavior_agent = BehaviorAgent()
agent_collaboration = AgentCollaboration()

router = APIRouter()

# Auth endpoints
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    try:
        user = await authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )

# User endpoints
@router.post("/users/", response_model=UserSchema)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).filter(User.email == user.email))
        db_user = result.scalars().first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=True,
            preferences={}
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )

@router.get("/users/me/", response_model=UserSchema)
async def read_users_me(current_user: UserSchema = Depends(get_current_active_user)):
    return current_user

# Product endpoints
@router.post("/products/", response_model=ProductSchema)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

@router.get("/products/", response_model=List[ProductSchema])
async def read_products(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).offset(skip).limit(limit))
    products = result.scalars().all()
    return products

@router.get("/products/{product_id}", response_model=ProductSchema)
async def read_product(
    product_id: int,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Track product view behavior
    behavior = Behavior(
        user_id=current_user.id,
        product_id=product_id,
        action_type="view",
        context={"source": "product_page"}
    )
    db.add(behavior)
    await db.commit()
    
    return product

# Shopping List endpoints
@router.post("/shopping-lists/", response_model=ShoppingListSchema)
async def create_shopping_list(
    shopping_list: ShoppingListCreate,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    db_shopping_list = ShoppingList(**shopping_list.dict(), user_id=current_user.id)
    db.add(db_shopping_list)
    await db.commit()
    await db.refresh(db_shopping_list)
    return db_shopping_list

@router.get("/shopping-lists/", response_model=List[ShoppingListSchema])
async def read_shopping_lists(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ShoppingList).filter(ShoppingList.user_id == current_user.id))
    shopping_lists = result.scalars().all()
    return shopping_lists

@router.post("/shopping-lists/{shopping_list_id}/items/", response_model=ShoppingListItemSchema)
async def add_shopping_list_item(
    shopping_list_id: int,
    item: ShoppingListItemCreate,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Track add to list behavior
    behavior = Behavior(
        user_id=current_user.id,
        product_id=item.product_id,
        action_type="add_to_list",
        context={"shopping_list_id": shopping_list_id}
    )
    db.add(behavior)
    
    db_item = ShoppingListItem(**item.dict(), shopping_list_id=shopping_list_id)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

# WebSocket for real-time updates
@router.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Get updates from the database
            updates = await get_updates()
            await websocket.send_json(updates)
            await asyncio.sleep(5)  # Send updates every 5 seconds
    except WebSocketDisconnect:
        pass

# Real-time updates endpoint
@router.get("/updates", response_model=List[TokenData])
async def get_updates(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get recent updates for the user
    updates = []
    
    # Check for new recommendations
    result = await db.execute(select(Recommendation).filter(
        Recommendation.user_id == current_user.id,
        Recommendation.created_at > datetime.now() - timedelta(minutes=5)
    ))
    recent_recommendations = result.scalars().all()
    
    for rec in recent_recommendations:
        updates.append(TokenData(
            message=f"New recommendation: {rec.product.name}",
            type="info",
            timestamp=rec.created_at
        ))
    
    # Check for new behaviors
    result = await db.execute(select(Behavior).filter(
        Behavior.user_id == current_user.id,
        Behavior.created_at > datetime.now() - timedelta(minutes=5)
    ))
    recent_behaviors = result.scalars().all()
    
    for behavior in recent_behaviors:
        updates.append(TokenData(
            message=f"New activity: {behavior.action_type} on {behavior.product.name}",
            type="info",
            timestamp=behavior.created_at
        ))
    
    return updates

# Enhanced recommendation endpoint with collaborative insights
@router.get("/recommendations/", response_model=List[RecommendationSchema])
async def get_recommendations(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    recommendations = await genai_service.generate_recommendations(current_user, products, db)
    
    # Get collaborative insights
    result = await db.execute(select(Persona).filter(Persona.user_id == current_user.id))
    persona = result.scalars().first()
    
    result = await db.execute(select(MoodState).filter(
        MoodState.user_id == current_user.id
    ).order_by(MoodState.created_at.desc()))
    mood = result.scalars().first()
    
    result = await db.execute(select(Behavior).filter(
        Behavior.user_id == current_user.id
    ).order_by(Behavior.created_at.desc()).limit(5))
    recent_behaviors = result.scalars().all()
    
    collaboration_context = {
        'persona': persona.__dict__ if persona else {},
        'mood': mood.__dict__ if mood else {},
        'behaviors': [b.__dict__ for b in recent_behaviors]
    }
    
    collaborative_insights = await agent_collaboration.make_decision(collaboration_context)
    
    # Enhance recommendations with collaborative insights
    for rec in recommendations:
        rec.insights = collaborative_insights
    
    return recommendations

# Enhanced shopping list analysis
@router.get("/shopping-lists/{shopping_list_id}/analysis")
async def analyze_shopping_list(
    shopping_list_id: int,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    items = await db.execute(select(ShoppingListItem).filter(ShoppingListItem.shopping_list_id == shopping_list_id))
    items_data = [
        {
            "name": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price
        }
        for item in items.scalars().all()
    ]
    
    # Get collaborative insights
    persona = await db.execute(select(Persona).filter(Persona.user_id == current_user.id))
    persona = persona.scalars().first()
    
    mood = await db.execute(select(MoodState).filter(
        MoodState.user_id == current_user.id
    ).order_by(MoodState.created_at.desc()))
    mood = mood.scalars().first()
    
    collaboration_context = {
        'persona': persona.__dict__ if persona else {},
        'mood': mood.__dict__ if mood else {},
        'shopping_list': items_data
    }
    
    collaborative_insights = await agent_collaboration.make_decision(collaboration_context)
    
    analysis = await genai_service.analyze_shopping_list(items_data)
    analysis['collaborative_insights'] = collaborative_insights
    
    return analysis

# Agent-specific endpoints
@router.get("/users/me/persona")
async def get_user_persona(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    persona = await db.execute(select(Persona).filter(Persona.user_id == current_user.id))
    persona = persona.scalars().first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona

@router.get("/users/me/mood")
async def get_user_mood(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    mood = await db.execute(select(MoodState).filter(
        MoodState.user_id == current_user.id
    ).order_by(MoodState.created_at.desc()))
    mood_state = mood.scalars().first()
    if not mood_state:
        raise HTTPException(status_code=404, detail="Mood state not found")
    return mood_state

@router.get("/users/me/behaviors")
async def get_user_behaviors(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    behaviors = await db.execute(select(Behavior).filter(
        Behavior.user_id == current_user.id
    ).order_by(Behavior.created_at.desc()).limit(10))
    return behaviors.scalars().all()

# Analytics endpoints
@router.get("/analytics/shopping-patterns")
async def get_shopping_patterns(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get shopping patterns for the last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    behaviors = await db.execute(select(Behavior).filter(
        Behavior.user_id == current_user.id,
        Behavior.created_at >= thirty_days_ago
    ))
    
    # Group behaviors by date
    patterns = {}
    for behavior in behaviors.scalars().all():
        date = behavior.created_at.date()
        if date not in patterns:
            patterns[date] = 0
        patterns[date] += 1
    
    # Format data for chart
    dates = []
    frequencies = []
    for date in sorted(patterns.keys()):
        dates.append(date.strftime('%Y-%m-%d'))
        frequencies.append(patterns[date])
    
    return {
        "dates": dates,
        "frequencies": frequencies
    }

@router.get("/analytics/mood-trends")
async def get_mood_trends(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get mood states for the last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    mood_states = await db.execute(select(MoodState).filter(
        MoodState.user_id == current_user.id,
        MoodState.created_at >= thirty_days_ago
    ).order_by(MoodState.created_at))
    
    # Format data for chart
    dates = []
    intensities = []
    for mood_state in mood_states.scalars().all():
        dates.append(mood_state.created_at.strftime('%Y-%m-%d'))
        intensities.append(mood_state.intensity)
    
    return {
        "dates": dates,
        "intensities": intensities
    }

@router.get("/analytics/categories")
async def get_categories_distribution(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get all products in user's shopping lists
    shopping_list_items = await db.execute(select(ShoppingListItem).join(
        ShoppingList
    ).filter(
        ShoppingList.user_id == current_user.id
    ))
    
    # Count products by category
    category_counts = {}
    for item in shopping_list_items.scalars().all():
        category = item.product.category
        if category not in category_counts:
            category_counts[category] = 0
        category_counts[category] += 1
    
    # Format data for chart
    categories = []
    counts = []
    for category, count in category_counts.items():
        categories.append(category)
        counts.append(count)
    
    return {
        "categories": categories,
        "counts": counts
    }

@router.get("/analytics/recommendations")
async def get_recommendation_performance(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Get recent recommendations and their effectiveness
    recommendations = await db.execute(select(Recommendation).filter(
        Recommendation.user_id == current_user.id
    ).order_by(Recommendation.created_at.desc()).limit(10))
    
    # Format data for chart
    products = []
    scores = []
    for rec in recommendations.scalars().all():
        products.append(rec.product.name)
        scores.append(rec.score * 100)  # Convert to percentage
    
    return {
        "products": products,
        "scores": scores
    }

# Quick Actions endpoints
@router.post("/quick-actions/{action_type}")
async def execute_quick_action(
    action_type: str,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    if action_type == "find-deals":
        # Find products with best deals
        products = await db.execute(select(Product).order_by(Product.price).limit(5))
        return {"products": products.scalars().all()}
    
    elif action_type == "healthy-options":
        # Find healthy products based on nutritional info
        products = await db.execute(select(Product).filter(
            Product.nutritional_info["is_healthy"] == True
        ).limit(5))
        return {"products": products.scalars().all()}
    
    elif action_type == "budget-friendly":
        # Find budget-friendly shopping list items
        items = await db.execute(select(ShoppingListItem).join(
            Product
        ).filter(
            ShoppingList.user_id == current_user.id,
            Product.price <= 10.0  # Example budget threshold
        ).limit(5))
        return {"items": items.scalars().all()}
    
    elif action_type == "trending":
        # Find trending products based on recent behaviors
        recent_behaviors = await db.execute(select(Behavior).filter(
            Behavior.created_at >= datetime.now() - timedelta(days=7)
        ).limit(5))
        
        # Count product views
        product_views = {}
        for behavior in recent_behaviors.scalars().all():
            if behavior.product_id not in product_views:
                product_views[behavior.product_id] = 0
            product_views[behavior.product_id] += 1
        
        # Get top 5 trending products
        trending_products = []
        for product_id, views in sorted(product_views.items(), key=lambda x: x[1], reverse=True)[:5]:
            product = await db.execute(select(Product).filter(Product.id == product_id))
            trending_products.append(product.scalars().first())
        
        return {"products": trending_products}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid action type")

# Mood endpoints
@router.post("/mood/", response_model=MoodStateSchema)
async def update_mood(
    mood: MoodStateCreate,
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    db_mood = MoodState(
        user_id=current_user.id,
        mood=mood.mood,
        intensity=mood.intensity,
        context=mood.context
    )
    db.add(db_mood)
    await db.commit()
    await db.refresh(db_mood)
    return db_mood

@router.get("/mood/", response_model=List[MoodStateSchema])
async def get_mood_history(
    current_user: UserSchema = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(MoodState).filter(
        MoodState.user_id == current_user.id
    ).order_by(MoodState.created_at.desc()))
    moods = result.scalars().all()
    return moods 
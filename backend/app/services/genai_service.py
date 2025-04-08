from google.generativeai import GenerativeModel
import google.generativeai as genai
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
from backend.app.models.models import Product, User, Persona, MoodState, Behavior
from backend.app.services.agents import PersonaAgent, MoodAgent, BehaviorAgent
from sqlalchemy.orm import Session

load_dotenv()

# Configure the GenAI API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GenAIService:
    def __init__(self):
        # Configure Gemini API
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = GenerativeModel('gemini-2.0-flash-001')
        self.persona_agent = PersonaAgent()
        self.mood_agent = MoodAgent()
        self.behavior_agent = BehaviorAgent()
        
    async def generate_recommendations(self, user: Any, products: List[Any], db: Any) -> List[Dict]:
        """Generate personalized product recommendations using Gemini."""
        try:
            # Prepare context for the model
            context = {
                "user": {
                    "preferences": user.preferences,
                    "recent_behaviors": [b.__dict__ for b in user.behaviors[-5:]] if user.behaviors else [],
                    "mood_states": [m.__dict__ for m in user.mood_states[-3:]] if user.mood_states else [],
                    "personas": [p.__dict__ for p in user.personas] if user.personas else []
                },
                "products": [p.__dict__ for p in products]
            }
            
            # Generate recommendations using Gemini
            prompt = f"""
            Based on the following user context and available products, generate personalized recommendations.
            Consider the user's preferences, recent behaviors, mood states, and shopping personas.
            
            User Context:
            {context['user']}
            
            Available Products:
            {context['products']}
            
            Provide recommendations in the following format:
            - Product ID
            - Recommendation Score (0-1)
            - Reasoning
            - Potential User Interest
            """
            
            response = await self.model.generate_content(prompt)
            recommendations = self._parse_recommendations(response.text, products)
            
            return recommendations
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return []
    
    def _parse_recommendations(self, response: str, products: List[Any]) -> List[Dict]:
        """Parse Gemini's response into structured recommendations."""
        recommendations = []
        lines = response.split('\n')
        
        for line in lines:
            if line.strip() and 'Product ID:' in line:
                try:
                    product_id = int(line.split('Product ID:')[1].strip())
                    score = float(next(l for l in lines if 'Score:' in l).split('Score:')[1].strip())
                    reasoning = next(l for l in lines if 'Reasoning:' in l).split('Reasoning:')[1].strip()
                    interest = next(l for l in lines if 'Interest:' in l).split('Interest:')[1].strip()
                    
                    product = next((p for p in products if p.id == product_id), None)
                    if product:
                        recommendations.append({
                            "product_id": product_id,
                            "score": score,
                            "reasoning": reasoning,
                            "interest": interest,
                            "product": product
                        })
                except (ValueError, StopIteration):
                    continue
        
        return recommendations
    
    async def analyze_shopping_list(self, items: List[Dict]) -> Dict:
        """Analyze shopping list items using Gemini."""
        try:
            prompt = f"""
            Analyze the following shopping list items and provide insights:
            
            Items:
            {items}
            
            Provide analysis in the following format:
            - Budget Impact
            - Health Considerations
            - Shopping Patterns
            - Recommendations
            """
            
            response = await self.model.generate_content(prompt)
            return self._parse_analysis(response.text)
            
        except Exception as e:
            print(f"Error analyzing shopping list: {str(e)}")
            return {}
    
    def _parse_analysis(self, response: str) -> Dict:
        """Parse Gemini's analysis into structured insights."""
        analysis = {}
        current_section = None
        
        for line in response.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('-'):
                if current_section:
                    analysis[current_section] = line[1:].strip()
            else:
                current_section = line.lower().replace(' ', '_')
                analysis[current_section] = ""
        
        return analysis
    
    def generate_recommendations_old(self, user: User, products: List[Product], db: Session) -> List[Dict]:
        """
        Generate personalized product recommendations using multi-agent system
        """
        # Get user's persona
        persona = db.query(Persona).filter(Persona.user_id == user.id).first()
        if not persona:
            # Create initial persona based on user data
            behaviors = db.query(Behavior).filter(Behavior.user_id == user.id).all()
            persona_data = self.persona_agent.analyze_user(user, behaviors)
            persona = Persona(user_id=user.id, **persona_data)
            db.add(persona)
            db.commit()
        
        # Get current mood
        recent_behaviors = db.query(Behavior).filter(
            Behavior.user_id == user.id
        ).order_by(Behavior.created_at.desc()).limit(5).all()
        mood_data = self.mood_agent.analyze_mood(user, recent_behaviors)
        mood_state = MoodState(user_id=user.id, **mood_data)
        db.add(mood_state)
        db.commit()
        
        # Prepare context for recommendations
        context = f"""
        User Persona:
        - Traits: {', '.join(persona.traits)}
        - Interests: {', '.join(persona.interests)}
        - Shopping Style: {persona.shopping_style}
        
        Current Mood:
        - Mood: {mood_state.mood}
        - Intensity: {mood_state.intensity}/10
        - Context: {mood_state.context}
        
        Recent Behavior:
        {self._format_recent_behavior(recent_behaviors)}
        """
        
        # Generate recommendations
        prompt = f"""
        Based on the following user context and available products, generate personalized product recommendations.
        Consider the user's persona, current mood, and recent behavior.
        
        {context}
        
        Available Products:
        {self._format_products(products)}
        
        Please provide:
        1. A list of recommended products with their IDs
        2. A score between 0 and 1 indicating how well each product matches the user's context
        3. A detailed explanation for each recommendation, considering:
           - How it aligns with the user's persona
           - How it matches their current mood
           - How it relates to their recent behavior
        """
        
        response = self.model.generate_content(prompt)
        recommendations = self._parse_recommendations(response.text, user.id, db)
        
        # Save recommendations to database
        for rec in recommendations:
            db_rec = Recommendation(**rec)
            db.add(db_rec)
        db.commit()
        
        return recommendations
    
    def _format_recent_behavior(self, behaviors: List[Behavior]) -> str:
        return "\n".join([
            f"- {b.action_type}: {b.product.name} ({b.created_at})"
            for b in behaviors
        ])
    
    def _format_products(self, products: List[Product]) -> str:
        return "\n".join([
            f"Product {i+1}: {p.name} - {p.description} - Price: ${p.price} - Categories: {[c.name for c in p.categories]}"
            for i, p in enumerate(products)
        ])
    
    def analyze_shopping_list_old(self, shopping_list_items: List[Dict]) -> Dict:
        """
        Analyze a shopping list and provide insights using multi-agent system
        """
        items_context = "\n".join([
            f"Item {i+1}: {item['name']} - Quantity: {item['quantity']}"
            for i, item in enumerate(shopping_list_items)
        ])
        
        prompt = f"""
        Analyze the following shopping list and provide comprehensive insights:
        
        {items_context}
        
        Please provide:
        1. Total estimated cost
        2. Nutritional balance assessment
        3. Potential missing items based on:
           - Common shopping patterns
           - Meal planning considerations
           - Seasonal availability
        4. Cost-saving suggestions
        5. Health and wellness recommendations
        6. Potential substitutions for better value or health
        """
        
        response = self.model.generate_content(prompt)
        return {
            'analysis': response.text,
            'items': shopping_list_items
        } 
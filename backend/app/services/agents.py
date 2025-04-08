from google.generativeai import GenerativeModel
import google.generativeai as genai
from typing import Dict, List, Any
import json
import os
from dotenv import load_dotenv
from backend.app.models.models import Persona, MoodState, Behavior

load_dotenv()

class AgentCollaboration:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = GenerativeModel('gemini-2.0-flash-001')
    
    async def make_decision(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Collaborate between agents to make decisions."""
        insights = {
            "persona_insights": {},
            "mood_insights": {},
            "behavior_insights": {},
            "recommendations": []
        }
        
        # Example collaboration logic
        if "persona" in context:
            insights["persona_insights"] = {
                "traits": context["persona"].get("traits", []),
                "shopping_style": context["persona"].get("shopping_style", {})
            }
        
        if "mood" in context:
            insights["mood_insights"] = {
                "current_mood": context["mood"].get("mood", "neutral"),
                "intensity": context["mood"].get("intensity", 0.5)
            }
        
        if "behaviors" in context:
            insights["behavior_insights"] = {
                "recent_actions": [b.get("action_type") for b in context["behaviors"]],
                "patterns": self._analyze_patterns(context["behaviors"])
            }
        
        return insights
    
    def _analyze_patterns(self, behaviors: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze behavior patterns for insights."""
        patterns = {
            "frequent_actions": {},
            "time_patterns": {},
            "product_preferences": {}
        }
        
        # Example pattern analysis
        for behavior in behaviors:
            action_type = behavior.get("action_type")
            if action_type:
                patterns["frequent_actions"][action_type] = patterns["frequent_actions"].get(action_type, 0) + 1
        
        return patterns

class PersonaAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = GenerativeModel('gemini-2.0-flash-001')
    
    async def analyze_user(self, user: Any, behaviors: List[Behavior]) -> Dict[str, Any]:
        """Analyze user data to create or update their persona."""
        # Analyze user preferences and behaviors to determine persona traits
        traits = []
        interests = []
        shopping_style = {}
        
        # Example analysis logic
        if behaviors:
            # Analyze behavior patterns
            view_count = sum(1 for b in behaviors if b.action_type == "view")
            purchase_count = sum(1 for b in behaviors if b.action_type == "purchase")
            
            if view_count > purchase_count:
                traits.append("browser")
            else:
                traits.append("decisive")
        
        return {
            "traits": traits,
            "interests": interests,
            "shopping_style": shopping_style
        }

class MoodAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = GenerativeModel('gemini-2.0-flash-001')
    
    async def analyze_mood(self, user: Any, behaviors: List[Behavior]) -> Dict[str, Any]:
        """Analyze user behaviors to determine their current mood."""
        mood = "neutral"
        intensity = 0.5
        context = {}
        
        # Example analysis logic
        if behaviors:
            recent_actions = [b.action_type for b in behaviors]
            if "purchase" in recent_actions:
                mood = "satisfied"
                intensity = 0.8
            elif "view" in recent_actions:
                mood = "interested"
                intensity = 0.6
        
        return {
            "mood": mood,
            "intensity": intensity,
            "context": context
        }

class BehaviorAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = GenerativeModel('gemini-2.0-flash-001')
    
    async def analyze_behavior(self, behavior: Behavior) -> Dict[str, Any]:
        """Analyze a single behavior to extract insights."""
        insights = {
            "action_type": behavior.action_type,
            "context": behavior.context,
            "timestamp": behavior.created_at
        }
        return insights 
import requests
import json
import time
from typing import Dict, Any
import asyncio
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

class TestSmartCart:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.shopping_list_id = None
        self.product_id = None
        self.test_email = f"test_{int(time.time())}@example.com"
        self.test_password = "testpassword123"

    def get_headers(self) -> Dict[str, str]:
        """Get headers with authentication token."""
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    def test_user_registration(self) -> bool:
        """Test user registration."""
        print("\n1. Testing User Registration...")
        user_data = {
            "email": self.test_email,
            "password": self.test_password,
            "first_name": "Test",
            "last_name": "User"
        }
        try:
            response = requests.post(f"{BASE_URL}/users/", json=user_data)
            response.raise_for_status()
            print("✓ User registration successful")
            return True
        except Exception as e:
            print(f"✗ User registration failed: {str(e)}")
            return False

    def test_user_login(self) -> bool:
        """Test user login."""
        print("\n2. Testing User Login...")
        login_data = {
            "username": self.test_email,
            "password": self.test_password
        }
        try:
            response = requests.post(
                f"{BASE_URL}/token",
                data=login_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            self.token = response.json()["access_token"]
            print("✓ User login successful")
            return True
        except Exception as e:
            print(f"✗ User login failed: {str(e)}")
            return False

    def test_product_management(self) -> bool:
        """Test product creation and retrieval."""
        print("\n3. Testing Product Management...")
        try:
            # Create a test product
            product_data = {
                "name": "Test Product",
                "description": "A test product for testing",
                "price": 99.99,
                "category": "Test Category"
            }
            response = requests.post(
                f"{BASE_URL}/products/",
                json=product_data,
                headers=self.get_headers()
            )
            response.raise_for_status()
            self.product_id = response.json()["id"]
            print("✓ Product creation successful")

            # Get all products
            response = requests.get(
                f"{BASE_URL}/products/",
                headers=self.get_headers()
            )
            response.raise_for_status()
            print(f"✓ Retrieved {len(response.json())} products")
            return True
        except Exception as e:
            print(f"✗ Product management failed: {str(e)}")
            return False

    def test_shopping_list_management(self) -> bool:
        """Test shopping list creation and management."""
        print("\n4. Testing Shopping List Management...")
        try:
            # Create a shopping list
            list_data = {"name": "Test Shopping List"}
            response = requests.post(
                f"{BASE_URL}/shopping-lists/",
                json=list_data,
                headers=self.get_headers()
            )
            response.raise_for_status()
            self.shopping_list_id = response.json()["id"]
            print("✓ Shopping list creation successful")

            # Add item to shopping list
            item_data = {
                "shopping_list_id": self.shopping_list_id,
                "product_id": self.product_id,
                "quantity": 2
            }
            response = requests.post(
                f"{BASE_URL}/shopping-list-items/",
                json=item_data,
                headers=self.get_headers()
            )
            response.raise_for_status()
            print("✓ Shopping list item addition successful")
            return True
        except Exception as e:
            print(f"✗ Shopping list management failed: {str(e)}")
            return False

    def test_recommendations(self) -> bool:
        """Test recommendation system."""
        print("\n5. Testing Recommendations...")
        try:
            response = requests.get(
                f"{BASE_URL}/recommendations/",
                headers=self.get_headers()
            )
            response.raise_for_status()
            recommendations = response.json()
            print(f"✓ Retrieved {len(recommendations)} recommendations")
            return True
        except Exception as e:
            print(f"✗ Recommendations failed: {str(e)}")
            return False

    def test_analytics(self) -> bool:
        """Test analytics endpoints."""
        print("\n6. Testing Analytics...")
        endpoints = [
            "/analytics/shopping-patterns",
            "/analytics/mood-trends",
            "/analytics/categories",
            "/analytics/recommendations"
        ]
        success = True
        for endpoint in endpoints:
            try:
                response = requests.get(
                    f"{BASE_URL}{endpoint}",
                    headers=self.get_headers()
                )
                response.raise_for_status()
                print(f"✓ {endpoint} successful")
            except Exception as e:
                print(f"✗ {endpoint} failed: {str(e)}")
                success = False
        return success

    def test_agent_interactions(self) -> bool:
        """Test agent interactions and insights."""
        print("\n7. Testing Agent Interactions...")
        try:
            # Test mood update
            mood_data = {
                "mood": "happy",
                "intensity": 0.8,
                "context": {"reason": "testing"}
            }
            response = requests.post(
                f"{BASE_URL}/mood/",
                json=mood_data,
                headers=self.get_headers()
            )
            response.raise_for_status()
            print("✓ Mood update successful")

            # Test behavior tracking
            behavior_data = {
                "action_type": "view",
                "product_id": self.product_id,
                "context": {"source": "test"}
            }
            response = requests.post(
                f"{BASE_URL}/behaviors/",
                json=behavior_data,
                headers=self.get_headers()
            )
            response.raise_for_status()
            print("✓ Behavior tracking successful")
            return True
        except Exception as e:
            print(f"✗ Agent interactions failed: {str(e)}")
            return False

    def test_real_time_updates(self) -> bool:
        """Test real-time updates functionality."""
        print("\n8. Testing Real-time Updates...")
        try:
            response = requests.get(
                f"{BASE_URL}/updates/",
                headers=self.get_headers()
            )
            response.raise_for_status()
            updates = response.json()
            print(f"✓ Retrieved {len(updates)} updates")
            return True
        except Exception as e:
            print(f"✗ Real-time updates failed: {str(e)}")
            return False

    def run_all_tests(self) -> bool:
        """Run all tests and return overall success status."""
        print("Starting comprehensive testing of SmartCart...")
        tests = [
            self.test_user_registration,
            self.test_user_login,
            self.test_product_management,
            self.test_shopping_list_management,
            self.test_recommendations,
            self.test_analytics,
            self.test_agent_interactions,
            self.test_real_time_updates
        ]
        
        success = True
        for test in tests:
            if not test():
                success = False
        
        print("\nTesting Summary:")
        print("✓" if success else "✗", "All tests completed")
        return success

if __name__ == "__main__":
    tester = TestSmartCart()
    tester.run_all_tests() 
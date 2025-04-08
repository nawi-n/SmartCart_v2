import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8000/api/v1"

def test_user_registration() -> Dict[str, Any]:
    """Test user registration endpoint."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "first_name": "Test",
        "last_name": "User"
    }
    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    return response.json()

def test_user_login() -> Dict[str, Any]:
    """Test user login endpoint."""
    login_data = {
        "username": "test@example.com",
        "password": "testpassword123"
    }
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    return response.json()

def test_product_browsing(token: str) -> Dict[str, Any]:
    """Test product browsing endpoint."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/products/", headers=headers)
    return response.json()

def test_shopping_list_management(token: str) -> Dict[str, Any]:
    """Test shopping list management endpoints."""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a new shopping list
    list_data = {"name": "Test Shopping List"}
    response = requests.post(f"{BASE_URL}/shopping-lists/", json=list_data, headers=headers)
    list_id = response.json()["id"]
    
    # Add items to the list
    item_data = {
        "shopping_list_id": list_id,
        "product_id": 1,  # Assuming product with ID 1 exists
        "quantity": 2
    }
    response = requests.post(f"{BASE_URL}/shopping-list-items/", json=item_data, headers=headers)
    
    return response.json()

def test_recommendations(token: str) -> Dict[str, Any]:
    """Test recommendations endpoint."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/recommendations/", headers=headers)
    return response.json()

def test_analytics(token: str) -> Dict[str, Any]:
    """Test analytics endpoints."""
    headers = {"Authorization": f"Bearer {token}"}
    endpoints = [
        "/analytics/shopping-patterns",
        "/analytics/mood-trends",
        "/analytics/categories",
        "/analytics/recommendations"
    ]
    
    results = {}
    for endpoint in endpoints:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        results[endpoint] = response.json()
    
    return results

def main():
    print("Starting frontend testing...")
    
    # Test user registration
    print("\n1. Testing user registration...")
    registration_result = test_user_registration()
    print(f"Registration result: {registration_result}")
    
    # Test user login
    print("\n2. Testing user login...")
    login_result = test_user_login()
    print(f"Login result: {login_result}")
    token = login_result.get("access_token")
    
    if not token:
        print("Login failed. Cannot proceed with further tests.")
        return
    
    # Test product browsing
    print("\n3. Testing product browsing...")
    products = test_product_browsing(token)
    print(f"Found {len(products)} products")
    
    # Test shopping list management
    print("\n4. Testing shopping list management...")
    shopping_list = test_shopping_list_management(token)
    print(f"Shopping list result: {shopping_list}")
    
    # Test recommendations
    print("\n5. Testing recommendations...")
    recommendations = test_recommendations(token)
    print(f"Recommendations result: {recommendations}")
    
    # Test analytics
    print("\n6. Testing analytics...")
    analytics = test_analytics(token)
    for endpoint, data in analytics.items():
        print(f"\n{endpoint}:")
        print(json.dumps(data, indent=2))
    
    print("\nFrontend testing completed!")

if __name__ == "__main__":
    main() 
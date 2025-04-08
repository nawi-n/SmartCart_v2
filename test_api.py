import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_user_creation():
    print("Testing user creation...")
    response = requests.post(
        f"{BASE_URL}/users/",
        json={
            "email": "test@example.com",
            "password": "test123",
            "first_name": "Test",
            "last_name": "User"
        }
    )
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def test_login():
    print("\nTesting login...")
    response = requests.post(
        f"{BASE_URL}/token",
        data={
            "username": "test@example.com",
            "password": "test123"
        }
    )
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def test_analytics(token):
    print("\nTesting analytics endpoints...")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test shopping patterns
    response = requests.get(f"{BASE_URL}/analytics/shopping-patterns", headers=headers)
    print("\nShopping Patterns:")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test mood trends
    response = requests.get(f"{BASE_URL}/analytics/mood-trends", headers=headers)
    print("\nMood Trends:")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test categories
    response = requests.get(f"{BASE_URL}/analytics/categories", headers=headers)
    print("\nCategories:")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test recommendations
    response = requests.get(f"{BASE_URL}/analytics/recommendations", headers=headers)
    print("\nRecommendations:")
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_quick_actions(token):
    print("\nTesting quick actions...")
    headers = {"Authorization": f"Bearer {token}"}
    
    actions = ["find-deals", "healthy-options", "budget-friendly", "trending"]
    for action in actions:
        response = requests.post(f"{BASE_URL}/quick-actions/{action}", headers=headers)
        print(f"\n{action}:")
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.json()}")

if __name__ == "__main__":
    # Test user creation
    user = test_user_creation()
    
    # Test login and get token
    token_data = test_login()
    token = token_data.get("access_token")
    
    if token:
        # Test analytics endpoints
        test_analytics(token)
        
        # Test quick actions
        test_quick_actions(token)
    else:
        print("Failed to get access token") 
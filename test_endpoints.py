import requests
import json
from colorama import init, Fore, Style

# Initialize colorama for Windows
init()

# Base URL
BASE_URL = "http://localhost:8000/api/v1"

def print_response(step, response):
    print(f"\n{Fore.GREEN}{step}{Style.RESET_ALL}")
    print("Status Code:", response.status_code)
    try:
        print("Response:", json.dumps(response.json(), indent=2))
    except:
        print("Response:", response.text)

def test_endpoints():
    print(f"{Fore.CYAN}🔥 Testing SmartCart API Endpoints{Style.RESET_ALL}")
    print("=================================")

    # 1. Create User
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    print_response("1. Creating User", response)

    # 2. Get Access Token
    token_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(
        f"{BASE_URL}/token",
        data=token_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    print_response("2. Getting Access Token", response)
    
    try:
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
    except:
        print(f"{Fore.RED}Failed to get token. Stopping tests.{Style.RESET_ALL}")
        return

    # 3. Get Current User
    response = requests.get(f"{BASE_URL}/users/me/", headers=headers)
    print_response("3. Getting Current User", response)

    # 4. Create Product
    product_data = {
        "name": "Test Product",
        "description": "A test product",
        "price": 19.99,
        "category": "Test Category"
    }
    response = requests.post(f"{BASE_URL}/products/", headers=headers, json=product_data)
    print_response("4. Creating Product", response)

    # 5. Get Products
    response = requests.get(f"{BASE_URL}/products/", headers=headers)
    print_response("5. Getting Products", response)

    # 6. Get Product by ID
    response = requests.get(f"{BASE_URL}/products/1", headers=headers)
    print_response("6. Getting Product by ID", response)

    # 7. Create Shopping List
    list_data = {"name": "Test Shopping List"}
    response = requests.post(f"{BASE_URL}/shopping-lists/", headers=headers, json=list_data)
    print_response("7. Creating Shopping List", response)
    
    try:
        list_id = response.json()["id"]
    except:
        list_id = 1

    # 8. Get Shopping Lists
    response = requests.get(f"{BASE_URL}/shopping-lists/", headers=headers)
    print_response("8. Getting Shopping Lists", response)

    # 9. Add Item to Shopping List
    item_data = {
        "product_id": 1,
        "quantity": 2
    }
    response = requests.post(f"{BASE_URL}/shopping-lists/{list_id}/items/", headers=headers, json=item_data)
    print_response("9. Adding Item to Shopping List", response)

    # 10. Get Updates
    response = requests.get(f"{BASE_URL}/updates", headers=headers)
    print_response("10. Getting Updates", response)

    # 11. Get Recommendations
    response = requests.get(f"{BASE_URL}/recommendations/", headers=headers)
    print_response("11. Getting Recommendations", response)

    # 12. Analyze Shopping List
    response = requests.get(f"{BASE_URL}/shopping-lists/{list_id}/analysis", headers=headers)
    print_response("12. Analyzing Shopping List", response)

    # 13. Get User Persona
    response = requests.get(f"{BASE_URL}/users/me/persona", headers=headers)
    print_response("13. Getting User Persona", response)

    # 14. Get User Mood
    response = requests.get(f"{BASE_URL}/users/me/mood", headers=headers)
    print_response("14. Getting User Mood", response)

    # 15. Get User Behaviors
    response = requests.get(f"{BASE_URL}/users/me/behaviors", headers=headers)
    print_response("15. Getting User Behaviors", response)

    # 16. Get Shopping Patterns
    response = requests.get(f"{BASE_URL}/analytics/shopping-patterns", headers=headers)
    print_response("16. Getting Shopping Patterns", response)

    # 17. Get Mood Trends
    response = requests.get(f"{BASE_URL}/analytics/mood-trends", headers=headers)
    print_response("17. Getting Mood Trends", response)

    # 18. Get Categories Distribution
    response = requests.get(f"{BASE_URL}/analytics/categories", headers=headers)
    print_response("18. Getting Categories Distribution", response)

    # 19. Get Recommendation Performance
    response = requests.get(f"{BASE_URL}/analytics/recommendations", headers=headers)
    print_response("19. Getting Recommendation Performance", response)

    # 20. Execute Quick Action
    action_data = {
        "product_id": 1,
        "quantity": 1
    }
    response = requests.post(f"{BASE_URL}/quick-actions/add_to_cart", headers=headers, json=action_data)
    print_response("20. Executing Quick Action", response)

    # 21. Get Mood History
    response = requests.get(f"{BASE_URL}/mood/", headers=headers)
    print_response("21. Getting Mood History", response)

    # 22. Update Mood
    mood_data = {"mood": "happy"}
    response = requests.post(f"{BASE_URL}/mood/", headers=headers, json=mood_data)
    print_response("22. Updating Mood", response)

    print(f"\n{Fore.GREEN}✅ API Testing Complete{Style.RESET_ALL}")

if __name__ == "__main__":
    test_endpoints() 
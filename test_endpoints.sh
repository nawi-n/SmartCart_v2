#!/bin/bash

# Base URL
BASE_URL="http://localhost:8000/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔥 Testing SmartCart API Endpoints"
echo "================================="

# 1. Create User
echo -e "\n${GREEN}1. Creating User${NC}"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/" \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123"
}')
echo $USER_RESPONSE

# 2. Get Access Token
echo -e "\n${GREEN}2. Getting Access Token${NC}"
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/token" \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "testpass123"
}')
TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

# Store token for subsequent requests
AUTH_HEADER="Authorization: Bearer $TOKEN"

# 3. Get Current User
echo -e "\n${GREEN}3. Getting Current User${NC}"
curl -s -X GET "$BASE_URL/users/me/" \
-H "$AUTH_HEADER"

# 4. Create Product
echo -e "\n${GREEN}4. Creating Product${NC}"
curl -s -X POST "$BASE_URL/products/" \
-H "$AUTH_HEADER" \
-H "Content-Type: application/json" \
-d '{
  "name": "Test Product",
  "description": "A test product",
  "price": 19.99,
  "category": "Test Category"
}'

# 5. Get Products
echo -e "\n${GREEN}5. Getting Products${NC}"
curl -s -X GET "$BASE_URL/products/" \
-H "$AUTH_HEADER"

# 6. Get Product by ID
echo -e "\n${GREEN}6. Getting Product by ID${NC}"
curl -s -X GET "$BASE_URL/products/1" \
-H "$AUTH_HEADER"

# 7. Create Shopping List
echo -e "\n${GREEN}7. Creating Shopping List${NC}"
SHOPPING_LIST_RESPONSE=$(curl -s -X POST "$BASE_URL/shopping-lists/" \
-H "$AUTH_HEADER" \
-H "Content-Type: application/json" \
-d '{
  "name": "Test Shopping List"
}')
LIST_ID=$(echo $SHOPPING_LIST_RESPONSE | jq -r '.id')

# 8. Get Shopping Lists
echo -e "\n${GREEN}8. Getting Shopping Lists${NC}"
curl -s -X GET "$BASE_URL/shopping-lists/" \
-H "$AUTH_HEADER"

# 9. Add Item to Shopping List
echo -e "\n${GREEN}9. Adding Item to Shopping List${NC}"
curl -s -X POST "$BASE_URL/shopping-lists/$LIST_ID/items/" \
-H "$AUTH_HEADER" \
-H "Content-Type: application/json" \
-d '{
  "product_id": 1,
  "quantity": 2
}'

# 10. Get Updates
echo -e "\n${GREEN}10. Getting Updates${NC}"
curl -s -X GET "$BASE_URL/updates" \
-H "$AUTH_HEADER"

# 11. Get Recommendations
echo -e "\n${GREEN}11. Getting Recommendations${NC}"
curl -s -X GET "$BASE_URL/recommendations/" \
-H "$AUTH_HEADER"

# 12. Analyze Shopping List
echo -e "\n${GREEN}12. Analyzing Shopping List${NC}"
curl -s -X GET "$BASE_URL/shopping-lists/$LIST_ID/analysis" \
-H "$AUTH_HEADER"

# 13. Get User Persona
echo -e "\n${GREEN}13. Getting User Persona${NC}"
curl -s -X GET "$BASE_URL/users/me/persona" \
-H "$AUTH_HEADER"

# 14. Get User Mood
echo -e "\n${GREEN}14. Getting User Mood${NC}"
curl -s -X GET "$BASE_URL/users/me/mood" \
-H "$AUTH_HEADER"

# 15. Get User Behaviors
echo -e "\n${GREEN}15. Getting User Behaviors${NC}"
curl -s -X GET "$BASE_URL/users/me/behaviors" \
-H "$AUTH_HEADER"

# 16. Get Shopping Patterns
echo -e "\n${GREEN}16. Getting Shopping Patterns${NC}"
curl -s -X GET "$BASE_URL/analytics/shopping-patterns" \
-H "$AUTH_HEADER"

# 17. Get Mood Trends
echo -e "\n${GREEN}17. Getting Mood Trends${NC}"
curl -s -X GET "$BASE_URL/analytics/mood-trends" \
-H "$AUTH_HEADER"

# 18. Get Categories Distribution
echo -e "\n${GREEN}18. Getting Categories Distribution${NC}"
curl -s -X GET "$BASE_URL/analytics/categories" \
-H "$AUTH_HEADER"

# 19. Get Recommendation Performance
echo -e "\n${GREEN}19. Getting Recommendation Performance${NC}"
curl -s -X GET "$BASE_URL/analytics/recommendations" \
-H "$AUTH_HEADER"

# 20. Execute Quick Action
echo -e "\n${GREEN}20. Executing Quick Action${NC}"
curl -s -X POST "$BASE_URL/quick-actions/add_to_cart" \
-H "$AUTH_HEADER" \
-H "Content-Type: application/json" \
-d '{
  "product_id": 1,
  "quantity": 1
}'

# 21. Get Mood History
echo -e "\n${GREEN}21. Getting Mood History${NC}"
curl -s -X GET "$BASE_URL/mood/" \
-H "$AUTH_HEADER"

# 22. Update Mood
echo -e "\n${GREEN}22. Updating Mood${NC}"
curl -s -X POST "$BASE_URL/mood/" \
-H "$AUTH_HEADER" \
-H "Content-Type: application/json" \
-d '{
  "mood": "happy"
}'

echo -e "\n${GREEN}✅ API Testing Complete${NC}" 
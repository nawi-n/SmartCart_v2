# SmartCart - GenAI-Powered Personalized Shopping Platform

SmartCart is a modern shopping platform that uses Generative AI to provide personalized product recommendations and shopping list management.

## Features

- User authentication and profile management
- Personalized product recommendations using Google's Generative AI
- Shopping list creation and management
- Product browsing and search
- Smart shopping list analysis

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: HTML, CSS (Tailwind), JavaScript
- AI: Google Generative AI
- Authentication: JWT

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SmartCart_v2.git
cd SmartCart_v2
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your actual configuration:
  - `DATABASE_URL`: Your database connection string
  - `SECRET_KEY`: A secure secret key for JWT
  - `GOOGLE_API_KEY`: Your Google Generative AI API key

5. Initialize the database:
```bash
python -m backend.app.main
```

6. Start the development server:
```bash
uvicorn backend.app.main:app --reload
```

7. Access the application:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Frontend: http://localhost:8000/static

## API Endpoints

### Authentication
- `POST /token`
  - Description: Get authentication token
  - Payload:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "string",
      "token_type": "bearer"
    }
    ```

### User Management
- `POST /users/`
  - Description: Create new user
  - Payload:
    ```json
    {
      "email": "string",
      "password": "string",
      "first_name": "string",
      "last_name": "string"
    }
    ```
  - Response:
    ```json
    {
      "id": "integer",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "is_active": "boolean",
      "preferences": "object",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

- `GET /users/me/`
  - Description: Get current user profile
  - Response:
    ```json
    {
      "id": "integer",
      "email": "string",
      "first_name": "string",
      "last_name": "string",
      "is_active": "boolean",
      "preferences": "object",
      "created_at": "datetime",
      "updated_at": "datetime",
      "shopping_lists": [
        {
          "id": "integer",
          "name": "string",
          "created_at": "datetime",
          "updated_at": "datetime",
          "items": [
            {
              "id": "integer",
              "product_id": "integer",
              "quantity": "integer",
              "created_at": "datetime",
              "product": {
                "id": "integer",
                "name": "string",
                "description": "string",
                "price": "float",
                "category": "string",
                "created_at": "datetime",
                "updated_at": "datetime"
              }
            }
          ]
        }
      ],
      "behaviors": [
        {
          "id": "integer",
          "product_id": "integer",
          "action_type": "string",
          "context": "object",
          "created_at": "datetime",
          "product": {
            "id": "integer",
            "name": "string",
            "description": "string",
            "price": "float",
            "category": "string",
            "created_at": "datetime",
            "updated_at": "datetime"
          }
        }
      ],
      "mood_states": [
        {
          "id": "integer",
          "mood": "string",
          "intensity": "float",
          "context": "object",
          "created_at": "datetime"
        }
      ],
      "personas": [
        {
          "id": "integer",
          "traits": "object",
          "shopping_style": "object",
          "interests": "object",
          "created_at": "datetime"
        }
      ]
    }
    ```

### Products
- `POST /products/`
  - Description: Create new product
  - Payload:
    ```json
    {
      "name": "string",
      "description": "string",
      "price": "float",
      "category": "string",
      "brand": "string"
    }
    ```
  - Response:
    ```json
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "float",
      "category": "string",
      "nutritional_info": "object",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

- `GET /products/`
  - Description: Get all products
  - Query Parameters:
    - `skip`: int (default: 0)
    - `limit`: int (default: 100)
  - Response:
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "description": "string",
        "price": "float",
        "category": "string",
        "nutritional_info": "object",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    ]
    ```

- `GET /products/{product_id}`
  - Description: Get specific product
  - Response:
    ```json
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "float",
      "category": "string",
      "nutritional_info": "object",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
    ```

### Shopping Lists
- `POST /shopping-lists/`
  - Description: Create new shopping list
  - Payload:
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
  - Response:
    ```json
    {
      "id": "integer",
      "name": "string",
      "user_id": "integer",
      "created_at": "datetime",
      "updated_at": "datetime",
      "items": [
        {
          "id": "integer",
          "product_id": "integer",
          "quantity": "integer",
          "created_at": "datetime",
          "product": {
            "id": "integer",
            "name": "string",
            "description": "string",
            "price": "float",
            "category": "string",
            "created_at": "datetime",
            "updated_at": "datetime"
          }
        }
      ]
    }
    ```

- `GET /shopping-lists/`
  - Description: Get user's shopping lists
  - Response:
    ```json
    [
      {
        "id": "integer",
        "name": "string",
        "user_id": "integer",
        "created_at": "datetime",
        "updated_at": "datetime",
        "items": [
          {
            "id": "integer",
            "product_id": "integer",
            "quantity": "integer",
            "created_at": "datetime",
            "product": {
              "id": "integer",
              "name": "string",
              "description": "string",
              "price": "float",
              "category": "string",
              "created_at": "datetime",
              "updated_at": "datetime"
            }
          }
        ]
      }
    ]
    ```

- `POST /shopping-lists/{list_id}/items/`
  - Description: Add item to shopping list
  - Payload:
    ```json
    {
      "product_id": "int",
      "quantity": "int"
    }
    ```
  - Response:
    ```json
    {
      "id": "integer",
      "product_id": "integer",
      "quantity": "integer",
      "shopping_list_id": "integer",
      "created_at": "datetime",
      "product": {
        "id": "integer",
        "name": "string",
        "description": "string",
        "price": "float",
        "category": "string",
        "created_at": "datetime",
        "updated_at": "datetime"
      }
    }
    ```

- `GET /shopping-lists/{list_id}/analysis`
  - Description: Analyze shopping list
  - Response:
    ```json
    {
      "shopping_patterns": {
        "dates": ["string"],
        "frequencies": ["integer"]
      },
      "mood_trends": {
        "dates": ["string"],
        "intensities": ["float"]
      },
      "category_distribution": {
        "categories": ["string"],
        "counts": ["integer"]
      },
      "recommendations": [
        {
          "id": "integer",
          "product_id": "integer",
          "score": "float",
          "context": "object",
          "created_at": "datetime",
          "product": {
            "id": "integer",
            "name": "string",
            "description": "string",
            "price": "float",
            "category": "string",
            "created_at": "datetime",
            "updated_at": "datetime"
          }
        }
      ]
    }
    ```

### Recommendations
- `GET /recommendations/`
  - Description: Get personalized recommendations
  - Response:
    ```json
    [
      {
        "id": "integer",
        "product_id": "integer",
        "score": "float",
        "context": "object",
        "created_at": "datetime",
        "product": {
          "id": "integer",
          "name": "string",
          "description": "string",
          "price": "float",
          "category": "string",
          "created_at": "datetime",
          "updated_at": "datetime"
        }
      }
    ]
    ```

- `POST /recommend_products`
  - Description: Get personalized product recommendations
  - Payload:
    ```json
    {
      "customer_id": "string"
    }
    ```
  - Response:
    ```json
    [
      {
        "product_id": "string",
        "name": "string",
        "category": "string",
        "price": "float",
        "match_score": "float",
        "explanation": "string"
      }
    ]
    ```

### Chat and AI Features
- `POST /chat`
  - Description: Chat with shopping assistant
  - Payload:
    ```json
    {
      "message": "string",
      "customer_id": "string"
    }
    ```
  - Response:
    ```json
    {
      "response": "string",
      "suggested_actions": ["string"]
    }
    ```

- `POST /product_storytelling`
  - Description: Generate product story
  - Payload:
    ```json
    {
      "product_id": "int"
    }
    ```
  - Response:
    ```json
    {
      "product_id": "string",
      "story": "string"
    }
    ```

### Behavior Tracking
- `POST /submit_behavior`
  - Description: Track customer behavior
  - Payload:
    ```json
    {
      "customer_id": "string",
      "action_type": "string",
      "product_id": "int",
      "details": "object",
      "category": "string",
      "price": "float"
    }
    ```
  - Response:
    ```json
    {
      "status": "string",
      "message": "string",
      "updated_fields": ["string"]
    }
    ```

### Persona and Mood
- `POST /generate_persona`
  - Description: Generate customer persona
  - Payload:
    ```json
    {
      "customer_id": "string"
    }
    ```
  - Response:
    ```json
    {
      "customer_id": "string",
      "persona_traits": ["string"],
      "psychographic_profile": "string",
      "match_score": "float"
    }
    ```

- `POST /mood/`
  - Description: Update user mood
  - Payload:
    ```json
    {
      "mood_state": "string",
      "intensity": "float",
      "context": "string"
    }
    ```
  - Response:
    ```json
    {
      "id": "integer",
      "mood": "string",
      "intensity": "float",
      "context": "object",
      "created_at": "datetime"
    }
    ```

- `GET /mood/`
  - Description: Get mood history
  - Response:
    ```json
    [
      {
        "id": "integer",
        "mood": "string",
        "intensity": "float",
        "context": "object",
        "created_at": "datetime"
      }
    ]
    ```

### Analytics
- `GET /analytics/shopping-patterns`
  - Description: Get shopping patterns
  - Response:
    ```json
    {
      "dates": ["string"],
      "frequencies": ["integer"]
    }
    ```

- `GET /analytics/mood-trends`
  - Description: Get mood trends
  - Response:
    ```json
    {
      "dates": ["string"],
      "intensities": ["float"]
    }
    ```

- `GET /analytics/categories`
  - Description: Get category distribution
  - Response:
    ```json
    {
      "categories": ["string"],
      "counts": ["integer"]
    }
    ```

- `GET /analytics/recommendations`
  - Description: Get recommendation performance
  - Response:
    ```json
    {
      "products": ["string"],
      "scores": ["float"]
    }
    ```

### Quick Actions
- `POST /quick-actions/{action_type}`
  - Description: Execute quick action
  - Path Parameter: action_type (string)
  - Response:
    ```json
    {
      "status": "string",
      "message": "string",
      "result": "object"
    }
    ```

### WebSocket
- `GET /ws/updates`
  - Description: WebSocket endpoint for real-time updates
  - Response: Stream of updates in the format:
    ```json
    {
      "message": "string",
      "type": "string",  // info, success, warning, error
      "timestamp": "datetime"
    }
    ```

- `GET /updates`
  - Description: Get recent updates
  - Response:
    ```json
    [
      {
        "message": "string",
        "type": "string",  // info, success, warning, error
        "timestamp": "datetime"
      }
    ]
    ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
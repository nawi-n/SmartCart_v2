# SmartCart - GenAI-Powered Personalized Shopping Platform

SmartCart is a modern shopping platform that uses Generative AI to provide personalized product recommendations and shopping list management.

## Project Structure

```
SmartCart_v2/
├── backend/                    # Backend FastAPI application
│   ├── app/                    # Application code
│   │   ├── api/               # API endpoints
│   │   │   ├── endpoints/     # Route handlers
│   │   │   └── __init__.py
│   │   ├── core/              # Core functionality
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── config.py      # Configuration
│   │   │   └── __init__.py
│   │   ├── models/            # Database models
│   │   │   ├── models.py
│   │   │   └── __init__.py
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── schemas.py
│   │   │   └── __init__.py
│   │   ├── services/          # Business logic
│   │   │   ├── genai_service.py
│   │   │   ├── agents.py
│   │   │   └── __init__.py
│   │   ├── database/          # Database configuration
│   │   │   ├── database.py
│   │   │   └── __init__.py
│   │   └── main.py            # FastAPI application
│   ├── tests/                 # Backend tests
│   │   ├── __init__.py
│   │   ├── test_api.py
│   │   └── test_endpoints.py
│   ├── alembic/               # Database migrations
│   ├── alembic.ini
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Frontend React application
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application
│   ├── public/              # Static files
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
├── data/                    # Data files
│   ├── product_recommendation_data.csv
│   └── customer_data_collection.csv
├── .env                     # Environment variables
└── .gitignore              # Git ignore rules
```

## Features

- User authentication and profile management
- Personalized product recommendations using Google's Generative AI
- Shopping list creation and management
- Product browsing and search
- Smart shopping list analysis
- Real-time updates and notifications

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React, Vite, Tailwind CSS
- AI: Google Generative AI
- Authentication: JWT
- Database: SQLite with Alembic migrations

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SmartCart_v2.git
cd SmartCart_v2
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your actual configuration:
  - `DATABASE_URL`: Your database connection string
  - `SECRET_KEY`: A secure secret key for JWT
  - `GOOGLE_API_KEY`: Your Google Generative AI API key

5. Initialize the database:
```bash
cd ../backend
alembic upgrade head
```

6. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

7. Access the application:
- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Frontend: http://localhost:3000

## API Endpoints

- `POST /api/v1/token`: Get authentication token
- `POST /api/v1/users/`: Create new user
- `GET /api/v1/users/me/`: Get current user profile
- `GET /api/v1/products/`: Get all products
- `POST /api/v1/products/`: Create new product
- `GET /api/v1/shopping-lists/`: Get user's shopping lists
- `POST /api/v1/shopping-lists/`: Create new shopping list
- `POST /api/v1/shopping-lists/{id}/items/`: Add item to shopping list
- `GET /api/v1/recommendations/`: Get personalized recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
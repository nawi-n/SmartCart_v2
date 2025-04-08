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
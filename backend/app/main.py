from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from backend.app.api.endpoints import router as api_router
from backend.database.database import init_db

app = FastAPI(
    title="SmartCart API",
    description="API for SmartCart shopping assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup."""
    await init_db()

@app.get("/", tags=["Health Check"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "message": "SmartCart API is up and running!"}

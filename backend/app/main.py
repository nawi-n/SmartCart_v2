from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from pathlib import Path
import asyncio

from backend.app.api.endpoints import router as api_router
from backend.database.database import init_db

# Get the absolute path to the frontend directory
FRONTEND_DIR = Path(__file__).parent.parent.parent / "frontend"

app = FastAPI(
    title="SmartCart API",
    description="API for SmartCart shopping assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 
# Configure templates
templates = Jinja2Templates(directory=str(FRONTEND_DIR / "templates"))

@app.get("/")
async def read_root(request: Request):
    """Serve the main frontend page."""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/{path:path}")
async def catch_all(path: str):
    """Catch-all route to serve frontend files."""
    # Skip API routes
    if path.startswith("api/"):
        return None
        
    # Check if the requested path exists in the frontend directory
    file_path = FRONTEND_DIR / path
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    
    # If the path doesn't exist, serve the main page (for SPA routing)
    return FileResponse(str(FRONTEND_DIR / "templates" / "index.html"))

# Include API routes after the catch-all route
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup."""
    await init_db() 
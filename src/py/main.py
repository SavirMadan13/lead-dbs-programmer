"""
Lead DBS Programmer - FastAPI Backend
Main application entry point for the FastAPI server that replaces the Electron TypeScript backend.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging
from pathlib import Path

from api.routes import patients, files, clinical, stimulation, visualization
from core.config import settings
from core.logging_config import setup_logging
from services.data_manager import DataManager

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize data manager
data_manager = DataManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("Starting Lead DBS Programmer FastAPI Backend...")
    
    # Initialize services
    await data_manager.initialize()
    
    # Ensure clinical scores file exists
    await data_manager.ensure_clinical_scores_file()
    
    yield
    
    logger.info("Shutting down Lead DBS Programmer FastAPI Backend...")

# Create FastAPI application
app = FastAPI(
    title="Lead DBS Programmer API",
    description="FastAPI backend for Lead DBS Programmer application",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(clinical.router, prefix="/api/clinical", tags=["clinical"])
app.include_router(stimulation.router, prefix="/api/stimulation", tags=["stimulation"])
app.include_router(visualization.router, prefix="/api/visualization", tags=["visualization"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Lead DBS Programmer FastAPI Backend", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug"
    )
#!/usr/bin/env python3
"""
Startup script for the Lead DBS Python FastAPI backend server.
This script ensures proper initialization and error handling.
"""

import sys
import os
import logging
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import pydantic
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Please install dependencies by running:")
        print("pip install -r requirements.txt")
        return False
    return True

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def main():
    """Main startup function"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    # Check if we're in the right directory
    current_dir = Path(__file__).parent
    main_py_path = current_dir / "main.py"
    
    if not main_py_path.exists():
        logger.error(f"main.py not found in {current_dir}")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    logger.info("Starting Lead DBS Python FastAPI backend server...")
    
    try:
        # Import and run the main application
        import uvicorn
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,  # Enable auto-reload during development
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("Server shutdown requested")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
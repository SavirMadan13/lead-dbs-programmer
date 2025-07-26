#!/usr/bin/env python3
"""
Run server script for Lead DBS Programmer FastAPI Backend
This script provides easy ways to run the server in different modes.
"""

import argparse
import os
import sys
import uvicorn
from pathlib import Path

# Add the src/py directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def run_development():
    """Run server in development mode with auto-reload"""
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="debug",
        access_log=True
    )

def run_production():
    """Run server in production mode"""
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info",
        access_log=True,
        workers=1  # Adjust based on your needs
    )

def run_custom(host: str, port: int, debug: bool = False):
    """Run server with custom settings"""
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="debug" if debug else "info",
        access_log=True
    )

def main():
    parser = argparse.ArgumentParser(description="Lead DBS Programmer FastAPI Backend")
    parser.add_argument(
        "--mode", 
        choices=["dev", "prod", "custom"], 
        default="dev",
        help="Server mode (default: dev)"
    )
    parser.add_argument(
        "--host", 
        default="127.0.0.1",
        help="Host to bind to (default: 127.0.0.1)"
    )
    parser.add_argument(
        "--port", 
        type=int, 
        default=8000,
        help="Port to bind to (default: 8000)"
    )
    parser.add_argument(
        "--debug", 
        action="store_true",
        help="Enable debug mode"
    )

    args = parser.parse_args()

    print(f"Starting Lead DBS Programmer FastAPI Backend...")
    print(f"Mode: {args.mode}")
    print(f"Host: {args.host}")
    print(f"Port: {args.port}")
    
    if args.mode == "dev":
        run_development()
    elif args.mode == "prod":
        run_production()
    elif args.mode == "custom":
        run_custom(args.host, args.port, args.debug)

if __name__ == "__main__":
    main()
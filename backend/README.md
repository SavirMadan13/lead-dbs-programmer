# Lead DBS Python Backend

This is the Python FastAPI backend that handles all file system operations for the Lead DBS application.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python start_server.py
   ```

3. **Access API documentation:**
   Open your browser to `http://127.0.0.1:8000/docs`

## Files

- `main.py` - Main FastAPI application with all endpoints
- `requirements.txt` - Python dependencies
- `start_server.py` - Server startup script with error handling
- `README.md` - This file

## API Endpoints

The server provides REST API endpoints for:

- File operations (read, write, import)
- Patient data management
- Clinical data operations  
- PLY and reconstruction data
- Batch operations
- Utility functions

See the full API documentation at `/docs` when the server is running.

## Development

The server runs with auto-reload enabled during development. Any changes to the Python files will automatically restart the server.

## Deployment

For production deployment, consider:

- Using a production ASGI server (like gunicorn with uvicorn workers)
- Adding authentication and authorization
- Implementing HTTPS
- Adding request rate limiting
- Setting up proper logging and monitoring

## Dependencies

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation and serialization

See `requirements.txt` for full dependency list with versions.
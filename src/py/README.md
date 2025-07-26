# Lead DBS Programmer - FastAPI Backend

This is the Python FastAPI backend that replaces the TypeScript Electron backend for the Lead DBS Programmer application.

## Features

- **FastAPI-based REST API** replacing Electron IPC communication
- **Async file operations** for improved performance
- **Comprehensive logging** with rotating file handlers
- **Modular architecture** with separate services and routes
- **Type safety** with Pydantic models
- **Error handling** with proper HTTP status codes
- **CORS support** for frontend integration

## Architecture

```
src/py/
├── main.py                 # FastAPI application entry point
├── run_server.py          # Server startup script
├── requirements.txt       # Python dependencies
├── .env.example          # Environment configuration example
├── core/                 # Core application configuration
│   ├── config.py         # Settings management
│   └── logging_config.py # Logging configuration
├── models/               # Pydantic data models
│   └── schemas.py        # API schemas and validation
├── services/             # Business logic services
│   ├── data_manager.py   # Global data management
│   ├── file_service.py   # File operations
│   └── helpers.py        # Utility functions
└── api/                  # API routes
    └── routes/
        ├── patients.py      # Patient management
        ├── files.py         # File operations
        ├── clinical.py      # Clinical data
        ├── stimulation.py   # Stimulation parameters
        └── visualization.py # PLY files and visualization
```

## Installation

1. **Install Python dependencies:**
   ```bash
   cd src/py
   pip install -r requirements.txt
   ```

2. **Create environment configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your specific configuration
   ```

## Usage

### Development Mode
```bash
python run_server.py --mode dev
```
- Runs with auto-reload enabled
- Debug logging
- Accessible at http://127.0.0.1:8000

### Production Mode
```bash
python run_server.py --mode prod
```
- Optimized for production
- Binds to all interfaces (0.0.0.0)
- Info level logging

### Custom Configuration
```bash
python run_server.py --mode custom --host 192.168.1.100 --port 8080 --debug
```

### Direct uvicorn
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## API Endpoints

### Core Endpoints
- `GET /` - Root endpoint with API info
- `GET /health` - Health check endpoint
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

### Patient Management
- `GET /api/patients/` - Get all patients
- `GET /api/patients/{patient_id}` - Get specific patient
- `GET /api/patients/{patient_id}/timelines` - Get patient timelines
- `POST /api/patients/create-miniset` - Create mini dataset

### File Operations
- `POST /api/files/import-inputdata` - Import input data file
- `POST /api/files/import` - Import patient file
- `POST /api/files/save` - Save patient file
- `POST /api/files/select-folder` - Select and validate folder
- `GET /api/files/timelines/{patient_id}` - Get patient timelines

### Clinical Data
- `POST /api/clinical/import/{patient_id}/{timeline}` - Import clinical file
- `POST /api/clinical/save/{patient_id}/{timeline}` - Save clinical file
- `POST /api/clinical/batch-import` - Batch import clinical data
- `GET /api/clinical/scores-types` - Get clinical score types

### Stimulation Parameters
- `GET /api/stimulation/data` - Get stimulation data
- `POST /api/stimulation/data` - Set stimulation data
- `POST /api/stimulation/save/{patient_id}/{timeline}` - Save stimulation file
- `POST /api/stimulation/batch-import` - Batch import stimulation data

### Visualization
- `GET /api/visualization/ply-files` - Get PLY files from atlases
- `GET /api/visualization/load-ply/{patient_id}/{timeline}` - Load PLY file
- `GET /api/visualization/load-reconstruction/{patient_id}` - Load reconstruction data

## Configuration

The application uses environment variables for configuration. See `.env.example` for available options:

- **HOST/PORT**: Server binding configuration
- **DEBUG**: Enable debug mode and verbose logging
- **LEAD_DBS_PATH**: Path to Lead-DBS installation
- **USER_DATA_DIR**: Directory for user data and logs
- **MAX_FILE_SIZE**: Maximum file upload size
- **CORS_ORIGINS**: Allowed CORS origins for frontend

## Integration with Electron

To integrate this FastAPI backend with your Electron application:

1. **Start the FastAPI server** when the Electron app launches
2. **Replace IPC calls** with HTTP requests to the FastAPI endpoints
3. **Handle authentication** if needed (currently open for local development)
4. **Update error handling** to work with HTTP status codes instead of IPC error events

### Example Integration

In your Electron main process:
```typescript
import { spawn } from 'child_process';
import fetch from 'node-fetch';

// Start FastAPI server
const pythonProcess = spawn('python', ['src/py/run_server.py'], {
  cwd: app.getAppPath()
});

// Replace IPC calls with HTTP requests
async function getPatients() {
  const response = await fetch('http://127.0.0.1:8000/api/patients/');
  return await response.json();
}
```

## Logging

Logs are stored in the user data directory:
- **app.log**: General application logs (rotating)
- **error.log**: Error-only logs (rotating)
- Console output for development

## Error Handling

The API returns standard HTTP status codes:
- **200**: Success
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

Error responses include detailed messages:
```json
{
  "detail": "Error description",
  "error": "error_type"
}
```

## Development

### Adding New Endpoints
1. Create new route files in `api/routes/`
2. Add business logic to `services/`
3. Define data models in `models/schemas.py`
4. Include router in `main.py`

### Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests (when test files are created)
pytest
```

## Performance Considerations

- **Async operations**: All file I/O is asynchronous
- **Connection pooling**: Use appropriate connection limits
- **File streaming**: Large files are handled efficiently
- **Caching**: Consider adding Redis for frequently accessed data
- **Database**: Consider PostgreSQL for complex queries if needed

## Security Notes

- **CORS**: Configure properly for production
- **Authentication**: Add authentication middleware if exposing beyond localhost
- **File validation**: Implement proper file type and size validation
- **Input sanitization**: All inputs are validated through Pydantic models
- **Path traversal**: File paths are properly validated to prevent directory traversal attacks
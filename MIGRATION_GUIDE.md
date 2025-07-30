# Lead DBS File System Migration Guide

This guide documents the migration from TypeScript file system operations to a Python FastAPI backend.

## Overview

The Lead DBS application has been migrated to use a Python FastAPI backend for all file system operations instead of direct file access from the Electron main process. This provides better separation of concerns, improved error handling, and easier maintenance.

## Architecture Changes

### Before Migration
- Direct file system operations in TypeScript (main.ts, ipcHandlers.ts)
- File reading/writing handled in Electron main process
- No separation between business logic and file operations

### After Migration
- Python FastAPI backend handles all file operations
- TypeScript Electron process communicates via HTTP REST API
- Clear separation between frontend (Electron) and backend (Python)
- Centralized file operation logic in Python

## Files Created/Modified

### New Python Backend Files
- `backend/main.py` - Main FastAPI application with all endpoints
- `backend/requirements.txt` - Python dependencies
- `backend/start_server.py` - Server startup script

### New TypeScript Files
- `src/main/utils/httpClient.ts` - HTTP client for API communication
- `src/main/main_http.ts` - Updated main.ts using HTTP calls
- `src/main/ipc/ipcHandlers_http.ts` - Updated IPC handlers using HTTP calls

### Migration Files (for reference)
- Original files remain unchanged as `main.ts` and `ipcHandlers.ts`
- New HTTP-based versions created with `_http` suffix

## Installation and Setup

### Prerequisites
- Python 3.8+ installed
- Node.js and npm (for Electron app)
- Existing Lead DBS application setup

### Python Backend Setup

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Test the backend server:**
   ```bash
   cd backend
   python start_server.py
   ```
   
   The server should start on `http://127.0.0.1:8000`

3. **Verify API is working:**
   Open your browser to `http://127.0.0.1:8000/docs` to see the FastAPI documentation

### Electron App Setup

1. **Install additional Node.js dependencies:**
   ```bash
   npm install electron-fetch
   ```

2. **Update the main process file:**
   - Replace imports in `src/main/main.ts` to use `main_http.ts`
   - Replace imports in `src/main/ipc/ipcHandlers.ts` to use `ipcHandlers_http.ts`

3. **Update build configuration (if needed):**
   - Ensure the Python backend is included in your build process
   - Update any startup scripts to launch the Python server

## API Endpoints

The Python backend provides the following main endpoints:

### File Operations
- `POST /api/import-inputdata-file` - Import input data files
- `POST /api/import-file` - Import patient/timeline files
- `POST /api/save-file` - Save stimulation parameters
- `POST /api/save-file-clinical` - Save clinical data
- `GET /api/read-file` - Read binary files

### Patient Data
- `GET /api/get-participants` - Get participants data
- `GET /api/get-timelines` - Get patient timelines
- `GET /api/get-clinical-data` - Get clinical data for patients

### PLY and Reconstruction Data
- `GET /api/load-ply-file-database` - Load PLY files for visualization
- `GET /api/load-reconstruction` - Load reconstruction data
- `GET /api/get-ply-files` - Get available PLY files
- `GET /api/get-ply-files-database` - Get PLY files from database

### Batch Operations
- `POST /api/batch-import-clinical` - Batch import clinical scores
- `POST /api/batch-import-stimulation` - Batch import stimulation parameters

### Utility Operations
- `GET /api/check-folder-exists` - Check if folder exists
- `POST /api/create-miniset` - Create patient minisets
- `GET /api/get-clinical-scores-types` - Get available clinical score types
- `POST /api/add-score-type` - Add new clinical score types

## Key Changes in Implementation

### Data Serialization
- Binary data (PLY files, NII files) is converted to hex strings for JSON transport
- TypeScript side converts hex strings back to ArrayBuffers
- All file paths are handled as strings in the API

### Error Handling
- Python backend provides structured error responses
- TypeScript client handles HTTP errors and provides fallbacks
- Logging is implemented on both sides for debugging

### Server Management
- Python server is started automatically by the Electron main process
- Server is gracefully shut down when the Electron app closes
- Health checks and retry logic can be added for production

## Testing the Migration

### Functional Tests
1. **File Import/Export:**
   - Test importing input data files
   - Test saving/loading stimulation parameters
   - Test clinical data operations

2. **Patient Management:**
   - Test loading patient lists
   - Test timeline operations
   - Test participant data access

3. **Visualization Data:**
   - Test PLY file loading
   - Test reconstruction data loading
   - Verify binary data integrity

### Performance Considerations
- HTTP calls add latency compared to direct file access
- Large binary files (PLY, NII) may take longer to transfer
- Consider implementing caching for frequently accessed data
- Monitor memory usage with large datasets

## Troubleshooting

### Common Issues

1. **Python server won't start:**
   - Check Python installation and version
   - Verify all dependencies are installed
   - Check for port conflicts (port 8000)

2. **HTTP connection errors:**
   - Ensure Python server is running before starting Electron app
   - Check firewall settings
   - Verify correct host/port configuration

3. **File operation failures:**
   - Check file permissions
   - Verify path configurations are correct
   - Check Python backend logs for detailed error messages

4. **Binary data corruption:**
   - Verify hex encoding/decoding is working correctly
   - Check for data size limits in HTTP transport
   - Monitor for memory issues with large files

### Debugging

1. **Python Backend Logs:**
   ```bash
   cd backend
   python start_server.py
   # Check console output for errors
   ```

2. **Electron Main Process Logs:**
   - Check Electron developer console
   - Look for HTTP client error messages
   - Verify IPC communication is working

3. **API Testing:**
   - Use FastAPI docs interface at `http://127.0.0.1:8000/docs`
   - Test individual endpoints with sample data
   - Check response formats and data integrity

## Rollback Plan

If issues arise, you can rollback to the original file-based system:

1. **Revert TypeScript files:**
   ```bash
   # Use original files instead of _http versions
   cp src/main/main.ts src/main/main_backup.ts
   cp src/main/main_original.ts src/main/main.ts
   cp src/main/ipc/ipcHandlers.ts src/main/ipc/ipcHandlers_backup.ts
   cp src/main/ipc/ipcHandlers_original.ts src/main/ipc/ipcHandlers.ts
   ```

2. **Remove HTTP client dependency:**
   ```bash
   npm uninstall electron-fetch
   ```

3. **Remove Python backend startup:**
   - Comment out or remove Python server startup code
   - Remove HTTP client imports

## Future Enhancements

### Performance Optimizations
- Implement response caching for static data
- Add request compression for large payloads
- Consider WebSocket connections for real-time operations
- Implement connection pooling

### Security Improvements
- Add authentication/authorization
- Implement HTTPS for production
- Add request validation and sanitization
- Implement rate limiting

### Monitoring and Logging
- Add structured logging with log levels
- Implement health check endpoints
- Add metrics collection
- Set up error reporting

### Scalability
- Consider microservice architecture for different data types
- Implement horizontal scaling for multiple instances
- Add load balancing if needed
- Consider database backend for metadata

## Conclusion

This migration provides a solid foundation for separating file operations from the Electron main process while maintaining all existing functionality. The HTTP-based architecture allows for better testing, debugging, and future enhancements while providing clear separation of concerns between the frontend and backend systems.
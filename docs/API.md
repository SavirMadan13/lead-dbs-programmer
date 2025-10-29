# API Documentation

This document provides comprehensive API documentation for the LeadDBS Programmer application.

## Table of Contents

- [Main Process APIs](#main-process-apis)
- [Renderer Process APIs](#renderer-process-apis)
- [IPC Communication](#ipc-communication)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

## Main Process APIs

### Application Class

The main application class that orchestrates all core functionality.

```typescript
class Application extends EventEmitter {
  // Singleton pattern
  static getInstance(): Application
  
  // Lifecycle methods
  initialize(): Promise<void>
  start(): Promise<void>
  shutdown(): Promise<void>
  
  // Manager getters
  getFileManager(): FileManager
  getWindowManager(): WindowManager
  getDataManager(): DataManager
  getHelperFunctions(): HelperFunctions
  
  // Event handling
  on(event: string, listener: Function): this
  emit(event: string, ...args: any[]): boolean
}
```

#### Methods

##### `getInstance()`
Returns the singleton instance of the Application class.

**Returns:** `Application` - The singleton instance

##### `initialize()`
Initializes all core managers and sets up the application.

**Returns:** `Promise<void>`

**Throws:** `AppError` if initialization fails

##### `start()`
Starts the application and creates the main window.

**Returns:** `Promise<void>`

**Throws:** `AppError` if startup fails

##### `shutdown()`
Gracefully shuts down the application and cleans up resources.

**Returns:** `Promise<void>`

### FileManager Class

Handles all file system operations with proper error handling and logging.

```typescript
class FileManager {
  constructor(logger: Logger)
  
  // Initialization
  initialize(): Promise<void>
  
  // Generic file operations
  readJSONFile<T>(filePath: string): Promise<T | null>
  writeJSONFile<T>(filePath: string, data: T): Promise<void>
  fileExists(filePath: string): Promise<boolean>
  directoryExists(dirPath: string): Promise<boolean>
  ensureDirectoryExists(dirPath: string): Promise<void>
  
  // Patient data operations
  readPatientsData(directoryPath: string): Promise<Patient[]>
  writePatientsData(directoryPath: string, patients: Patient[]): Promise<void>
  
  // Stimulation parameters
  readStimulationParameters(directoryPath: string, patientId: string): Promise<StimulationData | null>
  writeStimulationParameters(directoryPath: string, patientId: string, data: StimulationData): Promise<void>
  
  // Clinical scores
  readClinicalScores(): Promise<ClinicalScores | null>
  writeClinicalScores(scores: ClinicalScores): Promise<void>
  
  // Utility methods
  getPatientTimelines(directoryPath: string): Promise<PatientTimeline[]>
  getPatientDirectory(directoryPath: string, patientId: string, isLeadDBS: boolean): string
}
```

#### Methods

##### `readJSONFile<T>(filePath: string)`
Reads and parses a JSON file.

**Parameters:**
- `filePath` (string): Path to the JSON file

**Returns:** `Promise<T | null>` - Parsed JSON data or null if error

**Throws:** `AppError` if file cannot be read

##### `writeJSONFile<T>(filePath: string, data: T)`
Writes data to a JSON file.

**Parameters:**
- `filePath` (string): Path to the JSON file
- `data` (T): Data to write

**Returns:** `Promise<void>`

**Throws:** `AppError` if file cannot be written

##### `readPatientsData(directoryPath: string)`
Reads patient data from the specified directory.

**Parameters:**
- `directoryPath` (string): Path to the patient data directory

**Returns:** `Promise<Patient[]>` - Array of patient objects

**Throws:** `AppError` if data cannot be read

##### `writePatientsData(directoryPath: string, patients: Patient[])`
Writes patient data to the specified directory.

**Parameters:**
- `directoryPath` (string): Path to the patient data directory
- `patients` (Patient[]): Array of patient objects

**Returns:** `Promise<void>`

**Throws:** `AppError` if data cannot be written

### WindowManager Class

Manages Electron window lifecycle and events.

```typescript
class WindowManager {
  constructor(logger: Logger)
  
  // Initialization
  initialize(): Promise<void>
  
  // Window creation
  createMainWindow(): BrowserWindow
  
  // Window control
  getMainWindow(): BrowserWindow | null
  isMainWindowValid(): boolean
  showMainWindow(): void
  hideMainWindow(): void
  minimizeMainWindow(): void
  maximizeMainWindow(): void
  restoreMainWindow(): void
  closeMainWindow(): void
  
  // Window properties
  setWindowTitle(title: string): void
  getWindowBounds(): Rectangle | null
  setWindowBounds(bounds: Rectangle): void
  centerWindow(): void
  focusMainWindow(): void
  isMainWindowFocused(): boolean
  
  // Cleanup
  cleanup(): void
}
```

#### Methods

##### `createMainWindow()`
Creates the main application window.

**Returns:** `BrowserWindow` - The created window

**Throws:** `AppError` if window creation fails

##### `showMainWindow()`
Shows the main window if it exists.

**Throws:** `AppError` if window is not valid

##### `setWindowTitle(title: string)`
Sets the title of the main window.

**Parameters:**
- `title` (string): New window title

**Throws:** `AppError` if window is not valid

### DataManager Class

Provides in-memory data storage and management.

```typescript
class DataManager {
  constructor(logger: Logger)
  
  // Initialization
  initialize(): void
  cleanup(): void
  
  // Data operations
  getData<T>(key: string): T | undefined
  setData<T>(key: string, value: T): void
  hasData(key: string): boolean
  deleteData(key: string): void
  
  // Utility methods
  getAllKeys(): string[]
  getAllData(): Record<string, any>
  clearAllData(): void
  getDataSize(): number
}
```

#### Methods

##### `getData<T>(key: string)`
Retrieves data by key.

**Parameters:**
- `key` (string): Data key

**Returns:** `T | undefined` - Data value or undefined

##### `setData<T>(key: string, value: T)`
Stores data with the specified key.

**Parameters:**
- `key` (string): Data key
- `value` (T): Data value

**Throws:** `AppError` if key is invalid or value has circular references

##### `hasData(key: string)`
Checks if data exists for the specified key.

**Parameters:**
- `key` (string): Data key

**Returns:** `boolean` - True if data exists

### Logger Class

Provides centralized logging functionality.

```typescript
class Logger {
  constructor(
    context: string,
    logLevel?: LogLevel,
    logToFile?: boolean,
    maxLogFileSize?: number,
    maxLogFiles?: number
  )
  
  // Initialization
  initialize(): void
  
  // Configuration
  setLogLevel(level: LogLevel): void
  setLogToFile(enabled: boolean): void
  
  // Logging methods
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
}
```

#### Log Levels

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}
```

#### Methods

##### `debug(message: string, ...args: any[])`
Logs a debug message.

**Parameters:**
- `message` (string): Log message
- `...args` (any[]): Additional arguments

##### `info(message: string, ...args: any[])`
Logs an info message.

**Parameters:**
- `message` (string): Log message
- `...args` (any[]): Additional arguments

##### `warn(message: string, ...args: any[])`
Logs a warning message.

**Parameters:**
- `message` (string): Log message
- `...args` (any[]): Additional arguments

##### `error(message: string, ...args: any[])`
Logs an error message.

**Parameters:**
- `message` (string): Log message
- `...args` (any[]): Additional arguments

### HelperFunctions Class

Provides utility functions for common operations.

```typescript
class HelperFunctions {
  constructor(logger: Logger)
  
  // Path operations
  getPatientFolder(directoryPath: string, patientId: string, isLeadDBS: boolean): string
  getPatientFolderPly(directoryPath: string, patientId: string, isLeadDBS: boolean): string
  getRelativePath(basePath: string, targetPath: string): string
  getAbsolutePath(basePath: string, relativePath: string): string
  
  // File operations
  readJSON<T>(filePath: string): Promise<T | null>
  readJSONSync<T>(filePath: string): T | null
  writeJSON<T>(filePath: string, data: T, prettyPrint?: boolean): Promise<void>
  writeJSONSync<T>(filePath: string, data: T, prettyPrint?: boolean): void
  
  // File system checks
  fileExists(filePath: string): Promise<boolean>
  fileExistsSync(filePath: string): boolean
  directoryExists(dirPath: string): Promise<boolean>
  directoryExistsSync(dirPath: string): boolean
  ensureDirectoryExists(dirPath: string, recursive?: boolean): Promise<void>
  ensureDirectoryExistsSync(dirPath: string, recursive?: boolean): void
  
  // File management
  copyFile(sourcePath: string, destPath: string): Promise<void>
  copyFileSync(sourcePath: string, destPath: string): void
  deleteFile(filePath: string): Promise<void>
  deleteFileSync(filePath: string): void
  getFileStats(filePath: string): Promise<fs.Stats | null>
  getFileStatsSync(filePath: string): fs.Stats | null
  
  // Utility functions
  fileExistsInDirectory(directoryPath: string, fileName: string): Promise<boolean>
  fileExistsInDirectorySync(directoryPath: string, fileName: string): boolean
  getFilesInDirectory(directoryPath: string, extension?: string): Promise<string[]>
  getFilesInDirectorySync(directoryPath: string, extension?: string): string[]
  isValidFilePath(filePath: string): boolean
  sanitizeFileName(fileName: string): string
}
```

## Renderer Process APIs

### PatientContext

React context for managing patient data.

```typescript
interface PatientContextValue {
  patients: Patient[]
  setPatients: (patients: Patient[]) => void
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  removePatient: (id: string) => void
  getPatient: (id: string) => Patient | undefined
  clearPatients: () => void
}

// Context provider
function PatientProvider({ children }: { children: ReactNode }): JSX.Element

// Custom hook
function usePatientContext(): PatientContextValue
```

### Patient Interface

```typescript
interface Patient {
  id: string
  name: string
  age?: number
  gender?: string
  diagnosis?: string
  [key: string]: any
}
```

## IPC Communication

### Main Process Handlers

The application uses several IPC channels for communication between main and renderer processes:

#### File Operations

- `select-folder`: Request folder selection dialog
- `get-saved-directory`: Get saved directory path
- `save-patients-json`: Save patient data to JSON
- `load-patients-json`: Load patient data from JSON
- `check-folder-exists`: Check if folder exists

#### Data Operations

- `get-stimulation-data`: Get stimulation parameters
- `save-stimulation-data`: Save stimulation parameters
- `get-timelines`: Get patient timelines
- `get-clinical-scores`: Get clinical scores
- `save-clinical-scores`: Save clinical scores

#### Dialog Operations

- `show-error-dialog`: Show error dialog
- `show-info-dialog`: Show info dialog
- `show-confirmation-dialog`: Show confirmation dialog

#### Utility Operations

- `open-external-url`: Open external URL
- `get-app-version`: Get application version
- `get-platform-info`: Get platform information

### Legacy IPC Handlers

The application maintains backward compatibility with existing IPC channels:

- `save-file`: Save file data
- `save-file-clinical`: Save clinical file data
- `import-file-2`: Import file data
- `import-file-clinical`: Import clinical file data
- `load-ply-file`: Load PLY file
- `load-ply-file-anatomy`: Load anatomy PLY file
- `load-vis-coords`: Load visualization coordinates
- `file-reader`: Read file data
- `batch-import`: Batch import data
- `batch-import-stimulation`: Batch import stimulation data
- `get-clinical-scores-types`: Get clinical score types
- `add-score-type`: Add new score type
- `get-participants`: Get participants data
- `read-file`: Read file data
- `create-miniset`: Create mini dataset
- `download-clinical-data`: Download clinical data
- `get-clinical-data-for-plotting`: Get clinical data for plotting

## Type Definitions

### Core Types

```typescript
// Application configuration
interface AppConfig {
  version: string
  name: string
  description: string
  author: string
  license: string
  repository: string
  bugs: string
  homepage: string
  main: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  build: Record<string, any>
  electron: Record<string, any>
}

// Patient data
interface Patient {
  id: string
  name: string
  age?: number
  gender?: string
  diagnosis?: string
  [key: string]: any
}

// Stimulation data
interface StimulationData {
  patientId: string
  sessionId: string
  parameters: Record<string, any>
  timestamp: string
}

// Clinical scores
interface ClinicalScores {
  UPDRS: ScoreType
  YBOCS: ScoreType
  [key: string]: ScoreType
}

// Score type
interface ScoreType {
  name: string
  description: string
  min: number
  max: number
  unit: string
}

// Patient timeline
interface PatientTimeline {
  patientId: string
  sessions: Session[]
}

// Session
interface Session {
  id: string
  date: string
  clinicalScores?: ClinicalScores
  stimulationData?: StimulationData
}
```

### Error Types

```typescript
// Application error
class AppError extends Error {
  code: string
  context?: string
  originalError?: Error
  
  constructor(code: string, message: string, originalError?: Error, context?: string)
}

// Error codes
const ERROR_CODES = {
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  DIRECTORY_CREATE_ERROR: 'DIRECTORY_CREATE_ERROR',
  JSON_PARSE_ERROR: 'JSON_PARSE_ERROR',
  JSON_STRINGIFY_ERROR: 'JSON_STRINGIFY_ERROR',
  WINDOW_CREATE_ERROR: 'WINDOW_CREATE_ERROR',
  IPC_HANDLER_ERROR: 'IPC_HANDLER_ERROR',
  DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
  PATIENT_FOLDER_ERROR: 'PATIENT_FOLDER_ERROR',
  PATIENT_PLY_FOLDER_ERROR: 'PATIENT_PLY_FOLDER_ERROR',
  RELATIVE_PATH_ERROR: 'RELATIVE_PATH_ERROR',
  ABSOLUTE_PATH_ERROR: 'ABSOLUTE_PATH_ERROR',
  FILE_COPY_ERROR: 'FILE_COPY_ERROR',
  FILE_DELETE_ERROR: 'FILE_DELETE_ERROR',
  JSON_WRITE_ERROR: 'JSON_WRITE_ERROR'
} as const
```

## Error Handling

### Error Types

The application uses a custom `AppError` class for consistent error handling:

```typescript
class AppError extends Error {
  code: string
  context?: string
  originalError?: Error
  
  constructor(code: string, message: string, originalError?: Error, context?: string)
}
```

### Error Handling Patterns

1. **Try-Catch Blocks**: Wrap potentially failing operations
2. **Error Logging**: Log errors with context information
3. **Graceful Degradation**: Provide fallback behavior when possible
4. **User Feedback**: Show appropriate error messages to users

### Example Error Handling

```typescript
try {
  const data = await fileManager.readJSONFile<Patient[]>('patients.json');
  if (data) {
    setPatients(data);
  }
} catch (error) {
  logger.error('Failed to load patients:', error);
  throw new AppError('FILE_READ_ERROR', 'Failed to load patient data', error);
}
```

---

This API documentation provides comprehensive information about all the classes, methods, and interfaces available in the LeadDBS Programmer application. For more specific implementation details, refer to the source code and inline documentation.
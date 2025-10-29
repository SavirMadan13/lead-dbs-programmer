# LeadDBS Programmer

A comprehensive desktop application for managing and analyzing deep brain stimulation (DBS) patient data, built with Electron and React.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Development](#development)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

LeadDBS Programmer is a professional desktop application designed for managing and analyzing deep brain stimulation (DBS) patient data. The application provides a comprehensive interface for:

- Patient data management and visualization
- Clinical scores tracking and analysis
- Stimulation parameter management
- 3D visualization of electrode placements
- Data import/export capabilities
- Group analysis and statistics

## Features

### Core Functionality

- **Patient Database Management**: Comprehensive patient data management with search, sort, and filter capabilities
- **Clinical Scores**: Track and analyze various clinical assessment scores (UPDRS, Y-BOCS, etc.)
- **Stimulation Parameters**: Manage and analyze stimulation settings for different electrode configurations
- **3D Visualization**: Interactive 3D visualization of electrode placements and brain structures
- **Data Import/Export**: Support for Excel/CSV import and JSON export
- **Group Analysis**: Statistical analysis and visualization of group data
- **SEEG Integration**: Support for stereotactic EEG data analysis

### Technical Features

- **Modern Architecture**: Built with Electron, React, and TypeScript
- **Responsive Design**: Material-UI components with responsive layouts
- **Type Safety**: Comprehensive TypeScript implementation
- **Error Handling**: Robust error handling and logging system
- **Modular Design**: Clean separation of concerns with modular architecture
- **Performance Optimized**: Efficient data handling and rendering

## Architecture

### Main Process (Electron)

The main process is organized into several core modules:

#### Core Managers

- **Application**: Central orchestrator managing all core functionality
- **FileManager**: Handles all file system operations
- **WindowManager**: Manages Electron window lifecycle
- **DataManager**: Provides in-memory data storage and management
- **Logger**: Centralized logging system with file output

#### IPC Communication

- **IPCHandlers**: Manages all inter-process communication
- **Legacy Support**: Maintains backward compatibility with existing IPC channels

#### Utilities

- **HelperFunctions**: Common utility functions for file operations and data processing

### Renderer Process (React)

The renderer process is built with React and TypeScript:

#### Core Components

- **App**: Main application component with routing
- **Navbar**: Navigation bar with responsive design
- **PatientDatabase**: Comprehensive patient data management interface
- **PatientContext**: React context for patient data management

#### Specialized Components

- **ClinicalScores**: Clinical assessment score management
- **StimulationSettings**: Stimulation parameter configuration
- **NiiViewer**: 3D visualization component
- **DatabaseStats**: Statistical analysis and visualization

### Data Flow

```
Main Process (Electron)
├── Application (Singleton)
├── FileManager (File Operations)
├── WindowManager (Window Management)
├── DataManager (In-Memory Storage)
├── Logger (Logging System)
└── IPCHandlers (IPC Communication)

Renderer Process (React)
├── App (Main Component)
├── PatientContext (State Management)
├── PatientDatabase (Data Interface)
└── Specialized Components
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd leaddbs-programmer
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

## Development

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

4. Run linting:
```bash
npm run lint
```

### Project Structure

```
src/
├── main/                    # Main process (Electron)
│   ├── core/               # Core application modules
│   │   ├── Application.ts  # Main application class
│   │   ├── FileManager.ts  # File operations
│   │   ├── WindowManager.ts # Window management
│   │   ├── DataManager.ts  # Data management
│   │   └── IPCManager.ts   # IPC management
│   ├── ipc/                # IPC handlers
│   ├── helpers/            # Utility functions
│   └── utils/              # Utility classes
├── renderer/               # Renderer process (React)
│   ├── components/         # React components
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
└── types/                  # TypeScript type definitions
```

### Code Style

- Use TypeScript for all new code
- Follow React best practices
- Use Material-UI components
- Implement proper error handling
- Add comprehensive documentation

## Usage

### Getting Started

1. **Launch the Application**: Start the application using `npm start`
2. **Select Directory**: Choose a directory containing patient data
3. **Import Data**: Import patient data from Excel files or JSON
4. **Manage Patients**: View, edit, and manage patient information
5. **Analyze Data**: Use built-in tools for data analysis and visualization

### Key Features

#### Patient Management

- **Add Patients**: Create new patient records
- **Edit Information**: Update patient details
- **Search & Filter**: Find patients quickly
- **Import/Export**: Handle data from external sources

#### Clinical Analysis

- **Score Tracking**: Monitor clinical assessment scores
- **Trend Analysis**: Track changes over time
- **Group Comparisons**: Compare patient groups

#### 3D Visualization

- **Electrode Placement**: Visualize electrode positions
- **Brain Structures**: View anatomical structures
- **Interactive Controls**: Manipulate 3D views

## API Documentation

### Main Process APIs

#### Application Class

```typescript
class Application {
  static getInstance(): Application
  initialize(): Promise<void>
  start(): Promise<void>
  shutdown(): Promise<void>
  getFileManager(): FileManager
  getWindowManager(): WindowManager
  getDataManager(): DataManager
  getHelperFunctions(): HelperFunctions
}
```

#### FileManager Class

```typescript
class FileManager {
  initialize(): Promise<void>
  readJSONFile<T>(filePath: string): Promise<T | null>
  writeJSONFile<T>(filePath: string, data: T): Promise<void>
  readPatientsData(directoryPath: string): Promise<Patient[]>
  writePatientsData(directoryPath: string, patients: Patient[]): Promise<void>
  // ... more methods
}
```

#### DataManager Class

```typescript
class DataManager {
  initialize(): void
  getData<T>(key: string): T | undefined
  setData<T>(key: string, value: T): void
  hasData(key: string): boolean
  deleteData(key: string): void
  // ... more methods
}
```

### Renderer Process APIs

#### PatientContext

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
```

#### Patient Interface

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

## Contributing

### Development Guidelines

1. **Code Quality**: Maintain high code quality with proper TypeScript types
2. **Testing**: Write tests for new functionality
3. **Documentation**: Update documentation for new features
4. **Error Handling**: Implement proper error handling
5. **Performance**: Consider performance implications

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Code Review

- All code must be reviewed before merging
- Follow established coding standards
- Ensure proper error handling
- Verify TypeScript types are correct

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

## Changelog

### Version 2.0.0 (Current)

- Complete architectural refactoring
- TypeScript implementation
- Modular design with core managers
- Enhanced error handling and logging
- Improved user interface
- Better performance and maintainability

### Version 1.0.0

- Initial release
- Basic patient data management
- Clinical scores tracking
- 3D visualization
- Data import/export

---

**Note**: This application is designed for research and clinical use in deep brain stimulation. Please ensure compliance with relevant medical data regulations and ethical guidelines.
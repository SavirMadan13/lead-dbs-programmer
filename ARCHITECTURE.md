# Lead DBS Programmer - System Architecture

## Overview

Lead DBS Programmer is a comprehensive system for managing Deep Brain Stimulation (DBS) and Stereoelectroencephalography (SEEG) patient data, electrode configurations, and stimulation parameters. The application features a modern Electron-based frontend and a scalable Python FastAPI backend.

## Architecture Diagram (Mermaid)

```mermaid
flowchart TB
    subgraph Frontend [Frontend Layer (Electron + React)]
        direction TB
        Renderer[Renderer Process<br/>(React Components)]
        IPC[IPC Communication Layer<br/>(Electron IPC)]
        MainProcess[Main Process<br/>(Node.js)]
        HttpClient[HTTP Client<br/>(Axios/Fetch)]
    end

    subgraph Backend [Backend Layer (Python + FastAPI)]
        direction TB
        APIGateway[API Gateway<br/>(FastAPI main.py)]
        APIRoutes[API Routers<br/>{/api/patients/, /api/electrodes/, ...}]
        ServiceLayer[Service Layer<br/>(*Service classes)]
        DataProcessing[Data Processing Services<br/>(PLY, NIfTI, Mesh, Coord)]
        DataAccess[Data Access Layer<br/>(Repositories, Files)]
    end

    subgraph Storage [Data Storage Layer]
        FileSystem[[File System<br/>/patients/, /reconstructions/]]
        ConfigFiles[[Configuration Files<br/>participants.json, Preferences.json]]
    end

    %% Frontend communication
    Renderer -->|User Action| Renderer
    Renderer --> IPC
    IPC --> MainProcess
    MainProcess --> HttpClient

    %% Frontend-backend
    HttpClient --> APIGateway

    %% Backend structure
    APIGateway --> APIRoutes
    APIRoutes --> ServiceLayer
    ServiceLayer --> DataProcessing
    ServiceLayer --> DataAccess
    DataProcessing -- Reads/Writes --> DataAccess

    %% Backend-Storage
    DataAccess --> FileSystem
    DataAccess --> ConfigFiles

    %% Responses
    FileSystem -- Data Response --> Renderer
    ConfigFiles -- Config Data --> Renderer

    classDef layer fill:#f3f6fb,stroke:#0e4194,stroke-width:1.5px;
    class Frontend,Backend,Storage layer;
    classDef endpoint fill:#dbeafe,stroke:#1066b7,stroke-width:1px;
    class APIGateway,APIRoutes,ServiceLayer,DataProcessing,DataAccess endpoint;
```

## Technology Stack

### Frontend
- **Framework:** Electron (v12+)
- **UI Library:** React
- **3D Visualization:** Three.js
- **UI Components:** Material-UI (MUI)
- **Styling:** CSS, Bootstrap
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Framework:** Python FastAPI
- **Data Validation:** Pydantic
- **File Processing:** NumPy, SciPy
- **Medical Imaging:** Nibabel (NIfTI support)
- **3D Processing:** trimesh, open3d

### Data Formats
- **3D Models:** PLY (Polygon File Format)
- **Medical Imaging:** NIfTI (.nii, .nii.gz)
- **Data Storage:** JSON
- **Electrode Models:** Custom JSON configurations

## System Components

### Frontend Components

#### GroupViewer.js
- **Purpose:** 3D visualization of multiple patient electrode configurations
- **Highlights:** Three.js scene rendering, mesh controls, coordinate search

#### PatientDatabase.js
- **Purpose:** Patient data management and filtering
- **Highlights:** Listing, filtering, import/export

#### SEEG.js
- **Purpose:** SEEG stimulation configuration
- **Highlights:** Electrode/contact config, amplitude/pulse width

#### StimulationSettings.js
- **Purpose:** DBS stimulation parameter configuration
- **Highlights:** Contact/frequency settings

#### PatientDetails.js
- **Purpose:** Individual patient data view
- **Highlights:** Demographics, configuration, history

#### ClinicalScores.js
- **Purpose:** Clinical score data management
- **Highlights:** Entry, visualization, analysis

### Backend Services

- **PatientService:** CRUD, filtering, validation
- **ElectrodeService:** Model/configuration management
- **StimulationService:** Params, validation, optimization
- **ReconstructionService:** 3D reconstruction, PLY gen
- **SEEGService:** SEEG data/process handling
- **ClinicalScoreService:** Scores management, statistics

### Data Processing Services

- **PLYFileProcessor:** PLY parse/generate, mesh optimization
- **NiftiProcessor:** Read/write NIfTI, voxel and coord processing
- **CoordinateTransformer:** System conversions, affine transformations
- **MeshGenerator:** 3D mesh operations/rendering

## Communication Flow

```mermaid
flowchart LR
    User[User Action] --> UI[React Component]
    UI --> IPC[IPC Handler (Electron)]
    IPC --> HTTP[HTTP Client (Axios/Fetch)]
    HTTP --> API[FastAPI Endpoint]
    API --> Service[Service Layer]
    Service --> Repo[Repository Layer]
    Repo --> FS[File System / Data Storage]
    FS -->|Response| UI
```

## Key Features

### 1. 3D Visualization
- Real-time rendering, overlays, camera, mesh/opacity controls

### 2. Patient Management
- Filterable DB, multi-publication, import/export

### 3. Stimulation Configuration
- DBS/SEEG settings, contact selection, optimization

### 4. Clinical Data Management
- Score tracking, stats, reports

### 5. Electrode Management
- Multiple models, custom config, 3D visual, contact params

## Data Flow

**Patient Data Flow**
1. Loaded from file system
2. Filtered in UI
3. Rendered in 3D
4. Electrode displays
5. Stimulation managed

**Stimulation Parameter Flow**
1. UI input/config
2. Validated by backend
3. Saved to file system
4. Visual updates
5. Outcomes tracked

**3D Visualization Flow**
1. PLY load
2. Parsed with PLYLoader
3. Three.js mesh creation
4. Scene composition
5. Rendered in UI

## Security Considerations

- **Data Privacy:** All patient data is stored locally
- **File Access:** Limited to application directory
- **API Security:** CORS-configured FastAPI
- **Validation:** Strict at each app layer

## Performance Optimizations

- Mesh simplification/optimization
- Lazy-load UI components
- Data caching
- Efficient (conditional) rendering

## Future Enhancements

- [ ] Database integration (e.g., PostgreSQL/MongoDB)
- [ ] Real-time collaboration
- [ ] Cloud storage
- [ ] Advanced analytics & ML
- [ ] Mobile support
- [ ] Enhanced visualizations
- [ ] Automated reporting
- [ ] DICOM viewer integration

## Contributing

We welcome contributions. Please see our contributing guidelines and submit PRs for improvements.

## License

See LICENSE file for license details.

## Contact

For questions or support, open a GitHub issue.


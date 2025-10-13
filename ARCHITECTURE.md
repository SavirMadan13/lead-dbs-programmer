# Lead DBS Programmer - System Architecture

## Overview

Lead DBS Programmer is a comprehensive system designed to manage Deep Brain Stimulation (DBS) and Stereoelectroencephalography (SEEG) patient data, electrode configurations, and stimulation settings. The application uses an Electron-based frontend and a Python FastAPI backend.

## System Architecture Diagrams

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Desktop Application (Electron)"
        subgraph "Renderer Process (React)"
            UI[React UI Components]
            ThreeJS[Three.js 3D Engine]
            State[React State Management]
        end
        
        subgraph "Main Process (Node.js)"
            IPC[IPC Handlers]
            HTTPClient[HTTP Client<br/>Axios/Fetch]
            FileAccess[File System Access]
        end
    end
    
    subgraph "Backend Services (Python FastAPI)"
        subgraph "API Layer"
            FastAPI[FastAPI Application<br/>Port 8000]
            CORS[CORS Middleware]
            Auth[JWT Authentication]
        end
        
        subgraph "Service Layer"
            PatientService[Patient Service]
            ElectrodeService[Electrode Service]
            StimulationService[Stimulation Service]
            SEEGService[SEEG Service]
            ReconstructionService[Reconstruction Service]
        end
        
        subgraph "Data Processing"
            PLYProcessor[PLY Processor]
            NiftiProcessor[NIfTI Processor]
            MeshGenerator[Mesh Generator]
            CoordTransformer[Coordinate Transformer]
        end
        
        subgraph "Data Access"
            Repositories[Repository Layer]
            FileIO[File I/O Handler]
        end
    end
    
    subgraph "Data Storage"
        PatientData[(Patient Data<br/>/patients/)]
        Reconstructions[(Reconstructions<br/>/reconstructions/)]
        StimParams[(Stim Parameters<br/>/stimulation_parameters/)]
        ClinicalScores[(Clinical Scores<br/>/clinical_scores/)]
        ConfigFiles[(Config Files<br/>JSON)]
    end
    
    %% Frontend connections
    UI --> ThreeJS
    UI --> State
    UI --> IPC
    ThreeJS --> IPC
    
    %% Electron IPC
    IPC --> HTTPClient
    IPC --> FileAccess
    
    %% Backend connections
    HTTPClient --> FastAPI
    FastAPI --> CORS
    CORS --> Auth
    Auth --> PatientService
    Auth --> ElectrodeService
    Auth --> StimulationService
    Auth --> SEEGService
    Auth --> ReconstructionService
    
    %% Service to Data Processing
    PatientService --> Repositories
    ElectrodeService --> PLYProcessor
    ElectrodeService --> MeshGenerator
    StimulationService --> Repositories
    SEEGService --> Repositories
    ReconstructionService --> PLYProcessor
    ReconstructionService --> NiftiProcessor
    ReconstructionService --> CoordTransformer
    
    %% Data Processing to Data Access
    PLYProcessor --> FileIO
    NiftiProcessor --> FileIO
    MeshGenerator --> FileIO
    CoordTransformer --> FileIO
    Repositories --> FileIO
    
    %% Data Access to Storage
    FileIO --> PatientData
    FileIO --> Reconstructions
    FileIO --> StimParams
    FileIO --> ClinicalScores
    FileIO --> ConfigFiles
    
    %% Styling
    classDef frontend fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef backend fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef storage fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    
    class UI,ThreeJS,State,IPC,HTTPClient,FileAccess frontend
    class FastAPI,CORS,Auth,PatientService,ElectrodeService,StimulationService,SEEGService,ReconstructionService,PLYProcessor,NiftiProcessor,MeshGenerator,CoordTransformer,Repositories,FileIO backend
    class PatientData,Reconstructions,StimParams,ClinicalScores,ConfigFiles storage
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React Component
    participant IPC as Electron IPC
    participant HTTP as HTTP Client
    participant API as FastAPI Backend
    participant Service as Service Layer
    participant Data as Data Storage
    
    Note over User,Data: Patient Data Loading Flow
    
    User->>UI: Select Patient
    UI->>IPC: Request Patient Data
    IPC->>HTTP: GET /api/patients/{id}
    HTTP->>API: HTTP Request
    API->>Service: Get Patient
    Service->>Data: Query Patient Data
    Data-->>Service: Patient Record
    Service-->>API: Patient Object
    API-->>HTTP: JSON Response
    HTTP-->>IPC: Response Data
    IPC-->>UI: Update State
    UI-->>User: Display Patient Info
    
    Note over User,Data: 3D Visualization Flow
    
    User->>UI: View 3D Scene
    UI->>IPC: Load PLY Files
    IPC->>HTTP: GET /api/reconstructions/{id}
    HTTP->>API: Request Reconstruction
    API->>Service: Get Reconstruction
    Service->>Data: Load PLY File
    Data-->>Service: PLY Data
    Service-->>API: PLY Buffer
    API-->>HTTP: Binary Response
    HTTP-->>IPC: PLY File
    IPC-->>UI: PLY Buffer
    UI->>UI: Parse with PLYLoader
    UI->>UI: Render with Three.js
    UI-->>User: Display 3D Scene
    
    Note over User,Data: Stimulation Configuration Flow
    
    User->>UI: Configure Stimulation
    UI->>UI: Update Form State
    User->>UI: Submit Parameters
    UI->>IPC: Save Stimulation
    IPC->>HTTP: POST /api/stimulation
    HTTP->>API: Stimulation Data
    API->>Service: Validate & Save
    Service->>Data: Write Parameters
    Data-->>Service: Success
    Service-->>API: Confirmation
    API-->>HTTP: 200 OK
    HTTP-->>IPC: Success
    IPC-->>UI: Update Confirmed
    UI-->>User: Show Success Message
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend Data Flow"
        A[User Input] --> B[React Component]
        B --> C[State Update]
        C --> D[IPC Handler]
        D --> E[HTTP Request]
    end
    
    subgraph "Backend Data Flow"
        E --> F[FastAPI Endpoint]
        F --> G[Pydantic Validation]
        G --> H[Service Layer]
        H --> I{Data Type}
    end
    
    subgraph "Processing Paths"
        I -->|PLY| J[PLY Processor]
        I -->|NIfTI| K[NIfTI Processor]
        I -->|JSON| L[Repository]
        I -->|Coordinates| M[Coord Transformer]
    end
    
    subgraph "Storage Layer"
        J --> N[(File System)]
        K --> N
        L --> O[(Database/JSON)]
        M --> N
    end
    
    subgraph "Response Flow"
        N --> P[Data Access Layer]
        O --> P
        P --> Q[Service Layer]
        Q --> R[API Response]
        R --> S[HTTP Response]
        S --> T[IPC Response]
        T --> U[React Update]
        U --> V[UI Render]
    end
    
    %% Styling
    classDef input fill:#e8f5e9,stroke:#2e7d32
    classDef process fill:#fff3e0,stroke:#e65100
    classDef storage fill:#f3e5f5,stroke:#4a148c
    classDef output fill:#e1f5ff,stroke:#01579b
    
    class A,B,C input
    class D,E,F,G,H,I,J,K,L,M process
    class N,O,P storage
    class Q,R,S,T,U,V output
```

### Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Frontend Security"
            FE1[Input Validation]
            FE2[XSS Protection]
            FE3[CSRF Tokens]
            FE4[Secure Storage]
        end
        
        subgraph "Communication Security"
            COMM1[TLS/HTTPS]
            COMM2[JWT Tokens]
            COMM3[API Keys]
            COMM4[Rate Limiting]
        end
        
        subgraph "Backend Security"
            BE1[Authentication]
            BE2[Authorization]
            BE3[Input Sanitization]
            BE4[SQL Injection Prevention]
        end
        
        subgraph "Data Security"
            DATA1[Encryption at Rest]
            DATA2[Access Control]
            DATA3[Audit Logging]
            DATA4[Data Anonymization]
        end
    end
    
    FE1 --> COMM1
    FE2 --> COMM1
    FE3 --> COMM2
    FE4 --> COMM2
    
    COMM1 --> BE1
    COMM2 --> BE2
    COMM3 --> BE2
    COMM4 --> BE3
    
    BE1 --> DATA1
    BE2 --> DATA2
    BE3 --> DATA3
    BE4 --> DATA4
    
    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1565c0
    classDef comm fill:#fff3e0,stroke:#e65100
    classDef backend fill:#f3e5f5,stroke:#6a1b9a
    classDef data fill:#e8f5e9,stroke:#2e7d32
    
    class FE1,FE2,FE3,FE4 frontend
    class COMM1,COMM2,COMM3,COMM4 comm
    class BE1,BE2,BE3,BE4 backend
    class DATA1,DATA2,DATA3,DATA4 data
```

### Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DEV1[Local Electron App]
        DEV2[FastAPI Dev Server]
        DEV3[SQLite Database]
        DEV4[Local File Storage]
        
        DEV1 --> DEV2
        DEV2 --> DEV3
        DEV2 --> DEV4
    end
    
    subgraph "Production Environment"
        subgraph "Client Machines"
            CLIENT1[Electron App v4.6.0]
            CLIENT2[Electron App v4.6.0]
            CLIENTN[Electron App v4.6.0]
        end
        
        subgraph "Backend Services"
            LB[Load Balancer<br/>Nginx]
            API1[FastAPI Instance 1]
            API2[FastAPI Instance 2]
            APIN[FastAPI Instance N]
        end
        
        subgraph "Data Layer"
            DB[(PostgreSQL<br/>Primary)]
            REPLICA[(PostgreSQL<br/>Replica)]
            FILES[Network File Storage<br/>NFS/S3]
        end
        
        subgraph "Monitoring"
            PROM[Prometheus]
            GRAF[Grafana]
            LOGS[ELK Stack]
        end
    end
    
    CLIENT1 --> LB
    CLIENT2 --> LB
    CLIENTN --> LB
    
    LB --> API1
    LB --> API2
    LB --> APIN
    
    API1 --> DB
    API2 --> REPLICA
    APIN --> REPLICA
    
    API1 --> FILES
    API2 --> FILES
    APIN --> FILES
    
    API1 --> PROM
    API2 --> PROM
    APIN --> PROM
    
    PROM --> GRAF
    API1 --> LOGS
    API2 --> LOGS
    APIN --> LOGS
    
    %% Styling
    classDef client fill:#e1f5ff,stroke:#01579b
    classDef backend fill:#fff3e0,stroke:#e65100
    classDef data fill:#f3e5f5,stroke:#4a148c
    classDef monitor fill:#e8f5e9,stroke:#2e7d32
    
    class CLIENT1,CLIENT2,CLIENTN client
    class LB,API1,API2,APIN backend
    class DB,REPLICA,FILES data
    class PROM,GRAF,LOGS monitor
```

### 3D Visualization Pipeline

```mermaid
graph TB
    subgraph "Data Loading"
        A[User Selects Patient] --> B[Load PLY Files]
        B --> C[Parse PLY Data]
        C --> D[Extract Geometry]
    end
    
    subgraph "Three.js Processing"
        D --> E[Create BufferGeometry]
        E --> F[Apply Materials]
        F --> G[Set Vertex Colors]
        G --> H[Compute Normals]
    end
    
    subgraph "Scene Composition"
        H --> I[Create Mesh Objects]
        I --> J[Position Meshes]
        J --> K[Add to Scene]
        K --> L[Setup Lights]
        L --> M[Configure Camera]
    end
    
    subgraph "Rendering"
        M --> N[WebGL Renderer]
        N --> O[Render Loop]
        O --> P[OrbitControls]
        P --> Q[User Interaction]
        Q --> O
    end
    
    subgraph "Performance Optimization"
        O --> R[Frustum Culling]
        O --> S[LOD System]
        O --> T[Mesh Optimization]
    end
    
    %% Styling
    classDef load fill:#e3f2fd,stroke:#1565c0
    classDef process fill:#fff3e0,stroke:#e65100
    classDef scene fill:#f3e5f5,stroke:#6a1b9a
    classDef render fill:#e8f5e9,stroke:#2e7d32
    classDef perf fill:#fce4ec,stroke:#880e4f
    
    class A,B,C,D load
    class E,F,G,H process
    class I,J,K,L,M scene
    class N,O,P,Q render
    class R,S,T perf
```

---

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
- **Purpose:** Visualize multiple patient electrode configurations in 3D.
- **Highlights:** Three.js scene rendering, mesh controls, coordinate search.

#### PatientDatabase.js
- **Purpose:** Manage and filter patient data.
- **Highlights:** Listing, filtering, import/export.

#### SEEG.js
- **Purpose:** Configure SEEG stimulation.
- **Highlights:** Electrode/contact configuration, amplitude/pulse width.

#### StimulationSettings.js
- **Purpose:** Configure DBS stimulation parameters.
- **Highlights:** Contact and frequency settings.

#### PatientDetails.js
- **Purpose:** View individual patient data.
- **Highlights:** Demographics, configuration, history.

#### ClinicalScores.js
- **Purpose:** Manage clinical score data.
- **Highlights:** Entry, visualization, analysis.

### Backend Services

- **PatientService:** CRUD, filtering, validation
- **ElectrodeService:** Model/configuration management
- **StimulationService:** Parameter handling, validation, optimization
- **ReconstructionService:** 3D reconstruction, PLY generation
- **SEEGService:** SEEG data and processing
- **ClinicalScoreService:** Scores management, statistics

### Data Processing Services

- **PLYFileProcessor:** Parse/generate PLY, mesh optimization
- **NiftiProcessor:** Read/write NIfTI, voxel and coordinate processing
- **CoordinateTransformer:** System conversion, affine transforms
- **MeshGenerator:** 3D mesh operations and rendering

## Communication Flow

> **Unable to render flow diagram.**  
> Textual flow:
1. User performs action in UI (React Component)
2. UI communicates via Electron IPC handler
3. IPC sends request to HTTP client (Axios/Fetch)
4. HTTP client calls FastAPI endpoint
5. API invokes the Service Layer
6. Service interacts with Repository Layer
7. Repository accesses file system/data storage
8. Data (or response) passed back to UI

---

## Key Features

### 1. 3D Visualization
- Real-time rendering, overlays, camera, mesh/opacity controls

### 2. Patient Management
- Filterable database, multi-publication support, import/export

### 3. Stimulation Configuration
- DBS/SEEG settings, contact selection, optimization

### 4. Clinical Data Management
- Score tracking, statistics, reports

### 5. Electrode Management
- Multiple models, custom configurations, 3D visualization, contact params

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
1. PLY loaded
2. Parsed with PLYLoader
3. Three.js mesh creation
4. Scene composition
5. Rendered in UI

## Security Considerations

- **Data Privacy:** Patient data is stored locally
- **File Access:** Access restricted to application directory
- **API Security:** FastAPI configured with CORS
- **Validation:** Enforced at each application layer

## Performance Optimizations

- Mesh simplification/optimization
- Lazy-load UI components
- Data caching
- Efficient, conditional rendering

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

We welcome contributions. Please consult our contributing guidelines and submit pull requests for improvements.

## License

See LICENSE file for details.

## Contact

For questions or support, open a GitHub issue.

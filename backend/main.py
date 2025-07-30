from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any, Union
import json
import os
import shutil
import subprocess
import gzip
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lead DBS File System API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Patient(BaseModel):
    id: str
    elmodel: Optional[str] = None

class Historical(BaseModel):
    patient: Patient
    timeline: str
    directoryPath: str
    leadDBS: bool

class StimulationData(BaseModel):
    mode: Optional[str] = None
    type: Optional[str] = None
    path: Optional[str] = None
    filepath: Optional[str] = None
    stimDir: Optional[str] = None
    patientname: Optional[Union[str, List[str]]] = None
    patientfolders: Optional[List[List[str]]] = None
    labels: Optional[List[str]] = None
    label: Optional[str] = None
    S: Optional[Any] = None
    elmodel: Optional[str] = None
    electrodeModels: Optional[List[str]] = None
    leadpath: Optional[str] = None

class SaveFileRequest(BaseModel):
    data: Dict[str, Any]
    historical: Historical

class SaveClinicalRequest(BaseModel):
    data: Dict[str, Any]
    historical: Historical
    scoretype: str

class BatchImportRequest(BaseModel):
    data: Dict[str, Any]
    historical: Historical
    scoretype: str

class BatchImportStimulationRequest(BaseModel):
    data: Dict[str, Any]
    leadDBS: bool

class CreateMinisetRequest(BaseModel):
    folderPath: str
    selectedPatients: List[str]

# In-memory storage for stimulation data
_stimulation_data: StimulationData = StimulationData()

# Utility functions
def get_patient_folder(directory_path: str, patient_id: str, lead_dbs: bool) -> str:
    """Get the patient folder path based on whether it's LeadDBS or not"""
    if lead_dbs:
        return os.path.join(directory_path, 'derivatives', 'leaddbs', patient_id, 'clinical')
    else:
        return os.path.join(directory_path, f'sub-{patient_id}')

def ensure_directory_exists(directory_path: str):
    """Ensure a directory exists, creating it if necessary"""
    os.makedirs(directory_path, exist_ok=True)

def read_json_file(file_path: str) -> Dict[str, Any]:
    """Read and parse a JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON in file {file_path}: {str(e)}")

def write_json_file(file_path: str, data: Dict[str, Any]):
    """Write data to a JSON file"""
    try:
        ensure_directory_exists(os.path.dirname(file_path))
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing file {file_path}: {str(e)}")

def read_binary_file(file_path: str) -> bytes:
    """Read a binary file and return its contents"""
    try:
        with open(file_path, 'rb') as f:
            return f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file {file_path}: {str(e)}")

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Lead DBS File System API"}

@app.post("/api/import-inputdata-file")
async def import_inputdata_file(input_path: str):
    """Import input data file - equivalent to 'import-inputdata-file' IPC"""
    try:
        if os.path.isdir(input_path):
            # Handle directory case
            stimulation_data = {
                "mode": "standalone",
                "type": "leaddbs",
                "path": input_path
            }
            global _stimulation_data
            _stimulation_data = StimulationData(**stimulation_data)
            return stimulation_data
        
        # Handle file case
        data = read_json_file(input_path)
        _stimulation_data = StimulationData(**data)
        
        # Process stimulation data based on type
        if data.get('type') == 'leaddbs':
            labels = data.get('labels', [])
            for index, label in enumerate(labels):
                patient_dir = get_patient_folder(data['filepath'], data['patientname'], True)
                session_dir = os.path.join(patient_dir, f"ses-{label}")
                file_name = f"{data['patientname']}_ses-{label}_stimparameters.json"
                file_path = os.path.join(session_dir, file_name)
                
                ensure_directory_exists(session_dir)
                
                stim_data = {"S": data['S'][index] if isinstance(data['S'], list) else data['S']}
                write_json_file(file_path, stim_data)
                
        elif data.get('type') == 'leadgroup':
            patient_names = data.get('patientname', [])
            for index, name in enumerate(patient_names):
                patient_dir = os.path.join(data['patientfolders'][0][index], name)
                session_dir = os.path.join(patient_dir, f"ses-{data['label']}")
                file_name = f"sub-{name}_ses-{data['label']}_stim.json"
                file_path = os.path.join(session_dir, file_name)
                
                # Handle LeadDBS directory structure
                if True:  # leadDBS flag
                    new_directory_path = os.path.join(data['patientfolders'][0][index], 'clinical')
                    patient_dir = new_directory_path
                    session_dir = os.path.join(patient_dir, f"ses-{data['label']}")
                    file_name = f"{name}_ses-{data['label']}_stimparameters.json"
                    file_path = os.path.join(session_dir, file_name)
                
                ensure_directory_exists(session_dir)
                stim_data = {"S": data['S'][index]}
                write_json_file(file_path, stim_data)
        
        return data
        
    except Exception as e:
        logger.error(f"Error importing inputdata file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error importing inputdata file: {str(e)}")

@app.post("/api/import-file")
async def import_file(patient_id: str, timeline: str, directory_path: str, lead_dbs: bool = False):
    """Import file for specific patient and timeline"""
    try:
        if not patient_id or not timeline or not directory_path:
            raise HTTPException(status_code=400, detail="Missing patient ID, timeline, or directoryPath")
        
        # Construct file path
        patient_dir = get_patient_folder(directory_path, patient_id, lead_dbs)
        session_dir = os.path.join(patient_dir, f"ses-{timeline}")
        
        if lead_dbs:
            file_name = f"{patient_id}_ses-{timeline}_stimparameters.json"
        else:
            file_name = f"sub-{patient_id}_ses-{timeline}_stim.json"
        
        file_path = os.path.join(session_dir, file_name)
        
        if not os.path.exists(file_path):
            if lead_dbs:
                # Check for reconstruction file as fallback
                reconstruction_path = os.path.join(
                    directory_path, 'derivatives', 'leaddbs', patient_id, 'clinical',
                    f"{patient_id}_desc-reconstruction.json"
                )
                if os.path.exists(reconstruction_path):
                    return read_json_file(reconstruction_path)
            
            raise HTTPException(status_code=404, detail="File not found")
        
        return read_json_file(file_path)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error importing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error importing file: {str(e)}")

@app.get("/api/stimulation-data")
async def get_stimulation_data():
    """Get current stimulation data"""
    return _stimulation_data.dict()

@app.post("/api/save-file")
async def save_file(request: SaveFileRequest):
    """Save stimulation parameter file"""
    try:
        historical = request.historical
        data = request.data
        
        patient = historical.patient
        timeline = historical.timeline
        directory_path = historical.directoryPath
        lead_dbs = historical.leadDBS
        
        if not patient.id or not timeline or not directory_path:
            raise HTTPException(status_code=400, detail="Missing patient, timeline, or directoryPath")
        
        # Construct directory paths
        patient_dir = get_patient_folder(directory_path, patient.id, lead_dbs)
        session_dir = os.path.join(patient_dir, f"ses-{timeline}")
        
        ensure_directory_exists(session_dir)
        
        # Construct file name and path
        if lead_dbs:
            file_name = f"{patient.id}_ses-{timeline}_stimparameters.json"
        else:
            file_name = f"sub-{patient.id}_ses-{timeline}_stim.json"
        
        file_path = os.path.join(session_dir, file_name)
        
        # Write the data
        write_json_file(file_path, data)
        
        # Update master JSON if it exists (for non-leadDBS)
        if not lead_dbs:
            master_json_path = os.path.join(directory_path, 'dataset_master.json')
            if os.path.exists(master_json_path):
                try:
                    master_data = read_json_file(master_json_path)
                    patient_id_key = patient.id.replace('-', '_')
                    session_key = f"ses_{timeline}"
                    
                    if patient_id_key in master_data:
                        if 'clinicalData' not in master_data[patient_id_key]:
                            master_data[patient_id_key]['clinicalData'] = {}
                        if session_key not in master_data[patient_id_key]['clinicalData']:
                            master_data[patient_id_key]['clinicalData'][session_key] = []
                        
                        master_data[patient_id_key]['clinicalData'][session_key].append(file_path)
                        write_json_file(master_json_path, master_data)
                except Exception as e:
                    logger.warning(f"Could not update master JSON: {str(e)}")
        
        return {"status": "success", "filePath": file_path}
        
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

@app.post("/api/save-file-clinical")
async def save_file_clinical(request: SaveClinicalRequest):
    """Save clinical data file"""
    try:
        historical = request.historical
        data = request.data
        score_type = request.scoretype
        
        patient = historical.patient
        timeline = historical.timeline
        directory_path = historical.directoryPath
        lead_dbs = historical.leadDBS
        
        if not patient.id or not timeline or not directory_path:
            raise HTTPException(status_code=400, detail="Missing patient, timeline, or directoryPath")
        
        # Construct directory paths
        patient_dir = get_patient_folder(directory_path, patient.id, lead_dbs)
        session_dir = os.path.join(patient_dir, f"ses-{timeline}")
        
        ensure_directory_exists(session_dir)
        
        # Construct file name and path
        if lead_dbs:
            file_name = f"{patient.id}_ses-{timeline}_clinical.json"
        else:
            file_name = f"sub-{patient.id}_ses-{timeline}_clinical.json"
        
        file_path = os.path.join(session_dir, file_name)
        
        # Read existing clinical data or create new
        clinical_scores = {}
        if os.path.exists(file_path):
            clinical_scores = read_json_file(file_path)
        
        clinical_scores[score_type] = data
        write_json_file(file_path, clinical_scores)
        
        return {"status": "success", "filePath": file_path}
        
    except Exception as e:
        logger.error(f"Error saving clinical file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving clinical file: {str(e)}")

@app.post("/api/import-file-clinical")
async def import_file_clinical(patient_id: str, timeline: str, directory_path: str, lead_dbs: bool = False):
    """Import clinical data file"""
    try:
        if not patient_id or not timeline or not directory_path:
            raise HTTPException(status_code=400, detail="Missing patient ID, timeline, or directoryPath")
        
        patient_dir = get_patient_folder(directory_path, patient_id, lead_dbs)
        session_dir = os.path.join(patient_dir, f"ses-{timeline}")
        
        if lead_dbs:
            file_name = f"{patient_id}_ses-{timeline}_clinical.json"
        else:
            file_name = f"sub-{patient_id}_ses-{timeline}_clinical.json"
        
        file_path = os.path.join(session_dir, file_name)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Clinical file not found")
        
        return read_json_file(file_path)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error importing clinical file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error importing clinical file: {str(e)}")

@app.get("/api/check-folder-exists")
async def check_folder_exists(folder_path: str):
    """Check if a folder exists"""
    return {"exists": os.path.exists(folder_path)}

@app.post("/api/save-patients-json")
async def save_patients_json(folder_path: str, patients: List[Dict[str, Any]]):
    """Save participants.json file"""
    try:
        file_path = os.path.join(folder_path, 'participants.json')
        write_json_file(file_path, patients)
        return {"status": "success", "message": "File saved successfully"}
    except Exception as e:
        logger.error(f"Error saving participants JSON: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

@app.get("/api/get-timelines")
async def get_timelines(directory_path: str, patient_id: str, lead_dbs: bool = False):
    """Get available timelines for a patient"""
    try:
        patient_folder = get_patient_folder(directory_path, patient_id, lead_dbs)
        
        if not os.path.exists(patient_folder):
            return []
        
        timeline_data = []
        
        try:
            timelines = os.listdir(patient_folder)
            session_folders = [f for f in timelines if f.startswith('ses-')]
            
            for session_folder in session_folders:
                session_path = os.path.join(patient_folder, session_folder)
                
                if not os.path.isdir(session_path):
                    continue
                
                session_files = os.listdir(session_path)
                
                # Check for clinical and stimulation files
                has_clinical = any('clinical.json' in file for file in session_files)
                if lead_dbs:
                    has_stimulation = any('stimparameters.json' in file for file in session_files)
                else:
                    has_stimulation = any('stim.json' in file for file in session_files)
                
                timeline_data.append({
                    "timeline": session_folder.replace('ses-', ''),
                    "hasClinical": has_clinical,
                    "hasStimulation": has_stimulation
                })
                
        except Exception as e:
            logger.error(f"Error reading patient folder {patient_folder}: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to retrieve timelines")
        
        return timeline_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting timelines: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting timelines: {str(e)}")

@app.get("/api/get-clinical-data")
async def get_clinical_data(directory_path: str, patients_with_timelines: List[Dict[str, Any]]):
    """Get clinical data for multiple patients and timelines"""
    try:
        all_clinical_data = []
        
        for patient_data in patients_with_timelines:
            patient_id = patient_data["id"]
            timelines = patient_data["timelines"]
            patient_clinical_data = {}
            
            for timeline in timelines:
                session_path = os.path.join(
                    directory_path, 'derivatives', 'leaddbs', patient_id, 'clinical', f"ses-{timeline}"
                )
                clinical_file_path = os.path.join(session_path, f"{patient_id}_ses-{timeline}_clinical.json")
                
                if os.path.exists(clinical_file_path):
                    try:
                        clinical_data = read_json_file(clinical_file_path)
                        patient_clinical_data[timeline] = clinical_data
                    except Exception as e:
                        logger.warning(f"Error reading clinical data for patient {patient_id}, session {timeline}: {str(e)}")
            
            all_clinical_data.append({"id": patient_id, "clinicalData": patient_clinical_data})
        
        return all_clinical_data
        
    except Exception as e:
        logger.error(f"Error fetching clinical data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching clinical data: {str(e)}")

@app.get("/api/load-ply-file-database")
async def load_ply_file_database(patient_id: str, session_id: str):
    """Load PLY files and related data for a patient session"""
    try:
        global _stimulation_data
        directory_path = _stimulation_data.path
        
        if not directory_path:
            raise HTTPException(status_code=400, detail="No stimulation data path configured")
        
        # Validate patient directory
        patient_dir = os.path.join(directory_path, 'derivatives', 'leaddbs', patient_id)
        if not os.path.exists(patient_dir):
            raise HTTPException(status_code=404, detail=f"Patient ID {patient_id} not found in directory")
        
        # Get paths
        clinical_dir = os.path.join(patient_dir, 'clinical')
        export_dir = os.path.join(patient_dir, 'export', 'ply')
        
        if not os.path.exists(clinical_dir):
            raise HTTPException(status_code=404, detail=f"Clinical directory not found for Patient ID {patient_id}")
        if not os.path.exists(export_dir):
            raise HTTPException(status_code=404, detail=f"Export directory not found for Patient ID {patient_id}")
        
        # Find session directory and stimulation parameters
        session_dir = os.path.join(clinical_dir, session_id)
        if not os.path.exists(session_dir):
            raise HTTPException(status_code=404, detail=f"Session ID {session_id} not found for Patient ID {patient_id}")
        
        session_files = os.listdir(session_dir)
        stimulation_params_file = next((f for f in session_files if 'stimparameters.json' in f), None)
        if not stimulation_params_file:
            raise HTTPException(status_code=404, detail=f"No stimulation parameters file found for Patient ID {patient_id} in session {session_id}")
        
        stimulation_params_path = os.path.join(session_dir, stimulation_params_file)
        
        # PLY file paths
        anatomy_ply_path = os.path.join(export_dir, 'anatomy.ply')
        combined_electrodes_ply_path = os.path.join(export_dir, 'combined_electrodes.ply')
        
        if not os.path.exists(anatomy_ply_path) or not os.path.exists(combined_electrodes_ply_path):
            raise HTTPException(status_code=404, detail=f"One or more PLY files not found for Patient ID {patient_id}")
        
        # Find reconstruction JSON
        clinical_files = os.listdir(clinical_dir)
        reconstruction_file = next((f for f in clinical_files if 'desc-reconstruction.json' in f), None)
        if not reconstruction_file:
            raise HTTPException(status_code=404, detail=f"Reconstruction JSON file not found for Patient ID {patient_id}")
        
        reconstruction_path = os.path.join(clinical_dir, reconstruction_file)
        
        # Read all files
        anatomy_ply_data = read_binary_file(anatomy_ply_path)
        combined_electrodes_ply_data = read_binary_file(combined_electrodes_ply_path)
        reconstruction_data = read_json_file(reconstruction_path)
        stimulation_params_data = read_json_file(stimulation_params_path)
        
        return {
            "anatomyPly": anatomy_ply_data.hex(),  # Convert to hex for JSON transport
            "combinedElectrodesPly": combined_electrodes_ply_data.hex(),
            "reconstructionData": reconstruction_data,
            "stimulationParameters": stimulation_params_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading PLY file database: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error loading PLY files: {str(e)}")

@app.get("/api/load-reconstruction")
async def load_reconstruction(patient_id: str, directory_path: str):
    """Load reconstruction data for a patient"""
    try:
        # Validate patient directory
        patient_dir = os.path.join(directory_path, 'derivatives', 'leaddbs', patient_id)
        if not os.path.exists(patient_dir):
            raise HTTPException(status_code=404, detail=f"Patient ID {patient_id} not found in directory")
        
        export_dir = os.path.join(patient_dir, 'export', 'ply')
        if not os.path.exists(export_dir):
            raise HTTPException(status_code=404, detail=f"Export directory not found for Patient ID {patient_id}")
        
        # PLY file paths
        combined_electrodes_ply_path = os.path.join(export_dir, 'combined_electrodes.ply')
        
        if not os.path.exists(combined_electrodes_ply_path):
            raise HTTPException(status_code=404, detail=f"Combined electrodes PLY file not found for Patient ID {patient_id}")
        
        combined_electrodes_ply_data = read_binary_file(combined_electrodes_ply_path)
        
        return {
            "combinedElectrodesPly": combined_electrodes_ply_data.hex()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading reconstruction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error loading reconstruction: {str(e)}")

@app.get("/api/get-participants")
async def get_participants():
    """Get participants data"""
    try:
        global _stimulation_data
        if not _stimulation_data.path:
            raise HTTPException(status_code=400, detail="No stimulation data path configured")
        
        participants_file_path = os.path.join(_stimulation_data.path, 'participants.json')
        if not os.path.exists(participants_file_path):
            raise HTTPException(status_code=404, detail="Participants file not found")
        
        return read_json_file(participants_file_path)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting participants: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting participants: {str(e)}")

@app.get("/api/read-file")
async def read_file_endpoint(file_path: str):
    """Read a file and return its binary content"""
    try:
        file_data = read_binary_file(file_path)
        return {"data": file_data.hex()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@app.post("/api/create-miniset")
async def create_miniset(request: CreateMinisetRequest):
    """Create a miniset by copying selected patients"""
    try:
        folder_path = request.folderPath
        selected_patients = request.selectedPatients
        
        global _stimulation_data
        if not _stimulation_data.path:
            raise HTTPException(status_code=400, detail="No stimulation data path configured")
        
        user_data_path = _stimulation_data.path
        
        for patient_id in selected_patients:
            patient_folder = os.path.join(user_data_path, 'derivatives', 'leaddbs', patient_id)
            new_patient_folder = os.path.join(folder_path, 'derivatives', 'leaddbs', patient_id)
            
            # Ensure the new patient directory exists
            ensure_directory_exists(new_patient_folder)
            
            # Define subfolders to copy
            subfolders = ['clinical', 'stimulations', 'export', 'reconstruction']
            
            for subfolder in subfolders:
                src_folder = os.path.join(patient_folder, subfolder)
                dest_folder = os.path.join(new_patient_folder, subfolder)
                
                if os.path.exists(src_folder):
                    try:
                        if os.path.exists(dest_folder):
                            shutil.rmtree(dest_folder)
                        shutil.copytree(src_folder, dest_folder)
                        logger.info(f"Copied {subfolder} data to: {dest_folder}")
                    except Exception as e:
                        logger.error(f"Error copying {subfolder} directory: {str(e)}")
        
        return {"status": "success", "message": "Miniset created successfully"}
        
    except Exception as e:
        logger.error(f"Error creating miniset: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating miniset: {str(e)}")

@app.post("/api/batch-import-clinical")
async def batch_import_clinical(request: BatchImportRequest):
    """Batch import clinical scores for multiple patients"""
    try:
        data = request.data
        historical = request.historical
        score_type = request.scoretype
        
        directory_path = historical.directoryPath
        lead_dbs = historical.leadDBS
        
        success_count = 0
        error_count = 0
        
        for key, patient_data in data.items():
            try:
                patient_id = patient_data.get('id')
                scores = patient_data.get('scores')
                timeline = patient_data.get('timeline')
                
                if not patient_id or not timeline:
                    logger.warning(f"Missing patient ID or timeline for key {key}")
                    error_count += 1
                    continue
                
                patient_folder = get_patient_folder(directory_path, patient_id, lead_dbs)
                session_dir = os.path.join(patient_folder, f"ses-{timeline}")
                
                ensure_directory_exists(session_dir)
                
                if lead_dbs:
                    file_name = f"{patient_id}_ses-{timeline}_clinical.json"
                else:
                    file_name = f"sub-{patient_id}_ses-{timeline}_clinical.json"
                
                file_path = os.path.join(session_dir, file_name)
                
                # Read existing clinical data or create new
                clinical_scores = {}
                if os.path.exists(file_path):
                    clinical_scores = read_json_file(file_path)
                
                clinical_scores[score_type] = scores
                write_json_file(file_path, clinical_scores)
                
                success_count += 1
                logger.info(f"Data saved successfully to {file_path}")
                
            except Exception as e:
                logger.error(f"Error processing patient {key}: {str(e)}")
                error_count += 1
        
        return {
            "status": "success",
            "processed": success_count + error_count,
            "success": success_count,
            "errors": error_count
        }
        
    except Exception as e:
        logger.error(f"Error in batch import clinical: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in batch import: {str(e)}")

@app.post("/api/batch-import-stimulation")
async def batch_import_stimulation(request: BatchImportStimulationRequest):
    """Batch import stimulation parameters for multiple patients"""
    try:
        data = request.data
        lead_dbs = request.leadDBS
        
        global _stimulation_data
        directory_path = _stimulation_data.filepath
        
        if not directory_path:
            raise HTTPException(status_code=400, detail="No stimulation data filepath configured")
        
        success_count = 0
        error_count = 0
        
        for key, patient_data in data.items():
            try:
                patient_id = patient_data.get('id')
                S = patient_data.get('S')
                timeline = patient_data.get('timeline')
                
                if not patient_id or not timeline:
                    logger.warning(f"Missing patient ID or timeline for key {key}")
                    error_count += 1
                    continue
                
                patient_folder = get_patient_folder(directory_path, patient_id, lead_dbs)
                session_dir = os.path.join(patient_folder, f"ses-{timeline}")
                
                ensure_directory_exists(session_dir)
                
                # Wrap the S object
                data_to_save = {"S": S}
                
                if lead_dbs:
                    file_name = f"{patient_id}_ses-{timeline}_stimparameters.json"
                else:
                    file_name = f"sub-{patient_id}_ses-{timeline}_stim.json"
                
                file_path = os.path.join(session_dir, file_name)
                write_json_file(file_path, data_to_save)
                
                success_count += 1
                logger.info(f"Data saved successfully to {file_path}")
                
            except Exception as e:
                logger.error(f"Error processing patient {key}: {str(e)}")
                error_count += 1
        
        return {
            "status": "success",
            "processed": success_count + error_count,
            "success": success_count,
            "errors": error_count
        }
        
    except Exception as e:
        logger.error(f"Error in batch import stimulation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in batch import: {str(e)}")

@app.get("/api/get-clinical-scores-types")
async def get_clinical_scores_types():
    """Get available clinical score types"""
    try:
        # Get user data path - this would typically be from app.getPath('userData')
        # For now, we'll use a configurable path or default
        user_data_path = os.path.expanduser("~/.lead-dbs-programmer")
        ensure_directory_exists(user_data_path)
        
        scores_file_path = os.path.join(user_data_path, 'ClinicalScores.json')
        
        # Ensure the file exists with default scores
        if not os.path.exists(scores_file_path):
            default_scores = {
                "UPDRS": {
                    "3.1: Speech": 0,
                    "3.2: Facial expression": 0,
                    "3.3a: Rigidity- Neck": 0,
                    "3.3b: Rigidity- RUE": 0,
                    "3.3c: Rigidity- LUE": 0,
                    "3.3d: Rigidity- RLE": 0,
                    "3.3e: Rigidity- LLE": 0,
                    "3.4a: Finger tapping- Right hand": 0,
                    "3.4b: Finger tapping- Left hand": 0,
                    "3.5a: Hand movements- Right hand": 0,
                    "3.5b: Hand movements- Left hand": 0,
                    "3.6a: Pronation- supination movements- Right hand": 0,
                    "3.6b: Pronation- supination movements- Left hand": 0,
                    "3.7a: Toe tapping- Right foot": 0,
                    "3.7b: Toe tapping- Left foot": 0,
                    "3.8a: Leg agility- Right leg": 0,
                    "3.8b: Leg agility- Left leg": 0,
                    "3.9: Arising from chair": 0,
                    "3.10: Gait": 0,
                    "3.11: Freezing of gait": 0,
                    "3.12: Postural stability": 0,
                    "3.13: Posture": 0,
                    "3.14: Global spontaneity of movement": 0,
                    "3.15a: Postural tremor- Right hand": 0,
                    "3.15b: Postural tremor- Left hand": 0,
                    "3.16a: Kinetic tremor- Right hand": 0,
                    "3.16b: Kinetic tremor- Left hand": 0,
                    "3.17a: Rest tremor amplitude- RUE": 0,
                    "3.17b: Rest tremor amplitude- LUE": 0,
                    "3.17c: Rest tremor amplitude- RLE": 0,
                    "3.17d: Rest tremor amplitude- LLE": 0,
                    "3.17e: Rest tremor amplitude- Lip/jaw": 0,
                    "3.18: Constancy of rest tremor": 0,
                },
                "Y-BOCS": {
                    "Time occupied by obsessive thoughts": 0,
                    "Interference due to obsessive thoughts": 0,
                    "Distress associated with obsessive thoughts": 0,
                    "Resistance against obsessions": 0,
                    "Degree of control over obsessive thoughts": 0,
                    "Time spent performing compulsive behaviors": 0,
                    "Interference due to compulsive behaviors": 0,
                    "Distress associated with compulsive behavior": 0,
                    "Resistance against compulsions": 0,
                    "Degree of control over compulsive behavior": 0,
                },
            }
            write_json_file(scores_file_path, default_scores)
        
        return read_json_file(scores_file_path)
        
    except Exception as e:
        logger.error(f"Error getting clinical scores types: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting clinical scores types: {str(e)}")

@app.post("/api/add-score-type")
async def add_score_type(name: str, new_score: Dict[str, Any]):
    """Add a new clinical score type"""
    try:
        user_data_path = os.path.expanduser("~/.lead-dbs-programmer")
        ensure_directory_exists(user_data_path)
        scores_file_path = os.path.join(user_data_path, 'ClinicalScores.json')
        
        # Read existing scores
        scores = {}
        if os.path.exists(scores_file_path):
            scores = read_json_file(scores_file_path)
        
        # Add the new score type
        scores[name] = new_score[name]
        
        # Write back to file
        write_json_file(scores_file_path, scores)
        
        return {"status": "success", "message": f"Score type '{name}' added successfully"}
        
    except Exception as e:
        logger.error(f"Error adding score type: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding score type: {str(e)}")

@app.get("/api/get-unit-solutions")
async def get_unit_solutions(file_path: str):
    """Get unit solutions for electrode contacts"""
    try:
        # This is a specialized endpoint for getting NII files for electrode contacts
        # Based on the original code, it reads multiple NII files for different contacts
        
        # For now, this is hardcoded but should be made configurable
        patient_folder = "/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/stimulations/MNI152NLin2009bAsym/initialize"
        side = "rh"
        oss_folder = os.path.join(patient_folder, f"OSS_sim_files_{side}")
        num_contacts = 8
        results = {}
        
        for i in range(1, num_contacts + 1):
            contact_folder = os.path.join(oss_folder, f"ResultsE1C{i}")
            nii_file_path = os.path.join(contact_folder, "E_field_solution_Lattice.nii")
            
            try:
                if os.path.exists(nii_file_path):
                    file_buffer = read_binary_file(nii_file_path)
                    results[i-1] = file_buffer.hex()
                else:
                    results[i-1] = None
                    logger.warning(f"NII file not found for contact E1C{i}")
            except Exception as e:
                logger.error(f"Error reading file for contact E1C{i}: {str(e)}")
                results[i-1] = None
        
        return results
        
    except Exception as e:
        logger.error(f"Error getting unit solutions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting unit solutions: {str(e)}")

@app.post("/api/save-file-stimulate")
async def save_file_stimulate(data: Dict[str, Any]):
    """Save stimulation file to stimulation directory"""
    try:
        global _stimulation_data
        if not _stimulation_data.stimDir:
            raise HTTPException(status_code=400, detail="No stimulation directory configured")
        
        new_stim_file_path = os.path.join(_stimulation_data.stimDir, 'data.json')
        write_json_file(new_stim_file_path, data)
        
        return {"status": "success", "filePath": new_stim_file_path}
        
    except Exception as e:
        logger.error(f"Error saving stimulation file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving stimulation file: {str(e)}")

@app.post("/api/import-file-clinical-group")
async def import_file_clinical_group(patient_id: str, timelines: Dict[str, Any], directory_path: str, lead_dbs: bool = False):
    """Import clinical files for multiple timelines (group operation)"""
    try:
        output_data = {}
        
        for key, timeline_item in timelines.items():
            try:
                patient_dir = get_patient_folder(directory_path, patient_id, lead_dbs)
                session_dir = os.path.join(patient_dir, f"ses-{timeline_item}")
                
                if lead_dbs:
                    file_name = f"{patient_id}_ses-{timeline_item}_clinical.json"
                else:
                    file_name = f"sub-{patient_id}_ses-{timeline_item}_clinical.json"
                
                file_path = os.path.join(session_dir, file_name)
                
                if os.path.exists(file_path):
                    clinical_data = read_json_file(file_path)
                    output_data[key] = clinical_data
                else:
                    output_data[key] = None
                    logger.warning(f"Clinical file not found for {patient_id}, timeline {timeline_item}")
                    
            except Exception as e:
                logger.error(f"Error processing timeline {key}: {str(e)}")
                output_data[key] = None
        
        return output_data
        
    except Exception as e:
        logger.error(f"Error importing clinical group: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error importing clinical group: {str(e)}")

@app.get("/api/get-ply-files")
async def get_ply_files():
    """Get PLY files from Lead-DBS atlases"""
    try:
        # Get Lead-DBS path from preferences or stimulation data
        lead_path = None
        
        try:
            # Try to get from Preferences.json first
            preferences_path = "Preferences.json"  # This should be made configurable
            if os.path.exists(preferences_path):
                preferences_data = read_json_file(preferences_path)
                lead_path = preferences_data.get('LeadDBS_Path')
                if lead_path:
                    lead_path = lead_path.replace('\\', '/')
        except Exception:
            # Fallback to stimulation data
            global _stimulation_data
            lead_path = _stimulation_data.leadpath
        
        if not lead_path:
            raise HTTPException(status_code=400, detail="No Lead-DBS path configured")
        
        # Construct atlases path
        atlases_path = os.path.join(
            lead_path, 'templates', 'space', 'MNI_ICBM_2009b_NLIN_ASYM', 'atlases'
        )
        
        ply_files = []
        
        if os.path.exists(atlases_path):
            atlas_folders = os.listdir(atlases_path)
            
            for folder in atlas_folders:
                folder_path = os.path.join(atlases_path, folder)
                
                if os.path.isdir(folder_path):
                    expected_ply_file = f"{folder}.ply"
                    ply_file_path = os.path.join(folder_path, expected_ply_file)
                    
                    if os.path.exists(ply_file_path):
                        ply_files.append({
                            "fileName": expected_ply_file,
                            "filePath": ply_file_path
                        })
        
        return ply_files
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PLY files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting PLY files: {str(e)}")

@app.get("/api/get-ply-files-database")
async def get_ply_files_database():
    """Get PLY files from database structure"""
    try:
        global _stimulation_data
        if not _stimulation_data.path:
            raise HTTPException(status_code=400, detail="No stimulation data path configured")
        
        directory_path = os.path.join(_stimulation_data.path, 'derivatives', 'leaddbs')
        result = {}
        
        if not os.path.exists(directory_path):
            return result
        
        # Get all patient subdirectories
        patient_dirs = [d for d in os.listdir(directory_path) 
                       if os.path.isdir(os.path.join(directory_path, d)) and d.startswith('sub-')]
        
        # Process each patient's clinical folder
        for patient_dir in patient_dirs:
            clinical_dir = os.path.join(directory_path, patient_dir, 'clinical')
            
            if os.path.exists(clinical_dir) and os.path.isdir(clinical_dir):
                json_files = []
                
                # Recursively find JSON files
                for root, dirs, files in os.walk(clinical_dir):
                    for file in files:
                        if file.endswith('.json'):
                            file_path = os.path.join(root, file)
                            json_files.append(file_path)
                
                # Find stimparameters files and extract sessions
                for file_path in json_files:
                    if 'stimparameters.json' in file_path:
                        # Extract session key from path
                        if '/clinical/' in file_path:
                            parts = file_path.split('/clinical/')
                            if len(parts) > 1:
                                session_part = parts[1]
                                if session_part.startswith('ses-'):
                                    session_key = session_part.split('/')[0]
                                    
                                    if patient_dir not in result:
                                        result[patient_dir] = []
                                    
                                    if session_key not in result[patient_dir]:
                                        result[patient_dir].append(session_key)
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting PLY files database: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting PLY files database: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
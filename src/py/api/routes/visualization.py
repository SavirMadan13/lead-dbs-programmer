"""
Visualization API Router - Handles visualization data endpoints
Replaces the PLY and visualization-related IPC handlers from the TypeScript backend
"""

import logging
import gzip
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from models.schemas import VisualizationData, SuccessResponse
from services.file_service import FileService
from services.data_manager import data_manager

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/ply-files")
async def get_ply_files():
    """Get PLY files from atlases - replaces 'get-ply-files' IPC"""
    try:
        # Get Lead path from preferences or stimulation data
        lead_path = await _get_lead_path()
        
        atlases_path = Path(lead_path) / 'templates' / 'space' / 'MNI_ICBM_2009b_NLIN_ASYM' / 'atlases'
        
        ply_files = await _get_ply_files_from_atlases(atlases_path)
        
        return ply_files
        
    except Exception as e:
        logger.error(f"Error getting PLY files: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ply-files-database")
async def get_ply_files_database():
    """Get PLY files database - replaces 'get-ply-files-database' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('path'):
            raise HTTPException(status_code=400, detail="No stimulation data available")
        
        directory_path = Path(stimulation_data['path']) / 'derivatives' / 'leaddbs'
        result = {}
        
        # Get all patient subdirectories
        patient_dirs = [
            d for d in directory_path.iterdir() 
            if d.is_dir() and d.name.startswith('sub-')
        ]
        
        for patient_dir in patient_dirs:
            clinical_dir = patient_dir / 'clinical'
            
            if clinical_dir.exists() and clinical_dir.is_dir():
                json_files = await _find_json_files_in_clinical(clinical_dir)
                
                for file_path in json_files:
                    # Extract session key from file path
                    if 'clinical/' in str(file_path) and 'ses-' in str(file_path):
                        parts = str(file_path).split('clinical/')
                        if len(parts) > 1:
                            session_part = parts[1].split('/')[0]
                            if session_part.startswith('ses-'):
                                sub_id = patient_dir.name
                                
                                # Check if file is stimparameters
                                if 'stimparameters.json' in str(file_path):
                                    if sub_id not in result:
                                        result[sub_id] = []
                                    result[sub_id].append(session_part)
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting PLY files database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-ply/{patient_id}/{timeline}")
async def load_ply_file(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Load PLY file for patient - replaces 'load-ply-file' IPC"""
    try:
        if not lead_dbs:
            return {"error": "No ply file found"}
        
        ply_data = await FileService.load_ply_file(
            patient_id, timeline, directory_path, lead_dbs, "combined_electrodes"
        )
        
        if ply_data is None:
            return {"error": "No ply file found"}
        
        return {"data": ply_data.hex()}  # Convert to hex for JSON compatibility
        
    except Exception as e:
        logger.error(f"Error loading PLY file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-ply-anatomy/{patient_id}/{timeline}")
async def load_ply_file_anatomy(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Load anatomy PLY file - replaces 'load-ply-file-anatomy' IPC"""
    try:
        if not lead_dbs:
            return {"error": "No ply file found"}
        
        ply_data = await FileService.load_ply_file(
            patient_id, timeline, directory_path, lead_dbs, "anatomy"
        )
        
        if ply_data is None:
            return {"error": "No ply file found"}
        
        return {"data": ply_data.hex()}  # Convert to hex for JSON compatibility
        
    except Exception as e:
        logger.error(f"Error loading anatomy PLY file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-vis-coords/{patient_id}")
async def load_vis_coords(
    patient_id: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Load visualization coordinates - replaces 'load-vis-coords' IPC"""
    try:
        if not lead_dbs:
            return {"error": "No coords found"}
        
        coords_data = await FileService.load_reconstruction_data(
            patient_id, directory_path, lead_dbs
        )
        
        if coords_data is None:
            return {"error": "No coords found"}
        
        return coords_data
        
    except Exception as e:
        logger.error(f"Error loading visualization coordinates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-ply-database/{patient_id}/{session_id}")
async def load_ply_file_database(patient_id: str, session_id: str):
    """Load PLY file from database - replaces 'load-ply-file-database' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('path'):
            raise HTTPException(status_code=400, detail="No stimulation data available")
        
        directory_path = stimulation_data['path']
        
        # Validate patient directory
        patient_dir = Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id
        if not patient_dir.exists():
            raise HTTPException(status_code=404, detail=f"Patient ID {patient_id} not found")
        
        # Get paths
        clinical_dir = patient_dir / 'clinical'
        export_dir = patient_dir / 'export' / 'ply'
        
        if not clinical_dir.exists():
            raise HTTPException(status_code=404, detail="Clinical directory not found")
        if not export_dir.exists():
            raise HTTPException(status_code=404, detail="Export directory not found")
        
        # Get session files
        session_dir = clinical_dir / session_id
        if not session_dir.exists():
            raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
        
        # Find stimulation parameters file
        stim_files = [f for f in session_dir.iterdir() if 'stimparameters.json' in f.name]
        if not stim_files:
            raise HTTPException(status_code=404, detail="No stimulation parameters file found")
        
        stim_params_path = stim_files[0]
        
        # PLY file paths
        anatomy_ply_path = export_dir / 'anatomy.ply'
        combined_electrodes_ply_path = export_dir / 'combined_electrodes.ply'
        
        if not anatomy_ply_path.exists() or not combined_electrodes_ply_path.exists():
            raise HTTPException(status_code=404, detail="PLY files not found")
        
        # Find reconstruction file
        reconstruction_files = [f for f in clinical_dir.iterdir() if 'desc-reconstruction.json' in f.name]
        if not reconstruction_files:
            raise HTTPException(status_code=404, detail="Reconstruction file not found")
        
        reconstruction_path = reconstruction_files[0]
        
        # Read all files
        anatomy_ply_data = await FileService.read_binary_file(anatomy_ply_path)
        combined_electrodes_ply_data = await FileService.read_binary_file(combined_electrodes_ply_path)
        reconstruction_data = await FileService.read_json_file(reconstruction_path)
        stimulation_parameters = await FileService.read_json_file(stim_params_path)
        
        return {
            "anatomyPly": anatomy_ply_data.hex() if anatomy_ply_data else None,
            "combinedElectrodesPly": combined_electrodes_ply_data.hex() if combined_electrodes_ply_data else None,
            "reconstructionData": reconstruction_data,
            "stimulationParameters": stimulation_parameters
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading PLY file from database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-reconstruction/{patient_id}")
async def load_reconstruction(patient_id: str, directory_path: str):
    """Load reconstruction data - replaces 'load-reconstruction' IPC"""
    try:
        # Validate patient directory
        patient_dir = Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id
        if not patient_dir.exists():
            raise HTTPException(status_code=404, detail=f"Patient ID {patient_id} not found")
        
        export_dir = patient_dir / 'export' / 'ply'
        if not export_dir.exists():
            raise HTTPException(status_code=404, detail="Export directory not found")
        
        # Load combined electrodes PLY file
        combined_electrodes_ply_path = export_dir / 'combined_electrodes.ply'
        if not combined_electrodes_ply_path.exists():
            raise HTTPException(status_code=404, detail="Combined electrodes PLY file not found")
        
        combined_electrodes_ply_data = await FileService.read_binary_file(combined_electrodes_ply_path)
        
        return {
            "combinedElectrodesPly": combined_electrodes_ply_data.hex() if combined_electrodes_ply_data else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading reconstruction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-file-buffer")
async def load_file_buffer(file_path: str):
    """Load file buffer - replaces 'load-file-buffer' IPC"""
    try:
        file_path_obj = Path(file_path)
        
        if file_path.endswith('.gz'):
            # Handle compressed files
            compressed_data = await FileService.read_binary_file(file_path)
            if compressed_data:
                decompressed_data = gzip.decompress(compressed_data)
                return {"data": decompressed_data.hex()}
        else:
            # Handle regular files
            file_data = await FileService.read_binary_file(file_path)
            if file_data:
                return {"data": file_data.hex()}
        
        raise HTTPException(status_code=404, detail="File not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading file buffer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/load-ply-file-2")
async def load_ply_file_2(file_path: str):
    """Load PLY file by path - replaces 'load-ply-file-2' IPC"""
    try:
        ply_data = await FileService.read_binary_file(file_path)
        
        if ply_data is None:
            raise HTTPException(status_code=404, detail="PLY file not found")
        
        return {"data": ply_data.hex()}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading PLY file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _get_lead_path() -> str:
    """Get Lead path from preferences or stimulation data"""
    try:
        # Try to get from preferences file first
        app_directory = Path(__file__).resolve().parent.parent.parent.parent.parent.parent
        preferences_path = app_directory / 'Preferences.json'
        
        if preferences_path.exists():
            preferences_data = await FileService.read_json_file(preferences_path)
            if preferences_data and preferences_data.get('LeadDBS_Path'):
                return preferences_data['LeadDBS_Path'].replace('\\', '/')
    except Exception:
        pass
    
    # Fallback to stimulation data
    stimulation_data = await data_manager.get_stimulation_data()
    if stimulation_data and stimulation_data.get('leadpath'):
        return stimulation_data['leadpath']
    
    # Default fallback
    return '/Users/savirmadan/Documents/GitHub/leaddbs'

async def _get_ply_files_from_atlases(atlases_path: Path) -> List[Dict[str, str]]:
    """Get PLY files from atlases folders"""
    ply_files = []
    
    try:
        if not atlases_path.exists():
            return ply_files
        
        for folder in atlases_path.iterdir():
            if folder.is_dir():
                expected_ply_file = folder / f"{folder.name}.ply"
                
                if expected_ply_file.exists():
                    ply_files.append({
                        "fileName": expected_ply_file.name,
                        "filePath": str(expected_ply_file)
                    })
    
    except Exception as e:
        logger.error(f"Error reading atlas folders: {e}")
    
    return ply_files

async def _find_json_files_in_clinical(clinical_dir: Path) -> List[Path]:
    """Recursively find JSON files in clinical directory"""
    json_files = []
    
    try:
        for item in clinical_dir.rglob('*.json'):
            if item.is_file():
                json_files.append(item)
    except Exception as e:
        logger.error(f"Error finding JSON files in clinical directory: {e}")
    
    return json_files
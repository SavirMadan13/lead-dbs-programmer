"""
Files API Router - Handles file operations endpoints
Replaces the file-related IPC handlers from the TypeScript backend
"""

import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse

from models.schemas import (
    ImportFileRequest, SaveFileRequest, SuccessResponse, ErrorResponse,
    DirectorySelection, FileInfo
)
from services.file_service import FileService
from services.data_manager import data_manager
from services.helpers import is_lead_dbs_folder, get_timelines_for_patient

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/import-inputdata", response_model=Dict[str, Any])
async def import_inputdata_file(file_path: str):
    """Import inputdata file - replaces 'import-inputdata-file' IPC"""
    try:
        file_path_obj = Path(file_path)
        
        # Check if it's a directory or file
        if file_path_obj.is_dir():
            stimulation_data = {
                'mode': 'standalone',
                'type': 'leaddbs',
                'path': str(file_path_obj)
            }
            await data_manager.set_stimulation_data(stimulation_data)
            return stimulation_data
        
        # Read JSON file
        json_data = await FileService.read_json_file(file_path)
        if not json_data:
            raise HTTPException(status_code=404, detail="File not found or invalid JSON")
        
        await data_manager.set_stimulation_data(json_data)
        
        # Handle different data types
        if json_data.get('type') == 'leaddbs':
            await _handle_leaddbs_import(json_data)
        elif json_data.get('type') == 'leadgroup':
            await _handle_leadgroup_import(json_data)
        
        logger.info("Stimulation data imported successfully")
        return json_data
        
    except Exception as e:
        logger.error(f"Error importing inputdata file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def _handle_leaddbs_import(stimulation_data: Dict[str, Any]):
    """Handle LeadDBS specific import logic"""
    if not stimulation_data.get('labels'):
        return
    
    for index, label in enumerate(stimulation_data['labels']):
        patient_dir = Path(stimulation_data['filepath']) / 'derivatives' / 'leaddbs' / stimulation_data['patientname'] / 'clinical'
        session_dir = patient_dir / f"ses-{label}"
        
        # Ensure directory exists
        await FileService.create_directory(session_dir)
        
        # Create stimulation parameters file
        filename = f"{stimulation_data['patientname']}_ses-{label}_stimparameters.json"
        file_path = session_dir / filename
        
        s_data = stimulation_data['S'][index] if isinstance(stimulation_data['S'], list) else stimulation_data['S']
        await FileService.write_json_file(file_path, {'S': s_data})

async def _handle_leadgroup_import(stimulation_data: Dict[str, Any]):
    """Handle LeadGroup specific import logic"""
    if not stimulation_data.get('patientname'):
        return
    
    for index, name in enumerate(stimulation_data['patientname']):
        patient_dir = Path(stimulation_data['patientfolders'][0][index]) / 'clinical'
        session_dir = patient_dir / f"ses-{stimulation_data['label']}"
        
        # Ensure directory exists
        await FileService.create_directory(session_dir)
        
        # Create stimulation parameters file
        filename = f"{name}_ses-{stimulation_data['label']}_stimparameters.json"
        file_path = session_dir / filename
        
        await FileService.write_json_file(file_path, {'S': stimulation_data['S'][index]})

@router.post("/import", response_model=Dict[str, Any])
async def import_file(request: ImportFileRequest):
    """Import file for patient - replaces 'import-file' IPC"""
    try:
        data = await FileService.import_stimulation_file(
            request.id, request.timeline, request.directoryPath, request.leadDBS
        )
        
        if data is None:
            # Try to handle special cases like stimulation mode
            stimulation_data = await data_manager.get_stimulation_data()
            if (stimulation_data and 
                stimulation_data.get('mode') == 'stimulate' and
                (stimulation_data.get('labels', [{}])[0] or stimulation_data.get('label')) == request.timeline):
                return stimulation_data
            
            # Try reconstruction file for LeadDBS
            if request.leadDBS:
                patient_folder = Path(request.directoryPath) / 'derivatives' / 'leaddbs' / request.id / 'clinical'
                reconstruction_file = patient_folder / f"{request.id}_desc-reconstruction.json"
                
                if reconstruction_file.exists():
                    data = await FileService.read_json_file(reconstruction_file)
                    if data:
                        return data
            
            raise HTTPException(status_code=404, detail="File not found")
        
        return data
        
    except Exception as e:
        logger.error(f"Error importing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save", response_model=SuccessResponse)
async def save_file(request: SaveFileRequest):
    """Save file for patient - replaces 'save-file' IPC"""
    try:
        success = await FileService.save_stimulation_file(
            request.patient.id,
            request.timeline,
            request.directoryPath,
            request.data,
            request.leadDBS
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save file")
        
        return SuccessResponse(message="File saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/select-folder")
async def select_folder(directory_path: Optional[str] = None):
    """Select and validate folder - replaces 'select-folder' IPC"""
    try:
        if not directory_path:
            raise HTTPException(status_code=400, detail="Directory path is required")
        
        directory_path_obj = Path(directory_path)
        if not directory_path_obj.exists():
            raise HTTPException(status_code=404, detail="Directory not found")
        
        # Check if it's a Lead-DBS folder
        if is_lead_dbs_folder(directory_path):
            logger.info("Lead-DBS folder detected")
            
            # Try to read participants file
            participants_file = directory_path_obj / 'participants.json'
            if participants_file.exists():
                patients = await FileService.read_json_file(participants_file)
                if patients:
                    return {
                        "directoryPath": directory_path,
                        "patients": patients,
                        "isLeadDBS": True
                    }
            
            # Handle stimulation data patients
            stimulation_data = await data_manager.get_stimulation_data()
            if stimulation_data and stimulation_data.get('type') == 'leadgroup':
                patients = []
                for i, name in enumerate(stimulation_data.get('patientname', [])):
                    patient = {
                        'id': name,
                        'elmodel': stimulation_data.get('electrodeModels', [None])[i] if stimulation_data.get('electrodeModels') else None
                    }
                    patients.append(patient)
                
                return {
                    "directoryPath": directory_path,
                    "patients": patients,
                    "isLeadDBS": True
                }
        
        # Regular folder handling
        participants_file = directory_path_obj / 'participants.json'
        if participants_file.exists():
            patients = await FileService.read_json_file(participants_file)
            return {
                "directoryPath": directory_path,
                "patients": patients,
                "isLeadDBS": False
            }
        
        return {
            "directoryPath": directory_path,
            "patients": [],
            "isLeadDBS": False
        }
        
    except Exception as e:
        logger.error(f"Error selecting folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/timelines/{patient_id}")
async def get_timelines(patient_id: str, directory_path: str, lead_dbs: bool = False):
    """Get timelines for patient - replaces 'get-timelines' IPC"""
    try:
        timelines = await get_timelines_for_patient(directory_path, patient_id, lead_dbs)
        return timelines
        
    except Exception as e:
        logger.error(f"Error getting timelines: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-patients-json")
async def save_patients_json(folder_path: str, patients: List[Dict[str, Any]]):
    """Save patients JSON file - replaces 'save-patients-json' IPC"""
    try:
        # Determine file path
        if folder_path:
            file_path = Path(folder_path) / 'participants.json'
        else:
            stimulation_data = await data_manager.get_stimulation_data()
            if not stimulation_data or not stimulation_data.get('path'):
                raise HTTPException(status_code=400, detail="No valid folder path available")
            file_path = Path(stimulation_data['path']) / 'participants.json'
        
        success = await FileService.write_json_file(file_path, patients)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save participants file")
        
        return SuccessResponse(message="Participants file saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving participants JSON: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/check-folder-exists")
async def check_folder_exists(folder_path: str):
    """Check if folder exists - replaces 'check-folder-exists' IPC"""
    try:
        exists = await FileService.directory_exists(folder_path)
        return {"exists": exists}
        
    except Exception as e:
        logger.error(f"Error checking folder existence: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/participants")
async def get_participants():
    """Get participants from stimulation data - replaces 'get-participants' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('path'):
            raise HTTPException(status_code=404, detail="No stimulation data available")
        
        participants_file = Path(stimulation_data['path']) / 'participants.json'
        participants = await FileService.read_json_file(participants_file)
        
        if not participants:
            raise HTTPException(status_code=404, detail="Participants file not found")
        
        return participants
        
    except Exception as e:
        logger.error(f"Error getting participants: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/read-file")
async def read_file_endpoint(file_path: str):
    """Read file and return buffer - replaces 'read-file' IPC"""
    try:
        data = await FileService.read_binary_file(file_path)
        if not data:
            raise HTTPException(status_code=404, detail="File not found")
        
        return {"data": data.hex()}  # Return as hex string for JSON compatibility
        
    except Exception as e:
        logger.error(f"Error reading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))
"""
Stimulation API Router - Handles stimulation data endpoints
Replaces the stimulation-related IPC handlers from the TypeScript backend
"""

import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException

from models.schemas import (
    StimulationParameters, StimulationData, SuccessResponse, 
    ErrorResponse, BatchImportData
)
from services.file_service import FileService
from services.data_manager import data_manager
from services.helpers import get_patient_folder

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/data")
async def get_stimulation_data():
    """Get current stimulation data - replaces 'get-stimulation-data' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        
        if stimulation_data is None:
            raise HTTPException(status_code=404, detail="No stimulation data available")
        
        return stimulation_data
        
    except Exception as e:
        logger.error(f"Error getting stimulation data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/data")
async def set_stimulation_data(data: Dict[str, Any]):
    """Set stimulation data"""
    try:
        await data_manager.set_stimulation_data(data)
        return SuccessResponse(message="Stimulation data updated successfully")
        
    except Exception as e:
        logger.error(f"Error setting stimulation data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/revert-to-standard")
async def revert_to_standard():
    """Revert to standard mode - replaces 'revert-to-standard' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        
        if stimulation_data:
            stimulation_data['type'] = 'leaddbs'
            if stimulation_data.get('mode') != 'standalone':
                stimulation_data['mode'] = 'explore'
            
            await data_manager.set_stimulation_data(stimulation_data)
        
        return SuccessResponse(message="Reverted to standard mode")
        
    except Exception as e:
        logger.error(f"Error reverting to standard: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save/{patient_id}/{timeline}")
async def save_stimulation_file(
    patient_id: str,
    timeline: str,
    directory_path: str,
    data: Dict[str, Any],
    lead_dbs: bool = False
):
    """Save stimulation file for patient"""
    try:
        success = await FileService.save_stimulation_file(
            patient_id, timeline, directory_path, data, lead_dbs
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save stimulation file")
        
        return SuccessResponse(message="Stimulation file saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving stimulation file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-stimulate")
async def save_stimulation_stimulate(data: Dict[str, Any]):
    """Save stimulation file in stimulate mode - replaces 'save-file-stimulate' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        
        if not stimulation_data or not stimulation_data.get('stimDir'):
            raise HTTPException(status_code=400, detail="No stimulation directory available")
        
        stim_file_path = Path(stimulation_data['stimDir']) / 'data.json'
        
        success = await FileService.write_json_file(stim_file_path, data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save stimulation file")
        
        return SuccessResponse(message="Stimulation file saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving stimulation file in stimulate mode: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-import")
async def batch_import_stimulation(
    data: Dict[str, BatchImportData],
    lead_dbs: bool = False
):
    """Batch import stimulation data - replaces 'batch-import-stimulation' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('filepath'):
            raise HTTPException(status_code=400, detail="No stimulation data available")
        
        directory_path = stimulation_data['filepath']
        
        for key, item in data.items():
            if not item.S:
                continue
                
            patient_id = item.id
            timeline = item.timeline
            s_data = item.S
            
            try:
                # Wrap S data in proper structure
                data_to_save = {'S': s_data}
                
                success = await FileService.save_stimulation_file(
                    patient_id, timeline, directory_path, data_to_save, lead_dbs
                )
                
                if success:
                    logger.info(f"Successfully saved stimulation data for {patient_id}/{timeline}")
                else:
                    logger.error(f"Failed to save stimulation data for {patient_id}/{timeline}")
                    
            except Exception as e:
                logger.error(f"Error saving stimulation data for {patient_id}/{timeline}: {e}")
        
        return SuccessResponse(message="Batch import completed")
        
    except Exception as e:
        logger.error(f"Error in batch import: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}/{timeline}")
async def get_stimulation_file(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Get stimulation file for patient/timeline"""
    try:
        data = await FileService.import_stimulation_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        
        if data is None:
            raise HTTPException(status_code=404, detail="Stimulation file not found")
        
        return data
        
    except Exception as e:
        logger.error(f"Error getting stimulation file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}/{timeline}/summary")
async def get_stimulation_summary(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Get summary of stimulation data for a patient/timeline"""
    try:
        data = await FileService.import_stimulation_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        
        if data is None:
            return {
                "patient_id": patient_id,
                "timeline": timeline,
                "has_data": False,
                "parameters": {}
            }
        
        # Extract basic info from S parameter
        s_data = data.get('S', {})
        summary = {
            "patient_id": patient_id,
            "timeline": timeline,
            "has_data": True,
            "parameters": s_data
        }
        
        # Add electrode info if available
        if isinstance(s_data, dict):
            summary["electrode_count"] = len([k for k in s_data.keys() if k.startswith('electrode')])
            summary["has_amplitude"] = any('amplitude' in str(v).lower() for v in s_data.values() if isinstance(v, (str, dict)))
            summary["has_frequency"] = any('frequency' in str(v).lower() or 'freq' in str(v).lower() for v in s_data.values() if isinstance(v, (str, dict)))
        
        return summary
        
    except Exception as e:
        logger.error(f"Error getting stimulation summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{patient_id}/{timeline}")
async def delete_stimulation_data(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Delete stimulation data for patient/timeline"""
    try:
        patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
        session_dir = Path(patient_folder) / f"ses-{timeline}"
        
        if lead_dbs:
            filename = f"{patient_id}_ses-{timeline}_stimparameters.json"
        else:
            filename = f"sub-{patient_id}_ses-{timeline}_stim.json"
        
        file_path = session_dir / filename
        
        if file_path.exists():
            file_path.unlink()
            return SuccessResponse(message="Stimulation file deleted successfully")
        
        raise HTTPException(status_code=404, detail="Stimulation file not found")
        
    except Exception as e:
        logger.error(f"Error deleting stimulation data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/unit-solutions")
async def get_unit_solutions(file_path: Optional[str] = None):
    """Get unit solutions - replaces 'get-unit-solutions' IPC"""
    try:
        # Hardcoded path from original TypeScript code
        patient_folder = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/stimulations/MNI152NLin2009bAsym/initialize'
        side = 'rh'
        oss_folder = Path(patient_folder) / f"OSS_sim_files_{side}"
        num_contacts = 8
        results = {}
        
        for i in range(1, num_contacts + 1):
            contact_folder = oss_folder / f"ResultsE1C{i}"
            nii_file_path = contact_folder / 'E_field_solution_Lattice.nii'
            
            try:
                file_buffer = await FileService.read_binary_file(nii_file_path)
                if file_buffer:
                    results[i-1] = file_buffer.hex()  # Convert to hex for JSON compatibility
                else:
                    results[i-1] = None
            except Exception as e:
                logger.error(f"Error reading file for contact E1C{i}: {e}")
                results[i-1] = None
        
        return results
        
    except Exception as e:
        logger.error(f"Error getting unit solutions: {e}")
        raise HTTPException(status_code=500, detail=str(e))
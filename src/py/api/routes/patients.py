"""
Patients API Router - Handles patient-related endpoints
"""

import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException

from models.schemas import Patient, TimelineData, SuccessResponse, ErrorResponse
from services.file_service import FileService
from services.data_manager import data_manager
from services.helpers import get_timelines_for_patient, is_lead_dbs_folder

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[Patient])
async def get_all_patients(directory_path: Optional[str] = None):
    """Get all patients from directory or stimulation data"""
    try:
        if directory_path:
            # Load from directory
            participants_file = Path(directory_path) / 'participants.json'
            if participants_file.exists():
                participants_data = await FileService.read_json_file(participants_file)
                if participants_data:
                    return [Patient(**p) for p in participants_data]
        
        # Load from stimulation data
        stimulation_data = await data_manager.get_stimulation_data()
        if stimulation_data:
            if stimulation_data.get('type') == 'leadgroup':
                patients = []
                patient_names = stimulation_data.get('patientname', [])
                electrode_models = stimulation_data.get('electrodeModels', [])
                
                for i, name in enumerate(patient_names):
                    patient = Patient(
                        id=name,
                        elmodel=electrode_models[i] if i < len(electrode_models) else None
                    )
                    patients.append(patient)
                return patients
            
            elif stimulation_data.get('type') == 'leaddbs':
                # For single patient LeadDBS
                if stimulation_data.get('patientname'):
                    return [Patient(
                        id=stimulation_data['patientname'],
                        elmodel=stimulation_data.get('elmodel')
                    )]
        
        return []
        
    except Exception as e:
        logger.error(f"Error getting patients: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str, directory_path: Optional[str] = None):
    """Get specific patient information"""
    try:
        patients = await get_all_patients(directory_path)
        
        for patient in patients:
            if patient.id == patient_id:
                return patient
        
        raise HTTPException(status_code=404, detail="Patient not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting patient {patient_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}/timelines", response_model=List[TimelineData])
async def get_patient_timelines(
    patient_id: str, 
    directory_path: str, 
    lead_dbs: bool = False
):
    """Get timelines for a specific patient"""
    try:
        timelines = await get_timelines_for_patient(directory_path, patient_id, lead_dbs)
        return [TimelineData(**timeline) for timeline in timelines]
        
    except Exception as e:
        logger.error(f"Error getting timelines for patient {patient_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{patient_id}/timelines/{timeline}/validate")
async def validate_patient_timeline(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Validate if patient timeline has required files"""
    try:
        # Check for stimulation file
        stim_data = await FileService.import_stimulation_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        has_stimulation = stim_data is not None
        
        # Check for clinical file
        clinical_data = await FileService.import_clinical_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        has_clinical = clinical_data is not None
        
        return {
            "patient_id": patient_id,
            "timeline": timeline,
            "has_stimulation": has_stimulation,
            "has_clinical": has_clinical,
            "is_valid": has_stimulation or has_clinical
        }
        
    except Exception as e:
        logger.error(f"Error validating patient timeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-validate")
async def batch_validate_patients(
    patients: List[str],
    directory_path: str,
    lead_dbs: bool = False
):
    """Validate multiple patients and their timelines"""
    try:
        results = {}
        
        for patient_id in patients:
            try:
                timelines = await get_timelines_for_patient(directory_path, patient_id, lead_dbs)
                patient_results = []
                
                for timeline_info in timelines:
                    timeline = timeline_info['timeline']
                    validation = await validate_patient_timeline(
                        patient_id, timeline, directory_path, lead_dbs
                    )
                    patient_results.append(validation)
                
                results[patient_id] = patient_results
                
            except Exception as e:
                logger.warning(f"Error validating patient {patient_id}: {e}")
                results[patient_id] = {"error": str(e)}
        
        return results
        
    except Exception as e:
        logger.error(f"Error in batch validation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}/summary")
async def get_patient_summary(
    patient_id: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Get comprehensive summary for a patient"""
    try:
        # Get patient info
        patient = await get_patient(patient_id, directory_path)
        
        # Get timelines
        timelines = await get_patient_timelines(patient_id, directory_path, lead_dbs)
        
        # Count files
        total_timelines = len(timelines)
        timelines_with_clinical = sum(1 for t in timelines if t.hasClinical)
        timelines_with_stimulation = sum(1 for t in timelines if t.hasStimulation)
        
        return {
            "patient": patient,
            "timelines": timelines,
            "summary": {
                "total_timelines": total_timelines,
                "timelines_with_clinical": timelines_with_clinical,
                "timelines_with_stimulation": timelines_with_stimulation,
                "completion_percentage": (
                    (timelines_with_clinical + timelines_with_stimulation) / 
                    (total_timelines * 2) * 100
                ) if total_timelines > 0 else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting patient summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-miniset")
async def create_miniset(
    folder_path: str,
    selected_patients: List[str]
):
    """Create a mini dataset with selected patients - replaces 'create-miniset' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('path'):
            raise HTTPException(status_code=400, detail="No stimulation data available")
        
        source_path = Path(stimulation_data['path'])
        dest_path = Path(folder_path)
        
        # Ensure destination directory exists
        await FileService.create_directory(dest_path)
        
        import subprocess
        import sys
        
        for patient_id in selected_patients:
            patient_source = source_path / 'derivatives' / 'leaddbs' / patient_id
            patient_dest = dest_path / 'derivatives' / 'leaddbs' / patient_id
            
            # Ensure patient destination exists
            await FileService.create_directory(patient_dest)
            
            # Copy subfolders
            subfolders = ['clinical', 'stimulations', 'export', 'reconstruction']
            
            for subfolder in subfolders:
                src_folder = patient_source / subfolder
                dest_folder = patient_dest / subfolder
                
                if src_folder.exists():
                    try:
                        if sys.platform == 'win32':
                            subprocess.run([
                                'xcopy', str(src_folder), str(dest_folder), '/E', '/I', '/Y'
                            ], check=True)
                        else:
                            subprocess.run([
                                'cp', '-R', f"{src_folder}/.", str(dest_folder)
                            ], check=True)
                        
                        logger.info(f"Copied {subfolder} data for patient {patient_id}")
                        
                    except subprocess.CalledProcessError as e:
                        logger.error(f"Error copying {subfolder} for patient {patient_id}: {e}")
        
        return SuccessResponse(message="Mini dataset created successfully")
        
    except Exception as e:
        logger.error(f"Error creating miniset: {e}")
        raise HTTPException(status_code=500, detail=str(e))
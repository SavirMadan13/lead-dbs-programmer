"""
Clinical API Router - Handles clinical data endpoints
Replaces the clinical-related IPC handlers from the TypeScript backend
"""

import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException

from models.schemas import (
    ClinicalScores, SuccessResponse, ErrorResponse, 
    ClinicalDataRequest, BatchImportData
)
from services.file_service import FileService
from services.data_manager import data_manager
from services.helpers import get_patient_folder

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/import/{patient_id}/{timeline}")
async def import_clinical_file(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Import clinical file for patient - replaces 'import-file-clinical' IPC"""
    try:
        data = await FileService.import_clinical_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        
        if data is None:
            raise HTTPException(status_code=404, detail="Clinical file not found")
        
        return data
        
    except Exception as e:
        logger.error(f"Error importing clinical file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save/{patient_id}/{timeline}")
async def save_clinical_file(
    patient_id: str,
    timeline: str,
    directory_path: str,
    data: Dict[str, Any],
    score_type: str,
    lead_dbs: bool = False
):
    """Save clinical file for patient - replaces 'save-file-clinical' IPC"""
    try:
        success = await FileService.save_clinical_file(
            patient_id, timeline, directory_path, data, score_type, lead_dbs
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save clinical file")
        
        return SuccessResponse(message="Clinical file saved successfully")
        
    except Exception as e:
        logger.error(f"Error saving clinical file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/import-group/{patient_id}")
async def import_clinical_files_group(
    patient_id: str,
    timelines: Dict[str, str],
    directory_path: str,
    lead_dbs: bool = False
):
    """Import clinical files for multiple timelines - replaces 'import-file-clinical-group' IPC"""
    try:
        output_data = {}
        
        for key, timeline in timelines.items():
            try:
                data = await FileService.import_clinical_file(
                    patient_id, timeline, directory_path, lead_dbs
                )
                
                if data is not None:
                    output_data[timeline] = data
                else:
                    output_data[timeline] = "Does not exist"
                    
            except Exception as e:
                logger.warning(f"Error importing clinical file for timeline {timeline}: {e}")
                output_data[timeline] = "Does not exist"
        
        return output_data
        
    except Exception as e:
        logger.error(f"Error importing clinical files group: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch-import")
async def batch_import_clinical(
    data: Dict[str, BatchImportData],
    lead_dbs: bool = False
):
    """Batch import clinical data - replaces 'batch-import' IPC"""
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        if not stimulation_data or not stimulation_data.get('filepath'):
            raise HTTPException(status_code=400, detail="No stimulation data available")
        
        directory_path = stimulation_data['filepath']
        
        for key, item in data.items():
            if not item.scores:
                continue
                
            patient_id = item.id
            timeline = item.timeline
            scores = item.scores.copy()
            
            # Extract score type and remove from scores
            score_type = scores.pop('Score Type', 'Unknown')
            
            try:
                success = await FileService.save_clinical_file(
                    patient_id, timeline, directory_path, scores, score_type, lead_dbs
                )
                
                if success:
                    logger.info(f"Successfully saved clinical data for {patient_id}/{timeline}")
                else:
                    logger.error(f"Failed to save clinical data for {patient_id}/{timeline}")
                    
            except Exception as e:
                logger.error(f"Error saving clinical data for {patient_id}/{timeline}: {e}")
        
        return SuccessResponse(message="Batch import completed")
        
    except Exception as e:
        logger.error(f"Error in batch import: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ensure-scores-file")
async def ensure_clinical_scores_file():
    """Ensure clinical scores file exists - replaces ensureClinicalScoresFile()"""
    try:
        await data_manager.ensure_clinical_scores_file()
        return SuccessResponse(message="Clinical scores file ensured")
        
    except Exception as e:
        logger.error(f"Error ensuring clinical scores file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scores-types")
async def get_clinical_scores_types():
    """Get clinical scores types - replaces 'get-clinical-scores-types' IPC"""
    try:
        scores = await data_manager.get_clinical_scores_types()
        
        if scores is None:
            raise HTTPException(status_code=404, detail="Clinical scores file not found")
        
        return scores
        
    except Exception as e:
        logger.error(f"Error getting clinical scores types: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-score-type")
async def add_score_type(name: str, new_score: Dict[str, Any]):
    """Add new score type - replaces 'add-score-type' IPC"""
    try:
        await data_manager.add_score_type(name, new_score)
        return SuccessResponse(message=f"Score type '{name}' added successfully")
        
    except Exception as e:
        logger.error(f"Error adding score type: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get-clinical-data")
async def get_clinical_data(request: ClinicalDataRequest):
    """Get clinical data for multiple patients - replaces 'get-clinical-data' IPC"""
    try:
        all_clinical_data = []
        
        for patient_info in request.patientsWithTimelines:
            patient_id = patient_info['id']
            timelines = patient_info['timelines']
            
            patient_clinical_data = {}
            
            for timeline in timelines:
                try:
                    # Construct session path
                    session_path = Path(request.directoryPath) / 'derivatives' / 'leaddbs' / patient_id / 'clinical' / f"ses-{timeline}"
                    clinical_file_path = session_path / f"{patient_id}_ses-{timeline}_clinical.json"
                    
                    if clinical_file_path.exists():
                        clinical_data = await FileService.read_json_file(clinical_file_path)
                        if clinical_data:
                            patient_clinical_data[timeline] = clinical_data
                            
                except Exception as e:
                    logger.warning(f"Error reading clinical data for {patient_id}/{timeline}: {e}")
            
            all_clinical_data.append({
                'id': patient_id,
                'clinicalData': patient_clinical_data
            })
        
        return all_clinical_data
        
    except Exception as e:
        logger.error(f"Error getting clinical data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{patient_id}/{timeline}/summary")
async def get_clinical_summary(
    patient_id: str,
    timeline: str,
    directory_path: str,
    lead_dbs: bool = False
):
    """Get summary of clinical data for a patient/timeline"""
    try:
        data = await FileService.import_clinical_file(
            patient_id, timeline, directory_path, lead_dbs
        )
        
        if data is None:
            return {
                "patient_id": patient_id,
                "timeline": timeline,
                "has_data": False,
                "score_types": [],
                "total_scores": 0
            }
        
        score_types = list(data.keys())
        total_scores = sum(len(scores) if isinstance(scores, dict) else 1 for scores in data.values())
        
        return {
            "patient_id": patient_id,
            "timeline": timeline,
            "has_data": True,
            "score_types": score_types,
            "total_scores": total_scores,
            "data": data
        }
        
    except Exception as e:
        logger.error(f"Error getting clinical summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{patient_id}/{timeline}")
async def delete_clinical_data(
    patient_id: str,
    timeline: str,
    directory_path: str,
    score_type: Optional[str] = None,
    lead_dbs: bool = False
):
    """Delete clinical data for patient/timeline"""
    try:
        if score_type:
            # Delete specific score type
            data = await FileService.import_clinical_file(
                patient_id, timeline, directory_path, lead_dbs
            )
            
            if data and score_type in data:
                del data[score_type]
                success = await FileService.save_clinical_file(
                    patient_id, timeline, directory_path, {}, score_type, lead_dbs
                )
                
                if success:
                    return SuccessResponse(message=f"Score type '{score_type}' deleted successfully")
            
            raise HTTPException(status_code=404, detail="Score type not found")
        
        else:
            # Delete entire clinical file
            patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
            session_dir = Path(patient_folder) / f"ses-{timeline}"
            
            if lead_dbs:
                filename = f"{patient_id}_ses-{timeline}_clinical.json"
            else:
                filename = f"sub-{patient_id}_ses-{timeline}_clinical.json"
            
            file_path = session_dir / filename
            
            if file_path.exists():
                file_path.unlink()
                return SuccessResponse(message="Clinical file deleted successfully")
            
            raise HTTPException(status_code=404, detail="Clinical file not found")
        
    except Exception as e:
        logger.error(f"Error deleting clinical data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
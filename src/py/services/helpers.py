"""
Helpers Service - Utility functions
Replaces the helpers/helpers.ts functionality from the TypeScript backend
"""

import logging
from pathlib import Path
from typing import Optional, Union
from services.data_manager import data_manager

logger = logging.getLogger(__name__)

async def get_patient_folder(
    directory_path: str,
    patient_id: str,
    lead_dbs: bool
) -> str:
    """
    Get the patient's folder path.
    Replaces the getPatientFolder function from TypeScript.
    """
    try:
        # Fetch stimulation data
        stimulation_data = await data_manager.get_stimulation_data()
        
        # Validate stimulation data
        if not stimulation_data:
            return str(Path(directory_path) / f"sub-{patient_id}")
        
        logger.debug("Fetching patient folder...")
        logger.debug(f"Directory Path: {directory_path}")
        logger.debug(f"LeadDBS Mode: {lead_dbs}")
        logger.debug(f"Patient ID: {patient_id}")
        
        # Handle standalone mode
        if stimulation_data.get('mode') == 'standalone':
            return str(Path(
                directory_path if directory_path else stimulation_data.get('path', '')
            ) / 'derivatives' / 'leaddbs' / patient_id / 'clinical')
        
        # Check for leadgroup type
        is_lead_group = (
            stimulation_data.get('type') == 'leadgroup' or 
            'leadgroup' in stimulation_data.get('filepath', '')
        )
        
        # Handle leadgroup
        if is_lead_group:
            patient_names = stimulation_data.get('patientname', [])
            if isinstance(patient_names, list):
                try:
                    patient_index = patient_names.index(patient_id)
                    logger.debug(f"Patient Index: {patient_index}")
                    
                    patient_folders = stimulation_data.get('patientfolders', [[]])
                    if patient_folders and patient_folders[0]:
                        new_folder_path = patient_folders[0][patient_index]
                        logger.debug(f"Patient Folder Path: {new_folder_path}")
                        return str(Path(new_folder_path) / 'clinical')
                        
                except (ValueError, IndexError) as e:
                    logger.error(f"Patient ID '{patient_id}' not found in stimulation data: {e}")
                    raise ValueError(f"Patient ID '{patient_id}' not found in stimulation data.")
        
        # Default leaddbs path
        return str(Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id / 'clinical')
        
    except Exception as e:
        logger.error(f"Error getting patient folder: {e}")
        raise

async def get_patient_folder_ply(
    directory_path: str,
    patient_id: str,
    lead_dbs: bool
) -> str:
    """
    Get the patient's folder path for PLY files.
    Replaces the getPatientFolderPly function from TypeScript.
    """
    try:
        stimulation_data = await data_manager.get_stimulation_data()
        
        if not stimulation_data:
            return str(Path(directory_path) / f"sub-{patient_id}")
        
        # Handle standalone mode
        if stimulation_data.get('mode') == 'standalone':
            return str(Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id)
        
        # Check for leadgroup type
        is_lead_group = (
            stimulation_data.get('type') == 'leadgroup' or 
            'leadgroup' in stimulation_data.get('filepath', '')
        )
        
        # Handle leadgroup
        if is_lead_group:
            patient_names = stimulation_data.get('patientname', [])
            if isinstance(patient_names, list):
                try:
                    patient_index = patient_names.index(patient_id)
                    logger.debug(f"Patient Index: {patient_index}")
                    
                    patient_folders = stimulation_data.get('patientfolders', [[]])
                    if patient_folders and patient_folders[0]:
                        return patient_folders[0][patient_index]
                        
                except (ValueError, IndexError) as e:
                    logger.error(f"Patient ID '{patient_id}' not found in stimulation data: {e}")
                    return str(Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id)
        
        # Default leaddbs path
        return str(Path(stimulation_data.get('filepath', directory_path)) / 'derivatives' / 'leaddbs' / patient_id)
        
    except Exception as e:
        logger.error(f"Error getting patient PLY folder: {e}")
        return str(Path(directory_path) / 'derivatives' / 'leaddbs' / patient_id)

def get_relative_path(base_path: str, target_path: str) -> str:
    """
    Get a relative path between base and target.
    Replaces the getRelativePath function from TypeScript.
    """
    try:
        base = Path(base_path)
        target = Path(target_path)
        return str(target.relative_to(base))
    except ValueError:
        # If paths are not relative, return the target path
        return str(target_path)

async def file_exists_in_directory(directory_path: str, file_name: str) -> bool:
    """
    Check if a file exists in a directory.
    Replaces the fileExistsInDirectory function from TypeScript.
    """
    try:
        full_path = Path(directory_path) / file_name
        return full_path.exists() and full_path.is_file()
    except Exception as e:
        logger.error(f"Error checking file existence: {e}")
        return False

def is_lead_dbs_folder(directory_path: str) -> bool:
    """
    Check if a folder has the Lead-DBS structure.
    Replaces the isLeadDBSFolder function from TypeScript.
    """
    try:
        path = Path(directory_path)
        
        # Check for basic Lead-DBS structure
        derivatives_path = path / "derivatives" / "leaddbs"
        participants_file = path / "participants.json"
        
        return derivatives_path.exists() or participants_file.exists()
        
    except Exception as e:
        logger.error(f"Error checking Lead-DBS folder structure: {e}")
        return False

async def get_timelines_for_patient(
    directory_path: str,
    patient_id: str,
    lead_dbs: bool = False
) -> list:
    """
    Get timelines for a specific patient.
    Replaces parts of the get-timelines IPC handler from TypeScript.
    """
    try:
        patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
        patient_path = Path(patient_folder)
        
        if not patient_path.exists():
            logger.warning(f"Patient folder does not exist: {patient_folder}")
            return []
        
        timelines = []
        
        # Get all session directories
        for item in patient_path.iterdir():
            if item.is_dir() and item.name.startswith('ses-'):
                timeline_name = item.name.replace('ses-', '')
                
                # Check for clinical and stimulation files
                session_files = [f.name for f in item.iterdir() if f.is_file()]
                
                has_clinical = any('clinical.json' in f for f in session_files)
                has_stimulation = any(
                    'stimparameters.json' in f if lead_dbs else 'stim.json' in f 
                    for f in session_files
                )
                
                timelines.append({
                    'timeline': timeline_name,
                    'hasClinical': has_clinical,
                    'hasStimulation': has_stimulation
                })
        
        return timelines
        
    except Exception as e:
        logger.error(f"Error getting timelines for patient {patient_id}: {e}")
        return []
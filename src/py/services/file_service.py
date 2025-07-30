"""
File Service - Handles all file operations
Replaces the file-related functionality from the TypeScript backend
"""

import json
import logging
import asyncio
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
import aiofiles
import aiofiles.os
from core.config import settings
from services.helpers import get_patient_folder, get_patient_folder_ply

logger = logging.getLogger(__name__)

class FileService:
    """Service for handling file operations"""
    
    @staticmethod
    async def read_json_file(file_path: Union[str, Path]) -> Optional[Dict[str, Any]]:
        """Read and parse JSON file"""
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                logger.warning(f"File not found: {file_path}")
                return None
                
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                content = await f.read()
                return json.loads(content)
                
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON file {file_path}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            return None
    
    @staticmethod
    async def write_json_file(file_path: Union[str, Path], data: Dict[str, Any], ensure_dirs: bool = True) -> bool:
        """Write data to JSON file"""
        try:
            file_path = Path(file_path)
            
            if ensure_dirs:
                file_path.parent.mkdir(parents=True, exist_ok=True)
            
            async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
                await f.write(json.dumps(data, indent=2))
            
            logger.debug(f"Successfully wrote JSON file: {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error writing JSON file {file_path}: {e}")
            return False
    
    @staticmethod
    async def read_binary_file(file_path: Union[str, Path]) -> Optional[bytes]:
        """Read binary file"""
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                logger.warning(f"File not found: {file_path}")
                return None
                
            async with aiofiles.open(file_path, 'rb') as f:
                return await f.read()
                
        except Exception as e:
            logger.error(f"Error reading binary file {file_path}: {e}")
            return None
    
    @staticmethod
    async def write_binary_file(file_path: Union[str, Path], data: bytes, ensure_dirs: bool = True) -> bool:
        """Write binary data to file"""
        try:
            file_path = Path(file_path)
            
            if ensure_dirs:
                file_path.parent.mkdir(parents=True, exist_ok=True)
            
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(data)
            
            logger.debug(f"Successfully wrote binary file: {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error writing binary file {file_path}: {e}")
            return False
    
    @staticmethod
    async def file_exists(file_path: Union[str, Path]) -> bool:
        """Check if file exists"""
        try:
            return await aiofiles.os.path.exists(str(file_path))
        except Exception:
            return False
    
    @staticmethod
    async def directory_exists(dir_path: Union[str, Path]) -> bool:
        """Check if directory exists"""
        try:
            path = Path(dir_path)
            return path.exists() and path.is_dir()
        except Exception:
            return False
    
    @staticmethod
    async def create_directory(dir_path: Union[str, Path]) -> bool:
        """Create directory if it doesn't exist"""
        try:
            Path(dir_path).mkdir(parents=True, exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            return False
    
    @staticmethod
    async def list_directory(dir_path: Union[str, Path], pattern: str = "*") -> List[str]:
        """List files in directory"""
        try:
            path = Path(dir_path)
            if not path.exists() or not path.is_dir():
                return []
            
            return [str(p.name) for p in path.glob(pattern)]
            
        except Exception as e:
            logger.error(f"Error listing directory {dir_path}: {e}")
            return []
    
    @staticmethod
    async def get_file_size(file_path: Union[str, Path]) -> Optional[int]:
        """Get file size in bytes"""
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                return path.stat().st_size
            return None
        except Exception as e:
            logger.error(f"Error getting file size {file_path}: {e}")
            return None
    
    @staticmethod
    async def import_stimulation_file(
        patient_id: str, 
        timeline: str, 
        directory_path: str, 
        lead_dbs: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Import stimulation file for a patient and timeline"""
        try:
            # Get patient folder
            patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
            session_dir = Path(patient_folder) / f"ses-{timeline}"
            
            # Determine filename based on mode
            if lead_dbs:
                filename = f"{patient_id}_ses-{timeline}_stimparameters.json"
            else:
                filename = f"sub-{patient_id}_ses-{timeline}_stim.json"
            
            file_path = session_dir / filename
            
            # Read and return the file
            return await FileService.read_json_file(file_path)
            
        except Exception as e:
            logger.error(f"Error importing stimulation file: {e}")
            return None
    
    @staticmethod
    async def save_stimulation_file(
        patient_id: str,
        timeline: str,
        directory_path: str,
        data: Dict[str, Any],
        lead_dbs: bool = False
    ) -> bool:
        """Save stimulation file for a patient and timeline"""
        try:
            # Get patient folder
            patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
            session_dir = Path(patient_folder) / f"ses-{timeline}"
            
            # Ensure directories exist
            await FileService.create_directory(session_dir)
            
            # Determine filename based on mode
            if lead_dbs:
                filename = f"{patient_id}_ses-{timeline}_stimparameters.json"
            else:
                filename = f"sub-{patient_id}_ses-{timeline}_stim.json"
            
            file_path = session_dir / filename
            
            # Write the file
            return await FileService.write_json_file(file_path, data)
            
        except Exception as e:
            logger.error(f"Error saving stimulation file: {e}")
            return False
    
    @staticmethod
    async def import_clinical_file(
        patient_id: str, 
        timeline: str, 
        directory_path: str, 
        lead_dbs: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Import clinical file for a patient and timeline"""
        try:
            # Get patient folder
            patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
            session_dir = Path(patient_folder) / f"ses-{timeline}"
            
            # Determine filename based on mode
            if lead_dbs:
                filename = f"{patient_id}_ses-{timeline}_clinical.json"
            else:
                filename = f"sub-{patient_id}_ses-{timeline}_clinical.json"
            
            file_path = session_dir / filename
            
            # Read and return the file
            return await FileService.read_json_file(file_path)
            
        except Exception as e:
            logger.error(f"Error importing clinical file: {e}")
            return None
    
    @staticmethod
    async def save_clinical_file(
        patient_id: str,
        timeline: str,
        directory_path: str,
        data: Dict[str, Any],
        score_type: str,
        lead_dbs: bool = False
    ) -> bool:
        """Save clinical file for a patient and timeline"""
        try:
            # Get patient folder
            patient_folder = await get_patient_folder(directory_path, patient_id, lead_dbs)
            session_dir = Path(patient_folder) / f"ses-{timeline}"
            
            # Ensure directories exist
            await FileService.create_directory(session_dir)
            
            # Determine filename based on mode
            if lead_dbs:
                filename = f"{patient_id}_ses-{timeline}_clinical.json"
            else:
                filename = f"sub-{patient_id}_ses-{timeline}_clinical.json"
            
            file_path = session_dir / filename
            
            # Read existing file if it exists
            existing_data = await FileService.read_json_file(file_path) or {}
            
            # Update with new score type data
            existing_data[score_type] = data
            
            # Write the file
            return await FileService.write_json_file(file_path, existing_data)
            
        except Exception as e:
            logger.error(f"Error saving clinical file: {e}")
            return False
    
    @staticmethod
    async def load_ply_file(
        patient_id: str,
        timeline: str,
        directory_path: str,
        lead_dbs: bool = False,
        file_type: str = "combined_electrodes"
    ) -> Optional[bytes]:
        """Load PLY file for visualization"""
        try:
            if not lead_dbs:
                return None
                
            # Get patient folder for PLY files
            patient_folder = await get_patient_folder_ply(directory_path, patient_id, lead_dbs)
            
            # Determine PLY file path
            ply_filename = f"{file_type}.ply"
            ply_path = Path(patient_folder) / "export" / "ply" / ply_filename
            
            # Read and return the binary data
            return await FileService.read_binary_file(ply_path)
            
        except Exception as e:
            logger.error(f"Error loading PLY file: {e}")
            return None
    
    @staticmethod
    async def load_reconstruction_data(
        patient_id: str,
        directory_path: str,
        lead_dbs: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Load reconstruction data for a patient"""
        try:
            if not lead_dbs:
                return None
                
            # Get patient folder
            patient_folder = await get_patient_folder_ply(directory_path, patient_id, lead_dbs)
            clinical_dir = Path(patient_folder) / "clinical"
            
            # Find reconstruction file
            reconstruction_file = f"{patient_id}_desc-reconstruction.json"
            reconstruction_path = clinical_dir / reconstruction_file
            
            # Read and return the JSON data
            return await FileService.read_json_file(reconstruction_path)
            
        except Exception as e:
            logger.error(f"Error loading reconstruction data: {e}")
            return None
"""
Data Manager Service - Manages global application data and state
Replaces the data/data.ts functionality from the TypeScript backend
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import aiofiles
from core.config import settings

logger = logging.getLogger(__name__)

class DataManager:
    """Manages global application data and state"""
    
    def __init__(self):
        self._data: Dict[str, Any] = {}
        self._stimulation_data: Optional[Dict[str, Any]] = None
        
    async def initialize(self):
        """Initialize the data manager"""
        logger.info("Initializing DataManager...")
        
        # Initialize default data
        self._data = {}
        
    async def get_data(self, key: str) -> Any:
        """Get data by key"""
        return self._data.get(key)
    
    async def set_data(self, key: str, value: Any) -> None:
        """Set data by key"""
        self._data[key] = value
        logger.debug(f"Set data for key: {key}")
    
    async def get_stimulation_data(self) -> Optional[Dict[str, Any]]:
        """Get current stimulation data"""
        return self._stimulation_data
    
    async def set_stimulation_data(self, data: Dict[str, Any]) -> None:
        """Set stimulation data"""
        self._stimulation_data = data
        await self.set_data('stimulationData', data)
        logger.info("Updated stimulation data")
    
    async def ensure_clinical_scores_file(self) -> None:
        """Ensure clinical scores file exists with default content"""
        scores_file_path = settings.USER_DATA_DIR / 'ClinicalScores.json'
        
        if not scores_file_path.exists():
            default_scores = {
                'UPDRS': {
                    '3.1: Speech': 0,
                    '3.2: Facial expression': 0,
                    '3.3a: Rigidity- Neck': 0,
                    '3.3b: Rigidity- RUE': 0,
                    '3.3c: Rigidity- LUE': 0,
                    '3.3d: Rigidity- RLE': 0,
                    '3.3e: Rigidity- LLE': 0,
                    '3.4a: Finger tapping- Right hand': 0,
                    '3.4b: Finger tapping- Left hand': 0,
                    '3.5a: Hand movements- Right hand': 0,
                    '3.5b: Hand movements- Left hand': 0,
                    '3.6a: Pronation- supination movements- Right hand': 0,
                    '3.6b: Pronation- supination movements- Left hand': 0,
                    '3.7a: Toe tapping- Right foot': 0,
                    '3.7b: Toe tapping- Left foot': 0,
                    '3.8a: Leg agility- Right leg': 0,
                    '3.8b: Leg agility- Right leg': 0,
                    '3.9: Arising from chair': 0,
                    '3.10: Gait': 0,
                    '3.11: Freezing of gait': 0,
                    '3.12: Postural stability': 0,
                    '3.13: Posture': 0,
                    '3.14: Global spontaneity of movement': 0,
                    '3.15a: Postural tremor- Right hand': 0,
                    '3.15b: Postural tremor- Left hand': 0,
                    '3.16a: Kinetic tremor- Right hand': 0,
                    '3.16b: Kinetic tremor- Left hand': 0,
                    '3.17a: Rest tremor amplitude- RUE': 0,
                    '3.17b: Rest tremor amplitude- LUE': 0,
                    '3.17c: Rest tremor amplitude- RLE': 0,
                    '3.17d: Rest tremor amplitude- LLE': 0,
                    '3.17e: Rest tremor amplitude- Lip/jaw': 0,
                    '3.18: Constancy of rest tremor': 0,
                },
                'Y-BOCS': {
                    'Time occupied by obsessive thoughts': 0,
                    'Interference due to obsessive thoughts': 0,
                    'Distress associated with obsessive thoughts': 0,
                    'Resistance against obsessions': 0,
                    'Degree of control over obsessive thoughts': 0,
                    'Time spent performing compulsive behaviors': 0,
                    'Interference due to compulsive behaviors': 0,
                    'Distress associated with compulsive behavior': 0,
                    'Resistance against compulsions': 0,
                    'Degree of control over compulsive behavior': 0,
                },
            }
            
            try:
                async with aiofiles.open(scores_file_path, 'w') as f:
                    await f.write(json.dumps(default_scores, indent=2))
                logger.info("Created ClinicalScores.json with default content")
            except Exception as error:
                logger.error(f"Error writing default scores to file: {error}")
                raise
    
    async def get_clinical_scores_types(self) -> Optional[Dict[str, Any]]:
        """Get clinical scores types from file"""
        scores_file_path = settings.USER_DATA_DIR / 'ClinicalScores.json'
        
        try:
            async with aiofiles.open(scores_file_path, 'r') as f:
                content = await f.read()
                return json.loads(content)
        except Exception as error:
            logger.error(f"Error reading scores file: {error}")
            return None
    
    async def add_score_type(self, name: str, new_score: Dict[str, Any]) -> None:
        """Add a new score type to clinical scores"""
        scores_file_path = settings.USER_DATA_DIR / 'ClinicalScores.json'
        
        try:
            scores = await self.get_clinical_scores_types()
            if scores is None:
                scores = {}
            
            scores[name] = new_score[name]
            
            async with aiofiles.open(scores_file_path, 'w') as f:
                await f.write(json.dumps(scores, indent=2))
            
            logger.info(f"Added new score type: {name}")
        except Exception as error:
            logger.error(f"Error adding score type: {error}")
            raise

# Global data manager instance
data_manager = DataManager()
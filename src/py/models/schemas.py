"""
Pydantic models for Lead DBS Programmer FastAPI Backend
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List, Any, Union
from pathlib import Path
from enum import Enum

class DataMode(str, Enum):
    """Data mode enumeration"""
    STANDALONE = "standalone"
    EXPLORE = "explore"
    STIMULATE = "stimulate"

class DataType(str, Enum):
    """Data type enumeration"""
    LEADDBS = "leaddbs"
    LEADGROUP = "leadgroup"

class StimulationData(BaseModel):
    """Stimulation data model"""
    mode: DataMode
    type: DataType
    path: Optional[str] = None
    filepath: Optional[str] = None
    stimDir: Optional[str] = None
    labels: Optional[List[str]] = None
    label: Optional[str] = None
    patientname: Optional[Union[str, List[str]]] = None
    patientfolders: Optional[List[List[str]]] = None
    electrodeModels: Optional[List[str]] = None
    elmodel: Optional[str] = None
    leadpath: Optional[str] = None
    S: Optional[Union[Dict, List[Dict]]] = None

class Patient(BaseModel):
    """Patient model"""
    id: str = Field(..., description="Patient identifier")
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    diagnosis: Optional[str] = None
    elmodel: Optional[str] = None
    timelines: Optional[List[str]] = []

class TimelineData(BaseModel):
    """Timeline data model"""
    timeline: str
    hasClinical: bool = False
    hasStimulation: bool = False

class ClinicalScores(BaseModel):
    """Clinical scores model"""
    scores: Dict[str, Union[int, float, str]]
    scoreType: str

class StimulationParameters(BaseModel):
    """Stimulation parameters model"""
    S: Dict[str, Any]

class VisualizationData(BaseModel):
    """Visualization data model"""
    anatomyPly: Optional[bytes] = None
    combinedElectrodesPly: Optional[bytes] = None
    reconstructionData: Optional[Dict] = None
    stimulationParameters: Optional[Dict] = None

class FileInfo(BaseModel):
    """File information model"""
    fileName: str
    filePath: str
    fileSize: Optional[int] = None
    lastModified: Optional[str] = None

class DirectorySelection(BaseModel):
    """Directory selection model"""
    directoryPath: str
    isLeadDBS: bool = False

class BatchImportData(BaseModel):
    """Batch import data model"""
    id: str
    timeline: str
    scores: Optional[Dict] = None
    S: Optional[Dict] = None

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str
    details: Optional[str] = None

class SuccessResponse(BaseModel):
    """Success response model"""
    success: bool = True
    message: str
    data: Optional[Any] = None

# Request models
class ImportFileRequest(BaseModel):
    """Import file request model"""
    id: str
    timeline: str
    directoryPath: str
    leadDBS: bool = False

class SaveFileRequest(BaseModel):
    """Save file request model"""
    patient: Patient
    timeline: str
    directoryPath: str
    data: Dict[str, Any]
    leadDBS: bool = False

class ClinicalDataRequest(BaseModel):
    """Clinical data request model"""
    directoryPath: str
    patientsWithTimelines: List[Dict[str, Any]]
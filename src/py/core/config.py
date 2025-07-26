"""
Configuration management for Lead DBS Programmer FastAPI Backend
"""

from pydantic_settings import BaseSettings
from pathlib import Path
import os
from typing import Optional

class Settings(BaseSettings):
    """Application settings"""
    
    # Server configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Application paths
    APP_NAME: str = "Lead DBS Programmer"
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Optional[Path] = None
    USER_DATA_DIR: Optional[Path] = None
    
    # Lead DBS specific settings
    LEAD_DBS_PATH: Optional[str] = None
    DEFAULT_ELECTRODE_MODEL: str = "boston_vercise_directed"
    
    # File handling
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_EXTENSIONS: list = [".json", ".ply", ".nii", ".nii.gz", ".csv", ".xlsx"]
    
    # CORS settings
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Set default paths if not provided
        if self.USER_DATA_DIR is None:
            if os.name == 'nt':  # Windows
                self.USER_DATA_DIR = Path.home() / "AppData" / "Local" / self.APP_NAME
            else:  # macOS/Linux
                self.USER_DATA_DIR = Path.home() / ".lead-dbs-programmer"
        
        if self.DATA_DIR is None:
            self.DATA_DIR = self.USER_DATA_DIR / "data"
        
        # Ensure directories exist
        self.USER_DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.DATA_DIR.mkdir(parents=True, exist_ok=True)

# Global settings instance
settings = Settings()
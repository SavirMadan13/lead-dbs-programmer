/**
 * IPC Manager
 * 
 * This class handles all Inter-Process Communication (IPC) operations between
 * the main and renderer processes. It provides a centralized interface for
 * setting up IPC handlers and managing communication with proper error handling.
 */

import { ipcMain, dialog, shell } from 'electron';
import { Logger } from '../utils/Logger';
import { FileManager } from './FileManager';
import { AppError, FileOperationResult } from '../../types';

/**
 * IPC Manager class for handling all IPC operations
 */
export class IPCManager {
  private logger: Logger;
  private fileManager: FileManager;
  private isInitialized: boolean = false;

  constructor(logger: Logger, fileManager: FileManager) {
    this.logger = logger;
    this.fileManager = fileManager;
  }

  /**
   * Initialize the IPC manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('IPCManager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing IPCManager...');
      
      // Set up all IPC handlers
      this.setupFileHandlers();
      this.setupDataHandlers();
      this.setupDialogHandlers();
      this.setupUtilityHandlers();
      
      this.isInitialized = true;
      this.logger.info('IPCManager initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize IPCManager:', error);
      throw new AppError('IPC_MANAGER_INIT_FAILED', 'Failed to initialize IPCManager', error);
    }
  }

  /**
   * Cleanup IPC manager resources
   */
  public async cleanup(): Promise<void> {
    this.logger.info('Cleaning up IPCManager...');
    
    // Remove all IPC handlers
    ipcMain.removeAllListeners();
    
    this.isInitialized = false;
  }

  /**
   * Set up file-related IPC handlers
   */
  private setupFileHandlers(): void {
    // Select folder dialog
    ipcMain.handle('select-folder', async (): Promise<FileOperationResult<string>> => {
      try {
        this.logger.debug('Handling select-folder request');
        
        const result = await dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Select Lead-DBS or LeadGroup folder'
        });

        if (result.canceled || result.filePaths.length === 0) {
          return {
            success: false,
            error: 'No folder selected'
          };
        }

        const folderPath = result.filePaths[0];
        this.logger.info(`Selected folder: ${folderPath}`);
        
        return {
          success: true,
          data: folderPath
        };
        
      } catch (error) {
        this.logger.error('Error in select-folder handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Get saved directory
    ipcMain.handle('get-saved-directory', async (): Promise<FileOperationResult<string | null>> => {
      try {
        this.logger.debug('Handling get-saved-directory request');
        
        // This would typically read from a config file or user preferences
        // For now, return null to indicate no saved directory
        return {
          success: true,
          data: null
        };
        
      } catch (error) {
        this.logger.error('Error in get-saved-directory handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Save patients JSON
    ipcMain.handle('save-patients-json', async (event, directoryPath: string, patients: any[]): Promise<FileOperationResult<void>> => {
      try {
        this.logger.debug(`Handling save-patients-json request for directory: ${directoryPath}`);
        
        await this.fileManager.writePatientsData(directoryPath, patients);
        
        return {
          success: true
        };
        
      } catch (error) {
        this.logger.error('Error in save-patients-json handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Load patients JSON
    ipcMain.handle('load-patients-json', async (event, directoryPath: string): Promise<FileOperationResult<any[]>> => {
      try {
        this.logger.debug(`Handling load-patients-json request for directory: ${directoryPath}`);
        
        const patients = await this.fileManager.readPatientsData(directoryPath);
        
        return {
          success: true,
          data: patients
        };
        
      } catch (error) {
        this.logger.error('Error in load-patients-json handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Check if folder exists
    ipcMain.handle('check-folder-exists', async (event, folderPath: string): Promise<FileOperationResult<boolean>> => {
      try {
        this.logger.debug(`Handling check-folder-exists request for: ${folderPath}`);
        
        const exists = await this.fileManager.directoryExists(folderPath);
        
        return {
          success: true,
          data: exists
        };
        
      } catch (error) {
        this.logger.error('Error in check-folder-exists handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }

  /**
   * Set up data-related IPC handlers
   */
  private setupDataHandlers(): void {
    // Get stimulation data
    ipcMain.handle('get-stimulation-data', async (event, directoryPath: string, patientId: string, timeline: string, isLeadDBS: boolean = true): Promise<FileOperationResult<any>> => {
      try {
        this.logger.debug(`Handling get-stimulation-data request for patient: ${patientId}, timeline: ${timeline}`);
        
        const data = await this.fileManager.readStimulationParameters(directoryPath, patientId, timeline, isLeadDBS);
        
        return {
          success: true,
          data: data
        };
        
      } catch (error) {
        this.logger.error('Error in get-stimulation-data handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Save stimulation data
    ipcMain.handle('save-stimulation-data', async (event, directoryPath: string, patientId: string, timeline: string, data: any, isLeadDBS: boolean = true): Promise<FileOperationResult<void>> => {
      try {
        this.logger.debug(`Handling save-stimulation-data request for patient: ${patientId}, timeline: ${timeline}`);
        
        await this.fileManager.writeStimulationParameters(directoryPath, patientId, timeline, data, isLeadDBS);
        
        return {
          success: true
        };
        
      } catch (error) {
        this.logger.error('Error in save-stimulation-data handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Get timelines
    ipcMain.handle('get-timelines', async (event, directoryPath: string, patientId: string, isLeadDBS: boolean = true): Promise<FileOperationResult<Array<{ timeline: string; hasClinical: boolean; hasStimulation: boolean }>>> => {
      try {
        this.logger.debug(`Handling get-timelines request for patient: ${patientId}`);
        
        const timelines = await this.fileManager.getPatientTimelines(directoryPath, patientId, isLeadDBS);
        
        return {
          success: true,
          data: timelines
        };
        
      } catch (error) {
        this.logger.error('Error in get-timelines handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Get clinical scores
    ipcMain.handle('get-clinical-scores', async (event, directoryPath: string, patientId: string, timeline: string, isLeadDBS: boolean = true): Promise<FileOperationResult<any>> => {
      try {
        this.logger.debug(`Handling get-clinical-scores request for patient: ${patientId}, timeline: ${timeline}`);
        
        const scores = await this.fileManager.readClinicalScores(directoryPath, patientId, timeline, isLeadDBS);
        
        return {
          success: true,
          data: scores
        };
        
      } catch (error) {
        this.logger.error('Error in get-clinical-scores handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Save clinical scores
    ipcMain.handle('save-clinical-scores', async (event, directoryPath: string, patientId: string, timeline: string, scoreType: string, data: any, isLeadDBS: boolean = true): Promise<FileOperationResult<void>> => {
      try {
        this.logger.debug(`Handling save-clinical-scores request for patient: ${patientId}, timeline: ${timeline}, scoreType: ${scoreType}`);
        
        await this.fileManager.writeClinicalScores(directoryPath, patientId, timeline, scoreType, data, isLeadDBS);
        
        return {
          success: true
        };
        
      } catch (error) {
        this.logger.error('Error in save-clinical-scores handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }

  /**
   * Set up dialog-related IPC handlers
   */
  private setupDialogHandlers(): void {
    // Show error dialog
    ipcMain.handle('show-error-dialog', async (event, title: string, content: string): Promise<void> => {
      try {
        this.logger.debug(`Showing error dialog: ${title}`);
        
        await dialog.showErrorBox(title, content);
        
      } catch (error) {
        this.logger.error('Error in show-error-dialog handler:', error);
      }
    });

    // Show info dialog
    ipcMain.handle('show-info-dialog', async (event, title: string, content: string): Promise<void> => {
      try {
        this.logger.debug(`Showing info dialog: ${title}`);
        
        await dialog.showMessageBox({
          type: 'info',
          title: title,
          message: content
        });
        
      } catch (error) {
        this.logger.error('Error in show-info-dialog handler:', error);
      }
    });

    // Show confirmation dialog
    ipcMain.handle('show-confirmation-dialog', async (event, title: string, content: string): Promise<FileOperationResult<boolean>> => {
      try {
        this.logger.debug(`Showing confirmation dialog: ${title}`);
        
        const result = await dialog.showMessageBox({
          type: 'question',
          title: title,
          message: content,
          buttons: ['Yes', 'No'],
          defaultId: 0,
          cancelId: 1
        });
        
        return {
          success: true,
          data: result.response === 0
        };
        
      } catch (error) {
        this.logger.error('Error in show-confirmation-dialog handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }

  /**
   * Set up utility IPC handlers
   */
  private setupUtilityHandlers(): void {
    // Open external URL
    ipcMain.handle('open-external-url', async (event, url: string): Promise<FileOperationResult<void>> => {
      try {
        this.logger.debug(`Opening external URL: ${url}`);
        
        await shell.openExternal(url);
        
        return {
          success: true
        };
        
      } catch (error) {
        this.logger.error('Error in open-external-url handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Get app version
    ipcMain.handle('get-app-version', async (): Promise<FileOperationResult<string>> => {
      try {
        this.logger.debug('Handling get-app-version request');
        
        const version = require('../../package.json').version;
        
        return {
          success: true,
          data: version
        };
        
      } catch (error) {
        this.logger.error('Error in get-app-version handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    // Get platform info
    ipcMain.handle('get-platform-info', async (): Promise<FileOperationResult<{ platform: string; arch: string; version: string }>> => {
      try {
        this.logger.debug('Handling get-platform-info request');
        
        const info = {
          platform: process.platform,
          arch: process.arch,
          version: process.version
        };
        
        return {
          success: true,
          data: info
        };
        
      } catch (error) {
        this.logger.error('Error in get-platform-info handler:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
  }
}
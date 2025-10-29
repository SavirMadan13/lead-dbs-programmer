/**
 * IPC Handlers
 * 
 * This module contains all IPC (Inter-Process Communication) handlers for the main process.
 * It provides a centralized interface for handling communication between the main and renderer processes.
 */

import { ipcMain, dialog, shell } from 'electron';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Logger } from '../utils/Logger';
import { FileManager } from '../core/FileManager';
import { DataManager } from '../core/DataManager';
import { AppError, FileOperationResult } from '../../types';

/**
 * IPC Handlers class for managing all IPC communication
 */
export class IPCHandlers {
  private logger: Logger;
  private fileManager: FileManager;
  private dataManager: DataManager;
  private isInitialized: boolean = false;

  constructor(logger: Logger, fileManager: FileManager, dataManager: DataManager) {
    this.logger = logger;
    this.fileManager = fileManager;
    this.dataManager = dataManager;
  }

  /**
   * Initialize the IPC handlers
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('IPCHandlers already initialized');
      return;
    }

    try {
      this.logger.info('Initializing IPC handlers...');
      
      // Set up all IPC handlers
      this.setupFileHandlers();
      this.setupDataHandlers();
      this.setupDialogHandlers();
      this.setupUtilityHandlers();
      this.setupLegacyHandlers();
      
      this.isInitialized = true;
      this.logger.info('IPC handlers initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize IPC handlers:', error);
      throw new AppError('IPC_HANDLERS_INIT_FAILED', 'Failed to initialize IPC handlers', error);
    }
  }

  /**
   * Cleanup IPC handlers
   */
  public async cleanup(): Promise<void> {
    this.logger.info('Cleaning up IPC handlers...');
    
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

  /**
   * Set up legacy IPC handlers for backward compatibility
   */
  private setupLegacyHandlers(): void {
    // Legacy file save handler
    ipcMain.on('save-file', async (event, file, data, historical) => {
      try {
        const { patient, timeline, directoryPath, leadDBS } = historical;
        
        if (!patient || !timeline || !directoryPath) {
          this.logger.error('Missing patient, timeline, or directoryPath');
          event.reply('file-save-error', 'Missing required parameters');
          return;
        }

        await this.fileManager.writeStimulationParameters(directoryPath, patient.id, timeline, data, leadDBS);
        
        event.reply('file-saved', 'File saved successfully');
        this.logger.info(`Data saved successfully for patient ${patient.id}, timeline ${timeline}`);
        
      } catch (error) {
        this.logger.error('Error in save-file handler:', error);
        event.reply('file-save-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy clinical file save handler
    ipcMain.on('save-file-clinical', async (event, data, historical, scoreType) => {
      try {
        const { patient, timeline, directoryPath, leadDBS } = historical;
        
        if (!patient || !timeline || !directoryPath) {
          this.logger.error('Missing patient, timeline, or directoryPath');
          event.reply('file-save-error', 'Missing required parameters');
          return;
        }

        await this.fileManager.writeClinicalScores(directoryPath, patient.id, timeline, scoreType, data, leadDBS);
        
        event.reply('file-saved', 'Clinical scores saved successfully');
        this.logger.info(`Clinical scores saved successfully for patient ${patient.id}, timeline ${timeline}`);
        
      } catch (error) {
        this.logger.error('Error in save-file-clinical handler:', error);
        event.reply('file-save-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy import file handler
    ipcMain.handle('import-file-2', async (event, directoryPath: string, patientId: string, timeline: string, isLeadDBS: boolean = true): Promise<any> => {
      try {
        this.logger.debug(`Handling import-file-2 request for patient: ${patientId}, timeline: ${timeline}`);
        
        const data = await this.fileManager.readStimulationParameters(directoryPath, patientId, timeline, isLeadDBS);
        return data;
        
      } catch (error) {
        this.logger.error('Error in import-file-2 handler:', error);
        throw error;
      }
    });

    // Legacy clinical import handler
    ipcMain.on('import-file-clinical', async (event, patientId: string, timeline: string, directoryPath: string, isLeadDBS: boolean = true) => {
      try {
        this.logger.debug(`Handling import-file-clinical request for patient: ${patientId}, timeline: ${timeline}`);
        
        const data = await this.fileManager.readClinicalScores(directoryPath, patientId, timeline, isLeadDBS);
        event.reply('import-file-clinical', data);
        
      } catch (error) {
        this.logger.error('Error in import-file-clinical handler:', error);
        event.reply('import-file-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy PLY file loader
    ipcMain.handle('load-ply-file', async (event, historical) => {
      try {
        const { patient, timeline, directoryPath, leadDBS } = historical;
        
        if (leadDBS) {
          const patientDir = this.getPatientDirectory(directoryPath, patient.id, leadDBS);
          const plyPath = path.join(patientDir, 'export', 'ply', 'combined_electrodes.ply');
          
          if (await this.fileManager.fileExists(plyPath)) {
            const data = await fs.readFile(plyPath);
            return data.buffer;
          }
        }
        
        return null;
        
      } catch (error) {
        this.logger.error('Error in load-ply-file handler:', error);
        return null;
      }
    });

    // Legacy anatomy PLY file loader
    ipcMain.handle('load-ply-file-anatomy', async (event, historical) => {
      try {
        const { patient, timeline, directoryPath, leadDBS } = historical;
        
        if (leadDBS) {
          const patientDir = this.getPatientDirectory(directoryPath, patient.id, leadDBS);
          const plyPath = path.join(patientDir, 'export', 'ply', 'anatomy.ply');
          
          if (await this.fileManager.fileExists(plyPath)) {
            const data = await fs.readFile(plyPath);
            return data.buffer;
          }
        }
        
        return null;
        
      } catch (error) {
        this.logger.error('Error in load-ply-file-anatomy handler:', error);
        return null;
      }
    });

    // Legacy visualization coordinates loader
    ipcMain.handle('load-vis-coords', async (event, historical) => {
      try {
        const { patient, timeline, directoryPath, leadDBS } = historical;
        
        if (leadDBS) {
          const patientDir = this.getPatientDirectory(directoryPath, patient.id, leadDBS);
          const coordsPath = path.join(patientDir, `${patient.id}_desc-reconstruction.json`);
          
          if (await this.fileManager.fileExists(coordsPath)) {
            const data = await this.fileManager.readJSONFile(coordsPath);
            return data;
          }
        }
        
        return null;
        
      } catch (error) {
        this.logger.error('Error in load-vis-coords handler:', error);
        return null;
      }
    });

    // Legacy file reader
    ipcMain.handle('file-reader', async () => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openDirectory']
        });
        
        return result.canceled ? null : result.filePaths[0];
        
      } catch (error) {
        this.logger.error('Error in file-reader handler:', error);
        return null;
      }
    });

    // Legacy batch import handler
    ipcMain.on('batch-import', async (event, data, isLeadDBS: boolean = true) => {
      try {
        this.logger.debug('Handling batch-import request');
        
        const stimulationData = this.dataManager.getData('stimulationData');
        const directoryPath = stimulationData?.filepath || stimulationData?.path;
        
        if (!directoryPath) {
          throw new Error('No directory path available');
        }

        for (const key of Object.keys(data)) {
          const { id, timeline, scores } = data[key];
          const scoreType = scores['Score Type'];
          delete scores['Score Type'];
          
          await this.fileManager.writeClinicalScores(directoryPath, id.trim(), timeline, scoreType, scores, isLeadDBS);
        }
        
        event.reply('batch-import', 'success');
        this.logger.info('Batch import completed successfully');
        
      } catch (error) {
        this.logger.error('Error in batch-import handler:', error);
        event.reply('batch-import-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy batch import stimulation handler
    ipcMain.on('batch-import-stimulation', async (event, data, isLeadDBS: boolean = true) => {
      try {
        this.logger.debug('Handling batch-import-stimulation request');
        
        const stimulationData = this.dataManager.getData('stimulationData');
        const directoryPath = stimulationData?.filepath || stimulationData?.path;
        
        if (!directoryPath) {
          throw new Error('No directory path available');
        }

        for (const key of Object.keys(data)) {
          const { id, S, timeline } = data[key];
          
          await this.fileManager.writeStimulationParameters(directoryPath, id, timeline, { S }, isLeadDBS);
        }
        
        event.reply('batch-import-stimulation', 'success');
        this.logger.info('Batch import stimulation completed successfully');
        
      } catch (error) {
        this.logger.error('Error in batch-import-stimulation handler:', error);
        event.reply('batch-import-stimulation-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy clinical scores types handler
    ipcMain.handle('get-clinical-scores-types', async (event, text: string) => {
      try {
        this.logger.debug('Handling get-clinical-scores-types request');
        
        const userDataPath = require('electron').app.getPath('userData');
        const scoresFilePath = path.join(userDataPath, 'ClinicalScores.json');
        
        const data = await fs.readFile(scoresFilePath, 'utf8');
        const scores = JSON.parse(data);
        
        return scores;
        
      } catch (error) {
        this.logger.error('Error in get-clinical-scores-types handler:', error);
        return null;
      }
    });

    // Legacy add score type handler
    ipcMain.on('add-score-type', async (event, name: string, newScore: any) => {
      try {
        this.logger.debug(`Handling add-score-type request for: ${name}`);
        
        const userDataPath = require('electron').app.getPath('userData');
        const scoresFilePath = path.join(userDataPath, 'ClinicalScores.json');
        
        const data = await fs.readFile(scoresFilePath, 'utf8');
        const scores = JSON.parse(data);
        
        scores[name] = newScore[name];
        
        await fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2));
        
        this.logger.info(`Added new score type: ${name}`);
        
      } catch (error) {
        this.logger.error('Error in add-score-type handler:', error);
      }
    });

    // Legacy participants handler
    ipcMain.handle('get-participants', async (event, text: string) => {
      try {
        this.logger.debug('Handling get-participants request');
        
        const stimulationData = this.dataManager.getData('stimulationData');
        const userDataPath = stimulationData?.path;
        
        if (!userDataPath) {
          throw new Error('No data path available');
        }
        
        const participantsFilePath = path.join(userDataPath, 'participants.json');
        const data = await fs.readFile(participantsFilePath, 'utf8');
        const participants = JSON.parse(data);
        
        return participants;
        
      } catch (error) {
        this.logger.error('Error in get-participants handler:', error);
        return null;
      }
    });

    // Legacy file read handler
    ipcMain.handle('read-file', async (event, filePath: string) => {
      try {
        this.logger.debug(`Handling read-file request for: ${filePath}`);
        
        const data = await fs.readFile(filePath);
        return data.buffer;
        
      } catch (error) {
        this.logger.error('Error in read-file handler:', error);
        throw error;
      }
    });

    // Legacy miniset creation handler
    ipcMain.on('create-miniset', async (event, folderPath: string, selectedPatients: string[]) => {
      try {
        this.logger.debug(`Handling create-miniset request for ${selectedPatients.length} patients`);
        
        const stimulationData = this.dataManager.getData('stimulationData');
        const userDataPath = stimulationData?.path;
        
        if (!userDataPath) {
          throw new Error('No data path available');
        }
        
        const uniqueFolderName = `miniset_${Date.now()}`;
        
        for (const patientId of selectedPatients) {
          const patientFolder = path.join(userDataPath, 'derivatives', 'leaddbs', patientId);
          const rawdataFolder = path.join(userDataPath, 'rawdata', patientId);
          const newPatientFolder = path.join(folderPath, uniqueFolderName, 'derivatives', 'leaddbs', patientId);
          const newRawdataFolder = path.join(folderPath, uniqueFolderName, 'rawdata', patientId);
          
          // Ensure directories exist
          await fs.mkdir(newPatientFolder, { recursive: true });
          await fs.mkdir(newRawdataFolder, { recursive: true });
          
          // Copy subfolders
          const subfolders = ['clinical', 'stimulations', 'reconstruction'];
          
          for (const subfolder of subfolders) {
            const srcFolder = path.join(patientFolder, subfolder);
            const destFolder = path.join(newPatientFolder, subfolder);
            
            if (await this.fileManager.directoryExists(srcFolder)) {
              try {
                if (process.platform === 'win32') {
                  execSync(`xcopy "${srcFolder}" "${destFolder}" /E /I /Y`);
                } else {
                  execSync(`cp -R "${srcFolder}/." "${destFolder}/"`);
                }
                this.logger.debug(`Copied ${subfolder} data to: ${destFolder}`);
              } catch (error) {
                this.logger.error(`Error copying ${subfolder} directory:`, error);
              }
            }
          }
          
          // Copy raw data
          const rawSrcFile = path.join(rawdataFolder, 'ses-preop', 'anat', `${patientId}_ses-preop_acq-iso_T1w.nii.gz`);
          const rawDestFile = path.join(newRawdataFolder, `${patientId}_ses-preop_acq-iso_T1w.nii.gz`);
          
          if (await this.fileManager.fileExists(rawSrcFile)) {
            await fs.mkdir(newRawdataFolder, { recursive: true });
            await fs.copyFile(rawSrcFile, rawDestFile);
          }
        }
        
        this.logger.info(`Miniset created successfully: ${uniqueFolderName}`);
        
      } catch (error) {
        this.logger.error('Error in create-miniset handler:', error);
      }
    });

    // Legacy download clinical data handler
    ipcMain.on('download-clinical-data', async (event, clinicalData: any) => {
      try {
        this.logger.debug('Handling download-clinical-data request');
        
        const filePath = path.join(require('os').homedir(), 'Downloads', 'allClinicalScores.json');
        const dataString = JSON.stringify(clinicalData, null, 2);
        
        await fs.writeFile(filePath, dataString);
        
        event.reply('download-clinical-data-success', filePath);
        this.logger.info(`Clinical data saved successfully to ${filePath}`);
        
      } catch (error) {
        this.logger.error('Error in download-clinical-data handler:', error);
        event.reply('download-clinical-data-error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    // Legacy clinical data for plotting handler
    ipcMain.handle('get-clinical-data-for-plotting', async (event, message: any) => {
      try {
        this.logger.debug('Handling get-clinical-data-for-plotting request');
        
        const clinicalDataPath = path.join(require('os').homedir(), 'Downloads', 'allClinicalScores.json');
        const data = await fs.readFile(clinicalDataPath, 'utf8');
        const clinicalData = JSON.parse(data);
        
        return clinicalData;
        
      } catch (error) {
        this.logger.error('Error in get-clinical-data-for-plotting handler:', error);
        return null;
      }
    });
  }

  /**
   * Get patient directory path based on the directory structure type
   */
  private getPatientDirectory(directoryPath: string, patientId: string, isLeadDBS: boolean): string {
    if (isLeadDBS) {
      return path.join(directoryPath, 'derivatives', 'leaddbs', patientId, 'clinical');
    } else {
      return path.join(directoryPath, `sub-${patientId}`);
    }
  }
}

/**
 * Default export function for backward compatibility
 */
export default function registerFileHandlers(): void {
  // This function is kept for backward compatibility
  // The actual registration is now handled by the IPCHandlers class
  console.warn('registerFileHandlers() is deprecated. Use IPCHandlers class instead.');
}
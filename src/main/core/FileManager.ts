/**
 * File Manager
 * 
 * This class handles all file system operations including reading, writing,
 * and managing patient data files, configuration files, and other application data.
 * It provides a centralized interface for file operations with proper error handling.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import { app } from 'electron';
import { Patient, StimulationData, ClinicalScores, FileOperationResult, AppError } from '../../types';
import { Logger } from '../utils/Logger';

/**
 * File Manager class for handling all file operations
 */
export class FileManager {
  private logger: Logger;
  private userDataPath: string;
  private isInitialized: boolean = false;

  constructor(logger: Logger) {
    this.logger = logger;
    this.userDataPath = app.getPath('userData');
  }

  /**
   * Initialize the file manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('FileManager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing FileManager...');
      
      // Ensure user data directory exists
      await this.ensureDirectoryExists(this.userDataPath);
      
      // Ensure clinical scores file exists
      await this.ensureClinicalScoresFile();
      
      this.isInitialized = true;
      this.logger.info('FileManager initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize FileManager:', error);
      throw new AppError('FILE_MANAGER_INIT_FAILED', 'Failed to initialize FileManager', error);
    }
  }

  /**
   * Cleanup file manager resources
   */
  public async cleanup(): Promise<void> {
    this.logger.info('Cleaning up FileManager...');
    // Add any cleanup logic here if needed
  }

  /**
   * Read a JSON file and parse it
   */
  public async readJSONFile<T = any>(filePath: string): Promise<T> {
    try {
      this.logger.debug(`Reading JSON file: ${filePath}`);
      
      if (!await this.fileExists(filePath)) {
        throw new AppError('FILE_NOT_FOUND', `File not found: ${filePath}`);
      }

      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      this.logger.debug(`Successfully read JSON file: ${filePath}`);
      return parsed;
      
    } catch (error) {
      this.logger.error(`Failed to read JSON file ${filePath}:`, error);
      throw new AppError('FILE_READ_ERROR', `Failed to read JSON file: ${filePath}`, error);
    }
  }

  /**
   * Write data to a JSON file
   */
  public async writeJSONFile<T = any>(filePath: string, data: T): Promise<void> {
    try {
      this.logger.debug(`Writing JSON file: ${filePath}`);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      await this.ensureDirectoryExists(dir);
      
      // Write file
      const jsonString = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonString, 'utf8');
      
      this.logger.debug(`Successfully wrote JSON file: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Failed to write JSON file ${filePath}:`, error);
      throw new AppError('FILE_WRITE_ERROR', `Failed to write JSON file: ${filePath}`, error);
    }
  }

  /**
   * Read patients data from a directory
   */
  public async readPatientsData(directoryPath: string): Promise<Patient[]> {
    try {
      this.logger.debug(`Reading patients data from: ${directoryPath}`);
      
      const participantsPath = path.join(directoryPath, 'participants.json');
      
      if (!await this.fileExists(participantsPath)) {
        this.logger.warn(`Participants file not found: ${participantsPath}`);
        return [];
      }

      const patients = await this.readJSONFile<Patient[]>(participantsPath);
      this.logger.debug(`Successfully read ${patients.length} patients`);
      
      return patients;
      
    } catch (error) {
      this.logger.error(`Failed to read patients data from ${directoryPath}:`, error);
      throw new AppError('PATIENTS_READ_ERROR', `Failed to read patients data: ${directoryPath}`, error);
    }
  }

  /**
   * Write patients data to a directory
   */
  public async writePatientsData(directoryPath: string, patients: Patient[]): Promise<void> {
    try {
      this.logger.debug(`Writing patients data to: ${directoryPath}`);
      
      const participantsPath = path.join(directoryPath, 'participants.json');
      await this.writeJSONFile(participantsPath, patients);
      
      this.logger.debug(`Successfully wrote ${patients.length} patients`);
      
    } catch (error) {
      this.logger.error(`Failed to write patients data to ${directoryPath}:`, error);
      throw new AppError('PATIENTS_WRITE_ERROR', `Failed to write patients data: ${directoryPath}`, error);
    }
  }

  /**
   * Read stimulation parameters for a patient and timeline
   */
  public async readStimulationParameters(
    directoryPath: string,
    patientId: string,
    timeline: string,
    isLeadDBS: boolean = true
  ): Promise<any> {
    try {
      this.logger.debug(`Reading stimulation parameters for patient ${patientId}, timeline ${timeline}`);
      
      const patientDir = this.getPatientDirectory(directoryPath, patientId, isLeadDBS);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      
      const fileName = isLeadDBS 
        ? `${patientId}_ses-${timeline}_stimparameters.json`
        : `sub-${patientId}_ses-${timeline}_stim.json`;
      
      const filePath = path.join(sessionDir, fileName);
      
      if (!await this.fileExists(filePath)) {
        throw new AppError('STIMULATION_FILE_NOT_FOUND', `Stimulation file not found: ${filePath}`);
      }

      const data = await this.readJSONFile(filePath);
      this.logger.debug(`Successfully read stimulation parameters for ${patientId}`);
      
      return data;
      
    } catch (error) {
      this.logger.error(`Failed to read stimulation parameters for ${patientId}:`, error);
      throw new AppError('STIMULATION_READ_ERROR', `Failed to read stimulation parameters: ${patientId}`, error);
    }
  }

  /**
   * Write stimulation parameters for a patient and timeline
   */
  public async writeStimulationParameters(
    directoryPath: string,
    patientId: string,
    timeline: string,
    data: any,
    isLeadDBS: boolean = true
  ): Promise<void> {
    try {
      this.logger.debug(`Writing stimulation parameters for patient ${patientId}, timeline ${timeline}`);
      
      const patientDir = this.getPatientDirectory(directoryPath, patientId, isLeadDBS);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      
      // Ensure session directory exists
      await this.ensureDirectoryExists(sessionDir);
      
      const fileName = isLeadDBS 
        ? `${patientId}_ses-${timeline}_stimparameters.json`
        : `sub-${patientId}_ses-${timeline}_stim.json`;
      
      const filePath = path.join(sessionDir, fileName);
      await this.writeJSONFile(filePath, data);
      
      this.logger.debug(`Successfully wrote stimulation parameters for ${patientId}`);
      
    } catch (error) {
      this.logger.error(`Failed to write stimulation parameters for ${patientId}:`, error);
      throw new AppError('STIMULATION_WRITE_ERROR', `Failed to write stimulation parameters: ${patientId}`, error);
    }
  }

  /**
   * Read clinical scores for a patient and timeline
   */
  public async readClinicalScores(
    directoryPath: string,
    patientId: string,
    timeline: string,
    isLeadDBS: boolean = true
  ): Promise<ClinicalScores> {
    try {
      this.logger.debug(`Reading clinical scores for patient ${patientId}, timeline ${timeline}`);
      
      const patientDir = this.getPatientDirectory(directoryPath, patientId, isLeadDBS);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      
      const fileName = isLeadDBS 
        ? `${patientId}_ses-${timeline}_clinical.json`
        : `sub-${patientId}_ses-${timeline}_clinical.json`;
      
      const filePath = path.join(sessionDir, fileName);
      
      if (!await this.fileExists(filePath)) {
        this.logger.warn(`Clinical scores file not found: ${filePath}`);
        return {};
      }

      const data = await this.readJSONFile<ClinicalScores>(filePath);
      this.logger.debug(`Successfully read clinical scores for ${patientId}`);
      
      return data;
      
    } catch (error) {
      this.logger.error(`Failed to read clinical scores for ${patientId}:`, error);
      throw new AppError('CLINICAL_READ_ERROR', `Failed to read clinical scores: ${patientId}`, error);
    }
  }

  /**
   * Write clinical scores for a patient and timeline
   */
  public async writeClinicalScores(
    directoryPath: string,
    patientId: string,
    timeline: string,
    scoreType: string,
    data: any,
    isLeadDBS: boolean = true
  ): Promise<void> {
    try {
      this.logger.debug(`Writing clinical scores for patient ${patientId}, timeline ${timeline}`);
      
      const patientDir = this.getPatientDirectory(directoryPath, patientId, isLeadDBS);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      
      // Ensure session directory exists
      await this.ensureDirectoryExists(sessionDir);
      
      const fileName = isLeadDBS 
        ? `${patientId}_ses-${timeline}_clinical.json`
        : `sub-${patientId}_ses-${timeline}_clinical.json`;
      
      const filePath = path.join(sessionDir, fileName);
      
      // Read existing data if file exists
      let existingData: ClinicalScores = {};
      if (await this.fileExists(filePath)) {
        existingData = await this.readJSONFile<ClinicalScores>(filePath);
      }
      
      // Update with new data
      existingData[scoreType] = data;
      
      await this.writeJSONFile(filePath, existingData);
      
      this.logger.debug(`Successfully wrote clinical scores for ${patientId}`);
      
    } catch (error) {
      this.logger.error(`Failed to write clinical scores for ${patientId}:`, error);
      throw new AppError('CLINICAL_WRITE_ERROR', `Failed to write clinical scores: ${patientId}`, error);
    }
  }

  /**
   * Get available timelines for a patient
   */
  public async getPatientTimelines(
    directoryPath: string,
    patientId: string,
    isLeadDBS: boolean = true
  ): Promise<Array<{ timeline: string; hasClinical: boolean; hasStimulation: boolean }>> {
    try {
      this.logger.debug(`Getting timelines for patient ${patientId}`);
      
      const patientDir = this.getPatientDirectory(directoryPath, patientId, isLeadDBS);
      
      if (!await this.directoryExists(patientDir)) {
        this.logger.warn(`Patient directory not found: ${patientDir}`);
        return [];
      }

      const entries = await fs.readdir(patientDir, { withFileTypes: true });
      const sessionDirs = entries
        .filter(entry => entry.isDirectory() && entry.name.startsWith('ses-'))
        .map(entry => entry.name);

      const timelines = await Promise.all(
        sessionDirs.map(async (sessionDir) => {
          const sessionPath = path.join(patientDir, sessionDir);
          const files = await fs.readdir(sessionPath);
          
          const timeline = sessionDir.replace('ses-', '');
          const hasClinical = files.some(file => file.includes('clinical.json'));
          const hasStimulation = files.some(file => 
            file.includes('stimparameters.json') || file.includes('stim.json')
          );

          return { timeline, hasClinical, hasStimulation };
        })
      );

      this.logger.debug(`Found ${timelines.length} timelines for patient ${patientId}`);
      return timelines;
      
    } catch (error) {
      this.logger.error(`Failed to get timelines for patient ${patientId}:`, error);
      throw new AppError('TIMELINES_READ_ERROR', `Failed to get timelines: ${patientId}`, error);
    }
  }

  /**
   * Check if a file exists
   */
  public async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a directory exists
   */
  public async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Ensure a directory exists, creating it if necessary
   */
  public async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create directory ${dirPath}:`, error);
      throw new AppError('DIRECTORY_CREATE_ERROR', `Failed to create directory: ${dirPath}`, error);
    }
  }

  /**
   * Get the patient directory path based on the directory structure type
   */
  private getPatientDirectory(directoryPath: string, patientId: string, isLeadDBS: boolean): string {
    if (isLeadDBS) {
      return path.join(directoryPath, 'derivatives', 'leaddbs', patientId, 'clinical');
    } else {
      return path.join(directoryPath, `sub-${patientId}`);
    }
  }

  /**
   * Ensure the clinical scores file exists with default content
   */
  private async ensureClinicalScoresFile(): Promise<void> {
    const scoresFilePath = path.join(this.userDataPath, 'ClinicalScores.json');
    
    if (await this.fileExists(scoresFilePath)) {
      return;
    }

    const defaultScores: ClinicalScores = {
      UPDRS: {
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
        '3.8b: Leg agility- Left leg': 0,
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
    };

    await this.writeJSONFile(scoresFilePath, defaultScores);
    this.logger.info('Created default ClinicalScores.json file');
  }
}
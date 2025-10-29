/**
 * Helper Functions
 * 
 * This module contains utility functions for file operations, path management,
 * and other common tasks used throughout the application. These functions
 * provide a clean interface for common operations with proper error handling.
 */

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import { Logger } from '../utils/Logger';
import { AppError } from '../../types';

/**
 * Helper Functions class for managing utility operations
 */
export class HelperFunctions {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Get the patient's folder path based on the directory structure type
   * @param directoryPath - The base directory path
   * @param patientId - The unique identifier for the patient
   * @param isLeadDBS - Boolean indicating whether LeadDBS mode is enabled
   * @returns The constructed patient folder path
   */
  public getPatientFolder(
    directoryPath: string,
    patientId: string,
    isLeadDBS: boolean
  ): string {
    try {
      this.logger.debug(`Getting patient folder for: ${patientId}, LeadDBS: ${isLeadDBS}`);

      if (isLeadDBS) {
        return path.join(directoryPath, 'derivatives', 'leaddbs', patientId, 'clinical');
      } else {
        return path.join(directoryPath, `sub-${patientId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to get patient folder for ${patientId}:`, error);
      throw new AppError('PATIENT_FOLDER_ERROR', `Failed to get patient folder: ${patientId}`, error);
    }
  }

  /**
   * Get the patient's PLY folder path for 3D visualization files
   * @param directoryPath - The base directory path
   * @param patientId - The unique identifier for the patient
   * @param isLeadDBS - Boolean indicating whether LeadDBS mode is enabled
   * @returns The constructed patient PLY folder path
   */
  public getPatientFolderPly(
    directoryPath: string,
    patientId: string,
    isLeadDBS: boolean
  ): string {
    try {
      this.logger.debug(`Getting patient PLY folder for: ${patientId}, LeadDBS: ${isLeadDBS}`);

      if (isLeadDBS) {
        return path.join(directoryPath, 'derivatives', 'leaddbs', patientId);
      } else {
        return path.join(directoryPath, `sub-${patientId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to get patient PLY folder for ${patientId}:`, error);
      throw new AppError('PATIENT_PLY_FOLDER_ERROR', `Failed to get patient PLY folder: ${patientId}`, error);
    }
  }

  /**
   * Read and parse a JSON file
   * @param filePath - The path to the JSON file
   * @returns The parsed JSON data or null if error
   */
  public async readJSON<T = any>(filePath: string): Promise<T | null> {
    try {
      this.logger.debug(`Reading JSON file: ${filePath}`);
      
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      this.logger.debug(`Successfully read JSON file: ${filePath}`);
      return parsed;
      
    } catch (error) {
      this.logger.error(`Failed to read JSON file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Read and parse a JSON file synchronously
   * @param filePath - The path to the JSON file
   * @returns The parsed JSON data or null if error
   */
  public readJSONSync<T = any>(filePath: string): T | null {
    try {
      this.logger.debug(`Reading JSON file synchronously: ${filePath}`);
      
      const data = fsSync.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      this.logger.debug(`Successfully read JSON file: ${filePath}`);
      return parsed;
      
    } catch (error) {
      this.logger.error(`Failed to read JSON file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Write data to a JSON file
   * @param filePath - The path to the JSON file
   * @param data - The data to write
   * @param prettyPrint - Whether to format the JSON with indentation
   */
  public async writeJSON<T = any>(
    filePath: string,
    data: T,
    prettyPrint: boolean = true
  ): Promise<void> {
    try {
      this.logger.debug(`Writing JSON file: ${filePath}`);
      
      const jsonString = prettyPrint 
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      
      await fs.writeFile(filePath, jsonString, 'utf8');
      
      this.logger.debug(`Successfully wrote JSON file: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Failed to write JSON file ${filePath}:`, error);
      throw new AppError('JSON_WRITE_ERROR', `Failed to write JSON file: ${filePath}`, error);
    }
  }

  /**
   * Write data to a JSON file synchronously
   * @param filePath - The path to the JSON file
   * @param data - The data to write
   * @param prettyPrint - Whether to format the JSON with indentation
   */
  public writeJSONSync<T = any>(
    filePath: string,
    data: T,
    prettyPrint: boolean = true
  ): void {
    try {
      this.logger.debug(`Writing JSON file synchronously: ${filePath}`);
      
      const jsonString = prettyPrint 
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);
      
      fsSync.writeFileSync(filePath, jsonString, 'utf8');
      
      this.logger.debug(`Successfully wrote JSON file: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Failed to write JSON file ${filePath}:`, error);
      throw new AppError('JSON_WRITE_ERROR', `Failed to write JSON file: ${filePath}`, error);
    }
  }

  /**
   * Check if a file exists
   * @param filePath - The path to the file
   * @returns True if the file exists, false otherwise
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
   * Check if a file exists synchronously
   * @param filePath - The path to the file
   * @returns True if the file exists, false otherwise
   */
  public fileExistsSync(filePath: string): boolean {
    return fsSync.existsSync(filePath);
  }

  /**
   * Check if a directory exists
   * @param dirPath - The path to the directory
   * @returns True if the directory exists, false otherwise
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
   * Check if a directory exists synchronously
   * @param dirPath - The path to the directory
   * @returns True if the directory exists, false otherwise
   */
  public directoryExistsSync(dirPath: string): boolean {
    try {
      const stat = fsSync.statSync(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Ensure a directory exists, creating it if necessary
   * @param dirPath - The path to the directory
   * @param recursive - Whether to create parent directories recursively
   */
  public async ensureDirectoryExists(dirPath: string, recursive: boolean = true): Promise<void> {
    try {
      this.logger.debug(`Ensuring directory exists: ${dirPath}`);
      
      await fs.mkdir(dirPath, { recursive });
      
      this.logger.debug(`Directory ensured: ${dirPath}`);
      
    } catch (error) {
      this.logger.error(`Failed to ensure directory exists ${dirPath}:`, error);
      throw new AppError('DIRECTORY_CREATE_ERROR', `Failed to create directory: ${dirPath}`, error);
    }
  }

  /**
   * Ensure a directory exists synchronously, creating it if necessary
   * @param dirPath - The path to the directory
   * @param recursive - Whether to create parent directories recursively
   */
  public ensureDirectoryExistsSync(dirPath: string, recursive: boolean = true): void {
    try {
      this.logger.debug(`Ensuring directory exists synchronously: ${dirPath}`);
      
      fsSync.mkdirSync(dirPath, { recursive });
      
      this.logger.debug(`Directory ensured: ${dirPath}`);
      
    } catch (error) {
      this.logger.error(`Failed to ensure directory exists ${dirPath}:`, error);
      throw new AppError('DIRECTORY_CREATE_ERROR', `Failed to create directory: ${dirPath}`, error);
    }
  }

  /**
   * Get the relative path between two paths
   * @param basePath - The base directory path
   * @param targetPath - The target directory or file path
   * @returns The relative path between the base and target
   */
  public getRelativePath(basePath: string, targetPath: string): string {
    try {
      this.logger.debug(`Getting relative path from ${basePath} to ${targetPath}`);
      
      const relativePath = path.relative(basePath, targetPath);
      
      this.logger.debug(`Relative path: ${relativePath}`);
      return relativePath;
      
    } catch (error) {
      this.logger.error(`Failed to get relative path from ${basePath} to ${targetPath}:`, error);
      throw new AppError('RELATIVE_PATH_ERROR', 'Failed to get relative path', error);
    }
  }

  /**
   * Get the absolute path from a relative path
   * @param basePath - The base directory path
   * @param relativePath - The relative path
   * @returns The absolute path
   */
  public getAbsolutePath(basePath: string, relativePath: string): string {
    try {
      this.logger.debug(`Getting absolute path from ${basePath} + ${relativePath}`);
      
      const absolutePath = path.resolve(basePath, relativePath);
      
      this.logger.debug(`Absolute path: ${absolutePath}`);
      return absolutePath;
      
    } catch (error) {
      this.logger.error(`Failed to get absolute path from ${basePath} + ${relativePath}:`, error);
      throw new AppError('ABSOLUTE_PATH_ERROR', 'Failed to get absolute path', error);
    }
  }

  /**
   * Check if a file exists in a directory
   * @param directoryPath - The directory to search in
   * @param fileName - The name of the file to check
   * @returns True if the file exists, false otherwise
   */
  public async fileExistsInDirectory(
    directoryPath: string,
    fileName: string
  ): Promise<boolean> {
    try {
      const fullPath = path.join(directoryPath, fileName);
      return await this.fileExists(fullPath);
    } catch (error) {
      this.logger.error(`Failed to check if file exists in directory ${directoryPath}:`, error);
      return false;
    }
  }

  /**
   * Check if a file exists in a directory synchronously
   * @param directoryPath - The directory to search in
   * @param fileName - The name of the file to check
   * @returns True if the file exists, false otherwise
   */
  public fileExistsInDirectorySync(
    directoryPath: string,
    fileName: string
  ): boolean {
    try {
      const fullPath = path.join(directoryPath, fileName);
      return this.fileExistsSync(fullPath);
    } catch (error) {
      this.logger.error(`Failed to check if file exists in directory ${directoryPath}:`, error);
      return false;
    }
  }

  /**
   * Get all files in a directory
   * @param directoryPath - The directory to search in
   * @param extension - Optional file extension filter (e.g., '.json', '.txt')
   * @returns Array of file names
   */
  public async getFilesInDirectory(
    directoryPath: string,
    extension?: string
  ): Promise<string[]> {
    try {
      this.logger.debug(`Getting files in directory: ${directoryPath}`);
      
      const files = await fs.readdir(directoryPath);
      
      if (extension) {
        const filteredFiles = files.filter(file => file.endsWith(extension));
        this.logger.debug(`Found ${filteredFiles.length} files with extension ${extension}`);
        return filteredFiles;
      }
      
      this.logger.debug(`Found ${files.length} files`);
      return files;
      
    } catch (error) {
      this.logger.error(`Failed to get files in directory ${directoryPath}:`, error);
      return [];
    }
  }

  /**
   * Get all files in a directory synchronously
   * @param directoryPath - The directory to search in
   * @param extension - Optional file extension filter (e.g., '.json', '.txt')
   * @returns Array of file names
   */
  public getFilesInDirectorySync(
    directoryPath: string,
    extension?: string
  ): string[] {
    try {
      this.logger.debug(`Getting files in directory synchronously: ${directoryPath}`);
      
      const files = fsSync.readdirSync(directoryPath);
      
      if (extension) {
        const filteredFiles = files.filter(file => file.endsWith(extension));
        this.logger.debug(`Found ${filteredFiles.length} files with extension ${extension}`);
        return filteredFiles;
      }
      
      this.logger.debug(`Found ${files.length} files`);
      return files;
      
    } catch (error) {
      this.logger.error(`Failed to get files in directory ${directoryPath}:`, error);
      return [];
    }
  }

  /**
   * Copy a file from source to destination
   * @param sourcePath - The source file path
   * @param destPath - The destination file path
   */
  public async copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      this.logger.debug(`Copying file from ${sourcePath} to ${destPath}`);
      
      await fs.copyFile(sourcePath, destPath);
      
      this.logger.debug(`Successfully copied file to ${destPath}`);
      
    } catch (error) {
      this.logger.error(`Failed to copy file from ${sourcePath} to ${destPath}:`, error);
      throw new AppError('FILE_COPY_ERROR', `Failed to copy file: ${sourcePath}`, error);
    }
  }

  /**
   * Copy a file from source to destination synchronously
   * @param sourcePath - The source file path
   * @param destPath - The destination file path
   */
  public copyFileSync(sourcePath: string, destPath: string): void {
    try {
      this.logger.debug(`Copying file synchronously from ${sourcePath} to ${destPath}`);
      
      fsSync.copyFileSync(sourcePath, destPath);
      
      this.logger.debug(`Successfully copied file to ${destPath}`);
      
    } catch (error) {
      this.logger.error(`Failed to copy file from ${sourcePath} to ${destPath}:`, error);
      throw new AppError('FILE_COPY_ERROR', `Failed to copy file: ${sourcePath}`, error);
    }
  }

  /**
   * Delete a file
   * @param filePath - The path to the file to delete
   */
  public async deleteFile(filePath: string): Promise<void> {
    try {
      this.logger.debug(`Deleting file: ${filePath}`);
      
      await fs.unlink(filePath);
      
      this.logger.debug(`Successfully deleted file: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Failed to delete file ${filePath}:`, error);
      throw new AppError('FILE_DELETE_ERROR', `Failed to delete file: ${filePath}`, error);
    }
  }

  /**
   * Delete a file synchronously
   * @param filePath - The path to the file to delete
   */
  public deleteFileSync(filePath: string): void {
    try {
      this.logger.debug(`Deleting file synchronously: ${filePath}`);
      
      fsSync.unlinkSync(filePath);
      
      this.logger.debug(`Successfully deleted file: ${filePath}`);
      
    } catch (error) {
      this.logger.error(`Failed to delete file ${filePath}:`, error);
      throw new AppError('FILE_DELETE_ERROR', `Failed to delete file: ${filePath}`, error);
    }
  }

  /**
   * Get file statistics
   * @param filePath - The path to the file
   * @returns File statistics or null if error
   */
  public async getFileStats(filePath: string): Promise<fs.Stats | null> {
    try {
      this.logger.debug(`Getting file stats: ${filePath}`);
      
      const stats = await fs.stat(filePath);
      
      this.logger.debug(`Successfully got file stats: ${filePath}`);
      return stats;
      
    } catch (error) {
      this.logger.error(`Failed to get file stats ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Get file statistics synchronously
   * @param filePath - The path to the file
   * @returns File statistics or null if error
   */
  public getFileStatsSync(filePath: string): fs.Stats | null {
    try {
      this.logger.debug(`Getting file stats synchronously: ${filePath}`);
      
      const stats = fsSync.statSync(filePath);
      
      this.logger.debug(`Successfully got file stats: ${filePath}`);
      return stats;
      
    } catch (error) {
      this.logger.error(`Failed to get file stats ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Validate file path
   * @param filePath - The path to validate
   * @returns True if valid, false otherwise
   */
  public isValidFilePath(filePath: string): boolean {
    try {
      // Check if path is not empty and doesn't contain invalid characters
      if (!filePath || filePath.trim() === '') {
        return false;
      }

      // Check for null bytes or other invalid characters
      if (filePath.includes('\0')) {
        return false;
      }

      // Check if path is too long (Windows limit is 260 characters)
      if (filePath.length > 260) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Failed to validate file path ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Sanitize file name by removing invalid characters
   * @param fileName - The file name to sanitize
   * @returns The sanitized file name
   */
  public sanitizeFileName(fileName: string): string {
    try {
      this.logger.debug(`Sanitizing file name: ${fileName}`);
      
      // Remove or replace invalid characters
      let sanitized = fileName
        .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters with underscore
        .replace(/\s+/g, '_') // Replace spaces with underscore
        .replace(/_{2,}/g, '_') // Replace multiple underscores with single underscore
        .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
      
      // Ensure the name is not empty
      if (!sanitized || sanitized.trim() === '') {
        sanitized = 'untitled';
      }
      
      this.logger.debug(`Sanitized file name: ${sanitized}`);
      return sanitized;
      
    } catch (error) {
      this.logger.error(`Failed to sanitize file name ${fileName}:`, error);
      return 'untitled';
    }
  }
}

// Legacy function exports for backward compatibility
export function getPatientFolder(
  directoryPath: string,
  patientId: string,
  leadDBS: boolean
): string {
  const logger = new Logger('LegacyHelpers');
  const helpers = new HelperFunctions(logger);
  return helpers.getPatientFolder(directoryPath, patientId, leadDBS);
}

export function getPatientFolderPly(
  directoryPath: string,
  patientId: string,
  leadDBS: boolean
): string {
  const logger = new Logger('LegacyHelpers');
  const helpers = new HelperFunctions(logger);
  return helpers.getPatientFolderPly(directoryPath, patientId, leadDBS);
}

export function readJSON(filePath: string): any {
  const logger = new Logger('LegacyHelpers');
  const helpers = new HelperFunctions(logger);
  return helpers.readJSONSync(filePath);
}

export function exampleHelperFunction(param1: string, param2: number): string {
  return `Received ${param1} and ${param2}`;
}

export function getRelativePath(basePath: string, targetPath: string): string {
  const logger = new Logger('LegacyHelpers');
  const helpers = new HelperFunctions(logger);
  return helpers.getRelativePath(basePath, targetPath);
}

export function fileExistsInDirectory(
  directoryPath: string,
  fileName: string
): boolean {
  const logger = new Logger('LegacyHelpers');
  const helpers = new HelperFunctions(logger);
  return helpers.fileExistsInDirectorySync(directoryPath, fileName);
}
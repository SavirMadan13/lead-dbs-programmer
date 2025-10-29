/**
 * Logger Utility
 * 
 * This class provides centralized logging functionality for the application.
 * It supports different log levels, file output, and console output with
 * proper formatting and error handling.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';

/**
 * Log levels enum
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * Logger class for handling all logging operations
 */
export class Logger {
  private logLevel: LogLevel;
  private logToFile: boolean;
  private logFilePath: string;
  private maxLogFileSize: number;
  private maxLogFiles: number;
  private isInitialized: boolean = false;

  constructor(
    logLevel: LogLevel = LogLevel.INFO,
    logToFile: boolean = true,
    maxLogFileSize: number = 10 * 1024 * 1024, // 10MB
    maxLogFiles: number = 5
  ) {
    this.logLevel = logLevel;
    this.logToFile = logToFile;
    this.maxLogFileSize = maxLogFileSize;
    this.maxLogFiles = maxLogFiles;
    this.logFilePath = path.join(app.getPath('userData'), 'logs', 'app.log');
  }

  /**
   * Initialize the logger
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.warn('Logger already initialized');
      return;
    }

    try {
      // Ensure logs directory exists
      const logsDir = path.dirname(this.logFilePath);
      await fs.mkdir(logsDir, { recursive: true });

      // Log initialization
      this.info('Logger initialized successfully');
      this.info(`Log level: ${LogLevel[this.logLevel]}`);
      this.info(`Log to file: ${this.logToFile}`);
      this.info(`Log file path: ${this.logFilePath}`);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize logger:', error);
      throw error;
    }
  }

  /**
   * Set log level
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
    this.info(`Log level changed to: ${LogLevel[level]}`);
  }

  /**
   * Enable or disable file logging
   */
  public setLogToFile(enabled: boolean): void {
    this.logToFile = enabled;
    this.info(`File logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Log debug message
   */
  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Log info message
   */
  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Log warning message
   */
  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Log error message
   */
  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * Main logging method
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const formattedMessage = this.formatMessage(timestamp, levelName, message, ...args);

    // Console output
    this.logToConsole(level, formattedMessage);

    // File output
    if (this.logToFile) {
      this.logToFileAsync(formattedMessage);
    }
  }

  /**
   * Format log message
   */
  private formatMessage(timestamp: string, level: string, message: string, ...args: any[]): string {
    const argsString = args.length > 0 ? ' ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ') : '';
    
    return `[${timestamp}] [${level}] ${message}${argsString}`;
  }

  /**
   * Log to console
   */
  private logToConsole(level: LogLevel, message: string): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message);
        break;
    }
  }

  /**
   * Log to file asynchronously
   */
  private async logToFileAsync(message: string): Promise<void> {
    try {
      await fs.appendFile(this.logFilePath, message + '\n', 'utf8');
      
      // Check if log file rotation is needed
      await this.rotateLogFileIfNeeded();
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Rotate log file if it exceeds maximum size
   */
  private async rotateLogFileIfNeeded(): Promise<void> {
    try {
      const stats = await fs.stat(this.logFilePath);
      
      if (stats.size > this.maxLogFileSize) {
        await this.rotateLogFiles();
      }
    } catch (error) {
      // Ignore errors when checking file size
    }
  }

  /**
   * Rotate log files
   */
  private async rotateLogFiles(): Promise<void> {
    try {
      const logsDir = path.dirname(this.logFilePath);
      const baseName = path.basename(this.logFilePath, '.log');
      
      // Move existing log files
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = path.join(logsDir, `${baseName}.${i}.log`);
        const newFile = path.join(logsDir, `${baseName}.${i + 1}.log`);
        
        try {
          await fs.rename(oldFile, newFile);
        } catch (error) {
          // Ignore if file doesn't exist
        }
      }
      
      // Move current log file
      const currentLog = path.join(logsDir, `${baseName}.1.log`);
      await fs.rename(this.logFilePath, currentLog);
      
      // Create new log file
      await fs.writeFile(this.logFilePath, '', 'utf8');
      
      this.info('Log files rotated successfully');
    } catch (error) {
      console.error('Failed to rotate log files:', error);
    }
  }

  /**
   * Get log file path
   */
  public getLogFilePath(): string {
    return this.logFilePath;
  }

  /**
   * Get log level
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Check if file logging is enabled
   */
  public isLogToFileEnabled(): boolean {
    return this.logToFile;
  }

  /**
   * Cleanup logger resources
   */
  public async cleanup(): Promise<void> {
    this.info('Logger cleanup completed');
  }
}
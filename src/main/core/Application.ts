/**
 * Main Application Class
 * 
 * This class manages the main Electron application lifecycle and coordinates
 * between different modules. It provides a centralized way to handle application
 * initialization, window management, and cleanup.
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { EventEmitter } from 'events';
import { AppConfig, AppError, Patient, StimulationData } from '../../types';
import { FileManager } from './FileManager';
import { WindowManager } from './WindowManager';
import { IPCManager } from './IPCManager';
import { DataManager } from './DataManager';
import { Logger, LogLevel } from '../utils/Logger';
import { IPCHandlers } from '../ipc/ipcHandlers';
import { HelperFunctions } from '../helpers/helpers';

/**
 * Main Application class that orchestrates the entire application
 */
export class Application extends EventEmitter {
  private static instance: Application;
  private fileManager: FileManager;
  private windowManager: WindowManager;
  private ipcManager: IPCManager;
  private dataManager: DataManager;
  private ipcHandlers: IPCHandlers;
  private helperFunctions: HelperFunctions;
  private logger: Logger;
  private config: AppConfig;
  private isInitialized: boolean = false;

  private constructor() {
    super();
    this.logger = new Logger(LogLevel.INFO);
    this.config = this.loadConfig();
    this.fileManager = new FileManager(this.logger);
    this.windowManager = new WindowManager(this.logger);
    this.ipcManager = new IPCManager(this.logger, this.fileManager);
    this.dataManager = new DataManager(this.logger);
    this.ipcHandlers = new IPCHandlers(this.logger, this.fileManager, this.dataManager);
    this.helperFunctions = new HelperFunctions(this.logger);
  }

  /**
   * Get the singleton instance of the Application
   */
  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  /**
   * Initialize the application
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Application already initialized');
      return;
    }

    try {
      this.logger.info('Initializing application...');
      
      // Set up error handling
      this.setupErrorHandling();
      
      // Initialize managers
      await this.dataManager.initialize();
      await this.fileManager.initialize();
      await this.ipcManager.initialize();
      await this.ipcHandlers.initialize();
      
      // Set up application event listeners
      this.setupAppEventListeners();
      
      this.isInitialized = true;
      this.logger.info('Application initialized successfully');
      this.emit('initialized');
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to initialize application:', errorObj);
      throw new AppError('INIT_FAILED', 'Failed to initialize application', errorObj);
    }
  }

  /**
   * Start the application
   */
  public async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      this.logger.info('Starting application...');
      
      // Create the main window
      await this.windowManager.createMainWindow();
      
      // IPC handlers are already set up during initialization
      
      this.logger.info('Application started successfully');
      this.emit('started');
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to start application:', errorObj);
      throw new AppError('START_FAILED', 'Failed to start application', errorObj);
    }
  }

  /**
   * Shutdown the application
   */
  public async shutdown(): Promise<void> {
    try {
      this.logger.info('Shutting down application...');
      
      // Clean up resources
      await this.dataManager.cleanup();
      await this.fileManager.cleanup();
      await this.ipcManager.cleanup();
      await this.ipcHandlers.cleanup();
      await this.windowManager.cleanup();
      
      this.logger.info('Application shutdown complete');
      this.emit('shutdown');
      
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
    }
  }

  /**
   * Get the application configuration
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Update the application configuration
   */
  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('configUpdated', this.config);
  }

  /**
   * Get the file manager instance
   */
  public getFileManager(): FileManager {
    return this.fileManager;
  }

  /**
   * Get the window manager instance
   */
  public getWindowManager(): WindowManager {
    return this.windowManager;
  }

  /**
   * Get the IPC manager instance
   */
  public getIPCManager(): IPCManager {
    return this.ipcManager;
  }

  /**
   * Get the data manager instance
   */
  public getDataManager(): DataManager {
    return this.dataManager;
  }

  /**
   * Get the helper functions instance
   */
  public getHelperFunctions(): HelperFunctions {
    return this.helperFunctions;
  }

  /**
   * Load application configuration
   */
  private loadConfig(): AppConfig {
    return {
      version: '1.1.0',
      buildDate: new Date().toISOString(),
      electronVersion: process.versions.electron || '',
      nodeVersion: process.versions.node || '',
      chromeVersion: process.versions.chrome || '',
      name: 'LeadDBS Programmer',
      description: 'A DBS Database Management Tool for LeadDBS',
      author: 'Savir Madan <savirmadan@gmail.com>',
      license: 'MIT',
      repository: 'https://github.com/netstim/LeadDBSDatabase.git',
      bugs: 'https://github.com/netstim/LeadDBSDatabase.git',
      homepage: 'https://github.com/netstim/LeadDBSDatabase.git#readme',
      main: './src/main/main.ts',
      scripts: {},
      dependencies: {},
      devDependencies: {},
      build: {},
      electron: {}
    };
  }

  /**
   * Set up error handling for the application
   */
  private setupErrorHandling(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Uncaught Exception:', errorObj);
      this.emit('error', new AppError('UNCAUGHT_EXCEPTION', 'Uncaught exception occurred', errorObj));
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      const errorObj = reason instanceof Error ? reason : new Error(String(reason));
      this.logger.error('Unhandled Rejection:', errorObj);
      this.emit('error', new AppError('UNHANDLED_REJECTION', 'Unhandled promise rejection', errorObj));
    });

    // Handle Electron app errors
    app.on('error', (error) => {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      this.logger.error('App Error:', errorObj);
      this.emit('error', new AppError('APP_ERROR', 'Application error occurred', errorObj));
    });
  }

  /**
   * Set up application event listeners
   */
  private setupAppEventListeners(): void {
    // Handle app ready
    app.on('ready', async () => {
      try {
        await this.start();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        this.logger.error('Failed to start application on ready:', errorObj);
      }
    });

    // Handle window closed
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle app activate (macOS)
    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        try {
          await this.start();
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          this.logger.error('Failed to start application on activate:', errorObj);
        }
      }
    });

    // Handle app before quit
    app.on('before-quit', async () => {
      await this.shutdown();
    });
  }
}
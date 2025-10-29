/**
 * Window Manager
 * 
 * This class handles all window-related operations including creating, managing,
 * and controlling application windows. It provides a centralized interface for
 * window management with proper error handling and state tracking.
 */

import { BrowserWindow, app, screen, ipcMain } from 'electron';
import { Logger } from '../utils/Logger';
import { AppError } from '../../types';

/**
 * Window Manager class for handling all window operations
 */
export class WindowManager {
  private logger: Logger;
  private mainWindow: BrowserWindow | null = null;
  private isInitialized: boolean = false;
  private windowState: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    isMaximized: boolean;
  } = {
    width: 1200,
    height: 800,
    isMaximized: false
  };

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Initialize the window manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('WindowManager already initialized');
      return;
    }

    try {
      this.logger.info('Initializing WindowManager...');
      
      // Set up window event handlers
      this.setupWindowEventHandlers();
      
      // Set up IPC handlers for window operations
      this.setupWindowIPC();
      
      this.isInitialized = true;
      this.logger.info('WindowManager initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize WindowManager:', error);
      throw new AppError('WINDOW_MANAGER_INIT_FAILED', 'Failed to initialize WindowManager', error);
    }
  }

  /**
   * Create the main application window
   */
  public async createMainWindow(): Promise<BrowserWindow> {
    try {
      this.logger.info('Creating main window...');
      
      // Get display information
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
      
      // Calculate window position (centered)
      const x = Math.max(0, Math.floor((screenWidth - this.windowState.width) / 2));
      const y = Math.max(0, Math.floor((screenHeight - this.windowState.height) / 2));
      
      // Create the browser window
      this.mainWindow = new BrowserWindow({
        width: this.windowState.width,
        height: this.windowState.height,
        x: this.windowState.x ?? x,
        y: this.windowState.y ?? y,
        minWidth: 800,
        minHeight: 600,
        show: false, // Don't show until ready
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: require.resolve('../preload')
        },
        icon: require.resolve('../../assets/icon.png'),
        titleBarStyle: 'default',
        resizable: true,
        maximizable: true,
        minimizable: true,
        closable: true
      });

      // Set up window event listeners
      this.setupMainWindowEvents();
      
      // Load the application
      await this.loadApplication();
      
      this.logger.info('Main window created successfully');
      return this.mainWindow;
      
    } catch (error) {
      this.logger.error('Failed to create main window:', error);
      throw new AppError('WINDOW_CREATE_ERROR', 'Failed to create main window', error);
    }
  }

  /**
   * Get the main window instance
   */
  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  /**
   * Check if the main window exists and is not destroyed
   */
  public isMainWindowValid(): boolean {
    return this.mainWindow !== null && !this.mainWindow.isDestroyed();
  }

  /**
   * Show the main window
   */
  public showMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.show();
      this.logger.debug('Main window shown');
    }
  }

  /**
   * Hide the main window
   */
  public hideMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.hide();
      this.logger.debug('Main window hidden');
    }
  }

  /**
   * Minimize the main window
   */
  public minimizeMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.minimize();
      this.logger.debug('Main window minimized');
    }
  }

  /**
   * Maximize the main window
   */
  public maximizeMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.maximize();
      this.windowState.isMaximized = true;
      this.logger.debug('Main window maximized');
    }
  }

  /**
   * Restore the main window from minimized/maximized state
   */
  public restoreMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.restore();
      this.windowState.isMaximized = false;
      this.logger.debug('Main window restored');
    }
  }

  /**
   * Close the main window
   */
  public closeMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.close();
      this.logger.debug('Main window closed');
    }
  }

  /**
   * Set window title
   */
  public setWindowTitle(title: string): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.setTitle(title);
      this.logger.debug(`Window title set to: ${title}`);
    }
  }

  /**
   * Get window bounds
   */
  public getWindowBounds(): Electron.Rectangle | null {
    if (this.isMainWindowValid()) {
      return this.mainWindow!.getBounds();
    }
    return null;
  }

  /**
   * Set window bounds
   */
  public setWindowBounds(bounds: Electron.Rectangle): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.setBounds(bounds);
      this.logger.debug(`Window bounds set to: ${JSON.stringify(bounds)}`);
    }
  }

  /**
   * Center the window on the screen
   */
  public centerWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.center();
      this.logger.debug('Window centered');
    }
  }

  /**
   * Focus the main window
   */
  public focusMainWindow(): void {
    if (this.isMainWindowValid()) {
      this.mainWindow!.focus();
      this.logger.debug('Main window focused');
    }
  }

  /**
   * Check if the main window is focused
   */
  public isMainWindowFocused(): boolean {
    if (this.isMainWindowValid()) {
      return this.mainWindow!.isFocused();
    }
    return false;
  }

  /**
   * Cleanup window manager resources
   */
  public async cleanup(): Promise<void> {
    this.logger.info('Cleaning up WindowManager...');
    
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.destroy();
      this.mainWindow = null;
    }
    
    this.isInitialized = false;
  }

  /**
   * Load the application in the main window
   */
  private async loadApplication(): Promise<void> {
    if (!this.mainWindow) {
      throw new AppError('WINDOW_NOT_CREATED', 'Main window not created');
    }

    try {
      // In development, load from webpack dev server
      if (process.env.NODE_ENV === 'development') {
        await this.mainWindow.loadURL('http://localhost:3000');
        this.logger.info('Loaded application from development server');
      } else {
        // In production, load from file
        await this.mainWindow.loadFile('dist/renderer/index.html');
        this.logger.info('Loaded application from file');
      }
    } catch (error) {
      this.logger.error('Failed to load application:', error);
      throw new AppError('APP_LOAD_ERROR', 'Failed to load application', error);
    }
  }

  /**
   * Set up main window event listeners
   */
  private setupMainWindowEvents(): void {
    if (!this.mainWindow) return;

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.showMainWindow();
      this.logger.info('Main window ready to show');
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.logger.info('Main window closed');
    });

    // Handle window resize
    this.mainWindow.on('resize', () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        const bounds = this.mainWindow.getBounds();
        this.windowState.width = bounds.width;
        this.windowState.height = bounds.height;
        this.windowState.x = bounds.x;
        this.windowState.y = bounds.y;
        this.logger.debug(`Window resized to: ${bounds.width}x${bounds.height}`);
      }
    });

    // Handle window move
    this.mainWindow.on('move', () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        const bounds = this.mainWindow.getBounds();
        this.windowState.x = bounds.x;
        this.windowState.y = bounds.y;
        this.logger.debug(`Window moved to: ${bounds.x}, ${bounds.y}`);
      }
    });

    // Handle window maximize/restore
    this.mainWindow.on('maximize', () => {
      this.windowState.isMaximized = true;
      this.logger.debug('Window maximized');
    });

    this.mainWindow.on('unmaximize', () => {
      this.windowState.isMaximized = false;
      this.logger.debug('Window unmaximized');
    });

    // Handle window focus
    this.mainWindow.on('focus', () => {
      this.logger.debug('Window focused');
    });

    this.mainWindow.on('blur', () => {
      this.logger.debug('Window blurred');
    });
  }

  /**
   * Set up window event handlers for the application
   */
  private setupWindowEventHandlers(): void {
    // Handle all windows closed
    app.on('window-all-closed', () => {
      this.logger.info('All windows closed');
      // On macOS, keep the app running even when all windows are closed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle app activation (macOS)
    app.on('activate', () => {
      this.logger.info('App activated');
      // On macOS, re-create a window when the dock icon is clicked
      if (this.mainWindow === null) {
        this.createMainWindow();
      } else {
        this.showMainWindow();
      }
    });

    // Handle before quit
    app.on('before-quit', (event) => {
      this.logger.info('App is about to quit');
      // Add any cleanup logic here if needed
    });
  }

  /**
   * Set up IPC handlers for window operations
   */
  private setupWindowIPC(): void {
    // Handle window minimize
    ipcMain.handle('window-minimize', () => {
      this.minimizeMainWindow();
    });

    // Handle window maximize
    ipcMain.handle('window-maximize', () => {
      this.maximizeMainWindow();
    });

    // Handle window restore
    ipcMain.handle('window-restore', () => {
      this.restoreMainWindow();
    });

    // Handle window close
    ipcMain.handle('window-close', () => {
      this.closeMainWindow();
    });

    // Handle window focus
    ipcMain.handle('window-focus', () => {
      this.focusMainWindow();
    });

    // Handle get window bounds
    ipcMain.handle('window-get-bounds', () => {
      return this.getWindowBounds();
    });

    // Handle set window bounds
    ipcMain.handle('window-set-bounds', (event, bounds: Electron.Rectangle) => {
      this.setWindowBounds(bounds);
    });

    // Handle center window
    ipcMain.handle('window-center', () => {
      this.centerWindow();
    });

    // Handle is window focused
    ipcMain.handle('window-is-focused', () => {
      return this.isMainWindowFocused();
    });
  }
}
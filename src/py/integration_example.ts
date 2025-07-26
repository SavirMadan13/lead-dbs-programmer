/**
 * Integration Example: Updating Electron Main Process to use FastAPI Backend
 * 
 * This file shows how to modify your existing main.ts to use the new FastAPI backend
 * instead of the current TypeScript IPC handlers.
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import { fastAPIServer } from './pyserver';
import path from 'path';

// Global reference to maintain window instance
let mainWindow: BrowserWindow | null = null;

/**
 * Modified createWindow function that starts the FastAPI server
 */
const createWindow = async () => {
  // Start the FastAPI server
  console.log('Starting FastAPI backend server...');
  const serverStarted = await fastAPIServer.startServer();
  
  if (!serverStarted) {
    console.error('Failed to start FastAPI server. Exiting...');
    app.quit();
    return;
  }

  console.log('FastAPI server started successfully!');
  console.log('Server URL:', fastAPIServer.getServerUrl());

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Setup IPC handlers that proxy to FastAPI
  setupIPCProxies();
};

/**
 * Setup IPC handlers that proxy requests to the FastAPI backend
 * This allows existing frontend code to continue working with minimal changes
 */
function setupIPCProxies() {
  // Example: Import inputdata file
  ipcMain.on('import-inputdata-file', async (event, filePath) => {
    try {
      const result = await fastAPIServer.apiRequest('/api/files/import-inputdata', {
        method: 'POST',
        body: JSON.stringify({ file_path: filePath }),
      });
      event.reply('import-inputdata-file', result);
    } catch (error) {
      console.error('Error importing inputdata:', error);
      event.reply('import-inputdata-file-error', error.message);
    }
  });

  // Example: Import file
  ipcMain.on('import-file', async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      const result = await fastAPIServer.apiRequest('/api/files/import', {
        method: 'POST',
        body: JSON.stringify({
          id,
          timeline,
          directoryPath,
          leadDBS
        }),
      });
      event.reply('import-file', result);
    } catch (error) {
      console.error('Error importing file:', error);
      event.reply('import-file-error', error.message);
    }
  });

  // Example: Save file
  ipcMain.on('save-file', async (event, file, data, historical) => {
    try {
      const { patient, timeline, directoryPath, leadDBS } = historical;
      const result = await fastAPIServer.apiRequest('/api/files/save', {
        method: 'POST',
        body: JSON.stringify({
          patient,
          timeline,
          directoryPath,
          data,
          leadDBS
        }),
      });
      event.reply('file-saved', result);
    } catch (error) {
      console.error('Error saving file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  // Example: Get stimulation data
  ipcMain.handle('get-stimulation-data', async () => {
    try {
      return await fastAPIServer.apiRequest('/api/stimulation/data');
    } catch (error) {
      console.error('Error getting stimulation data:', error);
      throw error;
    }
  });

  // Example: Get timelines
  ipcMain.handle('get-timelines', async (event, directoryPath, patientId, leadDBS) => {
    try {
      const url = `/api/files/timelines/${patientId}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}`;
      return await fastAPIServer.apiRequest(url);
    } catch (error) {
      console.error('Error getting timelines:', error);
      throw error;
    }
  });

  // Example: Clinical data operations
  ipcMain.on('import-file-clinical', async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      const url = `/api/clinical/import/${id}/${timeline}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}`;
      const result = await fastAPIServer.apiRequest(url, { method: 'POST' });
      event.reply('import-file-clinical', result);
    } catch (error) {
      console.error('Error importing clinical file:', error);
      event.reply('import-file-error', error.message);
    }
  });

  // Example: Save clinical data
  ipcMain.on('save-file-clinical', async (event, data, historical, scoreType) => {
    try {
      const { patient, timeline, directoryPath, leadDBS } = historical;
      const url = `/api/clinical/save/${patient.id}/${timeline}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}&score_type=${encodeURIComponent(scoreType)}`;
      const result = await fastAPIServer.apiRequest(url, {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      event.reply('file-saved', result);
    } catch (error) {
      console.error('Error saving clinical file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  // Example: Load PLY file
  ipcMain.handle('load-ply-file', async (event, historical) => {
    try {
      const { patient, timeline, directoryPath, leadDBS } = historical;
      const url = `/api/visualization/load-ply/${patient.id}/${timeline}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}`;
      const result = await fastAPIServer.apiRequest(url);
      
      // Convert hex string back to buffer for compatibility
      if (result.data) {
        return Buffer.from(result.data, 'hex').buffer;
      }
      return result;
    } catch (error) {
      console.error('Error loading PLY file:', error);
      throw error;
    }
  });

  // Example: Batch import
  ipcMain.on('batch-import', async (event, data, leadDBS) => {
    try {
      const result = await fastAPIServer.apiRequest('/api/clinical/batch-import', {
        method: 'POST',
        body: JSON.stringify({ data, lead_dbs: leadDBS }),
      });
      event.reply('batch-import', result);
    } catch (error) {
      console.error('Error in batch import:', error);
      event.reply('batch-import-error', error.message);
    }
  });

  // Add more IPC proxies as needed...
  console.log('IPC proxies to FastAPI backend setup complete');
}

/**
 * App event handlers
 */
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Stop the FastAPI server when all windows are closed
  fastAPIServer.stopServer();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Ensure FastAPI server is stopped before quitting
  fastAPIServer.stopServer();
});

/**
 * Alternative: Direct HTTP API approach (for new frontend code)
 * 
 * Instead of IPC proxies, you can expose the FastAPI server URL to the renderer
 * and have the frontend make direct HTTP requests
 */

// In preload.ts:
/*
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Expose server URL for direct HTTP requests
  getServerUrl: () => 'http://127.0.0.1:8000',
  
  // Helper function for making API requests
  request: async (endpoint: string, options: any = {}) => {
    const url = `http://127.0.0.1:8000${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
});
*/

// In renderer (React component):
/*
// Direct API call approach
const handleImportFile = async () => {
  try {
    const result = await window.api.request('/api/files/import', {
      method: 'POST',
      body: JSON.stringify({
        id: patientId,
        timeline: selectedTimeline,
        directoryPath: currentDirectory,
        leadDBS: isLeadDBSMode
      })
    });
    
    setFileData(result);
  } catch (error) {
    console.error('Failed to import file:', error);
  }
};
*/
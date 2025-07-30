/* eslint-disable func-names */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * This version uses HTTP calls to a Python FastAPI backend for all file operations.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as childProcess from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import registerFileHandlers from './ipc/ipcHandlers';
import { getData, setData } from './data/data';
import { getPatientFolder } from './helpers/helpers';
import { httpClient } from './utils/httpClient';

ipcMain.setMaxListeners(Infinity);

// Start Python backend server
function startPythonServer() {
  try {
    const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
    const serverScript = path.join(__dirname, '../../backend/main.py');
    
    const pythonProcess = childProcess.spawn(pythonPath, [serverScript], {
      stdio: 'inherit',
      detached: false
    });
    
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python server:', error);
    });
    
    pythonProcess.on('exit', (code) => {
      console.log(`Python server exited with code ${code}`);
    });
    
    console.log('Python server started');
    return pythonProcess;
  } catch (error) {
    console.error('Error starting Python server:', error);
    return null;
  }
}

// Initialize clinical scores via HTTP
async function ensureClinicalScoresFile() {
  try {
    // The Python backend will handle creating the default clinical scores file
    await httpClient.getClinicalScoresTypes();
    console.log('Clinical scores file ensured via Python backend');
  } catch (error) {
    console.error('Error ensuring clinical scores file:', error);
  }
}

let pythonServerProcess: childProcess.ChildProcess | null = null;

app.on('ready', async () => {
  pythonServerProcess = startPythonServer();
  
  // Wait a moment for the server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  registerFileHandlers(); // Call this when the app is ready
  try {
    await ensureClinicalScoresFile();
  } catch (error) {
    console.error('Error ensuring clinical scores file:', error);
  }
  console.log('File handlers registered.');
});

app.on('before-quit', () => {
  if (pythonServerProcess) {
    pythonServerProcess.kill();
  }
});

const inputPath = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

console.log('Binary path: ', app.getPath('exe'));
console.log('Resources path: ', process.resourcesPath);
console.log('CWD: ', process.cwd());
console.log('Directory: ', __dirname);

let mainWindow: BrowserWindow | null = null;
let stimulationDirectory = '';
let stimulationData = {};

ipcMain.on('import-inputdata-file', async (event, arg) => {
  try {
    console.log(inputPath);
    console.log(process.argv[1]);
    
    // Use HTTP client instead of direct file access
    const result = await httpClient.importInputDataFile(inputPath);
    stimulationData = result;
    setData('stimulationData', stimulationData);
    event.reply('import-inputdata-file', stimulationData);
  } catch (err) {
    console.error('Error importing inputdata file:', err);
    event.reply('import-inputdata-file-error', err.message);
  }
});

ipcMain.on('import-file', async (event, id, timeline, directoryPath, leadDBS) => {
  try {
    // Validate parameters
    if (!id || !timeline || !directoryPath) {
      console.error('Missing patient ID, timeline, or directoryPath');
      event.reply('import-file-error', 'Missing patient ID, timeline, or directoryPath');
      return;
    }

    // Use HTTP client instead of direct file access
    const result = await httpClient.importFile(id, timeline, directoryPath, leadDBS);
    event.reply('import-file', result);
  } catch (err) {
    console.error('Error importing file:', err);
    event.reply('import-file-error', err.message);
  }
});

ipcMain.handle('import-file-2', async (_, directoryPath, id, timeline, leadDBS) => {
  try {
    if (!id || !timeline || !directoryPath) {
      throw new Error('Missing patient ID, timeline, or directoryPath');
    }

    // Use HTTP client instead of direct file access
    const result = await httpClient.importFile(id, timeline, directoryPath, leadDBS);
    return result;
  } catch (error) {
    console.error('Error in import-file:', error.message);
    throw error;
  }
});

ipcMain.handle('get-stimulation-data', async (_, message) => {
  try {
    const result = await httpClient.getStimulationData();
    return result;
  } catch (error) {
    console.error('Error getting stimulation data:', error);
    return stimulationData; // Fallback to local data
  }
});

// Note: This handler appears to be unused in the original code
ipcMain.on('import-previous-files', async (event, fileID, importData) => {
  try {
    // This functionality would need to be implemented in the Python backend
    // For now, we'll return an empty response
    event.reply('import-previous-files', 'Empty');
  } catch (error) {
    console.error('Error importing previous files:', error);
    event.reply('import-previous-files', 'Error');
  }
});

ipcMain.on('close-window', (event, arg) => {
  app.quit();
});

const { dialog } = require('electron');

ipcMain.on('set-status', (event, arg) => {
  // This functionality writes a status file - could be moved to Python backend if needed
  const currentDirectory = app.getAppPath();
  const directories = currentDirectory.split('/');

  let result = '';
  for (const dir of directories) {
    result += `${dir}/`;
    if (dir === 'programmergroup') {
      break;
    }
  }
  
  if (currentDirectory) {
    // This could be moved to Python backend if needed
    console.log('Status set - functionality to be implemented in Python backend');
  }
});

ipcMain.on('database-group-figures', async (event, directoryPath) => {
  try {
    // This functionality would need to be implemented in the Python backend
    console.log('Database group figures - functionality to be implemented in Python backend');
    event.reply('database-group-figures', {});
  } catch (error) {
    console.error('Error getting database group figures:', error);
    event.reply('database-group-figures', {});
  }
});

ipcMain.handle('get-clinical-data', async (event, directoryPath, patientsWithTimelines) => {
  try {
    const result = await httpClient.getClinicalData(directoryPath, patientsWithTimelines);
    return result;
  } catch (error) {
    console.error('Error fetching clinical data:', error);
    throw error;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

let showResize = false;

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 670,
    height: 850,
    icon: '../../assets/lead_dbs_icon_web.png',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  let previousWidth = mainWindow.getSize()[0];
  mainWindow.on('resize', () => {
    const [currentWidth, currentHeight] = mainWindow.getSize();

    if (currentWidth !== previousWidth) {
      const baseWidth = 1100;
      const zoomLevel = (currentWidth / baseWidth - 1) / 0.15;
      previousWidth = currentWidth;
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const loadDirectoryPath = () => {
    console.log('load directory path');
    // This could use HTTP client to get directory from Python backend if needed
    return inputPath;
  };

  const isLeadDBSFolder = (directoryPath) => {
    // This could be moved to Python backend validation
    return true;
  };

  const loadLeadGroupPatients = (directoryPath) => {
    const patients = directoryPath.map((folder) => {
      const patientId = folder;
      const patientData = null;

      return {
        id: patientId,
        ...patientData,
      };
    });

    return patients;
  };

  const loadLeadDBSPatients = async (directoryPath) => {
    try {
      // Use HTTP client to get participants
      const participants = await httpClient.getParticipants();
      return participants;
    } catch (error) {
      console.error('Error loading Lead DBS patients:', error);
      return [];
    }
  };

  ipcMain.handle('get-timelines', async (event, directoryPath, patientId, leadDBS) => {
    try {
      console.log('GET-TIMELINES: ', directoryPath, patientId, leadDBS);
      const result = await httpClient.getTimelines(directoryPath, patientId, leadDBS);
      return result;
    } catch (error) {
      console.error(`Error getting timelines for patient ${patientId}:`, error);
      throw new Error('Failed to retrieve timelines.');
    }
  });

  const handleMasterDataFill = (directoryPath, patients) => {
    console.log('Handle Master Data Fill', directoryPath, patients);
    console.log('done');
  };

  ipcMain.on('select-folder', async (event, directoryPath) => {
    if (directoryPath) {
      console.log('DIRECTORYPATH: ', directoryPath);

      if (isLeadDBSFolder(directoryPath)) {
        console.log('Lead-DBS folder detected');
        
        try {
          // Use HTTP client to get participants
          const patients = await httpClient.getParticipants();
          console.log('PATIENTS: ', patients);
          event.sender.send('folder-selected', directoryPath, patients);
          event.sender.send('file-read-success', patients, directoryPath);
        } catch (error) {
          console.error('Error reading participants:', error);
          event.sender.send('file-read-error', 'Error reading participants file');
        }
      } else {
        event.sender.send('folder-selected', directoryPath);
      }
    } else {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (!result.canceled) {
        const folderPath = result.filePaths[0];
        console.log('Selected folder: ', folderPath);

        if (isLeadDBSFolder(folderPath)) {
          console.log('Lead-DBS folder detected');
          try {
            const patients = await loadLeadDBSPatients(folderPath);
            console.log('PATIENTS: ', patients);
            event.sender.send('folder-selected', folderPath, patients);
            event.sender.send('file-read-success', patients, directoryPath);
          } catch (error) {
            console.error('Error loading patients:', error);
            event.sender.send('file-read-error', 'Error loading patients');
          }
        } else {
          event.sender.send('folder-selected', folderPath);
        }
      } else {
        event.sender.send('folder-selected', null);
      }
    }
  });

  const gatherPlyFiles = async () => {
    try {
      console.log('GATHER PLY FILES');
      const plyFiles = await httpClient.getPlyFiles();
      console.log(plyFiles);
      return plyFiles;
    } catch (error) {
      console.error('Error gathering PLY files:', error);
      return [];
    }
  };

  const gatherPlyFilesDatabase = async () => {
    try {
      console.log('GATHER PLY FILES DATABASE');
      const result = await httpClient.getPlyFilesDatabase();
      console.log('Dataset Master: ', result);
      return result;
    } catch (error) {
      console.error('Error gathering PLY files database:', error);
      return {};
    }
  };

  ipcMain.handle('get-ply-files', async (event) => {
    try {
      const plyFiles = await gatherPlyFiles();
      return plyFiles;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });

  ipcMain.handle('get-ply-files-database', async (event) => {
    try {
      console.log('HERE');
      const plyFiles = await gatherPlyFilesDatabase();
      return plyFiles;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });

  ipcMain.handle('get-saved-directory', () => {
    return loadDirectoryPath();
  });

  ipcMain.handle('load-ply-file-database', async (event, patientID, sessionID) => {
    try {
      const result = await httpClient.loadPlyFileDatabase(patientID, sessionID);
      
      // Convert hex strings back to ArrayBuffers for the renderer
      if (result.anatomyPly) {
        result.anatomyPly = Buffer.from(result.anatomyPly, 'hex').buffer;
      }
      if (result.combinedElectrodesPly) {
        result.combinedElectrodesPly = Buffer.from(result.combinedElectrodesPly, 'hex').buffer;
      }
      
      return result;
    } catch (error) {
      console.error('Error loading PLY file:', error);
      return null;
    }
  });

  ipcMain.handle('load-reconstruction', async (event, patientID, directoryPath) => {
    try {
      const result = await httpClient.loadReconstruction(patientID, directoryPath);
      
      // Convert hex strings back to ArrayBuffers for the renderer
      if (result.combinedElectrodesPly) {
        result.combinedElectrodesPly = Buffer.from(result.combinedElectrodesPly, 'hex').buffer;
      }
      
      return result;
    } catch (error) {
      console.error('Error loading reconstruction:', error);
      return null;
    }
  });

  app.on('window-all-closed', function () {
    app.quit();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  app.quit();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
      registerFileHandlers();
    });
  })
  .catch(console.log);

ipcMain.on('zoom-level-changed', (event, zoomLevel) => {
  if (mainWindow) {
    const newWidth = 2000 * (1 + zoomLevel * 0.1);
    const newHeight = 1100 * (1 + zoomLevel * 0.5);
    mainWindow.setSize(newWidth, newHeight);
  }
});

ipcMain.on('increase-window-width', (event, showViewer) => {
  showResize = showViewer;
  if (mainWindow && showViewer) {
    const [width, height] = mainWindow.getSize();
    if (width > 800) {
      mainWindow.setSize(width - 350, height);
    }
  } else if (mainWindow && !showViewer) {
    const [width, height] = mainWindow.getSize();
    if (width < 800) {
      mainWindow.setSize(width + 350, height);
    }
  }
});
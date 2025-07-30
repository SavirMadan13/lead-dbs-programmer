/* eslint-disable func-names */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as childProcess from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { FastAPIServerManager } from './pyserver';
import registerProxyHandlers from './ipc/ipcProxyHandlers';
import { getData, setData } from './data/data';
// Helper imports no longer needed - migrated to FastAPI backend
// import {
//   getPatientFolder,
//   readJSON,
//   getPatientFolderPly,
// } from './helpers/helpers';

ipcMain.setMaxListeners(Infinity);

async function ensureClinicalScoresFile() {
  try {
    await fastAPIServer.apiRequest('/api/clinical/ensure-scores-file', {
      method: 'POST',
    });
    console.log('Clinical scores file ensured via FastAPI');
  } catch (error) {
    console.error('Error ensuring clinical scores file via FastAPI:', error);
  }
}

app.on('ready', async () => {
  try {
    await ensureClinicalScoresFile();
  } catch (error) {
    console.error('Error ensuring clinical scores file:', error);
  }
  console.log('App ready - clinical scores file ensured.');
});

// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};

// const args = process.argv.slice(1); // This will include the 'input_file_path' passed from MATLAB
// console.log(args);
// const inputDatasetDirectory = process.argv[1]; // Get the first argument
// const inputPath = '/Users/savirmadan/Downloads/inputData.json';
// const inputPath = '/Users/savirmadan/Documents/Localizations/Clinical/Patient0374Output/derivatives/leaddbs/sub-CbctDbs0374/stimulations/MNI152NLin2009bAsym/inputData.json';
// const inputPath = '/Users/savirmadan/Downloads/inputDataGroupMerge.json';
// const inputPath = process.argv[1];
// const inputPath = '/Users/savirmadan/Documents/Localizations/Patient0395Output';
const inputPath = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset';
// const inputPath = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/stimulations/MNI152NLin2009bAsym/inputData.json';
// const inputPath = '/Users/savirmadan/Downloads/Patient2Output';
// const inputPath = null;
// const inputPath = '/Volumes/PdBwh/Patient0395Output';
// const inputPath = '/Volumes/OneTouch/MasterDataset/AllData';
// const inputPath = '/Volumes/PdBwh/CompleteParkinsons';
// const inputPath = '/Users/savirmadan/Documents/LeadGroupDemo/derivatives/leadgroup/20241007203440/inputData.json';
// const inputPath = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/stimulations/MNI152NLin2009bAsym/inputData.json';
// const inputPath = '/Volumes/PdBwh/CompleteParkinsons/derivatives/leadgroup/BwhParkinsons/inputData.json';
// const inputPath = '/Users/savirmadan/Downloads/inputDataBwh.json';
// const inputPath = '/Users/savirmadan/Documents/SanteGroup/derivatives/leadgroup/2024nov5V2/inputData.json';
// const inputPath = '/Users/savirmadan/Documents/LeadGroupDemo/derivatives/leadgroup/20241007203440/inputData.json';
// const inputPath = '/Users/savirmadan/Documents/Localizations/Clinical/Patient0362Output/derivatives/leaddbs/sub-CbctDbs0362/stimulations/MNI152NLin2009bAsym/inputData.json';
// const inputPath = '/Users/savirmadan/Documents/Localizations/Clinical/Patient0370Output/derivatives/leaddbs/sub-CbctDbs0370/stimulations/MNI152NLin2009bAsym/inputData.json';
// const inputPath = '/Volumes/PdBwh/CompleteParkinsons/derivatives/leadgroup/DRTT/inputData.json';
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

// FastAPI Server Manager Instance
const fastAPIServer = new FastAPIServerManager();

ipcMain.on('import-inputdata-file', async (event, arg) => {
  try {
    console.log('Processing import-inputdata-file request via FastAPI backend...');
    console.log('Input path:', inputPath);
    
    // Call the FastAPI backend to handle the import
    const result = await fastAPIServer.apiRequest(`/api/files/import-inputdata?file_path=${encodeURIComponent(inputPath)}`, {
      method: 'POST',
    });
    
    // Update local data with the result
    stimulationData = result;
    setData('stimulationData', stimulationData);
    stimulationDirectory = stimulationData.stimDir || '';
    
    console.log('Stimulation Data imported via FastAPI:', result);
    event.reply('import-inputdata-file', result);
  } catch (error) {
    console.error('Error importing inputdata via FastAPI:', error);
    event.reply('import-inputdata-file-error', error.message);
  }
});

ipcMain.on(
  'import-file',
  async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      console.log('Processing import-file request via FastAPI backend...');
      
      // Call the FastAPI backend to handle the file import
      const result = await fastAPIServer.apiRequest('/api/files/import', {
        method: 'POST',
        body: JSON.stringify({ 
          id: id, 
          timeline: timeline, 
          directoryPath: directoryPath, 
          leadDBS: leadDBS 
        }),
      });
      
      console.log('File imported via FastAPI:', result);
      event.reply('import-file', result);
    } catch (error) {
      console.error('Error importing file via FastAPI:', error);
      event.reply('import-file-error', error.message);
    }
  },
);

ipcMain.handle(
  'import-file-2',
  async (_, directoryPath, id, timeline, leadDBS) => {
    try {
      console.log('Processing import-file-2 request via FastAPI backend...');
      
      // Call the FastAPI backend to handle the file import
      const result = await fastAPIServer.apiRequest(`/api/files/import-file-2/${id}/${timeline}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}`, {
        method: 'GET',
      });
      
      console.log('File imported via FastAPI:', result);
      return result;
    } catch (error) {
      console.error('Error importing file via FastAPI:', error);
      throw error; // This propagates the error back to the renderer process
    }
  },
);

ipcMain.handle('get-stimulation-data', async (_, message) => {
  console.log('Getting stimulation data via FastAPI backend...');
  try {
    // Call the FastAPI backend to get stimulation data
    const result = await fastAPIServer.apiRequest('/api/stimulation/data', {
      method: 'GET',
    });
    
    console.log('Stimulation data retrieved via FastAPI:', result);
    return result;
  } catch (error) {
    console.error('Error getting stimulation data via FastAPI:', error);
    // Fall back to local data if FastAPI fails
    return stimulationData;
  }
});

// Import previous files via FastAPI
ipcMain.on('import-previous-files', async (event, fileID, importData) => {
  try {
    console.log('Processing import-previous-files request via FastAPI backend...');
    
    // Call the FastAPI backend to handle the import
    const result = await fastAPIServer.apiRequest('/api/files/import-previous-files', {
      method: 'POST',
      body: JSON.stringify({ 
        file_id: fileID, 
        import_data: importData 
      }),
    });
    
    console.log('Previous files imported via FastAPI:', result);
    event.reply('import-previous-files', result);
  } catch (error) {
    console.error('Error importing previous files via FastAPI:', error);
    event.reply('import-previous-files', 'Empty');
  }
});

ipcMain.on('close-window', (event, arg) => {
  app.quit();
});

// ipcMain.on('close-window-new', (event, arg) => {
//   const fs = require('fs');

//   const f = fs.readFileSync(inputFilePath);

//   // Parse the JSON data
//   const jsonData = JSON.parse(f);

//   const stimPath = jsonData.stimDir;
//   stimulationDirectory = stimPath.replace(/\\\//g, '/');
//   const newStimFilePath = path.join(stimulationDirectory, 'data.json');

//   // Create a valid JSON object
//   const jsonDataToWrite = {
//     message: 'App Closed Without Saving Parameters',
//     timestamp: new Date().toISOString(), // Optional: add a timestamp or any other data
//   };

//   try {
//     // Convert the object to a JSON string
//     const dataString = JSON.stringify(jsonDataToWrite, null, 2); // 'null, 2' adds indentation for readability
//     // Write the JSON string to the file
//     fs.writeFileSync(newStimFilePath, dataString);
//     console.log('File written successfully!');
//   } catch (error) {
//     // Handle the error here
//     console.error('Error writing to file:', error);
//   }

//   app.quit();
// });

const { dialog } = require('electron');

ipcMain.on('set-status', async (event, arg) => {
  try {
    console.log('Processing set-status request via FastAPI backend...');
    
    // Call the FastAPI backend to handle status setting
    await fastAPIServer.apiRequest('/api/files/set-status', {
      method: 'POST',
      body: JSON.stringify({ app_path: app.getAppPath() }),
    });
    
    console.log('Status set via FastAPI');
  } catch (error) {
    console.error('Error setting status via FastAPI:', error);
  }
});

// Currently not called anywhere - REMOVED (migrated to FastAPI)
// ipcMain.on('database-group-figures', (event, directoryPath) => {
//   console.log(directoryPath);
//   const databaseMasterFile = path.join(directoryPath, 'dataset_master.json');
//   const databaseData = readJSON(databaseMasterFile);
//   event.reply('database-group-figures', databaseData);
// });

ipcMain.handle(
  'get-clinical-data',
  async (event, directoryPath, patientsWithTimelines) => {
    try {
      console.log('Processing get-clinical-data request via FastAPI backend...');
      
      // Call the FastAPI backend to get clinical data
      const result = await fastAPIServer.apiRequest('/api/clinical/get-clinical-data', {
        method: 'POST',
        body: JSON.stringify({ 
          directoryPath: directoryPath, 
          patientsWithTimelines: patientsWithTimelines 
        }),
      });
      
      console.log('Clinical data retrieved via FastAPI:', result);
      return result;
    } catch (error) {
      console.error('Error fetching clinical data via FastAPI:', error);
      throw error;
    }
  },
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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
  // Start the FastAPI server first
  console.log('Starting FastAPI backend server...');
  const serverStarted = await fastAPIServer.startServer();
  
  if (!serverStarted) {
    console.error('Failed to start FastAPI server. Exiting...');
    app.quit();
    return;
  }

  console.log('FastAPI server started successfully!');
  console.log('Server URL:', fastAPIServer.getServerUrl());
  
  // Register IPC proxy handlers to forward remaining IPC calls to FastAPI backend
  registerProxyHandlers(fastAPIServer);

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
    // width: 875,
    // height: 770,
    // width: 600,
    // width: 1000,
    width: 670,
    height: 850,
    // maxWidth: 1100, // Maximum width of the window
    // // maxHeight: 1200, // Maximum height of the window
    // minWidth: 1000, // Minimum width of the window
    // minHeight: 1200, // Minimum height of the window
    // icon: getAssetPath('icon.png'),
    // icon: getAssetPath('lead_dbs_icon_web.png'),
    icon: '../../assets/lead_dbs_icon_web.png',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  let previousWidth = mainWindow.getSize()[0]; // Initialize with the current width
  mainWindow.on('resize', () => {
    const [currentWidth, currentHeight] = mainWindow.getSize();

    // Check if the width has changed
    if (currentWidth !== previousWidth) {
      // Calculate the zoom level based on window size change.
      const baseWidth = 1100; // Default window width
      const zoomLevel = (currentWidth / baseWidth - 1) / 0.15;

      // Send the zoom level to the renderer process

      // if (!showResize) {
      //   mainWindow.webContents.send('zoom-level-changed', zoomLevel);
      // }
      // showResize = true;
      // Update the previous width
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

  const hiddenDirPath = path.join(
    app.getPath('userData'),
    '.lead-dbs-programmer',
  );
  // const jsonFilePath = path.join(hiddenDirPath, 'config.json');
  // console.log('Saved File', jsonFilePath);
  // // Ensure the hidden directory exists
  // const ensureDirectoryExists = (dirPath: string) => {
  //   if (!fs.existsSync(dirPath)) {
  //     fs.mkdirSync(dirPath, { recursive: true });
  //   }
  // };

  // Save the directory path to the JSON file
  // const saveDirectoryPath = (directoryPath: string) => {
  //   ensureDirectoryExists(hiddenDirPath);
  //   const data = { directoryPath };
  //   fs.writeFileSync(jsonFilePath, JSON.stringify(data), 'utf-8');
  // };

  // Load the saved directory path from the JSON file
  // const loadDirectoryPath = () => {
  //   // if (fs.existsSync(jsonFilePath)) {
  //   //   const data = fs.readFileSync(jsonFilePath, 'utf-8');
  //   //   // return JSON.parse(data).directoryPath;
  //   //   // console.log(stimulationData.filepath);
  //   //   if (!stimulationData.filepath) {
  //   //     return inputPath;
  //   //   }
  //   //   return stimulationData.filepath;
  //   // } else {

  //   // }
  //   if (!stimulationData.filepath) {
  //     return inputPath;
  //   } else {
  //     return stimulationData.filepath;
  //   }
  //   return null;
  // };

  const loadDirectoryPath = () => {
    console.log('load directory path');
    // if (fs.existsSync(jsonFilePath)) {
    //   console.log(jsonFilePath);
    //   const data = fs.readFileSync(jsonFilePath, 'utf-8');
    //   // return JSON.parse(data).directoryPath;
    //   // console.log(stimulationData.filepath);
    //   if (!stimulationData.filepath) {
    //     return inputPath;
    //   }
    //   return stimulationData.filepath;
    // }
    if (stimulationData.mode !== 'standalone') {
      return stimulationData.filepath;
    }
    return inputPath;
  };

  // Helper function to check if the folder has the Lead-DBS structure
  // const isLeadDBSFolder = (directoryPath) => {
  //   const requiredFolders = ['derivatives/leaddbs', 'rawdata', 'sourcedata'];
  //   return requiredFolders.every((folder) =>
  //     fs.existsSync(path.join(directoryPath, folder)),
  //   );
  // };

  const isLeadDBSFolder = (directoryPath) => {
    // const requiredFolders = ['derivatives/leaddbs', 'leadgroup'];
    // if (directoryPath.includes('leadgroup')) {
    //   return true;
    // }
    // return requiredFolders.some((folder) =>
    //   fs.existsSync(path.join(directoryPath, folder)),
    // );
    return true;
  };



  ipcMain.handle(
    'get-timelines',
    async (event, directoryPath, patientId, leadDBS) => {
      try {
        console.log('Processing get-timelines request via FastAPI backend...');
        
        // Call the FastAPI backend to get timelines
        const result = await fastAPIServer.apiRequest(`/api/files/timelines/${patientId}?directory_path=${encodeURIComponent(directoryPath)}&lead_dbs=${leadDBS}`, {
          method: 'GET',
        });
        
        console.log('Timelines retrieved via FastAPI:', result);
        return result;
      } catch (error) {
        console.error('Error getting timelines via FastAPI:', error);
        throw new Error('Failed to retrieve timelines.');
      }
    },
  );

  const handleMasterDataFill = (directoryPath, patients) => {
    console.log('Handle Master Data Fill', directoryPath, patients);
    console.log('done');
  };

  ipcMain.on('select-folder', async (event, directoryPath) => {
    try {
      console.log('Processing select-folder request via FastAPI backend...');
      console.log('Directory Path:', directoryPath);
      
      // Call the FastAPI backend to handle folder selection
      const result = await fastAPIServer.apiRequest('/api/files/select-folder', {
        method: 'POST',
        body: JSON.stringify({ 
          directory_path: directoryPath,
          show_dialog: !directoryPath // Show dialog if no path provided
        }),
      });
      
      console.log('Folder selected via FastAPI:', result);
      
      // Send the appropriate events based on the result
      if (result.success) {
        event.sender.send('folder-selected', result.selected_path, result.patients);
        if (result.patients) {
          event.sender.send('file-read-success', result.patients, result.selected_path);
        }
      } else {
        event.sender.send('folder-selected', null);
        if (result.error) {
          event.sender.send('file-read-error', result.error);
        }
      }
    } catch (error) {
      console.error('Error selecting folder via FastAPI:', error);
      event.sender.send('folder-selected', null);
      event.sender.send('file-read-error', error.message);
    }
  });





  ipcMain.handle('get-ply-files', async (event) => {
    console.log('Getting PLY files via FastAPI backend...');
    try {
      const result = await fastAPIServer.apiRequest('/api/visualization/ply-files', {
        method: 'GET',
      });
      
      console.log('PLY files retrieved via FastAPI:', result);
      return result;
    } catch (error) {
      console.error('Error getting PLY files via FastAPI:', error);
      throw error;
    }
  });

  ipcMain.handle('get-ply-files-database', async (event) => {
    console.log('Getting PLY database files via FastAPI backend...');
    try {
      const result = await fastAPIServer.apiRequest('/api/visualization/ply-files-database', {
        method: 'GET',
      });
      
      console.log('PLY database files retrieved via FastAPI:', result);
      return result;
    } catch (error) {
      console.error('Error getting PLY database files via FastAPI:', error);
      throw error;
    }
  });

  ipcMain.handle('get-saved-directory', () => {
    return loadDirectoryPath();
  });

  // ipcMain.handle('load-nii-file', async (event, historical) => {
  //   const { patient, timeline, directoryPath, leadDBS } = historical;
  //   if (leadDBS) {
  //     // const filePath = '/Users/savirmadan/Downloads/Cognitive Decline Network.nii';
  //     const filePath = '/Users/savirmadan/Downloads/r0maps_stn129/rmap_updrstotal.nii';
  //     const fileData = fs.readFileSync(filePath);
  //     return fileData.buffer;
  //   }
  //   const filePath =
  //     '/Volumes/Expansion/OLD/Output/Patient0316Output/derivatives/leaddbs/sub-CbctDbs0316/export/ply/combined_electrodes.ply';
  //   console.log(filePath);
  //   const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
  //   return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
  // });

  // ipcMain.handle('load-csv-file', async (event, historical) => {
  //   const { patient, timeline, directoryPath, leadDBS } = historical;
  //   if (leadDBS) {
  //     // const filePath = '/Users/savirmadan/Downloads/Cognitive Decline Network.nii';
  //     const filePath = '/Users/savirmadan/Downloads/rmap_tremor.csv';
  //     // const filePath = '/Users/savirmadan/Downloads/r0maps_stn129/rmap_tremor.nii';
  //     const fileData = fs.readFileSync(filePath, 'utf8'); // Read the PLY file as binary
  //     return fileData; // Return as ArrayBuffer // send the file contents back to renderer process
  //   }
  //   const filePath =
  //     '/Volumes/Expansion/OLD/Output/Patient0316Output/derivatives/leaddbs/sub-CbctDbs0316/export/ply/combined_electrodes.ply';
  //   console.log(filePath);
  //   const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
  //   return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
  // });

  // ipcMain.handle('load-test-file', async (event, historical) => {
  //   const { patient, timeline, directoryPath, leadDBS } = historical;
  //   const filePath = '/Users/savirmadan/Downloads/potential_test.ply';
  //   console.log(filePath);
  //   const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
  //   return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
  // });

  // ipcMain.handle(
  //   'load-ply-file-database',
  //   async (event, patientID, sessionID) => {
  //     const jsonData2 = readJSON(jsonFilePath);
  //     const { directoryPath } = jsonData2;
  //     const masterDataFile = path.join(directoryPath, 'dataset_master.json');
  //     const jsonData = readJSON(masterDataFile);
  //     console.log(patientID);

  //     try {
  //       // Check if the patientID exists in the master dataset
  //       if (!jsonData[patientID]) {
  //         throw new Error(`Patient ID ${patientID} not found in dataset.`);
  //       }

  //       // Retrieve the patient's exportData (where PLY files are located)
  //       const { exportData } = jsonData[patientID];
  //       const { clinicalData } = jsonData[patientID];

  //       if (!exportData) {
  //         throw new Error(`No export data found for Patient ID ${patientID}.`);
  //       }

  //       // Define a session-based PLY file retrieval (you can modify this depending on session logic)
  //       let plyFilePath = null;

  //       // Get the paths to anatomyPly and combinedElectrodesPly
  //       let anatomyPlyPath = exportData.anatomyPly;
  //       let combinedElectrodesPlyPath = exportData.combinedElectrodesPly;
  //       let clinicalReconstructionPath = clinicalData.reconstructionJson;
  //       let stimulationParametersPath = null;

  //       // Check for the provided sessionID and set the stimulation parameters path
  //       if (clinicalData[sessionID]) {
  //         const sessionData = clinicalData[sessionID];
  //         stimulationParametersPath = sessionData.find((filePath) =>
  //           filePath.includes('stimparameters.json'),
  //         );
  //       } else {
  //         throw new Error(
  //           `Session ID ${sessionID} not found for Patient ID ${patientID}.`,
  //         );
  //       }

  //       if (!stimulationParametersPath) {
  //         throw new Error(
  //           `No stimulation parameters file found for Patient ID ${patientID} in session ${sessionID}.`,
  //         );
  //       }

  //       if (!anatomyPlyPath || !combinedElectrodesPlyPath) {
  //         throw new Error(
  //           `One or more PLY files not found for Patient ID ${patientID}.`,
  //         );
  //       }
  //       anatomyPlyPath.replace(/\\\//g, '');
  //       combinedElectrodesPlyPath.replace(/\\\//g, '');
  //       clinicalReconstructionPath.replace(/\\\//g, '');
  //       stimulationParametersPath = stimulationParametersPath.replace(
  //         /\\\//g,
  //         '',
  //       );
  //       // Read both PLY files as binary
  //       const anatomyPlyData = fs.readFileSync(anatomyPlyPath);
  //       const combinedElectrodesPlyData = fs.readFileSync(
  //         combinedElectrodesPlyPath,
  //       );
  //       const clinicalReconstructionData = fs.readFileSync(
  //         clinicalReconstructionPath,
  //         'utf8',
  //       );
  //       const clinicalDataOutput = JSON.parse(clinicalReconstructionData);
  //       const stimulationParametersData = fs.readFileSync(
  //         stimulationParametersPath,
  //         'utf8',
  //       );
  //       const jsonData3 = JSON.parse(stimulationParametersData); // Parse the string into a JSON object
  //       // Return both files as buffers in an object
  //       return {
  //         anatomyPly: anatomyPlyData.buffer,
  //         combinedElectrodesPly: combinedElectrodesPlyData.buffer,
  //         reconstructionData: clinicalDataOutput,
  //         stimulationParameters: jsonData3,
  //       };
  //     } catch (error) {
  //       console.error('Error loading PLY file:', error);
  //       return null; // Return null if an error occurs
  //     }
  //   },
  // );

  ipcMain.handle(
    'load-ply-file-database',
    async (event, patientID, sessionID) => {
      try {
        console.log('Processing load-ply-file-database request via FastAPI backend...');
        
        // Call the FastAPI backend to load PLY file data
        const result = await fastAPIServer.apiRequest(`/api/visualization/load-ply-database/${patientID}/${sessionID}`, {
          method: 'GET',
        });
        
        console.log('PLY file data loaded via FastAPI:', result);
        
        // Convert hex strings back to buffers for compatibility
        if (result.anatomyPly) {
          result.anatomyPly = Buffer.from(result.anatomyPly, 'hex').buffer;
        }
        if (result.combinedElectrodesPly) {
          result.combinedElectrodesPly = Buffer.from(result.combinedElectrodesPly, 'hex').buffer;
        }
        
        return result;
      } catch (error) {
        console.error('Error loading PLY file via FastAPI:', error);
        return null; // Return null if an error occurs
      }
    },
  );

  ipcMain.handle(
    'load-reconstruction',
    async (event, patientID, directoryPath) => {
      try {
        console.log('Processing load-reconstruction request via FastAPI backend...');
        
        // Call the FastAPI backend to load reconstruction data
        const result = await fastAPIServer.apiRequest(`/api/visualization/load-reconstruction/${patientID}?directory_path=${encodeURIComponent(directoryPath)}`, {
          method: 'GET',
        });
        
        console.log('Reconstruction data loaded via FastAPI:', result);
        
        // Convert hex strings back to buffers for compatibility
        if (result.combinedElectrodesPly) {
          result.combinedElectrodesPly = Buffer.from(result.combinedElectrodesPly, 'hex').buffer;
        }
        
        return result;
      } catch (error) {
        console.error('Error loading reconstruction via FastAPI:', error);
        return null; // Return null if an error occurs
      }
    },
  );

  app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') app.quit();
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

app.on('before-quit', () => {
  // Ensure FastAPI server is stopped before quitting
  console.log('App quitting - stopping FastAPI server...');
  fastAPIServer.stopServer();
});

app.on('window-all-closed', () => {
  // Stop the FastAPI server when all windows are closed
  console.log('All windows closed - stopping FastAPI server...');
  fastAPIServer.stopServer();
  
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on('zoom-level-changed', (event, zoomLevel) => {
  if (mainWindow) {
    // const newWidth = 1250 * (1 + zoomLevel * 0.1); // Adjust the scale factor as needed
    const newWidth = 2000 * (1 + zoomLevel * 0.1);
    const newHeight = 1100 * (1 + zoomLevel * 0.5); // Adjust the scale factor as needed
    mainWindow.setSize(newWidth, newHeight);
  }
});

ipcMain.on('increase-window-width', (event, showViewer) => {
  showResize = showViewer;
  if (mainWindow && showViewer) {
    const [width, height] = mainWindow.getSize();
    if (width > 800) {
      mainWindow.setSize(width - 350, height); // Increase width by 100 pixels
    }
  } else if (mainWindow && !showViewer) {
    const [width, height] = mainWindow.getSize();
    if (width < 800) {
      mainWindow.setSize(width + 350, height); // Increase width by 100 pixels
    }
  }
});

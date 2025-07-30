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
import {
  getPatientFolder,
  readJSON,
  getPatientFolderPly,
} from './helpers/helpers';

ipcMain.setMaxListeners(Infinity);

function ensureClinicalScoresFile() {
  const fs = require('fs');
  const userDataPath = app.getPath('userData');
  const scoresFilePath = path.join(userDataPath, 'ClinicalScores.json');

  if (!fs.existsSync(scoresFilePath)) {
    const defaultScores = {
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

    try {
      fs.writeFileSync(
        scoresFilePath,
        JSON.stringify(defaultScores, null, 2),
        'utf8',
      );
    } catch (error) {
      console.error('Error writing default scores to file:', error);
    }
    console.log('Created clinicalScores.json with default content');
  }
}

app.on('ready', () => {
  try {
    ensureClinicalScoresFile();
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
      if (!id || !timeline || !directoryPath) {
        throw new Error('Missing patient ID, timeline, or directoryPath');
      }

      // Construct the file path dynamically
      let patientDir = path.join(directoryPath, `sub-${id}`);
      let sessionDir = path.join(patientDir, `ses-${timeline}`);
      let fileName = `sub-${id}_ses-${timeline}_stim.json`;
      let filePath = path.join(sessionDir, fileName);

      if (leadDBS) {
        // const newDirectoryPath = stimulationData.filepath ? path.join(
        //   // directoryPath,
        //   stimulationData.filepath,
        //   'derivatives/leaddbs',
        //   id,
        //   'clinical',
        // ) : ;
        // patientDir = newDirectoryPath;
        patientDir = getPatientFolder(directoryPath, id, leadDBS);
        sessionDir = path.join(patientDir, `ses-${timeline}`);
        fileName = `${id}_ses-${timeline}_stimparameters.json`;
        filePath = path.join(sessionDir, fileName);
        console.log(patientDir, timeline, sessionDir, fileName);
      }
      // console.log(stimulationData.filepath);
      console.log(sessionDir);
      console.log('File Path: ', filePath);
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      // Read the file and parse the data
      const fileData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileData);

      return jsonData;
    } catch (error) {
      console.error('Error in import-file:', error.message);
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

// Not sure what this is used for
ipcMain.on('import-previous-files', (event, fileID, importData) => {
  const fs = require('fs');

  const masterImportData = importData.priorStims;
  let fileKey = '';
  Object.keys(masterImportData).forEach((key) => {
    if (masterImportData[key].name === fileID) {
      fileKey = key;
    }
  });
  console.log('FILEKEY');
  let filePath = '';
  if (masterImportData[fileKey]) {
    const priorStimFolder = masterImportData[fileKey].folder;
    console.log(masterImportData);
    const fileName = `${importData.patientname}_desc-stimparameters.json`;
    filePath = path.join(priorStimFolder, fileID, fileName);
  } else {
    const priorStimFolder = masterImportData[3].folder;
    const fileName = `${importData.patientname}_desc-stimparameters.json`;
    filePath = path.join(priorStimFolder, fileID, fileName);
    console.log('1');
    console.log(fileID);
    const outputFolder = path.join(priorStimFolder, fileID);
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
      console.log('2');
      fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
      console.log('3');
    }
  }
  let jsonData = 'Empty';

  if (fs.existsSync(filePath)) {
    const f = fs.readFileSync(filePath, 'utf8');
    if (f.trim() === '') {
      // If the file is empty, create the file and pass back a message
      fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
      console.log('File is empty. Created a new file.');
      // const jsonData = 'Empty';
    } else {
      // Convert the data to JSON format
      jsonData = JSON.parse(f);
      console.log('Data read successfully:', jsonData);
    }
  } else {
    // If the file doesn't exist, create the file and pass back a message
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
    console.log('File does not exist. Created a new file.');
    // const jsonData = 'Empty';
  }
  console.log('FILEPATH; ', filePath);

  console.log('JSONDATA: ', jsonData);
  // console.log(key);
  // event.reply('import-previous-files-reply', filePath, jsonData);
  event.reply('import-previous-files', jsonData);
  // event.reply('get-output-filePath', filePath);
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
const fs = require('fs');

ipcMain.on('set-status', (event, arg) => {
  const currentDirectory = app.getAppPath();
  const directories = currentDirectory.split('/');

  // Initialize a variable to store the result
  let result = '';
  // Loop through the directories
  for (const dir of directories) {
    // Append each directory to the result
    result += `${dir}/`;

    // If the directory contains "lead-dbs-programmer", stop the loop
    if (dir === 'programmergroup') {
      break;
    }
  }
  // console.log(currentDirectory + '/lead-dbs-programmer');
  if (currentDirectory) {
    // Convert data to string format
    const fileName = 'status.json';
    const filePath = path.join(result, fileName);
    // const filePath = './dist/main/webpack:/leaddbs-stimcontroller/main.js';
    // Write data to file
    try {
      fs.writeFileSync(filePath, '0');
    } catch (error) {
      // Handle the error here
      console.error('Error writing to file:', error);
    }
    // fs.writeFileSync(file, dataString);

    // Send a response back to the renderer process
  }
});

// Currently not called anywhere
ipcMain.on('database-group-figures', (event, directoryPath) => {
  console.log(directoryPath);
  const databaseMasterFile = path.join(directoryPath, 'dataset_master.json');
  const databaseData = readJSON(databaseMasterFile);
  event.reply('database-group-figures', databaseData);
});

ipcMain.handle(
  'get-clinical-data',
  async (event, directoryPath, patientsWithTimelines) => {
    try {
      // Loop through each patient and their respective timelines
      const allClinicalData = await Promise.all(
        patientsWithTimelines.map(async ({ id, timelines }) => {
          const patientClinicalData = {};

          for (const timeline of timelines) {
            // Construct the path based on the new directory structure
            const sessionPath = path.join(
              directoryPath,
              'derivatives',
              'leaddbs',
              id,
              'clinical',
              `ses-${timeline}`,
            );
            const clinicalFilePath = path.join(
              sessionPath,
              `${id}_ses-${timeline}_clinical.json`,
            );

            try {
              // Check if the clinical.json file exists, then read and parse it
              if (fs.existsSync(clinicalFilePath)) {
                const clinicalData = JSON.parse(
                  await fs.promises.readFile(clinicalFilePath, 'utf-8'),
                );
                patientClinicalData[timeline] = clinicalData;
              }
            } catch (error) {
              console.error(
                `Error reading clinical.json for patient ${id}, session ${timeline}:`,
                error,
              );
            }
          }

          // Return the structured data for the patient
          return { id, clinicalData: patientClinicalData };
        }),
      );

      return allClinicalData; // Returns an array with each patient's clinical data structured by timeline
    } catch (error) {
      console.error('Error fetching clinical data:', error);
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

  const loadLeadDBSPatients = (directoryPath) => {
    const leadDBSPath = path.join(directoryPath, 'derivatives', 'leaddbs');
    const patientFolders = fs.readdirSync(leadDBSPath);
    console.log('Made it here');
    // Filter out hidden files or folders (those starting with '.')
    const filteredFolders = patientFolders.filter(
      (folder) => !folder.startsWith('.'),
    );
    console.log('Filtered folders: ', filteredFolders);
    const patients = filteredFolders.map((folder) => {
      const patientId = folder;
      const patientFilePath = path.join(
        directoryPath,
        'patient_info.json',
      ); // Assuming there's a patient_info.json file in each folder
      let patientData = null;

      if (fs.existsSync(patientFilePath)) {
        const patientFileContent = fs.readFileSync(patientFilePath, 'utf-8');
        patientData = JSON.parse(patientFileContent);
      }

      return {
        id: patientId,
        ...patientData,
      };
    });

    return patients;
  };

  ipcMain.handle(
    'get-timelines',
    async (event, directoryPath, patientId, leadDBS) => {
      // Determine the path to the patient's folder based on leadDBS flag
      console.log('GET-TIMELINES: ', directoryPath, patientId, leadDBS);
      const patientFolder = getPatientFolder(directoryPath, patientId, leadDBS);
      console.log('Patient Folder: ', patientFolder);
      if (!fs.existsSync(patientFolder)) {
        console.log('Patient Folder does not exist');
        return [];
      }
      try {
        // If leadDBS is false, the process remains as before
        if (!leadDBS) {
          // Read the patient folder
          const timelines = await fs.promises.readdir(patientFolder);

          // Prepare data structure to hold timelines with stimulation and clinical information
          const timelineData = await Promise.all(
            timelines
              .filter((file) => file.startsWith('ses-'))
              .map(async (sessionFolder) => {
                const sessionPath = path.join(patientFolder, sessionFolder);
                const sessionFiles = await fs.promises.readdir(sessionPath);

                // Check for the presence of clinical and stimulation JSON files
                const hasClinical = sessionFiles.some((file) =>
                  file.includes('clinical.json'),
                );
                const hasStimulation = sessionFiles.some((file) =>
                  file.includes('stim.json'),
                );

                return {
                  timeline: sessionFolder.replace('ses-', ''), // Timeline name without 'ses-' prefix
                  hasClinical,
                  hasStimulation,
                };
              }),
          );

          return timelineData; // Return array with timelines and availability of clinical/stimulation data
        }
        // if (leadDBS) {
        //   // Read the patient folder
        //   const timelines = await fs.promises.readdir(patientFolder);

        //   // Prepare data structure to hold timelines with stimulation and clinical information
        //   const timelineData = await Promise.all(
        //     timelines
        //       .filter((file) => file.startsWith('ses-'))
        //       .map(async (sessionFolder) => {
        //         console.log(sessionFolder);
        //         const sessionPath = path.join(patientFolder, sessionFolder);
        //         const sessionFiles = await fs.promises.readdir(sessionPath);

        //         // Check for the presence of clinical and stimulation JSON files
        //         const hasClinical = sessionFiles.some((file) =>
        //           file.includes('clinical.json'),
        //         );
        //         const hasStimulation = sessionFiles.some((file) =>
        //           file.includes('stimparameters.json'),
        //         );

        //         return {
        //           timeline: sessionFolder.replace('ses-', ''), // Timeline name without 'ses-' prefix
        //           hasClinical,
        //           hasStimulation,
        //         };
        //       }),
        //   );

        //   return timelineData; // Return array with timelines and availability of clinical/stimulation data
        // }
        if (leadDBS) {
          // Read the patient folder
          const timelines = await fs.promises.readdir(patientFolder);

          // Prepare data structure to hold timelines with stimulation and clinical information
          const timelineData = await Promise.all(
            timelines
              .filter((file) => file.startsWith('ses-'))
              .map(async (sessionFolder) => {
                const sessionPath = path.join(patientFolder, sessionFolder);

                // Check if the session path exists and is a directory
                if (!fs.existsSync(sessionPath) || !fs.statSync(sessionPath).isDirectory()) {
                  // console.log(`Skipping ${sessionFolder} as it does not exist or is not a directory.`);
                  return null; // Skip this session
                }

                const sessionFiles = await fs.promises.readdir(sessionPath);

                // Check for the presence of clinical and stimulation JSON files
                const hasClinical = sessionFiles.some((file) =>
                  file.includes('clinical.json'),
                );
                const hasStimulation = sessionFiles.some((file) =>
                  file.includes('stimparameters.json'),
                );

                return {
                  timeline: sessionFolder.replace('ses-', ''), // Timeline name without 'ses-' prefix
                  hasClinical,
                  hasStimulation,
                };
              }),
          );

          // Filter out any null entries (sessions that were skipped)
          return timelineData.filter((data) => data !== null);
        }
        // Logic for leadDBS = true (new logic to handle different folder structure)
        let stimSubDirs = await fs.promises.readdir(patientFolder);
        stimSubDirs = stimSubDirs.filter((dir) => dir !== '.DS_Store');
        console.log('Stim Sub Dirs         ', stimSubDirs);
        const timelineData = await Promise.all(
          stimSubDirs.map(async (stimulationID) => {
            const stimulationFilesPath = path.join(
              patientFolder,
              stimulationID,
            );
            console.log(stimulationFilesPath);
            const sessionFiles =
              await fs.promises.readdir(stimulationFilesPath);

            // Check for the presence of the desired stimulation files
            const hasStimulation = sessionFiles.some((file) =>
              file.includes('desc-stimparameters.mat'),
            );
            console.log('Has Stim: ', hasStimulation);
            // Assuming clinical data is in the same way as in the non-leadDBS case, adjust if needed
            const hasClinical = sessionFiles.some((file) =>
              file.includes('clinical.json'),
            );

            return {
              timeline: stimulationID, // Use the stimulation ID as the timeline
              hasClinical,
              hasStimulation,
            };
          }),
        );

        return timelineData; // Return array with timelines and availability of clinical/stimulation data
      } catch (error) {
        console.error(`Error reading patient folder ${patientFolder}:`, error);
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

  // Function to get all PLY files from atlas folders
  function getPlyFilesFromAtlases(atlasesPath) {
    const plyFiles = [];

    try {
      const atlasFolders = fs.readdirSync(atlasesPath);

      // Loop through each atlas folder
      for (const folder of atlasFolders) {
        const folderPath = path.join(atlasesPath, folder);

        // Check if it's a directory
        if (fs.statSync(folderPath).isDirectory()) {
          // Construct the expected PLY file name
          const expectedPlyFile = `${folder}.ply`;
          const plyFilePath = path.join(folderPath, expectedPlyFile);

          // Check if the PLY file exists
          if (fs.existsSync(plyFilePath)) {
            plyFiles.push({
              fileName: expectedPlyFile,
              filePath: plyFilePath,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error reading atlas folders:', error);
    }

    return plyFiles;
  }

  const gatherPlyFiles = () => {
    console.log('GATHER PLY FILES');
    // const jsonData = readJSON(jsonFilePath);
    // const { directoryPath } = jsonData;

    // // Step 2: Read the dataset description file to get Lead_Path
    // console.log(directoryPath);
    // const datasetDescriptionPath = path.join(
    //   directoryPath,
    //   'dataset_description.json',
    // );
    // const datasetDescription = readJSON(datasetDescriptionPath);
    // const leadPath = datasetDescription[0].Lead_Path;
    // console.log('Lead Path: ', leadPath);
    // const stimulationData = getData('stimulationData');
    let leadPath = null;
    try {
      let appDirectory = __dirname;
      appDirectory = path.resolve(appDirectory, '../../../../../..');
      const preferences = path.join(appDirectory, 'Preferences.json');
      const preferencesData = JSON.parse(fs.readFileSync(preferences, 'utf8'));
      leadPath = preferencesData.LeadDBS_Path;
      leadPath = leadPath.replace(/\\/g, '/');
    } catch (err) {
      const stimulationData = getData('stimulationData');
      leadPath = stimulationData.leadpath;
    }

    // const leadPath = '/Users/savirmadan/Documents/GitHub/leaddbs';
    // Step 3: Go to the 'atlases' folder within the Lead_Path
    const atlasesPath = path.join(
      leadPath,
      'templates',
      'space',
      'MNI_ICBM_2009b_NLIN_ASYM',
      'atlases',
    );

    // Step 4: Gather PLY files from atlas folders
    const plyFiles = getPlyFilesFromAtlases(atlasesPath);
    console.log(plyFiles);
    return plyFiles;
  };

  // const gatherPlyFilesDatabase = () => {
  //   const jsonData2 = readJSON(jsonFilePath);
  //   const { directoryPath } = jsonData2;

  //   // Step 2: Read the dataset description file to get Lead_Path
  //   console.log('Directory Path: ', directoryPath);
  //   // const datasetDescriptionPath = path.join(
  //   //   directoryPath,
  //   //   'dataset_description.json',
  //   // );
  //   // const datasetDescription = readJSON(datasetDescriptionPath);
  //   // const leadPath = datasetDescription[0].Lead_Path;
  //   // console.log('Lead Path: ', leadPath);
  //   const masterDataFile = path.join(directoryPath, 'dataset_master.json');
  //   const jsonData = readJSON(masterDataFile);
  //   const result = {};

  //   // Iterate over each subject (sub_X)
  //   Object.keys(jsonData).forEach((subId) => {
  //     const { clinicalData } = jsonData[subId];
  //     if (clinicalData) {
  //       // Iterate over each session in clinicalData
  //       Object.keys(clinicalData).forEach((sessionKey) => {
  //         const sessionFiles = clinicalData[sessionKey];

  //         // Check if the session contains an array of files
  //         if (Array.isArray(sessionFiles)) {
  //           sessionFiles.forEach((filePath) => {
  //             // Check if the file is a stimparameters file
  //             if (filePath.includes('stimparameters.json')) {
  //               // Add the subId and session to the result
  //               if (!result[subId]) {
  //                 result[subId] = [];
  //               }
  //               result[subId].push(sessionKey);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });

  //   return result;
  // };

  const gatherPlyFilesDatabase = () => {
    console.log('GATHER PLY FILES DATABASE');
    // const stimulationData = getData('stimulationData');
    const directoryPath = path.join(
      stimulationData.path,
      'derivatives',
      'leaddbs',
    );
    console.log(stimulationData);
    console.log(directoryPath);
    const result = {};

    // Helper function to recursively find all JSON files within the clinical folder
    const findJsonFilesInClinical = (clinicalDir) => {
      const files = fs.readdirSync(clinicalDir);
      let jsonFiles = [];

      files.forEach((file) => {
        const filePath = path.join(clinicalDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Recurse into subdirectory
          jsonFiles = jsonFiles.concat(findJsonFilesInClinical(filePath));
        } else if (file.endsWith('.json')) {
          // Add JSON file
          jsonFiles.push(filePath);
        }
      });

      return jsonFiles;
    };

    // Step 1: Get all patient subdirectories (e.g., sub-15454, sub-29781)
    const patientDirs = fs.readdirSync(directoryPath).filter((subDir) => {
      const fullPath = path.join(directoryPath, subDir);
      return fs.statSync(fullPath).isDirectory() && subDir.startsWith('sub-');
    });

    console.log(patientDirs);

    // Step 2: Process each patient's clinical folder
    patientDirs.forEach((patientDir) => {
      const clinicalDir = path.join(directoryPath, patientDir, 'clinical');

      if (
        fs.existsSync(clinicalDir) &&
        fs.statSync(clinicalDir).isDirectory()
      ) {
        const jsonFiles = findJsonFilesInClinical(clinicalDir);

        jsonFiles.forEach((filePath) => {
          // Extract session key from the file path
          const match = filePath.match(/clinical\/(ses-[^/]+)\//);

          if (match) {
            const sessionKey = match[1];
            const subId = patientDir;

            // Check if the file is a stimparameters file
            if (filePath.includes('stimparameters.json')) {
              if (!result[subId]) {
                result[subId] = [];
              }
              result[subId].push(sessionKey);
            }
          }
        });
      }
    });

    return result;
  };

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
      // Fall back to original implementation if needed
      const plyFiles = gatherPlyFiles();
      return plyFiles;
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
      // Fall back to original implementation if needed  
      const plyFiles = gatherPlyFilesDatabase();
      return plyFiles;
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
      const stimulationData = getData('stimulationData');
      const directoryPath = stimulationData.path;
      try {
        // Validate input directory
        const patientDir = path.join(
          directoryPath,
          'derivatives',
          'leaddbs',
          patientID,
        );
        if (!fs.existsSync(patientDir)) {
          throw new Error(`Patient ID ${patientID} not found in directory.`);
        }

        // Get paths to clinical and export folders
        const clinicalDir = path.join(patientDir, 'clinical');
        const exportDir = path.join(patientDir, 'export', 'ply');

        // Validate clinical and export directories
        if (!fs.existsSync(clinicalDir)) {
          throw new Error(
            `Clinical directory not found for Patient ID ${patientID}.`,
          );
        }
        if (!fs.existsSync(exportDir)) {
          throw new Error(
            `Export directory not found for Patient ID ${patientID}.`,
          );
        }

        // Retrieve session files
        const sessionDir = path.join(clinicalDir, sessionID);
        if (!fs.existsSync(sessionDir)) {
          throw new Error(
            `Session ID ${sessionID} not found for Patient ID ${patientID}.`,
          );
        }

        // Find stimulation parameters file
        const stimulationParametersFile = fs
          .readdirSync(sessionDir)
          .find((file) => file.includes('stimparameters.json'));
        if (!stimulationParametersFile) {
          throw new Error(
            `No stimulation parameters file found for Patient ID ${patientID} in session ${sessionID}.`,
          );
        }

        const stimulationParametersPath = path.join(
          sessionDir,
          stimulationParametersFile,
        );

        // Find anatomyPly and combinedElectrodesPly files
        const anatomyPlyPath = path.join(exportDir, 'anatomy.ply');
        const combinedElectrodesPlyPath = path.join(
          exportDir,
          'combined_electrodes.ply',
        );

        if (
          !fs.existsSync(anatomyPlyPath) ||
          !fs.existsSync(combinedElectrodesPlyPath)
        ) {
          throw new Error(
            `One or more PLY files not found for Patient ID ${patientID}.`,
          );
        }

        // Find reconstruction JSON file
        const reconstructionFile = fs
          .readdirSync(clinicalDir)
          .find((file) => file.includes('desc-reconstruction.json'));
        if (!reconstructionFile) {
          throw new Error(
            `Reconstruction JSON file not found for Patient ID ${patientID}.`,
          );
        }

        const clinicalReconstructionPath = path.join(
          clinicalDir,
          reconstructionFile,
        );

        // Read all required files
        const anatomyPlyData = fs.readFileSync(anatomyPlyPath);
        const combinedElectrodesPlyData = fs.readFileSync(
          combinedElectrodesPlyPath,
        );
        const clinicalReconstructionData = JSON.parse(
          fs.readFileSync(clinicalReconstructionPath, 'utf8'),
        );
        const stimulationParametersData = JSON.parse(
          fs.readFileSync(stimulationParametersPath, 'utf8'),
        );

        // Return all required data
        return {
          anatomyPly: anatomyPlyData.buffer,
          combinedElectrodesPly: combinedElectrodesPlyData.buffer,
          reconstructionData: clinicalReconstructionData,
          stimulationParameters: stimulationParametersData,
        };
      } catch (error) {
        console.error('Error loading PLY file:', error);
        return null; // Return null if an error occurs
      }
    },
  );

  ipcMain.handle(
    'load-reconstruction',
    async (event, patientID, directoryPath) => {
      try {
        // Validate input directory
        const patientDir = path.join(
          directoryPath,
          'derivatives',
          'leaddbs',
          patientID,
        );
        if (!fs.existsSync(patientDir)) {
          throw new Error(`Patient ID ${patientID} not found in directory.`);
        }

        // Get paths to clinical and export folders
        const clinicalDir = path.join(patientDir, 'clinical');
        const exportDir = path.join(patientDir, 'export', 'ply');

        // Validate clinical and export directories
        if (!fs.existsSync(clinicalDir)) {
          throw new Error(
            `Clinical directory not found for Patient ID ${patientID}.`,
          );
        }
        if (!fs.existsSync(exportDir)) {
          throw new Error(
            `Export directory not found for Patient ID ${patientID}.`,
          );
        }

        // Find anatomyPly and combinedElectrodesPly files
        const anatomyPlyPath = path.join(exportDir, 'anatomy.ply');
        const combinedElectrodesPlyPath = path.join(
          exportDir,
          'combined_electrodes.ply',
        );

        if (
          !fs.existsSync(anatomyPlyPath) ||
          !fs.existsSync(combinedElectrodesPlyPath)
        ) {
          throw new Error(
            `One or more PLY files not found for Patient ID ${patientID}.`,
          );
        }

        // Read all required files
        const anatomyPlyData = fs.readFileSync(anatomyPlyPath);
        const combinedElectrodesPlyData = fs.readFileSync(
          combinedElectrodesPlyPath,
        );

        // Return all required data
        return {
          combinedElectrodesPly: combinedElectrodesPlyData.buffer,
        };
      } catch (error) {
        console.error('Error loading PLY file:', error);
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

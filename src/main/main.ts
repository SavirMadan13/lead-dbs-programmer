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

ipcMain.setMaxListeners(Infinity);

// console.log = () => {};
// console.warn = () => {};
// console.error = () => {};

// const args = process.argv.slice(1); // This will include the 'input_file_path' passed from MATLAB
// console.log(args);
// const inputFilePath = args[0]; // Get the first argument
const inputFilePath =
  '/Users/savirmadan/Documents/Localization/Output/Patient0357Output/derivatives/leaddbs/sub-CbctDbs0357/stimulations/MNI152NLin2009bAsym/inputData.json';
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let stimulationDirectory = '';
const patientID = '';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  const fs = require('fs');

  // Changing status of app to "on"
  const currentDirectory = app.getAppPath();
  const directories = currentDirectory.split('/');

  let result = '';
  for (const dir of directories) {
    result += `${dir}/`;

    if (dir === 'programmer') {
      break;
    }
  }
});

ipcMain.handle('check-folder-exists', (event, folderPath) => {
  const fs = require('fs');
  return new Promise((resolve) => {
    fs.access(folderPath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false); // Folder does not exist
      } else {
        resolve(true); // Folder exists
      }
    });
  });
});

ipcMain.on(
  'import-file',
  async (event, id, timeline, directoryPath, leadDBS) => {
    const fs = require('fs');
    try {
      // Validate id, timeline, and directoryPath
      if (!id || !timeline || !directoryPath) {
        console.error('Missing patient ID, timeline, or directoryPath');
        event.reply(
          'import-file-error',
          'Missing patient ID, timeline, or directoryPath',
        );
        return;
      }

      // Construct the file path dynamically based on the directoryPath, patient id, and timeline
      const patientDir = path.join(directoryPath, `sub-${id}`);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      const fileName = `sub-${id}_ses-${timeline}_stim.json`;
      const filePath = path.join(sessionDir, fileName);

      // Check if the file exists before trying to read it
      if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        event.reply('import-file', 'File not found');
        return;
      }

      // Read the file
      const fileData = fs.readFileSync(filePath);

      // Parse the JSON data
      const jsonData = JSON.parse(fileData);

      // Log and send the data back to the renderer process
      console.log(jsonData);
      event.reply('import-file', jsonData);
    } catch (err) {
      // Handle specific errors
      if (err.code === 'ENOENT') {
        console.error('File not found:', filePath);
        event.reply('import-file-error', 'File not found');
      } else if (err.name === 'SyntaxError') {
        console.error('Error parsing JSON:', err.message);
        event.reply('import-file-error', 'Error parsing JSON');
      } else {
        console.error('An unexpected error occurred:', err);
        event.reply('import-file-error', err.message);
      }
    }
  },
);

ipcMain.on(
  'import-file-clinical',
  async (event, id, timeline, directoryPath) => {
    const fs = require('fs');
    try {
      // Validate id, timeline, and directoryPath
      if (!id || !timeline || !directoryPath) {
        console.error('Missing patient ID, timeline, or directoryPath');
        event.reply(
          'import-file-error',
          'Missing patient ID, timeline, or directoryPath',
        );
        return;
      }

      // Construct the file path dynamically based on the directoryPath, patient id, and timeline
      const patientDir = path.join(directoryPath, `sub-${id}`);
      const sessionDir = path.join(patientDir, `ses-${timeline}`);
      const fileName = `sub-${id}_ses-${timeline}_clinical.json`;
      const filePath = path.join(sessionDir, fileName);

      // Check if the file exists before trying to read it
      if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        event.reply('import-file-clinical', 'File not found');
        return;
      }

      // Read the file
      const fileData = fs.readFileSync(filePath);

      // Parse the JSON data
      const jsonData = JSON.parse(fileData);

      // Log and send the data back to the renderer process
      console.log(jsonData);
      event.reply('import-file-clinical', jsonData);
    } catch (err) {
      // Handle specific errors
      if (err.code === 'ENOENT') {
        console.error('File not found:', filePath);
        event.reply('import-file-error', 'File not found');
      } else if (err.name === 'SyntaxError') {
        console.error('Error parsing JSON:', err.message);
        event.reply('import-file-error', 'Error parsing JSON');
      } else {
        console.error('An unexpected error occurred:', err);
        event.reply('import-file-error', err.message);
      }
    }
  },
);

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

ipcMain.on('open-file', (event, arg) => {
  const fs = require('fs');
  const f = fs.readFileSync(arg);
  console.log(event);
  event.reply('open-file', `pong: ${f}`);
});

ipcMain.on('close-window', (event, arg) => {
  app.quit();
});

ipcMain.on('close-window-new', (event, arg) => {
  const fs = require('fs');

  const f = fs.readFileSync(inputFilePath);

  // Parse the JSON data
  const jsonData = JSON.parse(f);

  const stimPath = jsonData.stimDir;
  stimulationDirectory = stimPath.replace(/\\\//g, '/');
  const newStimFilePath = path.join(stimulationDirectory, 'data.json');

  // Create a valid JSON object
  const jsonDataToWrite = {
    message: 'App Closed Without Saving Parameters',
    timestamp: new Date().toISOString(), // Optional: add a timestamp or any other data
  };

  try {
    // Convert the object to a JSON string
    const dataString = JSON.stringify(jsonDataToWrite, null, 2); // 'null, 2' adds indentation for readability
    // Write the JSON string to the file
    fs.writeFileSync(newStimFilePath, dataString);
    console.log('File written successfully!');
  } catch (error) {
    // Handle the error here
    console.error('Error writing to file:', error);
  }

  app.quit();
});

const { dialog } = require('electron');
const fs = require('fs');

ipcMain.on('save-file', (event, file, data, historical) => {
  const { patient, timeline, directoryPath } = historical;

  if (!patient || !timeline || !directoryPath) {
    console.error('Missing patient, timeline, or directoryPath');
    return;
  }

  // Construct the proper folder structure based on the patient ID and timeline
  const patientDir = path.join(directoryPath, `sub-${patient.id}`);
  const sessionDir = path.join(patientDir, `ses-${timeline}`);

  try {
    // Ensure that the directories exist, if not, create them
    if (!fs.existsSync(patientDir))
      fs.mkdirSync(patientDir, { recursive: true });
    if (!fs.existsSync(sessionDir))
      fs.mkdirSync(sessionDir, { recursive: true });

    // Convert the data to a string format (JSON)
    const dataString = JSON.stringify(data, null, 2);

    // Dynamically name the file based on patient and timeline
    const fileName = `sub-${patient.id}_ses-${timeline}_stim.json`;
    const filePath = path.join(sessionDir, fileName);

    // Write the data to the file
    fs.writeFileSync(filePath, dataString);

    // Send the file path back to the renderer process
    event.reply('file-saved', filePath);

    console.log(`Data saved successfully to ${filePath}`);
  } catch (error) {
    // Handle any errors in the saving process
    console.error('Error writing to file:', error);
    event.reply('file-save-error', error.message);
  }
});

ipcMain.on('save-file-clinical', (event, data, historical) => {
  const { patient, timeline, directoryPath } = historical;

  if (!patient || !timeline || !directoryPath) {
    console.error('Missing patient, timeline, or directoryPath');
    return;
  }

  // Construct the proper folder structure based on the patient ID and timeline
  const patientDir = path.join(directoryPath, `sub-${patient.id}`);
  const sessionDir = path.join(patientDir, `ses-${timeline}`);

  try {
    // Ensure that the directories exist, if not, create them
    if (!fs.existsSync(patientDir))
      fs.mkdirSync(patientDir, { recursive: true });
    if (!fs.existsSync(sessionDir))
      fs.mkdirSync(sessionDir, { recursive: true });

    // Convert the data to a string format (JSON)
    const dataString = JSON.stringify(data, null, 2);

    // Dynamically name the file based on patient and timeline
    const fileName = `sub-${patient.id}_ses-${timeline}_clinical.json`;
    const filePath = path.join(sessionDir, fileName);

    // Write the data to the file
    fs.writeFileSync(filePath, dataString);

    // Send the file path back to the renderer process
    event.reply('file-saved', filePath);

    console.log(`Data saved successfully to ${filePath}`);
  } catch (error) {
    // Handle any errors in the saving process
    console.error('Error writing to file:', error);
    event.reply('file-save-error', error.message);
  }
});

ipcMain.on('set-status', (event, arg) => {
  // Example of saving data to a file
  // const filePath = app.getPath('downloads') + '/data.txt';
  // const currentDirectory = app.getAppPath();
  // const currentDirectory = '/Users/savirmadan/Development/lead-dbs-programmer';
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
    width: 1100 * (1 + -3 * 0.15),
    height: 1100 * (1 + -3 * 0.1),
    // maxWidth: 1100, // Maximum width of the window
    // // maxHeight: 1200, // Maximum height of the window
    // minWidth: 1000, // Minimum width of the window
    // minHeight: 1200, // Minimum height of the window
    // icon: getAssetPath('icon.png'),
    icon: getAssetPath('lead_dbs_icon_web.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // Set up the resize event listener to recalculate zoom level
  mainWindow.on('resize', () => {
    const [currentWidth, currentHeight] = mainWindow.getSize();

    // Calculate the zoom level based on window size change.
    const baseWidth = 1100; // Default window width
    const zoomLevel = (currentWidth / baseWidth - 1) / 0.15;

    // Send the zoom level to the renderer process
    mainWindow.webContents.send('zoom-level-changed', zoomLevel);
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
  const jsonFilePath = path.join(hiddenDirPath, 'config.json');
  console.log('Saved File', jsonFilePath);
  // Ensure the hidden directory exists
  const ensureDirectoryExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  // Save the directory path to the JSON file
  const saveDirectoryPath = (directoryPath: string) => {
    ensureDirectoryExists(hiddenDirPath);
    const data = { directoryPath };
    fs.writeFileSync(jsonFilePath, JSON.stringify(data), 'utf-8');
  };

  // Load the saved directory path from the JSON file
  const loadDirectoryPath = () => {
    if (fs.existsSync(jsonFilePath)) {
      const data = fs.readFileSync(jsonFilePath, 'utf-8');
      return JSON.parse(data).directoryPath;
    }
    return null;
  };

  // Helper function to check if the folder has the Lead-DBS structure
  const isLeadDBSFolder = (directoryPath) => {
    const requiredFolders = ['derivatives/leaddbs', 'rawdata', 'sourcedata'];
    return requiredFolders.every((folder) =>
      fs.existsSync(path.join(directoryPath, folder)),
    );
  };

  const loadLeadDBSPatients = (directoryPath) => {
    const leadDBSPath = path.join(directoryPath, 'derivatives', 'leaddbs');
    const patientFolders = fs.readdirSync(leadDBSPath);

    // Filter out hidden files or folders (those starting with '.')
    const filteredFolders = patientFolders.filter(
      (folder) => !folder.startsWith('.'),
    );

    const patients = filteredFolders.map((folder) => {
      const patientId = folder;
      const patientFilePath = path.join(
        leadDBSPath,
        folder,
        'patient_info.json',
      ); // Assuming there’s a patient_info.json file in each folder
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
      const patientFolder = leadDBS
        ? path.join(
            directoryPath,
            'derivatives',
            'leaddbs',
            `${patientId}`,
            'stimulations',
            'MNI152NLin2009bAsym',
          )
        : path.join(directoryPath, `sub-${patientId}`);
      console.log('Patient Folder: ', patientFolder);
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

  ipcMain.on('select-folder', async (event, directoryPath) => {
    if (directoryPath) {
      console.log('DIRECTORYPATH: ', directoryPath);

      // Check if the folder matches Lead-DBS structure
      if (isLeadDBSFolder(directoryPath)) {
        console.log('Lead-DBS folder detected');
        const patients = loadLeadDBSPatients(directoryPath);
        console.log('PATIENTS: ', patients);
        event.sender.send('folder-selected', directoryPath, patients);
        event.sender.send('file-read-success', patients);
      } else {
        // Regular dataset_description.json loading if it's not Lead-DBS
        const filePath = path.join(directoryPath, 'participants.json');
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              console.error('Error reading JSON file:', err);
              event.sender.send('file-read-error', 'Error reading JSON file');
            } else {
              try {
                const patients = JSON.parse(data);
                console.log('PATIENTS: ', patients);
                event.sender.send('folder-selected', directoryPath, patients);
                event.sender.send('file-read-success', patients);
              } catch (error) {
                console.error('Error parsing JSON file:', error);
                event.sender.send('file-read-error', 'Error parsing JSON file');
              }
            }
          });
        } else {
          event.sender.send('folder-selected', directoryPath);
        }
      }
    } else {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (!result.canceled) {
        const folderPath = result.filePaths[0];
        console.log('Selected folder: ', folderPath);

        // Save the selected directory path
        saveDirectoryPath(folderPath);

        // Check if the folder matches Lead-DBS structure
        if (isLeadDBSFolder(folderPath)) {
          console.log('Lead-DBS folder detected');
          const patients = loadLeadDBSPatients(folderPath);
          console.log('PATIENTS: ', patients);
          event.sender.send('folder-selected', folderPath, patients);
          event.sender.send('file-read-success', patients);
        } else {
          // Regular dataset_description.json loading if it's not Lead-DBS
          const filePath = path.join(folderPath, 'participants.json');
          if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf-8', (err, data) => {
              if (err) {
                console.error('Error reading JSON file:', err);
                event.sender.send('file-read-error', 'Error reading JSON file');
              } else {
                try {
                  const patients = JSON.parse(data);
                  console.log('PATIENTS: ', patients);
                  event.sender.send('folder-selected', folderPath, patients);
                  event.sender.send('file-read-success', patients);
                } catch (error) {
                  console.error('Error parsing JSON file:', error);
                  event.sender.send(
                    'file-read-error',
                    'Error parsing JSON file',
                  );
                }
              }
            });
          } else {
            event.sender.send('folder-selected', folderPath);
          }
        }
      } else {
        event.sender.send('folder-selected', null);
      }
    }
  });

  // Function to read JSON from the provided path
  function readJSON(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');  // Synchronous file read
      return JSON.parse(data);  // Parse and return the JSON data
    } catch (error) {
      console.error(`Error reading JSON file from ${filePath}:`, error);
      return null;  // Return null or handle the error accordingly
    }
  }

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
    const jsonData = readJSON(jsonFilePath);
    const { directoryPath } = jsonData;

    // Step 2: Read the dataset description file to get Lead_Path
    console.log(directoryPath);
    const datasetDescriptionPath = path.join(
      directoryPath,
      'dataset_description.json',
    );
    const datasetDescription = readJSON(datasetDescriptionPath);
    const leadPath = datasetDescription[0].Lead_Path;
    console.log('Lead Path: ', leadPath);
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

  // IPC Handler to gather PLY files when a request is received
  // ipcMain.on('get-ply-files', async (event) => {
  //   try {
  //     // Step 1: Read the main JSON data to get the directoryPath
  //     const jsonData = await readJSON(jsonFilePath);
  //     const { directoryPath } = jsonData;

  //     // Step 2: Read the dataset description file to get Lead_Path
  //     const datasetDescriptionPath = path.join(
  //       directoryPath,
  //       'dataset_description.json',
  //     );
  //     const datasetDescription = await readJSON(datasetDescriptionPath);
  //     const leadPath = datasetDescription[0].Lead_Path;
  //     console.log('Lead Path: ', leadPath);
  //     // Step 3: Go to the 'atlases' folder within the Lead_Path
  //     const atlasesPath = path.join(
  //       leadPath,
  //       'templates',
  //       'space',
  //       'MNI_ICBM_2009b_NLIN_ASYM',
  //       'atlases',
  //     );

  //     // Step 4: Gather PLY files from atlas folders
  //     const plyFiles = await getPlyFilesFromAtlases(atlasesPath);
  //     console.log(plyFiles);
  //     // Send the results back to the renderer
  //     event.reply('ply-files-result', plyFiles);
  //   } catch (error) {
  //     console.error('Error gathering PLY files:', error);
  //     event.reply(
  //       'ply-files-error',
  //       'An error occurred while gathering PLY files.',
  //     );
  //   }
  // });

  ipcMain.handle('get-ply-files', async (event) => {
    try {
      const plyFiles = gatherPlyFiles();  // Your function for gathering files
      return plyFiles;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });

  ipcMain.handle('get-saved-directory', () => {
    return loadDirectoryPath();
  });

  ipcMain.handle('load-ply-file', async (event, directoryPath) => {
    const filePath =
      '/Volumes/Expansion/OLD/Output/Patient0316Output/derivatives/leaddbs/sub-CbctDbs0316/export/ply/combined_electrodes.ply';
    console.log(filePath);
    const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
    return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
  });

  ipcMain.handle('load-ply-file-anatomy', async (event, directoryPath) => {
    const filePath =
      '/Volumes/Expansion/OLD/Output/Patient0316Output/derivatives/leaddbs/sub-CbctDbs0316/export/ply/anatomy.ply';
    console.log(filePath);
    const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
    return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
  });

  ipcMain.handle('load-ply-file-2', async (event, filePath) => {
    try {
      const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
      return fileData.buffer; // Return as ArrayBuffer
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  });

  // Handle writing the JSON file
  ipcMain.on('save-patients-json', (event, folderPath, patients) => {
    const filePath = path.join(folderPath, 'participants.json');

    fs.writeFile(filePath, JSON.stringify(patients, null, 2), (err) => {
      if (err) {
        console.error('Error saving JSON file:', err);
        event.sender.send('json-save-error', 'Error saving file');
      } else {
        event.sender.send('json-saved', 'File saved successfully');
      }
    });
    console.log('');
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
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
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
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
    const newWidth = 1100 * (1 + zoomLevel * 0.14); // Adjust the scale factor as needed
    const newHeight = 1100 * (1 + zoomLevel * 0.1); // Adjust the scale factor as needed
    mainWindow.setSize(newWidth, newHeight);
  }
});

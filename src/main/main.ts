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

console.log = () => {};
console.warn = () => {};
console.error = () => {};

// const args = process.argv.slice(1); // This will include the 'input_file_path' passed from MATLAB
// console.log(args);
// const inputFilePath = args[0]; // Get the first argument
const inputFilePath = '/Users/savirmadan/Documents/Localization/Output/Patient0357Output/derivatives/leaddbs/sub-CbctDbs0357/stimulations/MNI152NLin2009bAsym/inputData.json';
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let stimulationDirectory = '';
let patientID = '';

const startServer = () => {
  // Start the Express server in a child process
  const serverProcess = childProcess.spawn('node', ['dist/server.js'], {
    cwd: path.join(__dirname, '../'), // Adjust the path as needed
    stdio: 'inherit',
  });

  serverProcess.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  serverProcess.on('exit', (code, signal) => {
    console.log('Server process exited with code:', code);
  });

  return serverProcess;
};

app
  .whenReady()
  .then(() => {
    // Start Express server
    const serverProcess = startServer();

    // Create window and other initialization code...
  })
  .catch(console.error);

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  const fs = require('fs');

  // const f = fs.readFileSync('/Users/savirmadan/Documents/GitHub/leaddbs/tempData.json');
  // const f = fs.readFileSync(
  //   '/Users/savirmadan/Development/lead-dbs-programmer/tempData.json',
  // );
  // console.log(f);

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
  // if (currentDirectory) {
  //   const fileName = 'status.json';
  //   const filePath = path.join(result, fileName);
  //   try {
  //     fs.writeFileSync(filePath, '1');
  //   } catch (error) {
  //     console.error('Error writing to file:', error);
  //   }
  // }
  // const separatedLine = f.split('\\\\');
  // console.log(separatedLine);
  // const k = fs.readFileSync(f);
  // console.log(k);
  // event.reply('ipc-example', msgTemplate(`pong: ${f}`));
});

ipcMain.on('import-file', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `${pingPong}`;
  const fs = require('fs');
  const currentDirectory = app.getAppPath();
  const directories = currentDirectory.split('/');

  // Initialize a variable to store the result
  let result = '';

  // Loop through the directories
  for (const dir of directories) {
    // Append each directory to the result
    result += `${dir}/`;

    // If the directory contains "lead-dbs-programmer", stop the loop
    if (dir === 'programmer') {
      break;
    }
  }

  // const prefsFileName = 'Preferences.json';
  // const prefsFilePath = path.join(result, prefsFileName);
  // const k = fs.readFileSync(prefsFilePath);
  // const prefsData = JSON.parse(k);
  // const leadPath = prefsData.LeadDBS_Path;

  // let normalLeadPath = leadPath.replace(/\\\//g, '/');
  // let filePath = path.join(normalLeadPath, 'programmer/inputData.json');
  // // const fileName = 'inputData.json';
  // // const filePath = path.join(result, fileName);
  // console.log(filePath);
  // // const testFilePath = '/Users/savirmadan/Documents/GitHub/leaddbs/lead-dbs-programmer/inputData.json';
  // const f = fs.readFileSync(filePath);
  // const jsonData = JSON.parse(f);
  // let stimPath = jsonData.stimDir;
  // stimulationDirectory = stimPath.replace(/\\\//g, '/');
  // patientID = jsonData.patientname;
  // console.log('STIMDIREC; ', stimulationDirectory);
  // event.reply('import-file', jsonData);

  try {
    // Normalize the lead path
    // let normalLeadPath = leadPath.replace(/\\\//g, '/');
    // let filePath = path.join(normalLeadPath, 'programmer/inputData.json');
    const filePath = inputFilePath;
    console.log(filePath);

    // Read the file
    const f = fs.readFileSync(filePath);

    // Parse the JSON data
    const jsonData = JSON.parse(f);
    console.log(jsonData);
    // Extract and normalize the stimulation directory
    let stimPath = jsonData.stimDir;
    stimulationDirectory = stimPath.replace(/\\\//g, '/');
    patientID = jsonData.patientname;

    // Log and send the data
    console.log('STIMDIREC:', stimulationDirectory);
    event.reply('import-file', jsonData);
  } catch (err) {
    // Handle specific errors
    if (err.code === 'ENOENT') {
      console.error('File not found:', filePath);
    } else if (err.name === 'SyntaxError') {
      console.error('Error parsing JSON:', err.message);
    } else {
      console.error('An unexpected error occurred:', err);
    }
    // Optionally, you could send an error reply to the event
    event.reply('import-file-error', err.message);
  }
});

ipcMain.on('import-previous-files', (event, fileID, importData) => {
  // console.log(fileID);
  // const masterImportData = importData.priorStims;
  // // console.log('MasterimportData: ', masterImportData);
  // let fileKey = '';
  // Object.keys(masterImportData).forEach((key) => {
  //   if (masterImportData[key].name === fileID) {
  //     fileKey = key;
  //   }
  // });
  // const priorStimFolder = masterImportData[fileKey].folder;
  // // console.log('priorStimFolder: ', priorStimFolder);
  // const fileName = importData.patientname + '_desc-stimparameters.json';
  // const filePath = path.join(priorStimFolder, fileID, fileName);
  // // const matData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // // Convert the data to JSON format
  // const f = fs.readFileSync(filePath);
  // const jsonData = JSON.parse(f);
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
  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  const fs = require('fs');

  // const f = fs.readFileSync('/Users/savirmadan/Documents/GitHub/leaddbs/tempData.json');
  const f = fs.readFileSync(arg);
  console.log(event);
  // const separatedLine = f.split('\\\\');
  // console.log(separatedLine);
  // const k = fs.readFileSync(f);
  // console.log(k);
  event.reply('open-file', `pong: ${f}`);
});

// ipcMain.on('close-window', () => {
//   // const currentWindow = BrowserWindow.getFocusedWindow();
//   // if (currentWindow) {
//   //   currentWindow.close();
//   //   event.reply('window-closed', 'Window closed');
//   // }

//   app.quit();
// });

ipcMain.on('close-window', (event, arg) => {
  // setTimeout(() => {
  //   app.quit();
  // }, 5000); // 5000 milliseconds = 5 seconds

  app.quit();

  // const currentWindow = BrowserWindow.getFocusedWindow();
  // if (currentWindow) {
  //   currentWindow.close();
  //   event.reply('window-closed', 'Window closed');
  // }
});

ipcMain.on('close-window-new', (event, arg) => {
  // setTimeout(() => {
  //   app.quit();
  // }, 5000); // 5000 milliseconds = 5 seconds

  const fs = require('fs');

  const f = fs.readFileSync(inputFilePath);

  // Parse the JSON data
  const jsonData = JSON.parse(f);

  let stimPath = jsonData.stimDir;
  stimulationDirectory = stimPath.replace(/\\\//g, '/');
  let newStimFilePath = path.join(stimulationDirectory, 'data.json');

  // Create a valid JSON object
  let jsonDataToWrite = {
    message: 'App Closed Without Saving Parameters',
    timestamp: new Date().toISOString(), // Optional: add a timestamp or any other data
  };

  try {
    // Convert the object to a JSON string
    let dataString = JSON.stringify(jsonDataToWrite, null, 2); // 'null, 2' adds indentation for readability
    // Write the JSON string to the file
    fs.writeFileSync(newStimFilePath, dataString);
    console.log('File written successfully!');
  } catch (error) {
    // Handle the error here
    console.error('Error writing to file:', error);
  }

  app.quit();

  // const currentWindow = BrowserWindow.getFocusedWindow();
  // if (currentWindow) {
  //   currentWindow.close();
  //   event.reply('window-closed', 'Window closed');
  // }
});

const { dialog } = require('electron');
const fs = require('fs');

// ipcMain.on('save-file', (event, file, data) => {
//   // Example of saving data to a file
//   // const filePath = app.getPath('downloads') + '/data.txt';
//   // const currentDirectory = app.getAppPath();
//   // const currentDirectory = '/Users/savirmadan/Development/lead-dbs-programmer';
//   console.log('FILE: ', file);
//   const currentDirectory = app.getAppPath();
//   const directories = currentDirectory.split('/');

//   // Initialize a variable to store the result
//   let result = '';

//   // Loop through the directories
//   for (const dir of directories) {
//     // Append each directory to the result
//     result += `${dir}/`;

//     // If the directory contains "lead-dbs-programmer", stop the loop
//     if (dir === 'programmergroup') {
//       break;
//     }
//   }
//   // console.log(currentDirectory + '/lead-dbs-programmer');
//   if (currentDirectory) {
//     // Convert data to string format
//     const dataString = JSON.stringify(data);
//     const fileName = 'data.json';
//     const filePath = path.join(result, fileName);
//     // const filePath = './dist/main/webpack:/leaddbs-stimcontroller/main.js';
//     // Write data to file
//     try {
//       fs.writeFileSync(filePath, dataString);
//     } catch (error) {
//       // Handle the error here
//       console.error('Error writing to file:', error);
//     }
//     // fs.writeFileSync(file, dataString);

//     // Send a response back to the renderer process
//     event.reply('file-saved', filePath);
//   }
// });

ipcMain.on('save-file', (event, file, data) => {
  // Example of saving data to a file
  // const filePath = app.getPath('downloads') + '/data.txt';
  // const currentDirectory = app.getAppPath();
  // const currentDirectory = '/Users/savirmadan/Development/lead-dbs-programmer';
  console.log('FILE: ', file);
  const currentDirectory = app.getAppPath();
  const directories = currentDirectory.split('/');

  // Initialize a variable to store the result
  let result = '';

  // Loop through the directories
  for (const dir of directories) {
    // Append each directory to the result
    result += `${dir}/`;

    // If the directory contains "lead-dbs-programmer", stop the loop
    if (dir === 'programmer') {
      break;
    }
  }
  // console.log(currentDirectory + '/lead-dbs-programmer');
  if (currentDirectory) {
    // Convert data to string format
    const dataString = JSON.stringify(data);
    // const prefsFileName = 'Preferences.json';
    // const prefsFilePath = path.join(result, prefsFileName);
    // const k = fs.readFileSync(prefsFilePath);
    // const prefsData = JSON.parse(k);
    // const leadPath = prefsData.LeadDBS_Path;
    // let normalLeadPath = leadPath.replace(/\\\//g, '/');
    // let filePath = path.join(normalLeadPath, 'programmer/data.json');

    // trying out new patient specific saving

    const f = fs.readFileSync(inputFilePath);

    // Parse the JSON data
    const jsonData = JSON.parse(f);

    // Extract and normalize the stimulation directory
    let stimPath = jsonData.stimDir;
    stimulationDirectory = stimPath.replace(/\\\//g, '/');
    let newStimFilePath = path.join(stimulationDirectory, 'data.json');
    // console.log('DATALABEL: ', data.S.label);
    // const outputFolder = path.join(stimulationDirectory, data.S.label);
    // const outputFileName = `${patientID}_desc-stimparameters.json`;
    // const outputFilePath = path.join(outputFolder, outputFileName);
    // const fileName = 'data.json';
    // const filePath = path.join(result, fileName);
    // const filePath = './dist/main/webpack:/leaddbs-stimcontroller/main.js';
    // Write data to file
    try {
      // fs.writeFileSync(filePath, dataString);
      console.log(newStimFilePath);
      fs.writeFileSync(newStimFilePath, dataString);
    } catch (error) {
      // Handle the error here
      console.error('Error writing to file:', error);
    }
    // // Extract the directory path from the file path
    // const dir = path.dirname(outputFilePath);

    // // Check if the directory exists
    // if (!fs.existsSync(dir)) {
    //   // If the directory doesn't exist, create it (including any necessary subdirectories)
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    // // Now you can create or open the file
    // fs.writeFileSync(outputFilePath, dataString, { flag: 'w' });
    // fs.writeFileSync(outputFilePath, dataString);

    // Send a response back to the renderer process
    // event.reply('file-saved', filePath);
    event.reply('file-saved', newStimFilePath);
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

// ipcMain.on('open-file', (event, filePath) => {
//   // Read file data
//   const fs = require('fs');
//   fs.readFile(filePath, 'utf8', (err: any, data: any) => {
//     if (err) {
//       // Handle error
//       console.error(err);
//       event.sender.send('file-data', null);
//       return;
//     }
//     // Send data back to renderer process
//     event.sender.send('file-data', data);
//   });
// });

// const { spawn } = require('child_process');

// ipcMain.on('trigger-matlab-action', (event, data) => {
//   const matlabProcess = spawn('matlab', ['-r', 'disp("hello")']);

//   matlabProcess.stdout.on('data', (data) => {
//       console.log(`MATLAB stdout: ${data}`);
//   });

//   matlabProcess.stderr.on('data', (data) => {
//       console.error(`MATLAB stderr: ${data}`);
//   });
// });

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
    width: 1100,
    height: 1100,
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
    const newWidth = 1100 * (1 + zoomLevel * 0.15); // Adjust the scale factor as needed
    const newHeight = 1100 * (1 + zoomLevel * 0.1); // Adjust the scale factor as needed
    mainWindow.setSize(newWidth, newHeight);
  }
});

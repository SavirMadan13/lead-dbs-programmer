import { app, ipcMain, dialog } from 'electron';
import path from 'path';
import { getData, setData } from '../data/data';
import { httpClient } from '../utils/httpClient';

export default function registerFileHandlers() {
  ipcMain.on('ipc-example', async (_event, arg) => {
    console.log('ipc-example');
  });

  // Handle writing the JSON file
  ipcMain.on('save-patients-json', async (event, folderPath, patients) => {
    try {
      let actualFolderPath = folderPath;
      if (!actualFolderPath) {
        const stimulationData = getData('stimulationData');
        console.log('Stimulation Data: ', stimulationData);
        actualFolderPath = stimulationData.path;
      }
      
      console.log('File path: ', actualFolderPath);
      
      const result = await httpClient.savePatientsJson(actualFolderPath, patients);
      event.sender.send('json-saved', 'File saved successfully');
    } catch (error) {
      console.error('Error saving JSON file:', error);
      event.sender.send('json-save-error', 'Error saving file');
    }
  });

  ipcMain.handle('check-folder-exists', async (event, folderPath) => {
    try {
      const result = await httpClient.checkFolderExists(folderPath);
      return result.exists;
    } catch (error) {
      console.error('Error checking folder existence:', error);
      return false;
    }
  });

  ipcMain.on('revert-to-standard', async (event, arg) => {
    const stimulationData = getData('stimulationData');
    stimulationData.type = 'leaddbs';
    if (stimulationData.mode !== 'standalone') {
      stimulationData.mode = 'explore';
    }
    setData('stimulationData', stimulationData);
  });

  ipcMain.on('open-file', async (event, arg) => {
    try {
      const result = await httpClient.readFile(arg);
      event.reply('open-file', `pong: ${result.data}`);
    } catch (error) {
      console.error('Error opening file:', error);
      event.reply('open-file-error', error.message);
    }
  });

  ipcMain.on('save-file', async (event, file, data, historical) => {
    try {
      const result = await httpClient.saveFile(data, historical);
      event.reply('file-saved', result.filePath);
      console.log(`Data saved successfully to ${result.filePath}`);
    } catch (error) {
      console.error('Error writing to file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  ipcMain.on('save-file-stimulate', async (event, file, data) => {
    try {
      console.log('FILE: ', file);
      const result = await httpClient.saveFileStimulate(data);
      console.log('Save result:', result);
      event.reply('file-saved', result.filePath);
    } catch (error) {
      console.error('Error writing to file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  ipcMain.on('save-file-test', async (event, data) => {
    try {
      // This endpoint would need to be implemented in the Python backend
      // For now, we'll use the general save-file-stimulate endpoint
      const result = await httpClient.saveFileStimulate(data);
      event.reply('file-saved', result.filePath);
    } catch (error) {
      console.error('Error writing to file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  ipcMain.on('save-file-clinical', async (event, data, historical, scoretype) => {
    try {
      const result = await httpClient.saveFileClinical(data, historical, scoretype);
      event.reply('file-saved', result.filePath);
      console.log(`Data saved successfully to ${result.filePath}`);
    } catch (error) {
      console.error('Error writing to file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  ipcMain.on('import-file-clinical', async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      if (!id || !timeline || !directoryPath) {
        console.error('Missing patient ID, timeline, or directoryPath');
        event.reply('import-file-error', 'Missing patient ID, timeline, or directoryPath');
        return;
      }

      const result = await httpClient.importFileClinical(id, timeline, directoryPath, leadDBS);
      event.reply('import-file-clinical', result);
    } catch (error) {
      console.error('Error importing clinical file:', error);
      event.reply('import-file-error', error.message);
    }
  });

  ipcMain.on('import-file-clinical-group', async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      console.log('Timeline: ', timeline);
      const result = await httpClient.importFileClinicalGroup(id, timeline, directoryPath, leadDBS);
      event.reply('import-file-clinical-group', result);
    } catch (error) {
      console.error('Error importing clinical group:', error);
      event.reply('import-file-clinical-group-error', error.message);
    }
  });

  ipcMain.on('batch-import', async (event, data, historical, scoretype) => {
    try {
      const result = await httpClient.batchImportClinical(data, historical, scoretype);
      event.reply('batch-import', 'success');
    } catch (error) {
      console.error('Error in batch import:', error);
      event.reply('batch-import-error', error.message);
    }
  });

  ipcMain.on('batch-import-stimulation', async (event, data, leadDBS) => {
    try {
      const result = await httpClient.batchImportStimulation(data, leadDBS);
      event.reply('batch-import-stimulation', 'success');
    } catch (error) {
      console.error('Error in batch import stimulation:', error);
      event.reply('batch-import-stimulation-error', error.message);
    }
  });

  ipcMain.handle('get-clinical-scores-types', async (event, text) => {
    try {
      console.log('text: ', text);
      const result = await httpClient.getClinicalScoresTypes();
      return result;
    } catch (error) {
      console.error('Error reading scores file:', error);
      return null;
    }
  });

  ipcMain.on('add-score-type', async (event, name, newScore) => {
    try {
      console.log('newScore: ', newScore);
      console.log('name: ', name);
      const result = await httpClient.addScoreType(name, newScore);
      console.log('Score type added successfully');
    } catch (error) {
      console.error('Error adding score type:', error);
    }
  });

  ipcMain.handle('get-unit-solutions', async (event, filePath) => {
    try {
      const result = await httpClient.getUnitSolutions(filePath);
      
      // Convert hex strings back to ArrayBuffers for the renderer
      const processedResults = {};
      for (const [key, value] of Object.entries(result)) {
        if (value && typeof value === 'string') {
          processedResults[key] = Buffer.from(value, 'hex').buffer;
        } else {
          processedResults[key] = value;
        }
      }
      
      return processedResults;
    } catch (error) {
      console.error('Error getting unit solutions:', error);
      return {};
    }
  });

  ipcMain.handle('get-participants', async (event, text) => {
    try {
      const result = await httpClient.getParticipants();
      return result;
    } catch (error) {
      console.error('Error getting participants:', error);
      throw error;
    }
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const result = await httpClient.readFile(filePath);
      // Convert hex string back to ArrayBuffer
      return Buffer.from(result.data, 'hex').buffer;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  });

  ipcMain.handle('file-reader', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.on('create-miniset', async (event, folderPath, selectedPatients) => {
    try {
      console.log('folderPath: ', folderPath);
      console.log('selectedPatients: ', selectedPatients);
      
      const result = await httpClient.createMiniset(folderPath, selectedPatients);
      console.log('Miniset created successfully');
    } catch (error) {
      console.error('Error creating miniset:', error);
    }
  });
}

// Additional helper functions that might be needed

export function convertHexToArrayBuffer(hexString: string): ArrayBuffer {
  if (!hexString) return new ArrayBuffer(0);
  return Buffer.from(hexString, 'hex').buffer;
}

export function convertArrayBufferToHex(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('hex');
}
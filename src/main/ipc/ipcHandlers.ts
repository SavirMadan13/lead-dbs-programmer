import { app, ipcMain } from 'electron';
import path from 'path';
import { getData, setData } from '../data/data';
import { getPatientFolder } from '../helpers/helpers';

const fs = require('fs');

export default function registerFileHandlers() {
  ipcMain.on('ipc-example', async (_event, arg) => {
    console.log('ipc-example');
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

  ipcMain.handle('check-folder-exists', (event, folderPath) => {
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

  ipcMain.on('revert-to-standard', async (event, arg) => {
    const stimulationData = getData('stimulationData');
    stimulationData.type = 'leaddbs';
    if (stimulationData.mode !== 'standalone') {
      stimulationData.mode = 'explore';
    }
    setData('stimulationData', stimulationData);
  });

  ipcMain.on('open-file', (event, arg) => {
    const f = fs.readFileSync(arg);
    console.log(event);
    event.reply('open-file', `pong: ${f}`);
  });

  ipcMain.on('save-file', (event, file, data, historical) => {
    const { patient, timeline, directoryPath, leadDBS } = historical;

    if (!patient || !timeline || !directoryPath) {
      console.error('Missing patient, timeline, or directoryPath');
      return;
    }
    // const masterjsonpath = path.join(directoryPath, 'dataset_master.json');
    // Construct the proper folder structure based on the patient ID and timeline
    let patientDir = path.join(directoryPath, `sub-${patient.id}`);
    let sessionDir = path.join(patientDir, `ses-${timeline}`);

    if (leadDBS) {
      const newDirectoryPath = path.join(
        directoryPath,
        'derivatives/leaddbs',
        patient.id,
        'clinical',
      );
      patientDir = path.join(newDirectoryPath);
      sessionDir = path.join(patientDir, `ses-${timeline}`);
    }

    try {
      // Ensure that the directories exist, if not, create them
      if (!fs.existsSync(patientDir))
        fs.mkdirSync(patientDir, { recursive: true });
      if (!fs.existsSync(sessionDir))
        fs.mkdirSync(sessionDir, { recursive: true });

      // Convert the data to a string format (JSON)
      const dataString = JSON.stringify(data, null, 2);

      // Dynamically name the file based on patient and timeline
      let fileName = `sub-${patient.id}_ses-${timeline}_stim.json`;
      let filePath = path.join(sessionDir, fileName);

      if (leadDBS) {
        fileName = `${patient.id}_ses-${timeline}_stimparameters.json`;
        filePath = path.join(sessionDir, fileName);
      }

      // Write the data to the file
      fs.writeFileSync(filePath, dataString);

      // Write the filenpath to the master json script
      const masterjsonpath = path.join(directoryPath, 'dataset_master.json');
      const jsonData = fs.readFileSync(masterjsonpath, 'utf-8');
      const patientId = patient.id.replace('-', '_');
      const masterjsondata = JSON.parse(jsonData);
      // Ensure the timeline session exists
      if (!masterjsondata[patientId].clinicalData[`ses_${timeline}`]) {
        masterjsondata[patientId].clinicalData[`ses_${timeline}`] = [];
      }

      // Now it's safe to push filePath
      masterjsondata[patientId].clinicalData[`ses_${timeline}`].push(filePath);
      fs.writeFileSync(masterjsonpath, JSON.stringify(masterjsondata));
      // Send the file path back to the renderer process
      event.reply('file-saved', filePath);

      console.log(`Data saved successfully to ${filePath}`);
    } catch (error) {
      // Handle any errors in the saving process
      console.error('Error writing to file:', error);
      event.reply('file-save-error', error.message);
    }
  });

  ipcMain.on('save-file-stimulate', (event, file, data) => {
    console.log('FILE: ', file);
    const dataString = JSON.stringify(data);
    // const newStimFilePath = path.join(stimulationDirectory, 'data.json');
    const newStimFilePath = path.join(stimulationData.stimDir, 'data.json');
    console.log(newStimFilePath);
    console.log(dataString);
    try {
      // fs.writeFileSync(filePath, dataString);
      console.log(newStimFilePath);
      fs.writeFileSync(newStimFilePath, dataString);
    } catch (error) {
      // Handle the error here
      console.error('Error writing to file:', error);
    }
    event.reply('file-saved', newStimFilePath);
  });

  ipcMain.on('save-file-clinical', (event, data, historical) => {
    const { patient, timeline, directoryPath, leadDBS } = historical;

    if (!patient || !timeline || !directoryPath) {
      console.error('Missing patient, timeline, or directoryPath');
      return;
    }
    // Construct the proper folder structure based on the patient ID and timeline
    let patientDir = path.join(directoryPath, `sub-${patient.id}`);
    if (leadDBS) {
      patientDir = path.join(
        directoryPath,
        'derivatives',
        'leaddbs',
        `${patient.id}`,
        'clinical',
      );
    }
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
      let fileName = `sub-${patient.id}_ses-${timeline}_clinical.json`;
      if (leadDBS) {
        fileName = `${patient.id}_ses-${timeline}_clinical.json`;
      }
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

  ipcMain.on(
    'import-file-clinical',
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
        // let patientDir = path.join(directoryPath, `sub-${id}`);
        const patientDir = getPatientFolder(directoryPath, id, leadDBS);
        let fileName = `sub-${id}_ses-${timeline}_clinical.json`;
        if (leadDBS) {
          // patientDir = path.join(
          //   directoryPath,
          //   'derivatives/leaddbs',
          //   id,
          //   'clinical',
          // );
          fileName = `${id}_ses-${timeline}_clinical.json`;
        }

        const sessionDir = path.join(patientDir, `ses-${timeline}`);
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

  ipcMain.on(
    'import-file-clinical-group',
    async (event, id, timeline, directoryPath, leadDBS) => {
      const fs = require('fs');
      // const path = require('path');
      console.log('Timeline: ', timeline);
      const outputData = {};
      Object.keys(timeline).forEach((key) => {
        try {
          // Loop through each timeline item and process it individually
          // Construct the file path dynamically
          // let patientDir = path.join(directoryPath, `${id}`);
          const patientDir = getPatientFolder(directoryPath, id, leadDBS);
          let fileName = `${id}_ses-${timeline[key]}_clinical.json`;
          if (leadDBS) {
            // patientDir = path.join(
            //   directoryPath,
            //   'derivatives/leaddbs',
            //   `${id}`,
            //   'clinical',
            // );
            fileName = `${id}_ses-${timeline[key]}_clinical.json`;
          }

          const sessionDir = path.join(patientDir, `ses-${timeline[key]}`);
          const filePath = path.join(sessionDir, fileName);

          // Check if the file exists before trying to read it
          if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            // event.reply(`import-file-clinical-${timeline}`, 'File not found');
            return;
          }

          // Read and parse the JSON data
          const fileData = fs.readFileSync(filePath);
          const jsonData = JSON.parse(fileData);

          // Send the data back to the renderer process for this specific timeline
          console.log(`Sending data for ${timeline[key]}`, jsonData);
          outputData[timeline[key]] = jsonData;
          // event.reply(`import-file-clinical-${timeline}`, jsonData);
        } catch (err) {
          outputData[timeline[key]] = 'Does not exist';
          console.error('An unexpected error occurred:', err);

          // event.reply('import-file-error', err.message);
        }
      });
      event.reply('import-file-clinical-group', outputData);
    },
  );
}
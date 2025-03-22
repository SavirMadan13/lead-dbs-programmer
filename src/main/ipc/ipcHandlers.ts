import { app, ipcMain, dialog } from 'electron';
import path from 'path';
import zlib from 'zlib';
import { getData, setData } from '../data/data';
import { getPatientFolder, getPatientFolderPly } from '../helpers/helpers';

const { execSync } = require('child_process');

const fs = require('fs');

export default function registerFileHandlers() {
  ipcMain.on('ipc-example', async (_event, arg) => {
    console.log('ipc-example');
  });

  // Handle writing the JSON file
  ipcMain.on('save-patients-json', (event, folderPath, patients) => {
    let filePath;
    try {
      filePath = path.join(folderPath, 'participants.json');
    } catch (err) {
      const stimulationData = getData('stimulationData');
      console.log('Stimulation Data: ', stimulationData);
      filePath = path.join(stimulationData.path, 'participants.json');
    }
      console.log('File path: ', filePath);
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
    const stimulationData = getData('stimulationData');
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

  ipcMain.on('save-file-test', (event, data) => {
    const dataString = JSON.stringify(data);
    // const newStimFilePath = path.join(stimulationDirectory, 'data.json');
    const newStimFilePath =
      '/Volumes/PdBwh/CompleteParkinsons/optimized_output.json';
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

  ipcMain.on('save-file-clinical', (event, data, historical, scoretype) => {
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
      if (fs.existsSync(filePath)) {
        const clinicalScores = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        clinicalScores[scoretype] = data;
        fs.writeFileSync(filePath, JSON.stringify(clinicalScores, null, 2));
      } else {
        let clinicalScores = {};
        clinicalScores[scoretype] = data;
        fs.writeFileSync(filePath, JSON.stringify(clinicalScores, null, 2));
      }
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

  // PLY Viewer ipc functions

  ipcMain.handle('load-ply-file', async (event, historical) => {
    const { patient, timeline, directoryPath, leadDBS } = historical;
    if (leadDBS) {
      const patientPath = getPatientFolderPly(
        directoryPath,
        patient.id,
        leadDBS,
      );
      const filePath = path.join(
        patientPath,
        'export/ply/combined_electrodes.ply',
      );
      const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
      return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
    }
    return 'No ply file found'; // Return as ArrayBuffer // send the file contents back to renderer process
  });

  ipcMain.handle('load-ply-file-anatomy', async (event, historical) => {
    const { patient, timeline, directoryPath, leadDBS } = historical;
    if (leadDBS) {
      const patientPath = getPatientFolderPly(
        directoryPath,
        patient.id,
        leadDBS,
      );
      const filePath = path.join(patientPath, 'export/ply/anatomy.ply');
      const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
      return fileData.buffer; // Return as ArrayBuffer // send the file contents back to renderer process
    }
    return 'No ply file found'; // Return as ArrayBuffer // send the file contents back to renderer process
  });

  ipcMain.handle('load-vis-coords', async (event, historical) => {
    const { patient, timeline, directoryPath, leadDBS } = historical;
    console.log(patient);
    if (leadDBS) {
      const patientPath = getPatientFolderPly(
        directoryPath,
        patient.id,
        leadDBS,
      );
      const filePath = path.join(
        patientPath,
        'clinical',
        `${patient.id}_desc-reconstruction.json`,
      );
      const fileData = fs.readFileSync(filePath, 'utf8'); // Read the PLY file as binary
      const jsonData = JSON.parse(fileData); // Parse the string into a JSON object
      return jsonData; // Return as ArrayBuffer // send the file contents back to renderer process
    }
    return 'No coords found'; // Return as ArrayBuffer // send the file contents back to renderer process
  });

  // ipcMain.handle('load-ply-file-2', async (event, filePath) => {

  //   const niiFiles = [];
  //   const atlasesPath = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/space/MNI152NLin2009bAsym/atlases';
  //   try {
  //     const findNiiFiles = (dirPath) => {
  //       const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  //       for (const entry of entries) {
  //         const fullPath = path.join(dirPath, entry.name);
  //         if (entry.isDirectory()) {
  //           findNiiFiles(fullPath);
  //         } else if (entry.isFile() && (entry.name.endsWith('.nii') || entry.name.endsWith('.nii.gz'))) {
  //           niiFiles.push({
  //             fileName: entry.name,
  //             filePath: fullPath,
  //           });
  //         }
  //       }
  //     };

  //     findNiiFiles(atlasesPath);
  //     console.log(niiFiles);
  //   } catch (error) {
  //     console.error('Error reading atlas folders:', error);
  //   }
  //   console.log(niiFiles);
  //   return niiFiles;
  //   // try {
  //   //   // const stnFilePath = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/space/MNI_ICBM_2009b_NLIN_ASYM/atlases/DISTAL Nano (Ewert 2017)/lh/STN.nii';
  //   //   // const fileData = fs.readFileSync(stnFilePath);
  //   //   const stnFilePath = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/space/MNI_ICBM_2009b_NLIN_ASYM/atlases/DISTAL Nano (Ewert 2017)/lh/STN.nii.gz';
  //   //   const compressedData = fs.readFileSync(stnFilePath);
  //   //   const fileData = zlib.gunzipSync(compressedData); // Decompress the .nii.gz file
  //   //   return fileData.buffer;
  //   //   // const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
  //   //   // return fileData.buffer; // Return as ArrayBuffer
  //   // } catch (error) {
  //   //   return null;
  //   // }
  // });

  ipcMain.handle('load-ply-file-2', async (event, filePath) => {
    try {
      const plyData = fs.readFileSync(filePath);
      return plyData.buffer;
    } catch (error) {
      console.error('Error reading atlas folders:', error);
    }
    // try {
    //   // const stnFilePath = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/space/MNI_ICBM_2009b_NLIN_ASYM/atlases/DISTAL Nano (Ewert 2017)/lh/STN.nii';
    //   // const fileData = fs.readFileSync(stnFilePath);
    //   const stnFilePath = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/space/MNI_ICBM_2009b_NLIN_ASYM/atlases/DISTAL Nano (Ewert 2017)/lh/STN.nii.gz';
    //   const compressedData = fs.readFileSync(stnFilePath);
    //   const fileData = zlib.gunzipSync(compressedData); // Decompress the .nii.gz file
    //   return fileData.buffer;
    //   // const fileData = fs.readFileSync(filePath); // Read the PLY file as binary
    //   // return fileData.buffer; // Return as ArrayBuffer
    // } catch (error) {
    //   return null;
    // }
  });

  ipcMain.handle('load-file-buffer', async (event, filePath) => {
    const fileData = fs.readFileSync(filePath);
    if (filePath.endsWith('.gz')) {
      const compressedData = fs.readFileSync(filePath);
      const fileData = zlib.gunzipSync(compressedData); // Decompress the .gz file
      return fileData.buffer;
    }
    return fileData.buffer;
  });

  // Import

  ipcMain.on('batch-import', async (event, data, leadDBS) => {
    const stimulationData = getData('stimulationData');
    const directoryPath = stimulationData.filepath;
    console.log(Object.keys(data));
    Object.keys(data).forEach((key) => {
      const { id, timeline, scores } = data[key];
      const patientFolder = getPatientFolder(directoryPath, id, leadDBS);
      console.log('Patient Folder: ', patientFolder);
      console.log('Scores: ', scores);
      const scoretype = scores['Score Type'];
      // Remove 'Score Type' from scores
      delete scores['Score Type'];
      const sessionDir = path.join(patientFolder, `ses-${timeline}`);
      try {
        // Ensure that the directories exist, if not, create them
        if (!fs.existsSync(patientFolder))
          fs.mkdirSync(patientFolder, { recursive: true });
        if (!fs.existsSync(sessionDir))
          fs.mkdirSync(sessionDir, { recursive: true });
        // Convert the data to a string format (JSON)
        const dataString = JSON.stringify(scores, null, 2);
        // Dynamically name the file based on patient and timeline
        let fileName = `sub-${id}_ses-${timeline}_clinical.json`;
        if (leadDBS) {
          fileName = `${id}_ses-${timeline}_clinical.json`;
        }
        const filePath = path.join(sessionDir, fileName);
        // Write the data to the file
        if (fs.existsSync(filePath)) {
          const clinicalScores = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          clinicalScores[scoretype] = scores;
          fs.writeFileSync(filePath, JSON.stringify(clinicalScores, null, 2));
        } else {
          let clinicalScores = {};
          clinicalScores[scoretype] = scores;
          fs.writeFileSync(filePath, JSON.stringify(clinicalScores, null, 2));
        }
        // Send the file path back to the renderer process
        console.log(`Data saved successfully to ${filePath}`);
      } catch (error) {
        // Handle any errors in the saving process
        console.error('Error writing to file:', error);
      }
    });
    event.reply('batch-import', 'success');
  });

  ipcMain.on('batch-import-stimulation', async (event, data, leadDBS) => {
    const stimulationData = getData('stimulationData');
    const directoryPath = stimulationData.filepath;
    console.log(Object.keys(data));
    console.log(data);
    Object.keys(data).forEach((key) => {
      const { id, S, timeline } = data[key];
      console.log(directoryPath, id);
      const patientFolder = getPatientFolder(directoryPath, id, leadDBS);
      console.log('Patient Folder: ', patientFolder);
      console.log('Scores: ', S);
      const sessionDir = path.join(patientFolder, `ses-${timeline}`);
      try {
        // Ensure that the directories exist, if not, create them
        if (!fs.existsSync(patientFolder))
          fs.mkdirSync(patientFolder, { recursive: true });
        if (!fs.existsSync(sessionDir))
          fs.mkdirSync(sessionDir, { recursive: true });

        // Wrap the S object in an outer shell
        const dataToSave = { S };

        // Convert the data to a string format (JSON)
        const dataString = JSON.stringify(dataToSave, null, 2);

        // Dynamically name the file based on patient and timeline
        let fileName = `sub-${id}_ses-${timeline}_stim.json`;
        if (leadDBS) {
          fileName = `${id}_ses-${timeline}_stimparameters.json`;
        }
        const filePath = path.join(sessionDir, fileName);

        // Write the data to the file
        fs.writeFileSync(filePath, dataString);

        // Send the file path back to the renderer process
        console.log(`Data saved successfully to ${filePath}`);
      } catch (error) {
        // Handle any errors in the saving process
        console.error('Error writing to file:', error);
      }
    });
    event.reply('batch-import-stimulation', 'success');
  });

  ipcMain.handle('get-clinical-scores-types', async (event, text) => {
    console.log('text: ', text);
    const userDataPath = app.getPath('userData');
    const scoresFilePath = path.join(userDataPath, 'ClinicalScores.json');
    console.log('scoresFilePath: ', scoresFilePath);
    try {
      const data = fs.readFileSync(scoresFilePath, 'utf8');
      const scores = JSON.parse(data);
      return scores;
    } catch (err) {
      console.error('Error reading scores file:', err);
      return null;
    }
  });

  ipcMain.on('add-score-type', async (event, name, newScore) => {
    console.log('newScore: ', newScore);
    const userDataPath = app.getPath('userData');
    const scoresFilePath = path.join(userDataPath, 'ClinicalScores.json');
    const data = fs.readFileSync(scoresFilePath, 'utf8');
    const scores = JSON.parse(data);
    console.log('scores: ', scores);
    console.log('name: ', name);
    console.log('newScore: ', newScore);
    scores[name] = newScore[name];
    console.log('scores: ', scores);
    // scores[newScore.name] = newScore.values;
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));
  });

  ipcMain.handle('get-unit-solutions', async (event, filePath) => {
    const patientFolder = '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/stimulations/MNI152NLin2009bAsym/initialize';
    const side = 'rh';
    const OSSFolder = path.join(patientFolder, `OSS_sim_files_${side}`);
    const numContacts = 8;
    const results = {};

    for (let i = 1; i <= numContacts; i++) {
      const contactFolder = path.join(OSSFolder, `ResultsE1C${i}`);
      const niiFilePath = path.join(contactFolder, 'E_field_solution_Lattice.nii');
      // const fileName = `sub-15454_sim-4D_efield_model-ossdbs_hemi-R_desc-C${i}.nii`;
      // const niiFilePath = path.join(patientFolder, fileName);
      try {
        const fileBuffer = fs.readFileSync(niiFilePath);
        results[i-1] = fileBuffer.buffer;
      } catch (error) {
        console.error(`Error reading file for contact E1C${i}:`, error);
        results[`E1C${i}`] = null;
      }
    }
    // const arrayBufferArray = Object.values(results).map(buffer => {
    //   if (buffer) {
    //     return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    //   }
    //   return null;
    // });

    return results;
  });

  ipcMain.handle('get-participants', async (event, text) => {
    const stimulationData = getData('stimulationData');
    const userDataPath = stimulationData.path;
    const participantsFilePath = path.join(userDataPath, 'participants.json');
    console.log('participantsFilePath: ', participantsFilePath);
    const data = fs.readFileSync(participantsFilePath, 'utf8');
    const participants = JSON.parse(data);
    return participants;
  });

  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const data = await fs.promises.readFile(filePath);
      return data.buffer;
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
    console.log('folderPath: ', folderPath);
    console.log('selectedPatients: ', selectedPatients);
    const stimulationData = getData('stimulationData');
    const userDataPath = stimulationData.path;
    const uniqueFolderName = `miniset_${Date.now()}`;
    for (const patientId of selectedPatients) {
      const patientFolder = path.join(userDataPath, 'derivatives', 'leaddbs', patientId);
      const newPatientFolder = path.join(folderPath, uniqueFolderName, 'derivatives', 'leaddbs', patientId);

      // Ensure the new patient directory exists
      if (!fs.existsSync(newPatientFolder)) {
        fs.mkdirSync(newPatientFolder, { recursive: true });
      }

      // Define the subfolders to copy
      const subfolders = ['clinical', 'stimulations', 'export', 'reconstruction'];

      // Use system command to copy each subfolder
      subfolders.forEach((subfolder) => {
        const srcFolder = path.join(patientFolder, subfolder);
        const destFolder = path.join(newPatientFolder, subfolder);

        try {
          if (process.platform === 'win32') {
            // Windows
            execSync(`xcopy "${srcFolder}" "${destFolder}" /E /I /Y`);
          } else {
            // Unix-like (Linux, macOS)
            execSync(`cp -R "${srcFolder}/." "${destFolder}/"`);
          }
          console.log(`Copied ${subfolder} data to: `, destFolder);
        } catch (error) {
          console.error(`Error copying ${subfolder} directory:`, error);
        }
      });
    }
  });
}

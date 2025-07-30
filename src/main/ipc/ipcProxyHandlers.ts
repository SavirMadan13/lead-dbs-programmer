import { ipcMain } from 'electron';
import { FastAPIServerManager } from '../pyserver';

// This file provides IPC handlers that proxy requests to the FastAPI backend
// This ensures compatibility while transitioning to the new backend

export default function registerProxyHandlers(fastAPIServer: FastAPIServerManager) {
  console.log('Registering IPC proxy handlers that forward to FastAPI backend...');

  // Save patients JSON file
  ipcMain.on('save-patients-json', async (event, folderPath, patients) => {
    try {
      console.log('Proxying save-patients-json to FastAPI backend...');
      const result = await fastAPIServer.apiRequest('/api/files/save-patients-json', {
        method: 'POST',
        body: JSON.stringify({ folder_path: folderPath, patients: patients }),
      });
      
      if (result.success) {
        event.sender.send('json-saved', 'File saved successfully');
      } else {
        event.sender.send('json-save-error', result.error || 'Error saving file');
      }
    } catch (error) {
      console.error('Error proxying save-patients-json:', error);
      event.sender.send('json-save-error', error.message);
    }
  });

  // Check if folder exists
  ipcMain.handle('check-folder-exists', async (event, folderPath) => {
    try {
      console.log('Proxying check-folder-exists to FastAPI backend...');
      const result = await fastAPIServer.apiRequest('/api/files/check-folder-exists', {
        method: 'POST',
        body: JSON.stringify({ folder_path: folderPath }),
      });
      
      return result.exists;
    } catch (error) {
      console.error('Error proxying check-folder-exists:', error);
      return false;
    }
  });

  // Revert to standard stimulation
  ipcMain.on('revert-to-standard', async (event, arg) => {
    try {
      console.log('Proxying revert-to-standard to FastAPI backend...');
      const result = await fastAPIServer.apiRequest('/api/stimulation/revert-to-standard', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      
      event.reply('revert-to-standard', result);
    } catch (error) {
      console.error('Error proxying revert-to-standard:', error);
      event.reply('revert-to-standard-error', error.message);
    }
  });

  // Import clinical file
  ipcMain.on('import-file-clinical', async (event, id, timeline, directoryPath, leadDBS) => {
    try {
      console.log('Proxying import-file-clinical to FastAPI backend...');
      const result = await fastAPIServer.apiRequest(`/api/clinical/import/${id}/${timeline}`, {
        method: 'POST',
        body: JSON.stringify({ directory_path: directoryPath, lead_dbs: leadDBS }),
      });
      
      event.reply('import-file-clinical', result);
    } catch (error) {
      console.error('Error proxying import-file-clinical:', error);
      event.reply('import-file-error', error.message);
    }
  });

  // Save clinical file
  ipcMain.on('save-file-clinical', async (event, id, timeline, directoryPath, data, scoretype, leadDBS) => {
    try {
      console.log('Proxying save-file-clinical to FastAPI backend...');
      const result = await fastAPIServer.apiRequest(`/api/clinical/save/${id}/${timeline}`, {
        method: 'POST',
        body: JSON.stringify({ 
          directory_path: directoryPath, 
          data: data, 
          score_type: scoretype, 
          lead_dbs: leadDBS 
        }),
      });
      
      event.reply('file-saved', result.file_path);
    } catch (error) {
      console.error('Error proxying save-file-clinical:', error);
      event.reply('file-save-error', error.message);
    }
  });

  // Batch import handlers
  ipcMain.on('batch-import', async (event, data, leadDBS) => {
    try {
      console.log('Proxying batch-import to FastAPI backend...');
      const result = await fastAPIServer.apiRequest('/api/clinical/batch-import', {
        method: 'POST',
        body: JSON.stringify({ data: data, lead_dbs: leadDBS }),
      });
      
      event.reply('batch-import', 'success');
    } catch (error) {
      console.error('Error proxying batch-import:', error);
      event.reply('batch-import-error', error.message);
    }
  });

  ipcMain.on('batch-import-stimulation', async (event, data, leadDBS) => {
    try {
      console.log('Proxying batch-import-stimulation to FastAPI backend...');
      const result = await fastAPIServer.apiRequest('/api/stimulation/batch-import', {
        method: 'POST',
        body: JSON.stringify({ data: data, lead_dbs: leadDBS }),
      });
      
      event.reply('batch-import-stimulation', 'success');
    } catch (error) {
      console.error('Error proxying batch-import-stimulation:', error);
      event.reply('batch-import-stimulation-error', error.message);
    }
  });

  console.log('IPC proxy handlers registered successfully!');
}
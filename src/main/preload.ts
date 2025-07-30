// import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron';

// export type Channels = 'ipc-example';

// const electronHandler = {
//   ipcRenderer: {
//     sendMessage(channel: Channels, ...args: unknown[]) {
//       ipcRenderer.send(channel, ...args);
//     },
//     on(channel: Channels, func: (...args: unknown[]) => void) {
//       const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
//         func(...args);
//       ipcRenderer.on(channel, subscription);

//       return () => {
//         ipcRenderer.removeListener(channel, subscription);
//       };
//     },
//     once(channel: Channels, func: (...args: unknown[]) => void) {
//       ipcRenderer.once(channel, (_event, ...args) => func(...args));
//     },
//   },
// };

// contextBridge.exposeInMainWorld('electron', electronHandler);

// export type ElectronHandler = typeof electronHandler;

// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  webFrame,
} from 'electron';

export type Channels = 'ipc-example';

const API_BASE_URL = 'http://127.0.0.1:8000';

// FastAPI client helper
const apiClient = {
  async request(endpoint: string, options: any = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  },

  async get(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    return this.request(url.pathname + url.search);
  },

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};

const electronHandler = {
  // FastAPI integration
  api: {
    // Core API methods
    get: apiClient.get.bind(apiClient),
    post: apiClient.post.bind(apiClient),
    put: apiClient.put.bind(apiClient),
    delete: apiClient.delete.bind(apiClient),
    request: apiClient.request.bind(apiClient),
    
    // Specific API endpoints for easy access
    async getHealth() {
      return apiClient.get('/health');
    },

    // Patient endpoints
    async getPatients(directoryPath?: string) {
      return apiClient.get('/api/patients/', directoryPath ? { directory_path: directoryPath } : {});
    },

    async getPatient(patientId: string, directoryPath?: string) {
      return apiClient.get(`/api/patients/${patientId}`, directoryPath ? { directory_path: directoryPath } : {});
    },

    async getPatientTimelines(patientId: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.get(`/api/patients/${patientId}/timelines`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },

    // File operations
    async importInputData(filePath: string) {
      return apiClient.post('/api/files/import-inputdata', { file_path: filePath });
    },

    async importFile(id: string, timeline: string, directoryPath: string, leadDBS: boolean = false) {
      return apiClient.post('/api/files/import', { id, timeline, directoryPath, leadDBS });
    },

    async saveFile(patient: any, timeline: string, directoryPath: string, data: any, leadDBS: boolean = false) {
      return apiClient.post('/api/files/save', { patient, timeline, directoryPath, data, leadDBS });
    },

    async selectFolder(directoryPath: string) {
      return apiClient.post('/api/files/select-folder', { directory_path: directoryPath });
    },

    async getTimelines(patientId: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.get(`/api/files/timelines/${patientId}`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },

    // Clinical data
    async importClinicalFile(patientId: string, timeline: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.post(`/api/clinical/import/${patientId}/${timeline}`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },

    async saveClinicalFile(patientId: string, timeline: string, directoryPath: string, data: any, scoreType: string, leadDbs: boolean = false) {
      return apiClient.post(`/api/clinical/save/${patientId}/${timeline}`, data, {
        headers: { 'Content-Type': 'application/json' },
        params: { directory_path: directoryPath, score_type: scoreType, lead_dbs: leadDbs },
      });
    },

    async getClinicalScoresTypes() {
      return apiClient.get('/api/clinical/scores-types');
    },

    async addScoreType(name: string, newScore: any) {
      return apiClient.post('/api/clinical/add-score-type', { name, new_score: newScore });
    },

    async batchImportClinical(data: any, leadDbs: boolean = false) {
      return apiClient.post('/api/clinical/batch-import', { data, lead_dbs: leadDbs });
    },

    // Stimulation data
    async getStimulationData() {
      return apiClient.get('/api/stimulation/data');
    },

    async setStimulationData(data: any) {
      return apiClient.post('/api/stimulation/data', data);
    },

    async saveStimulationFile(patientId: string, timeline: string, directoryPath: string, data: any, leadDbs: boolean = false) {
      return apiClient.post(`/api/stimulation/save/${patientId}/${timeline}`, { directory_path: directoryPath, data, lead_dbs: leadDbs });
    },

    async batchImportStimulation(data: any, leadDbs: boolean = false) {
      return apiClient.post('/api/stimulation/batch-import', { data, lead_dbs: leadDbs });
    },

    // Visualization
    async getPlyFiles() {
      return apiClient.get('/api/visualization/ply-files');
    },

    async loadPlyFile(patientId: string, timeline: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.get(`/api/visualization/load-ply/${patientId}/${timeline}`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },

    async loadPlyFileAnatomy(patientId: string, timeline: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.get(`/api/visualization/load-ply-anatomy/${patientId}/${timeline}`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },

    async loadVisualizationCoords(patientId: string, directoryPath: string, leadDbs: boolean = false) {
      return apiClient.get(`/api/visualization/load-vis-coords/${patientId}`, { directory_path: directoryPath, lead_dbs: leadDbs });
    },
  },

  // Keep some IPC functionality for window management
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  },

  // Window management
  zoom: {
    setZoomLevel(level: any) {
      webFrame.setZoomLevel(level);
      ipcRenderer.on('zoom-level-changed', (event, zoomLevel) => {
        webFrame.setZoomLevel(zoomLevel);
      });
    },
  },

  // Legacy compatibility - these will use API calls instead of IPC
  selectFolder: async (directoryPath?: string) => {
    if (directoryPath) {
      return apiClient.post('/api/files/select-folder', { directory_path: directoryPath });
    }
    // For now, fallback to IPC for folder dialog
    return new Promise((resolve) => {
      ipcRenderer.send('select-folder');
      ipcRenderer.once('folder-selected', (event, result) => {
        resolve(result);
      });
    });
  },

  getClinicalScores: async () => {
    return apiClient.get('/api/clinical/scores-types');
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

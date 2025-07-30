import fetch from 'electron-fetch';

const BASE_URL = 'http://127.0.0.1:8000';

interface ApiResponse<T = any> {
  data?: T;
  status: string;
  message?: string;
  error?: string;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`HTTP request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Specialized methods for the Lead DBS API
  async importInputDataFile(inputPath: string) {
    return this.post('/api/import-inputdata-file', { input_path: inputPath });
  }

  async importFile(patientId: string, timeline: string, directoryPath: string, leadDBS: boolean = false) {
    return this.post('/api/import-file', {
      patient_id: patientId,
      timeline,
      directory_path: directoryPath,
      lead_dbs: leadDBS
    });
  }

  async getStimulationData() {
    return this.get('/api/stimulation-data');
  }

  async saveFile(data: any, historical: any) {
    return this.post('/api/save-file', {
      data,
      historical
    });
  }

  async saveFileClinical(data: any, historical: any, scoreType: string) {
    return this.post('/api/save-file-clinical', {
      data,
      historical,
      scoretype: scoreType
    });
  }

  async importFileClinical(patientId: string, timeline: string, directoryPath: string, leadDBS: boolean = false) {
    return this.post('/api/import-file-clinical', {
      patient_id: patientId,
      timeline,
      directory_path: directoryPath,
      lead_dbs: leadDBS
    });
  }

  async checkFolderExists(folderPath: string) {
    return this.get('/api/check-folder-exists', { folder_path: folderPath });
  }

  async savePatientsJson(folderPath: string, patients: any[]) {
    return this.post('/api/save-patients-json', {
      folder_path: folderPath,
      patients
    });
  }

  async getTimelines(directoryPath: string, patientId: string, leadDBS: boolean = false) {
    return this.get('/api/get-timelines', {
      directory_path: directoryPath,
      patient_id: patientId,
      lead_dbs: leadDBS.toString()
    });
  }

  async getClinicalData(directoryPath: string, patientsWithTimelines: any[]) {
    return this.get('/api/get-clinical-data', {
      directory_path: directoryPath,
      patients_with_timelines: JSON.stringify(patientsWithTimelines)
    });
  }

  async loadPlyFileDatabase(patientId: string, sessionId: string) {
    return this.get('/api/load-ply-file-database', {
      patient_id: patientId,
      session_id: sessionId
    });
  }

  async loadReconstruction(patientId: string, directoryPath: string) {
    return this.get('/api/load-reconstruction', {
      patient_id: patientId,
      directory_path: directoryPath
    });
  }

  async getParticipants() {
    return this.get('/api/get-participants');
  }

  async readFile(filePath: string) {
    return this.get('/api/read-file', { file_path: filePath });
  }

  async createMiniset(folderPath: string, selectedPatients: string[]) {
    return this.post('/api/create-miniset', {
      folderPath,
      selectedPatients
    });
  }

  async batchImportClinical(data: any, historical: any, scoreType: string) {
    return this.post('/api/batch-import-clinical', {
      data,
      historical,
      scoretype: scoreType
    });
  }

  async batchImportStimulation(data: any, leadDBS: boolean) {
    return this.post('/api/batch-import-stimulation', {
      data,
      leadDBS
    });
  }

  async getClinicalScoresTypes() {
    return this.get('/api/get-clinical-scores-types');
  }

  async addScoreType(name: string, newScore: any) {
    return this.post('/api/add-score-type', {
      name,
      new_score: newScore
    });
  }

  async getUnitSolutions(filePath: string) {
    return this.get('/api/get-unit-solutions', { file_path: filePath });
  }

  async saveFileStimulate(data: any) {
    return this.post('/api/save-file-stimulate', data);
  }

  async importFileClinicalGroup(patientId: string, timelines: any, directoryPath: string, leadDBS: boolean = false) {
    return this.post('/api/import-file-clinical-group', {
      patient_id: patientId,
      timelines,
      directory_path: directoryPath,
      lead_dbs: leadDBS
    });
  }

  async getPlyFiles() {
    return this.get('/api/get-ply-files');
  }

  async getPlyFilesDatabase() {
    return this.get('/api/get-ply-files-database');
  }
}

// Create a singleton instance
export const httpClient = new HttpClient();
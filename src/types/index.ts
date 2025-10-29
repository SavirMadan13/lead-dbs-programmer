/**
 * Type definitions for the Lead-DBS Programmer application
 * 
 * This file contains all TypeScript type definitions used throughout the application
 * to ensure type safety and better developer experience.
 */

// ============================================================================
// Core Application Types
// ============================================================================

export interface Patient {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  diagnosis?: string;
  elmodel?: string;
  [key: string]: any; // Allow for additional patient properties
}

export interface Timeline {
  timeline: string;
  hasClinical: boolean;
  hasStimulation: boolean;
}

export interface StimulationData {
  mode: 'standalone' | 'explore' | 'stimulate';
  type: 'leaddbs' | 'leadgroup';
  path?: string;
  filepath?: string;
  patientname?: string | string[];
  electrodeModels?: string | string[];
  patientfolders?: string[][];
  labels?: string[];
  label?: string;
  S?: any;
  leadpath?: string;
}

export interface ClinicalScores {
  [scoreType: string]: {
    [field: string]: number;
  };
}

export interface ElectrodeModel {
  displayName: string;
  value: string;
  numel?: number;
}

export interface IPGModel {
  name: string;
  type: 'Boston' | 'Abbott' | 'Medtronic_Activa' | 'Medtronic_Percept' | 'Research';
}

// ============================================================================
// IPC Communication Types
// ============================================================================

export interface IPCMessage {
  channel: string;
  data?: any;
  error?: string;
}

export interface FileOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  filePath?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface PatientDatabaseProps {
  key?: string;
  directoryPath: string | null;
}

export interface PatientDetailsProps {
  directoryPath: string | null;
  leadDBS: boolean | null;
}

export interface ClinicalScoresProps {
  patient?: Patient;
  timeline?: string;
  directoryPath?: string;
  leadDBS?: boolean;
}

export interface ProgrammerProps {
  patient?: Patient;
  timeline?: string;
  directoryPath?: string;
  leadDBS?: boolean;
}

// ============================================================================
// State Management Types
// ============================================================================

export interface PatientContextType {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

export interface AppState {
  directoryPath: string | null;
  showSettings: boolean;
  renderKey: number;
  isLeadDBSFolder: boolean | null;
  dimensions: { width: number; height: number };
  zoomLevel: number;
}

// ============================================================================
// File System Types
// ============================================================================

export interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export interface DirectoryStructure {
  path: string;
  type: 'leaddbs' | 'standard';
  patients: Patient[];
  timelines: Timeline[];
}

// ============================================================================
// Stimulation Parameter Types
// ============================================================================

export interface StimulationParameters {
  amplitude: number[];
  frequency: number;
  pulseWidth: number;
  contacts: ContactConfiguration[];
  model: string;
  IPG: string;
}

export interface ContactConfiguration {
  contact: number;
  amplitude: number;
  polarity: 'left' | 'center' | 'right';
  percentage: number;
}

export interface ElectrodeConfiguration {
  leftElectrode: string;
  rightElectrode: string;
  IPG: string;
  allQuantities: { [key: string]: { [key: string]: number } };
  allSelectedValues: { [key: string]: { [key: string]: string } };
  allTotalAmplitudes: { [key: string]: number };
  allTogglePositions: { [key: string]: string };
  allVolAmpToggles: { [key: string]: string };
  visModel: string;
}

// ============================================================================
// Visualization Types
// ============================================================================

export interface VisualizationModel {
  id: string;
  name: string;
  description: string;
  parameters: any;
}

export interface PlotData {
  x: number[];
  y: number[];
  type: string;
  name?: string;
  color?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  code: string;
  context?: string;
  originalError?: Error;
  timestamp: Date;

  constructor(code: string, message: string, originalError?: Error, context?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.originalError = originalError;
    this.timestamp = new Date();
  }
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorInfo {
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: ErrorContext;
  originalError?: Error;
  userMessage?: string;
  canRetry?: boolean;
  retryAction?: () => void;
}

export const ERROR_CODES = {
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  DIRECTORY_CREATE_ERROR: 'DIRECTORY_CREATE_ERROR',
  JSON_PARSE_ERROR: 'JSON_PARSE_ERROR',
  JSON_STRINGIFY_ERROR: 'JSON_STRINGIFY_ERROR',
  WINDOW_CREATE_ERROR: 'WINDOW_CREATE_ERROR',
  IPC_HANDLER_ERROR: 'IPC_HANDLER_ERROR',
  DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
  PATIENT_FOLDER_ERROR: 'PATIENT_FOLDER_ERROR',
  PATIENT_PLY_FOLDER_ERROR: 'PATIENT_PLY_FOLDER_ERROR',
  RELATIVE_PATH_ERROR: 'RELATIVE_PATH_ERROR',
  ABSOLUTE_PATH_ERROR: 'ABSOLUTE_PATH_ERROR',
  FILE_COPY_ERROR: 'FILE_COPY_ERROR',
  FILE_DELETE_ERROR: 'FILE_DELETE_ERROR',
  JSON_WRITE_ERROR: 'JSON_WRITE_ERROR'
} as const;

// ============================================================================
// Core Architecture Types
// ============================================================================

export interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

export interface LoggerConfig {
  logLevel: keyof LogLevel;
  logToFile: boolean;
  maxLogFileSize: number;
  maxLogFiles: number;
}

export interface WindowState {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isMaximized: boolean;
  isMinimized: boolean;
  isFocused: boolean;
}

export interface PatientTimeline {
  patientId: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  date: string;
  clinicalScores?: ClinicalScores;
  stimulationData?: StimulationData;
}

export interface ScoreType {
  name: string;
  description: string;
  min: number;
  max: number;
  unit: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface AppConfig {
  version: string;
  buildDate: string;
  electronVersion: string;
  nodeVersion: string;
  chromeVersion: string;
  name: string;
  description: string;
  author: string;
  license: string;
  repository: string;
  bugs: string;
  homepage: string;
  main: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  build: Record<string, any>;
  electron: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  defaultElectrodeModel: string;
  defaultIPG: string;
  autoSave: boolean;
  showAdvancedOptions: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Performance Types
// ============================================================================

export interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  memoryUsage?: number;
  fps?: number;
}

export interface PerformanceConfig {
  enableMonitoring: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxMetricsHistory: number;
  reportInterval: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export type NonEmptyArray<T> = [T, ...T[]];

export type ReadonlyRecord<K extends string | number | symbol, V> = Readonly<Record<K, V>>;

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

// ============================================================================
// Event Types
// ============================================================================

export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}

export interface PatientEvent extends AppEvent {
  type: 'patient.created' | 'patient.updated' | 'patient.deleted';
  payload: {
    patient: Patient;
    previousPatient?: Patient;
  };
}

export interface StimulationEvent extends AppEvent {
  type: 'stimulation.updated' | 'stimulation.exported';
  payload: {
    patient: Patient;
    timeline: string;
    parameters: StimulationParameters;
  };
}

// ============================================================================
// Constants
// ============================================================================

export const ELECTRODE_MODELS: ElectrodeModel[] = [
  { displayName: 'Medtronic 3389', value: 'medtronic_3389' },
  { displayName: 'Medtronic 3387', value: 'medtronic_3387' },
  { displayName: 'Medtronic 3391', value: 'medtronic_3391' },
  { displayName: 'Boston Scientific Vercise', value: 'boston_vercise' },
  { displayName: 'Boston Scientific Vercise Directed', value: 'boston_vercise_directed' },
  // Add more electrode models as needed
];

export const IPG_MODELS: IPGModel[] = [
  { name: 'Boston', type: 'Boston' },
  { name: 'Abbott', type: 'Abbott' },
  { name: 'Medtronic Activa', type: 'Medtronic_Activa' },
  { name: 'Medtronic Percept', type: 'Medtronic_Percept' },
  { name: 'Research', type: 'Research' },
];

export const VISUALIZATION_MODELS: VisualizationModel[] = [
  { id: '1', name: 'Dembek 2017', description: 'Dembek et al. 2017 model' },
  { id: '2', name: 'Fastfield (Baniasadi 2020)', description: 'Baniasadi et al. 2020 model' },
  { id: '3', name: 'SimBio/FieldTrip (see Horn 2017)', description: 'Horn et al. 2017 model' },
  { id: '4', name: 'Kuncel 2008', description: 'Kuncel et al. 2008 model' },
  { id: '5', name: 'Maedler 2012', description: 'Maedler et al. 2012 model' },
  { id: '6', name: 'OSS-DBS (Butenko 2020)', description: 'Butenko et al. 2020 model' },
];

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_PATIENT: Patient = {
  id: '',
  name: '',
  age: 0,
  gender: '',
  diagnosis: '',
  elmodel: 'boston_vercise_directed',
};

export const DEFAULT_STIMULATION_DATA: StimulationData = {
  mode: 'explore',
  type: 'leaddbs',
  path: '',
  filepath: '',
  patientname: '',
  electrodeModels: 'boston_vercise_directed',
  labels: [],
  S: {},
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  version: '1.1.0',
  buildDate: new Date().toISOString(),
  electronVersion: process.versions.electron || '',
  nodeVersion: process.versions.node || '',
  chromeVersion: process.versions.chrome || '',
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  defaultElectrodeModel: 'boston_vercise_directed',
  defaultIPG: 'Boston',
  autoSave: true,
  showAdvancedOptions: false,
};
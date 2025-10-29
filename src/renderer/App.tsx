/**
 * Main Application Component
 * 
 * This is the root component of the LeadDBS Programmer application.
 * It manages the overall application state, routing, and provides the main UI structure.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import error handling
import { ErrorBoundary, ErrorFallback } from './utils/ErrorHandler';
import { initializeErrorHandling } from './utils/GlobalErrorHandler';

// Import performance monitoring
import PerformanceMonitor from './components/PerformanceMonitor';
import { usePerformanceMonitor } from './utils/PerformanceUtils';

// Import components
import Navbar from './components/Navbar';
import PatientDatabase from './components/PatientDatabase';
import PatientDetails from './components/PatientDetails';
import Programmer from './Programmer';
import ClinicalScores from './components/ClinicalScores';
import CustomTable from './components/CustomTable';
import GroupStats from './components/GroupStats';
import DatabaseStats from './components/DatabaseStats';
import Import from './components/Import';
import SEEG from './components/SEEG';
import TestApp from './niivue/ui/TestApp';

// Import context providers
import { PatientProvider } from './components/PatientContext';

// Import styles
import './App.css';

/**
 * Application state interface
 */
interface AppState {
  directoryPath: string | null;
  showSettings: boolean;
  renderKey: number;
  isLeadDBSFolder: boolean | null;
  dimensions: { width: number; height: number };
  zoomLevel: number;
}

/**
 * Default PLY file paths for testing
 */
const DEFAULT_PLY_PATHS = [
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/export/ply/anatomy.ply',
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-15454/export/ply/combined_electrodes.ply',
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-29781/export/ply/combined_electrodes.ply',
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-33544/export/ply/combined_electrodes.ply',
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-80206/export/ply/combined_electrodes.ply',
  '/Users/savirmadan/Documents/Localizations/OSF/LeadDBSTrainingDataset/derivatives/leaddbs/sub-93127/export/ply/combined_electrodes.ply',
];

/**
 * Main Application Component
 */
export default function App(): JSX.Element {
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor('App');

  // State management
  const [state, setState] = useState<AppState>({
    directoryPath: null,
    showSettings: false,
    renderKey: 0,
    isLeadDBSFolder: null,
    dimensions: { width: 0, height: 0 },
    zoomLevel: -1,
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Update window size based on container dimensions
   */
  const updateWindowSize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setState(prevState => ({
        ...prevState,
        dimensions: { width, height }
      }));
      
      // Notify main process of window size change
      window.electron.ipcRenderer.sendMessage('resize-window-2', width, height);
    }
  }, []);

  /**
   * Handle folder selection
   */
  const handleSelectFolder = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('select-folder', null);
  }, []);

  /**
   * Toggle settings panel visibility
   */
  const toggleSettings = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      showSettings: !prevState.showSettings
    }));
  }, []);

  /**
   * Handle folder selection from IPC
   */
  const handleFolderSelected = useCallback((selectedPath: string) => {
    setState(prevState => ({
      ...prevState,
      directoryPath: selectedPath,
      renderKey: prevState.renderKey + 1,
      isLeadDBSFolder: true // Default to true for now
    }));
  }, []);

  /**
   * Load saved directory path on application start
   */
  const loadSavedDirectory = useCallback(async () => {
    try {
      const savedPath = await window.electron.ipcRenderer.invoke('get-saved-directory');
      if (savedPath) {
        setState(prevState => ({
          ...prevState,
          directoryPath: savedPath
        }));
        window.electron.ipcRenderer.sendMessage('select-folder', savedPath);
      }
    } catch (error) {
      console.error('Failed to load saved directory:', error);
    }
  }, []);

  /**
   * Initialize application on mount
   */
  useEffect(() => {
    // Initialize error handling
    initializeErrorHandling();

    // Set up IPC listeners
    const unsubscribe = window.electron.ipcRenderer.on('folder-selected', handleFolderSelected);

    // Load saved directory
    loadSavedDirectory();

    // Send initial IPC messages
    window.electron.ipcRenderer.sendMessage('import-inputdata-file', ['ping']);
    window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [handleFolderSelected, loadSavedDirectory]);

  /**
   * Update zoom level when it changes
   */
  useEffect(() => {
    window.electron.zoom.setZoomLevel(state.zoomLevel);
  }, [state.zoomLevel]);

  /**
   * Render settings panel
   */
  const renderSettingsPanel = (): JSX.Element => (
    <div className="settings-panel">
      <button className="select-button" onClick={handleSelectFolder}>
        Change Directory
      </button>
      {state.directoryPath && (
        <p className="selected-directory">
          Selected Directory: {state.directoryPath}
        </p>
      )}
      {state.isLeadDBSFolder !== null && (
        <p className="lead-dbs-status">
          {state.isLeadDBSFolder 
            ? 'This is a Lead-DBS folder.' 
            : 'This is not a Lead-DBS folder.'
          }
        </p>
      )}
    </div>
  );

  /**
   * Render main dashboard
   */
  const renderMainDashboard = (): JSX.Element => (
    <div style={{ marginTop: '0px' }}>
      <Navbar text="" color1="#375D7A" />
      <div className="Navbar">
        <SettingsIcon
          className="settings-icon"
          onClick={toggleSettings}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            color: '#6c757d',
            zIndex: '10',
            marginLeft: '-70px',
          }}
        />
        {state.showSettings && renderSettingsPanel()}
      </div>
      <PatientDatabase
        key={state.renderKey}
        directoryPath={state.directoryPath}
      />
    </div>
  );

  /**
   * Render patient details page
   */
  const renderPatientDetails = (): JSX.Element => (
    <div>
      <Navbar text="" color1="#375D7A" />
      <div style={{ paddingTop: '50px' }}></div>
      <PatientDetails
        directoryPath={state.directoryPath}
        leadDBS={state.isLeadDBSFolder}
      />
    </div>
  );

  /**
   * Render clinical scores page
   */
  const renderClinicalScores = (): JSX.Element => (
    <div>
      <ClinicalScores />
    </div>
  );

  /**
   * Render custom table page
   */
  const renderCustomTable = (): JSX.Element => (
    <div style={{ maxWidth: '1000px' }}>
      <CustomTable />
    </div>
  );

  /**
   * Render group stats page
   */
  const renderGroupStats = (): JSX.Element => (
    <div style={{ maxWidth: '1000px' }}>
      <GroupStats />
    </div>
  );

  /**
   * Render database stats page
   */
  const renderDatabaseStats = (): JSX.Element => (
    <div>
      <Navbar text="" color1="#375D7A" />
      <div style={{ paddingTop: '100px' }}></div>
      <DatabaseStats directoryPath={state.directoryPath} />
    </div>
  );

  /**
   * Render import page
   */
  const renderImport = (): JSX.Element => (
    <div style={{ maxWidth: '1000px' }}>
      <Import leadDBS={state.isLeadDBSFolder} />
    </div>
  );

  /**
   * Render NiiVue viewer page
   */
  const renderNiiVue = (): JSX.Element => (
    <div>
      <div style={{ marginTop: '100px' }}>
        <TestApp plyFilePaths={DEFAULT_PLY_PATHS} />
      </div>
    </div>
  );

  /**
   * Render SEEG page
   */
  const renderSEEG = (): JSX.Element => (
    <div>
      <Navbar text="Lead-SEEG" color1="#375D7A" />
      <SEEG />
    </div>
  );

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <PatientProvider>
          <Router>
            <Routes>
              <Route path="/" element={renderMainDashboard()} />
              <Route path="/patient/:id" element={renderPatientDetails()} />
              <Route path="/programmer" element={<Programmer />} />
              <Route path="/clinical-scores" element={renderClinicalScores()} />
              <Route path="/viewer" element={<div style={{ maxWidth: '1000px' }}></div>} />
              <Route path="/custom-table" element={renderCustomTable()} />
              <Route path="/group" element={renderGroupStats()} />
              <Route path="/groupstats" element={renderDatabaseStats()} />
              <Route path="/import" element={renderImport()} />
              <Route path="/niivue" element={renderNiiVue()} />
              <Route path="/seeg" element={renderSEEG()} />
            </Routes>
          </Router>
        </PatientProvider>
        
        {/* Performance Monitor - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <PerformanceMonitor
            visible={true}
            position="top-right"
            showDetails={true}
            customMetrics={performanceMetrics}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
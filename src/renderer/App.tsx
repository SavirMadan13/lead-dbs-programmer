/* eslint-disable import/no-duplicates */
import { useState, useEffect, useRef } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Ensure your styles are imported
import SettingsIcon from '@mui/icons-material/Settings'; // Import the Material UI Settings Icon
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDatabase from './components/PatientDatabase';
import PatientDetails from './components/PatientDetails';
import { PatientProvider } from './components/PatientContext';
import Programmer from './Programmer';
import ClinicalScores from './components/ClinicalScores';
import CustomTable from './components/CustomTable';
import GroupStats from './components/GroupStats';
import DatabaseStats from './components/DatabaseStats';
import Import from './components/Import';
import NiiViewer from './components/NiiViewer';
import TestApp from './niivue/ui/TestApp';
import SEEG from './components/SEEG';

export default function App() {
  const [directoryPath, setDirectoryPath] = useState(null);
  const [showSettings, setShowSettings] = useState(false); // New state to control visibility
  const [renderKey, setRenderKey] = useState(0);
  const [isLeadDBSFolder, setIsLeadDBSFolder] = useState(false); // New state to track if it's a Lead-DBS folder
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const updateWindowSize = () => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      window.electron.ipcRenderer.sendMessage('resize-window-2', width, height);
    }
  };

  // useEffect(() => {
  //   // Set initial size on load
  //   updateWindowSize();

  //   // Add resize observer to track dynamic changes
  //   const resizeObserver = new ResizeObserver(() => {
  //     updateWindowSize();
  //   });

  //   if (containerRef.current) {
  //     resizeObserver.observe(containerRef.current);
  //   }

  //   return () => {
  //     if (containerRef.current) {
  //       resizeObserver.unobserve(containerRef.current);
  //     }
  //   };
  // }, []);

  // Function to handle folder selection
  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-folder', null); // Request folder selection
  };
  // window.electron.ipcRenderer.sendMessage('load-ply-file', null);
  window.electron.ipcRenderer.sendMessage('import-inputdata-file', ['ping']);
  window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
  // Function to check if the folder structure matches Lead-DBS
  const checkLeadDBSFolder = async (path) => {
    try {
      // Check for existence of required folders for Lead-DBS
      const derivativesExists = await window.electron.ipcRenderer.invoke(
        'check-folder-exists',
        `${path}/derivatives/leaddbs`,
      );
      const rawdataExists = await window.electron.ipcRenderer.invoke(
        'check-folder-exists',
        `${path}/rawdata`,
      );
      const sourcedataExists = await window.electron.ipcRenderer.invoke(
        'check-folder-exists',
        `${path}/sourcedata`,
      );
      const isLeadGroup = path.includes('leadgroup');

      // Set the state if all required folders are present
      if (derivativesExists && rawdataExists && sourcedataExists) {
        console.log('TRUE');
        setIsLeadDBSFolder(true);
      } else if (isLeadGroup) {
        setIsLeadDBSFolder(true);
      } else {
        setIsLeadDBSFolder(false);
      }
    } catch (error) {
      console.error('Error checking folder structure:', error);
      setIsLeadDBSFolder(false);
    }
  };

  useEffect(() => {
    // Listen for the selected folder path when a new one is selected
    const unsubscribe = window.electron.ipcRenderer.on(
      'folder-selected',
      (selectedPath) => {
        setDirectoryPath(selectedPath); // Set the selected folder path
        setRenderKey((prevKey) => prevKey + 1); // Use functional update to ensure it increments correctly
        checkLeadDBSFolder(selectedPath); // Check if the folder is a Lead-DBS folder
      },
    );

    // Load the saved directory path on initial load
    const loadSavedDirectory = async () => {
      const savedPath = await window.electron.ipcRenderer.invoke(
        'get-saved-directory',
      );
      if (savedPath) {
        setDirectoryPath(savedPath); // Set the saved folder path if it exists
        window.electron.ipcRenderer.sendMessage('select-folder', savedPath); // Request folder selection
        checkLeadDBSFolder(savedPath); // Check if it's a Lead-DBS folder
      }
    };

    loadSavedDirectory(); // Call the function to load the saved path

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  const [zoomLevel, setZoomLevel] = useState(-1);

  useEffect(() => {
    window.electron.zoom.setZoomLevel(zoomLevel);
  }, [zoomLevel]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <div className="Navbar">
        {/* <SettingsIcon
          className="settings-icon"
          onClick={() => setShowSettings(!showSettings)}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            color: '#6c757d',
            zIndex: '10',
          }} // Optional styling
        />
        <MoreVertIcon
          className="settings-icon"
          onClick={() => setShowSettings(!showSettings)}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            color: '#6c757d',
            zIndex: '10',
          }} // Optional styling
        /> */}

        {showSettings && (
          <div className="settings-panel">
            <button className="select-button" onClick={selectFolder}>
              Select Save Directory
            </button>
            {directoryPath && (
              <p className="selected-directory">
                Selected Directory: {directoryPath}
              </p>
            )}
            {isLeadDBSFolder ? (
              <p className="lead-dbs-status">This is a Lead-DBS folder.</p>
            ) : (
              <p className="lead-dbs-status">This is not a Lead-DBS folder.</p>
            )}
          </div>
        )}
      </div>
      <PatientProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div style={{ marginTop: '0px' }}>
                  <Navbar text="" color1="#375D7A" />
                  <PatientDatabase
                    key={renderKey}
                    directoryPath={directoryPath}
                  />
                </div>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <div>
                  <Navbar text="" color1="#375D7A" />
                  <PatientDetails
                    directoryPath={directoryPath}
                    leadDBS={isLeadDBSFolder}
                  />
                </div>
              }
            />
            <Route path="/programmer" element={<Programmer />} />
            <Route
              path="/clinical-scores"
              element={
                // <div style={{ maxWidth: '1000px' }}>
                //   <ClinicalScores />
                // </div>
                <div>
                  <ClinicalScores />
                </div>
              }
            />
            <Route
              path="/viewer"
              element={
                <div style={{ maxWidth: '1000px' }}>{/* <PlyViewer /> */}</div>
              }
            />
            <Route
              path="/custom-table"
              element={
                <div style={{ maxWidth: '1000px' }}>
                  {/* <PlyViewer /> */}
                  <CustomTable />
                </div>
              }
            />
            <Route
              path="/group"
              element={
                <div style={{ maxWidth: '1000px' }}>
                  <GroupStats />
                </div>
              }
            />
            <Route
              path="/groupstats"
              element={
                <div style={{ maxWidth: '1000px' }}>
                  <Navbar text="" color1="#375D7A" />
                  <DatabaseStats directoryPath={directoryPath} />
                </div>
              }
            />
            <Route
              path="/import"
              element={
                <div style={{ maxWidth: '1000px' }}>
                  <Import leadDBS={isLeadDBSFolder} />
                </div>
              }
            />
            <Route
              path="/niivue"
              element={
                <div>
                  {/* <Navbar text="" color1="#375D7A" /> */}
                  <div style={{ marginTop: '100px' }}>
                    <TestApp />
                  </div>
                </div>
              }
            />
            <Route
              path="/seeg"
              element={
                <div>
                  <Navbar text="Lead-SEEG" color1="#375D7A" />
                  <SEEG />
                </div>
              }
            />
          </Routes>
        </Router>
      </PatientProvider>
    </div>
  );
}

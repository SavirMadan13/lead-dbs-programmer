import { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Ensure your styles are imported
import SettingsIcon from '@mui/icons-material/Settings'; // Import the Material UI Settings Icon
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDatabase from './components/PatientDatabase';
import PatientDetails from './components/PatientDetails';
import { PatientProvider } from './components/PatientContext';
import Programmer from './Programmer';
import ClinicalScores from './components/ClinicalScores';

export default function App() {
  const [directoryPath, setDirectoryPath] = useState(null);
  const [showSettings, setShowSettings] = useState(false); // New state to control visibility
  const [renderKey, setRenderKey] = useState(0);

  // Function to handle folder selection
  const selectFolder = () => {
    window.electron.ipcRenderer.sendMessage('select-folder', null); // Request folder selection
  };

  useEffect(() => {
    // Listen for the selected folder path when a new one is selected

    const unsubscribe = window.electron.ipcRenderer.on(
      'folder-selected',
      (selectedPath) => {
        setDirectoryPath(selectedPath); // Set the selected folder path
        setRenderKey(renderKey + 1);
      },
    );

    // Load the saved directory path on initial load
    const loadSavedDirectory = async () => {
      const savedPath = await window.electron.ipcRenderer.invoke('get-saved-directory');
      if (savedPath) {
        setDirectoryPath(savedPath); // Set the saved folder path if it exists
        window.electron.ipcRenderer.sendMessage('select-folder', savedPath); // Request folder selection
      }
    };

    loadSavedDirectory(); // Call the function to load the saved path

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
    };
  }, []);

  return (
    <div>
      <div className="Navbar">
        <Navbar />
        <SettingsIcon
          className="settings-icon"
          onClick={() => setShowSettings(!showSettings)}
          style={{ cursor: 'pointer', fontSize: '24px', color: '#6c757d' }} // Optional styling
        />

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
          </div>
        )}
      </div>
      <PatientProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PatientDatabase
                  key={renderKey}
                  directoryPath={directoryPath}
                />
              }
            />
            <Route
              path="/patient/:id"
              element={<PatientDetails directoryPath={directoryPath} />}
            />
            <Route path="/programmer" element={<Programmer />} />
            <Route
              path="/clinical-scores"
              element={
                <div style={{ maxWidth: '1000px' }}>
                  <ClinicalScores />
                </div>
              }
            />
          </Routes>
        </Router>
      </PatientProvider>
    </div>
  );
}

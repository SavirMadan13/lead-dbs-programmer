import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

import Dropdown from 'react-bootstrap/dropdown';
import { Slider } from '@mui/material';
import CBCTImage from 'assets/CBCT.png';
import TabbedElectrodeIPGSelectionTest from './components/TabbedElectrodeIPGSelectionTest';
import Navbar from './components/Navbar';
// import Navbar from 'react-bootstrap/Navbar'
import StimulationSettings from './components/StimulationSettings';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonGroup, Button } from 'react-bootstrap';
import GroupArchitecture from './components/GroupArchitecture';
import PatientDatabase from './components/PatientDatabase';
import PatientDetails from './components/PatientDetails';
import { PatientProvider } from './components/PatientContext'; // Import the context provider
import Programmer from './Programmer';
import ClinicalScores from './components/ClinicalScores';
// const { ipcRenderer } = require('electron');

export default function App() {

  // const [directoryPath, setDirectoryPath] = useState(null);

  // Load the stored folder path when the component mounts
  // useEffect(() => {
  //   const loadFolderPath = async () => {
  //     const savedPath = await ipcRenderer.invoke('get-folder-path');
  //     if (savedPath) {
  //       setDirectoryPath(savedPath);
  //     }
  //   };
  //   loadFolderPath();
  // }, []);

  // // Function to handle folder selection
  // const selectFolder = async () => {
  //   const selectedPath = await ipcRenderer.invoke('select-folder');
  //   if (selectedPath) {
  //     setDirectoryPath(selectedPath);
  //   }
  // };

  return (
    <div>
      <div className="Navbar">
        <Navbar />
        {/* <button onClick={selectFolder}>Select Save Directory</button> */}
      </div>
      <PatientProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PatientDatabase />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
            <Route path="/programmer" element={<Programmer />} />
            <Route
              path="/clinical-scores"
              element={
                <div style={{maxWidth: '1000px'}}>
                  <ClinicalScores />
                </div>
              }
            />
          </Routes>
        </Router>
      </PatientProvider>
      {/* <div className="footer">
        <hr className="divider" />
        <img src={CBCTImage} alt="img" />
      </div> */}
    </div>
  );
}

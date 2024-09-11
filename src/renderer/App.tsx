import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

import Dropdown from 'react-bootstrap/dropdown';
import { Slider } from '@mui/material';
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

export default function App() {
  return (
    <div>
      <div className="Navbar">
        <Navbar />
      </div>
      <PatientProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PatientDatabase />} />
            <Route path="/patient/:id" element={<PatientDetails />} />
            <Route path="/programmer" element={<Programmer />} />
          </Routes>
        </Router>
      </PatientProvider>
    </div>
  );
}

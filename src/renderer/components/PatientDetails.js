import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientContext } from './PatientContext'; // Import the context
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

function PatientDetails({ directoryPath }) {
  const location = useLocation();
  const { patient } = location.state || {}; // Retrieve patient from state
  const { patients } = useContext(PatientContext); // Optional: Use context for patient data
  const navigate = useNavigate(); // Initialize the navigate hook

  const [timeline, setTimeline] = useState(''); // For timeline selection

  if (!patient) {
    return <div>Patient not found</div>;
  }

  // Handles the navigation to the Stimulation Parameters page
  const handleNavigateToStimulation = () => {
    if (timeline) {
      navigate('/programmer', { state: { patient, timeline, directoryPath } });
    } else {
      alert('Please select a timeline first');
    }
  };

  // Handles the navigation to the Clinical Scores page
  const handleNavigateToClinicalScores = () => {
    if (timeline) {
      navigate('/clinical-scores', { state: { patient, timeline } });
    } else {
      alert('Please select a timeline first');
    }
  };

  return (
    <div className="patient-details">
      <h1 className="patient-title">Patient Details</h1>
      <p className="patient-info">
        <strong>ID:</strong> {patient.id}
      </p>
      <p className="patient-info">
        <strong>Name:</strong> {patient.name}
      </p>
      <p className="patient-info">
        <strong>Age:</strong> {patient.age}
      </p>
      <p className="patient-info">
        <strong>Gender:</strong> {patient.gender}
      </p>
      <p className="patient-info">
        <strong>Diagnosis:</strong> {patient.diagnosis}
      </p>

      {/* Timeline selection */}
      <div className="timeline-selection">
        <label>Select Session Timeline:</label>
        <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
          <option value="" disabled>Select timeline</option>
          <option value="baseline">Baseline</option>
          <option value="6months">6 Months</option>
          <option value="12months">12 Months</option>
          {/* Add more timeline options as needed */}
        </select>
      </div>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>Back to Table</button>

      {/* Navigate to Stimulation Parameters Page */}
      <button className="export-button" onClick={handleNavigateToStimulation}>
        Stimulation Parameters
      </button>

      {/* Navigate to Clinical Scores Page */}
      <button className="export-button" onClick={handleNavigateToClinicalScores}>
        Clinical Scores
      </button>
    </div>
  );
}

export default PatientDetails;

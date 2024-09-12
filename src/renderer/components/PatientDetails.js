import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PatientContext } from './PatientContext'; // Import the context
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

function PatientDetails() {
  const location = useLocation();
  const { patient } = location.state || {}; // Retrieve patient from state
  const { patients } = useContext(PatientContext); // Optional: Use context for patient data
  const navigate = useNavigate(); // Initialize the navigate hook

  if (!patient) {
    return <div>Patient not found</div>;
  }

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

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>Back to Table</button>

      {/* Navigate to Programmer Page */}
      <button className="export-button" onClick={() => navigate('/programmer', { state: { patient } })}>
        Stimulation Parameters
      </button>
      <button className="export-button" onClick={() => navigate('/clinical-scores', { state: { patient } })}>
        Clinical Scores
      </button>
    </div>
  );
}

export default PatientDetails;

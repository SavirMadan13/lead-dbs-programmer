import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PatientContext } from './PatientContext'; // Import the context

function PatientDetails() {
  const location = useLocation();
  const { patient } = location.state || {}; // Retrieve patient from state
  const { patients } = useContext(PatientContext); // Optional: Use context for patient data
  const navigate = useNavigate(); // Initialize the navigate hook

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div>
      <h1>Patient Details</h1>
      <p><strong>ID:</strong> {patient.id}</p>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>

      {/* Back Button */}
      <button onClick={() => navigate('/')}>
        Back to Table
      </button>
    </div>
  );
}

export default PatientDetails;

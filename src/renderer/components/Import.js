import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import * as XLSX from 'xlsx'; // Import xlsx for Excel parsing
import { PatientContext } from './PatientContext';

function Import({ leadDBS }) {
  const allPatients = useContext(PatientContext);
  const [timeline, setTimeline] = useState('');
  const navigate = useNavigate();

  function restructurePatientData(data) {
    // Extract Patient ID and Timeline
    const id = data["PatientID"];
    const timeline = data["timeline"];

    // Filter out the scores by excluding non-score keys
    const scores = Object.keys(data)
      .filter((key) => key !== "PatientID" && key !== "timeline")
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

    // Return the restructured object
    return {
      id,
      timeline,
      scores,
    };
  }

  // Submit data to main process
  const handleSubmit = (sheetData) => {
    if (!timeline || sheetData.length === 0) {
      alert('Please provide a timeline and import data!');
      return;
    }

    const patientData = sheetData.map((entry) => ({
      ...entry,
      timeline,
    }));

    const processedData = {};
    Object.keys(patientData).forEach((key) => {
      processedData[key] = restructurePatientData(patientData[key]);
    });

    console.log(processedData);
    window.electron.ipcRenderer.sendMessage(
      'batch-import',
      processedData,
      leadDBS,
    );

    alert('Data submitted successfully!');
  };

  // Parse Excel file
  const parseFile = (uploadedFile) => {
    if (!uploadedFile) {
      alert('Please select a file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      handleSubmit(sheetData);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      parseFile(uploadedFile);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Batch Patient Import</h2>
      <label>
        Timeline:
        <input
          type="text"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          placeholder="Enter timeline (no spaces)"
        />
      </label>
      <br />
      <label>
        Import Excel File:
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </label>
      <br />
      <button className="button" onClick={() => navigate(-1)}>
        Back to Patient Details
      </button>
    </div>
  );
}

export default Import;

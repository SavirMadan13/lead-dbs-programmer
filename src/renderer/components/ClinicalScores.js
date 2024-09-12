/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Table, Container } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import PairedTTestComponent from './PairedTTestComponent';
import BoxPlotComponent from './BoxPlotComponent';
import UPDRSAnalysisComponent from './UPDRSAnalysisComponent';

function ClinicalScores() {
  const initialScores = {
    3.1: 0,
    3.2: 0,
    '3.3a': 0,
    '3.3b': 0,
    '3.3c': 0,
    '3.3d': 0,
    '3.3e': 0,
    '3.4a': 0,
    '3.4b': 0,
    '3.5a': 0,
    '3.5b': 0,
    '3.6a': 0,
    '3.6b': 0,
    '3.7a': 0,
    '3.7b': 0,
    '3.8a': 0,
    '3.8b': 0,
    3.9: 0,
    '3.10': 0,
    3.11: 0,
    3.12: 0,
    3.13: 0,
    3.14: 0,
    '3.15a': 0,
    '3.15b': 0,
    '3.16a': 0,
    '3.16b': 0,
    '3.17a': 0,
    '3.17b': 0,
    '3.17c': 0,
    '3.17d': 0,
    '3.17e': 0,
    3.18: 0,
  };

  const [patients, setPatients] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate hook

  const addPatient = () => {
    setPatients([
      ...patients,
      {
        id: `Patient ${patients.length + 1}`,
        baseline: { ...initialScores },
        postop: { ...initialScores },
      },
    ]);
  };

  const [selectedRows, setSelectedRows] = useState({});
  const [showGraph, setShowGraph] = useState(false);
  const [baselineValues, setBaselineValues] = useState([]);
  const [postopValues, setPostopValues] = useState([]);
  const [currentStage, setCurrentStage] = useState('import');

  const toggleRowSelection = (patientIndex) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [patientIndex]: !prevSelectedRows[patientIndex],
    }));
  };

  const updateScore = (patientIndex, timePoint, field, value) => {
    const updatedPatients = [...patients];
    updatedPatients[patientIndex][timePoint][field] = value;
    setPatients(updatedPatients);
  };

  const updatePatientID = (patientIndex, newID) => {
    const updatedPatients = [...patients];
    updatedPatients[patientIndex].id = newID;
    setPatients(updatedPatients);
  };

  const renderTable = (timePoint) => {
    const allSelected =
      patients.length > 0 &&
      patients.every((_, rowIndex) => selectedRows[rowIndex]);

    const toggleSelectAll = () => {
      if (allSelected) {
        setSelectedRows({});
      } else {
        const newSelectedRows = {};
        patients.forEach((_, rowIndex) => {
          newSelectedRows[rowIndex] = true;
        });
        setSelectedRows(newSelectedRows);
      }
    };

    return (
      <div style={{ overflowX: 'auto', maxHeight: '700px' }}>
        <Table striped bordered hover responsive style={{ maxWidth: '1000px' }}>
          <thead>
            <tr>
              {/* <th> */}
              <th
                style={{
                  position: 'sticky',
                  top: 0,
                  background: '#fff',
                  zIndex: 1,
                }}
              >
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <span className="checkmark" />
                </label>
              </th>
              <th>Patient ID</th>
              {Object.keys(initialScores).map((key, colIndex) => (
                <th key={key} style={{ whiteSpace: 'wrap', minWidth: '80px' }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: selectedRows[rowIndex] ? '#e6f7ff' : 'white',
                }}
              >
                <td>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[rowIndex]}
                      onChange={() => toggleRowSelection(rowIndex)}
                    />
                    <span className="checkmark" />
                  </label>
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={patient.id}
                    onChange={(e) => updatePatientID(rowIndex, e.target.value)}
                    style={{ width: 'auto' }}
                  />
                </td>
                {Object.keys(initialScores).map((key, colIndex) => (
                  <td
                  // key={colIndex}
                  // onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  // onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                  // onMouseUp={handleMouseUp}
                  // style={{
                  //   backgroundColor: selectedCells[`${rowIndex}-${colIndex}`]
                  //     ? '#D3D3D3'
                  //     : 'white',
                  // }}
                  >
                    <Form.Control
                      type="number"
                      value={patient[timePoint][key]}
                      onChange={(e) =>
                        updateScore(
                          rowIndex,
                          timePoint,
                          key,
                          parseInt(e.target.value, 10),
                        )
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const handleFileUpload = (event, timePoint) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });

      const updatedPatients = [...patients]; // Copy the existing patients state

      json.forEach((patientData) => {
        const normalizedScores = {};

        Object.keys(patientData).forEach((rawKey) => {
          const normalizedKey = rawKey.trim().replace(/^["']+|["']+$/g, '');
          normalizedScores[normalizedKey] = patientData[rawKey];
        });

        const patientID = normalizedScores['Patient ID'];
        delete normalizedScores['Patient ID'];

        const existingPatientIndex = updatedPatients.findIndex(
          (patient) => patient.id === patientID,
        );

        if (existingPatientIndex > -1) {
          // Update existing patient
          if (timePoint === 'baseline') {
            updatedPatients[existingPatientIndex].baseline = {
              ...updatedPatients[existingPatientIndex].baseline,
              ...normalizedScores,
            };
          } else if (timePoint === 'postop') {
            updatedPatients[existingPatientIndex].postop = {
              ...updatedPatients[existingPatientIndex].postop,
              ...normalizedScores,
            };
          }
        } else {
          // Add new patient
          const newPatient = {
            id: patientID,
            baseline:
              timePoint === 'baseline'
                ? { ...initialScores, ...normalizedScores }
                : { ...initialScores },
            postop:
              timePoint === 'postop'
                ? { ...initialScores, ...normalizedScores }
                : { ...initialScores },
          };
          updatedPatients.push(newPatient);
        }
      });

      setPatients(updatedPatients);
    };
    reader.readAsArrayBuffer(file);
  };

  const analyzeSelectedRowsAndColumns = () => {
    const baselineScores = [];
    const postopScores = [];

    Object.keys(selectedRows).forEach((rowIndex) => {
      if (selectedRows[rowIndex]) {
        const patient = patients[rowIndex];
        console.log(patient);
        // Sum all the baseline scores for this patient
        const baselineSum = Object.values(patient.baseline).reduce(
          (sum, value) => sum + (value || 0),
          0,
        );

        // Sum all the postop scores for this patient
        const postopSum = Object.values(patient.postop).reduce(
          (sum, value) => sum + (value || 0),
          0,
        );

        baselineScores.push(baselineSum);
        postopScores.push(postopSum);
      }
    });

    console.log('Baseline: ', baselineScores);
    console.log('Postop: ', postopScores);

    // const tempBaselineValues = [
    //   32, 45, 29, 50, 37, 41, 48, 42, 36, 44, 33, 40, 47, 39, 38, 43, 31, 49,
    //   46, 46, 34,
    // ];
    // const tempPostopValues = [
    //   28, 40, 25, 42, 34, 38, 44, 39, 32, 41, 29, 36, 42, 35, 34, 40, 27, 44,
    //   41, 30,
    // ];
    setBaselineValues(baselineScores);
    setPostopValues(postopScores);
    setShowGraph(true);
    setCurrentStage('analyze');
  };

  return (
    <div>
      {currentStage === 'import' && (
        <div>
          {/* <h3 className="my-4">Import Data</h3> */}
          <Container>
            <Button variant="primary" onClick={addPatient} className="mb-4">
              Add Patient
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('baseline-upload').click()}
              className="mb-4 mx-2"
            >
              Import Baseline Excel
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('postop-upload').click()}
              className="mb-4 mx-2"
            >
              Import Postoperative Excel
            </Button>
            <input
              id="baseline-upload"
              type="file"
              style={{ display: 'none' }}
              accept=".xlsx"
              onChange={(e) => handleFileUpload(e, 'baseline')}
            />
            <input
              id="postop-upload"
              type="file"
              style={{ display: 'none' }}
              accept=".xlsx"
              onChange={(e) => handleFileUpload(e, 'postop')}
            />
            <Button
              variant="success"
              // onClick={() => setCurrentStage('analyze')}
              onClick={analyzeSelectedRowsAndColumns}
              className="mb-4"
            >
              Proceed to Analysis
            </Button>
          </Container>
          <div>
            <h4>Baseline Scores</h4>
            {renderTable('baseline')}
            <h4>Postoperative Scores</h4>
            {renderTable('postop')}
          </div>
        </div>
      )}
      {currentStage === 'analyze' && (
        <div>
          {/* <h3 className="my-4">Analyze Data</h3> */}
          <Button variant="secondary" onClick={() => setCurrentStage('import')}>
            Go Back to Import
          </Button>
          <div />
          {showGraph && (
            <div
              style={{
                float: 'left',
                width: '50%',
              }}
            >
              {/* <PairedTTestComponent
                baselineValues={baselineValues}
                postopValues={postopValues}
              />
              <BoxPlotComponent
                baselineValues={baselineValues}
                postopValues={postopValues}
              /> */}
              <UPDRSAnalysisComponent
                baselineValues={baselineValues}
                postopValues={postopValues}
                rawData={patients}
              />
            </div>
          )}
        </div>
      )}
      <button className="export-button" onClick={() => navigate(-1)}>Back to Patient Details</button>
    </div>
  );
}

export default ClinicalScores;

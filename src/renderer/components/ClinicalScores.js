/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Table, Container } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import PairedTTestComponent from './PairedTTestComponent';
import BoxPlotComponent from './BoxPlotComponent';
import UPDRSAnalysisComponent from './UPDRSAnalysisComponent';

function ClinicalScores() {
  const location = useLocation();
  const { patient, timeline, directoryPath, leadDBS } = location.state || {};
  const navigate = useNavigate(); // Initialize the navigate hook

  const [scoreTypes, setScoreTypes] = useState(['UPDRS', 'Y-BOCS']);
  const [selectedScoreType, setSelectedScoreType] = useState('UPDRS');
  const YBOCS = {
    'Time occupied by obsessive thoughts': 0,
    'Interference due to obsessive thoughts': 0,
    'Distress associated with obsessive thoughts': 0,
    'Resistance against obsessions': 0,
    'Degree of control over obsessive thoughts': 0,
    'Time spent performing compulsive behaviors': 0,
    'Interference due to compulsive behaviors': 0,
    'Distress associated with compulsive behavior': 0,
    'Resistance against compulsions': 0,
    'Degree of control over compulsive behavior': 0,
  };

  const UPDRS = {
    '3.1: Speech': 0,
    '3.2: Facial expression': 0,
    '3.3a: Rigidity- Neck': 0,
    '3.3b: Rigidity- RUE': 0,
    '3.3c: Rigidity- LUE': 0,
    '3.3d: Rigidity- RLE': 0,
    '3.3e: Rigidity- LLE': 0,
    '3.4a: Finger tapping- Right hand': 0,
    '3.4b: Finger tapping- Left hand': 0,
    '3.5a: Hand movements- Right hand': 0,
    '3.5b: Hand movements- Left hand': 0,
    '3.6a: Pronation- supination movements- Right hand': 0,
    '3.6b: Pronation- supination movements- Left hand': 0,
    '3.7a: Toe tapping- Right foot': 0,
    '3.7b: Toe tapping- Left foot': 0,
    '3.8a: Leg agility- Right leg': 0,
    '3.8b: Leg agility- Left leg': 0,
    '3.9: Arising from chair': 0,
    '3.10: Gait': 0,
    '3.11: Freezing of gait': 0,
    '3.12: Postural stability': 0,
    '3.13: Posture': 0,
    '3.14: Global spontaneity of movement': 0,
    '3.15a: Postural tremor- Right hand': 0,
    '3.15b: Postural tremor- Left hand': 0,
    '3.16a: Kinetic tremor- Right hand': 0,
    '3.16b: Kinetic tremor- Left hand': 0,
    '3.17a: Rest tremor amplitude- RUE': 0,
    '3.17b: Rest tremor amplitude- LUE': 0,
    '3.17c: Rest tremor amplitude- RLE': 0,
    '3.17d: Rest tremor amplitude- LLE': 0,
    '3.17e: Rest tremor amplitude- Lip/jaw': 0,
    '3.18: Constancy of rest tremor': 0,
  };
  const [initialScores, setInitialScores] = useState(UPDRS);

  const handleScoreChange = (score) => {
    if (score === 'UPDRS') {
      setInitialScores(UPDRS);
    } else if (score === 'Y-BOCS') {
      setInitialScores(YBOCS);
    }
    setSelectedScoreType(score);
  };

  // Set how many columns you want per "wrapped" table row
  const columnsPerRow = 7; // Change this number based on how wide you want each section

  // Split the keys into chunks of 'columnsPerRow'
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // Get chunks of headers (column titles) and data (table rows)
  const keys = Object.keys(initialScores);
  const headerChunks = chunkArray(keys, columnsPerRow);

  const [patients, setPatients] = useState([
    {
      id: patient.id,
      baseline: { ...initialScores },
      postop: { ...initialScores },
    },
  ]);

  window.electron.ipcRenderer.sendMessage(
    'import-file-clinical',
    patient.id,
    timeline,
    directoryPath,
    leadDBS,
  );

  useEffect(() => {
    // Ensure that the ipcRenderer is available
    if (window.electron && window.electron.ipcRenderer) {
      // Event listener for import-file
      const handleImportFile = (arg) => {
        const importedScores = arg;
        if (importedScores === 'File not found') {
          console.log('No File Found');
        } else {
          setPatients([
            {
              id: patient.id,
              baseline: importedScores,
              postop: { ...initialScores },
            },
          ]);
        }
      };

      // Attach listeners using 'once' so that it only listens for the event once
      window.electron.ipcRenderer.once(
        'import-file-clinical',
        handleImportFile,
      );
    } else {
      console.error('ipcRenderer is not available');
    }
  }, []);

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
        {headerChunks.map((headerChunk, chunkIndex) => (
          <div key={chunkIndex} style={{ marginBottom: '20px' }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {/* <th>Patient ID</th> */}
                  {headerChunk.map((key) => (
                    <th
                      key={key}
                      style={{ whiteSpace: 'wrap', minWidth: '80px' }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, rowIndex) => (
                  <tr key={rowIndex}>
                    {/* <td>
                      <Form.Control
                        type="text"
                        value={patient.id}
                        onChange={(e) =>
                          updatePatientID(rowIndex, e.target.value)
                        }
                        style={{ width: 'auto' }}
                      />
                    </td> */}
                    {headerChunk.map((key, colIndex) => (
                      <td key={key}>
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
        ))}
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
    setBaselineValues(baselineScores);
    setPostopValues(postopScores);
    setShowGraph(true);
    setCurrentStage('analyze');
  };

  const prepareDataForExport = () => {
    const baselineScores = [];

    Object.keys(selectedRows).forEach((rowIndex) => {
      if (selectedRows[rowIndex]) {
        const patient1 = patients[rowIndex];
        // Sum all the baseline scores for this patient
        const baselineSum = Object.values(patient1.baseline).reduce(
          (sum, value) => sum + (value || 0),
          0,
        );

        baselineScores.push(baselineSum);
      }
    });

    console.log('Baseline: ', baselineScores);
    setBaselineValues(baselineScores);
  };

  const sendDataToMain = () => {
    console.log(patients[0].baseline);
    window.electron.ipcRenderer.sendMessage(
      'save-file-clinical',
      patients[0].baseline,
      location.state,
    );
  };

  return (
    <div>
      {currentStage === 'import' && (
        <div>
          {/* <h3 className="my-4">Import Data</h3> */}
          {/* <div
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}
          >
            Patient: {patient.name}
          </div> */}
          <div style={{ textAlign: 'center', fontSize: '20px' }}>
            {timeline}
          </div>
          <Container>
            {/* <Button variant="primary" onClick={addPatient} className="mb-4">
              Add Patient
            </Button> */}
            <h4>Choose Score Type</h4>
            <Form.Select
              value={selectedScoreType}
              onChange={(e) => handleScoreChange(e.target.value)}
            >
              {scoreTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('baseline-upload').click()}
              className="mb-4 mx-2"
            >
              Import Excel
            </Button>
            {/* <Button
              variant="secondary"
              onClick={() => document.getElementById('postop-upload').click()}
              className="mb-4 mx-2"
            >
              Import Postoperative Excel
            </Button> */}
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
            {/* <Button
              variant="success"
              // onClick={() => setCurrentStage('analyze')}
              onClick={analyzeSelectedRowsAndColumns}
              className="mb-4"
            >
              Proceed to Analysis
            </Button> */}
          </Container>
          <div>
            <h4>Enter Scores</h4>
            {renderTable('baseline')}
            {/* <h4>Postoperative Scores</h4>
            {renderTable('postop')} */}
          </div>
        </div>
      )}
      {currentStage === 'analyze' && (
        <div>
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
              <UPDRSAnalysisComponent
                baselineValues={baselineValues}
                postopValues={postopValues}
                rawData={patients}
              />
            </div>
          )}
        </div>
      )}
      <button className="export-button" onClick={() => navigate(-1)}>
        Back to Patient Details
      </button>
      <button className="export-button-final" onClick={sendDataToMain}>
        Save Clinical Scores
      </button>
      {/* <button onClick={() => navigate('/custom-table')}>
        Add custom table
      </button> */}
    </div>
  );
}

export default ClinicalScores;

/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
// import './App.css';

import Dropdown from 'react-bootstrap/dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonGroup, Button } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { render } from '@testing-library/react';
import StimulationSettings from './StimulationSettings';
import Navbar from './Navbar';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

function GroupArchitecture({
  patients,
  setPatients,
  electrodeList,
  patientStates,
  setPatientStates,
  importNewS,
  electrodeMaster,
  ipgMaster,
  historical,
  setHistorical,
  mode,
  timeline,
  type,
}) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showViewer, setShowViewer] = useState(true);
  console.log(patients);
  // State for each patient
  const initialState = {
    IPG: '',
    leftElectrode: '',
    rightElectrode: '',
    allQuantities: {},
    allSelectedValues: {},
    allTotalAmplitudes: {},
    allStimulationParameters: {},
    visModel: '3',
    sessionTitle: '',
    allTogglePositions: {},
    allPercAmpToggles: {},
    allVolAmpToggles: {},
    importCount: 0,
    importData: '',
    masterImportData: '',
    matImportFile: null,
    newImportFiles: null,
    showDropdown: true,
    filePath: '',
    stimChanged: true,
  };

  const [renderKey, setRenderKey] = useState(0); // Added state for forcing re-render
  console.log('Timeline: ', timeline);
  console.log('Patients: ', patients);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      // setSelectedPatient(patients[0]);
      setSelectedPatient(timeline);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedPatient && !patientStates[selectedPatient]) {
      setPatientStates((prevStates) => ({
        ...prevStates,
        [selectedPatient]: initialState,
      }));
    }
    console.log('Patient states after selection:', patientStates);
  }, [selectedPatient, patientStates]);

  const handleStateChange = (patient, stateUpdater) => {
    setPatientStates((prevStates) => ({
      ...prevStates,
      [patient]: {
        ...prevStates[patient],
        ...stateUpdater,
      },
    }));
  };

  const [zoomLevel, setZoomLevel] = useState(-3);

  const handleZoomChange = (event, newValue) => {
    setZoomLevel(newValue);
    window.electron.zoom.setZoomLevel(newValue);
  };
  // Don't forget this

  // useEffect(() => {
  //   window.electron.zoom.setZoomLevel(zoomLevel);
  // }, [zoomLevel]);

  const currentPatientState = selectedPatient
    ? patientStates[selectedPatient] || initialState
    : initialState;

  function PatientSelector({
    selectedPatient,
    setSelectedPatient,
    setRenderKey,
  }) {
    const handleSelect = (eventKey) => {
      setSelectedPatient(eventKey);
      setRenderKey((prevKey) => prevKey + 1);
    };

    const [newStim, setNewStim] = useState('');

    function generateUniqueID() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
      const day = currentDate.getDate().toString().padStart(2, '0');
      const randomNums = Math.floor(Math.random() * 1000000); // Generate random 4-digit number
      return `${year}${month}${day}${randomNums}`;
    }

    const handleTabKeyPress = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        const uniqueID = generateUniqueID();
        setNewStim(uniqueID);
        // setNewStim(Date.now().toString());
        // Set the input field value to the placeholder text
      }
    };

    const handleNewStimText = (event) => {
      setNewStim(event.target.value);
    };

    const handleOnAddButtonClick = () => {
      setPatients([...patients, newStim]);
      setSelectedPatient(newStim);
      setPatientStates((prevStates) => ({
        ...prevStates,
        [newStim]: {
          ...initialState, // Spread the initial state
          leftElectrode: electrodeMaster, // Override leftElectrode with electrodeMaster
          rightElectrode: electrodeMaster, // Override rightElectrode with electrodeMaster
          IPG: ipgMaster, // Override IPG with ipgMaster
        },
      }));
      setRenderKey(renderKey + 1);
    };

    return (
      <div>
        {/* <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', marginLeft: '-10px' }}>
          Stimulation Label
        </div> */}
        <Dropdown onSelect={handleSelect} style={{borderRadius: '20px'}}>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            style={{
              borderRadius: '20px',
              width: '250px',
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'white',
              color: 'black',
              fontWeight: 'bold',
              border: 'none',
            }}
          >
            {selectedPatient || 'Select Patient'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {patients.map((patient, index) => (
              <Dropdown.Item key={index} eventKey={patient}>
                {patient}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {/* <div style={{ maxWidth: '300px' }}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Tab for auto ID"
              aria-describedby="basic-addon2"
              value={newStim}
              onChange={handleNewStimText}
              onKeyDown={handleTabKeyPress}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={handleOnAddButtonClick}
            >
              Add
            </Button>
          </InputGroup>
        </div> */}
      </div>
    );
  }

  const handlePreviousPatient = () => {
    const currentIndex = patients.indexOf(selectedPatient);
    const previousIndex =
      (currentIndex - 1 + patients.length) % patients.length;
    const updatedHistorical = { ...historical };
    updatedHistorical.patient.id = patients[previousIndex];
    updatedHistorical.timeline = patients[previousIndex];
    setHistorical(updatedHistorical);
    setSelectedPatient(patients[previousIndex]);
    setRenderKey(renderKey + 1);
  };

  const handleNextPatient = () => {
    const currentIndex = patients.indexOf(selectedPatient);
    const nextIndex = (currentIndex + 1) % patients.length;
    const updatedHistorical = { ...historical };
    updatedHistorical.patient.id = patients[nextIndex];
    updatedHistorical.timeline = patients[nextIndex];
    setHistorical(updatedHistorical);
    setSelectedPatient(patients[nextIndex]);
    setRenderKey(renderKey + 1);
  };

  return (
    <div style={{ marginLeft: '-300px', marginTop: '200px' }}>
      {/* <div style={{ paddingLeft: '45px', marginBottom: '-100px' }}>
        <PatientSelector
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          setRenderKey={setRenderKey}
        />
      </div> */}
      <div
        style={{
          position: 'absolute',
          ...(showViewer && {
            marginBottom: '-110px',
          }),
          marginTop: '-30px',
          marginLeft: '100px',
          zIndex: 5,
        }}
      >
        {/* Left Arrow Button - Conditionally Rendered */}
        {type === 'leadgroup' && (
          <Button
            // className="sticky-button"
            style={{ marginRight: '10px', height: '40px', marginTop: '20px' }}
            variant="secondary"
            onClick={handlePreviousPatient}
          >
            ←
          </Button>
        )}

        {/* Patient Selector */}
        <PatientSelector
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          setRenderKey={setRenderKey}
        />

        {/* Right Arrow Button - Conditionally Rendered */}
        {type === 'leadgroup' && (
          <Button
            // className="sticky-button"
            style={{ marginLeft: '10px', height: '40px', marginTop: '20px' }}
            variant="secondary"
            onClick={handleNextPatient}
          >
            →
          </Button>
        )}
      </div>
      <div>
        {selectedPatient && (
          <StimulationSettings
            key={renderKey}
            IPG={currentPatientState.IPG}
            setIPG={(value) =>
              handleStateChange(selectedPatient, { IPG: value })
            }
            leftElectrode={currentPatientState.leftElectrode}
            setLeftElectrode={(value) =>
              handleStateChange(selectedPatient, { leftElectrode: value })
            }
            rightElectrode={currentPatientState.rightElectrode}
            setRightElectrode={(value) =>
              handleStateChange(selectedPatient, { rightElectrode: value })
            }
            allQuantities={currentPatientState.allQuantities}
            setAllQuantities={(value) =>
              handleStateChange(selectedPatient, { allQuantities: value })
            }
            allSelectedValues={currentPatientState.allSelectedValues}
            setAllSelectedValues={(value) =>
              handleStateChange(selectedPatient, { allSelectedValues: value })
            }
            allTotalAmplitudes={currentPatientState.allTotalAmplitudes}
            setAllTotalAmplitudes={(value) =>
              handleStateChange(selectedPatient, { allTotalAmplitudes: value })
            }
            allTogglePositions={currentPatientState.allTogglePositions}
            setAllTogglePositions={(value) =>
              handleStateChange(selectedPatient, { allTogglePositions: value })
            }
            allPercAmpToggles={currentPatientState.allPercAmpToggles}
            setAllPercAmpToggles={(value) =>
              handleStateChange(selectedPatient, { allPercAmpToggles: value })
            }
            allVolAmpToggles={currentPatientState.allVolAmpToggles}
            setAllVolAmpToggles={(value) =>
              handleStateChange(selectedPatient, { allVolAmpToggles: value })
            }
            importCount={currentPatientState.importCount}
            setImportCount={(value) =>
              handleStateChange(selectedPatient, { importCount: value })
            }
            importDataTest={currentPatientState.importData}
            setImportDataTest={(value) =>
              handleStateChange(selectedPatient, { importData: value })
            }
            masterImportData={currentPatientState.masterImportData}
            setMasterImportData={(value) =>
              handleStateChange(selectedPatient, { masterImportData: value })
            }
            matImportFile={currentPatientState.matImportFile}
            setMatImportFile={(value) =>
              handleStateChange(selectedPatient, { matImportFile: value })
            }
            newImportFiles={currentPatientState.newImportFiles}
            setNewImportFiles={(value) =>
              handleStateChange(selectedPatient, { newImportFiles: value })
            }
            filePath={currentPatientState.filePath}
            setFilePath={(value) =>
              handleStateChange(selectedPatient, { filePath: value })
            }
            stimChanged={currentPatientState.stimChanged}
            setStimChanged={(value) =>
              handleStateChange(selectedPatient, { stimChanged: value })
            }
            allStimulationParameters={
              currentPatientState.allStimulationParameters
            }
            setAllStimulationParameters={(value) =>
              handleStateChange(selectedPatient, {
                allStimulationParameters: value,
              })
            }
            visModel={currentPatientState.visModel}
            setVisModel={(value) =>
              handleStateChange(selectedPatient, { visModel: value })
            }
            sessionTitle={currentPatientState.sessionTitle}
            setSessionTitle={(value) =>
              handleStateChange(selectedPatient, { sessionTitle: value })
            }
            patientStates={patientStates}
            importNewS={importNewS}
            selectedPatient={selectedPatient}
            historical={historical}
            mode={mode}
            type={type}
            allTemplateSpaces={currentPatientState.allTemplateSpaces}
            setAllTemplateSpaces={(value) =>
              handleStateChange(selectedPatient, { allTemplateSpaces: value })
            }
            showViewer={showViewer}
            setShowViewer={setShowViewer}
          />
        )}
      </div>
    </div>
  );
}

export default GroupArchitecture;

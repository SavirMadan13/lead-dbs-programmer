/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
// import { useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Dropdown } from 'react-bootstrap';
import TabbedElectrodeIPGSelectionTest from './TabbedElectrodeIPGSelectionTest';
import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';

function StimulationSettings({
  rightElectrode,
  setRightElectrode,
  leftElectrode,
  setLeftElectrode,
  IPG,
  setIPG,
  allQuantities,
  setAllQuantities,
  allSelectedValues,
  setAllSelectedValues,
  allTotalAmplitudes,
  setAllTotalAmplitudes,
  allTogglePositions,
  setAllTogglePositions,
  allPercAmpToggles,
  setAllPercAmpToggles,
  allVolAmpToggles,
  setAllVolAmpToggles,
  importCount,
  setImportCount,
  importDataTest,
  setImportDataTest,
  masterImportData,
  setMasterImportData,
  matImportFile,
  setMatImportFile,
  newImportFiles,
  setNewImportFiles,
  filePath,
  setFilePath,
  stimChanged,
  setStimChanged,
  allStimulationParameters,
  setAllStimulationParameters,
  visModel,
  setVisModel,
  sessionTitle,
  setSessionTitle,
  patientStates,
  importNewS,
  selectedPatient,
}) {
  // const [IPG, setIPG] = useState('');
  // const [leftElectrode, setLeftElectrode] = useState('');
  // const [rightElectrode, setRightElectrode] = useState('');
  let importData = [];
  console.log('IMPORTEDS: ', importNewS);
  const [testData, setTestData] = useState(importDataTest || '');
  const [renderKey, setRenderKey] = useState(0);
  if (importCount === 0) {
    window.electron.ipcRenderer.sendMessage('import-file', ['ping']);
    const newCount = importCount + 1;
    setImportCount(newCount);
  }

  const handleImportedElectrode = (importedElectrode) => {
    if (importedElectrode === 'Boston Scientific Vercise Directed') {
      setLeftElectrode('boston_vercise_directed');
      setRightElectrode('boston_vercise_directed');
      setIPG('Boston');
    } else if (importedElectrode === 'Medtronic 3389') {
      setLeftElectrode('medtronic_3389');
      setRightElectrode('medtronic_3389');
      setIPG('Medtronic_Percept');
    } else if (importedElectrode === 'Medtronic 3387') {
      setLeftElectrode('medtronic_3387');
      setRightElectrode('medtronic_3387');
      setIPG('Medtronic_Percept');
    } else if (importedElectrode === 'Medtronic 3391') {
      setLeftElectrode('medtronic_3391');
      setRightElectrode('medtronic_3391');
      setIPG('Medtronic_Percept');
    } else if (importedElectrode === 'Medtronic B33005') {
      setLeftElectrode('medtronic_b33005');
      setRightElectrode('medtronic_b33005');
      setIPG('Medtronic_Percept');
    } else if (importedElectrode === 'Medtronic B33015') {
      setLeftElectrode('medtronic_b33015');
      setRightElectrode('medtronic_b33015');
      setIPG('Medtronic_Percept');
    } else if (importedElectrode === 'Boston Scientific Vercise') {
      setLeftElectrode('boston_scientific_vercise');
      setRightElectrode('boston_scientific_vercise');
      setIPG('Boston');
    } else if (importedElectrode === 'Boston Scientific Vercise Cartesia HX') {
      setLeftElectrode('boston_scientific_vercise_cartesia_hx');
      setRightElectrode('boston_scientific_vercise_cartesia_hx');
      setIPG('Boston');
    } else if (importedElectrode === 'Boston Scientific Vercise Cartesia X') {
      setLeftElectrode('boston_scientific_vercise_cartesia_x');
      setRightElectrode('boston_scientific_vercise_cartesia_x');
      setIPG('Boston');
    } else if (importedElectrode === 'Abbott ActiveTip (6146-6149)') {
      setLeftElectrode('abbott_activetip_2mm');
      setRightElectrode('abbott_activetip_2mm');
      setIPG('Abbott');
    } else if (importedElectrode === 'Abbott ActiveTip (6142-6145)') {
      setLeftElectrode('abbott_activetip_3mm');
      setRightElectrode('abbott_activetip_3mm');
      setIPG('Abbott');
    } else if (importedElectrode === 'Abbott Directed 6172 (short)') {
      setLeftElectrode('abbott_directed_6172');
      setRightElectrode('abbott_directed_6172');
      setIPG('Abbott');
    } else if (importedElectrode === 'Abbott Directed 6173 (long)') {
      setLeftElectrode('abbott_directed_6173');
      setRightElectrode('abbott_directed_6173');
      setIPG('Abbott');
    }
  };
  // window.electron.ipcRenderer.once('ipc-example', (arg) => {
  //   // eslint-disable-next-line no-console
  //   importData = arg;
  //   const newImportData = importData.split('\\');
  //   console.log(newImportData[2]);
  //   window.electron.ipcRenderer.sendMessage('open-file', newImportData[2]);
  // });
  // window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
  // window.electron.ipcRenderer.on('open-file', (event, data) => {
  //   // Handle received data
  //   console.log(data);
  // });

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

  // window.electron.ipcRenderer.once('import-file', (arg) => {
  //   importData = arg;
  //   // setTestData(importData);
  //   console.log('Import Data', importData);
  //   setMasterImportData(arg);
  //   const numElectrodes = 'numElectrodes';
  //   const selectedElectrode = importData.electrodeModel;
  //   const stimDatasets = importData.priorStims;
  //   const stimDatasetList = {};
  //   Object.keys(stimDatasets).forEach((key) => {
  //     if (key >= 2) {
  //       stimDatasetList[key] = stimDatasets[key].name;
  //     }
  //   });
  //   if (Object.keys(stimDatasetList).length === 0) {
  //     const uniqueID = generateUniqueID();
  //     stimDatasetList[3] = uniqueID;
  //     // setNewStim(uniqueID);
  //   }
  //   setTestData(stimDatasetList);
  //   setImportDataTest(stimDatasetList);
  //   // setMatImportFile(stimDatasetList[3]);
  //   // console.log('Stimdatasetlabel: ', stimDatasetList);
  //   // console.log('masterData: ', arg);
  //   handleImportedElectrode(selectedElectrode);
  // });

  const handleDebugButton = () => {
    const stimDatasets = testData.priorStims;
    console.log(stimDatasets);
    const stimDatasetList = {};
    Object.keys(stimDatasets).forEach((key) => {
      stimDatasetList[key] = stimDatasets[key].name;
    });
    // console.log(stimDatasetList);
  };

  const handleLeftElectrodeChange = (e) => {
    const selectedLeftElectrode = e.target.value;
    if (rightElectrode === '') {
      if (
        selectedLeftElectrode.includes('Boston') ||
        selectedLeftElectrode.includes('boston')
      ) {
        setIPG('Boston');
      } else if (
        selectedLeftElectrode.includes('Abbott') ||
        selectedLeftElectrode.includes('abbott')
      ) {
        setIPG('Abbott');
      } else if (
        selectedLeftElectrode === 'medtronic_3389' ||
        selectedLeftElectrode === 'medtronic_3387' ||
        selectedLeftElectrode === 'medtronic_3391'
      ) {
        setIPG('Medtronic_Activa');
      } else {
        setIPG('Medtronic_Percept');
      }
    }
    setRightElectrode(selectedLeftElectrode);
    setLeftElectrode(selectedLeftElectrode);
    setAllQuantities({});
    setAllSelectedValues({});
    setAllTotalAmplitudes({});
    // console.log('IPGselection: ', IPG);
  };

  const handleRightElectrodeChange = (e) => {
    const selectedRightElectrode = e.target.value;
    if (leftElectrode === '') {
      if (selectedRightElectrode.includes('Boston')) {
        setIPG('Boston');
      } else if (selectedRightElectrode.includes('Medtronic')) {
        setIPG('Medtronic_Percept');
      } else if (selectedRightElectrode.includes('Abbott')) {
        setIPG('Abbott');
      }
    }
    setRightElectrode(selectedRightElectrode);
    setAllQuantities({});
    setAllSelectedValues({});
  };

  const handleIPGChange = (e) => {
    const selectedIPG = e.target.value;
    setIPG(selectedIPG);
    setAllQuantities({});
    setAllSelectedValues({});
    setAllTogglePositions({});
    setAllPercAmpToggles({});
    setAllVolAmpToggles({});
    setAllTotalAmplitudes({});
    // console.log('selectedIPG: ', selectedIPG);
  };

  const [importedData, setImportedData] = useState(null);

  const gatherImportedData = (jsonData) => {
    const newQuantities = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };
    const newSelectedValues = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };
    const newAllQuantities = {};
    // let newSelectedValues = {};
    // console.log(allQuantities[1][0]);

    setLeftElectrode(jsonData.S.elmodel[0]);
    // console.log(jsonData.S.elmodel[1]);
    setRightElectrode(jsonData.S.elmodel[1]);
    const elecIPG = jsonData.S.ipg;
    setIPG(elecIPG);
    const amplitudeArray = [];
    amplitudeArray.push(jsonData.S.amplitude.leftElectrode);
    amplitudeArray.push(jsonData.S.amplitude.rightElectrode);
    setAllTotalAmplitudes(amplitudeArray);
    // console.log('AmpllitudueArray: ', amplitudeArray);
    // console.log(allTotalAmplitudes);

    for (let j = 1; j < 5; j++) {
      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 7}`;
        const dynamicKey1 = `k${i}`;
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // console.log('nestred data: ', nestedData);
        if (jsonData.S[dynamicKey2][dynamicKey]) {
          newQuantities[j][i] = parseFloat(
            jsonData.S[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData.S[dynamicKey2].case.perc);
          if (jsonData.S[dynamicKey2][dynamicKey].pol === 0) {
            newSelectedValues[j][i] = 'left';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 1) {
            newSelectedValues[j][i] = 'center';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 2) {
            newSelectedValues[j][i] = 'right';
          }
          if (jsonData.S[dynamicKey2].case.pol === 0) {
            newSelectedValues[j][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case.pol === 1) {
            newSelectedValues[j][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case.pol === 2) {
            newSelectedValues[j][0] = 'right';
          }
        }
        if (jsonData.S[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData.S[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(
            jsonData.S[dynamicKey3].case.perc,
          );
          if (jsonData.S[dynamicKey3][dynamicKey1].pol === 0) {
            newSelectedValues[j + 4][i + 1] = 'left';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 1) {
            newSelectedValues[j + 4][i + 1] = 'center';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 2) {
            newSelectedValues[j + 4][i + 1] = 'right';
          }
          if (jsonData.S[dynamicKey2].case.pol === 0) {
            newSelectedValues[j + 4][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case.pol === 1) {
            newSelectedValues[j + 4][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case.pol === 2) {
            newSelectedValues[j + 4][0] = 'right';
          }
        }
        // console.log(jsonData.S[dynamicKey3][dynamicKey1].perc);
      }
      newAllQuantities[j] = newQuantities[j];
      newAllQuantities[j + 4] = newQuantities[j + 4];
      // newSelectedValues[j] = newSelectedValues[j]
    }
    // Object.keys(newQuantities).forEach((key) => {
    //   console.log(newQuantities[key].length);
    //   if (newQuantities[key].length < 1) {
    //     console.log(newQuantities[key].length);
    //     newQuantities[key].reduce();
    //   }
    // });
    // console.
    const filteredValues = Object.keys(newSelectedValues)
      .filter((key) => Object.keys(newSelectedValues[key]).length > 0) // Filter non-empty values
      .reduce((obj, key) => {
        obj[key] = newSelectedValues[key]; // Add non-empty values to new object
        return obj;
      }, {});

    const filteredQuantities = Object.keys(newQuantities)
      .filter((key) => Object.keys(newQuantities[key]).length > 0) // Filter non-empty values
      .reduce((obj, key) => {
        obj[key] = newQuantities[key]; // Add non-empty values to new object
        return obj;
      }, {});

    // console.log('filtered', filteredQuantities);
    // console.log(jsonData.S['Ls1'].case['pol']);
    // console.log('newQuantities: ', newQuantities);
    // console.log('newvalues: ', newSelectedValues);
    setAllSelectedValues(filteredValues);
    setAllQuantities(filteredQuantities);
  };

  const gatherImportedDataNew = (jsonData) => {
    console.log(jsonData);
    const newQuantities = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };
    const newSelectedValues = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };
    const newTotalAmplitude = {
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
    };
    const newAllQuantities = {};
    // let newSelectedValues = {};
    // console.log(allQuantities[1][0]);

    // setLeftElectrode(jsonData.S.elmodel[0]);
    // console.log(jsonData.S.elmodel[1]);
    // setRightElectrode(jsonData.S.elmodel[1]);
    // const elecIPG = jsonData.S.ipg;
    // setIPG(elecIPG);
    // for (let a = 1)
    // const amplitudeArray = [];
    // amplitudeArray.push(jsonData.S.amplitude[0]);
    // console.log(jsonData.S.amplitude['leftAmplitude']);
    // amplitudeArray.push(jsonData.S.amplitude[0]);
    // console.log(amplitudeArray);
    // setAllTotalAmplitudes(amplitudeArray);
    // console.log('AmpllitudueArray: ', amplitudeArray);
    // console.log(allTotalAmplitudes);

    for (let j = 1; j < 5; j++) {
      // newTotalAmplitude[j] = jsonData.S.amplitude.leftAmplitude[j - 1];
      newTotalAmplitude[j] = jsonData.S.amplitude[0][j - 1];
      // newTotalAmplitude[j + 4] = jsonData.S.amplitude.rightAmplitude[j - 1];
      newTotalAmplitude[j + 4] = jsonData.S.amplitude[1][j - 1];
      console.log('newTotalAmplitude: ', newTotalAmplitude);
      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 7}`;
        const dynamicKey1 = `k${i}`;
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // console.log('nestred data: ', nestedData);
        if (jsonData.S[dynamicKey2][dynamicKey]) {
          newQuantities[j][i] = parseFloat(
            jsonData.S[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData.S[dynamicKey2].case.perc);
          if (jsonData.S[dynamicKey2][dynamicKey].pol === 0) {
            newSelectedValues[j][i] = 'left';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 1) {
            newSelectedValues[j][i] = 'center';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 2) {
            newSelectedValues[j][i] = 'right';
          }
          if (jsonData.S[dynamicKey2].case.pol === 0) {
            newSelectedValues[j][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case.pol === 1) {
            newSelectedValues[j][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case.pol === 2) {
            newSelectedValues[j][0] = 'right';
          }
        }
        if (jsonData.S[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData.S[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(
            jsonData.S[dynamicKey3].case.perc,
          );
          if (jsonData.S[dynamicKey3][dynamicKey1].pol === 0) {
            newSelectedValues[j + 4][i + 1] = 'left';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 1) {
            newSelectedValues[j + 4][i + 1] = 'center';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 2) {
            newSelectedValues[j + 4][i + 1] = 'right';
          }
          if (jsonData.S[dynamicKey2].case.pol === 0) {
            newSelectedValues[j + 4][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case.pol === 1) {
            newSelectedValues[j + 4][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case.pol === 2) {
            newSelectedValues[j + 4][0] = 'right';
          }
        }
        // console.log(jsonData.S[dynamicKey3][dynamicKey1].perc);
      }
      newAllQuantities[j] = newQuantities[j];
      newAllQuantities[j + 4] = newQuantities[j + 4];
      // newSelectedValues[j] = newSelectedValues[j]
    }
    // Object.keys(newQuantities).forEach((key) => {
    //   console.log(newQuantities[key].length);
    //   if (newQuantities[key].length < 1) {
    //     console.log(newQuantities[key].length);
    //     newQuantities[key].reduce();
    //   }
    // });
    // console.
    console.log(newTotalAmplitude);
    const filteredValues = Object.keys(newSelectedValues)
      .filter((key) => Object.keys(newSelectedValues[key]).length > 0) // Filter non-empty values
      .reduce((obj, key) => {
        obj[key] = newSelectedValues[key]; // Add non-empty values to new object
        return obj;
      }, {});

    const filteredQuantities = Object.keys(newQuantities)
      .filter((key) => Object.keys(newQuantities[key]).length > 0) // Filter non-empty values
      .reduce((obj, key) => {
        obj[key] = newQuantities[key]; // Add non-empty values to new object
        return obj;
      }, {});

    console.log('filtered', filteredQuantities);
    // console.log(jsonData.S['Ls1'].case['pol']);
    // console.log('newQuantities: ', newQuantities);
    // console.log('newvalues: ', newSelectedValues);
    setAllSelectedValues(filteredValues);
    setAllQuantities(filteredQuantities);
    setAllTotalAmplitudes(newTotalAmplitude);
    console.log('STIMCHANGED: ', stimChanged);
    // setLeftElectrode(leftElectrode);
    // setAllQuantities(filteredQuantities => {
    //   const newAllQuantities = { ...filteredQuantities };
    //   return filteredQuantities;
    // });
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          gatherImportedData(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  const fileInputRef = useRef(null);
  const [newStims, setNewStims] = useState([]);
  const handleImportFileChange = (e) => {
    // console.log('E: ', masterImportData);
    console.log('NewStims ', newStims.includes(e.target.value));
    // if (!newStims.includes(e.target.value)) {
    window.electron.ipcRenderer.sendMessage(
      'import-previous-files',
      e.target.value,
      // key,
      masterImportData,
    );
    // }
    setMatImportFile(e.target.value);
    setStimChanged(true);
  };

  // window.electron.ipcRenderer.on('import-previous-files-reply', (arg, arg1) => {
  //   // console.log('hello');
  //   const newFilePath = arg;
  //   const newS = arg1;
  //   setFilePath(newFilePath);
  //   if (arg !== 'Empty') {
  //     console.log('here');
  //     gatherImportedDataNew(newS);
  //   } else if (arg === 'Empty') {
  //     const uniqueID = generateUniqueID();
  //     setNewStim(uniqueID);
  //   }
  //   // Here is where I can write an if statement for if arg1 is empty, and then I can write a statement to create
  //   // a new one and then select that one as the stimulation setting
  //   console.log('MATIMPORTDATA: ', matImportFile);
  //   console.log('STIMCHANGED: ', stimChanged);
  // });

  // window.electron.ipcRenderer.on('import-previous-files', (arg) => {
  //   // console.log('hello');
  //   const newS = arg;
  //   if (newS !== 'Empty') {
  //     console.log('here');
  //     gatherImportedDataNew(newS);
  //   } else if (newS === 'Empty') {
  //     const uniqueID = generateUniqueID();
  //     setNewStim(uniqueID);
  //   }
  //   // Here is where I can write an if statement for if arg1 is empty, and then I can write a statement to create
  //   // a new one and then select that one as the stimulation setting
  //   console.log('MATIMPORTDATA: ', matImportFile);
  //   console.log('STIMCHANGED: ', stimChanged);
  // });

  const handleOnAddButtonClick = () => {
    // console.log
    // newStims.push(newStim);
    setNewStims([...newStims, newStim]);
    let lastKey = 0;
    Object.keys(importDataTest).forEach((key) => {
      lastKey = parseFloat(key) + 1;
    });
    const updatedImportDataTest = { ...importDataTest };
    updatedImportDataTest[lastKey] = newStim;
    setImportDataTest(updatedImportDataTest);
    const updatedNewImportFiles = { ...newImportFiles };
    updatedNewImportFiles[lastKey] = newStim;
    // setNewImportFiles(updatedNewImportFiles);
    console.log(updatedImportDataTest);
    console.log(newStim);
    setMatImportFile(newStim);
    setNewStim('');
  };

  const handleNewStimText = (event) => {
    setNewStim(event.target.value);
  };

  const handleDebugButton2 = () => {
    console.log('ALLQUANTITIES: ', allQuantities);
  };

  const [namingConvention, setNamingConvention] = useState('clinical');
  const getVariant2 = (value) => {
    return 'outline-secondary';
  };

  const namingConventionDef = [
    { name: 'clinical', value: 'clinical' },
    { name: 'lead-dbs', value: 'lead-dbs' },
  ];

  const handleNamingConventionChange = (newConvention) => {
    setNamingConvention(newConvention);
    setRenderKey(renderKey + 1);
  };

  return (
    <div>
      <div className="stimulationSettingsContainer">
        <div />
        {/* <div className="stim-id-group"></div> */}
        <div />
        <Dropdown>
          <Dropdown.Toggle>Implanted Hardware</Dropdown.Toggle>
          <Dropdown.Menu style={{ width: '350px', paddingLeft: '10px' }}>
            <h2 style={{ fontSize: 16 }}>Left Electrode</h2>
            <select
              value={leftElectrode}
              onChange={(e) => handleLeftElectrodeChange(e)}
              // disabled
            >
              <option value="">None</option>
              <option value="abbott_activetip_2mm">
                Abbott ActiveTip (2mm)
              </option>
              <option value="abbott_activetip_3mm">
                Abbott ActiveTip (3mm)
              </option>
              <option value="abbott_directed_6172">Abbott Directed 6172</option>
              <option value="abbott_directed_6173">Abbott Directed 6173</option>
              <option value="boston_vercise">Boston Scientific Vercise</option>
              <option value="boston_vercise_directed">
                Boston Scientific Vercise Directed
              </option>
              <option value="boston_vercise_cartesia_x">
                Boston Scientific Vercise Cartesia X
              </option>
              <option value="boston_vercise_cartesia_hx">
                Boston Scientific Vercise Cartesia HX
              </option>
              <option value="medtronic_3387">Medtronic 3387</option>
              <option value="medtronic_3389">Medtronic 3389</option>
              <option value="medtronic_3391">Medtronic 3391</option>
              <option value="medtronic_b33005">Medtronic B33005</option>
              <option value="medtronic_b33015">Medtronic B33015</option>
            </select>
            <div />
            <h2 style={{ fontSize: 16 }}>Right Electrode</h2>
            <select
              value={rightElectrode}
              onChange={(e) => handleRightElectrodeChange(e)}
            >
              <option value="">None</option>
              <option value="abbott_activetip_2mm">
                Abbott ActiveTip (2mm)
              </option>
              <option value="abbott_activetip_3mm">
                Abbott ActiveTip (3mm)
              </option>
              <option value="abbott_directed_6172">Abbott Directed 6172</option>
              <option value="abbott_directed_6173">Abbott Directed 6173</option>
              <option value="boston_vercise">Boston Scientific Vercise</option>
              <option value="boston_vercise_directed">
                Boston Scientific Vercise Directed
              </option>
              <option value="boston_vercise_cartesia_x">
                Boston Scientific Vercise Cartesia X
              </option>
              <option value="boston_vercise_cartesia_hx">
                Boston Scientific Vercise Cartesia HX
              </option>
              <option value="medtronic_3387">Medtronic 3387</option>
              <option value="medtronic_3389">Medtronic 3389</option>
              <option value="medtronic_3391">Medtronic 3391</option>
              <option value="medtronic_b33005">Medtronic B33005</option>
              <option value="medtronic_b33015">Medtronic B33015</option>
            </select>
            <div />
            <h2 style={{ fontSize: 16 }}>IPG</h2>
            <select value={IPG} onChange={(e) => handleIPGChange(e)}>
              <option value="">None</option>
              <option value="Abbott">Abbott (Infinity, Brio, Libra)</option>
              <option value="Boston">
                Boston Scientific (Vercise, Genus, Gevia)
              </option>
              <option value="Medtronic_Activa">Medtronic Activa</option>
              <option value="Medtronic_Percept">Medtronic Percept</option>
              <option value="Research">Master</option>
            </select>
          </Dropdown.Menu>
        </Dropdown>
        <div
          style={{ paddingBottom: '20px', float: 'right', marginRight: '20px' }}
        >
          <h4 style={{fontSize: '16px', marginBottom: '2px'}}>Contact Naming</h4>
          <ButtonGroup>
            {namingConventionDef.map((name, idx) => (
              <ToggleButton
                key={idx}
                id={`name-${idx}`}
                type="radio"
                variant={getVariant2(name.value)}
                name="name"
                value={name.value}
                checked={namingConvention === name.value}
                onChange={(e) =>
                  handleNamingConventionChange(e.currentTarget.value)
                }
              >
                {name.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <div>
        {(leftElectrode || rightElectrode) && (
          <TabbedElectrodeIPGSelectionTest
            selectedElectrodeLeft={leftElectrode}
            selectedElectrodeRight={rightElectrode}
            IPG={IPG}
            key={renderKey}
            // setKey={setKey}
            allQuantities={allQuantities}
            setAllQuantities={setAllQuantities}
            allSelectedValues={allSelectedValues}
            setAllSelectedValues={setAllSelectedValues}
            allTotalAmplitudes={allTotalAmplitudes}
            setAllTotalAmplitudes={setAllTotalAmplitudes}
            allStimulationParameters={allStimulationParameters}
            setAllStimulationParameters={setAllStimulationParameters}
            visModel={visModel}
            setVisModel={setVisModel}
            sessionTitle={sessionTitle}
            setSessionTitle={setSessionTitle}
            allTogglePositions={allTogglePositions}
            setAllTogglePositions={setAllTogglePositions}
            allPercAmpToggles={allPercAmpToggles}
            setAllPercAmpToggles={setAllPercAmpToggles}
            allVolAmpToggles={allVolAmpToggles}
            setAllVolAmpToggles={setAllVolAmpToggles}
            filePath={filePath}
            setFilePath={setFilePath}
            matImportFile={matImportFile}
            stimChanged={stimChanged}
            setStimChanged={setStimChanged}
            patientStates={patientStates}
            namingConvention={namingConvention}
            selectedPatient={selectedPatient}
          />
        )}
      </div>
    </div>
  );
}

export default StimulationSettings;

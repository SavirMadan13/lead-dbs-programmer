// import { useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';
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
}) {
  // const [IPG, setIPG] = useState('');
  // const [leftElectrode, setLeftElectrode] = useState('');
  // const [rightElectrode, setRightElectrode] = useState('');
  let importData = [];
  const [testData, setTestData] = useState(importDataTest || '');
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
    }
  };
  window.electron.ipcRenderer.once('ipc-example', (arg) => {
    // eslint-disable-next-line no-console
    importData = arg;
    const newImportData = importData.split('\\');
    console.log(newImportData[2]);
    window.electron.ipcRenderer.sendMessage('open-file', newImportData[2]);
  });
  window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
  window.electron.ipcRenderer.on('open-file', (event, data) => {
    // Handle received data
    console.log(data);
  });

  window.electron.ipcRenderer.once('import-file', (arg) => {
    importData = arg;
    // setTestData(importData);
    console.log('Import Data', importData);
    setMasterImportData(arg);
    const numElectrodes = 'numElectrodes';
    console.log(importData['numElectrodes']);
    const selectedElectrode = importData.electrodeModel;
    const stimDatasets = importData.priorStims;
    const stimDatasetList = {};
    Object.keys(stimDatasets).forEach((key) => {
      if (key > 3) {
        stimDatasetList[key] = stimDatasets[key].name;
      }
    });
    setTestData(stimDatasetList);
    setImportDataTest(stimDatasetList);
    console.log('Stimdatasetlabel: ', stimDatasetList);
    console.log('masterData: ', arg);
    handleImportedElectrode(selectedElectrode);
  });

  const handleDebugButton = () => {
    const stimDatasets = testData.priorStims;
    console.log(stimDatasets);
    const stimDatasetList = {};
    Object.keys(stimDatasets).forEach((key) => {
      stimDatasetList[key] = stimDatasets[key].name;
    });
    console.log(stimDatasetList);
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
        selectedLeftElectrode.includes('Medtronic') ||
        selectedLeftElectrode.includes('medtronic')
      ) {
        setIPG('Medtronic_Percept');
      } else if (
        selectedLeftElectrode.includes('Abbott') ||
        selectedLeftElectrode.includes('abbott')
      ) {
        setIPG('Abbott');
      }
    }
    setRightElectrode(selectedLeftElectrode);
    setLeftElectrode(selectedLeftElectrode);
    setAllQuantities({});
    setAllSelectedValues({});
    setAllTotalAmplitudes({});
    console.log('IPGselection: ', IPG);
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
    console.log('selectedIPG: ', selectedIPG);
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
    console.log(jsonData.S.elmodel[1]);
    setRightElectrode(jsonData.S.elmodel[1]);
    const elecIPG = jsonData.S.ipg;
    setIPG(elecIPG);
    const amplitudeArray = [];
    amplitudeArray.push(jsonData.S.amplitude.leftElectrode);
    amplitudeArray.push(jsonData.S.amplitude.rightElectrode);
    setAllTotalAmplitudes(amplitudeArray);
    console.log('AmpllitudueArray: ', amplitudeArray);
    console.log(allTotalAmplitudes);

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      let dynamicKey3 = `Rs${j}`;
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i + 7}`;
        let dynamicKey1 = `k${i}`;
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // console.log('nestred data: ', nestedData);
        if (jsonData.S[dynamicKey2][dynamicKey]) {
          newQuantities[j][i] = parseFloat(
            jsonData.S[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(
            jsonData.S[dynamicKey2].case['perc'],
          );
          if (jsonData.S[dynamicKey2][dynamicKey].pol === 0) {
            newSelectedValues[j][i] = 'left';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 1) {
            newSelectedValues[j][i] = 'center';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 2) {
            newSelectedValues[j][i] = 'right';
          }
          if (jsonData.S[dynamicKey2].case['pol'] === 0) {
            newSelectedValues[j][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 1) {
            newSelectedValues[j][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 2) {
            newSelectedValues[j][0] = 'right';
          }
        }
        if (jsonData.S[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData.S[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(
            jsonData.S[dynamicKey3].case['perc'],
          );
          if (jsonData.S[dynamicKey3][dynamicKey1].pol === 0) {
            newSelectedValues[j + 4][i + 1] = 'left';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 1) {
            newSelectedValues[j + 4][i + 1] = 'center';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 2) {
            newSelectedValues[j + 4][i + 1] = 'right';
          }
          if (jsonData.S[dynamicKey2].case['pol'] === 0) {
            newSelectedValues[j + 4][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 1) {
            newSelectedValues[j + 4][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 2) {
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
    console.log('newQuantities: ', newQuantities);
    console.log('newvalues: ', newSelectedValues);
    setAllSelectedValues(filteredValues);
    setAllQuantities(filteredQuantities);
  };

  const gatherImportedDataNew = (jsonData) => {
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

    // setLeftElectrode(jsonData.S.elmodel[0]);
    // console.log(jsonData.S.elmodel[1]);
    // setRightElectrode(jsonData.S.elmodel[1]);
    // const elecIPG = jsonData.S.ipg;
    // setIPG(elecIPG);
    const amplitudeArray = [];
    amplitudeArray.push(jsonData.S.amplitude.leftElectrode);
    amplitudeArray.push(jsonData.S.amplitude.rightElectrode);
    setAllTotalAmplitudes(amplitudeArray);
    console.log('AmpllitudueArray: ', amplitudeArray);
    console.log(allTotalAmplitudes);

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      let dynamicKey3 = `Rs${j}`;
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i + 7}`;
        let dynamicKey1 = `k${i}`;
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // console.log('nestred data: ', nestedData);
        if (jsonData.S[dynamicKey2][dynamicKey]) {
          newQuantities[j][i] = parseFloat(
            jsonData.S[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(
            jsonData.S[dynamicKey2].case['perc'],
          );
          if (jsonData.S[dynamicKey2][dynamicKey].pol === 0) {
            newSelectedValues[j][i] = 'left';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 1) {
            newSelectedValues[j][i] = 'center';
          } else if (jsonData.S[dynamicKey2][dynamicKey].pol === 2) {
            newSelectedValues[j][i] = 'right';
          }
          if (jsonData.S[dynamicKey2].case['pol'] === 0) {
            newSelectedValues[j][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 1) {
            newSelectedValues[j][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 2) {
            newSelectedValues[j][0] = 'right';
          }
        }
        if (jsonData.S[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData.S[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(
            jsonData.S[dynamicKey3].case['perc'],
          );
          if (jsonData.S[dynamicKey3][dynamicKey1].pol === 0) {
            newSelectedValues[j + 4][i + 1] = 'left';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 1) {
            newSelectedValues[j + 4][i + 1] = 'center';
          } else if (jsonData.S[dynamicKey3][dynamicKey1].pol === 2) {
            newSelectedValues[j + 4][i + 1] = 'right';
          }
          if (jsonData.S[dynamicKey2].case['pol'] === 0) {
            newSelectedValues[j + 4][0] = 'left';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 1) {
            newSelectedValues[j + 4][0] = 'center';
          } else if (jsonData.S[dynamicKey2].case['pol'] === 2) {
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
    console.log('newQuantities: ', newQuantities);
    console.log('newvalues: ', newSelectedValues);
    setAllSelectedValues(filteredValues);
    setAllQuantities(filteredQuantities);
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

  const handleImportFileChange = (e) => {
    console.log('E: ', masterImportData);
    if (e.target.value !== 'new') {
      window.electron.ipcRenderer.sendMessage(
        'import-previous-files',
        e.target.value,
        // key,
        masterImportData,
      );
    }
    setMatImportFile(e.target.value);
  };

  window.electron.ipcRenderer.on('import-previous-files-reply', (arg) => {
    console.log('hello');
    console.log(arg);
    gatherImportedDataNew(arg);
  });

  // useEffect(() => {
  //   if (importedData) {
  //     gatherImportedData(importedData);
  //   }
  // }, [importedData]);

  return (
    <div className="StimulationParameters">
      {/* <button onClick={handleMatlabConnectivity}>Matlab Test</button> */}
      {/* <button
        className="import-button"
        onClick={() => fileInputRef.current.click()}
        // onClick={gatherImportedData(importData)}

      >
        Import Data
      </button>
      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input element
      /> */}
      <div></div>
      <button onClick={handleDebugButton}>debug</button>
      <h2>Load Stimulation Settings</h2>
      <select value={matImportFile} onChange={(e) => handleImportFileChange(e)}>
        {Object.keys(importDataTest).map((key) => (
          <option key={key} value={importDataTest[key]}>
            {importDataTest[key]}
          </option>
        ))}
      </select>
      <div></div>
      <h2>Choose Left Electrode</h2>
      <select
        value={leftElectrode}
        onChange={(e) => handleLeftElectrodeChange(e)}
      >
        <option value="">None</option>
        {/* <option value="BostonCartesia">Boston Scientific Cartesia</option> */}
        {/* <option value="Medtronic3389">Medtronic 3389</option>
        <option value="Medtronic3387">Medtronic 3387</option>
        <option value="Medtronic3391">Medtronic 3391</option>
        <option value="MedtronicB33005">Medtronic B33005</option>
        <option value="BostonScientificVercise">
          Boston Scientific Vercise
        </option>
        <option value="BostonCartesiaTest">
          Boston Scientific Vercise Directed
        </option>
        <option value="NewBostonCartesiaTest">
          Boston Scientific Vercise Directed - Alternate
        </option>
        <option value="BostonScientificCartesiaHX">Boston Scientific Vercise Cartesia HX</option>
        <option value="BostonScientificCartesiaX">Boston Scientific Vercise Cartesia X</option>
        <option value="AbbottActiveTip2">Abbott ActiveTip (2mm)</option>
        <option value="AbbottActiveTip3">Abbott ActiveTip (3mm)</option>
        <option value="AbbottDirected6172">Abbott Directed 6172</option>
        <option value="AbbottDirected6173">Abbott Directed 6173</option> */}
        <option value="abbott_activetip_2mm">Abbott ActiveTip (2mm)</option>
        <option value="abbott_activetip_3mm">Abbott ActiveTip (3mm)</option>
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
        {/* <option value="AbbottDirectedTest">Abbott Directed</option> */}
      </select>
      <div></div>
      <h2>Choose Right Electrode</h2>
      <select
        value={rightElectrode}
        onChange={(e) => handleRightElectrodeChange(e)}
      >
        <option value="">None</option>
        {/* <option value="Medtronic3389">Medtronic 3389</option>
        <option value="Medtronic3387">Medtronic 3387</option>
        <option value="Medtronic3391">Medtronic 3391</option>
        <option value="MedtronicB33005">Medtronic B33005</option>
        <option value="BostonScientificVercise">
          Boston Scientific Vercise
        </option>
        <option value="BostonCartesiaTest">
          Boston Scientific Vercise Directed
        </option>
        <option value="NewBostonCartesiaTest">
          Boston Scientific Vercise Directed - Alternate
        </option>
        <option value="BostonScientificCartesiaHX">Boston Scientific Vercise Cartesia HX</option>
        <option value="BostonScientificCartesiaX">Boston Scientific Vercise Cartesia X</option>
        <option value="AbbottActiveTip2">Abbott ActiveTip (2mm)</option>
        <option value="AbbottActiveTip3">Abbott ActiveTip (3mm)</option>
        <option value="AbbottDirected6172">Abbott Directed 6172</option>
        <option value="AbbottDirected6173">Abbott Directed 6173</option> */}
        <option value="abbott_activetip_2mm">Abbott ActiveTip (2mm)</option>
        <option value="abbott_activetip_3mm">Abbott ActiveTip (3mm)</option>
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
      <div></div>
      <h2>Choose IPG</h2>
      <select value={IPG} onChange={(e) => handleIPGChange(e)}>
        <option value="">None</option>
        <option value="Abbott">Abbott (Infinity, Brio, Libra)</option>
        <option value="Boston">
          Boston Scientific (Vercise, Genus, Gevia)
        </option>
        <option value="Medtronic_Activa">Medtronic Activa</option>
        <option value="Medtronic_Percept">Medtronic Percept</option>
      </select>
      <div></div>
      <button
        className="import-button"
        onClick={() => fileInputRef.current.click()}
        // onClick={gatherImportedData(importData)}
      >
        Import Data
      </button>
      <input
        ref={fileInputRef}
        className="file-input"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input element
      />
    </div>
  );
}

export default StimulationSettings;

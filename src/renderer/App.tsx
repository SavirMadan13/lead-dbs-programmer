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

const importData = [];

function Hello() {
  return (
    <div>
      <h1>Stimulation Controller</h1>
      <div className="stimulation-parameters" />
      <div className="stimulation-parameters" />
      <div className="Hello">
        <TabbedElectrodeIPGSelectionTest
          IPG={undefined}
          selectedElectrodeLeft={undefined}
          selectedElectrodeRight={undefined}
          allQuantities={undefined}
          setAllQuantities={undefined}
          allSelectedValues={undefined}
          setAllSelectedValues={undefined}
          allTotalAmplitudes={undefined}
          setAllTotalAmplitudes={undefined}
          allStimulationParameters={undefined}
          setAllStimulationParameters={undefined}
          visModel={undefined}
          setVisModel={undefined}
          sessionTitle={undefined}
          setSessionTitle={undefined}
          allTogglePositions={undefined}
          setAllTogglePositions={undefined}
          allPercAmpToggles={undefined}
          setAllPercAmpToggles={undefined}
          allVolAmpToggles={undefined}
          filePath={undefined}
          setFilePath={undefined}
          matImportFile={undefined}
          stimChanged={undefined}
          setStimChanged={undefined}
        />
      </div>
    </div>
  );
}

export default function App() {
  let electrodeList: any[] = [];
  const [patientName, setPatientName] = useState('');
  const [patients, setPatients] = useState([]);
  const [patientStates, setPatientStates] = useState({});
  const [importNewS, setImportNewS] = useState({});
  const [electrodeMaster, setElectrodeMaster] = useState('');
  const [ipgMaster, setIpgMaster] = useState('');
  const [groupLabel, setGrouplabel] = useState('');

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
    allTemplateSpaces: 0,
  };

  const varargout = [
    { displayName: 'Medtronic 3389', value: 'medtronic_3389' },
    { displayName: 'Medtronic 3387', value: 'medtronic_3387' },
    { displayName: 'Medtronic 3391', value: 'medtronic_3391' },
    { displayName: 'Medtronic B33005', value: 'medtronic_b33005' },
    { displayName: 'Medtronic B33015', value: 'medtronic_b33015' },
    { displayName: 'Boston Scientific Vercise', value: 'boston_vercise' },
    {
      displayName: 'Boston Scientific Vercise Directed',
      value: 'boston_vercise_directed',
    },
    // {
    //   displayName: 'Boston Scientific Vercise Cartesia HX',
    //   value: 'boston_vercise_cartesia_hx',
    // },
    // {
    //   displayName: 'Boston Scientific Vercise Cartesia X',
    //   value: 'boston_vercise_cartesia_x',
    // },
    {
      displayName: 'Abbott ActiveTip (6146-6149)',
      value: 'abbott_activetip_2mm',
    },
    {
      displayName: 'Abbott ActiveTip (6142-6145)',
      value: 'abbott_activetip_3mm',
    },
    {
      displayName: 'Abbott Directed 6172 (short)',
      value: 'abbott_directed_05',
    },
    { displayName: 'Abbott Directed 6173 (long)', value: 'abbott_directed_15' },
    { displayName: 'PINS Medical L301', value: 'pins_l301' },
    { displayName: 'PINS Medical L302', value: 'pins_l302' },
    { displayName: 'PINS Medical L303', value: 'pins_l303' },
    { displayName: 'SceneRay SR1200', value: 'sceneray_sr1200' },
    { displayName: 'SceneRay SR1210', value: 'sceneray_sr1210' },
    { displayName: 'SceneRay SR1211', value: 'sceneray_sr1211' },
    { displayName: 'SceneRay SR1242', value: 'sceneray_sr1242' },
    { displayName: 'SDE-08 S8 Legacy', value: 'sde_08_s8_legacy' },
    { displayName: 'SDE-08 S10 Legacy', value: 'sde_08_s10_legacy' },
    { displayName: 'SDE-08 S12 Legacy', value: 'sde_08_s12_legacy' },
    { displayName: 'SDE-08 S16 Legacy', value: 'sde_08_s16_legacy' },
    { displayName: 'SDE-08 S8', value: 'sde_08_s8' },
    { displayName: 'SDE-08 S10', value: 'sde_08_s10' },
    { displayName: 'SDE-08 S12', value: 'sde_08_s12' },
    { displayName: 'SDE-08 S14', value: 'sde_08_s14' },
    { displayName: 'SDE-08 S16', value: 'sde_08_s16' },
    { displayName: 'PMT 2102-04-091', value: 'pmt_2102_04_091' },
    { displayName: 'PMT 2102-06-091', value: 'pmt_2102_06_091' },
    { displayName: 'PMT 2102-08-091', value: 'pmt_2102_08_091' },
    { displayName: 'PMT 2102-10-091', value: 'pmt_2102_10_091' },
    { displayName: 'PMT 2102-12-091', value: 'pmt_2102_12_091' },
    { displayName: 'PMT 2102-14-091', value: 'pmt_2102_14_091' },
    { displayName: 'PMT 2102-16-091', value: 'pmt_2102_16_091' },
    { displayName: 'PMT 2102-16-092', value: 'pmt_2102_16_092' },
    { displayName: 'PMT 2102-16-093', value: 'pmt_2102_16_093' },
    { displayName: 'PMT 2102-16-131', value: 'pmt_2102_16_131' },
    { displayName: 'PMT 2102-16-142', value: 'pmt_2102_16_142' },
    { displayName: '2069-EPC-05C-35', value: 'epc_05c' },
    { displayName: '2069-EPC-15C-35', value: 'epc_15c' },
    { displayName: 'NeuroPace DL-344-3.5', value: 'neuropace_dl_344_35' },
    { displayName: 'NeuroPace DL-344-10', value: 'neuropace_dl_344_10' },
    { displayName: 'DIXI D08-05AM', value: 'dixi_d08_05am' },
    { displayName: 'DIXI D08-08AM', value: 'dixi_d08_08am' },
    { displayName: 'DIXI D08-10AM', value: 'dixi_d08_10am' },
    { displayName: 'DIXI D08-12AM', value: 'dixi_d08_12am' },
    { displayName: 'DIXI D08-15AM', value: 'dixi_d08_15am' },
    { displayName: 'DIXI D08-18AM', value: 'dixi_d08_18am' },
    { displayName: 'AdTech BF08R-SP05X', value: 'adtech_bf08r_sp05x' },
    { displayName: 'AdTech BF08R-SP21X', value: 'adtech_bf08r_sp21x' },
    { displayName: 'AdTech BF08R-SP61X', value: 'adtech_bf08r_sp61x' },
    { displayName: 'AdTech BF09R-SP61X-0BB', value: 'adtech_bf09r_sp61x_0bb' },
    { displayName: 'AdTech RD06R-SP05X', value: 'adtech_rd06r_sp05x' },
    { displayName: 'AdTech RD08R-SP05X', value: 'adtech_rd08r_sp05x' },
    { displayName: 'AdTech RD10R-SP03X', value: 'adtech_rd10r_sp03x' },
    { displayName: 'AdTech RD10R-SP05X', value: 'adtech_rd10r_sp05x' },
    { displayName: 'AdTech RD10R-SP06X', value: 'adtech_rd10r_sp06x' },
    { displayName: 'AdTech RD10R-SP07X', value: 'adtech_rd10r_sp07x' },
    { displayName: 'AdTech RD10R-SP08X', value: 'adtech_rd10r_sp08x' },
    { displayName: 'AdTech SD06R-SP26X', value: 'adtech_sd06r_sp26x' },
    { displayName: 'AdTech SD08R-SP05X', value: 'adtech_sd08r_sp05x' },
    { displayName: 'AdTech SD10R-SP05X', value: 'adtech_sd10r_sp05x' },
    {
      displayName: 'AdTech SD10R-SP05X Choi',
      value: 'adtech_sd10r_sp05x_choi',
    },
    { displayName: 'AdTech SD14R-SP05X', value: 'adtech_sd14r_sp05x' },
    { displayName: 'ELAINE Rat Electrode', value: 'elaine_rat_electrode' },
    { displayName: 'FHC WU Rat Electrode', value: 'fhc_wu_rat_electrode' },
    { displayName: 'NuMed Mini Lead', value: 'numed_minilead' },
    {
      displayName: 'Aleva directSTIM Directed',
      value: 'aleva_directstim_directed',
    },
    { displayName: 'Aleva directSTIM 11500', value: 'aleva_directstim_11500' },
    {
      displayName: 'SmartFlow Cannula NGS-NC-06',
      value: 'smartflow_ngs_nc_06',
    },
  ];

  // const handleImportedElectrode = (importedElectrode) => {
  //   switch (importedElectrode) {
  //     case 'Boston Scientific Vercise Directed':
  //       return 'boston_vercise_directed';
  //     case 'Medtronic 3389':
  //       return 'medtronic_3389';
  //     case 'Medtronic 3387':
  //       return 'medtronic_3387';
  //     case 'Medtronic 3391':
  //       return 'medtronic_3391';
  //     case 'Medtronic B33005':
  //       return 'medtronic_b33005';
  //     case 'Medtronic B33015':
  //       return 'medtronic_b33015';
  //     case 'Boston Scientific Vercise':
  //       return 'boston_scientific_vercise';
  //     case 'Boston Scientific Vercise Cartesia HX':
  //       return 'boston_scientific_vercise_cartesia_hx';
  //     case 'Boston Scientific Vercise Cartesia X':
  //       return 'boston_scientific_vercise_cartesia_x';
  //     case 'Abbott ActiveTip (6146-6149)':
  //       return 'abbott_activetip_2mm';
  //     case 'Abbott ActiveTip (6142-6145)':
  //       return 'abbott_activetip_3mm';
  //     case 'Abbott Directed 6172 (short)':
  //       return 'abbott_directed_6172';
  //     case 'Abbott Directed 6173 (long)':
  //       return 'abbott_directed_6173';
  //     default:
  //       return '';
  //   }
  // };

  const handleImportedElectrode = (importedElectrode) => {
    const electrodeInfo = varargout.find((item) => item.displayName === importedElectrode);
    return electrodeInfo ? electrodeInfo.value : 'boston_vercise_directed';
  };

  const handleIPG = (importedElectrode) => {
    if (importedElectrode.includes('Boston')) {
      return 'Boston';
    }
    if (importedElectrode.includes('Abbott')) {
      return 'Abbott';
    }
    if (
      importedElectrode === 'Medtronic 3387' ||
      importedElectrode === 'Medtronic 3389' ||
      importedElectrode === 'Medtronic 3391'
    ) {
      return 'Medtronic_Activa';
    }
    if (importedElectrode.includes('Medtronic')) {
      return 'Medtronic_Percept';
    }
    return 'Research';
  };

  window.electron.ipcRenderer.sendMessage('import-file', ['ping']);

  const gatherImportedDataNew = (jsonData, importedElectrode) => {
    console.log(jsonData);
    let outputIPG = handleIPG(importedElectrode);
    console.log('OutputIPG: ', outputIPG);
    const newQuantities = {};
    const newSelectedValues = {};
    const newTotalAmplitude = {};
    const newAllQuantities = {};
    const newAllVolAmpToggles = {};
    const newAllTogglePositions = {};

    console.log('Imported Amplitude: ', jsonData.amplitude);

    for (let j = 1; j < 5; j++) {
      newTotalAmplitude[j] = jsonData.amplitude[1][j - 1];
      newTotalAmplitude[j + 4] = jsonData.amplitude[0][j - 1];

      console.log('newTotalAmplitude: ', newTotalAmplitude);

      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      if (jsonData[dynamicKey2]['va'] === 2) {
        newAllVolAmpToggles[j] = 'center';
        newAllTogglePositions[j] = '%';
      } else if (jsonData[dynamicKey2]['va'] === 1) {
        newAllVolAmpToggles[j] = 'right';
        newAllTogglePositions[j] = 'V';
      }

      if (jsonData[dynamicKey3]['va'] === 2) {
        newAllVolAmpToggles[j + 4] = 'center';
        newAllTogglePositions[j + 4] = '%';
      } else if (jsonData[dynamicKey3]['va'] === 1) {
        newAllVolAmpToggles[j + 4] = 'right';
        newAllTogglePositions[j + 4] = 'V';
      }

      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 1}`;
        const dynamicKey1 = `k${i + 1}`;

        if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
          newQuantities[j] = newQuantities[j] || {};
          newQuantities[j][i+1] = parseFloat(
            jsonData[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

          const { pol } = jsonData[dynamicKey2][dynamicKey];
          newSelectedValues[j] = newSelectedValues[j] || {};
          newSelectedValues[j][i+1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          const casePol = jsonData[dynamicKey2].case.pol;
          newSelectedValues[j][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }

        if (jsonData[dynamicKey3] && jsonData[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4] = newQuantities[j + 4] || {};
          newQuantities[j + 4][i+1] = parseFloat(
            jsonData[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(jsonData[dynamicKey3].case.perc);

          const { pol } = jsonData[dynamicKey3][dynamicKey1];
          newSelectedValues[j + 4] = newSelectedValues[j + 4] || {};
          newSelectedValues[j + 4][i+1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          const casePol = jsonData[dynamicKey3].case.pol;
          newSelectedValues[j + 4][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }
      }

      newAllQuantities[j] = newQuantities[j];
      newAllQuantities[j + 4] = newQuantities[j + 4];
    }

    const filteredValues = Object.keys(newSelectedValues)
      .filter((key) => Object.keys(newSelectedValues[key]).length > 0)
      .reduce((obj, key) => {
        obj[key] = newSelectedValues[key];
        return obj;
      }, {});

    let filteredQuantities = Object.keys(newQuantities)
      .filter((key) => Object.keys(newQuantities[key]).length > 0)
      .reduce((obj, key) => {
        obj[key] = newQuantities[key];
        return obj;
      }, {});

    console.log('filtered', filteredQuantities);
    let outputVisModel = '3';
    if (jsonData.model === 'Dembek 2017') {
      outputVisModel = '1';
    } else if (jsonData.model === 'Fastfield (Baniasadi 2020)') {
      outputVisModel = '2';
    } else if (jsonData.model === 'Kuncel 2008') {
      outputVisModel = '4';
    } else if (jsonData.model === 'Maedler 2012') {
      outputVisModel = '5';
    } else if (jsonData.model === 'OSS-DBS (Butenko 2020)') {
      outputVisModel = '6';
    }

    console.log('TEST!L: ', outputIPG);
    if (outputIPG.includes('Medtronic')) {
      Object.keys(filteredQuantities).forEach((key) => {
        console.log('Test: ', filteredQuantities[key]);
        Object.keys(filteredQuantities[key]).forEach((key2) => {
          filteredQuantities[key][key2] =
            (filteredQuantities[key][key2] / 100) * newTotalAmplitude[key];
        });
      });
    }

    Object.keys(newAllVolAmpToggles).forEach((key) => {
      if (newAllVolAmpToggles[key] === 'right') {
        outputIPG = 'Medtronic_Activa';
        // setIpgMaster('Medtronic_Activa');
        return '';
      }
    });

    console.log('OutputIPG, 2: ', outputIPG);

    return {
      filteredQuantities,
      filteredValues,
      newTotalAmplitude,
      outputVisModel,
      newAllVolAmpToggles,
      outputIPG,
      newAllTogglePositions,
    };

    // Need to add some type of filtering here that detects whether it is Medtronic Activa, and then needs to put just mA values, not %
  };

  useEffect(() => {
    console.log(window.electron.ipcRenderer);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.once('import-file', (arg) => {
        try {
          console.log('Received import-file event');
          console.log('Received: ', arg);
          // arg = arg.inputStruct;
          electrodeList = arg.electrodeModels;
          setGrouplabel(arg.label);
          // console.log('Tester: ', outputIPG);
          // setElectrodeMaster(outputElectrode);
          // setIpgMaster(outputIPG);
          setImportNewS(arg.S);

          // const tempPatients = arg.patientname;
          // setPatientName(arg.patientname[0]);
          const tempPatients = arg.patientname.map((name, index) => {
            return `${name} (${index + 1} / ${arg.patientname.length})`;
          });
          setPatientName(tempPatients[0]); // Sets the first patient name with the modified format
          console.log('TEMPPAtients', tempPatients);

          let initialStates;
          initialStates = tempPatients.reduce((acc, patient, index) => {
            console.log(`Processing patient ${index + 1}`);
            const electrodes = electrodeList[index];
            const outputElectrode = handleImportedElectrode(
              electrodeList[index],
            );
            // const outputIPG = handleIPG(electrodeList[index]);
            const processedS = arg.S[index]
              ? gatherImportedDataNew(arg.S[index], electrodeList[index])
              : {
                  filteredQuantities: {},
                  filteredValues: {},
                  newTotalAmplitude: {},
                  outputVisModel: '3',
                  newAllVolAmpToggles: {},
                  outputIPG: handleIPG(electrodeList[index]),
                  newAllTogglePositions: {},
                };
            acc[patient] = {
              ...initialState,
              leftElectrode: outputElectrode,
              rightElectrode: outputElectrode,
              IPG: processedS.outputIPG,
              allQuantities: processedS.filteredQuantities,
              allSelectedValues: processedS.filteredValues,
              allTotalAmplitudes: processedS.newTotalAmplitude,
              visModel: processedS.outputVisModel,
              allVolAmpToggles: processedS.newAllVolAmpToggles,
              allTogglePositions: processedS.newAllTogglePositions,
            };
            return acc;
          }, {});

          console.log('Patients:', initialStates);
          setPatientStates(initialStates);
          setPatients(tempPatients);
        } catch (error) {
          console.error('Error processing import-file event:', error);
        }
      });
    } else {
      console.error('ipcRenderer is not available');
    }
  }, []);

  const [zoomLevel, setZoomLevel] = useState(-3);

  const handleZoomChange = (event, newValue) => {
    setZoomLevel(newValue);
    if (window.electron && window.electron.zoom) {
      window.electron.zoom.setZoomLevel(newValue);
    } else {
      console.error('Zoom functionality is not available');
    }
  };

  const activeContacts = (valuesArray) => {
    const activeContactsArray = [];
    Object.keys(valuesArray).forEach((thing) => {
      // console.log(thing);
      if (thing !== 0) {
        if (valuesArray[thing] === 'left') {
          activeContactsArray.push(0);
        } else {
          activeContactsArray.push(1);
        }
      }
    });
    activeContactsArray.shift();
    console.log(activeContactsArray);
    return activeContactsArray;
  };

  const calculatePercentageFromAmplitude = (quantities, totalAmplitude) => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((element) => {
      updatedQuantities[element] =
        (parseFloat(updatedQuantities[element]) * 100) / totalAmplitude;
    });
    console.log(updatedQuantities);
    return updatedQuantities;
  };

  const calculateVoltageFromAmplitude = (quantities) => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((element) => {
      if (quantities[element] !== 0) {
        updatedQuantities[element] = 100;
      }
    });
    return updatedQuantities;
  };

  const handleTogglePositions = (allQuantities, allTotalAmplitudes, allTogglePositions) => {
    let outputQuantities = {};
    console.log(allQuantities);
    console.log(allTotalAmplitudes);
    console.log(allTogglePositions);
    const updatedQuantities = { ...allQuantities };
    Object.keys(allTogglePositions).forEach((position) => {
      if (allTogglePositions[position] === 'mA') {
        console.log('position', position);
        console.log('quantity: ', allTogglePositions);
        console.log(allTotalAmplitudes[position]);
        console.log(allQuantities[position]);
        outputQuantities = calculatePercentageFromAmplitude(
          allQuantities[position],
          parseFloat(allTotalAmplitudes[position]),
        );
        // const updatedQuantities = {
        //   ...allQuantities,
        //   [position]: outputQuantities,
        // };
        updatedQuantities[position] = outputQuantities;
        console.log('updaredQuantities: ', updatedQuantities);
        outputQuantities = updatedQuantities;
      } else if (allTogglePositions[position] === 'V') {
        outputQuantities = calculateVoltageFromAmplitude(
          allQuantities[position],
        );
        // const updatedQuantities = {
        //   ...allQuantities,
        //   [position]: outputQuantities,
        // };
        updatedQuantities[position] = outputQuantities;
        outputQuantities = updatedQuantities;
      } else {
        outputQuantities[position] = allQuantities[position];
      }
      // return '';
    });
    // console.log(updatedQuantities);
    return outputQuantities;
  };

  const translatePolarity = (sideValue) => {
    let polar = 0;
    if (sideValue === 'center') {
      polar = 1;
    } else if (sideValue === 'right') {
      polar = 2;
    }

    return polar;
  };

  function handleExportAmplitude(amplitudeList) {
    const exportAmplitudeList = [];
    Object.keys(amplitudeList).forEach((thing) => {
      exportAmplitudeList.push(parseFloat(amplitudeList[thing]));
    });
    exportAmplitudeList.shift();
    return exportAmplitudeList;
  }

  const gatherExportedData5 = (
    allTotalAmplitudes,
    allQuantities,
    allSelectedValues,
    selectedElectrodeLeft,
    selectedElectrodeRight,
    IPG,
    visModel,
    allTogglePositions,
    allPercAmpToggles,
    index,
    allTemplateSpaces,
  ) => {
    // handleFileChange('1');
    // saveQuantitiesandValues();
    let updatedOutputQuantity = {};
    updatedOutputQuantity = handleTogglePositions(allQuantities, allTotalAmplitudes, allTogglePositions);
    console.log('Updated output quantity: ', updatedOutputQuantity);
    // parseAllVariables();
    const exportAmplitudeData = handleExportAmplitude(allTotalAmplitudes);
    // console.log(exportAmplitudeData);
    const leftHemiArr = [];
    const rightHemiArr = [];
    console.log(importNewS);
    const data = {
      S: {
        ...importNewS[index],
      },
    };
    // const data = {
    //   S: {
    //     label: groupLabel,
    //     Rs1: {},
    //     Rs2: {},
    //     Rs3: {},
    //     Rs4: {},
    //     Ls1: {},
    //     Ls2: {},
    //     Ls3: {},
    //     Ls4: {},
    //     active: {},
    //     model: '',
    //     monopolarmodel: 0,
    //     amplitude: {},
    //     activecontacts: [],
    //     template: 'warp',
    //     sources: {},
    //     // elmodel: {},
    //     // ipg: IPG,
    //     ver: '2.0',
    //   },
    // };

    // data.S.elmodel = [selectedElectrodeLeft, selectedElectrodeRight];
    const programs = Object.keys(allQuantities);
    const firstProgram = programs[0];
    console.log('Programs: ', programs);
    console.log('length', programs[0]);

    const loopSize = Object.keys(allQuantities[firstProgram]).length;
    // console.log('loopSize: ', loopSize);
    // data.S.label = 'Num1';
    const activeArray = [];
    const leftAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      if (allSelectedValues[j] && updatedOutputQuantity[j]) {
        // Need to change the i = 9 to number of electrodes to accomodate for 16 contact electrodes
        for (let i = 1; i < loopSize; i++) {
          let polarity = 0;
          if (allSelectedValues[j][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(updatedOutputQuantity[j][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(updatedOutputQuantity[j][0]),
          pol: translatePolarity(allSelectedValues[j][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j]);
        // data.S[dynamicKey2].frequency = parseFloat(
        //   allStimulationParameters[j].parameter2,
        // );
        // data.S[dynamicKey2].pulseWidth = parseFloat(
        //   allStimulationParameters[j].parameter1,
        // );
        data.S[dynamicKey2].va = 2;
        if (allTogglePositions[j] === 'V') {
          data.S[dynamicKey2].va = 1;
        }
        activeArray.push(j);
        leftAmpArray[j] = parseFloat(allTotalAmplitudes[j]);
        // console.log(activeContacts(allSelectedValues[j]));
        leftHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j - 1] = activeContacts(allSelectedValues[j]);
        // console.log(data.S.activecontacts);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: 0,
            pol: 0,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: 0,
          pol: 0,
        };
        data.S[dynamicKey2].amp = 0;
        data.S[dynamicKey2].frequency = 0;
        data.S[dynamicKey2].pulseWidth = 0;
        data.S[dynamicKey2].va = 0;
      }
    }
    const leftLength = activeArray.length;
    const newActiveArray = [];
    const rightAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      if (allSelectedValues[j + 4] && updatedOutputQuantity[j + 4]) {
        for (let i = 1; i < loopSize; i++) {
          let polarity = 0;
          if (allSelectedValues[j + 4][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j + 4][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j + 4][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(updatedOutputQuantity[j + 4][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(updatedOutputQuantity[j + 4][0]),
          pol: translatePolarity(allSelectedValues[j + 4][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j + 4]);
        // data.S[dynamicKey2].frequency = parseFloat(
        //   allStimulationParameters[j + 4].parameter2,
        // );
        // data.S[dynamicKey2].pulseWidth = parseFloat(
        //   allStimulationParameters[j + 4].parameter1,
        // );
        data.S[dynamicKey2].va = 2;
        if (allTogglePositions[j + 4] === 'V') {
          data.S[dynamicKey2].va = 1;
        }
        activeArray.push(j + 4);
        newActiveArray.push(j);
        console.log('All Selected Values: ', j);
        // rightHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j + 3] = activeContacts(allSelectedValues[j + 4]);
        // rightAmpArray[j + 4] = parseFloat(allTotalAmplitudes[j + 4]);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: 0,
            pol: 0,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: 0,
          pol: 0,
        };
        data.S[dynamicKey2].amp = 0;
        data.S[dynamicKey2].frequency = 0;
        data.S[dynamicKey2].pulseWidth = 0;
        data.S[dynamicKey2].va = 0;
      }
    }
    // data.S.activecontacts.push(rightHemiArr);
    // data.S.activecontacts.push(leftHemiArr);
    // const totalAmpArray = leftAmpArray.push(rightAmpArray);
    // data.S.amplitude{1} = leftAmpArray;
    // data.S.amplitude{2} = rightAmpArray;
    const leftAmplitude = [];
    const rightAmplitude = [];
    for (let i = 1; i < 5; i++) {
      if (allTotalAmplitudes[i]) {
        leftAmplitude.push(parseFloat(allTotalAmplitudes[i]));
      } else {
        leftAmplitude.push(0);
      }
    }
    for (let i = 5; i < 9; i++) {
      if (allTotalAmplitudes[i]) {
        rightAmplitude.push(parseFloat(allTotalAmplitudes[i]));
      } else {
        rightAmplitude.push(0);
      }
    }
    data.S.amplitude = { rightAmplitude, leftAmplitude };
    // data.S.amplitude = exportAmplitudeData;
    // console.log(exportAmplitudeData);
    const sourcesArray = activeArray;
    const rightLength = newActiveArray.length;
    data.S.sources = sourcesArray;
    // data.S.active = [leftLength, rightLength];
    data.S.active = [1, 1];
    // data.S.activecontacts = activeContacts(allSelectedValues[1]);

    for (let i = 1; i < 9; i++) {
      const zerosArr = [];
      for (let j = 1; j < loopSize; j++) {
        zerosArr.push(0);
      }
      if (data.S.activecontacts[i-1]) {
        if (data.S.activecontacts[i-1] === null) {
          data.S.activecontacts[i-1] = zerosArr;
        }
      } else {
        data.S.activecontacts[i-1] = zerosArr;
      }
    }

    let exportVisModel = '';
    // visModel[1] = visModel;
    // console.log(visModel[1]);
    if (visModel === '1') {
      console.log('here');
      exportVisModel = 'Dembek 2017';
    } else if (visModel === '2') {
      exportVisModel = 'Fastfield (Baniasadi 2020)';
    } else if (visModel === '3') {
      exportVisModel = 'SimBio/FieldTrip (see Horn 2017)';
    } else if (visModel === '4') {
      exportVisModel = 'Kuncel 2008';
    } else if (visModel === '5') {
      exportVisModel = 'Maedler 2012';
    } else if (visModel === '6') {
      exportVisModel = 'OSS-DBS (Butenko 2020)';
    }
    // console.log('export vis model', exportVisModel);
    data.S.model = exportVisModel;
    data.S.estimateInTemplate = allTemplateSpaces;
    // if (Array.isArray(data.S.activecontacts) && data.S.activecontacts.length > 0 && data.S.activecontacts[0] === undefined) {
    //   data.S.activecontacts.shift();
    // }
    console.log(data.S.activecontacts);
    return data;
  };

  const handleExport = () => {
    console.log('Patient States for Export', patientStates);
    let outputData = [];
    try {
      Object.values(patientStates).forEach((tempStates, index) => {
        console.log('TempStates: ', tempStates);
        let tempData = gatherExportedData5(
          tempStates.allTotalAmplitudes,
          tempStates.allQuantities,
          tempStates.allSelectedValues,
          tempStates.leftElectrode,
          tempStates.rightElectrode,
          tempStates.IPG,
          tempStates.visModel,
          tempStates.allTogglePositions,
          tempStates.allPercAmpToggles,
          index,
          tempStates.allTemplateSpaces,
        );
        outputData[index] = tempData; // Using index instead of key
      });
    } catch (err) {
      console.log(err);
    }

    console.log('Output Data: ', outputData);
    const filePath = '';
    window.electron.ipcRenderer.sendMessage('save-file', filePath, outputData);
    window.electron.ipcRenderer.sendMessage('close-window');
  };

  const closeFunction = () => {
    window.electron.ipcRenderer.sendMessage('close-window-new');
  };

  return (
    <div>
      <div className="Navbar">
        <Navbar />
      </div>
      <div style={{paddingTop: '20px', paddingBottom: '-50px'}}></div>
      {/* <div
        style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}
      >
        Patient: {patientName}
      </div> */}
      <div>
        {patients.length > 0 && (
          <GroupArchitecture
            patients={patients}
            setPatients={setPatients}
            electrodeList={electrodeList}
            patientStates={patientStates}
            setPatientStates={setPatientStates}
            importNewS={importNewS}
            electrodeMaster={electrodeMaster}
            ipgMaster={ipgMaster}
          />
        )}
      </div>
      <div style={{ textAlign: 'center', paddingBottom: '35px' }}>
        <button
          className="export-button-final-discard"
          onClick={closeFunction}
          style={{ marginRight: '15px' }}
        >
          Discard and Close
        </button>
        <button className="export-button-final" onClick={handleExport} style={{marginRight: '15px'}}>
          Save and Close
        </button>
      </div>
    </div>
  );
}

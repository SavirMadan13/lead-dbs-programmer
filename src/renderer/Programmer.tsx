import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GroupArchitecture from './components/GroupArchitecture';

function Programmer() {
  const electrodeList: any[] = [];
  const [patientName, setPatientName] = useState('');
  const [patients, setPatients] = useState([]);
  const [patientStates, setPatientStates] = useState({});
  const [importNewS, setImportNewS] = useState({});
  const [electrodeMaster, setElectrodeMaster] = useState('');
  const [ipgMaster, setIpgMaster] = useState('');

  const location = useLocation();
  const { patient, timeline, directoryPath, leadDBS } = location.state || {};
  console.log(patient);
  // Access patient and timeline from state
  console.log(location.state);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [mode, setMode] = useState('');
  // const { patient } = location.state || {}; // Retrieve patient data from navigation state

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
  //       return 'abott_activetip_2mm';
  //     case 'Abbott ActiveTip (6142-6145)':
  //       return 'abbott_activetip_3mm';
  //     case 'Abbott Directed 6172 (short)':
  //       return 'abbott_directed_05';
  //     case 'Abbott Directed 6173 (long)':
  //       return 'abott_directed_15';
  //     default:
  //       return '';
  //   }
  // };

  const handleImportedElectrode = (importedElectrode) => {
    const electrodeInfo = varargout.find(
      (item) => item.displayName === importedElectrode,
    );
    return electrodeInfo ? electrodeInfo.value : 'boston_vercise_directed';
  };

  // const handleIPG = (importedElectrode) => {
  //   if (
  //     importedElectrode.includes('Boston') ||
  //     importedElectrode.includes('boston')
  //   ) {
  //     return 'Boston';
  //   }
  //   if (
  //     importedElectrode.includes('Abbott') ||
  //     importedElectrode.includes('abbott')
  //   ) {
  //     return 'Abbott';
  //   }
  //   if (
  //     importedElectrode === 'Medtronic 3387' ||
  //     importedElectrode === 'Medtronic 3389' ||
  //     importedElectrode === 'medtronic_3387' ||
  //     importedElectrode === 'medtronic_3389' ||
  //     importedElectrode === 'medtronic_3391' ||
  //     importedElectrode === 'Medtronic 3391'
  //   ) {
  //     return 'Medtronic_Activa';
  //   }
  //   return 'Medtronic_Percept';
  // };

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

  // const [baseElec, setBaseElec] = useState(null);

  // useEffect(() => {
  //   const loadPlyFile = async () => {
  //     try {
  //       const fileData = await window.electron.ipcRenderer.invoke(
  //         'load-vis-coords',
  //         location.state,
  //       );
  //       // setPlyFile(fileData);
  //       console.log(fileData.elmodel);
  //       setBaseElec(fileData.elmodel);
  //     } catch (error) {
  //       console.error('Error loading PLY file:', error);
  //     }
  //   };

  //   loadPlyFile(); // Call the async function
  // }, []);

  window.electron.ipcRenderer.sendMessage(
    'import-file',
    patient.id,
    timeline,
    directoryPath,
    leadDBS,
  );

  // This effect will run once `baseElec` is set
  // useEffect(() => {
  //   if (baseElec) { // Only send message if baseElec is not null
  //     window.electron.ipcRenderer.sendMessage(
  //       'import-file',
  //       patient.id,
  //       timeline,
  //       directoryPath,
  //       leadDBS,
  //     );
  //   }
  // }, [baseElec]); // Runs whenever baseElec changes

  function generateUniqueID() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const randomNums = Math.floor(Math.random() * 1000000); // Generate random 4-digit number
    return `${year}${month}${day}${randomNums}`;
  }

  // const gatherImportedDataNew = (jsonData, outputIPG) => {
  //   console.log(jsonData);

  //   const newQuantities = {};
  //   const newSelectedValues = {};
  //   const newTotalAmplitude = {};
  //   const newAllQuantities = {};
  //   const newAllVolAmpToggles = {};

  //   console.log('Imported Amplitude: ', jsonData.amplitude);

  //   for (let j = 1; j < 5; j++) {
  //     try {
  //       newTotalAmplitude[j] = jsonData.amplitude[1][j - 1];
  //       newTotalAmplitude[j + 4] = jsonData.amplitude[0][j - 1];
  //     } catch {
  //       console.log('');
  //     }

  //     try {
  //       newTotalAmplitude[j] = jsonData.amplitude.leftAmplitude[j - 1];
  //       newTotalAmplitude[j + 4] = jsonData.amplitude.rightAmplitude[j - 1];
  //     } catch {
  //       console.log('');
  //     }

  //     console.log('newTotalAmplitude: ', newTotalAmplitude);

  //     const dynamicKey2 = `Ls${j}`;
  //     const dynamicKey3 = `Rs${j}`;
  //     if (jsonData[dynamicKey2].va === 2) {
  //       newAllVolAmpToggles[j] = 'center';
  //     } else if (jsonData[dynamicKey2].va === 1) {
  //       newAllVolAmpToggles[j] = 'right';
  //     }

  //     if (jsonData[dynamicKey3].va === 2) {
  //       newAllVolAmpToggles[j + 4] = 'center';
  //     } else if (jsonData[dynamicKey3].va === 1) {
  //       newAllVolAmpToggles[j + 4] = 'right';
  //     }

  //     for (let i = 0; i < 9; i++) {
  //       const dynamicKey = `k${i + 7}`;
  //       const dynamicKey1 = `k${i}`;

  //       if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
  //         newQuantities[j] = newQuantities[j] || {};
  //         newQuantities[j][i] = parseFloat(
  //           jsonData[dynamicKey2][dynamicKey].perc,
  //         );
  //         newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

  //         const { pol } = jsonData[dynamicKey2][dynamicKey];
  //         newSelectedValues[j] = newSelectedValues[j] || {};
  //         newSelectedValues[j][i] =
  //           pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

  //         const casePol = jsonData[dynamicKey2].case.pol;
  //         newSelectedValues[j][0] =
  //           casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
  //       }

  //       if (jsonData[dynamicKey3] && jsonData[dynamicKey3][dynamicKey1]) {
  //         newQuantities[j + 4] = newQuantities[j + 4] || {};
  //         newQuantities[j + 4][i + 1] = parseFloat(
  //           jsonData[dynamicKey3][dynamicKey1].perc,
  //         );
  //         newQuantities[j + 4][0] = parseFloat(jsonData[dynamicKey3].case.perc);

  //         const { pol } = jsonData[dynamicKey3][dynamicKey1];
  //         newSelectedValues[j + 4] = newSelectedValues[j + 4] || {};
  //         newSelectedValues[j + 4][i + 1] =
  //           pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

  //         const casePol = jsonData[dynamicKey3].case.pol;
  //         newSelectedValues[j + 4][0] =
  //           casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
  //       }
  //     }

  //     newAllQuantities[j] = newQuantities[j];
  //     newAllQuantities[j + 4] = newQuantities[j + 4];
  //   }

  //   const filteredValues = Object.keys(newSelectedValues)
  //     .filter((key) => Object.keys(newSelectedValues[key]).length > 0)
  //     .reduce((obj, key) => {
  //       obj[key] = newSelectedValues[key];
  //       return obj;
  //     }, {});

  //   const filteredQuantities = Object.keys(newQuantities)
  //     .filter((key) => Object.keys(newQuantities[key]).length > 0)
  //     .reduce((obj, key) => {
  //       obj[key] = newQuantities[key];
  //       return obj;
  //     }, {});

  //   console.log('filtered', filteredQuantities);
  //   let outputVisModel = '3';
  //   if (jsonData.model === 'Dembek 2017') {
  //     outputVisModel = '1';
  //   } else if (jsonData.model === 'Fastfield (Baniasadi 2020)') {
  //     outputVisModel = '2';
  //   } else if (jsonData.model === 'Kuncel 2008') {
  //     outputVisModel = '4';
  //   } else if (jsonData.model === 'Maedler 2012') {
  //     outputVisModel = '5';
  //   } else if (jsonData.model === 'OSS-DBS (Butenko 2020)') {
  //     outputVisModel = '6';
  //   }

  //   console.log('TEST!L: ', outputIPG);
  //   if (outputIPG.includes('Medtronic')) {
  //     Object.keys(filteredQuantities).forEach((key) => {
  //       console.log('Test: ', filteredQuantities[key]);
  //       Object.keys(filteredQuantities[key]).forEach((key2) => {
  //         filteredQuantities[key][key2] =
  //           (filteredQuantities[key][key2] / 100) * newTotalAmplitude[key];
  //       });
  //     });
  //   }

  //   Object.keys(newAllVolAmpToggles).forEach((key) => {
  //     if (newAllVolAmpToggles[key] === 1) {
  //       setIpgMaster('Medtronic_Activa');
  //       return '';
  //     }
  //   });

  //   return {
  //     filteredQuantities,
  //     filteredValues,
  //     newTotalAmplitude,
  //     outputVisModel,
  //     newAllVolAmpToggles,
  //   };

  //   // Need to add some type of filtering here that detects whether it is Medtronic Activa, and then needs to put just mA values, not %
  // };

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
      if (jsonData[dynamicKey2].va === 2) {
        newAllVolAmpToggles[j] = 'center';
        newAllTogglePositions[j] = '%';
      } else if (jsonData[dynamicKey2].va === 1) {
        newAllVolAmpToggles[j] = 'right';
        newAllTogglePositions[j] = 'V';
      }

      if (jsonData[dynamicKey3].va === 2) {
        newAllVolAmpToggles[j + 4] = 'center';
        newAllTogglePositions[j + 4] = '%';
      } else if (jsonData[dynamicKey3].va === 1) {
        newAllVolAmpToggles[j + 4] = 'right';
        newAllTogglePositions[j + 4] = 'V';
      }

      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 1}`;
        const dynamicKey1 = `k${i + 1}`;

        if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
          newQuantities[j] = newQuantities[j] || {};
          newQuantities[j][i + 1] = parseFloat(
            jsonData[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

          const { pol } = jsonData[dynamicKey2][dynamicKey];
          newSelectedValues[j] = newSelectedValues[j] || {};
          newSelectedValues[j][i + 1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          const casePol = jsonData[dynamicKey2].case.pol;
          newSelectedValues[j][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }

        if (jsonData[dynamicKey3] && jsonData[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4] = newQuantities[j + 4] || {};
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(jsonData[dynamicKey3].case.perc);

          const { pol } = jsonData[dynamicKey3][dynamicKey1];
          newSelectedValues[j + 4] = newSelectedValues[j + 4] || {};
          newSelectedValues[j + 4][i + 1] =
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

    const filteredQuantities = Object.keys(newQuantities)
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

  const handleTimelines = (timelineOutput) => {
    console.log("Processing timelines:", timelineOutput);

    let initialStates = {}; // Initialize the object to store the processed states

    // Iterate over each key in the timelineOutput object
    Object.keys(timelineOutput).forEach((key, index) => {
      console.log(`Processing timeline for patient ${key}`);

      const currentTimeline = key;
      const electrodes = 'Medtronic B33005';
      const patientData = timelineOutput[key].S;

      const outputElectrode = handleImportedElectrode(electrodes);

      const processedS = patientData
        ? gatherImportedDataNew(patientData, electrodes)
        : {
            filteredQuantities: {},
            filteredValues: {},
            newTotalAmplitude: {},
            outputVisModel: '3',
            newAllVolAmpToggles: {},
            outputIPG: handleIPG(electrodes),
            newAllTogglePositions: {},
          };

      // Store the processed state for each patient
      initialStates[currentTimeline] = {
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
    });

    console.log("Final initialStates:", initialStates);
    return initialStates;
  };

  useEffect(() => {
    if (directoryPath && patient) {
      window.electron.ipcRenderer
        .invoke('get-timelines', directoryPath, patient.id, leadDBS)
        .then(async (receivedTimelines) => {
          console.log('Received timelines:', receivedTimelines);

          // Filter timelines with stimulation
          const stimulationTimelines = receivedTimelines.filter(
            (timelineData) => timelineData.hasStimulation
          );

          console.log('Timelines with stimulation:', stimulationTimelines);

          // Process timelines with stimulation
          const timelineResults = await Promise.all(
            stimulationTimelines.map(async (timelineData) => {
              const timeline = timelineData.timeline;
              try {
                const importResult = await window.electron.ipcRenderer.invoke(
                  'import-file-2',
                  directoryPath,
                  patient.id,
                  timeline,
                  leadDBS
                );
                return { timeline, data: importResult };
              } catch (error) {
                console.error(`Error importing timeline ${timeline}:`, error);
                return { timeline, data: null }; // Handle errors gracefully
              }
            })
          );

          console.log('Processed timeline results:', timelineResults);

          // Aggregate results into a structured format
          const timelineOutput = timelineResults.reduce((acc, result) => {
            if (result.data) {
              acc[result.timeline] = result.data;
            }
            return acc;
          }, {});

          console.log('Final timeline output:', timelineOutput);
          const initialStates = handleTimelines(timelineOutput);
          console.log('Initial States: ', initialStates);
          setPatientStates(initialStates);
          const tmppatients = Object.keys(initialStates);
          setPatients(tmppatients);
          // You can now set this to state or use it as needed
          // setTimelineOutput(timelineOutput);
        })
        .catch((error) => {
          console.error('Error fetching timelines:', error);
        });
    }
  }, [directoryPath, patient, leadDBS]);

  // useEffect(() => {
  //   // Ensure that the ipcRenderer is available
  //   if (window.electron && window.electron.ipcRenderer) {
  //     const ipcRenderer = window.electron.ipcRenderer;

  //     // Event listener for import-file
  //     const handleImportFile = (arg) => {
  //       console.log('File: ', arg);
  //       if (arg === 'File not found' || arg.directionality) {
  //         try {
  //           setPatientName(patient.name);
  //           console.log('Not Found');
  //           let outputElectrode = 'boston_vercise_directed';
  //           try {
  //             outputElectrode = handleImportedElectrode(arg.elmodel);
  //           } catch (err) {
  //             console.log(err);
  //           }
  //           // while (!baseElec) {
  //           //   // Waiting for baseElec to exist
  //           // }
  //           // console.log(baseElec);
  //           // if (baseElec) {
  //           //   outputElectrode = handleImportedElectrode(baseElec);
  //           //   console.log(outputElectrode);
  //           // }
  //           const outputIPG = handleIPG(outputElectrode);
  //           console.log(outputIPG);
  //           setElectrodeMaster(outputElectrode);
  //           setIpgMaster(outputIPG);
  //           const S = {
  //             label: "",
  //             Rs1: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Rs2: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Rs3: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Rs4: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Ls1: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Ls2: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Ls3: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             Ls4: {
  //               k1: { perc: 0, pol: 0, imp: 0 },
  //               k2: { perc: 0, pol: 0, imp: 0 },
  //               k3: { perc: 0, pol: 0, imp: 0 },
  //               k4: { perc: 0, pol: 0, imp: 0 },
  //               k5: { perc: 0, pol: 0, imp: 0 },
  //               k6: { perc: 0, pol: 0, imp: 0 },
  //               k7: { perc: 0, pol: 0, imp: 0 },
  //               k8: { perc: 0, pol: 0, imp: 0 },
  //               case: { perc: 0, pol: 0 },
  //               amp: 0,
  //               va: 0,
  //               pulseWidth: 0,
  //             },
  //             active: [0, 0],
  //             model: "",
  //             monopolarmodel: 0,
  //             amplitude: [
  //               [0, 0, 0, 0],
  //               [0, 0, 0, 0],
  //             ],
  //             numContacts: 0,
  //             activecontacts: [
  //               [0, 0, 0, 0, 0, 0, 0, 0],
  //               [0, 0, 0, 0, 0, 0, 0, 0],
  //             ],
  //             sources: [],
  //             volume: [],
  //             ver: "",
  //           };
  //           setImportNewS(S);
  //           const tempLabel = generateUniqueID();
  //           const tempPatients = [tempLabel];

  //           const patientTmp = tempPatients[0];
  //           let initialStates;
  //           const processedS = {
  //             filteredQuantities: {},
  //             filteredValues: {},
  //             newTotalAmplitude: {},
  //             outputVisModel: '3',
  //             newAllVolAmpToggles: {},
  //           };
  //           console.log(S);
  //           initialStates = {
  //             [patientTmp]: {
  //               ...initialState,
  //               leftElectrode: outputElectrode,
  //               rightElectrode: outputElectrode,
  //               IPG: outputIPG,
  //               allQuantities: processedS.filteredQuantities,
  //               allSelectedValues: processedS.filteredValues,
  //               allTotalAmplitudes: processedS.newTotalAmplitude,
  //               visModel: processedS.outputVisModel,
  //               allVolAmpToggles: processedS.newAllVolAmpToggles,
  //             },
  //           };
  //           // setPatientStates(initialStates);
  //           // setPatients(tempPatients);
  //         } catch (error) {
  //           console.error('Error processing import-file-error event:', error);
  //         }
  //       } else {
  //         try {
  //           setPatientName(patient.name);
  //           console.log(arg);
  //           setMode(arg.mode);
  //           const { S } = arg;
  //           let outputElectrode = 'Boston';
  //           let outputIPG = 'Boston';
  //           try {
  //             outputElectrode = handleImportedElectrode(arg.electrodeModels);
  //             outputIPG = handleIPG(arg.electrodeModels);
  //           } catch (err) {
  //             outputElectrode = S.elmodel[0];
  //             outputIPG = 'Medtronic_Percept';
  //           }

  //           console.log('Tester: 1 ', outputIPG);
  //           setElectrodeMaster(outputElectrode);
  //           setIpgMaster(outputIPG);
  //           setImportNewS(S);

  //           const tempPatients = [S.label];
  //           console.log('TEMPPatients', tempPatients[0]);

  //           let initialStates;

  //           if (tempPatients.length === 1) {
  //             const patientTmp = tempPatients[0];
  //             const processedS =
  //               Array.isArray(S) && S.length === 0
  //                 ? {
  //                     filteredQuantities: {},
  //                     filteredValues: {},
  //                     newTotalAmplitude: {},
  //                     outputVisModel: '3',
  //                     newAllVolAmpToggles: {},
  //                   }
  //                 : gatherImportedDataNew(S, outputIPG);
  //             console.log(S);
  //             initialStates = {
  //               [patientTmp]: {
  //                 ...initialState,
  //                 leftElectrode: outputElectrode,
  //                 rightElectrode: outputElectrode,
  //                 IPG: outputIPG,
  //                 allQuantities: processedS.filteredQuantities,
  //                 allSelectedValues: processedS.filteredValues,
  //                 allTotalAmplitudes: processedS.newTotalAmplitude,
  //                 visModel: processedS.outputVisModel,
  //                 allVolAmpToggles: processedS.newAllVolAmpToggles,
  //               },
  //             };
  //           } else {
  //             initialStates = tempPatients.reduce((acc, patient, index) => {
  //               console.log(`Processing patient ${index + 1}`);
  //               const electrodes = electrodeList[index];
  //               const processedS = arg.S[index]
  //                 ? gatherImportedDataNew(arg.S[index], outputIPG)
  //                 : {
  //                     filteredQuantities: {},
  //                     filteredValues: {},
  //                     newTotalAmplitude: {},
  //                     outputVisModel: '3',
  //                     newAllVolAmpToggles: {},
  //                   };
  //               acc[patient] = {
  //                 ...initialState,
  //                 leftElectrode: outputElectrode,
  //                 rightElectrode: outputElectrode,
  //                 IPG: outputIPG,
  //                 allQuantities: processedS.filteredQuantities,
  //                 allSelectedValues: processedS.filteredValues,
  //                 allTotalAmplitudes: processedS.newTotalAmplitude,
  //                 visModel: processedS.outputVisModel,
  //                 allVolAmpToggles: processedS.newAllVolAmpToggles,
  //               };
  //               return acc;
  //             }, {});
  //           }

  //           console.log('Patients:', initialStates);
  //           // setPatientStates(initialStates);
  //           // setPatients(tempPatients);
  //         } catch (error) {
  //           console.error('Error processing import-file event:', error);
  //         }
  //       }
  //     };

  //     // Attach listeners using 'once' so that it only listens for the event once
  //     // ipcRenderer.once('import-file-error', handleImportFileError);
  //     ipcRenderer.once('import-file', handleImportFile);

  //   } else {
  //     console.error('ipcRenderer is not available');
  //   }
  // }, []);

  const [zoomLevel, setZoomLevel] = useState(-3);

  const handleZoomChange = (event, newValue) => {
    setZoomLevel(newValue);
    if (window.electron && window.electron.zoom) {
      window.electron.zoom.setZoomLevel(newValue);
    } else {
      console.error('Zoom functionality is not available');
    }
  };

  return (
    <div>
      <div
        style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}
      >
        Patient: {patientName}
      </div>
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
            historical={location.state}
            mode={mode}
          />
        )}
      </div>
      <div style={{paddingLeft: '150px', marginTop: '-80px'}}>
      <button className="export-button" onClick={() => navigate(-1)}>
        Back to Patient Details
      </button>
      </div>
    </div>
  );
}

export default Programmer;

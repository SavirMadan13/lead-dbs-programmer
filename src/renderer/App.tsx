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
  const [exportS, setExportS] = useState(null);

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
    active: [],
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
  //       return 'boston_vercise_directed';
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

  const gatherImportedDataNew = (jsonData, outputIPG) => {
    console.log(jsonData);

    const newQuantities = {};
    const newSelectedValues = {};
    const newTotalAmplitude = {};
    const newAllQuantities = {};
    const newAllVolAmpToggles = {};

    console.log('Imported Amplitude: ', jsonData.amplitude);

    for (let j = 1; j < 5; j++) {
      newTotalAmplitude[j] = jsonData.amplitude[1][j - 1];
      newTotalAmplitude[j + 4] = jsonData.amplitude[0][j - 1];

      console.log('newTotalAmplitude: ', newTotalAmplitude);

      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      if (jsonData[dynamicKey2]['va'] === 2) {
        newAllVolAmpToggles[j] = 'center';
      } else if (jsonData[dynamicKey2]['va'] === 1) {
        newAllVolAmpToggles[j] = 'right';
      }

      if (jsonData[dynamicKey3]['va'] === 2) {
        newAllVolAmpToggles[j+4] = 'center';
      } else if (jsonData[dynamicKey3]['va'] === 1) {
        newAllVolAmpToggles[j+4] = 'right';
      }

      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i+1}`;
        const dynamicKey1 = `k${i+1}`;

        // Running it for left side
        if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
          newQuantities[j] = newQuantities[j] || {};
          // Setting quantities for contacts
          newQuantities[j][i+1] = parseFloat(
            jsonData[dynamicKey2][dynamicKey].perc,
          );
          // Setting quantity for case
          newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

          const { pol } = jsonData[dynamicKey2][dynamicKey];
          newSelectedValues[j] = newSelectedValues[j] || {};
          // Setting polarity for contacts
          newSelectedValues[j][i+1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          // Setting polarity for case
          const casePol = jsonData[dynamicKey2].case.pol;
          newSelectedValues[j][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }
        // Rerun code for right side
        if (jsonData[dynamicKey3] && jsonData[dynamicKey3][dynamicKey1]) {
          // Setting quantities for contacts
          newQuantities[j + 4] = newQuantities[j + 4] || {};
          newQuantities[j + 4][i+1] = parseFloat(
            jsonData[dynamicKey3][dynamicKey1].perc,
          );
          // Setting quantities for case
          newQuantities[j + 4][0] = parseFloat(jsonData[dynamicKey3].case.perc);

          const { pol } = jsonData[dynamicKey3][dynamicKey1];
          // Setting polarity for contacts
          newSelectedValues[j + 4] = newSelectedValues[j + 4] || {};
          newSelectedValues[j + 4][i+1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

            // Setting polarity for case
          const casePol = jsonData[dynamicKey3].case.pol;
          newSelectedValues[j + 4][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }
      }
      // Combining left and right sides
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
          filteredQuantities[key][key2] = (filteredQuantities[key][key2] / 100) * newTotalAmplitude[key];
        });
      });
    }

    Object.keys(newAllVolAmpToggles).forEach((key) => {
      if (newAllVolAmpToggles[key] === 'right') {
        setIpgMaster('Medtronic_Activa');
        return '';
      }
    });

    return {
      filteredQuantities,
      filteredValues,
      newTotalAmplitude,
      outputVisModel,
      newAllVolAmpToggles,
    };

    // Need to add some type of filtering here that detects whether it is Medtronic Activa, and then needs to put just mA values, not %
  };

  useEffect(() => {
    console.log(window.electron.ipcRenderer);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.once('import-file', (arg) => {
        try {
          console.log('Received import-file event');
          console.log('Import Data:', arg.patientname);
          setPatientName(arg.patientname);
          console.log(arg);
          electrodeList = arg.electrodeModel;
          const outputElectrode = handleImportedElectrode(electrodeList);
          const outputIPG = handleIPG(electrodeList);
          console.log('Tester: ', outputIPG);
          setElectrodeMaster(outputElectrode);
          setIpgMaster(outputIPG);
          setImportNewS(arg.S);
          const activeArray = arg.S.active;
          const tempPatients = arg.labels;
          console.log('TEMPPAtients', tempPatients);

          let initialStates;

          if (tempPatients.length === 1) {
            const patient = tempPatients[0];
            const electrodes = electrodeList[0];
            console.log(arg.S);
            // const processedS = arg.S
            //   ? gatherImportedDataNew(arg.S)
            //   : {
            //       filteredQuantities: {},
            //       filteredValues: {},
            //       newTotalAmplitude: {},
            //     };
            const processedS =
              Array.isArray(arg.S) && arg.S.length === 0
                ? {
                    filteredQuantities: {},
                    filteredValues: {},
                    newTotalAmplitude: {},
                    outputVisModel: '3',
                    newAllVolAmpToggles: {},
                    active: activeArray,
                  }
                : gatherImportedDataNew(arg.S, outputIPG);
            console.log(arg.S);
            initialStates = {
              [patient]: {
                ...initialState,
                leftElectrode: outputElectrode,
                rightElectrode: outputElectrode,
                IPG: outputIPG,
                allQuantities: processedS.filteredQuantities,
                allSelectedValues: processedS.filteredValues,
                allTotalAmplitudes: processedS.newTotalAmplitude,
                visModel: processedS.outputVisModel,
                allVolAmpToggles: processedS.newAllVolAmpToggles,
                active: activeArray,
              },
            };
          } else {
            initialStates = tempPatients.reduce((acc, patient, index) => {
              console.log(`Processing patient ${index + 1}`);
              const electrodes = electrodeList[index];
              const processedS = arg.S[index]
                ? gatherImportedDataNew(arg.S[index], outputIPG)
                : {
                    filteredQuantities: {},
                    filteredValues: {},
                    newTotalAmplitude: {},
                    outputVisModel: '3',
                    newAllVolAmpToggles: {},
                    active: activeArray,
                  };
              acc[patient] = {
                ...initialState,
                leftElectrode: outputElectrode,
                rightElectrode: outputElectrode,
                IPG: outputIPG,
                allQuantities: processedS.filteredQuantities,
                allSelectedValues: processedS.filteredValues,
                allTotalAmplitudes: processedS.newTotalAmplitude,
                visModel: processedS.outputVisModel,
                allVolAmpToggles: processedS.newAllVolAmpToggles,
                active: activeArray,
              };
              return acc;
            }, {});
          }

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

  // useEffect(() => {
  //   console.log(window.electron.ipcRenderer);
  //   if (window.electron && window.electron.ipcRenderer) {
  //     window.electron.ipcRenderer.once('import-file', (arg) => {
  //       try {
  //         console.log('Received import-file event');
  //         console.log('Import Data:', arg.patientname);
  //         setPatientName(arg.patientname);
  //         console.log(arg);
  //         // electrodeList = arg.electrodeModel;
  //         electrodeList = arg.electrodeModel;
  //         const outputElectrode = handleImportedElectrode(electrodeList);
  //         const outputIPG = handleIPG(electrodeList);
  //         setElectrodeMaster(outputElectrode);
  //         setIpgMaster(outputIPG);
  //         setImportNewS(arg.S);
  //         const tempPatients = arg.labels;
  //         const initialStates = tempPatients.reduce((acc, patient, index) => {
  //           console.log(`Processing patient ${index + 1}`);
  //           const electrodes = electrodeList[index];
  //           console.log('Electrodes:', electrodes);
  //           // const outputElectrode = handleImportedElectrode(electrodes);
  //           // const outputIPG = handleIPG(electrodes);
  //           console.log('ARG.S.Index: ', arg.S[index]);
  //           const processedS = arg.S[index]
  //             ? gatherImportedDataNew(arg.S[index])
  //             : {
  //                 filteredQuantities: {},
  //                 filteredValues: {},
  //                 newTotalAmplitude: {},
  //               };
  //           acc[patient] = {
  //             ...initialState,
  //             leftElectrode: outputElectrode,
  //             rightElectrode: outputElectrode,
  //             IPG: outputIPG,
  //             allQuantities: processedS.filteredQuantities,
  //             allSelectedValues: processedS.filteredValues,
  //             allTotalAmplitudes: processedS.newTotalAmplitude,
  //           };
  //           return acc;
  //         }, {});
  //         console.log('Patients:', tempPatients);
  //         setPatientStates(initialStates);
  //         setPatients(tempPatients);
  //       } catch (error) {
  //         console.error('Error processing import-file event:', error);
  //       }
  //     });
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

  // const appContainerRef = useRef(null);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     const height = window.innerHeight;

  //     // Base dimensions that match your design
  //     const baseWidth = 1100;
  //     const baseHeight = 800;

  //     // Calculate the scale factor to fit the current window size
  //     const scaleX = width / baseWidth;
  //     const scaleY = height / baseHeight;
  //     const scale = Math.min(scaleX, scaleY);

  //     // Apply the scale transform
  //     appContainerRef.current.style.transform = `scale(${scale})`;
  //   };

  //   // Set up a resize observer to call handleResize on size changes
  //   const resizeObserver = new ResizeObserver(handleResize);
  //   resizeObserver.observe(document.body);

  //   // Initial scale application
  //   handleResize();

  //   // Clean up on component unmount
  //   return () => {
  //     resizeObserver.disconnect();
  //   };
  // }, []);

  return (
    <div>
      <div className="Navbar">
        <Navbar />
        {/* <Slider
          value={zoomLevel}
          onChange={handleZoomChange}
          aria-label="Zoom Level"
          step={1}
          marks
          min={-3}
          max={1}
          sx={{
            '& .MuiSlider-mark': {
              backgroundColor: 'black',
              height: '10px',
              width: '2px',
            },
          }}
        /> */}
      </div>
      {/* {handleIPCInfo} */}
      <div
        // style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', paddingRight: '100px'}}
        style={{textAlign: 'center', fontWeight: 'bold', fontSize: '20px'}}
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
            templateS={importNewS}
          />
        )}
      </div>
    </div>
  );
}

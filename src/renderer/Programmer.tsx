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
  // Access patient and timeline from state
  console.log(location.state);
  const navigate = useNavigate(); // Initialize the navigate hook
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

  const handleImportedElectrode = (importedElectrode) => {
    switch (importedElectrode) {
      case 'Boston Scientific Vercise Directed':
        return 'boston_vercise_directed';
      case 'Medtronic 3389':
        return 'medtronic_3389';
      case 'Medtronic 3387':
        return 'medtronic_3387';
      case 'Medtronic 3391':
        return 'medtronic_3391';
      case 'Medtronic B33005':
        return 'medtronic_b33005';
      case 'Medtronic B33015':
        return 'medtronic_b33015';
      case 'Boston Scientific Vercise':
        return 'boston_scientific_vercise';
      case 'Boston Scientific Vercise Cartesia HX':
        return 'boston_scientific_vercise_cartesia_hx';
      case 'Boston Scientific Vercise Cartesia X':
        return 'boston_scientific_vercise_cartesia_x';
      case 'Abbott ActiveTip (6146-6149)':
        return 'abott_activetip_2mm';
      case 'Abbott ActiveTip (6142-6145)':
        return 'abbott_activetip_3mm';
      case 'Abbott Directed 6172 (short)':
        return 'abott_directed_6172';
      case 'Abbott Directed 6173 (long)':
        return 'abott_directed_6173';
      default:
        return '';
    }
  };

  const handleIPG = (importedElectrode) => {
    if (
      importedElectrode.includes('Boston') ||
      importedElectrode.includes('boston')
    ) {
      return 'Boston';
    }
    if (
      importedElectrode.includes('Abbott') ||
      importedElectrode.includes('abbott')
    ) {
      return 'Abbott';
    }
    if (
      importedElectrode === 'Medtronic 3387' ||
      importedElectrode === 'Medtronic 3389' ||
      importedElectrode === 'medtronic_3387' ||
      importedElectrode === 'medtronic_3389' ||
      importedElectrode === 'medtronic_3391' ||
      importedElectrode === 'Medtronic 3391'
    ) {
      return 'Medtronic_Activa';
    }
    return 'Medtronic_Percept';
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

  const gatherImportedDataNew = (jsonData, outputIPG) => {
    console.log(jsonData);

    const newQuantities = {};
    const newSelectedValues = {};
    const newTotalAmplitude = {};
    const newAllQuantities = {};
    const newAllVolAmpToggles = {};

    console.log('Imported Amplitude: ', jsonData.amplitude);

    for (let j = 1; j < 5; j++) {
      try {
        newTotalAmplitude[j] = jsonData.amplitude[1][j - 1];
        newTotalAmplitude[j + 4] = jsonData.amplitude[0][j - 1];
      } catch {
        console.log('');
      }

      try {
        newTotalAmplitude[j] = jsonData.amplitude.leftAmplitude[j - 1];
        newTotalAmplitude[j + 4] = jsonData.amplitude.rightAmplitude[j - 1];
      } catch {
        console.log('');
      }

      console.log('newTotalAmplitude: ', newTotalAmplitude);

      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      if (jsonData[dynamicKey2].va === 2) {
        newAllVolAmpToggles[j] = 'center';
      } else if (jsonData[dynamicKey2].va === 1) {
        newAllVolAmpToggles[j] = 'right';
      }

      if (jsonData[dynamicKey3].va === 2) {
        newAllVolAmpToggles[j + 4] = 'center';
      } else if (jsonData[dynamicKey3].va === 1) {
        newAllVolAmpToggles[j + 4] = 'right';
      }

      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 7}`;
        const dynamicKey1 = `k${i}`;

        if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
          newQuantities[j] = newQuantities[j] || {};
          newQuantities[j][i] = parseFloat(
            jsonData[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

          const { pol } = jsonData[dynamicKey2][dynamicKey];
          newSelectedValues[j] = newSelectedValues[j] || {};
          newSelectedValues[j][i] =
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
      if (newAllVolAmpToggles[key] === 1) {
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
    // Ensure that the ipcRenderer is available
    if (window.electron && window.electron.ipcRenderer) {
      const ipcRenderer = window.electron.ipcRenderer;

      // Event listener for import-file-error
      const handleImportFileError = (arg) => {
        try {
          setPatientName(patient.name);
          console.log('Not Found');
          const outputElectrode = 'boston_vercise_directed';
          const outputIPG = handleIPG(outputElectrode);
          setElectrodeMaster(outputElectrode);
          setIpgMaster(outputIPG);
          const S = {};
          setImportNewS(S);
          const tempLabel = generateUniqueID();
          const tempPatients = [tempLabel];

          const patientTmp = tempPatients[0];
          let initialStates;
          const processedS = {
            filteredQuantities: {},
            filteredValues: {},
            newTotalAmplitude: {},
            outputVisModel: '3',
            newAllVolAmpToggles: {},
          };
          console.log(S);
          initialStates = {
            [patientTmp]: {
              ...initialState,
              leftElectrode: outputElectrode,
              rightElectrode: outputElectrode,
              IPG: outputIPG,
              allQuantities: processedS.filteredQuantities,
              allSelectedValues: processedS.filteredValues,
              allTotalAmplitudes: processedS.newTotalAmplitude,
              visModel: processedS.outputVisModel,
              allVolAmpToggles: processedS.newAllVolAmpToggles,
            },
          };
          setPatientStates(initialStates);
          setPatients(tempPatients);
        } catch (error) {
          console.error('Error processing import-file-error event:', error);
        }
      };

      // Event listener for import-file
      const handleImportFile = (arg) => {
        console.log(arg);
        if (arg === 'File not found' || arg.directionality) {
          try {
            setPatientName(patient.name);
            console.log('Not Found');
            let outputElectrode = handleImportedElectrode(arg.elmodel);
            // while (!baseElec) {
            //   // Waiting for baseElec to exist
            // }
            // console.log(baseElec);
            // if (baseElec) {
            //   outputElectrode = handleImportedElectrode(baseElec);
            //   console.log(outputElectrode);
            // }
            const outputIPG = handleIPG(outputElectrode);
            console.log(outputIPG);
            setElectrodeMaster(outputElectrode);
            setIpgMaster(outputIPG);
            const S = {};
            setImportNewS(S);
            const tempLabel = generateUniqueID();
            const tempPatients = [tempLabel];

            const patientTmp = tempPatients[0];
            let initialStates;
            const processedS = {
              filteredQuantities: {},
              filteredValues: {},
              newTotalAmplitude: {},
              outputVisModel: '3',
              newAllVolAmpToggles: {},
            };
            console.log(S);
            initialStates = {
              [patientTmp]: {
                ...initialState,
                leftElectrode: outputElectrode,
                rightElectrode: outputElectrode,
                IPG: outputIPG,
                allQuantities: processedS.filteredQuantities,
                allSelectedValues: processedS.filteredValues,
                allTotalAmplitudes: processedS.newTotalAmplitude,
                visModel: processedS.outputVisModel,
                allVolAmpToggles: processedS.newAllVolAmpToggles,
              },
            };
            setPatientStates(initialStates);
            setPatients(tempPatients);
          } catch (error) {
            console.error('Error processing import-file-error event:', error);
          }
        } else {
          try {
            setPatientName(patient.name);
            console.log(arg);
            const { S } = arg;
            const outputElectrode = S.elmodel[0];
            const outputIPG = handleIPG(S.elmodel[0]);
            console.log('Tester: ', outputIPG);
            setElectrodeMaster(outputElectrode);
            setIpgMaster(outputIPG);
            setImportNewS(S);

            const tempPatients = [S.label];
            console.log('TEMPPatients', tempPatients[0]);

            let initialStates;

            if (tempPatients.length === 1) {
              const patientTmp = tempPatients[0];
              const processedS =
                Array.isArray(S) && S.length === 0
                  ? {
                      filteredQuantities: {},
                      filteredValues: {},
                      newTotalAmplitude: {},
                      outputVisModel: '3',
                      newAllVolAmpToggles: {},
                    }
                  : gatherImportedDataNew(S, outputIPG);
              console.log(S);
              initialStates = {
                [patientTmp]: {
                  ...initialState,
                  leftElectrode: outputElectrode,
                  rightElectrode: outputElectrode,
                  IPG: outputIPG,
                  allQuantities: processedS.filteredQuantities,
                  allSelectedValues: processedS.filteredValues,
                  allTotalAmplitudes: processedS.newTotalAmplitude,
                  visModel: processedS.outputVisModel,
                  allVolAmpToggles: processedS.newAllVolAmpToggles,
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
        }
      };

      // Attach listeners using 'once' so that it only listens for the event once
      // ipcRenderer.once('import-file-error', handleImportFileError);
      ipcRenderer.once('import-file', handleImportFile);

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

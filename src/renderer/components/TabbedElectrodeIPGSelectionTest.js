import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './TabbedElectrodeIPGSelection.css';
import BostonCartesia from './electrode_models/BostonCartesia';
import Medtronic3389 from './electrode_models/Medtronic3389';
import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';
import NewBostonCartesiaTest from './electrode_models/NewBostonCartesiaTest';
import AbbottDirectedTest from './electrode_models/AbbottDirectedTest';
import Medtronic3387 from './electrode_models/Medtronic3387';
import Medtronic3391 from './electrode_models/Medtronic3391';
import MedtronicB33005 from './electrode_models/MedtronicB33005';
import BostonScientificVercise from './electrode_models/BostonScientificVercise';
import BostonScientificCartesiaHX from './electrode_models/BostonScientificCartesiaHX';
import BostonScientificCartesiaX from './electrode_models/BostonScientificCartesiaX';

function TabbedElectrodeIPGSelection({
  IPG,
  selectedElectrodeLeft,
  selectedElectrodeRight,
  // key,
  // setKey,
  allQuantities,
  setAllQuantities,
  allSelectedValues,
  setAllSelectedValues,
  allTotalAmplitudes,
  setAllTotalAmplitudes,
  allStimulationParameters,
  setAllStimulationParameters,
  visModel,
  setVisModel,
  sessionTitle,
  setSessionTitle,
}) {
  const testElectrodeRef = React.createRef();
  // const [selectedElectrode, setSelectedElectrode] = useState('');
  // const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
  // const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
  // const [pulseWidth, setPulseWidth] = useState(60);
  // const [rate, setRate] = useState(130);
  // const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
  // const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
  const [hemisphereData, setHemisphereData] = useState({
    left: [
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
    ],
    right: [
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
      { unit: 'V', value: '' },
    ],
  });

  // const handleElectrodeChange = (event) => {
  //   setSelectedElectrode(event.target.value);
  // };

  const [key, setKey] = useState('1');

  const fileInputRef = useRef(null);

  // const [allQuantities, setAllQuantities] = useState({});
  // const [allSelectedValues, setAllSelectedValues] = useState({});

  // const handleChange = () => {
  //   console.log("key="+key + ","+ Tabs.key);
  //   setKey(Tabs.key);
  // };

  const handleTabChange = (k) => {
    // console.log("new key=" + k + ", old key="+key + ","+ JSON.stringify(testElectrodeRef.current.getCartesiaData()));
    // console.log("new key=" + k + ", old key="+key + ", old data="+ JSON.stringify(testElectrodeRef.current.getStateQuantities()));
    // localStorage.setItem(key, testElectrodeRef.current.getStateData());
    // setAllQuantities({key: testElectrodeRef.current.getStateData()});

    const updatedAllQuantities = {
      ...allQuantities,
      [key]: testElectrodeRef.current.getStateQuantities(),
    };
    setAllQuantities(updatedAllQuantities);

    const updatedAllSelectedValues = {
      ...allSelectedValues,
      [key]: testElectrodeRef.current.getStateSelectedValues(),
    };
    setAllSelectedValues(updatedAllSelectedValues);

    const updatedAllTotalAmplitudes = {
      ...allTotalAmplitudes,
      [key]: testElectrodeRef.current.getStateAmplitude(),
    };
    setAllTotalAmplitudes(updatedAllTotalAmplitudes);

    const updatedAllStimulationParameters = {
      ...allStimulationParameters,
      [key]: testElectrodeRef.current.getStateStimulationParameters(),
    };
    setAllStimulationParameters(updatedAllStimulationParameters);

    const updatedVisModel = {
      ...visModel,
      [key]: testElectrodeRef.current.getStateVisModel(),
    };
    setVisModel(updatedVisModel);

    const updatedSessionTitle = {
      ...sessionTitle,
      [key]: testElectrodeRef.current.getStateSessionTitle(),
    };
    setSessionTitle(updatedSessionTitle);
    // console.log(sessionTitle[1]);

    // setAllQuantities[key] = testElectrodeRef.current.getStateData();
    // console.log("ls=" + JSON.stringify(localStorage.getItem(key)));
    // console.log("old saved data=" + JSON.stringify(updatedAllQuantities));
    setKey(k);
    // if (localStorage.getItem(k) !== null) {
    // if (allQuantities[k] !== null) {
    //   // testElectrodeRef.current.getStateKey(localStorage.getItem(k));
    //   testElectrodeRef.current.getStateKey(allQuantities[k], allSelectedValues[k]);
    // }
  };

  // const handleTabChange = (k) => {
  //   //localStorage.clear();
  //   localStorage.setItem(key, JSON.stringify(testElectrodeRef.current.getStateQuantities()));
  //   setKey(k);
  // };

  // const handleUnitChange = (e, index, hemisphere) => {
  //   const newHemisphereData = { ...hemisphereData };
  //   newHemisphereData[hemisphere][index].unit = e.target.value;
  //   setHemisphereData(newHemisphereData);
  // };

  // const handleValueChange = (e, index, hemisphere) => {
  //   const newHemisphereData = { ...hemisphereData };
  //   newHemisphereData[hemisphere][index].value = e.target.value;
  //   setHemisphereData(newHemisphereData);
  // };

  console.log('tab key=', key);

  // Send a message to the main process

  const saveQuantitiesandValues = () => {
    // for (let i = 1; i < 9; i++) {
    allQuantities[key] = testElectrodeRef.current.getStateQuantities();

    allSelectedValues[key] = testElectrodeRef.current.getStateSelectedValues();

    allTotalAmplitudes[key] = testElectrodeRef.current.getStateAmplitude();

    allStimulationParameters[key] =
      testElectrodeRef.current.getStateStimulationParameters();

    try {
      visModel[key] = testElectrodeRef.current.getStateVisModel();
    } catch (error) {
      console.log(error);
    }

    sessionTitle[key] = testElectrodeRef.current.getStateSessionTitle();
    // }
  };

  const testElectrodeOptions = {
    BostonCartesia: (
      <BostonCartesia
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
      />
    ),
    Medtronic3389: (
      <Medtronic3389
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    Medtronic3387: (
      <Medtronic3387
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    Medtronic3391: (
      <Medtronic3391
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    MedtronicB33005: (
      <MedtronicB33005
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    BostonScientificVercise: (
      <BostonScientificVercise
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    BostonCartesiaTest: (
      <BostonCartesiaTest
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel[1]}
        sessionTitle={sessionTitle[1]}
      />
    ),
    NewBostonCartesiaTest: (
      <NewBostonCartesiaTest
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
      />
    ),
    BostonScientificCartesiaHX: (
      <BostonScientificCartesiaHX
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel[1]}
        sessionTitle={sessionTitle[1]}
      />
    ),
    BostonScientificCartesiaX: (
      <BostonScientificCartesiaX
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel[1]}
        sessionTitle={sessionTitle[1]}
      />
    ),
    AbbottDirectedTest: (
      <AbbottDirectedTest
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
      />
    ),
  };

  const [importedData, setImportedData] = useState(null);

  function handleExportAmplitude(amplitudeList) {
    const exportAmplitudeList = [];
    Object.keys(amplitudeList).forEach((thing) => {
      exportAmplitudeList.push(parseFloat(amplitudeList[thing]));
    });
    exportAmplitudeList.shift();
    return exportAmplitudeList;
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          setImportedData(jsonData);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  // Inside the TabbedElectrodeIPGSelection component
  const gatherExportedData = () => {
    // handleFileChange('1');
    const data = [];
    const exportValues = { ...allSelectedValues };

    for (const key in allSelectedValues) {
      data.push({
        key,
        selectedValues: allSelectedValues[key],
        quantities: allQuantities[key],
      });
    }

    // Create a JSON representation of the data
    const jsonData = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exportedData.json';
    a.click();
    window.URL.revokeObjectURL(url);
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

  const parseAllVariables = () => {
    for (let i = 1; i < 9; i++) {
      if (!allQuantities[i]) {
        Object.keys(allQuantities).forEach((key3) => {
          allQuantities[i][key3] = 0;
          allSelectedValues[i][key3] = 0;
          allTotalAmplitudes[i] = 0;
          allStimulationParameters[i].parameter2 = 0;
          allStimulationParameters[i].parameter1 = 0;
        });
      }
    }
  };

  const gatherExportedData2 = () => {
    // handleFileChange('1');
    saveQuantitiesandValues();
    // parseAllVariables();
    const exportAmplitudeData = handleExportAmplitude(allTotalAmplitudes);
    console.log(exportAmplitudeData);
    const leftHemiArr = [];
    const rightHemiArr = [];
    const data = {
      S: {
        label: sessionTitle[1],
        Rs1: {},
        Rs2: {},
        Rs3: {},
        Rs4: {},
        Ls1: {},
        Ls2: {},
        Ls3: {},
        Ls4: {},
        active: {},
        model: '',
        monopolarmodel: 0,
        amplitude: {},
        activecontacts: [],
        template: 'warp',
        sources: {},
        elmodel: {},
        ipg: IPG,
      },
    };

    data.S.elmodel = [selectedElectrodeLeft, selectedElectrodeRight];
    console.log('length', Object.keys(allQuantities[1]));

    const loopSize = Object.keys(allQuantities[1]).length;
    console.log('loopSize: ', loopSize);
    // data.S.label = 'Num1';
    const activeArray = [];
    const leftAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      if (allSelectedValues[j] && allQuantities[j]) {
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
          let dynamicKey = `k${i + loopSize - 2}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j][0]),
          pol: translatePolarity(allSelectedValues[j][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j]);
        data.S[dynamicKey2].frequency = parseFloat(
          allStimulationParameters[j].parameter2,
        );
        data.S[dynamicKey2].pulsewidth = parseFloat(
          allStimulationParameters[j].parameter1,
        );
        data.S[dynamicKey2].va = 2;
        activeArray.push(j);
        leftAmpArray[j] = parseFloat(allTotalAmplitudes[j]);
        // console.log(activeContacts(allSelectedValues[j]));
        leftHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j - 1] = activeContacts(allSelectedValues[j]);
        // console.log(data.S.activecontacts);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i + loopSize - 2}`;
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
        data.S[dynamicKey2].pulsewidth = 0;
        data.S[dynamicKey2].va = 2;
      }
    }
    const leftLength = activeArray.length;
    const newActiveArray = [];
    const rightAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      if (allSelectedValues[j + 4] && allQuantities[j + 4]) {
        for (let i = 1; i < loopSize; i++) {
          let polarity = 0;
          if (allSelectedValues[j + 4][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j + 4][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j + 4][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i - 1}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j + 4][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j + 4][0]),
          pol: translatePolarity(allSelectedValues[j + 4][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j + 4]);
        data.S[dynamicKey2].frequency = parseFloat(
          allStimulationParameters[j + 4].parameter2,
        );
        data.S[dynamicKey2].pulsewidth = parseFloat(
          allStimulationParameters[j + 4].parameter1,
        );
        data.S[dynamicKey2].va = 2;
        activeArray.push(j + 4);
        newActiveArray.push(j);
        rightHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j + 3] = activeContacts(allSelectedValues[j + 4]);
        rightAmpArray[j + 4] = parseFloat(allTotalAmplitudes[j + 4]);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i - 1}`;
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
        data.S[dynamicKey2].pulsewidth = 0;
        data.S[dynamicKey2].va = 2;
      }
    }
    // data.S.activecontacts.push(rightHemiArr);
    // data.S.activecontacts.push(leftHemiArr);
    const totalAmpArray = leftAmpArray.push(rightAmpArray);
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
    data.S.active = [leftLength, rightLength];
    // data.S.activecontacts = activeContacts(allSelectedValues[1]);

    let exportVisModel = '';
    console.log(visModel[1]);
    if (visModel[1] === '1') {
      console.log('here');
      exportVisModel = 'Dembek 2017';
    } else if (visModel[1] === '2') {
      exportVisModel = 'Fastfield (Baniasadi 2020)';
    } else if (visModel[1] === '3') {
      exportVisModel = 'SimBio/FieldTrip (see Horn 2017)';
    } else if (visModel[1] === '4') {
      exportVisModel = 'Kuncel 2008';
    } else if (visModel[1] === '5') {
      exportVisModel = 'Maedler 2012';
    } else if (visModel[1] === '6') {
      exportVisModel = 'OSS-DBS (Butenko 2020)';
    }
    console.log('export vis model', exportVisModel);
    data.S.model = exportVisModel;

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exportedData.json';
    a.click();
    window.URL.revokeObjectURL(url);
    // window.electron.ipcRenderer.sendMessage('close-window');

    // // Listen for a response from the main process
    // window.electron.ipcRenderer.on('window-closed', (event, arg) => {
    //   console.log(arg); // Prints "Window closed" if received from the main process
    // });
  };

  const gatherExportedData3 = () => {
    // handleFileChange('1');
    const data = {
      S: {
        label: sessionTitle[1],
        Rs1: {},
        Rs2: {},
        Rs3: {},
        Rs4: {},
        Ls1: {},
        Ls2: {},
        Ls3: {},
        Ls4: {},
        active: {},
        model: '',
        monopolarmodel: 0,
        amplitude: [],
        activecontacts: {},
        template: 'warp',
        sources: {},
        elmodel: {},
        volume: [0, 0],
      },
    };

    for (let i = 1; i < 9; i++) {
      if (allTotalAmplitudes[i]) {
        data.S.amplitude[i - 1] = parseFloat(allTotalAmplitudes[i]);
      } else {
        data.S.amplitude[i - 1] = 0;
      }
    }

    data.S.elmodel = [selectedElectrodeLeft, selectedElectrodeRight];
    const activeArray = [];
    let exportVisModel = '';
    if (visModel[1] === '1') {
      console.log('here');
      exportVisModel = 'Dembek 2017';
    } else if (visModel[1] === '2') {
      exportVisModel = 'Fastfield (Baniasadi 2020)';
    } else if (visModel[1] === '3') {
      exportVisModel = 'SimBio/FieldTrip (see Horn 2017)';
    } else if (visModel[1] === '4') {
      exportVisModel = 'Kuncel 2008';
    } else if (visModel[1] === '5') {
      exportVisModel = 'Maedler 2012';
    }

    data.S.model = exportVisModel;

    // for (let j = 1; j < 5; j++) {
    //   let dynamicKey2 = `Ls${j}`;
    //   if (allSelectedValues[j] && allQuantities[j]) {
    //     for (let i = 1; i < 9; i++) {
    //       let polarity = 0;
    //       if (allSelectedValues[j][i] === 'left') {
    //         polarity = 0;
    //       } else if (allSelectedValues[j][i] === 'center') {
    //         polarity = 1;
    //       } else if (allSelectedValues[j][i] === 'right') {
    //         polarity = 2;
    //       }
    //       let dynamicKey = `k${i + 7}`;
    //       data.S[dynamicKey2][dynamicKey] = {
    //         perc: parseFloat(allQuantities[j][i]),
    //         pol: polarity,
    //         imp: 1,
    //       };
    //     }
    //     data.S[dynamicKey2].case = {
    //       perc: parseFloat(allQuantities[j][0]),
    //       pol: translatePolarity(allSelectedValues[j][0]),
    //     };
    //     data.S[dynamicKey2].amp = allTotalAmplitudes[j];
    //     data.S[dynamicKey2].frequency = allStimulationParameters[j].parameter2;
    //     data.S[dynamicKey2].pulsewidth = allStimulationParameters[j].parameter1;
    //     activeArray.push(j);
    //     data.S.activeContacts[j] = activeContacts(allSelectedValues[j]);
    //   }
    // }

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      if (allSelectedValues[j] && allQuantities[j]) {
        for (let i = 1; i < 9; i++) {
          let polarity = 0;
          if (allSelectedValues[j][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i + 7}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j][0]),
          pol: translatePolarity(allSelectedValues[j][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j]);
        data.S[dynamicKey2].frequency = parseFloat(
          allStimulationParameters[j].parameter2,
        );
        data.S[dynamicKey2].pulsewidth = parseFloat(
          allStimulationParameters[j].parameter1,
        );
        activeArray.push(j);
        data.S.activecontacts[j] = activeContacts(allSelectedValues[j]);
      } else {
        for (let i = 1; i < 9; i++) {
          console.log('j: ', dynamicKey2);
          let dynamicKey = `k${i + 7}`;
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
        data.S[dynamicKey2].frequency = 130;
        data.S[dynamicKey2].pulsewidth = 60;
      }
    }

    const leftLength = activeArray.length;
    const newActiveArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      if (allSelectedValues[j + 4] && allQuantities[j + 4]) {
        for (let i = 1; i < 9; i++) {
          let polarity = 0;
          if (allSelectedValues[j + 4][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j + 4][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j + 4][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i - 1}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j + 4][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j + 4][0]),
          pol: translatePolarity(allSelectedValues[j + 4][0]),
        };
        data.S[dynamicKey2].amp = allTotalAmplitudes[j + 4];
        data.S[dynamicKey2].frequency =
          allStimulationParameters[j + 4].parameter2;
        data.S[dynamicKey2].pulsewidth =
          allStimulationParameters[j + 4].parameter1;
        activeArray.push(j + 4);
        newActiveArray.push(j);
        data.S.activecontacts[j + 4] = activeContacts(allSelectedValues[j + 4]);
      } else {
        for (let i = 1; i < 9; i++) {
          let dynamicKey = `k${i - 1}`;
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
        data.S[dynamicKey2].frequency = 130;
        data.S[dynamicKey2].pulsewidth = 60;
      }
    }
    const sourcesArray = activeArray;
    const rightLength = newActiveArray.length;
    data.S.sources = sourcesArray;
    data.S.active = [leftLength, rightLength];
    console.log(data);
    return data;
    // data.S.activecontacts = activeContacts(allSelectedValues[1]);
  };

  const gatherExportedData4 = () => {
    // handleFileChange('1');
    saveQuantitiesandValues();
    // parseAllVariables();
    const exportAmplitudeData = handleExportAmplitude(allTotalAmplitudes);
    console.log(exportAmplitudeData);
    const leftHemiArr = [];
    const rightHemiArr = [];
    const data = {
      S: {
        label: sessionTitle[1],
        Rs1: {},
        Rs2: {},
        Rs3: {},
        Rs4: {},
        Ls1: {},
        Ls2: {},
        Ls3: {},
        Ls4: {},
        active: {},
        model: '',
        monopolarmodel: 0,
        amplitude: {},
        activecontacts: [],
        template: 'warp',
        sources: {},
        elmodel: {},
        ipg: IPG,
      },
    };

    data.S.elmodel = [selectedElectrodeLeft, selectedElectrodeRight];
    console.log('length', Object.keys(allQuantities[1]));

    const loopSize = Object.keys(allQuantities[1]).length;
    console.log('loopSize: ', loopSize);
    // data.S.label = 'Num1';
    const activeArray = [];
    const leftAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      if (allSelectedValues[j] && allQuantities[j]) {
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
          let dynamicKey = `k${i + loopSize - 2}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j][0]),
          pol: translatePolarity(allSelectedValues[j][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j]);
        data.S[dynamicKey2].frequency = parseFloat(
          allStimulationParameters[j].parameter2,
        );
        data.S[dynamicKey2].pulsewidth = parseFloat(
          allStimulationParameters[j].parameter1,
        );
        data.S[dynamicKey2].va = 2;
        activeArray.push(j);
        leftAmpArray[j] = parseFloat(allTotalAmplitudes[j]);
        // console.log(activeContacts(allSelectedValues[j]));
        leftHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j - 1] = activeContacts(allSelectedValues[j]);
        // console.log(data.S.activecontacts);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i + loopSize - 2}`;
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
        data.S[dynamicKey2].pulsewidth = 0;
        data.S[dynamicKey2].va = 2;
      }
    }
    const leftLength = activeArray.length;
    const newActiveArray = [];
    const rightAmpArray = [];

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      if (allSelectedValues[j + 4] && allQuantities[j + 4]) {
        for (let i = 1; i < loopSize; i++) {
          let polarity = 0;
          if (allSelectedValues[j + 4][i] === 'left') {
            polarity = 0;
          } else if (allSelectedValues[j + 4][i] === 'center') {
            polarity = 1;
          } else if (allSelectedValues[j + 4][i] === 'right') {
            polarity = 2;
          }
          let dynamicKey = `k${i - 1}`;
          data.S[dynamicKey2][dynamicKey] = {
            perc: parseFloat(allQuantities[j + 4][i]),
            pol: polarity,
            imp: 1,
          };
        }
        data.S[dynamicKey2].case = {
          perc: parseFloat(allQuantities[j + 4][0]),
          pol: translatePolarity(allSelectedValues[j + 4][0]),
        };
        data.S[dynamicKey2].amp = parseFloat(allTotalAmplitudes[j + 4]);
        data.S[dynamicKey2].frequency = parseFloat(
          allStimulationParameters[j + 4].parameter2,
        );
        data.S[dynamicKey2].pulsewidth = parseFloat(
          allStimulationParameters[j + 4].parameter1,
        );
        data.S[dynamicKey2].va = 2;
        activeArray.push(j + 4);
        newActiveArray.push(j);
        rightHemiArr[j - 1] = activeContacts(allSelectedValues[j]);
        data.S.activecontacts[j + 3] = activeContacts(allSelectedValues[j + 4]);
        rightAmpArray[j + 4] = parseFloat(allTotalAmplitudes[j + 4]);
      } else {
        for (let i = 1; i < loopSize; i++) {
          let dynamicKey = `k${i - 1}`;
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
        data.S[dynamicKey2].pulsewidth = 0;
        data.S[dynamicKey2].va = 2;
      }
    }
    // data.S.activecontacts.push(rightHemiArr);
    // data.S.activecontacts.push(leftHemiArr);
    const totalAmpArray = leftAmpArray.push(rightAmpArray);
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
    data.S.active = [leftLength, rightLength];
    // data.S.activecontacts = activeContacts(allSelectedValues[1]);

    let exportVisModel = '';
    console.log(visModel[1]);
    if (visModel[1] === '1') {
      console.log('here');
      exportVisModel = 'Dembek 2017';
    } else if (visModel[1] === '2') {
      exportVisModel = 'Fastfield (Baniasadi 2020)';
    } else if (visModel[1] === '3') {
      exportVisModel = 'SimBio/FieldTrip (see Horn 2017)';
    } else if (visModel[1] === '4') {
      exportVisModel = 'Kuncel 2008';
    } else if (visModel[1] === '5') {
      exportVisModel = 'Maedler 2012';
    } else if (visModel[1] === '6') {
      exportVisModel = 'OSS-DBS (Butenko 2020)';
    }
    console.log('export vis model', exportVisModel);
    data.S.model = exportVisModel;

    return data;
  };

  const [responseData, setResponseData] = useState('');

  // Define a function to handle button click event
  const handleClick = async () => {
    const outputData = gatherExportedData3();
    try {
      // Make a POST request to send data to the server
      const response = await axios.post('http://localhost:3001/api/data', {
        outputData, // Replace with the data you want to send
      });

      // Handle the response data
      console.log(response.data);
      setResponseData(response.data.message); // Update state with response data
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    }
  };

  const sendDataToMain = () => {
    const outputData = gatherExportedData4();
    window.electron.ipcRenderer.sendMessage('save-file', outputData);
    window.electron.ipcRenderer.sendMessage('close-window');
    // window.electron.ipcRenderer.sendMessage('close-window');

    // Listen for a response from the main process
    window.electron.ipcRenderer.on('window-closed', (event, arg) => {
      console.log(arg); // Prints "Window closed" if received from the main process
    });
  };

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
    const newAllQuantities = {};

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Ls${j}`;
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i + 7}`;
        // let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        // console.log('nestred data: ', nestedData);
        if (jsonData.S[dynamicKey2][dynamicKey]) {
          newQuantities[j][i] = parseFloat(
            jsonData.S[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(
            jsonData.S[dynamicKey2].case['perc'],
          );
          // console.log('perc', nestedData.perc);
          // newQuantities.S[dynamicKey2][dynamicKey]
        }
        // console.log('new quantitites;', newQuantities);
      }
      newAllQuantities[j] = newQuantities[j];
    }
    console.log('newQuantities: ', newAllQuantities);
    setAllQuantities(newAllQuantities);
  };

  useEffect(() => {
    if (importedData) {
      gatherImportedData(importedData);
    }
    handleTabChange('1');
  }, [importedData]);

  // const data = 'hello';
  // function handleMatlabConnectivity() {
  //   window.electron.ipcRenderer.send('trigger-matlab-action', data);
  // }

  return (
    <div>
      <Tabs className="tabs-container">
        <TabList className="tabs-container">
          <Tab onClick={() => handleTabChange('1')}>Left Hemisphere</Tab>
          <Tab onClick={() => handleTabChange('5')}>Right Hemisphere</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            {/* <Tabs onClick={handleChange}> */}
            <TabList>
              <Tab key="1" onClick={() => handleTabChange('1')}>
                Program 1
              </Tab>
              <Tab key="2" onClick={() => handleTabChange('2')}>
                Program 2
              </Tab>
              <Tab key="3" onClick={() => handleTabChange('3')}>
                Program 3
              </Tab>
              <Tab key="4" onClick={() => handleTabChange('4')}>
                Program 4
              </Tab>
            </TabList>
            {hemisphereData.left.map((tabState, index) => (
              <TabPanel key={index}>
                {/* <h2>Unit:</h2>
                <select
                  value={tabState.unit}
                  onChange={(e) => handleUnitChange(e, index, 'left')}
                >
                  <option value="V">V</option>
                  <option value="mA">mA</option>
                </select>

                <h2>Value:</h2>
                <input
                  type="text"
                  value={tabState.value}
                  onChange={(e) => handleValueChange(e, index, 'left')}
                  placeholder={`Enter value in ${tabState.unit}`}
                /> */}
                <div className="form-container">
                  {testElectrodeOptions[selectedElectrodeLeft]}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>

        <TabPanel>
          <Tabs>
            <TabList>
              <Tab key="5" onClick={() => handleTabChange('5')}>
                Program 1
              </Tab>
              <Tab key="6" onClick={() => handleTabChange('6')}>
                Program 2
              </Tab>
              <Tab key="7" onClick={() => handleTabChange('7')}>
                Program 3
              </Tab>
              <Tab key="8" onClick={() => handleTabChange('8')}>
                Program 4
              </Tab>
            </TabList>
            {hemisphereData.right.map((tabState, index) => (
              <TabPanel key={index} className="compact-tab-panel">
                {/* <div className = "compact-input-container"> */}
                {/* <h2>Unit:</h2> */}
                {/* <select
                  value={tabState.unit}
                  onChange={(e) => handleUnitChange(e, index, 'right')}
                >
                  <option value="V">V</option>
                  <option value="mA">mA</option>
                </select>
                <input
                  // type="text"
                  type="number"
                  pattern="[0-9]+"
                  value={tabState.value}
                  onChange={(e) => handleValueChange(e, index, 'right')}
                  placeholder={`Enter value in ${tabState.unit}`}
                /> */}
                {/* </div> */}
                <div className="form-container">
                  {testElectrodeOptions[selectedElectrodeRight]}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
      </Tabs>
      <div className="export-button-container">
        {/* <button
          className="import-button"
          onClick={() => fileInputRef.current.click()}
        >
          Import Data
        </button> */}
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the input element
        />
        <button className="export-button" onClick={gatherExportedData2}>
          Visualize
        </button>
        <button className="export-button" onClick={handleClick}>
          Visualize Webserver
        </button>
        <button className="export-button" onClick={sendDataToMain}>
          Visualize File
        </button>
      </div>
    </div>
  );
}

export default TabbedElectrodeIPGSelection;

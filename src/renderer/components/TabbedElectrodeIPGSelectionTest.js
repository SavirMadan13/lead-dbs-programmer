/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import {Tab, Tabs} from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
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
import Boston_vercise_directed from './electrode_models/currentModels/Boston_vercise_directed';
import Boston_vercise from './electrode_models/currentModels/Boston_vercise';
import Medtronic_3389 from './electrode_models/currentModels/Medtronic_3389';
import Medtronic_3387 from './electrode_models/currentModels/Medtronic_3387';
import Medtronic_3391 from './electrode_models/currentModels/Medtronic_3391';
import Medtronic_B33005 from './electrode_models/currentModels/Medtronic_B33005';
import Medtronic_B33015 from './electrode_models/currentModels/Medtronic_B33015';
import Abbott_activetip_2mm from './electrode_models/currentModels/Abbott_activetip_2mm';
import Abbott_activetip_3mm from './electrode_models/currentModels/Abbott_activetip_3mm';
import Abbott_directed_6172 from './electrode_models/currentModels/Abbott_directed_6172';
import Abbott_directed_6173 from './electrode_models/currentModels/Abbott_directed_6173';
import Boston_vercise_cartesia_HX from './electrode_models/currentModels/Boston_vercise_cartesia_HX';
import Boston_vercise_cartesia_X from './electrode_models/currentModels/Boston_vercise_cartesia_X';
import Boston_vercise_directed_new from './electrode_models/currentModels/Boston_vercise_directed_new';
import electrodeModels from './electrodeModels.json';
import Generic_elmodel from './electrode_models/currentModels/Generic_elmodel';

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
  allTogglePositions,
  setAllTogglePositions,
  allPercAmpToggles,
  setAllPercAmpToggles,
  allVolAmpToggles,
  setAllVolAmpToggles,
  filePath,
  setFilePath,
  matImportFile,
  stimChanged,
  setStimChanged,
  namingConvention,
  selectedPatient,
  historical,
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
  console.log('Electrode models: ', electrodeModels);
  console.log('Selected electrode', selectedElectrodeLeft);
  const [key, setKey] = useState('5');
  // const [namingConvention, setNamingConvention] = useState('clinical');
  const fileInputRef = useRef(null);
  const [visualizationModel, setVisualizationModel] = useState('3');
  // const [allQuantities, setAllQuantities] = useState({});
  // const [allSelectedValues, setAllSelectedValues] = useState({});

  // const handleChange = () => {
  //   console.log("key="+key + ","+ Tabs.key);
  //   setKey(Tabs.key);
  // };

  // const getVariant = (value) => {
  //   return 'outline-secondary';
  // };

  // const namingConventionDef = [
  //   { name: 'clinical', value: 'clinical' },
  //   { name: 'lead-dbs', value: 'lead-dbs' },
  // ];

  // const handleNamingConventionChange = (newConvention) => {
  //   setNamingConvention(newConvention);
  // };

  useEffect(() => {
    if (stimChanged) {
      // Reset states or do necessary updates on stimChanged
      console.log('Stim changed, re-rendering...');
      setStimChanged(false); // Reset stimChanged if it’s a one-time trigger
    }
  }, [stimChanged, setStimChanged]);

  const handleTabChange = (k) => {
    // console.log("new key=" + k + ", old key="+key + ","+ JSON.stringify(testElectrodeRef.current.getCartesiaData()));
    // console.log("new key=" + k + ", old key="+key + ", old data="+ JSON.stringify(testElectrodeRef.current.getStateQuantities()));
    // localStorage.setItem(key, testElectrodeRef.current.getStateData());
    // setAllQuantities({key: testElectrodeRef.current.getStateData()});
    console.log('testElectrodeRef: ', testElectrodeRef.current);
    const updatedAllQuantities = {
      ...allQuantities,
      [key]: testElectrodeRef.current.getStateQuantities(),
    };
    setAllQuantities(updatedAllQuantities);
    console.log('updatedquantities: ', updatedAllQuantities);

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
    console.log('updatedVIsMOdel: ', updatedVisModel);
    const tempModel = testElectrodeRef.current.getStateVisModel();
    setVisualizationModel(tempModel);
    setVisModel(tempModel);

    const updatedSessionTitle = {
      ...sessionTitle,
      [key]: testElectrodeRef.current.getStateSessionTitle(),
    };
    setSessionTitle(updatedSessionTitle);

    const updatedAllTogglePositions = {
      ...allTogglePositions,
      [key]: testElectrodeRef.current.getStateTogglePosition(),
    };
    setAllTogglePositions(updatedAllTogglePositions);
    console.log('Alltogglepositions', allTogglePositions);

    const updatedAllPercAmpTogglePositions = {
      ...allPercAmpToggles,
      [key]: testElectrodeRef.current.getStatePercAmpToggle(),
    };
    setAllPercAmpToggles(updatedAllPercAmpTogglePositions);

    const updatedAllVolAmpTogglePositions = {
      ...allVolAmpToggles,
      [key]: testElectrodeRef.current.getStateVolAmpToggle(),
    };
    setAllVolAmpToggles(updatedAllVolAmpTogglePositions);
    // const updatedIPGforOutput = testElectrodeRef.current.getOutputIPG();
    // setOutputIPG(updatedIPGforOutput);
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
    allTogglePositions[key] = testElectrodeRef.current.getStateTogglePosition();
    // }
  };

  const convertElectrode = (electrode) => {
    switch (electrode) {
      case 'boston_vercise_directed':
        return 'Boston Scientific Vercise Directed';
      case 'medtronic_3389':
        return 'Medtronic 3389';
      case 'medtronic_3387':
        return 'Medtronic 3387';
      case 'medtronic_3391':
        return 'Medtronic 3391';
      case 'medtronic_b33005':
        return 'Medtronic B33005';
      case 'medtronic_b33015':
        return 'Medtronic B33015';
      case 'boston_scientific_vercise':
        return 'Boston Scientific Vercise';
      case 'boston_scientific_vercise_cartesia_hx':
        return 'Boston Scientific Vercise Cartesia HX';
      case 'boston_scientific_vercise_cartesia_x':
        return 'Boston Scientific Vercise Cartesia X';
      case 'abbott_activetip_2mm':
        return 'Abbott ActiveTip (6146-6149)';
      case 'abbott_activetip_3mm':
        return 'Abbott ActiveTip (6142-6145)';
      case 'abbott_directed_05':
        return 'Abbott Directed 6172 (short)';
      case 'abbott_directed_15':
        return 'Abbott Directed 6173 (long)';
      default:
        return '';
    }
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
    // boston_vercise_directed: (
    //   <Boston_vercise_directed
    //     ref={testElectrodeRef}
    //     key={key}
    //     name={key}
    //     allQuantities={allQuantities}
    //     quantities={allQuantities[key]}
    //     selectedValues={allSelectedValues[key]}
    //     IPG={IPG}
    //     totalAmplitude={allTotalAmplitudes[key]}
    //     parameters={allStimulationParameters[key]}
    //     visModel={visModel[1]}
    //     sessionTitle={sessionTitle[1]}
    //     togglePosition={allTogglePositions[key]}
    //     percAmpToggle={allPercAmpToggles[key]}
    //     volAmpToggle={allVolAmpToggles[key]}
    //     // stimChanged={stimChanged}
    //     // setStimChanged={setStimChanged}
    //     // outputIPG={outputIPG}
    //   />
    // ),
    boston_vercise_directed: (
      <Boston_vercise_directed_new
        ref={testElectrodeRef}
        key={key}
        name={key}
        allQuantities={allQuantities}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        // visModel={visModel[1]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        adornment={allVolAmpToggles[key] === 'right' ? 'V' : 'mA'}
        historical={historical}
        // stimChanged={stimChanged}
        // setStimChanged={setStimChanged}
        // outputIPG={outputIPG}
      />
    ),
    boston_vercise_cartesia_hx: (
      <Boston_vercise_cartesia_HX
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
      />
    ),
    boston_vercise_cartesia_x: (
      <Boston_vercise_cartesia_X
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
      />
    ),
    boston_vercise: (
      <Boston_vercise
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    medtronic_3389: (
      <Medtronic_3389
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    medtronic_3387: (
      <Medtronic_3387
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    medtronic_3391: (
      <Medtronic_3391
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    medtronic_b33005: (
      <Medtronic_B33005
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    medtronic_b33015: (
      <Medtronic_B33015
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    abbott_activetip_2mm: (
      <Abbott_activetip_2mm
        ref={testElectrodeRef}
        key={key}
        name={key}
        allQuantities={allQuantities}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    abbott_activetip_3mm: (
      <Abbott_activetip_3mm
        ref={testElectrodeRef}
        key={key}
        name={key}
        allQuantities={allQuantities}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    abbott_directed_6172: (
      <Abbott_directed_6172
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    abbott_directed_6173: (
      <Abbott_directed_6173
        ref={testElectrodeRef}
        key={key}
        name={key}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        historical={historical}
      />
    ),
    generic_elmodel: (
      <Generic_elmodel
        ref={testElectrodeRef}
        key={key}
        name={key}
        allQuantities={allQuantities}
        quantities={allQuantities[key]}
        selectedValues={allSelectedValues[key]}
        IPG={IPG}
        totalAmplitude={allTotalAmplitudes[key]}
        parameters={allStimulationParameters[key]}
        // visModel={visModel[1]}
        visModel={visModel}
        sessionTitle={sessionTitle[1]}
        togglePosition={allTogglePositions[key]}
        percAmpToggle={allPercAmpToggles[key]}
        volAmpToggle={allVolAmpToggles[key]}
        contactNaming={namingConvention}
        adornment={allVolAmpToggles[key] === 'right' ? 'V' : 'mA'}
        historical={historical}
        elspec={electrodeModels.boston_vercise_directed}
        // stimChanged={stimChanged}
        // setStimChanged={setStimChanged}
        // outputIPG={outputIPG}
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

  // const handleTogglePositions = () => {
  //   let outputQuantities = {};
  //   console.log(allQuantities);
  //   console.log(allTotalAmplitudes);
  //   Object.keys(allQuantities).forEach((quantity) => {
  //     if (allTogglePositions[quantity] === 'mA') {
  //       console.log('quantity: ', allTogglePositions);
  //       outputQuantities = calculatePercentageFromAmplitude(
  //         allQuantities[quantity],
  //         parseFloat(allTotalAmplitudes[quantity]),
  //       );
  //       const updatedQuantities = {
  //         ...allQuantities,
  //         [key]: outputQuantities,
  //       };
  //       // console.log('updaredQuantities: ', updatedQuantities);
  //       outputQuantities = updatedQuantities;
  //     } else if (allTogglePositions[quantity] === 'V') {
  //       outputQuantities = calculateVoltageFromAmplitude(
  //         allQuantities[quantity],
  //       );
  //       const updatedQuantities = {
  //         ...allQuantities,
  //         [key]: outputQuantities,
  //       };
  //       outputQuantities = updatedQuantities;
  //     } else {
  //       outputQuantities[quantity] = allQuantities[quantity];
  //     }
  //     // return '';
  //   });
  //   // console.log(updatedQuantities);
  //   return outputQuantities;
  // };

  const handleTogglePositions = () => {
    let outputQuantities = {};
    console.log(allQuantities);
    console.log(allTotalAmplitudes);
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

  // const handleIPGForOutput = () => {
  //   if (IPG = 'Boston') {
  //     if (handlePercAmp)
  //   }
  // }

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

  const handleIPGForOutput = () => {
    console.log(percAmpToggl);
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
        data.S[dynamicKey2].pulseWidth = parseFloat(
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
        data.S[dynamicKey2].pulseWidth = 0;
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
        data.S[dynamicKey2].pulseWidth = parseFloat(
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
        data.S[dynamicKey2].pulseWidth = 0;
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
          // console.log('j: ', dynamicKey2);
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
    let updatedOutputQuantity = {};
    updatedOutputQuantity = handleTogglePositions();
    console.log('Updated output quantity: ', updatedOutputQuantity);
    // parseAllVariables();
    const exportAmplitudeData = handleExportAmplitude(allTotalAmplitudes);
    // console.log(exportAmplitudeData);
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
    // console.log('length', Object.keys(allQuantities[1]));

    const loopSize = Object.keys(allQuantities[1]).length;
    // console.log('loopSize: ', loopSize);
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
        data.S[dynamicKey2].pulseWidth = parseFloat(
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
        data.S[dynamicKey2].pulseWidth = 0;
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
        data.S[dynamicKey2].pulseWidth = parseFloat(
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
        data.S[dynamicKey2].pulseWidth = 0;
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

    for (let i = 1; i < 9; i++) {
      const zerosArr = [];
      for (let j = 1; j < loopSize; j++) {
        zerosArr.push(0);
      }
      if (data.S.activecontacts[i]) {
        if (data.S.activecontacts[i] === null) {
          data.S.activecontacts[i] = zerosArr;
        }
      } else {
        data.S.activecontacts[i] = zerosArr;
      }
    }

    let exportVisModel = '';
    // console.log(visModel[1]);
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
    // console.log('export vis model', exportVisModel);
    data.S.model = exportVisModel;

    return data;
  };

  const gatherExportedData5 = () => {
    // handleFileChange('1');
    saveQuantitiesandValues();
    let updatedOutputQuantity = {};
    updatedOutputQuantity = handleTogglePositions();
    console.log('Updated output quantity: ', updatedOutputQuantity);
    // parseAllVariables();
    const exportAmplitudeData = handleExportAmplitude(allTotalAmplitudes);
    // console.log(exportAmplitudeData);
    const leftHemiArr = [];
    const rightHemiArr = [];
    const data = {
      S: {
        label: selectedPatient,
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
          let dynamicKey = `k${i + loopSize - 2}`;
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
        if (allPercAmpToggles[j] === 'V') {
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
          let dynamicKey = `k${i - 1}`;
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
        if (allPercAmpToggles[j + 4] === 'V') {
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
    data.S.active = [leftLength, rightLength];
    // data.S.activecontacts = activeContacts(allSelectedValues[1]);

    for (let i = 1; i < 9; i++) {
      const zerosArr = [];
      for (let j = 1; j < loopSize; j++) {
        zerosArr.push(0);
      }
      if (data.S.activecontacts[i - 1]) {
        if (data.S.activecontacts[i - 1] === null) {
          data.S.activecontacts[i - 1] = zerosArr;
        }
      } else {
        data.S.activecontacts[i - 1] = zerosArr;
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
    // if (Array.isArray(data.S.activecontacts) && data.S.activecontacts.length > 0 && data.S.activecontacts[0] === undefined) {
    //   data.S.activecontacts.shift();
    // }
    console.log(data.S.activecontacts);
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
    const outputData = gatherExportedData5();
    console.log('OUTPUTDATA: ', outputData);
    console.log('Historical: ', historical);
    window.electron.ipcRenderer.sendMessage(
      'save-file',
      filePath,
      outputData,
      historical,
    );
    // window.electron.ipcRenderer.sendMessage('close-window');
    // window.electron.ipcRenderer.sendMessage('close-window');

    // Listen for a response from the main process
    window.electron.ipcRenderer.on('window-closed', (event, arg) => {
      console.log(arg); // Prints "Window closed" if received from the main process
    });
  };

  const closeFunction = () => {
    window.electron.ipcRenderer.sendMessage('close-window-new');
  };

  const quitApp = () => {
    // window.electron.ipcRenderer.sendMessage('set-status');
    window.electron.ipcRenderer.sendMessage('close-window');
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
    // handleTabChange('1');
    console.log('Tabbed all quantities: ', allQuantities);
    if (stimChanged) {
      handleTabChange(key);
      setStimChanged(false);
    }
  }, [importedData]);

  // useEffect(() => {
  //   if (stimChanged) {
  //     console.log('STIMCHANGED: ', stimChanged);
  //     console.log('Tabbed all quantities: ', allQuantities);
  //     handleTabChange(key);
  //     // setAllQuantities(allQuantities);
  //     setStimChanged(false);
  //   }
  // });
  // const data = 'hello';
  // function handleMatlabConnectivity() {
  //   window.electron.ipcRenderer.send('trigger-matlab-action', data);
  // }

  return (
    <div className="TabbedIPGContainer">
      <div style={{ marginTop: '30px' }} />
      <div className="stimCloseContainer" />
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <TabList className="mb-3">
          <Tab onClick={() => handleTabChange('5')}>Right Hemisphere</Tab>
          <Tab onClick={() => handleTabChange('1')}>Left Hemisphere</Tab>
        </TabList>
        <TabPanel>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
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
              <TabPanel key={index}>
                <div className="form-container">
                  {/* {testElectrodeOptions[selectedElectrodeRight]} */}
                  <Generic_elmodel
                    ref={testElectrodeRef}
                    key={key}
                    name={key}
                    allQuantities={allQuantities}
                    quantities={allQuantities[key]}
                    selectedValues={allSelectedValues[key]}
                    IPG={IPG}
                    totalAmplitude={allTotalAmplitudes[key]}
                    parameters={allStimulationParameters[key]}
                    // visModel={visModel[1]}
                    visModel={visModel}
                    sessionTitle={sessionTitle[1]}
                    togglePosition={allTogglePositions[key]}
                    percAmpToggle={allPercAmpToggles[key]}
                    volAmpToggle={allVolAmpToggles[key]}
                    contactNaming={namingConvention}
                    adornment={allVolAmpToggles[key] === 'right' ? 'V' : 'mA'}
                    historical={historical}
                    elspec={electrodeModels[selectedElectrodeRight]}
                    // stimChanged={stimChanged}
                    // setStimChanged={setStimChanged}
                    // outputIPG={outputIPG}
                  />
                  <div className="electrode-label">
                    {convertElectrode(selectedElectrodeRight)}
                  </div>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
        <TabPanel>
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
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
                <div className="form-container">
                  {/* {testElectrodeOptions[selectedElectrodeLeft]} */}
                  <Generic_elmodel
                    ref={testElectrodeRef}
                    key={key}
                    name={key}
                    allQuantities={allQuantities}
                    quantities={allQuantities[key]}
                    selectedValues={allSelectedValues[key]}
                    IPG={IPG}
                    totalAmplitude={allTotalAmplitudes[key]}
                    parameters={allStimulationParameters[key]}
                    // visModel={visModel[1]}
                    visModel={visModel}
                    sessionTitle={sessionTitle[1]}
                    togglePosition={allTogglePositions[key]}
                    percAmpToggle={allPercAmpToggles[key]}
                    volAmpToggle={allVolAmpToggles[key]}
                    contactNaming={namingConvention}
                    adornment={allVolAmpToggles[key] === 'right' ? 'V' : 'mA'}
                    historical={historical}
                    elspec={electrodeModels[selectedElectrodeLeft]}
                    // stimChanged={stimChanged}
                    // setStimChanged={setStimChanged}
                    // outputIPG={outputIPG}
                  />
                  <div className="electrode-label">
                    {convertElectrode(selectedElectrodeLeft)}
                  </div>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
      </Tabs>
      <div className="export-button-container">
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          // Hide the input element
        />
      </div>
      <div style={{ textAlign: 'center', paddingBottom: '35px' }}>
        {/* <button
          className="export-button-final-discard"
          onClick={closeFunction}
          style={{ marginRight: '15px' }}
        >
          Discard
        </button> */}
        <button className="export-button-final" onClick={sendDataToMain}>
          Save
        </button>
      </div>
    </div>
    // <div>
    //   <div style={{ marginTop: '30px' }} />
    //   <div className="stimCloseContainer" />
    //   <Tabs
    //     defaultActiveKey="rightHemisphere"
    //     // id="uncontrolled-tab-example"
    //     className="mb-3"
    //     onSelect={handleTabChange}
    //   >
    //     <Tab eventKey="rightHemisphere" title="Right Hemisphere">
    //       <Tabs
    //         defaultActiveKey="program1"
    //         id="right-programs"
    //         className="mb-3"
    //         onSelect={handleTabChange}
    //       >
    //         {['5', '6', '7', '8'].map((programKey, index) => (
    //           <Tab
    //             eventKey={`program${index + 1}`}
    //             title={`Program ${index + 1}`}
    //             key={programKey}
    //           >
    //             <div className="form-container">
    //               {/* Replace Generic_elmodel with your component and relevant props */}
    //               <Generic_elmodel
    //                 ref={testElectrodeRef}
    //                 key={programKey}
    //                 name={programKey}
    //                 allQuantities={allQuantities}
    //                 quantities={allQuantities[programKey]}
    //                 selectedValues={allSelectedValues[programKey]}
    //                 IPG={IPG}
    //                 totalAmplitude={allTotalAmplitudes[programKey]}
    //                 parameters={allStimulationParameters[programKey]}
    //                 visModel={visModel}
    //                 sessionTitle={sessionTitle[1]}
    //                 togglePosition={allTogglePositions[programKey]}
    //                 percAmpToggle={allPercAmpToggles[programKey]}
    //                 volAmpToggle={allVolAmpToggles[programKey]}
    //                 contactNaming={namingConvention}
    //                 adornment={
    //                   allVolAmpToggles[programKey] === 'right' ? 'V' : 'mA'
    //                 }
    //                 historical={historical}
    //                 elspec={electrodeModels[selectedElectrodeRight]}
    //               />
    //               <div className="electrode-label">
    //                 {convertElectrode(selectedElectrodeRight)}
    //               </div>
    //             </div>
    //           </Tab>
    //         ))}
    //       </Tabs>
    //     </Tab>
    //     <Tab eventKey="leftHemisphere" title="Left Hemisphere">
    //       <Tabs
    //         defaultActiveKey="program1"
    //         id="left-programs"
    //         className="mb-3"
    //         onSelect={handleTabChange}
    //       >
    //         {['1', '2', '3', '4'].map((programKey, index) => (
    //           <Tab
    //             eventKey={`program${index + 1}`}
    //             title={`Program ${index + 1}`}
    //             key={programKey}
    //           >
    //             <div className="form-container">
    //               <Generic_elmodel
    //                 ref={testElectrodeRef}
    //                 key={programKey}
    //                 name={programKey}
    //                 allQuantities={allQuantities}
    //                 quantities={allQuantities[programKey]}
    //                 selectedValues={allSelectedValues[programKey]}
    //                 IPG={IPG}
    //                 totalAmplitude={allTotalAmplitudes[programKey]}
    //                 parameters={allStimulationParameters[programKey]}
    //                 visModel={visModel}
    //                 sessionTitle={sessionTitle[1]}
    //                 togglePosition={allTogglePositions[programKey]}
    //                 percAmpToggle={allPercAmpToggles[programKey]}
    //                 volAmpToggle={allVolAmpToggles[programKey]}
    //                 contactNaming={namingConvention}
    //                 adornment={
    //                   allVolAmpToggles[programKey] === 'right' ? 'V' : 'mA'
    //                 }
    //                 historical={historical}
    //                 elspec={electrodeModels[selectedElectrodeLeft]}
    //               />
    //               <div className="electrode-label">
    //                 {convertElectrode(selectedElectrodeLeft)}
    //               </div>
    //             </div>
    //           </Tab>
    //         ))}
    //       </Tabs>
    //     </Tab>
    //   </Tabs>
    //   <div className="export-button-container">
    //     <input
    //       ref={fileInputRef}
    //       className="file-input"
    //       type="file"
    //       accept=".json"
    //       onChange={handleFileChange}
    //       style={{ display: 'none' }}
    //     />
    //   </div>
    //   <div style={{ textAlign: 'center', paddingBottom: '35px' }}>
    //     <button className="export-button-final" onClick={sendDataToMain}>
    //       Save
    //     </button>
    //   </div>
    // </div>
  );
}

export default TabbedElectrodeIPGSelection;

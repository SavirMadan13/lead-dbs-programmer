/* eslint-disable react/self-closing-comp */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

import Dropdown from 'react-bootstrap/dropdown';
import { Container } from 'react-bootstrap';
import { Slider } from '@mui/material';
import ImageDisplay from './components/ImageDisplay';
import ElectrodeIPGSelection from './components/ElectrodeIPGSelection';
import TripleToggle from './components/TripleToggle';
import { ReactComponent as MySVG } from './components/electrode_models/images/IPG.svg';
import StimulationParameters from './components/StimulationParameters';
import ElectrodeSide from './components/ElectrodeSide';
import TabbedElectrodeIPGSelection from './components/TabbedElectrodeIPGSelection';
import TabbedElectrodeIPGSelectionTest from './components/TabbedElectrodeIPGSelectionTest';
import MatToJsonConverter from './components/MatToJsonConverter';
import JsonLoaderComponent from './components/extractPolValues';
import JSONDataExtractor from './components/JSONDataExtractor';
import NewBostonCartesiaTest from './components/NewBostonCartesiaTest';
import TripleToggleTest from './components/TripleToggleTest';
import Navbar from './components/Navbar';
// import Navbar from 'react-bootstrap/Navbar'
import StimulationSettings from './components/StimulationSettings';
import PercentageAmplitudeToggle from './components/PercentageAmplitudeToggle';
import AssistedToggle from './components/AssistedToggle';
import LeadDbsImage from './logo512Padding-300x212.png';
import MAToggleSwitch from './components/MAToggleSwitch';
import ExportData from './components/ExportData';
import AssistedButtons from './components/AssistedButtons';
import 'bootstrap/dist/css/bootstrap.min.css';

function Hello() {
  return (
    <div>
      <h1>Stimulation Controller</h1>
      <div className="stimulation-parameters">
        {/* <StimulationParameters /> */}
      </div>
      <div className="stimulation-parameters">
        {/* <StimulationParameters /> */}
      </div>
      <div className="Hello">
        {/* <ElectrodeIPGSelection /> */}
        {/* <JsonLoaderComponent /> */}
        {/* <JSONDataExtractor /> */}
        {/* <TripleToggleTest /> */}
        <TabbedElectrodeIPGSelectionTest IPG={undefined} selectedElectrodeLeft={undefined} selectedElectrodeRight={undefined} allQuantities={undefined} setAllQuantities={undefined} allSelectedValues={undefined} setAllSelectedValues={undefined} allTotalAmplitudes={undefined} setAllTotalAmplitudes={undefined} allStimulationParameters={undefined} setAllStimulationParameters={undefined} visModel={undefined} setVisModel={undefined} sessionTitle={undefined} setSessionTitle={undefined} allTogglePositions={undefined} setAllTogglePositions={undefined} allPercAmpToggles={undefined} setAllPercAmpToggles={undefined} allVolAmpToggles={undefined} setAllVolAmpToggles={undefined} filePath={undefined} setFilePath={undefined} matImportFile={undefined} stimChanged={undefined} setStimChanged={undefined} />
        {/* <NewBostonCartesiaTest /> */}
        {/* <ElectrodeSide /> */}
        {/* <TripleToggle /> */}
        {/* <StimulationParameters /> */}
        {/* <ElectrodeIPGSelection />
        <ElectrodeModel /> */}
      </div>
    </div>
  );
}

// const RedirectToNewRoute = () => {
//   return <Navigate to="/new-route" />;
// };

export default function App() {
  const [IPG, setIPG] = useState('');
  const [leftElectrode, setLeftElectrode] = useState('');
  const [rightElectrode, setRightElectrode] = useState('');
  // const [key, setKey] = useState('1');
  const [allQuantities, setAllQuantities] = useState({});
  const [allSelectedValues, setAllSelectedValues] = useState({});
  const [allTotalAmplitudes, setAllTotalAmplitudes] = useState({});
  const [allStimulationParameters, setAllStimulationParameters] = useState({});
  const [visModel, setVisModel] = useState('6');
  const [sessionTitle, setSessionTitle] = useState('');
  const [allTogglePositions, setAllTogglePositions] = useState({});
  const [allPercAmpToggles, setAllPercAmpToggles] = useState({});
  const [allVolAmpToggles, setAllVolAmpToggles] = useState({});
  const [importCount, setImportCount] = useState(0);
  const [importData, setImportData] = useState('');
  const [masterImportData, setMasterImportData] = useState('');
  const [matImportFile, setMatImportFile] = useState(null);
  const [newImportFiles, setNewImportFiles] = useState(null);
  const [showDropdown, setShowDropdown] = useState(true);
  const [filePath, setFilePath] = useState('');
  const [stimChanged, setStimChanged] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDropdown(false);
    }, 1); // Adjust the time to your preference (in milliseconds)

    return () => clearTimeout(timer);
  }, []);

  const zoomIn = () => {
    window.electron.zoom.zoomIn();
  };

  const zoomOut = () => {
    window.electron.zoom.zoomOut();
  };

  const resetZoom = () => {
    window.electron.zoom.resetZoom();
  };

  const [zoomLevel, setZoomLevel] = useState(0);

  const handleZoomChange = (event, newValue) => {
    setZoomLevel(newValue);
    window.electron.zoom.setZoomLevel(newValue);
  };

  useEffect(() => {
    window.electron.zoom.setZoomLevel(zoomLevel);
  }, [zoomLevel]);

  return (
    // <Router>
    //   <div className="Navbar">
    //     <Navbar />
    //     {/* <div>
    //       <button onClick={zoomIn}>Zoom In</button>
    //       <button onClick={zoomOut}>Zoom Out</button>
    //       <button onClick={resetZoom}>Reset Zoom</button>
    //     </div> */}
    //     {/* <img src="./logo512Padding-300x212.png" alt="leadDBS" /> */}
    //     <Slider
    //       value={zoomLevel}
    //       onChange={handleZoomChange}
    //       aria-label="Zoom Level"
    //       // valueLabelDisplay="auto"
    //       step={1}
    //       marks
    //       min={-3}
    //       max={3}
    //       sx={{
    //         '& .MuiSlider-mark': {
    //           backgroundColor: 'black', // Change the color of the marks
    //           height: '10px', // Adjust the height of the marks
    //           width: '2px', // Adjust the width of the marks
    //         },
    //         // '& .MuiSlider-rail': {
    //         //   backgroundColor: 'grey', // Change the color of the rail
    //         // },
    //       }}
    //     />
    //   </div>
    //   {/* {showDropdown && (
    //     <StimulationSettings
    //       IPG={IPG}
    //       setIPG={setIPG}
    //       leftElectrode={leftElectrode}
    //       setLeftElectrode={setLeftElectrode}
    //       rightElectrode={rightElectrode}
    //       setRightElectrode={setRightElectrode}
    //       allQuantities={allQuantities}
    //       setAllQuantities={setAllQuantities}
    //       allSelectedValues={allSelectedValues}
    //       setAllSelectedValues={setAllSelectedValues}
    //       allTotalAmplitudes={allTotalAmplitudes}
    //       setAllTotalAmplitudes={setAllTotalAmplitudes}
    //       allTogglePositions={allTogglePositions}
    //       setAllTogglePositions={setAllTogglePositions}
    //       allPercAmpToggles={allPercAmpToggles}
    //       setAllPercAmpToggles={setAllPercAmpToggles}
    //       allVolAmpToggles={allVolAmpToggles}
    //       setAllVolAmpToggles={setAllVolAmpToggles}
    //       importCount={importCount}
    //       setImportCount={setImportCount}
    //       importDataTest={importData}
    //       setImportDataTest={setImportData}
    //       masterImportData={masterImportData}
    //       setMasterImportData={setMasterImportData}
    //       matImportFile={matImportFile}
    //       setMatImportFile={setMatImportFile}
    //       newImportFiles={newImportFiles}
    //       setNewImportFiles={setNewImportFiles}
    //       filePath={filePath}
    //       setFilePath={setFilePath}
    //       stimChanged={stimChanged}
    //       setStimChanged={setStimChanged}
    //       allStimulationParameters={allStimulationParameters}
    //       setAllStimulationParameters={setAllStimulationParameters}
    //       visModel={visModel}
    //       setVisModel={setVisModel}
    //       sessionTitle={sessionTitle}
    //       setSessionTitle={setSessionTitle}
    //     />
    //   )} */}
    //   {/* <Dropdown style={{ marginLeft: 100 }}>
    //     <Dropdown.Toggle variant="secondary" id="dropdown-button-dark-example1">
    //       Stimulation Settings
    //     </Dropdown.Toggle>
    //     <Dropdown.Menu>
    //       <StimulationSettings
    //         IPG={IPG}
    //         setIPG={setIPG}
    //         leftElectrode={leftElectrode}
    //         setLeftElectrode={setLeftElectrode}
    //         rightElectrode={rightElectrode}
    //         setRightElectrode={setRightElectrode}
    //         allQuantities={allQuantities}
    //         setAllQuantities={setAllQuantities}
    //         allSelectedValues={allSelectedValues}
    //         setAllSelectedValues={setAllSelectedValues}
    //         allTotalAmplitudes={allTotalAmplitudes}
    //         setAllTotalAmplitudes={setAllTotalAmplitudes}
    //         allTogglePositions={allTogglePositions}
    //         setAllTogglePositions={setAllTogglePositions}
    //         allPercAmpToggles={allPercAmpToggles}
    //         setAllPercAmpToggles={setAllPercAmpToggles}
    //         allVolAmpToggles={allVolAmpToggles}
    //         setAllVolAmpToggles={setAllVolAmpToggles}
    //         importCount={importCount}
    //         setImportCount={setImportCount}
    //         importDataTest={importData}
    //         setImportDataTest={setImportData}
    //         masterImportData={masterImportData}
    //         setMasterImportData={setMasterImportData}
    //         matImportFile={matImportFile}
    //         setMatImportFile={setMatImportFile}
    //         newImportFiles={newImportFiles}
    //         setNewImportFiles={setNewImportFiles}
    //         filePath={filePath}
    //         setFilePath={setFilePath}
    //         stimChanged={stimChanged}
    //         setStimChanged={setStimChanged}
    //       />
    //     </Dropdown.Menu>
    //   </Dropdown> */}
    //   {/* <StimulationSettings
    //     IPG={IPG}
    //     setIPG={setIPG}
    //     leftElectrode={leftElectrode}
    //     setLeftElectrode={setLeftElectrode}
    //     rightElectrode={rightElectrode}
    //     setRightElectrode={setRightElectrode}
    //     allQuantities={allQuantities}
    //     setAllQuantities={setAllQuantities}
    //     allSelectedValues={allSelectedValues}
    //     setAllSelectedValues={setAllSelectedValues}
    //     allTotalAmplitudes={allTotalAmplitudes}
    //     setAllTotalAmplitudes={setAllTotalAmplitudes}
    //     allTogglePositions={allTogglePositions}
    //     setAllTogglePositions={setAllTogglePositions}
    //     allPercAmpToggles={allPercAmpToggles}
    //     setAllPercAmpToggles={setAllPercAmpToggles}
    //     allVolAmpToggles={allVolAmpToggles}
    //     setAllVolAmpToggles={setAllVolAmpToggles}
    //     importCount={importCount}
    //     setImportCount={setImportCount}
    //     importDataTest={importData}
    //     setImportDataTest={setImportData}
    //     masterImportData={masterImportData}
    //     setMasterImportData={setMasterImportData}
    //     matImportFile={matImportFile}
    //     setMatImportFile={setMatImportFile}
    //     newImportFiles={newImportFiles}
    //     setNewImportFiles={setNewImportFiles}
    //     filePath={filePath}
    //     setFilePath={setFilePath}
    //     stimChanged={stimChanged}
    //     setStimChanged={setStimChanged}
    //     allStimulationParameters={allStimulationParameters}
    //     setAllStimulationParameters={setAllStimulationParameters}
    //     visModel={visModel}
    //     setVisModel={setVisModel}
    //     sessionTitle={sessionTitle}
    //     setSessionTitle={setSessionTitle}
    //   /> */}
    //   {/* {leftElectrode && (
    //     <TabbedElectrodeIPGSelectionTest
    //       selectedElectrodeLeft={leftElectrode}
    //       selectedElectrodeRight={rightElectrode}
    //       IPG={IPG}
    //       // key={key}
    //       // setKey={setKey}
    //       allQuantities={allQuantities}
    //       setAllQuantities={setAllQuantities}
    //       allSelectedValues={allSelectedValues}
    //       setAllSelectedValues={setAllSelectedValues}
    //       allTotalAmplitudes={allTotalAmplitudes}
    //       setAllTotalAmplitudes={setAllTotalAmplitudes}
    //       allStimulationParameters={allStimulationParameters}
    //       setAllStimulationParameters={setAllStimulationParameters}
    //       visModel={visModel}
    //       setVisModel={setVisModel}
    //       sessionTitle={sessionTitle}
    //       setSessionTitle={setSessionTitle}
    //       allTogglePositions={allTogglePositions}
    //       setAllTogglePositions={setAllTogglePositions}
    //       allPercAmpToggles={allPercAmpToggles}
    //       setAllPercAmpToggles={setAllPercAmpToggles}
    //       allVolAmpToggles={allVolAmpToggles}
    //       setAllVolAmpToggles={setAllVolAmpToggles}
    //       filePath={filePath}
    //       setFilePath={setFilePath}
    //       matImportFile={matImportFile}
    //       stimChanged={stimChanged}
    //       setStimChanged={setStimChanged}
    //     />
    //   )} */}
    //   {/* <TabbedElectrodeIPGSelectionTest
    //     selectedElectrodeLeft={leftElectrode}
    //     selectedElectrodeRight={rightElectrode}
    //     IPG={IPG}
    //     allQuantities={allQuantities}
    //     setAllQuantities={setAllQuantities}
    //     allSelectedValues={allSelectedValues}
    //     setAllSelectedValues={setAllSelectedValues}
    //     allTotalAmplitudes={allTotalAmplitudes}
    //     setAllTotalAmplitudes={setAllTotalAmplitudes}
    //     allStimulationParameters={allStimulationParameters}
    //     setAllStimulationParameters={setAllStimulationParameters}
    //     visModel={visModel}
    //     setVisModel={setVisModel}
    //     sessionTitle={sessionTitle}
    //     setSessionTitle={setSessionTitle}
    //     allTogglePositions={allTogglePositions}
    //     setAllTogglePositions={setAllTogglePositions}
    //     allPercAmpToggles={allPercAmpToggles}
    //     setAllPercAmpToggles={setAllPercAmpToggles}
    //     allVolAmpToggles={allVolAmpToggles}
    //     setAllVolAmpToggles={setAllVolAmpToggles}
    //     filePath={filePath}
    //     setFilePath={setFilePath}
    //     matImportFile={matImportFile}
    //     stimChanged={stimChanged}
    //     setStimChanged={setStimChanged}
    //   /> */}
    //   <Routes>
    //     {/* <Route path="/" element={<Hello />} /> */}
    //     {/* <Route
    //       path="/"
    //       element={<Navigate to ="/new-route" />}
    //     /> */}
    //     {/* <Route
    //       path="/"
    //       element={
    //         <div>
    //           <img src={LeadDbsImage} alt="Description of your image" />
    //           <div></div>
    //           <Link to="/stimulation-settings">
    //             <button className="button">Get Started</button>
    //           </Link>
    //         </div>
    //       }
    //     /> */}
    //     <Route path="/testing" element={<AssistedButtons />} />
    //     <Route
    //       path="/setup"
    //       element={
    //         <div>
    //           <StimulationSettings
    //             IPG={IPG}
    //             setIPG={setIPG}
    //             leftElectrode={leftElectrode}
    //             setLeftElectrode={setLeftElectrode}
    //             rightElectrode={rightElectrode}
    //             setRightElectrode={setRightElectrode}
    //             allQuantities={allQuantities}
    //             setAllQuantities={setAllQuantities}
    //             allSelectedValues={allSelectedValues}
    //             setAllSelectedValues={setAllSelectedValues}
    //             allTotalAmplitudes={allTotalAmplitudes}
    //             setAllTotalAmplitudes={setAllTotalAmplitudes}
    //             allTogglePositions={allTogglePositions}
    //             setAllTogglePositions={setAllTogglePositions}
    //             allPercAmpToggles={allPercAmpToggles}
    //             setAllPercAmpToggles={setAllPercAmpToggles}
    //             allVolAmpToggles={allVolAmpToggles}
    //             setAllVolAmpToggles={setAllVolAmpToggles}
    //             importCount={importCount}
    //             setImportCount={setImportCount}
    //             importDataTest={importData}
    //             setImportDataTest={setImportData}
    //             masterImportData={masterImportData}
    //             setMasterImportData={setMasterImportData}
    //             matImportFile={matImportFile}
    //             setMatImportFile={setMatImportFile}
    //             newImportFiles={newImportFiles}
    //             setNewImportFiles={setNewImportFiles}
    //             filePath={filePath}
    //             setFilePath={setFilePath}
    //             stimChanged={stimChanged}
    //             setStimChanged={setStimChanged}           />
    //           <Link to="/tabbed-selection">
    //             <button className="button">Next</button>
    //           </Link>
    //         </div>
    //       }
    //     />
    //     <Route
    //       path="/tabbed-selection"
    //       element={
    //         <TabbedElectrodeIPGSelectionTest
    //           selectedElectrodeLeft={leftElectrode}
    //           selectedElectrodeRight={rightElectrode}
    //           IPG={IPG}
    //           // key={key}
    //           // setKey={setKey}
    //           allQuantities={allQuantities}
    //           setAllQuantities={setAllQuantities}
    //           allSelectedValues={allSelectedValues}
    //           setAllSelectedValues={setAllSelectedValues}
    //           allTotalAmplitudes={allTotalAmplitudes}
    //           setAllTotalAmplitudes={setAllTotalAmplitudes}
    //           allStimulationParameters={allStimulationParameters}
    //           setAllStimulationParameters={setAllStimulationParameters}
    //           visModel={visModel}
    //           setVisModel={setVisModel}
    //           sessionTitle={sessionTitle}
    //           setSessionTitle={setSessionTitle}
    //           allTogglePositions={allTogglePositions}
    //           setAllTogglePositions={setAllTogglePositions}
    //           allPercAmpToggles={allPercAmpToggles}
    //           setAllPercAmpToggles={setAllPercAmpToggles}
    //           allVolAmpToggles={allVolAmpToggles}
    //           setAllVolAmpToggles={setAllVolAmpToggles}
    //           filePath={filePath}
    //           setFilePath={setFilePath}
    //           matImportFile={matImportFile}
    //           stimChanged={stimChanged}
    //           setStimChanged={setStimChanged}
    //         />
    //       }
    //     />
    //     <Route
    //       path="end-session"
    //       element={
    //         <ExportData
    //           allQuantities={allQuantities}
    //           allSelectedValues={allSelectedValues}
    //         />
    //       }
    //     />
    //   </Routes>
    // </Router>
    <div>
      <div className="Navbar">
        <Navbar />
        {/* <div>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <button onClick={resetZoom}>Reset Zoom</button>
    </div> */}
        {/* <img src="./logo512Padding-300x212.png" alt="leadDBS" /> */}
        <Slider
          value={zoomLevel}
          onChange={handleZoomChange}
          aria-label="Zoom Level"
          // valueLabelDisplay="auto"
          step={1}
          marks
          min={-3}
          max={3}
          sx={{
            '& .MuiSlider-mark': {
              backgroundColor: 'black', // Change the color of the marks
              height: '10px', // Adjust the height of the marks
              width: '2px', // Adjust the width of the marks
            },
            // '& .MuiSlider-rail': {
            //   backgroundColor: 'grey', // Change the color of the rail
            // },
          }}
        />
      </div>
      {/* {showDropdown && (
        <StimulationSettings
          IPG={IPG}
          setIPG={setIPG}
          leftElectrode={leftElectrode}
          setLeftElectrode={setLeftElectrode}
          rightElectrode={rightElectrode}
          setRightElectrode={setRightElectrode}
          allQuantities={allQuantities}
          setAllQuantities={setAllQuantities}
          allSelectedValues={allSelectedValues}
          setAllSelectedValues={setAllSelectedValues}
          allTotalAmplitudes={allTotalAmplitudes}
          setAllTotalAmplitudes={setAllTotalAmplitudes}
          allTogglePositions={allTogglePositions}
          setAllTogglePositions={setAllTogglePositions}
          allPercAmpToggles={allPercAmpToggles}
          setAllPercAmpToggles={setAllPercAmpToggles}
          allVolAmpToggles={allVolAmpToggles}
          setAllVolAmpToggles={setAllVolAmpToggles}
          importCount={importCount}
          setImportCount={setImportCount}
          importDataTest={importData}
          setImportDataTest={setImportData}
          masterImportData={masterImportData}
          setMasterImportData={setMasterImportData}
          matImportFile={matImportFile}
          setMatImportFile={setMatImportFile}
          newImportFiles={newImportFiles}
          setNewImportFiles={setNewImportFiles}
          filePath={filePath}
          setFilePath={setFilePath}
          stimChanged={stimChanged}
          setStimChanged={setStimChanged} allStimulationParameters={undefined} setAllStimulationParameters={undefined} visModel={undefined} setVisModel={undefined} sessionTitle={undefined} setSessionTitle={undefined}        />
      )} */}
      {/* <Dropdown style={{ marginLeft: 100 }}>
    <Dropdown.Toggle variant="secondary" id="dropdown-button-dark-example1">
      Stimulation Settings
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <StimulationSettings
        IPG={IPG}
        setIPG={setIPG}
        leftElectrode={leftElectrode}
        setLeftElectrode={setLeftElectrode}
        rightElectrode={rightElectrode}
        setRightElectrode={setRightElectrode}
        allQuantities={allQuantities}
        setAllQuantities={setAllQuantities}
        allSelectedValues={allSelectedValues}
        setAllSelectedValues={setAllSelectedValues}
        allTotalAmplitudes={allTotalAmplitudes}
        setAllTotalAmplitudes={setAllTotalAmplitudes}
        allTogglePositions={allTogglePositions}
        setAllTogglePositions={setAllTogglePositions}
        allPercAmpToggles={allPercAmpToggles}
        setAllPercAmpToggles={setAllPercAmpToggles}
        allVolAmpToggles={allVolAmpToggles}
        setAllVolAmpToggles={setAllVolAmpToggles}
        importCount={importCount}
        setImportCount={setImportCount}
        importDataTest={importData}
        setImportDataTest={setImportData}
        masterImportData={masterImportData}
        setMasterImportData={setMasterImportData}
        matImportFile={matImportFile}
        setMatImportFile={setMatImportFile}
        newImportFiles={newImportFiles}
        setNewImportFiles={setNewImportFiles}
        filePath={filePath}
        setFilePath={setFilePath}
        stimChanged={stimChanged}
        setStimChanged={setStimChanged}
      />
    </Dropdown.Menu>
  </Dropdown> */}
      <StimulationSettings
        IPG={IPG}
        setIPG={setIPG}
        leftElectrode={leftElectrode}
        setLeftElectrode={setLeftElectrode}
        rightElectrode={rightElectrode}
        setRightElectrode={setRightElectrode}
        allQuantities={allQuantities}
        setAllQuantities={setAllQuantities}
        allSelectedValues={allSelectedValues}
        setAllSelectedValues={setAllSelectedValues}
        allTotalAmplitudes={allTotalAmplitudes}
        setAllTotalAmplitudes={setAllTotalAmplitudes}
        allTogglePositions={allTogglePositions}
        setAllTogglePositions={setAllTogglePositions}
        allPercAmpToggles={allPercAmpToggles}
        setAllPercAmpToggles={setAllPercAmpToggles}
        allVolAmpToggles={allVolAmpToggles}
        setAllVolAmpToggles={setAllVolAmpToggles}
        importCount={importCount}
        setImportCount={setImportCount}
        importDataTest={importData}
        setImportDataTest={setImportData}
        masterImportData={masterImportData}
        setMasterImportData={setMasterImportData}
        matImportFile={matImportFile}
        setMatImportFile={setMatImportFile}
        newImportFiles={newImportFiles}
        setNewImportFiles={setNewImportFiles}
        filePath={filePath}
        setFilePath={setFilePath}
        stimChanged={stimChanged}
        setStimChanged={setStimChanged}
        allStimulationParameters={allStimulationParameters}
        setAllStimulationParameters={setAllStimulationParameters}
        visModel={visModel}
        setVisModel={setVisModel}
        sessionTitle={sessionTitle}
        setSessionTitle={setSessionTitle}
      />
      {/* {leftElectrode && (
        <TabbedElectrodeIPGSelectionTest
          selectedElectrodeLeft={leftElectrode}
          selectedElectrodeRight={rightElectrode}
          IPG={IPG}
          // key={key}
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
        />
      )} */}
    </div>
  );
}

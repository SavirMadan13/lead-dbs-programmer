// import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import './TabbedElectrodeIPGSelection.css';
// import BostonCartesia from './electrode_models/BostonCartesia';
// import Medtronic3389 from './electrode_models/Medtronic3389';
// import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';

// function TabbedElectrodeIPGSelectionTest() {
//   const testElectrodeRef = React.createRef();
//   const [selectedElectrode, setSelectedElectrode] = useState('');
//   const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
//   const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
//   // const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
//   // const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
//   const [hemisphereData, setHemisphereData] = useState({
//     left: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//     right: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//   });

//   // const handleElectrodeChange = (event) => {
//   //   setSelectedElectrode(event.target.value);
//   // };

//   const [key, setKey] = useState('1');

//   const handleChange = () => {
//     setKey(Tabs.key);
//   };

//   console.log(key);

//   const handleElectrodeChange = (event, hemisphere) => {
//     if (hemisphere === 'left') {
//       setSelectedElectrodeLeft(event.target.value);
//     } else if (hemisphere === 'right') {
//       setSelectedElectrodeRight(event.target.value);
//     }
//   };

//   const handleUnitChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].unit = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   const handleValueChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].value = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   const testElectrodeOptions = {
//     BostonCartesia: <BostonCartesia ref={testElectrodeRef} key={key} />,
//     Medtronic3389: <Medtronic3389 ref={testElectrodeRef} />,
//     BostonCartesiaTest: <BostonCartesiaTest ref={testElectrodeRef} />,
//   };

//   // Inside the TabbedElectrodeIPGSelection component
//   const gatherExportedData = () => {
//     const data = [];

//     for (const hemisphere in hemisphereData) {
//       const sourcesData = [];
//       for (let i = 0; i < hemisphereData[hemisphere].length; i++) {
//         // Use the ref to call the getCartesiaData function
//         const sourceData = testElectrodeRef.current.getCartesiaData();
//         sourcesData.push(sourceData);
//       }

//       data.push({
//         hemisphere: hemisphere,
//         sources: sourcesData,
//       });
//     }

//     // Create a JSON representation of the data
//     const jsonData = JSON.stringify(data, null, 2);

//     // Create a Blob from the JSON data
//     const blob = new Blob([jsonData], { type: 'application/json' });

//     // Create a download link and trigger the download
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'exportedData.json';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <Tabs>
//         <TabList>
//           <Tab>Left Hemisphere</Tab>
//           <Tab>Right Hemisphere</Tab>
//         </TabList>

//         <select
//           value={selectedElectrodeLeft}
//           onChange={(e) => handleElectrodeChange(e, 'left')}
//         >
//           <option value="">Choose Left Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//           <option value="BostonCartesiaTest">Boston Cartesia Test</option>
//         </select>

//         <select
//           value={selectedElectrodeRight}
//           onChange={(e) => handleElectrodeChange(e, 'right')}
//         >
//           <option value="">Choose Right Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//         </select>

//         <TabPanel>
//           <Tabs onClick={handleChange}>
//             <TabList>
//               <Tab key="1">Source 1</Tab>
//               <Tab key="2">Source 2</Tab>
//               <Tab key="3">Source 3</Tab>
//               <Tab key="4">Source 4</Tab>
//             </TabList>
//             {hemisphereData.left.map((tabState, index) => (
//               <TabPanel key={index}>
//                 <h2>Unit:</h2>
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'left')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>

//                 <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'left')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeLeft]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>

//         <TabPanel>
//           <Tabs>
//             <TabList>
//               <Tab key="5">Source 1</Tab>
//               <Tab key="6">Source 2</Tab>
//               <Tab key="7">Source 3</Tab>
//               <Tab key="8">Source 4</Tab>
//             </TabList>
//             {hemisphereData.right.map((tabState, index) => (
//               <TabPanel key={index}>
//                 <h2>Unit:</h2>
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'right')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>

//                 <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'right')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeRight]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>
//       </Tabs>
//       <div className="button-container">
//         <button className="export-button" onClick={gatherExportedData}>
//           Export Data as JSON
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TabbedElectrodeIPGSelectionTest;

// import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import './TabbedElectrodeIPGSelection.css';
// import BostonCartesia from './electrode_models/BostonCartesia';
// import Medtronic3389 from './electrode_models/Medtronic3389';
// import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';

// function TabbedElectrodeIPGSelection() {
//   const testElectrodeRef = React.createRef();
//   const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
//   const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
//   const [hemisphereData, setHemisphereData] = useState({
//     left: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//     right: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//   });

//   const [selectedTabLeft, setSelectedTabLeft] = useState(0);
//   const [selectedTabRight, setSelectedTabRight] = useState(0);

//   const [key, setKey] = useState('1');
//   const [allQuantities, setAllQuantities] = useState({});
//   const [allSelectedValues, setAllSelectedValues] = useState({});

//   const handleTabChange = (k) => {
//     const updatedAllQuantities = {
//       ...allSelectedValues,
//       [key]: testElectrodeRef.current.getStateQuantities(),
//     };
//     setAllQuantities(updatedAllQuantities);
//     const updatedAllSelectedValues = {
//       ...allSelectedValues,
//       [key]: testElectrodeRef.current.getStateSelectedValues(),
//     };
//     setAllSelectedValues(updatedAllSelectedValues);
//     setKey(k);
//   };

//   const handleElectrodeChange = (event, hemisphere) => {
//     if (hemisphere === 'left') {
//       setSelectedElectrodeLeft(event.target.value);
//     } else if (hemisphere === 'right') {
//       setSelectedElectrodeRight(event.target.value);
//     }
//   };

//   const handleUnitChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].unit = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   const handleValueChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].value = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   const testElectrodeOptions = {
//     BostonCartesia: <BostonCartesia ref={testElectrodeRef} />,
//     Medtronic3389: <Medtronic3389 ref={testElectrodeRef} />,
//     BostonCartesiaTest: (
//       <BostonCartesiaTest
//         ref={testElectrodeRef}
//         key={key}
//         name={key}
//         quantities={allQuantities[key]}
//         selectedValues={allSelectedValues[key]}
//       />
//     ),
//   };

//   const gatherExportedData = () => {
//     const data = [];

//     for (const hemisphere in hemisphereData) {
//       const sourcesData = [];
//       for (let i = 0; i < hemisphereData[hemisphere].length; i++) {
//         // Use the ref to call the getCartesiaData function
//         const sourceData = testElectrodeRef.current.getCartesiaData();
//         sourcesData.push(sourceData);
//       }

//       data.push({
//         hemisphere: hemisphere,
//         sources: sourcesData,
//       });
//     }

//     // Create a JSON representation of the data
//     const jsonData = JSON.stringify(data, null, 2);

//     // Create a Blob from the JSON data
//     const blob = new Blob([jsonData], { type: 'application/json' });

//     // Create a download link and trigger the download
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'exportedData.json';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <Tabs>
//         <TabList>
//           <Tab>Left Hemisphere</Tab>
//           <Tab>Right Hemisphere</Tab>
//         </TabList>

//         <select
//           value={selectedElectrodeLeft}
//           onChange={(e) => handleElectrodeChange(e, 'left')}
//         >
//           {/* Options for left hemisphere electrodes */}
//           <option value="">Choose Left Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//           <option value="BostonCartesiaTest">Boston Cartesia Test</option>
//         </select>

//         <select
//           value={selectedElectrodeRight}
//           onChange={(e) => handleElectrodeChange(e, 'right')}
//         >
//           {/* Options for right hemisphere electrodes */}
//           <option value="">Choose Left Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//           <option value="BostonCartesiaTest">Boston Cartesia Test</option>
//         </select>

//         <TabPanel>
//           <Tabs
//             selectedIndex={selectedTabLeft}
//             onSelect={(index) => setSelectedTabLeft(index)}
//           >
//             {/* Left hemisphere tabs and content */}
//             <TabList>
//               <Tab key="1" onClick={() => handleTabChange('1')}>
//                 Source 1
//               </Tab>
//               <Tab key="2" onClick={() => handleTabChange('2')}>
//                 Source 2
//               </Tab>
//               <Tab key="3" onClick={() => handleTabChange('3')}>
//                 Source 3
//               </Tab>
//               <Tab key="4" onClick={() => handleTabChange('4')}>
//                 Source 4
//               </Tab>
//             </TabList>
//             {hemisphereData.left.map((tabState, index) => (
//               <TabPanel key={index}>
//                 <h2>Unit:</h2>
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'left')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>

//                 <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'left')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeLeft]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>

//         <TabPanel>
//           <Tabs
//             selectedIndex={selectedTabRight}
//             onSelect={(index) => setSelectedTabRight(index)}
//           >
//             {/* Right hemisphere tabs and content */}
//             <TabList>
//               <Tab key="5" onClick={() => handleTabChange('5')}>
//                 Source 1
//               </Tab>
//               <Tab key="6" onClick={() => handleTabChange('6')}>
//                 Source 2
//               </Tab>
//               <Tab key="7" onClick={() => handleTabChange('7')}>
//                 Source 3
//               </Tab>
//               <Tab key="8" onClick={() => handleTabChange('8')}>
//                 Source 4
//               </Tab>
//             </TabList>
//             {hemisphereData.right.map((tabState, index) => (
//               <TabPanel key={index}>
//                 <h2>Unit:</h2>
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'right')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>

//                 <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'right')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeRight]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>
//       </Tabs>
//       {/* Export button and other components */}
//       <div className="button-container">
//         <button className="export-button" onClick={gatherExportedData}>
//           Export Data as JSON
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TabbedElectrodeIPGSelection;

///////// Below This Works /////////////

// import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import './TabbedElectrodeIPGSelection.css';
// import BostonCartesia from './electrode_models/BostonCartesia';
// import Medtronic3389 from './electrode_models/Medtronic3389';
// import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';
// import NewBostonCartesiaTest from './electrode_models/NewBostonCartesiaTest';
// import AbbottDirectedTest from './electrode_models/AbbottDirectedTest';

// function TabbedElectrodeIPGSelection() {
//   const testElectrodeRef = React.createRef();
//   const [selectedElectrode, setSelectedElectrode] = useState('');
//   const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
//   const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
//   // const [pulseWidth, setPulseWidth] = useState(60);
//   // const [rate, setRate] = useState(130);
//   // const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
//   // const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
//   const [hemisphereData, setHemisphereData] = useState({
//     left: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//     right: [
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//       { unit: 'V', value: '' },
//     ],
//   });

//   // const handleElectrodeChange = (event) => {
//   //   setSelectedElectrode(event.target.value);
//   // };

//   const [key, setKey] = useState('1');

//   const [allQuantities, setAllQuantities] = useState({});
//   const [allSelectedValues, setAllSelectedValues] = useState({});

//   // const handleChange = () => {
//   //   console.log("key="+key + ","+ Tabs.key);
//   //   setKey(Tabs.key);
//   // };

//   const handleTabChange = (k) => {
//     // console.log("new key=" + k + ", old key="+key + ","+ JSON.stringify(testElectrodeRef.current.getCartesiaData()));
//     // console.log("new key=" + k + ", old key="+key + ", old data="+ JSON.stringify(testElectrodeRef.current.getStateQuantities()));
//     // localStorage.setItem(key, testElectrodeRef.current.getStateData());
//     // setAllQuantities({key: testElectrodeRef.current.getStateData()});

//     const updatedAllQuantities = {
//       ...allQuantities,
//       [key]: testElectrodeRef.current.getStateQuantities(),
//     };
//     setAllQuantities(updatedAllQuantities);
//     const updatedAllSelectedValues = {
//       ...allSelectedValues,
//       [key]: testElectrodeRef.current.getStateSelectedValues(),
//     };
//     setAllSelectedValues(updatedAllSelectedValues);

//     // setAllQuantities[key] = testElectrodeRef.current.getStateData();
//     // console.log("ls=" + JSON.stringify(localStorage.getItem(key)));
//     // console.log("old saved data=" + JSON.stringify(updatedAllQuantities));
//     setKey(k);
//     // if (localStorage.getItem(k) !== null) {
//     // if (allQuantities[k] !== null) {
//     //   // testElectrodeRef.current.getStateKey(localStorage.getItem(k));
//     //   testElectrodeRef.current.getStateKey(allQuantities[k], allSelectedValues[k]);
//     // }
//   };

//   // const handleTabChange = (k) => {
//   //   //localStorage.clear();
//   //   localStorage.setItem(key, JSON.stringify(testElectrodeRef.current.getStateQuantities()));
//   //   setKey(k);
//   // };

//   const handleElectrodeChange = (event, hemisphere) => {
//     if (hemisphere === 'left') {
//       setSelectedElectrodeLeft(event.target.value);
//     } else if (hemisphere === 'right') {
//       setSelectedElectrodeRight(event.target.value);
//     }
//   };

//   const handleUnitChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].unit = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   const handleValueChange = (e, index, hemisphere) => {
//     const newHemisphereData = { ...hemisphereData };
//     newHemisphereData[hemisphere][index].value = e.target.value;
//     setHemisphereData(newHemisphereData);
//   };

//   console.log('tab key=', key);

//   const testElectrodeOptions = {
//     BostonCartesia: (
//       <BostonCartesia
//         ref={testElectrodeRef}
//         key={key}
//         name={key}
//         quantities={allQuantities[key]}
//         selectedValues={allSelectedValues[key]}
//       />
//     ),
//     Medtronic3389: <Medtronic3389 ref={testElectrodeRef} />,
//     BostonCartesiaTest: (
//       <BostonCartesiaTest
//         ref={testElectrodeRef}
//         key={key}
//         name={key}
//         quantities={allQuantities[key]}
//         selectedValues={allSelectedValues[key]}
//       />
//     ),
//     NewBostonCartesiaTest: (
//       <NewBostonCartesiaTest
//         ref={testElectrodeRef}
//         key={key}
//         name={key}
//         quantities={allQuantities[key]}
//         selectedValues={allSelectedValues[key]}
//       />
//     ),
//     AbbottDirectedTest: (
//       <AbbottDirectedTest
//         ref={testElectrodeRef}
//         key={key}
//         name={key}
//         quantities={allQuantities[key]}
//         selectedValues={allSelectedValues[key]}
//       />
//     ),
//     // NewBostonCartesiaTest: (
//     //   <NewBostonCartesiaTest
//     //     ref={testElectrodeRef}
//     //     key={key}
//     //     name={key}
//     //     quantities={allQuantities[key]}
//     //     selectedValues={allSelectedValues[key]}
//     //   />
//     // ),
//   };

//   // Inside the TabbedElectrodeIPGSelection component
//   const gatherExportedData = () => {
//     const data = [];

//     for (const hemisphere in hemisphereData) {
//       const sourcesData = [];
//       for (let i = 0; i < hemisphereData[hemisphere].length; i++) {
//         // Use the ref to call the getCartesiaData function
//         const sourceData = testElectrodeRef.current.getCartesiaData();
//         sourcesData.push(sourceData);
//       }

//       data.push({
//         hemisphere: hemisphere,
//         sources: sourcesData,
//       });
//     }

//     // Create a JSON representation of the data
//     const jsonData = JSON.stringify(data, null, 2);

//     // Create a Blob from the JSON data
//     const blob = new Blob([jsonData], { type: 'application/json' });

//     // Create a download link and trigger the download
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'exportedData.json';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <Tabs>
//         <TabList>
//           <Tab>Left Hemisphere</Tab>
//           <Tab>Right Hemisphere</Tab>
//         </TabList>

//         <select
//           value={selectedElectrodeLeft}
//           onChange={(e) => handleElectrodeChange(e, 'left')}
//         >
//           <option value="">Choose Left Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//           <option value="BostonCartesiaTest">Boston Cartesia Test</option>
//           <option value="NewBostonCartesiaTest">New Boston Cartesia Test</option>
//           <option value="AbbottDirectedTest">Abbott Directed</option>
//         </select>

//         <select
//           value={selectedElectrodeRight}
//           onChange={(e) => handleElectrodeChange(e, 'right')}
//         >
//           <option value="">Choose Right Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//           <option value="BostonCartesiaTest">Boston Cartesia Test</option>
//         </select>

//         <TabPanel>
//           <Tabs>
//             {/* <Tabs onClick={handleChange}> */}
//             <TabList>
//               <Tab key="1" onClick={() => handleTabChange('1')}>
//                 Source 1
//               </Tab>
//               <Tab key="2" onClick={() => handleTabChange('2')}>
//                 Source 2
//               </Tab>
//               <Tab key="3" onClick={() => handleTabChange('3')}>
//                 Source 3
//               </Tab>
//               <Tab key="4" onClick={() => handleTabChange('4')}>
//                 Source 4
//               </Tab>
//             </TabList>
//             {hemisphereData.left.map((tabState, index) => (
//               <TabPanel key={index}>
//                 <h2>Unit:</h2>
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'left')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>

//                 <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'left')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 {/* <h2>Value:</h2>
//                 <input
//                   type="text"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'left')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 /> */}
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeLeft]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>

//         <TabPanel>
//           <Tabs>
//             <TabList>
//               <Tab key="5" onClick={() => handleTabChange('5')}>
//                 Source 1
//               </Tab>
//               <Tab key="6" onClick={() => handleTabChange('6')}>
//                 Source 2
//               </Tab>
//               <Tab key="7" onClick={() => handleTabChange('7')}>
//                 Source 3
//               </Tab>
//               <Tab key="8" onClick={() => handleTabChange('8')}>
//                 Source 4
//               </Tab>
//             </TabList>
//             {hemisphereData.right.map((tabState, index) => (
//               <TabPanel key={index} className="compact-tab-panel">
//                 {/* <div className = "compact-input-container"> */}
//                 {/* <h2>Unit:</h2> */}
//                 <select
//                   value={tabState.unit}
//                   onChange={(e) => handleUnitChange(e, index, 'right')}
//                 >
//                   <option value="V">V</option>
//                   <option value="mA">mA</option>
//                 </select>
//                 {/* </div> */}
//                 {/* <div className="compact-input-container"> */}
//                 {/* <h2>Value:</h2> */}
//                 <input
//                   // type="text"
//                   type="number"
//                   pattern="[0-9]+"
//                   value={tabState.value}
//                   onChange={(e) => handleValueChange(e, index, 'right')}
//                   placeholder={`Enter value in ${tabState.unit}`}
//                 />
//                 {/* </div> */}
//                 <div className="form-container">
//                   {testElectrodeOptions[selectedElectrodeRight]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>
//       </Tabs>
//       <div className="button-container">
//         <button className="export-button" onClick={gatherExportedData}>
//           Export Data
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TabbedElectrodeIPGSelection;

////////////////////////////////

import React, { useState, useRef, useEffect } from 'react';
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
    console.log(allQuantities);

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

  // Inside the TabbedElectrodeIPGSelection component
  const gatherExportedData = () => {
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
      if (thing !== 0) {
        if (valuesArray[thing] === 'left') {
          activeContactsArray.push(0);
        } else {
          activeContactsArray.push(1);
        }
      }
    });
    return activeContactsArray;
  };

  // const gatherExportedData2 = () => {
  //   const data = {
  //     S: {
  //       label: '',
  //       Rs1: {},
  //       Rs2: {},
  //       Rs3: {},
  //       Rs4: {},
  //       Ls1: {},
  //       Ls2: {},
  //       Ls3: {},
  //       Ls4: {},
  //       activecontacts: {},
  //     },
  //   };

  //   data.S.label = 'Num1';
  //   // Object.keys(allSelectedValues).forEach((key1) => {
  //   // });

  //   for (let j = 1; j < 5; j++) {
  //     let dynamicKey2 = 'Ls' + j;
  //     for (let i = 1; i < 9; i++) {
  //       let polarity = 0;
  //       if (allSelectedValues[j][i] === 'left') {
  //         polarity = 0;
  //       } else if (allSelectedValues[j][i] === 'center') {
  //         polarity = 1;
  //       } else if (allSelectedValues[j][i] === 'right') {
  //         polarity = 2;
  //       }
  //       // data.S.Rs1['k' + (i - 1)] = parseFloat(allQuantities[1][i]);
  //       // data.S.Rs1[['k' + (i - 1)]]['perc'] = parseFloat(allQuantities[1][i]);
  //       // data.S.Rs1[['k' + (i - 1)]]['pol'] = pol;
  //       // data.S.Rs1[['k' + (i - 1)]]['imp'] = 1;
  //       let dynamicKey = 'k' + (i - 1);
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
  //   }

  //   for (let j = 1; j < 5; j++) {
  //     let dynamicKey2 = 'Rs' + j;
  //     for (let i = 1; i < 9; i++) {
  //       let polarity = 0;
  //       if (allSelectedValues[j + 4][i] === 'left') {
  //         polarity = 0;
  //       } else if (allSelectedValues[j + 4][i] === 'center') {
  //         polarity = 1;
  //       } else if (allSelectedValues[j + 4][i] === 'right') {
  //         polarity = 2;
  //       }
  //       // data.S.Rs1['k' + (i - 1)] = parseFloat(allQuantities[1][i]);
  //       // data.S.Rs1[['k' + (i - 1)]]['perc'] = parseFloat(allQuantities[1][i]);
  //       // data.S.Rs1[['k' + (i - 1)]]['pol'] = pol;
  //       // data.S.Rs1[['k' + (i - 1)]]['imp'] = 1;
  //       let dynamicKey = 'k' + (i - 1);
  //       data.S[dynamicKey2][dynamicKey] = {
  //         perc: parseFloat(allQuantities[j + 4][i]),
  //         pol: polarity,
  //         imp: 1,
  //       };
  //     }
  //     data.S[dynamicKey2].case = {
  //       perc: parseFloat(allQuantities[j + 4][0]),
  //       pol: translatePolarity(allSelectedValues[j + 4][0]),
  //     };
  //   }

  //   data.S.activecontacts = activeContacts(allSelectedValues[1]);

  //   const jsonData = JSON.stringify(data, null, 2);

  //   // Create a Blob from the JSON data
  //   const blob = new Blob([jsonData], { type: 'application/json' });

  //   // Create a download link and trigger the download
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'exportedData.json';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  const gatherExportedData2 = () => {
    const data = {
      S: {
        label: '',
        Rs1: {},
        Rs2: {},
        Rs3: {},
        Rs4: {},
        Ls1: {},
        Ls2: {},
        Ls3: {},
        Ls4: {},
        activecontacts: {},
      },
    };

    data.S.label = 'Num1';

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
          let dynamicKey = `k${i - 1}`;
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
      }
    }

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
      }
    }

    data.S.activecontacts = activeContacts(allSelectedValues[1]);

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exportedData.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const [importedData, setImportedData] = useState(null);

  // const gatherImportedData = (jsonData) => {
  //   let newQuantities = {};
  //   let newSelectedValues = {};

  //   for (let j = 1; j < 9; j++) {
  //     let dynamicKey2 = `Ls${j}`;
  //     let quantities = [];
  //     for (let i = 0; i < 9; i++) {
  //       let dynamicKey = `k${i}`;
  //       quantities.push(jsonData.S[dynamicKey2][dynamicKey].perc);
  //     }
  //     newQuantities[dynamicKey2] = quantities;
  //   }

  //   for (let j = 1; j < 5; j++) {
  //     let dynamicKey2 = `Rs${j}`;
  //     let quantities = [];
  //     for (let i = 0; i < 9; i++) {
  //       let dynamicKey = `k${i}`;
  //       quantities.push(jsonData.S[dynamicKey2][dynamicKey].perc);
  //     }
  //     newQuantities[dynamicKey2] = quantities;
  //   }

  //   for (let j = 1; j < 9; j++) {
  //     let dynamicKey2 = `Ls${j}`;
  //     let selectedValues = [];
  //     for (let i = 0; i < 9; i++) {
  //       let dynamicKey = `k${i}`;
  //       let polarity = jsonData.S[dynamicKey2][dynamicKey].pol;
  //       let value = '';
  //       if (polarity === 0) {
  //         value = 'left';
  //       } else if (polarity === 1) {
  //         value = 'center';
  //       } else if (polarity === 2) {
  //         value = 'right';
  //       }
  //       selectedValues.push(value);
  //     }
  //     newSelectedValues[dynamicKey2] = selectedValues;
  //   }

  //   for (let j = 1; j < 5; j++) {
  //     let dynamicKey2 = `Rs${j}`;
  //     let selectedValues = [];
  //     for (let i = 0; i < 9; i++) {
  //       let dynamicKey = `k${i}`;
  //       let polarity = jsonData.S[dynamicKey2][dynamicKey].pol;
  //       let value = '';
  //       if (polarity === 0) {
  //         value = 'left';
  //       } else if (polarity === 1) {
  //         value = 'center';
  //       } else if (polarity === 2) {
  //         value = 'right';
  //       }
  //       selectedValues.push(value);
  //     }
  //     newSelectedValues[dynamicKey2] = selectedValues;
  //   }

  //   setAllQuantities(newQuantities);
  //   setAllSelectedValues(newSelectedValues);
  //   console.log('new quantities: ', newQuantities);
  //   console.log('selected values: ', newSelectedValues);
  // };

  const gatherImportedData = (jsonData) => {
    let newQuantities = {};
    let newSelectedValues = {};

    for (let j = 1; j < 9; j++) {
      let dynamicKey2 = `Ls${j}`;
      let quantities = [];
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i}`;
        let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        if (nestedData && nestedData.perc !== undefined) {
          quantities.push(nestedData.perc);
        } else {
          // Handle the case where 'perc' is undefined
          quantities.push(/* default value or handle accordingly */);
        }
      }
      newQuantities[dynamicKey2] = quantities;
    }

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      let quantities = [];
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i}`;
        let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        if (nestedData && nestedData.perc !== undefined) {
          quantities.push(nestedData.perc);
        } else {
          // Handle the case where 'perc' is undefined
          quantities.push(/* default value or handle accordingly */);
        }
      }
      newQuantities[dynamicKey2] = quantities;
    }

    for (let j = 1; j < 9; j++) {
      let dynamicKey2 = `Ls${j}`;
      let selectedValues = [];
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i}`;
        let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        if (nestedData && nestedData.pol !== undefined) {
          let polarity = nestedData.pol;
          let value = '';
          if (polarity === 0) {
            value = 'left';
          } else if (polarity === 1) {
            value = 'center';
          } else if (polarity === 2) {
            value = 'right';
          }
          selectedValues.push(value);
        } else {
          // Handle the case where 'pol' is undefined
          selectedValues.push(/* default value or handle accordingly */);
        }
      }
      newSelectedValues[dynamicKey2] = selectedValues;
    }

    for (let j = 1; j < 5; j++) {
      let dynamicKey2 = `Rs${j}`;
      let selectedValues = [];
      for (let i = 0; i < 9; i++) {
        let dynamicKey = `k${i}`;
        let nestedData = jsonData.S[dynamicKey2][dynamicKey];
        if (nestedData && nestedData.pol !== undefined) {
          let polarity = nestedData.pol;
          let value = '';
          if (polarity === 0) {
            value = 'left';
          } else if (polarity === 1) {
            value = 'center';
          } else if (polarity === 2) {
            value = 'right';
          }
          selectedValues.push(value);
        } else {
          // Handle the case where 'pol' is undefined
          selectedValues.push(/* default value or handle accordingly */);
        }
      }
      newSelectedValues[dynamicKey2] = selectedValues;
    }

    setAllQuantities(newQuantities);
    setAllSelectedValues(newSelectedValues);
    console.log('new quantities: ', newQuantities);
    console.log('selected values: ', newSelectedValues);
  };

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

  useEffect(() => {
    if (importedData) {
      gatherImportedData(importedData);
    }
  }, [importedData]);

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Left Hemisphere</Tab>
          <Tab>Right Hemisphere</Tab>
        </TabList>

        <TabPanel>
          <Tabs>
            {/* <Tabs onClick={handleChange}> */}
            <TabList>
              <Tab key="1" onClick={() => handleTabChange('1')}>
                Source 1
              </Tab>
              <Tab key="2" onClick={() => handleTabChange('2')}>
                Source 2
              </Tab>
              <Tab key="3" onClick={() => handleTabChange('3')}>
                Source 3
              </Tab>
              <Tab key="4" onClick={() => handleTabChange('4')}>
                Source 4
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
                Source 1
              </Tab>
              <Tab key="6" onClick={() => handleTabChange('6')}>
                Source 2
              </Tab>
              <Tab key="7" onClick={() => handleTabChange('7')}>
                Source 3
              </Tab>
              <Tab key="8" onClick={() => handleTabChange('8')}>
                Source 4
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
      <div className="button-container">
        <button
          className="import-button"
          onClick={() => fileInputRef.current.click()}
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
        <button className="export-button" onClick={gatherExportedData2}>
          Export Data
        </button>
      </div>
    </div>
  );
}

export default TabbedElectrodeIPGSelection;

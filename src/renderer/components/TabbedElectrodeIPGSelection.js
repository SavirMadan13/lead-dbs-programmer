// import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';
// import './TabbedElectrodeIPGSelection.css';
// import BostonCartesia from './electrode_models/BostonCartesia';
// import Medtronic3389 from './electrode_models/Medtronic3389';

// function TabbedElectrodeIPGSelection() {
//   const testElectrodeRef = React.createRef();
//   const [selectedElectrode, setSelectedElectrode] = useState('');
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

//   const handleElectrodeChange = (event) => {
//     setSelectedElectrode(event.target.value);
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

//         <select value={selectedElectrode} onChange={handleElectrodeChange}>
//           <option value="">Choose an Electrode</option>
//           <option value="BostonCartesia">Boston Scientific Cartesia</option>
//           <option value="Medtronic3389">Medtronic 3389</option>
//         </select>

//         <TabPanel>
//           <Tabs>
//             <TabList>
//               <Tab>Source 1</Tab>
//               <Tab>Source 2</Tab>
//               <Tab>Source 3</Tab>
//               <Tab>Source 4</Tab>
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
//                   {testElectrodeOptions[selectedElectrode]}
//                 </div>
//               </TabPanel>
//             ))}
//           </Tabs>
//         </TabPanel>

//         <TabPanel>
//           <Tabs>
//             <TabList>
//               <Tab>Source 1</Tab>
//               <Tab>Source 2</Tab>
//               <Tab>Source 3</Tab>
//               <Tab>Source 4</Tab>
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
//                   {testElectrodeOptions[selectedElectrode]}
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

// export default TabbedElectrodeIPGSelection;

////////////////////////////////// Below This Works ///////////////////////////////////

import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './TabbedElectrodeIPGSelection.css';
import BostonCartesia from './electrode_models/BostonCartesia';
import Medtronic3389 from './electrode_models/Medtronic3389';
import BostonCartesiaTest from './electrode_models/BostonCartesiaTest';
import NewBostonCartesiaTest from './NewBostonCartesiaTest';

function TabbedElectrodeIPGSelection() {
  const testElectrodeRef = React.createRef();
  const [selectedElectrode, setSelectedElectrode] = useState('');
  const [selectedElectrodeLeft, setSelectedElectrodeLeft] = useState('');
  const [selectedElectrodeRight, setSelectedElectrodeRight] = useState('');
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

  const handleChange = () => {
    setKey(Tabs.key);
  };

  console.log(key);

  const handleElectrodeChange = (event, hemisphere) => {
    if (hemisphere === 'left') {
      setSelectedElectrodeLeft(event.target.value);
    } else if (hemisphere === 'right') {
      setSelectedElectrodeRight(event.target.value);
    }
  };

  const handleUnitChange = (e, index, hemisphere) => {
    const newHemisphereData = { ...hemisphereData };
    newHemisphereData[hemisphere][index].unit = e.target.value;
    setHemisphereData(newHemisphereData);
  };

  const handleValueChange = (e, index, hemisphere) => {
    const newHemisphereData = { ...hemisphereData };
    newHemisphereData[hemisphere][index].value = e.target.value;
    setHemisphereData(newHemisphereData);
  };

  const testElectrodeOptions = {
    BostonCartesia: <BostonCartesia ref={testElectrodeRef} key={key} />,
    Medtronic3389: <Medtronic3389 ref={testElectrodeRef} />,
    BostonCartesiaTest: <BostonCartesiaTest ref={testElectrodeRef} />,
    NewBostonCartesiaTest: <NewBostonCartesiaTest ref={testElectrodeRef} />,
  };

  // Inside the TabbedElectrodeIPGSelection component
  const gatherExportedData = () => {
    const data = [];

    for (const hemisphere in hemisphereData) {
      const sourcesData = [];
      for (let i = 0; i < hemisphereData[hemisphere].length; i++) {
        // Use the ref to call the getCartesiaData function
        const sourceData = testElectrodeRef.current.getCartesiaData();
        sourcesData.push(sourceData);
      }

      data.push({
        hemisphere: hemisphere,
        sources: sourcesData,
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

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Left Hemisphere</Tab>
          <Tab>Right Hemisphere</Tab>
        </TabList>

        <select
          value={selectedElectrodeLeft}
          onChange={(e) => handleElectrodeChange(e, 'left')}
        >
          <option value="">Choose Left Electrode</option>
          <option value="BostonCartesia">Boston Scientific Cartesia</option>
          <option value="Medtronic3389">Medtronic 3389</option>
          <option value="BostonCartesiaTest">Boston Cartesia Test</option>
          <option value="NewBostonCartesiaTest">New Boston Cartesia Test</option>
        </select>

        <select
          value={selectedElectrodeRight}
          onChange={(e) => handleElectrodeChange(e, 'right')}
        >
          <option value="">Choose Right Electrode</option>
          <option value="BostonCartesia">Boston Scientific Cartesia</option>
          <option value="Medtronic3389">Medtronic 3389</option>
        </select>

        <TabPanel>
          <Tabs onClick={handleChange}>
            <TabList>
              <Tab key="1">Source 1</Tab>
              <Tab key="2">Source 2</Tab>
              <Tab key="3">Source 3</Tab>
              <Tab key="4">Source 4</Tab>
            </TabList>
            {hemisphereData.left.map((tabState, index) => (
              <TabPanel key={index}>
                <h2>Unit:</h2>
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
                />
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
              <Tab key="5">Source 1</Tab>
              <Tab key="6">Source 2</Tab>
              <Tab key="7">Source 3</Tab>
              <Tab key="8">Source 4</Tab>
            </TabList>
            {hemisphereData.right.map((tabState, index) => (
              <TabPanel key={index}>
                <h2>Unit:</h2>
                <select
                  value={tabState.unit}
                  onChange={(e) => handleUnitChange(e, index, 'right')}
                >
                  <option value="V">V</option>
                  <option value="mA">mA</option>
                </select>

                <h2>Value:</h2>
                <input
                  type="text"
                  value={tabState.value}
                  onChange={(e) => handleValueChange(e, index, 'right')}
                  placeholder={`Enter value in ${tabState.unit}`}
                />
                <div className="form-container">
                  {testElectrodeOptions[selectedElectrodeRight]}
                </div>
              </TabPanel>
            ))}
          </Tabs>
        </TabPanel>
      </Tabs>
      <div className="button-container">
        <button className="export-button" onClick={gatherExportedData}>
          Export Data as JSON
        </button>
      </div>
    </div>
  );
}

export default TabbedElectrodeIPGSelection;


////////////////////////////////// Above This Works ///////////////////////////////////

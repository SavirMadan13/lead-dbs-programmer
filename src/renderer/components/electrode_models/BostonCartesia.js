/* eslint-disable no-restricted-globals */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import TripleToggle from '../TripleToggle'; // Make sure to import TripleToggle correctly
// import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
// import './BostonCartesia.css';
// import { ReactComponent as IPG } from './images/IPG.svg';
// import { ReactComponent as Contact } from './images/Contact.svg';
// import { ReactComponent as Tail } from './images/Tail.svg';
// import { ReactComponent as RightContact } from './images/RightContact.svg';
// import { ReactComponent as LeftContact } from './images/LeftContact.svg';
// import { ReactComponent as HeadTop } from './images/head_top.svg';
// import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
// // import {
// //   IPG,
// //   Contact,
// //   Tail,
// //   RightContact,
// //   LeftContact,
// //   HeadTop,
// //   HeadBottom,
// // } from './BostonCartesiaSVG'; // Import SVG components from the new file
// import BostonElectrodeRenderer from './BostonElectrodeRenderer';

// function BostonCartesia(props, ref) {
//   const svgs = [
//     <HeadTop key="headTop" />,
//     <HeadBottom key="headBottom" />,
//     <Contact key="8" level="4" />,
//     <Contact key="5" level="3" face="center" />,
//     <Contact key="2" level="2" face="center" />,
//     <Tail key="1" level="1" />,
//   ];

//   const ipgs = [<IPG key="0" />];

//   const rightContacts = [
//     <Contact key="7" level="3" face="right" />,
//     <Contact key="4" level="2" face="right" />,
//   ];

//   const leftContacts = [
//     <Contact key="6" level="3" face="left" />,
//     <Contact key="3" level="2" face="left" />,
//   ];

//   const [calculateQuantities, setCalculateQuantities] = useState(false);

//   const handleCalculateQuantitiesButtonClick = () => {
//     setCalculateQuantities((prev) => !prev);
//   };

//   const calculateZIndex = (key) => {
//     // Define a mapping of key to z-index
//     const zIndexMap = {
//       8: 2,
//       5: 2,
//       2: 2,
//       1: 2,
//       0: 2,
//       // Add more key-to-z-index mappings as needed
//     };

//     // Return the calculated z-index or a default value
//     return zIndexMap[key] || 0;
//   };

//   const initialQuantities = {
//     plus: 0,
//     minus: 0,
//   };

//   const [selectedValues, setSelectedValues] = useState({
//     0: 'left',
//     1: 'left',
//     2: 'left',
//     3: 'left',
//     4: 'left',
//     5: 'left',
//     6: 'left',
//     7: 'left',
//     8: 'left',
//     // Initialize other images here
//   });
//   const [quantities, setQuantities] = useState({ initialQuantities });

//   // const [userQuantities, setUserQuantities] = useState({}); // Store user input quantities

//   const totalQuantity = quantities.plus + quantities.minus;

//   const [lastChangedInstance, setLastChangedInstance] = useState({
//     key: null,
//     quantity: null,
//     value: null,
//     animation: null,
//   });

//   console.log('lastChangedInstance:', lastChangedInstance); // Add this line to log the value

//   const calculateQuantitiesWithDistribution = (selectedValues) => {
//     const quantities = {
//       left: 0,
//       center: 0,
//       right: 0,
//     };

//     // Calculate the quantity increment for 'center' and 'right' values
//     // This is effectively the number of TripleToggle components that have a value of 'center'
//     const centerCount = Object.values(selectedValues).filter(
//       (value) => value === 'center',
//     ).length;
//     let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//     // THis is effectively the number of TripleToggle components that have a value of 'right'
//     const rightCount = Object.values(selectedValues).filter(
//       (value) => value === 'right',
//     ).length;
//     let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//     // This finds the difference between
//     if (lastChangedInstance.value === 'center') {
//       centerQuantityIncrement =
//         centerCount > 0
//           ? (100 - lastChangedInstance.animation) / centerCount
//           : 0;
//     } else if (lastChangedInstance.value === 'right') {
//       rightQuantityIncrement =
//         rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
//     } else if (lastChangedInstance.value === 'left') {
//       centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//       rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//     }

//     Object.keys(selectedValues).forEach((key) => {
//       const value = selectedValues[key];
//       if (key !== lastChangedInstance.key) {
//         if (value === 'left') {
//           quantities[value] = 0;
//         } else if (value === 'center') {
//           quantities[value] = centerQuantityIncrement;
//         } else if (value === 'right') {
//           quantities[value] = rightQuantityIncrement;
//         }
//       } else if (key === lastChangedInstance.key) {
//         quantities[value] = lastChangedInstance.quantity;
//       }
//     });

//     return quantities;
//   };

//   useEffect(() => {
//     // Calculate quantities based on selected values with distribution
//     const newQuantities = calculateQuantitiesWithDistribution(selectedValues);
//     setQuantities(newQuantities);
//   }, [selectedValues]);

//   const handleTripleToggleChange = (value, key) => {
//     const updatedSelectedValues = { ...selectedValues, [key]: value };
//     setSelectedValues(updatedSelectedValues);
//   };

//   const handleQuantityChange = (key, value, animation, quantity) => {
//     const updatedSelectedValues = { ...selectedValues };
//     setLastChangedInstance({ key, value, animation, quantity });
//     const newQuantities = calculateQuantitiesWithDistribution(
//       updatedSelectedValues,
//     );
//     setQuantities(newQuantities);
//   };

//   /// ///////////////////////      Exporting Data ////////////////////
//   function gatherTripleToggleData(selectedValues, quantities) {
//     const data = [];

//     // Create a mapping object for the values
//     const valueMapping = {
//       left: 'OFF',
//       center: '-',
//       right: '+',
//     };

//     // Iterate through the selectedValues object and collect the data for each instance
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         const value = selectedValues[key];
//         data.push({
//           key,
//           value: valueMapping[value] || value, // Use the mapped value or the original value
//           quantity: quantities[value],
//         });
//       }
//     }

//     return data;
//   }
//   const tripleToggleData = gatherTripleToggleData(selectedValues, quantities);

//   function exportToJsonFile(data) {
//     const json = JSON.stringify(data, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'tripleToggleData.json';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }
//   /// /////////////////////////////////////////////////////////////////////////

//   /// /////////////////////           Importing Data - doesn't really work yet ////////////////////////

//   const [importedData, setImportedData] = useState(null);

//   const reverseValueMapping = {
//     OFF: 'left',
//     '-': 'center',
//     '+': 'right',
//   };

//   function getSwitchAnimation(from, to) {
//     // Use the animation logic from TripleToggle to update the state
//     // This is a simplified version; you may need to adjust it
//     if (from === 'left' && to === 'center') {
//       // Apply animation logic here
//     } else if (from === 'center' && to === 'right') {
//       // Apply animation logic here
//     } else if (from === 'right' && to === 'center') {
//       // Apply animation logic here
//     } else if (from === 'center' && to === 'left') {
//       // Apply animation logic here
//     } else if (from === 'right' && to === 'left') {
//       // Apply animation logic here
//     } else if (from === 'left' && to === 'right') {
//       // Apply animation logic here
//     }
//   }

//   function updateDataFromJson(jsonData) {
//     console.log('Imported JSON Data:', jsonData);
//     if (Array.isArray(jsonData)) {
//       const updatedSelectedValues = { ...selectedValues };
//       const updatedQuantities = { ...quantities };

//       jsonData.forEach((item) => {
//         // const { key, value, quantity, animation } = item;
//         const { key, value, quantity } = item;
//         const originalValue = reverseValueMapping[value];
//         if (selectedValues[key] !== undefined) {
//           getSwitchAnimation(originalValue, value);
//           updatedSelectedValues[key] = originalValue;
//           // updatedQuantities[value] = quantity;
//           updatedQuantities[originalValue] = quantity;
//         }
//       });
//       setSelectedValues(updatedSelectedValues);
//       setQuantities(updatedQuantities);
//       console.log(selectedValues);
//       console.log('Quantities:', quantities);
//     }
//   }

//   // function handleFileChange(event) {
//   //   const file = event.target.files[0];
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onload = function (e) {
//   //       try {
//   //         const jsonData = JSON.parse(e.target.result);
//   //         updateDataFromJson(jsonData);
//   //       } catch (error) {
//   //         console.error('Error parsing JSON:', error);
//   //       }
//   //     };
//   //     reader.readAsText(file);
//   //   }
//   // }

//   function handleFileChange(event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         try {
//           const jsonData = JSON.parse(e.target.result);
//           setImportedData(jsonData);
//         } catch (error) {
//           console.error('Error parsing JSON:', error);
//         }
//       };
//       reader.readAsText(file);
//     }
//   }

//   useEffect(() => {
//     if (importedData) {
//       updateDataFromJson(importedData);
//     }
//   }, [importedData]);

//   const fileInputRef = useRef(null);

//   /// //////////////////////////////////////////////////////////////////////////

//   /// /////////////////////////           Export to TabbedElectrodeIPGSelection               /////////////////////////////
//   const getCartesiaData = () => {
//     const data = [];
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         data.push({
//           key,
//           value: selectedValues[key],
//           quantity: quantities[selectedValues[key]],
//         });
//       }
//     }
//     return data;
//   };

//   useImperativeHandle(ref, () => ({
//     getCartesiaData,
//   }));

//   /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

//   return (
//     <div className="container">
//       <div className="container2">
//         <div className="IPG">
//           {ipgs.map((ipg) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(ipg, {
//                   key: ipg.key,
//                   className: `${selectedValues[ipg.key]}-color`,
//                 })}
//                 {!isNaN(Number(ipg.key)) && (
//                   <div className="triple-toggle-ipg">
//                     <TripleToggle
//                       key={ipg.key}
//                       value={selectedValues[ipg.key]}
//                       quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, ipg.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           value,
//                           animation,
//                           quantity,
//                           ipg.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{ipg.key}</p> */}
//             </div>
//           ))}
//         </div>
//         <div className="left-contacts">
//           {leftContacts.map((Lcon) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(Lcon, {
//                   key: Lcon.key,
//                   className: `${selectedValues[Lcon.key]}-color`,
//                 })}
//                 {!isNaN(Number(Lcon.key)) && (
//                   <div className="triple-toggle">
//                     <TripleToggle
//                       key={Lcon.key}
//                       value={selectedValues[Lcon.key]}
//                       quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, Lcon.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           value,
//                           animation,
//                           quantity,
//                           Lcon.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{Lcon.key}</p> */}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="Elmodel-center">
//         {svgs.map((svg) => (
//           <div
//             className="image-item"
//             style={{ zIndex: calculateZIndex(svg.key) }}
//           >
//             <div className="image-container">
//               {React.cloneElement(svg, {
//                 key: svg.key,
//                 className: `${selectedValues[svg.key]}-color`,
//               })}
//               {!isNaN(Number(svg.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={svg.key}
//                     value={selectedValues[svg.key]}
//                     quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, svg.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, svg.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{svg.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="right-contacts">
//         {rightContacts.map((rCon) => (
//           <div className="image-item">
//             <div className="image-container">
//               {React.cloneElement(rCon, {
//                 key: rCon.key,
//                 className: `${selectedValues[rCon.key]}-color`,
//               })}
//               {!isNaN(Number(rCon.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={rCon.key}
//                     value={selectedValues[rCon.key]}
//                     quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, rCon.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, rCon.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{rCon.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="button-container">
//         <button
//           className="import-button"
//           onClick={() => fileInputRef.current.click()}
//         >
//           Import from LeadDBS
//         </button>
//         <button
//           className="export-button"
//           onClick={() => exportToJsonFile(tripleToggleData)}
//         >
//           Export to LeadDBS
//         </button>
//         <input
//           ref={fileInputRef}
//           className="file-input"
//           type="file"
//           accept=".json"
//           onChange={handleFileChange}
//           style={{ display: 'none' }} // Hide the input element
//         />
//         {/* <button
//           className={calculateQuantities ? 'active-button' : 'inactive-button'}
//           onClick={handleCalculateQuantitiesButtonClick}
//         >
//           {calculateQuantities ? 'On' : 'Off'}
//         </button> */}
//         {/* <button onClick={upButton}>
//           Up
//         </button>
//         <button>
//           Down
//         </button>
//         <button>
//           Clockwise
//         </button>
//         <button>
//           Counterclockwise
//         </button> */}
//       </div>
//     </div>
//   );
// }

// export default forwardRef(BostonCartesia);

/// ////////////////////////////////// Everything above here works! //////////////////////////////////

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TripleToggle from '../TripleToggle'; // Make sure to import TripleToggle correctly
import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
import './BostonCartesia.css';
import { ReactComponent as IPG } from './images/IPG.svg';
import { ReactComponent as Contact } from './images/Contact.svg';
import { ReactComponent as Tail } from './images/Tail.svg';
import { ReactComponent as RightContact } from './images/RightContact.svg';
import { ReactComponent as LeftContact } from './images/LeftContact.svg';
import { ReactComponent as HeadTop } from './images/head_top.svg';
import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
// import {
//   IPG,
//   Contact,
//   Tail,
//   RightContact,
//   LeftContact,
//   HeadTop,
//   HeadBottom,
// } from './BostonCartesiaSVG'; // Import SVG components from the new file
import BostonElectrodeRenderer from './BostonElectrodeRenderer';

function BostonCartesia(props, ref) {
  const svgs = [
    <HeadTop key="headTop" />,
    <HeadBottom key="headBottom" />,
    <Contact key="8" level="4" />,
    <Contact key="5" level="3" face="center" />,
    <Contact key="2" level="2" face="center" />,
    <Tail key="1" level="1" />,
  ];

  const ipgs = [<IPG key="0" />];

  const rightContacts = [
    <Contact key="7" level="3" face="right" />,
    <Contact key="4" level="2" face="right" />,
  ];

  const leftContacts = [
    <Contact key="6" level="3" face="left" />,
    <Contact key="3" level="2" face="left" />,
  ];

  const [calculateQuantities, setCalculateQuantities] = useState(false);

  const handleCalculateQuantitiesButtonClick = () => {
    setCalculateQuantities((prev) => !prev);
  };

  const calculateZIndex = (key) => {
    // Define a mapping of key to z-index
    const zIndexMap = {
      8: 2,
      5: 2,
      2: 2,
      1: 2,
      0: 2,
      // Add more key-to-z-index mappings as needed
    };

    // Return the calculated z-index or a default value
    return zIndexMap[key] || 0;
  };

  const initialQuantities = {
    plus: 0,
    minus: 0,
  };

  const [selectedValues, setSelectedValues] = useState({
    0: 'left',
    1: 'left',
    2: 'left',
    3: 'left',
    4: 'left',
    5: 'left',
    6: 'left',
    7: 'left',
    8: 'left',
    // Initialize other images here
  });
  const [quantities, setQuantities] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  });

  // const [userQuantities, setUserQuantities] = useState({}); // Store user input quantities

  const totalQuantity = quantities.plus + quantities.minus;

  const [lastChangedInstance, setLastChangedInstance] = useState({
    key: null,
    quantity: null,
    value: null,
    animation: null,
  });

  console.log('lastChangedInstance:', lastChangedInstance); // Add this line to log the value

  // const calculateQuantitiesWithDistribution = (selectedValues) => {
  //   const quantities = {
  //     left: 0,
  //     center: 0,
  //     right: 0,
  //   };

  //   // Calculate the quantity increment for 'center' and 'right' values
  //   // This is effectively the number of TripleToggle components that have a value of 'center'
  //   const centerCount = Object.values(selectedValues).filter(
  //     (value) => value === 'center',
  //   ).length;
  //   let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
  //   // THis is effectively the number of TripleToggle components that have a value of 'right'
  //   const rightCount = Object.values(selectedValues).filter(
  //     (value) => value === 'right',
  //   ).length;
  //   let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

  //   // This finds the difference between
  //   if (lastChangedInstance.value === 'center') {
  //     centerQuantityIncrement =
  //       centerCount > 0
  //         ? (100 - lastChangedInstance.animation) / centerCount
  //         : 0;
  //   } else if (lastChangedInstance.value === 'right') {
  //     rightQuantityIncrement =
  //       rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
  //   } else if (lastChangedInstance.value === 'left') {
  //     centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
  //     rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
  //   }

  //   Object.keys(selectedValues).forEach((key) => {
  //     const value = selectedValues[key];
  //     if (key !== lastChangedInstance.key) {
  //       if (value === 'left') {
  //         quantities[value] = 0;
  //       } else if (value === 'center') {
  //         quantities[value] = centerQuantityIncrement;
  //       } else if (value === 'right') {
  //         quantities[value] = rightQuantityIncrement;
  //       }
  //     } else if (key === lastChangedInstance.key) {
  //       quantities[value] = lastChangedInstance.quantity;
  //     }
  //   });

  //   return quantities;
  // };

  // useEffect(() => {
  //   // Calculate quantities based on selected values with distribution
  //   const newQuantities = calculateQuantitiesWithDistribution(selectedValues);
  //   setQuantities(newQuantities);
  // }, [selectedValues]);

  // const handleTripleToggleChange = (value, key) => {
  //   const updatedSelectedValues = { ...selectedValues, [key]: value };
  //   setSelectedValues(updatedSelectedValues);
  // };

  // const handleQuantityChange = (key, value, animation, quantity) => {
  //   const updatedSelectedValues = { ...selectedValues };
  //   setLastChangedInstance({ key, value, animation, quantity });
  //   const newQuantities = calculateQuantitiesWithDistribution(
  //     updatedSelectedValues,
  //   );
  //   setQuantities(newQuantities);
  // };

  const handleTripleToggleChange = (value, key) => {
    const updatedSelectedValues = { ...selectedValues, [key]: value };
    setSelectedValues(updatedSelectedValues);
  };
  // console.log('Values: ', selectedValues);

  // Define the handleQuantityChange function to update the quantity for a specific key and value
  const handleQuantityChange = (quantity, key) => {
    // setQuantities((prevQuantities) => ({
    //   ...prevQuantities,
    //   [key]: quantity,
    // }));
    const updatedQuantities = { ...quantities, [key]: quantity };
    setQuantities(updatedQuantities);
  };

  const calculateQuantitiesWithDistribution = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
    console.log('CenterCount: ', centerCount);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

    const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'left') {
        updatedQuantities[key] = 0;
      } else if (value === 'center') {
        updatedQuantities[key] = centerQuantityIncrement;
      } else if (value === 'right') {
        updatedQuantities[key] = rightQuantityIncrement;
      }
    });

    // console.log(quantities);
    setQuantities(updatedQuantities);
    setSelectedValues(selectedValues);
    handleTripleToggleChange();
    console.log(quantities); // Update the state with the new quantities
  };

  const roundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;

    // Calculate the sums for 'center' and 'right' values
    Object.keys(quantities).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'center') {
        totalCenterSum += quantities[key];
      } else if (value === 'right') {
        totalRightSum += quantities[key];
      }
    });

    // Calculate the quantity increments
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = (100 - totalCenterSum) / centerCount;

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (100 - totalRightSum) / rightCount;

    const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'left') {
        updatedQuantities[key] = 0;
      } else if (value === 'center') {
        updatedQuantities[key] += centerQuantityIncrement;
      } else if (value === 'right') {
        updatedQuantities[key] += rightQuantityIncrement;
      }
    });
    setQuantities(updatedQuantities); // Update the state with the new quantities
    console.log(updatedQuantities);
  };


  //////////////////////////////////////// DBS Controller ////////////////////////////////

  const handleUpButton = () => {

  };
  ///////////////////////////////////////// YUH //////////////////////////////////////////////


  /// ///////////////////////      Exporting Data ////////////////////
  function gatherTripleToggleData(selectedValues, quantities) {
    const data = [];

    // Create a mapping object for the values
    const valueMapping = {
      left: 'OFF',
      center: '-',
      right: '+',
    };

    // Iterate through the selectedValues object and collect the data for each instance
    for (const key in selectedValues) {
      if (selectedValues.hasOwnProperty(key)) {
        const value = selectedValues[key];
        data.push({
          key,
          value: valueMapping[value] || value, // Use the mapped value or the original value
          quantity: quantities[value],
        });
      }
    }

    return data;
  }
  const tripleToggleData = gatherTripleToggleData(selectedValues, quantities);

  function exportToJsonFile(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'tripleToggleData.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  /// /////////////////////////////////////////////////////////////////////////

  /// /////////////////////           Importing Data - doesn't really work yet ////////////////////////

  const [importedData, setImportedData] = useState(null);

  const reverseValueMapping = {
    OFF: 'left',
    '-': 'center',
    '+': 'right',
  };

  function getSwitchAnimation(from, to) {
    // Use the animation logic from TripleToggle to update the state
    // This is a simplified version; you may need to adjust it
    if (from === 'left' && to === 'center') {
      // Apply animation logic here
    } else if (from === 'center' && to === 'right') {
      // Apply animation logic here
    } else if (from === 'right' && to === 'center') {
      // Apply animation logic here
    } else if (from === 'center' && to === 'left') {
      // Apply animation logic here
    } else if (from === 'right' && to === 'left') {
      // Apply animation logic here
    } else if (from === 'left' && to === 'right') {
      // Apply animation logic here
    }
  }

  function updateDataFromJson(jsonData) {
    console.log('Imported JSON Data:', jsonData);
    if (Array.isArray(jsonData)) {
      const updatedSelectedValues = { ...selectedValues };
      const updatedQuantities = { ...quantities };

      jsonData.forEach((item) => {
        // const { key, value, quantity, animation } = item;
        const { key, value, quantity } = item;
        const originalValue = reverseValueMapping[value];
        if (selectedValues[key] !== undefined) {
          getSwitchAnimation(originalValue, value);
          updatedSelectedValues[key] = originalValue;
          // updatedQuantities[value] = quantity;
          updatedQuantities[originalValue] = quantity;
        }
      });
      setSelectedValues(updatedSelectedValues);
      setQuantities(updatedQuantities);
      console.log(selectedValues);
      console.log('Quantities:', quantities);
    }
  }

  // function handleFileChange(event) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       try {
  //         const jsonData = JSON.parse(e.target.result);
  //         updateDataFromJson(jsonData);
  //       } catch (error) {
  //         console.error('Error parsing JSON:', error);
  //       }
  //     };
  //     reader.readAsText(file);
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

  useEffect(() => {
    if (importedData) {
      updateDataFromJson(importedData);
    }
  }, [importedData]);

  const fileInputRef = useRef(null);

  /// //////////////////////////////////////////////////////////////////////////

  /// /////////////////////////           Export to TabbedElectrodeIPGSelection               /////////////////////////////
  const getCartesiaData = () => {
    const data = [];
    for (const key in selectedValues) {
      if (selectedValues.hasOwnProperty(key)) {
        data.push({
          key,
          value: selectedValues[key],
          quantity: quantities[selectedValues[key]],
        });
      }
    }
    return data;
  };

  useImperativeHandle(ref, () => ({
    getCartesiaData,
  }));

  /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container">
      <div className="container2">
        <div className="IPG">
          {ipgs.map((ipg) => (
            <div className="image-item">
              <div className="image-container">
                {React.cloneElement(ipg, {
                  key: ipg.key,
                  className: `${selectedValues[ipg.key]}-color`,
                })}
                {!isNaN(Number(ipg.key)) && (
                  <div className="triple-toggle-ipg">
                    <TripleToggle
                      key={ipg.key}
                      value={selectedValues[ipg.key]}
                      quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
                      onChange={(value) =>
                        handleTripleToggleChange(value, ipg.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(
                          value,
                          animation,
                          quantity,
                          ipg.key,
                        )
                      }
                    />
                  </div>
                )}
              </div>
              {/* <p className="image-key">{ipg.key}</p> */}
            </div>
          ))}
        </div>
        <div className="left-contacts">
          {leftContacts.map((Lcon) => (
            <div className="image-item">
              <div className="image-container">
                {React.cloneElement(Lcon, {
                  key: Lcon.key,
                  className: `${selectedValues[Lcon.key]}-color`,
                })}
                {!isNaN(Number(Lcon.key)) && (
                  <div className="triple-toggle">
                    <TripleToggle
                      key={Lcon.key}
                      value={selectedValues[Lcon.key]}
                      quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
                      onChange={(value) =>
                        handleTripleToggleChange(value, Lcon.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(
                          value,
                          animation,
                          quantity,
                          Lcon.key,
                        )
                      }
                    />
                  </div>
                )}
              </div>
              {/* <p className="image-key">{Lcon.key}</p> */}
            </div>
          ))}
        </div>
      </div>
      <div className="Elmodel-center">
        {svgs.map((svg) => (
          <div
            className="image-item"
            style={{ zIndex: calculateZIndex(svg.key) }}
          >
            <div className="image-container">
              {React.cloneElement(svg, {
                key: svg.key,
                className: `${selectedValues[svg.key]}-color`,
              })}
              {!isNaN(Number(svg.key)) && (
                <div className="triple-toggle">
                  <TripleToggle
                    key={svg.key}
                    value={selectedValues[svg.key]}
                    quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
                    onChange={(value) =>
                      handleTripleToggleChange(value, svg.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(value, animation, quantity, svg.key)
                    }
                  />
                </div>
              )}
            </div>
            {/* <p className="image-key">{svg.key}</p> */}
          </div>
        ))}
      </div>
      <div className="right-contacts">
        {rightContacts.map((rCon) => (
          <div className="image-item">
            <div className="image-container">
              {React.cloneElement(rCon, {
                key: rCon.key,
                className: `${selectedValues[rCon.key]}-color`,
              })}
              {!isNaN(Number(rCon.key)) && (
                <div className="triple-toggle">
                  <TripleToggle
                    key={rCon.key}
                    value={selectedValues[rCon.key]}
                    quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
                    onChange={(value) =>
                      handleTripleToggleChange(value, rCon.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(value, animation, quantity, rCon.key)
                    }
                  />
                </div>
              )}
            </div>
            {/* <p className="image-key">{rCon.key}</p> */}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button
          className="import-button"
          onClick={() => fileInputRef.current.click()}
        >
          Import from LeadDBS
        </button>
        <button
          className="export-button"
          onClick={() => exportToJsonFile(tripleToggleData)}
        >
          Export to LeadDBS
        </button>
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the input element
        />
        {/* <button
          className={calculateQuantities ? 'active-button' : 'inactive-button'}
          onClick={handleCalculateQuantitiesButtonClick}
        >
          {calculateQuantities ? 'On' : 'Off'}
        </button> */}
        <button onClick={handleUpButton}>
          Up
        </button>
        {/* <button onClick={handleDownButton}>
          Down
        </button>
        <button onClick={handleClockwiseButton}>
          Clockwise
        </button>
        <button onClick={handleCounterClockwiseButton}>
          Counterclockwise
        </button> */}
        <button onClick={calculateQuantitiesWithDistribution}>
          Split Even
        </button>
        <button onClick={roundToHundred}>Make 100</button>
      </div>
    </div>
  );
}

export default forwardRef(BostonCartesia);

// const calculateQuantitiesWithDistribution = (selectedValues) => {
//   const quantities = {
//     left: 0,
//     center: 0,
//     right: 0,
//   };

//   // Calculate the quantity increment for 'center' and 'right' values
//   // This is effectively the number of TripleToggle components that have a value of 'center'
//   const centerCount = Object.values(selectedValues).filter(
//     (value) => value === 'center',
//   ).length;
//   let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   // THis is effectively the number of TripleToggle components that have a value of 'right'
//   const rightCount = Object.values(selectedValues).filter(
//     (value) => value === 'right',
//   ).length;
//   let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//   // This finds the difference between
//   if (lastChangedInstance.value === 'center') {
//     centerQuantityIncrement =
//       centerCount > 0
//         ? (100 - lastChangedInstance.animation) / centerCount
//         : 0;
//   } else if (lastChangedInstance.value === 'right') {
//     rightQuantityIncrement =
//       rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
//   } else if (lastChangedInstance.value === 'left') {
//     centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//     rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//   }

//   Object.keys(selectedValues).forEach((key) => {
//     const value = selectedValues[key];
//     if (key !== lastChangedInstance.key) {
//       if (value === 'left') {
//         quantities[value] = 0;
//       } else if (value === 'center') {
//         quantities[value] = centerQuantityIncrement;
//       } else if (value === 'right') {
//         quantities[value] = rightQuantityIncrement;
//       }
//     } else if (key === lastChangedInstance.key) {
//       quantities[value] = lastChangedInstance.quantity;
//     }
//   });

//   return quantities;
// };

// const calculateQuantitiesWithDistribution = (selectedValues) => {
//   if (calculateQuantities) {
//     const quantities = {
//       left: 0,
//       center: 0,
//       right: 0,
//     };
//     // Calculate the quantity increment for 'center' and 'right' values
//     // This is effectively the number of TripleToggle components that have a value of 'center'
//     const centerCount = Object.values(selectedValues).filter(
//       (value) => value === 'center',
//     ).length;
//     let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//     // THis is effectively the number of TripleToggle components that have a value of 'right'
//     const rightCount = Object.values(selectedValues).filter(
//       (value) => value === 'right',
//     ).length;
//     let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//     // This finds the difference between
//     if (lastChangedInstance.value === 'center') {
//       centerQuantityIncrement =
//         centerCount > 0
//           ? (100 - lastChangedInstance.animation) / centerCount
//           : 0;
//     } else if (lastChangedInstance.value === 'right') {
//       rightQuantityIncrement =
//         rightCount > 0
//           ? (100 - lastChangedInstance.animation) / rightCount
//           : 0;
//     } else if (lastChangedInstance.value === 'left') {
//       centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//       rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//     }

//     Object.keys(selectedValues).forEach((key) => {
//       const value = selectedValues[key];
//       if (key !== lastChangedInstance.key) {
//         if (value === 'left') {
//           quantities[value] = 0;
//         } else if (value === 'center') {
//           quantities[value] = centerQuantityIncrement;
//         } else if (value === 'right') {
//           quantities[value] = rightQuantityIncrement;
//         }
//       } else if (key === lastChangedInstance.key) {
//         quantities[value] = lastChangedInstance.quantity;
//       }
//     });

//     return quantities;
//   }
//   return quantities;
// };

// {/* <BostonElectrodeRenderer
//   handleFileChange={handleFileChange}
//   fileInputRef={fileInputRef}
//   calculateZIndex={calculateZIndex}
//   selectedValues={selectedValues}
//   quantities={quantities}
//   svgs={svgs}
//   ipgs={ipgs}
//   rightContacts={rightContacts}
//   leftContacts={leftContacts}
// /> */}

// export default BostonCartesia;
// if (lastChangedInstance.key === 'center') {
//   if (centerCount > 1) {
//     centerQuantityIncrement =
//       (100 - lastChangedInstance.animation) / (centerCount - 1);
//   } else if (centerCount < 1) {
//     centerQuantityIncrement = 0;
//   }
// } else if (lastChangedInstance.key === 'right') {
//   if (rightCount > 1) {
//     rightQuantityIncrement =
//       (100 - lastChangedInstance.animation) / (rightCount - 1);
//   } else if (rightCount < 1) {
//     rightQuantityIncrement = 0;
//   }
// } else if (lastChangedInstance.key === 'left') {
//   centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
// }
// console.log(centerCount);
// console.log(centerQuantityIncrement);

// Object.keys(selectedValues).forEach((key) => {
//   const value = selectedValues[key];
//   if (key !== lastChangedInstance.key) {
//     if (value === 'left') {
//       quantities[value] = 0;
//     } else if (value === 'center') {
//       quantities[value] = centerQuantityIncrement;
//     } else if (value === 'right') {
//       quantities[value] = rightQuantityIncrement;
//     }
//   } else if (key === lastChangedInstance.key) {
//     quantities[value] = 100 - lastChangedInstance.animation;
//   }
// });

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import TripleToggle from '../TripleToggle'; // Make sure to import TripleToggle correctly
// import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
// import NewCalculateQuantities from '../NewCalculateQuantities';
// import './BostonCartesia.css';
// import { ReactComponent as IPG } from './images/IPG.svg';
// import { ReactComponent as Contact } from './images/Contact.svg';
// import { ReactComponent as Tail } from './images/Tail.svg';
// import { ReactComponent as RightContact } from './images/RightContact.svg';
// import { ReactComponent as LeftContact } from './images/LeftContact.svg';
// import { ReactComponent as HeadTop } from './images/head_top.svg';
// import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
// import BostonElectrodeRenderer from './BostonElectrodeRenderer';

// function BostonCartesia(props, ref) {
//   const svgs = [
//     <HeadTop key="headTop" />,
//     <HeadBottom key="headBottom" />,
//     <Contact key="8" />,
//     <Contact key="5" />,
//     <Contact key="2" />,
//     <Tail key="1" />,
//   ];

//   const ipgs = [<IPG key="0" />];

//   const rightContacts = [<Contact key="7" />, <Contact key="4" />];

//   const leftContacts = [<Contact key="6" />, <Contact key="3" />];

//   const [calculateQuantity, setCalculateQuantity] = useState(false);

//   const handleCalculateQuantitiesButtonClick = () => {
//     setCalculateQuantity((prev) => !prev);
//   };

//   const calculateZIndex = (key) => {
//     // Define a mapping of key to z-index
//     const zIndexMap = {
//       8: 2,
//       5: 2,
//       2: 2,
//       1: 2,
//       0: 2,
//       // Add more key-to-z-index mappings as needed
//     };

//     // Return the calculated z-index or a default value
//     return zIndexMap[key] || 0;
//   };

//   const initialQuantities = {
//     plus: 0,
//     minus: 0,
//   };

//   const [selectedValues, setSelectedValues] = useState({
//     0: 'left',
//     1: 'left',
//     2: 'left',
//     3: 'left',
//     4: 'left',
//     5: 'left',
//     6: 'left',
//     7: 'left',
//     8: 'left',
//     // Initialize other images here
//   });
//   const [quantities, setQuantities] = useState({ initialQuantities });

//   const [quantityMap, setQuantityMap] = useState({});

//   // const [userQuantities, setUserQuantities] = useState({}); // Store user input quantities

//   const totalQuantity = quantities.plus + quantities.minus;

//   const [lastChangedInstance, setLastChangedInstance] = useState({
//     key: null,
//     quantity: null,
//     value: null,
//     animation: null,
//   });

//   console.log('lastChangedInstance:', lastChangedInstance); // Add this line to log the value

//   // const calculateQuantitiesWithDistribution = (selectedValues) => {
//   //   const quantities = {
//   //     left: 0,
//   //     center: 0,
//   //     right: 0,
//   //   };

//   //   // Calculate the quantity increment for 'center' and 'right' values
//   //   // This is effectively the number of TripleToggle components that have a value of 'center'
//   //   const centerCount = Object.values(selectedValues).filter(
//   //     (value) => value === 'center',
//   //   ).length;
//   //   let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   //   // THis is effectively the number of TripleToggle components that have a value of 'right'
//   //   const rightCount = Object.values(selectedValues).filter(
//   //     (value) => value === 'right',
//   //   ).length;
//   //   let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//   //   // This finds the difference between
//   //   if (lastChangedInstance.value === 'center') {
//   //     centerQuantityIncrement =
//   //       centerCount > 0
//   //         ? (100 - lastChangedInstance.animation) / centerCount
//   //         : 0;
//   //   } else if (lastChangedInstance.value === 'right') {
//   //     rightQuantityIncrement =
//   //       rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
//   //   } else if (lastChangedInstance.value === 'left') {
//   //     centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   //     rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//   //   }

//   //   Object.keys(selectedValues).forEach((key) => {
//   //     const value = selectedValues[key];
//   //     if (key !== lastChangedInstance.key) {
//   //       if (value === 'left') {
//   //         quantities[value] = 0;
//   //       } else if (value === 'center') {
//   //         quantities[value] = centerQuantityIncrement;
//   //       } else if (value === 'right') {
//   //         quantities[value] = rightQuantityIncrement;
//   //       }
//   //     } else if (key === lastChangedInstance.key) {
//   //       quantities[value] = lastChangedInstance.quantity;
//   //     }
//   //   });

//   //   return quantities;
//   // };

//   // const calculateQuantitiesWithDistribution = (selectedValues) => {
//   //   if (calculateQuantities) {
//   //     const quantities = {
//   //       left: 0,
//   //       center: 0,
//   //       right: 0,
//   //     };
//   //     // Calculate the quantity increment for 'center' and 'right' values
//   //     // This is effectively the number of TripleToggle components that have a value of 'center'
//   //     const centerCount = Object.values(selectedValues).filter(
//   //       (value) => value === 'center',
//   //     ).length;
//   //     let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   //     // THis is effectively the number of TripleToggle components that have a value of 'right'
//   //     const rightCount = Object.values(selectedValues).filter(
//   //       (value) => value === 'right',
//   //     ).length;
//   //     let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//   //     // This finds the difference between
//   //     if (lastChangedInstance.value === 'center') {
//   //       centerQuantityIncrement =
//   //         centerCount > 0
//   //           ? (100 - lastChangedInstance.animation) / centerCount
//   //           : 0;
//   //     } else if (lastChangedInstance.value === 'right') {
//   //       rightQuantityIncrement =
//   //         rightCount > 0
//   //           ? (100 - lastChangedInstance.animation) / rightCount
//   //           : 0;
//   //     } else if (lastChangedInstance.value === 'left') {
//   //       centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//   //       rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//   //     }

//   //     Object.keys(selectedValues).forEach((key) => {
//   //       const value = selectedValues[key];
//   //       if (key !== lastChangedInstance.key) {
//   //         if (value === 'left') {
//   //           quantities[value] = 0;
//   //         } else if (value === 'center') {
//   //           quantities[value] = centerQuantityIncrement;
//   //         } else if (value === 'right') {
//   //           quantities[value] = rightQuantityIncrement;
//   //         }
//   //       } else if (key === lastChangedInstance.key) {
//   //         quantities[value] = lastChangedInstance.quantity;
//   //       }
//   //     });

//   //     return quantities;
//   //   }
//   //   return quantities;
//   // };

//   const calculateQuantitiesWithDistribution = (selectedValues) => {
//     const quantities = {
//       left: 0,
//       center: 0,
//       right: 0,
//     };

//     // Calculate the quantity increment for 'center' and 'right' values
//     // This is effectively the number of TripleToggle components that have a value of 'center'
//     const centerCount = Object.values(selectedValues).filter(
//       (value) => value === 'center',
//     ).length;
//     let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//     // THis is effectively the number of TripleToggle components that have a value of 'right'
//     const rightCount = Object.values(selectedValues).filter(
//       (value) => value === 'right',
//     ).length;
//     let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//     // This finds the difference between
//     if (lastChangedInstance.value === 'center') {
//       centerQuantityIncrement =
//         centerCount > 0
//           ? (100 - lastChangedInstance.animation) / centerCount
//           : 0;
//     } else if (lastChangedInstance.value === 'right') {
//       rightQuantityIncrement =
//         rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
//     } else if (lastChangedInstance.value === 'left') {
//       centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//       rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
//     }

//     Object.keys(selectedValues).forEach((key) => {
//       const value = selectedValues[key];
//       if (key !== lastChangedInstance.key) {
//         if (value === 'left') {
//           quantities[value] = 0;
//         } else if (value === 'center') {
//           quantities[value] = centerQuantityIncrement;
//         } else if (value === 'right') {
//           quantities[value] = rightQuantityIncrement;
//         }
//       } else if (key === lastChangedInstance.key) {
//         quantities[value] = lastChangedInstance.quantity;
//       }
//     });

//     return quantities;
//   };

//   const handleTripleToggleChange = (value, key) => {
//     const updatedSelectedValues = { ...selectedValues };
//     updatedSelectedValues[key] = value;
//     setSelectedValues(updatedSelectedValues);

//     // Initialize quantity for this TripleToggle if not already set
//     // if (!quantityMap[key]) {
//     //   setQuantityMap({ ...quantityMap, [key]: 0 });
//     // }
//   };

//   const [userQuantities, setUserQuantities] = useState({});

//   const handleQuantityChange = (key, quantity) => {
//     const updatedUserQuantities = { ...userQuantities };
//     updatedUserQuantities[key] = quantity;
//     setUserQuantities(updatedUserQuantities);
//   };

//   useEffect(() => {
//     if (calculateQuantity) {
//       // Calculate quantities based on selected values with distribution
//       const newQuantities = calculateQuantitiesWithDistribution(selectedValues);
//       setQuantities(newQuantities);
//     } else {
//       // When calculateQuantity is false, use the quantities from quantityMap
//       // If userQuantities exist, set the quantities to be the user input quantities
//       const newQuantities = { ...quantities };
//       Object.keys(selectedValues).forEach((key) => {
//         const value = selectedValues[key];
//         if (userQuantities[key] !== undefined) {
//           // Handle user input quantities here
//           newQuantities[value] = userQuantities[key];
//         } else {
//           newQuantities[value] = quantityMap[key] || 0;
//         }
//       });
//       setQuantities(newQuantities);
//     }
//   }, [calculateQuantity, selectedValues, quantityMap, userQuantities]);

//   /// ///////////////////////      Exporting Data ////////////////////
//   function gatherTripleToggleData(selectedValues, quantities) {
//     const data = [];

//     // Create a mapping object for the values
//     const valueMapping = {
//       left: 'OFF',
//       center: '-',
//       right: '+',
//     };

//     // Iterate through the selectedValues object and collect the data for each instance
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         const value = selectedValues[key];
//         data.push({
//           key,
//           value: valueMapping[value] || value, // Use the mapped value or the original value
//           quantity: quantities[value],
//         });
//       }
//     }

//     return data;
//   }
//   const tripleToggleData = gatherTripleToggleData(selectedValues, quantities);

//   function exportToJsonFile(data) {
//     const json = JSON.stringify(data, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'tripleToggleData.json';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }
//   /// /////////////////////////////////////////////////////////////////////////

//   /// /////////////////////           Importing Data - doesn't really work yet ////////////////////////

//   const [importedData, setImportedData] = useState(null);

//   const reverseValueMapping = {
//     OFF: 'left',
//     '-': 'center',
//     '+': 'right',
//   };

//   function getSwitchAnimation(from, to) {
//     // Use the animation logic from TripleToggle to update the state
//     // This is a simplified version; you may need to adjust it
//     if (from === 'left' && to === 'center') {
//       // Apply animation logic here
//     } else if (from === 'center' && to === 'right') {
//       // Apply animation logic here
//     } else if (from === 'right' && to === 'center') {
//       // Apply animation logic here
//     } else if (from === 'center' && to === 'left') {
//       // Apply animation logic here
//     } else if (from === 'right' && to === 'left') {
//       // Apply animation logic here
//     } else if (from === 'left' && to === 'right') {
//       // Apply animation logic here
//     }
//   }

//   function updateDataFromJson(jsonData) {
//     console.log('Imported JSON Data:', jsonData);
//     if (Array.isArray(jsonData)) {
//       const updatedSelectedValues = { ...selectedValues };
//       const updatedQuantities = { ...quantities };

//       jsonData.forEach((item) => {
//         // const { key, value, quantity, animation } = item;
//         const { key, value, quantity } = item;
//         const originalValue = reverseValueMapping[value];
//         if (selectedValues[key] !== undefined) {
//           getSwitchAnimation(originalValue, value);
//           updatedSelectedValues[key] = originalValue;
//           // updatedQuantities[value] = quantity;
//           updatedQuantities[originalValue] = quantity;
//         }
//       });
//       setSelectedValues(updatedSelectedValues);
//       setQuantities(updatedQuantities);
//       console.log(selectedValues);
//       console.log('Quantities:', quantities);
//     }
//   }

//   // function handleFileChange(event) {
//   //   const file = event.target.files[0];
//   //   if (file) {
//   //     const reader = new FileReader();
//   //     reader.onload = function (e) {
//   //       try {
//   //         const jsonData = JSON.parse(e.target.result);
//   //         updateDataFromJson(jsonData);
//   //       } catch (error) {
//   //         console.error('Error parsing JSON:', error);
//   //       }
//   //     };
//   //     reader.readAsText(file);
//   //   }
//   // }

//   function handleFileChange(event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         try {
//           const jsonData = JSON.parse(e.target.result);
//           setImportedData(jsonData);
//         } catch (error) {
//           console.error('Error parsing JSON:', error);
//         }
//       };
//       reader.readAsText(file);
//     }
//   }

//   useEffect(() => {
//     if (importedData) {
//       updateDataFromJson(importedData);
//     }
//   }, [importedData]);

//   const fileInputRef = useRef(null);

//   /// //////////////////////////////////////////////////////////////////////////

//   /// /////////////////////////           Export to TabbedElectrodeIPGSelection               /////////////////////////////
//   const getCartesiaData = () => {
//     const data = [];
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         data.push({
//           key,
//           value: selectedValues[key],
//           quantity: quantities[selectedValues[key]],
//         });
//       }
//     }
//     return data;
//   };

//   useImperativeHandle(ref, () => ({
//     getCartesiaData,
//   }));

//   /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

//   return (
//     <div className="container">
//       <div className="container2">
//         <div className="IPG">
//           {ipgs.map((ipg) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(ipg, {
//                   key: ipg.key,
//                   className: `${selectedValues[ipg.key]}-color`,
//                 })}
//                 {!isNaN(Number(ipg.key)) && (
//                   <div className="triple-toggle-ipg">
//                     <TripleToggle
//                       key={ipg.key}
//                       value={selectedValues[ipg.key]}
//                       quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, ipg.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           value,
//                           animation,
//                           quantity,
//                           ipg.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{ipg.key}</p> */}
//             </div>
//           ))}
//         </div>
//         <div className="left-contacts">
//           {leftContacts.map((Lcon) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(Lcon, {
//                   key: Lcon.key,
//                   className: `${selectedValues[Lcon.key]}-color`,
//                 })}
//                 {!isNaN(Number(Lcon.key)) && (
//                   <div className="triple-toggle">
//                     <TripleToggle
//                       key={Lcon.key}
//                       value={selectedValues[Lcon.key]}
//                       quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, Lcon.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           value,
//                           animation,
//                           quantity,
//                           Lcon.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{Lcon.key}</p> */}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="Elmodel-center">
//         {svgs.map((svg) => (
//           <div
//             className="image-item"
//             style={{ zIndex: calculateZIndex(svg.key) }}
//           >
//             <div className="image-container">
//               {React.cloneElement(svg, {
//                 key: svg.key,
//                 className: `${selectedValues[svg.key]}-color`,
//               })}
//               {!isNaN(Number(svg.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={svg.key}
//                     value={selectedValues[svg.key]}
//                     quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, svg.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, svg.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{svg.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="right-contacts">
//         {rightContacts.map((rCon) => (
//           <div className="image-item">
//             <div className="image-container">
//               {React.cloneElement(rCon, {
//                 key: rCon.key,
//                 className: `${selectedValues[rCon.key]}-color`,
//               })}
//               {!isNaN(Number(rCon.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={rCon.key}
//                     value={selectedValues[rCon.key]}
//                     quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, rCon.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, rCon.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{rCon.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="button-container">
//         <button
//           className="import-button"
//           onClick={() => fileInputRef.current.click()}
//         >
//           Import from LeadDBS
//         </button>
//         <button
//           className="export-button"
//           onClick={() => exportToJsonFile(tripleToggleData)}
//         >
//           Export to LeadDBS
//         </button>
//         <input
//           ref={fileInputRef}
//           className="file-input"
//           type="file"
//           accept=".json"
//           onChange={handleFileChange}
//           style={{ display: 'none' }} // Hide the input element
//         />
//         <button
//           className={calculateQuantity ? 'active-button' : 'inactive-button'}
//           onClick={handleCalculateQuantitiesButtonClick}
//         >
//           {calculateQuantity ? 'On' : 'Off'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default forwardRef(BostonCartesia);

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import TripleToggle from '../TripleToggle'; // Make sure to import TripleToggle correctly
// import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
// import './BostonCartesia.css';
// import { ReactComponent as IPG } from './images/IPG.svg';
// import { ReactComponent as Contact } from './images/Contact.svg';
// import { ReactComponent as Tail } from './images/Tail.svg';
// import { ReactComponent as RightContact } from './images/RightContact.svg';
// import { ReactComponent as LeftContact } from './images/LeftContact.svg';
// import { ReactComponent as HeadTop } from './images/head_top.svg';
// import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
// import BostonElectrodeRenderer from './BostonElectrodeRenderer';

// function BostonCartesia(props, ref) {
//   const svgs = [
//     <HeadTop key="headTop" />,
//     <HeadBottom key="headBottom" />,
//     <Contact key="8" level="4" />,
//     <Contact key="5" level="3" face="center" />,
//     <Contact key="2" level="2" face="center" />,
//     <Tail key="1" level="1" />,
//   ];

//   const ipgs = [<IPG key="0" />];

//   const rightContacts = [
//     <Contact key="7" level="3" face="right" />,
//     <Contact key="4" level="2" face="right" />,
//   ];

//   const leftContacts = [
//     <Contact key="6" level="3" face="left" />,
//     <Contact key="3" level="2" face="left" />,
//   ];

//   const calculateZIndex = (key) => {
//     // Define a mapping of key to z-index
//     const zIndexMap = {
//       8: 2,
//       5: 2,
//       2: 2,
//       1: 2,
//       0: 2,
//       // Add more key-to-z-index mappings as needed
//     };

//     // Return the calculated z-index or a default value
//     return zIndexMap[key] || 0;
//   };

//   const initialQuantities = {
//     plus: 0,
//     minus: 0,
//   };

//   const [selectedValues, setSelectedValues] = useState({
//     0: 'left',
//     1: 'left',
//     2: 'left',
//     3: 'left',
//     4: 'left',
//     5: 'left',
//     6: 'left',
//     7: 'left',
//     8: 'left',
//     // Initialize other images here
//   });
//   const [quantities, setQuantities] = useState({
//     0: 0,
//     1: 0,
//     2: 0,
//     3: 0,
//     4: 0,
//     5: 0,
//     6: 0,
//     7: 0,
//     8: 0,
//   });

//   // const [userQuantities, setUserQuantities] = useState({}); // Store user input quantities

//   // const handleTripleToggleChange = (value, key) => {
//   //   setSelectedValues((prevSelectedValues) => ({
//   //     ...prevSelectedValues,
//   //     [key]: value,
//   //   }));
//   //   console.log('Values:', selectedValues);
//   // };

//   const handleTripleToggleChange = (value, key) => {
//     const updatedSelectedValues = { ...selectedValues, [key]: value };
//     setSelectedValues(updatedSelectedValues);
//   };
//   // console.log('Values: ', selectedValues);

//   // Define the handleQuantityChange function to update the quantity for a specific key and value
//   const handleQuantityChange = (quantity, key) => {
//     // setQuantities((prevQuantities) => ({
//     //   ...prevQuantities,
//     //   [key]: quantity,
//     // }));
//     const updatedQuantities = { ...quantities, [key]: quantities };
//     setQuantities(updatedQuantities);
//   };

//   const calculateQuantitiesWithDistribution = () => {
//     // Calculate the quantity increment for 'center' and 'right' values
//     const centerCount = Object.values(selectedValues).filter(
//       (value) => value === 'center',
//     ).length;
//     const centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
//     console.log('CenterCount: ', centerCount);

//     const rightCount = Object.values(selectedValues).filter(
//       (value) => value === 'right',
//     ).length;
//     const rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

//     const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

//     // Update the quantities based on selected values
//     Object.keys(selectedValues).forEach((key) => {
//       const value = selectedValues[key];
//       if (value === 'left') {
//         updatedQuantities[key] = 0;
//       } else if (value === 'center') {
//         updatedQuantities[key] = centerQuantityIncrement;
//       } else if (value === 'right') {
//         updatedQuantities[key] = rightQuantityIncrement;
//       }
//     });

//     // console.log(quantities);
//     setQuantities(updatedQuantities);
//     // console.log(quantities); // Update the state with the new quantities
//   };

//   const roundToHundred = () => {
//     // Initialize sum variables
//     let totalCenterSum = 0;
//     let totalRightSum = 0;

//     // Calculate the sums for 'center' and 'right' values
//     Object.keys(quantities).forEach((key) => {
//       const value = selectedValues[key];
//       if (value === 'center') {
//         totalCenterSum += quantities[key];
//       } else if (value === 'right') {
//         totalRightSum += quantities[key];
//       }
//     });

//     // Calculate the quantity increments
//     const centerCount = Object.values(selectedValues).filter(
//       (value) => value === 'center',
//     ).length;
//     const centerQuantityIncrement = (100 - totalCenterSum) / centerCount;

//     const rightCount = Object.values(selectedValues).filter(
//       (value) => value === 'right',
//     ).length;
//     const rightQuantityIncrement = (100 - totalRightSum) / rightCount;

//     const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

//     // Update the quantities based on selected values
//     Object.keys(selectedValues).forEach((key) => {
//       const value = selectedValues[key];
//       if (value === 'left') {
//         updatedQuantities[key] = 0;
//       } else if (value === 'center') {
//         updatedQuantities[key] += centerQuantityIncrement;
//       } else if (value === 'right') {
//         updatedQuantities[key] += rightQuantityIncrement;
//       }
//     });
//     setQuantities(updatedQuantities); // Update the state with the new quantities
//     // console.log(quantities);
//   };

//   /// ///////////////////////      Exporting Data ////////////////////
//   function gatherTripleToggleData(selectedValues, quantities) {
//     const data = [];

//     // Create a mapping object for the values
//     const valueMapping = {
//       left: 'OFF',
//       center: '-',
//       right: '+',
//     };

//     // Iterate through the selectedValues object and collect the data for each instance
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         const value = selectedValues[key];
//         data.push({
//           key,
//           value: valueMapping[value] || value, // Use the mapped value or the original value
//           quantity: quantities[value],
//         });
//       }
//     }

//     return data;
//   }
//   const tripleToggleData = gatherTripleToggleData(selectedValues, quantities);

//   function exportToJsonFile(data) {
//     const json = JSON.stringify(data, null, 2);
//     const blob = new Blob([json], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'tripleToggleData.json';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }
//   /// /////////////////////////////////////////////////////////////////////////

//   /// /////////////////////           Importing Data - doesn't really work yet ////////////////////////

//   const [importedData, setImportedData] = useState(null);

//   const reverseValueMapping = {
//     OFF: 'left',
//     '-': 'center',
//     '+': 'right',
//   };

//   function updateDataFromJson(jsonData) {
//     console.log('Imported JSON Data:', jsonData);
//     if (Array.isArray(jsonData)) {
//       const updatedSelectedValues = { ...selectedValues };
//       const updatedQuantities = { ...quantities };

//       jsonData.forEach((item) => {
//         // const { key, value, quantity, animation } = item;
//         const { key, value, quantity } = item;
//         const originalValue = reverseValueMapping[value];
//         if (selectedValues[key] !== undefined) {
//           getSwitchAnimation(originalValue, value);
//           updatedSelectedValues[key] = originalValue;
//           // updatedQuantities[value] = quantity;
//           updatedQuantities[originalValue] = quantity;
//         }
//       });
//       setSelectedValues(updatedSelectedValues);
//       setQuantities(updatedQuantities);
//       console.log(selectedValues);
//       console.log('Quantities:', quantities);
//     }
//   }

//   function handleFileChange(event) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         try {
//           const jsonData = JSON.parse(e.target.result);
//           setImportedData(jsonData);
//         } catch (error) {
//           console.error('Error parsing JSON:', error);
//         }
//       };
//       reader.readAsText(file);
//     }
//   }

//   useEffect(() => {
//     if (importedData) {
//       updateDataFromJson(importedData);
//     }
//   }, [importedData]);

//   const fileInputRef = useRef(null);

//   /// //////////////////////////////////////////////////////////////////////////

//   /// /////////////////////////           Export to TabbedElectrodeIPGSelection               /////////////////////////////
//   const getCartesiaData = () => {
//     const data = [];
//     for (const key in selectedValues) {
//       if (selectedValues.hasOwnProperty(key)) {
//         data.push({
//           key,
//           value: selectedValues[key],
//           quantity: quantities[selectedValues[key]],
//         });
//       }
//     }
//     return data;
//   };

//   useImperativeHandle(ref, () => ({
//     getCartesiaData,
//   }));

//   /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

//   return (
//     <div className="container">
//       <div className="container2">
//         <div className="IPG">
//           {ipgs.map((ipg) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(ipg, {
//                   key: ipg.key,
//                   className: `${selectedValues[ipg.key]}-color`,
//                 })}
//                 {!isNaN(Number(ipg.key)) && (
//                   <div className="triple-toggle-ipg">
//                     <TripleToggle
//                       key={ipg.key}
//                       value={selectedValues[ipg.key]}
//                       quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, ipg.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           // value,
//                           // animation,
//                           quantity,
//                           ipg.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{ipg.key}</p> */}
//             </div>
//           ))}
//         </div>
//         <div className="left-contacts">
//           {leftContacts.map((Lcon) => (
//             <div className="image-item">
//               <div className="image-container">
//                 {React.cloneElement(Lcon, {
//                   key: Lcon.key,
//                   className: `${selectedValues[Lcon.key]}-color`,
//                 })}
//                 {!isNaN(Number(Lcon.key)) && (
//                   <div className="triple-toggle">
//                     <TripleToggle
//                       key={Lcon.key}
//                       value={selectedValues[Lcon.key]}
//                       quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
//                       onChange={(value) =>
//                         handleTripleToggleChange(value, Lcon.key)
//                       }
//                       onQuantityChange={(value, animation, quantity) =>
//                         handleQuantityChange(
//                           value,
//                           animation,
//                           quantity,
//                           Lcon.key,
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* <p className="image-key">{Lcon.key}</p> */}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="Elmodel-center">
//         {svgs.map((svg) => (
//           <div
//             className="image-item"
//             style={{ zIndex: calculateZIndex(svg.key) }}
//           >
//             <div className="image-container">
//               {React.cloneElement(svg, {
//                 key: svg.key,
//                 className: `${selectedValues[svg.key]}-color`,
//               })}
//               {!isNaN(Number(svg.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={svg.key}
//                     value={selectedValues[svg.key]}
//                     quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, svg.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, svg.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{svg.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="right-contacts">
//         {rightContacts.map((rCon) => (
//           <div className="image-item">
//             <div className="image-container">
//               {React.cloneElement(rCon, {
//                 key: rCon.key,
//                 className: `${selectedValues[rCon.key]}-color`,
//               })}
//               {!isNaN(Number(rCon.key)) && (
//                 <div className="triple-toggle">
//                   <TripleToggle
//                     key={rCon.key}
//                     value={selectedValues[rCon.key]}
//                     quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
//                     onChange={(value) =>
//                       handleTripleToggleChange(value, rCon.key)
//                     }
//                     onQuantityChange={(value, animation, quantity) =>
//                       handleQuantityChange(value, animation, quantity, rCon.key)
//                     }
//                   />
//                 </div>
//               )}
//             </div>
//             {/* <p className="image-key">{rCon.key}</p> */}
//           </div>
//         ))}
//       </div>
//       <div className="button-container">
//         <button
//           className="import-button"
//           onClick={() => fileInputRef.current.click()}
//         >
//           Import from LeadDBS
//         </button>
//         <button
//           className="export-button"
//           onClick={() => exportToJsonFile(tripleToggleData)}
//         >
//           Export to LeadDBS
//         </button>
//         <input
//           ref={fileInputRef}
//           className="file-input"
//           type="file"
//           accept=".json"
//           onChange={handleFileChange}
//           style={{ display: 'none' }} // Hide the input element
//         />
// <button onClick={calculateQuantitiesWithDistribution}>
//   Split Even
// </button>
// <button onClick={roundToHundred}>Make 100</button>
//       </div>
//     </div>
//   );
// }

// export default forwardRef(BostonCartesia);

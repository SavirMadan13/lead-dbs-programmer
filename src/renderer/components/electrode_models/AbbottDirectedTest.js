import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import TripleToggleTest from '../TripleToggleTest'; // Make sure to import TripleToggle correctly
import { getSwitchAnimation } from '../TripleToggleTest';
// import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
import './AbbottDirectedTest.css';
import { ReactComponent as IPG } from './images/IPG.svg';
import { ReactComponent as Contact } from './images/Contact.svg';
import { ReactComponent as Tail } from './images/Tail.svg';
import { ReactComponent as RightContact } from './images/RightContact.svg';
import { ReactComponent as LeftContact } from './images/LeftContact.svg';
import { ReactComponent as HeadTop } from './images/head_top.svg';
import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
// import { ReactComponent as UpArrow } from './images/UpArrow.svg';
// import { ReactComponent as DownArrow } from './images/DownArrow.svg';
// import { ReactComponent as ClockwiseArrow } from './images/ClockwiseArrow.svg';
// import { ReactComponent as CounterClockwiseArrow } from './images/CounterClockwiseArrow.svg';
import {
  handleClockwiseButton,
  handleCounterClockwiseButton,
} from './HelperFunctions';

function AbbottDirectedTest(props, ref) {
  // console.log('bc name=', props.name);
  const svgs = [
    <HeadTop key="headTop" />,
    <HeadBottom key="headBottom" />,
    <Contact key="8" level="4" name="4" />,
    <Contact key="5" level="3" face="center" name="3A" />,
    <Contact key="2" level="2" face="center" name="2A" />,
    <Contact key="1" level="1" name="1" />,
    <Tail key="tail" fill="transparent" />,
  ];

  const ipgs = [<IPG key="0" />];

  const rightContacts = [
    <Contact key="7" level="3" face="right" name="3C" />,
    <Contact key="4" level="2" face="right" name="2C" />,
  ];

  const leftContacts = [
    <Contact key="6" level="3" face="left" name="3B" />,
    <Contact key="3" level="2" face="left" name="2B" />,
  ];

  const level = {
    0: 0,
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
  };

  const face = {
    0: '',
    1: 'all',
    2: 'center',
    3: 'left',
    4: 'right',
    5: 'center',
    6: 'left',
    7: 'right',
    8: 'all',
  };

  const names = {
    0: 'IPG',
    1: '1',
    2: '2A',
    3: '2B',
    4: '2C',
    5: '3A',
    6: '3B',
    7: '3C',
    8: '4',
  };

  const [selectedValues, setSelectedValues] = useState(
    props.selectedValues || {
      0: 'right',
      1: 'left',
      2: 'left',
      3: 'left',
      4: 'left',
      5: 'left',
      6: 'left',
      7: 'left',
      8: 'left',
      // Initialize other images here
    },
  );
  const [quantities, setQuantities] = useState(
    props.quantities || {
      0: 100,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    },
  );

  const [lastChangedKey, setLastChangedKey] = useState(null);

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

  let isAssisted = false;

  const [lastChangedInstance, setLastChangedInstance] = useState({
    key: null,
    quantity: null,
    value: null,
    animation: null,
  });

  // Added to helpers
  const calculateQuantitiesWithDistribution = (selectedValues) => {
    const quantities = {
      left: 0,
      center: 0,
      right: 0,
    };

    // Calculate the quantity increment for 'center' and 'right' values
    // This is effectively the number of TripleToggle components that have a value of 'center'
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    let centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
    // THis is effectively the number of TripleToggle components that have a value of 'right'
    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    let rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

    // This finds the difference between
    if (lastChangedInstance.value === 'center') {
      centerQuantityIncrement =
        centerCount > 0
          ? (100 - lastChangedInstance.animation) / centerCount
          : 0;
    } else if (lastChangedInstance.value === 'right') {
      rightQuantityIncrement =
        rightCount > 0 ? (100 - lastChangedInstance.animation) / rightCount : 0;
    } else if (lastChangedInstance.value === 'left') {
      centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
      rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;
    }

    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (key !== lastChangedInstance.key) {
        if (value === 'left') {
          quantities[value] = 0;
        } else if (value === 'center') {
          quantities[value] = centerQuantityIncrement;
        } else if (value === 'right') {
          quantities[value] = rightQuantityIncrement;
        }
      } else if (key === lastChangedInstance.key) {
        quantities[value] = lastChangedInstance.quantity;
      }
    });

    return quantities;
  };

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

  // const calculateQuantitiesWithDistribution = () => {
  //   // Calculate the quantity increment for 'center' and 'right' values
  //   const centerCount = Object.values(selectedValues).filter(
  //     (value) => value === 'center',
  //   ).length;
  //   const centerQuantityIncrement = centerCount > 0 ? 100 / centerCount : 0;
  //   // console.log('CenterCount: ', centerCount);

  //   const rightCount = Object.values(selectedValues).filter(
  //     (value) => value === 'right',
  //   ).length;
  //   const rightQuantityIncrement = rightCount > 0 ? 100 / rightCount : 0;

  //   const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

  //   // Update the quantities based on selected values
  //   Object.keys(selectedValues).forEach((key) => {
  //     const value = selectedValues[key];
  //     // console.log("key="+key + ", value=" + value);
  //     if (value === 'left') {
  //       updatedQuantities[key] = 0;
  //     } else if (value === 'center') {
  //       updatedQuantities[key] = centerQuantityIncrement;
  //     } else if (value === 'right') {
  //       updatedQuantities[key] = rightQuantityIncrement;
  //     }
  //     // updatedQuantities[key] = 20;
  //   });

  //   // console.log(quantities);
  //   setQuantities(updatedQuantities);
  //   setSelectedValues(selectedValues);

  //   console.log(quantities); // Update the state with the new quantities
  // };

  // Added to helpers
  const roundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;
    const roundUpdatedQuantities = { ...quantities };

    // Calculate the sums for 'center' and 'right' values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'center') {
        totalCenterSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('CenterSum: ', totalCenterSum);
      } else if (value === 'right') {
        totalRightSum += parseFloat(roundUpdatedQuantities[key]);
        console.log('RightSum: ', totalRightSum);
      }
    });

    // Calculate the quantity increments
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = (100 - totalCenterSum) / centerCount;
    console.log('Center increment:', centerQuantityIncrement);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (100 - totalRightSum) / rightCount;

    // const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      if (value === 'left') {
        roundUpdatedQuantities[key] = 0;
      } else if (value === 'center') {
        roundUpdatedQuantities[key] =
          parseFloat(roundUpdatedQuantities[key]) + centerQuantityIncrement;
      } else if (value === 'right') {
        roundUpdatedQuantities[key] =
          parseFloat(roundUpdatedQuantities[key]) + rightQuantityIncrement;
      }
    });
    setQuantities(roundUpdatedQuantities); // Update the state with the new quantities
    console.log(roundUpdatedQuantities);
  };

  // Added to helpers
  function checkQuantitiesAndValues(quantity, value) {
    const updatedQuantities = { ...quantity };
    const updatedSelectedValues = { ...value };
    Object.keys(updatedQuantities).forEach((key) => {
      if (updatedQuantities[key] <= 0) {
        updatedSelectedValues[key] = 'left';
      }
      if (updatedSelectedValues[key] === 'left') {
        updatedQuantities[key] = 0;
      }
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  }

  /// //////////////////////// VECTOR //////////////////////////////
  // Need two vectors, one for each polarity
  // Important vector coords and constants
  const levelQuantities = {};
  let vectorLevel = 0;
  const vecCoords = [0, 0];
  let vectorDirection = 0;

  // Added to helpers
  const vectorMakeUp = () => {
    // Calculating the level
    const updatedQuantities = { ...quantities };
    // console.log(vectorLevel);
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] = 0;
    });
    Object.keys(level).forEach((key) => {
      levelQuantities[level[key]] =
        parseFloat(levelQuantities[level[key]]) +
        parseFloat(updatedQuantities[key]);
      // console.log(levelQuantities);
    });
    Object.keys(levelQuantities).forEach((levelQuantity) => {
      // console.log(vectorLevel);
      if (levelQuantity !== 0) {
        vectorLevel =
          parseFloat(vectorLevel) +
          parseFloat(
            (levelQuantity * parseFloat(levelQuantities[levelQuantity])) / 100,
          );
      }
    });
    console.log('VectorLevel: ', vectorLevel);
    console.log('LevelQuantities: ', levelQuantities);

    // Calculating the direction
    const faceTotals = {};
    // We want to get the faceTotals
    // Start by initializing the faceTotals variables
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] = 0;
    });
    // console.log(faceTotals);
    Object.keys(face).forEach((key) => {
      faceTotals[face[key]] =
        parseFloat(faceTotals[face[key]]) + parseFloat(updatedQuantities[key]);
    });
    // console.log(faceTotals);
    // Coordinates for each
    let aVec = [0, 0];
    let bVec = [0, 0];
    let cVec = [0, 0];
    const cos60 = Math.cos((60 * Math.PI) / 180);
    const cos30 = Math.cos((30 * Math.PI) / 180);
    const sin60 = Math.sin((60 * Math.PI) / 180);
    const sin30 = Math.sin((30 * Math.PI) / 180);
    Object.keys(faceTotals).forEach((key) => {
      if (key === 'left') {
        cVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(-faceTotals[key]) * cos30,
        ];
      } else if (key === 'center') {
        aVec = [faceTotals[key], 0];
      } else if (key === 'right') {
        bVec = [
          parseFloat(-faceTotals[key]) / 2,
          parseFloat(faceTotals[key]) * sin60,
        ];
      }
    });
    for (let i = 0; i < aVec.length; i++) {
      vecCoords[i] = aVec[i] + bVec[i] + cVec[i];
    }
    vectorDirection = (Math.atan(vecCoords[1] / vecCoords[0]) * 180) / Math.PI;
    console.log('VecCoords', vecCoords);
    console.log(bVec);
  };

  /// ///////////////////////////////////// DBS Controller ////////////////////////////////

  // const handleUpButton = () => {
  //   // Create a copy of the current quantities
  //   const updatedQuantities = { ...quantities };

  //   for (const key in selectedValues) {
  //     if (selectedValues.hasOwnProperty(key)) {
  //       const currentLevel = level[key];
  //       const aboveLevel = currentLevel + 1;

  //       if (!isNaN(aboveLevel) && aboveLevel <= 4) {
  //         // Ensure the level above exists and is within the valid range (adjust 4 as needed)

  //         // Check if the quantity is not zero
  //         if (updatedQuantities[key] !== 0) {
  //           const keyAbove = Object.keys(level).find((k) => level[k] === aboveLevel);

  //           if (keyAbove) {
  //             // Subtract 10 from the current instance's quantity
  //             updatedQuantities[key] -= 10;

  //             // Add 10 to the instance at the level above
  //             updatedQuantities[keyAbove] += 10;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   // Update the quantities state with the updated quantities
  //   setQuantities(updatedQuantities);
  // };

  // Thing that needs to be fixed is need to find how many items are 'on' on a level, and then
  // change the - (updatedQuantities[key]) by 10/#on contacts on level

  // const handleUpButton = () => {
  //   // Create a copy of the current quantities
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };

  //   Object.keys(selectedValues).forEach((key) => {
  //     const currentLevel = level[key];
  //     const aboveLevel = currentLevel + 1;
  //     const superAboveLevel = aboveLevel + 1;

  //     // if (!isNaN(aboveLevel) && aboveLevel <= 4) {
  //     // Ensure the level above exists and is within the valid range (adjust 4 as needed)

  //     // Check if the quantity is not zero
  //     if (updatedQuantities[key] !== 0) {
  //       const keyAbove = Object.keys(level).find(
  //         (k) => level[k] === aboveLevel,
  //       );
  //       if (keyAbove && level[key] !== 0) {
  //         // Subtract 10 from the current instance's quantites
  //         // Add 10 to the instance at the level above
  //         const keySuperAbove = Object.keys(level).find(
  //           (k) => level[k] === superAboveLevel,
  //         );
  //         // if (keySuperAbove)
  //         if (selectedValues[keyAbove] === 'left') {
  //           // selectedValues[keyAbove] = selectedValues[key];
  //           updatedSelectedValues[keyAbove] = selectedValues[key];
  //         }
  //         updatedQuantities[key] -= 10;
  //         updatedQuantities[keyAbove] += 10;
  //       }
  //     }
  //     // }
  //   });

  //   // Update the quantities state with the updated quantities
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  // };

  // const handleClockwiseButton = () => {
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   Object.keys(selectedValues)
  //     .reverse()
  //     .forEach((key) => {
  //       const currentLevel = level[key];
  //       const nextKey = parseFloat(key) + 1;
  //       const previousKey = parseFloat(key) - 1;
  //       const rightNextKey = parseFloat(key) - 2;
  //       const centerpreviousKey = parseFloat(key) + 2;
  //       const currentFace = face[key];

  //       if (updatedQuantities[key] === 0) {
  //         updatedSelectedValues[key] = 'left';
  //       }
  //       const currentKeys = Object.keys(level).filter(
  //         (k) => level[k] === currentLevel,
  //       );
  //       let currentLeftCount = 0;
  //       let currentCenterCount = 0;
  //       let currentRightCount = 0;
  //       currentKeys.forEach((currentKey) => {
  //         const value = updatedSelectedValues[currentKey];
  //         if (value === 'left') {
  //           currentLeftCount += 1;
  //         } else if (value === 'center') {
  //           currentCenterCount += 1;
  //         } else if (value === 'right') {
  //           currentRightCount += 1;
  //         }
  //       });
  //       if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[nextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[nextKey] = updatedSelectedValues[key];
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (
  //         face[key] === 'center' &&
  //         updatedQuantities[centerpreviousKey] === 0
  //       ) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[nextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[nextKey] = updatedSelectedValues[key];
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (face[key] === 'right' && updatedQuantities[previousKey] === 0) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (
  //             updatedSelectedValues[key] === updatedSelectedValues[rightNextKey]
  //           ) {
  //             updatedQuantities[rightNextKey] =
  //               parseFloat(updatedQuantities[rightNextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[rightNextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[rightNextKey] = updatedSelectedValues[key];
  //             updatedQuantities[rightNextKey] =
  //               parseFloat(updatedQuantities[rightNextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (updatedQuantities[key] === 0) {
  //         updatedSelectedValues[key] = 'left';
  //       }
  //     });
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  //   // vectorMakeUp();
  //   // console.log('VecDirection: ', vectorDirection);
  //   // checkQuantitiesAndValues(quantities, selectedValues);
  // };

  // const handleCounterClockwiseButton = () => {
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   Object.keys(selectedValues)
  //     .reverse()
  //     .forEach((key) => {
  //       const currentLevel = level[key];
  //       const nextKey = parseFloat(key) - 1;
  //       const previousKey = parseFloat(key) + 1;
  //       const centerNextKey = parseFloat(key) + 2;
  //       // const centerpreviousKey = parseFloat(key) - 1;
  //       const rightPreviousKey = parseFloat(key) - 2;
  //       const currentFace = face[key];

  //       if (updatedQuantities[key] === 0) {
  //         updatedSelectedValues[key] = 'left';
  //       }
  //       const currentKeys = Object.keys(level).filter(
  //         (k) => level[k] === currentLevel,
  //       );
  //       let currentLeftCount = 0;
  //       let currentCenterCount = 0;
  //       let currentRightCount = 0;
  //       currentKeys.forEach((currentKey) => {
  //         const value = updatedSelectedValues[currentKey];
  //         if (value === 'left') {
  //           currentLeftCount += 1;
  //         } else if (value === 'center') {
  //           currentCenterCount += 1;
  //         } else if (value === 'right') {
  //           currentRightCount += 1;
  //         }
  //       });
  //       if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[nextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[nextKey] = updatedSelectedValues[key];
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (face[key] === 'center' && updatedQuantities[previousKey] === 0) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (
  //             updatedSelectedValues[key] ===
  //             updatedSelectedValues[centerNextKey]
  //           ) {
  //             updatedQuantities[centerNextKey] =
  //               parseFloat(updatedQuantities[centerNextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[centerNextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
  //             updatedQuantities[centerNextKey] =
  //               parseFloat(updatedQuantities[centerNextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (
  //         face[key] === 'right' &&
  //         updatedQuantities[rightPreviousKey] === 0
  //       ) {
  //         if (updatedSelectedValues[key] !== 'left') {
  //           if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           } else if (updatedSelectedValues[nextKey] === 'left') {
  //             console.log('HelloHello');
  //             updatedSelectedValues[nextKey] = updatedSelectedValues[key];
  //             updatedQuantities[nextKey] =
  //               parseFloat(updatedQuantities[nextKey]) + 10;
  //             updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           }
  //         }
  //       }
  //       if (updatedQuantities[key] === 0) {
  //         updatedSelectedValues[key] = 'left';
  //       }
  //     });
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  //   // checkQuantitiesAndValues(quantities, selectedValues);
  // };



  // Added to helpers
  const handleClearButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = 0;
      updatedSelectedValues[key] = 'left';
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  // Added to helpers
  function segmentedContact(aKey) {
    const counter = 0;
    Object.keys(level).forEach((key) => {
      if (level[key] === level[aKey]) {
        counter += 1;
      }
    });
    if (counter > 1) {
      return true;
    } else {
      return false;
    }
  }

  // Added to helpers
  function getOnContacts(aLevel) {
    const onContacts = [];
    Object.keys(level).forEach((key) => {
      if (level[key] === aLevel && selectedValues[key] !== 'left') {
        onContacts.push(key);
      }
    });
    return onContacts;
  }
  // For clear button

  // Added to helpers
  const newHandleUpButton = () => {
    vectorMakeUp();
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelIncrement = 0.1;
    const previousLevel = Math.floor(vectorLevel);
    vectorLevel += levelIncrement;
    const currentLevel = Math.floor(vectorLevel);
    console.log('currentLevel: ', currentLevel);
    console.log('previousLevel: ', previousLevel);
    const levelBelow =
      currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelAbove = levelBelow + 1;
    // if (vectorLevel % 1 === 0) {
    //   levelBelow -= 1;
    // }
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = vectorLevel - levelBelow;
    const levelBelowQuantityTotal = 100 * (1 - percDiff);
    const levelAboveQuantityTotal = 100 - levelBelowQuantityTotal;
    // Want to figure out how many contacts are "on" at a level
    // const levelBelowCount = 0;
    // const levelAboveCount = 0;
    // Object.keys(selectedValues).forEach((key) => {
    //   if ((level[key] === levelBelow) && (selectedValues[key] !== 'left')) {
    //     levelBelowCount += 1;
    //   }
    //   if ((level[key] === levelAbove) && (selectedValues[key] !== )) {

    //   }
    // });
    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    console.log('On Contacts', onContacts);
    Object.keys(level).forEach((key) => {
      // dealing with level below
      // vectorMakeUp();
      if (level[key] === levelBelow) {
        if (face[key] === 'all') {
          updatedQuantities[key] = levelBelowQuantityTotal;
        } else if (face[key] !== 'all' && numOnContacts !== 0) {
          for (let i = 0; i < numOnContacts; i++) {
            updatedQuantities[onContacts[i]] =
              // parseFloat(updatedQuantities[onContacts[i]]) -
              levelBelowQuantityTotal / parseFloat(numOnContacts);
          }
          // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
        }
        // if (levelBelowQuantityTotal === 0) {
        //   updatedSelectedValues[key] = 'left';
        // }
      }
      if (level[key] === levelAbove) {
        if (face[key] !== 'all') {
          for (let i = 0; i < numAboveOnContacts; i++) {
            if (face[key] === face[aboveOnContacts[i]]) {
              updatedQuantities[key] =
                levelAboveQuantityTotal / numAboveOnContacts;
              console.log('UpdatedQuantitie: ', updatedQuantities);
              if (updatedQuantities[key] !== 0) {
                updatedSelectedValues[key] =
                  updatedSelectedValues[aboveOnContacts[i]];
              }
            }
          }
          setSelectedValues(updatedSelectedValues);
          setQuantities(updatedQuantities);
          const newaboveOnContacts = getOnContacts(levelAbove);
          const newnumAboveOnContacts = newaboveOnContacts.length;
          if (newnumAboveOnContacts === 0) {
            console.log('hello');
            updatedQuantities[key] = levelAboveQuantityTotal / 3;
            updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
            // if (updatedQuantities[key] !== 0) {
            //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
            // }
          }
        } else if (face[key] === 'all') {
          updatedQuantities[key] = levelAboveQuantityTotal;
          if (updatedQuantities[key] !== 0) {
            updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
          }
        }
      }
    });
    // Object.keys(updatedQuantities).forEach((key) => {
    //   if (level[key] !== levelAbove || levelBelow) {
    //     updatedQuantities[key] = 0;
    //     updatedSelectedValues[key] = 'left';
    //   }
    // });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  // Added to helpers
  const newHandleDownButton = () => {
    vectorMakeUp();
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    const levelIncrement = 0.1;
    const previousLevel = Math.ceil(vectorLevel);
    vectorLevel -= levelIncrement;
    const currentLevel = Math.ceil(vectorLevel);
    console.log('currentLevel: ', currentLevel);
    console.log('previousLevel: ', previousLevel);
    const levelAbove =
      currentLevel !== previousLevel ? previousLevel : Math.ceil(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelBelow = levelAbove - 1;
    // if (vectorLevel % 1 === 0) {
    //   levelBelow -= 1;
    // }
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = Math.abs(vectorLevel - levelAbove);
    const levelAboveQuantityTotal = 100 * (1 - percDiff);
    const levelBelowQuantityTotal = 100 - levelAboveQuantityTotal;
    // Want to figure out how many contacts are "on" at a level
    // const levelBelowCount = 0;
    // const levelAboveCount = 0;
    // Object.keys(selectedValues).forEach((key) => {
    //   if ((level[key] === levelBelow) && (selectedValues[key] !== 'left')) {
    //     levelBelowCount += 1;
    //   }
    //   if ((level[key] === levelAbove) && (selectedValues[key] !== )) {

    //   }
    // });
    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    console.log('On Contacts', aboveOnContacts);
    Object.keys(level)
      .reverse()
      .forEach((key) => {
        // dealing with level above, the one that is passing current
        // vectorMakeUp();
        if (level[key] === levelAbove) {
          console.log('level Above: ', levelAbove);
          if (face[key] === 'all') {
            updatedQuantities[key] = levelAboveQuantityTotal;
          } else if (face[key] !== 'all' && numAboveOnContacts !== 0) {
            for (let i = 0; i < numAboveOnContacts; i++) {
              updatedQuantities[aboveOnContacts[i]] =
                // parseFloat(updatedQuantities[onContacts[i]]) -
                levelAboveQuantityTotal / parseFloat(numAboveOnContacts);
            }
            // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
          }
          // if (levelBelowQuantityTotal === 0) {
          //   updatedSelectedValues[key] = 'left';
          // }
        }
        if (level[key] === levelBelow) {
          if (face[key] !== 'all') {
            for (let i = 0; i < numAboveOnContacts; i++) {
              if (face[key] === face[aboveOnContacts[i]]) {
                console.log('passed');
                updatedQuantities[key] =
                  levelBelowQuantityTotal / numAboveOnContacts;
                console.log('UpdatedQuantitie: ', updatedQuantities);
                if (updatedQuantities[key] !== 0) {
                  updatedSelectedValues[key] =
                    updatedSelectedValues[aboveOnContacts[i]];
                }
              }
            }
            // console.log(updatedQuantities);
            // console.log(updatedSelectedValues);
            setSelectedValues(updatedSelectedValues);
            setQuantities(updatedQuantities);
            const newaboveOnContacts = getOnContacts(levelBelow);
            const newnumAboveOnContacts = newaboveOnContacts.length;
            if (newnumAboveOnContacts === 0) {
              console.log('hello');
              updatedQuantities[key] = levelBelowQuantityTotal / 3;
              updatedSelectedValues[key] =
                updatedSelectedValues[aboveOnContacts[0]];
              // if (updatedQuantities[key] !== 0) {
              //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
              // }
            } else if (newnumAboveOnContacts !== 0) {
              updatedQuantities[key] = levelBelowQuantityTotal / 3;
            }
          } else if (face[key] === 'all') {
            updatedQuantities[key] = levelBelowQuantityTotal;
            if (updatedQuantities[key] !== 0) {
              updatedSelectedValues[key] =
                updatedSelectedValues[aboveOnContacts[0]];
            }
          }
        }
      });
    // Object.keys(updatedQuantities).forEach((key) => {
    //   if (level[key] !== levelAbove || levelBelow) {
    //     updatedQuantities[key] = 0;
    //     updatedSelectedValues[key] = 'left';
    //   }
    // });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  // const assistedMode = () => {
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   let negativeSum = 0;
  //   let positiveSum = 0;
  //   let negativeModifiedKey = null;
  //   let positiveModifiedKey = null;

  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (updatedSelectedValues[key] === 'center') {
  //       negativeSum += updatedQuantities[key];
  //     } else if (updatedSelectedValues[key] === 'right') {
  //       positiveSum += updatedQuantities[key];
  //     }
  //   });

  //   // if (negativeSum !== 100) {
  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (updatedSelectedValues[key] === 'center') {
  //       if (updatedQuantities[key] !== quantities[key]) {
  //         negativeModifiedKey = key;
  //         // eslint-disable-next-line prettier/prettier
  //         return negativeModifiedKey;
  //       }
  //     }
  //     if (updatedSelectedValues[key] === 'right') {
  //       if (updatedQuantities[key] !== quantities[key]) {
  //         positiveModifiedKey = key;
  //         return positiveModifiedKey;
  //       }
  //     }
  //   });
  //   // }
  //   if (negativeSum !== 100) {
  //     const negativeDifference = 100 - parseFloat(negativeSum);
  //     Object.keys(updatedQuantities).forEach((key) => {
  //       if (
  //         key !== negativeModifiedKey &&
  //         updatedSelectedValues[key] === 'center'
  //       ) {
  //         updatedQuantities[key] += parseFloat(negativeDifference);
  //         return updatedQuantities;
  //       }
  //     });
  //   }
  //   if (positiveSum !== 100) {
  //     const positiveDifference = 100 - parseFloat(positiveSum);
  //     Object.keys(updatedQuantities).forEach((key) => {
  //       if (
  //         key !== positiveModifiedKey &&
  //         updatedSelectedValues[key] === 'right'
  //       ) {
  //         updatedQuantities[key] += parseFloat(positiveDifference);
  //         return updatedQuantities[key];
  //       }
  //     });
  //   }
  // };

  const [assistedModeEnabled, setAssistedModeEnabled] = useState(false);

  // Added to helpers
  function assistedMode() {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    let negativeSum = 0;
    let positiveSum = 0;
    let negativeModifiedKey = null;
    let positiveModifiedKey = null;
    let centerCount = 0;
    let rightCount = 0;

    Object.keys(updatedQuantities).forEach((key) => {
      if (updatedSelectedValues[key] === 'center') {
        negativeSum += parseFloat(updatedQuantities[key]);
        centerCount += 1;
        console.log('negativeSum: ', negativeSum);
      } else if (updatedSelectedValues[key] === 'right') {
        positiveSum += parseFloat(updatedQuantities[key]);
        rightCount += 1;
        console.log('positiveSum: ', positiveSum);
      }
    });

    Object.keys(updatedQuantities).find((key) => {
      if (updatedSelectedValues[key] === 'center') {
        if (key === lastChangedKey) {
          negativeModifiedKey = key;
          console.log('negativeModifiedKey: ', negativeModifiedKey);
          return true; // exit loop
        }
      }
      if (updatedSelectedValues[key] === 'right') {
        if (key === lastChangedKey) {
          positiveModifiedKey = key;
          console.log('positiveModifiedKey: ', positiveModifiedKey);
          return true; // exit loop
        }
      }
      return false; // continue looping
    });

    if (negativeSum !== 100) {
      const negativeDifference = 100 - parseFloat(negativeSum);
      Object.keys(updatedQuantities).forEach((key) => {
        if (
          key !== negativeModifiedKey &&
          updatedSelectedValues[key] === 'center' &&
          centerCount <= 2
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) + parseFloat(negativeDifference);
        } else if (
          key !== negativeModifiedKey &&
          updatedSelectedValues[key] === 'center'
        ) {
          console.log('passed');
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) +
            parseFloat(negativeDifference / (centerCount - 1));
        }
      });
      console.log('negative difference: ', negativeDifference);
    }

    if (positiveSum !== 100) {
      const positiveDifference = 100 - parseFloat(positiveSum);
      Object.keys(updatedQuantities).forEach((key) => {
        if (
          key !== positiveModifiedKey &&
          updatedSelectedValues[key] === 'right' &&
          rightCount <= 2
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) + parseFloat(positiveDifference);
        } else if (
          key !== positiveModifiedKey &&
          updatedSelectedValues[key] === 'right'
        ) {
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) +
            parseFloat(positiveDifference / (rightCount - 1));
        }
      });
    }
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    return quantities; // Return the modified quantities
  }

  // Added to helpers
  function assist() {
    isAssisted = !isAssisted;
    if (isAssisted) {
      console.log('isAssisted: ', isAssisted);
      assistedMode();
    }
  }

  const handleQuantityChange = (quantity, key) => {
    // setQuantities((prevQuantities) => ({
    //   ...prevQuantities,
    //   [key]: quantity,
    // }));
    const updatedQuantities = { ...quantities, [key]: quantity };
    ////////Steering for two components logic///////
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    // console.log('Center Count: ', centerCount);
    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;

    // if (centerCount === 2 || rightCount === 2) {
    //   const newQuantities = calculateQuantitiesForTwo();
    //   setQuantities(newQuantities);
    // }
    // assist();
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
    console.log('lastChangedKey: ', lastChangedKey);
    if (assistedModeEnabled) {
      const newQuantities = assistedMode();
      setQuantities(newQuantities);
    }
  };

  // useEffect(() => {
  //   let assistedModeInterval;

  //   if (assistedModeEnabled) {
  //     assistedModeInterval = setInterval(() => {
  //       assistedMode();
  //     }, 1000); // Adjust the interval time as needed
  //   } else {
  //     clearInterval(assistedModeInterval);
  //   }

  //   return () => clearInterval(assistedModeInterval);
  // }, [assistedModeEnabled]);

  // const focalizeCurrent = () => {
  //   vectorMakeUp();
  //   // Want to understand the position of the vector with relation to the other contacts
  //   const aVecDirection = 0;
  //   const bVecDirection = 120;
  //   const cVecDirection = 240;
  //   // Now want to see where the vector is positioned in relation to these three vectors
  //   let relativeVecDirection = null;
  //   const posVectorDirection = Math.abs(vectorDirection);
  //   // if (posVectorDirection >= aVecDirection) {
  //   if (posVectorDirection < bVecDirection) {
  //     relativeVecDirection = 'ab';
  //   } else if (posVectorDirection < cVecDirection) {
  //     relativeVecDirection = 'bc';
  //   } else if (posVectorDirection === aVecDirection) {
  //     relativeVecDirection = 'a';
  //   } else if (posVectorDirection === bVecDirection) {
  //     relativeVecDirection = 'b';
  //   } else if (posVectorDirection === cVecDirection) {
  //     relativeVecDirection = 'c';
  //   } else {
  //     relativeVecDirection = 'ca';
  //   }
  //   // }
  //   // We now have the position of the vector with relation to the other three contact vectors
  //   // Need to get the total of the contacts
  //   // Object.keys(selectedValues).forEach((key) => {

  //   // })
  // };
  // }
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
          // quantity: quantities[selectedValues[key]],
          quantity: quantities[key],
        });
      }
    }
    return data;
  };

  const getStateQuantities = () => {
    return quantities;
  };

  const getStateSelectedValues = () => {
    return selectedValues;
  };

  useImperativeHandle(ref, () => ({
    getCartesiaData,
    getStateQuantities,
    getStateSelectedValues,
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
                    <TripleToggleTest
                      key={ipg.key}
                      value={selectedValues[ipg.key]}
                      // quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
                      quantity={quantities[ipg.key]}
                      onChange={(value) =>
                        handleTripleToggleChange(value, ipg.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(quantity, ipg.key)
                      }
                      // onQuantityChange={(value, animation, quantity) =>
                      //   handleQuantityChange(
                      //     value,
                      //     animation,
                      //     quantity,
                      //     ipg.key,
                      //   )
                      // }
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
                    <TripleToggleTest
                      key={Lcon.key}
                      value={selectedValues[Lcon.key]}
                      // quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
                      quantity={quantities[Lcon.key]} // Pass the quantity prop
                      onChange={(value) =>
                        handleTripleToggleChange(value, Lcon.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(quantity, Lcon.key)
                      }
                      level={Lcon.level}
                      face={Lcon.face}
                      // onQuantityChange={(value, animation, quantity) =>
                      //   handleQuantityChange(
                      //     value,
                      //     animation,
                      //     quantity,
                      //     Lcon.key,
                      //   )
                      // }
                    />
                  </div>
                  // <p>{Lcon.name}</p>
                )}
              </div>
              {/* <p className="image-key">{names[Lcon.key]}</p> */}
              <p className="left-image-name">{names[Lcon.key]}</p>
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
                  <TripleToggleTest
                    key={svg.key}
                    value={selectedValues[svg.key]}
                    // quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
                    quantity={quantities[svg.key]}
                    // quantity={100}
                    onChange={(value) =>
                      handleTripleToggleChange(value, svg.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(quantity, svg.key)
                    }
                    level={svg.level}
                    face={svg.face}
                    // onQuantityChange={(value, animation, quantity) =>
                    //   handleQuantityChange(value, animation, quantity, svg.key)
                    // }
                  />
                </div>
              )}
            </div>
            <p className="center-image-name">{names[svg.key]}</p>
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
                  <TripleToggleTest
                    key={rCon.key}
                    value={selectedValues[rCon.key]}
                    // quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
                    quantity={quantities[rCon.key]}
                    onChange={(value) =>
                      handleTripleToggleChange(value, rCon.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(quantity, rCon.key)
                    }
                    level={rCon.level}
                    face={rCon.face}
                    // onQuantityChange={(value, animation, quantity) =>
                    //   handleQuantityChange(value, animation, quantity, rCon.key)
                    // }
                  />
                </div>
              )}
            </div>
            {/* <p className="image-key">{rCon.key}</p> */}
            <p className="center-image-name">{names[rCon.key]}</p>
          </div>
        ))}
      </div>
      <div className="button-container">
        {/* <button
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
        </button> */}
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
        <div className="button-container">
          {/* <h2>Contact Share</h2> */}
          {/* <button
            onClick={calculateQuantitiesWithDistribution}
            className="button"
          >
            Split Even
          </button>
          <button onClick={roundToHundred} className="button">
            Refactor
          </button> */}
          <button onClick={handleClearButton} className="button">
            Clear
          </button>
          {/* <button
            onClick={assist}
            className={isAssisted ? 'isAssistedButton' : 'button'}
          >
            Assisted
          </button> */}
        </div>
        {/* <div className="button-container">
          <h2>Steering</h2>
          <div className="steering-container">
            <UpArrow onClick={newHandleUpButton} />
            <DownArrow onClick={newHandleDownButton} />
            <ClockwiseArrow
              onClick={() =>
                handleClockwiseButton(
                  quantities,
                  selectedValues,
                  level,
                  face,
                  setSelectedValues,
                  setQuantities,
                )
              }
            />
            <CounterClockwiseArrow
              onClick={() =>
                handleCounterClockwiseButton(
                  quantities,
                  selectedValues,
                  level,
                  face,
                  setSelectedValues,
                  setQuantities,
                )
              }
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default forwardRef(AbbottDirectedTest);

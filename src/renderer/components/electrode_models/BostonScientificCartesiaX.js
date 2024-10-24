// /* eslint-disable no-restricted-globals */
// /* eslint-disable react/prop-types */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react/function-component-definition */

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
// import Popup from 'reactjs-popup';
import TripleToggleTest from '../TripleToggleTest'; // Make sure to import TripleToggle correctly
import calculateQuantities from '../CalculateQuantities'; // Correct the path to quantityUtils
// import './BostonScientificCartesiaHX.css';
import { ReactComponent as IPG } from './images/IPG.svg';
import { ReactComponent as Contact } from './images/Contact.svg';
import { ReactComponent as Tail } from './images/Tail.svg';
import { ReactComponent as RightContact } from './images/RightContact.svg';
import { ReactComponent as LeftContact } from './images/LeftContact.svg';
import { ReactComponent as HeadTop } from './images/head_top.svg';
import { ReactComponent as HeadBottom } from './images/head_bottom.svg';
import { ReactComponent as UpArrow } from './images/UpArrow.svg';
import { ReactComponent as DownArrow } from './images/DownArrow.svg';
import { ReactComponent as ClockwiseArrow } from './images/ClockwiseArrow.svg';
import { ReactComponent as CounterClockwiseArrow } from './images/CounterClockwiseArrow.svg';
import { ReactComponent as ForwardButton } from './images/FrontButton.svg';
import { ReactComponent as BackButton } from './images/BackButton.svg';
import { ReactComponent as LeftButton } from './images/LeftButton.svg';
import { ReactComponent as RightButton } from './images/RightButton.svg';
import { ReactComponent as SplitEvenButton } from './images/SplitEvenButton.svg';
import StaticExample from '../StaticExample';
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
import PercentageAmplitudeToggle from '../PercentageAmplitudeToggle';
import AssistedToggle from '../AssistedToggle';
import VoltageAmplitudeToggle from '../VoltageAmplitudeToggle';
import MAToggleSwitch from '../MAToggleSwitch';
import { OverlayTrigger } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import { relative } from 'path';

function BostonScientificCartesiaX(props, ref) {
  // console.log('bc name=', props.name);
  const svgs = [
    <HeadTop key="headTop" />,
    <HeadBottom key="headBottom" />,
    <Contact key="16" level="6" face="center" />,
    <Contact key="13" level="5" face="center" />,
    <Contact key="10" level="4" face="center" />,
    <Contact key="7" level="3" face="center" />,
    <Contact key="4" level="2" face="center" />,
    <Contact key="1" level="1" face="center" />,
  ];

  const ipgs = [<IPG key="0" />];

  const rightContacts = [
    <Contact key="14" level="5" face="right" />,
    <Contact key="11" level="4" face="right" />,
    <Contact key="8" level="3" face="right" />,
    <Contact key="5" level="2" face="right" />,
    <Contact key="2" level="1" face="right" />,
  ];

  const leftContacts = [
    <Contact key="15" level="6" face="left" />,
    <Contact key="12" level="3" face="left" />,
    <Contact key="9" level="2" face="left" />,
    <Contact key="6" level="3" face="left" />,
    <Contact key="3" level="2" face="left" />,
  ];

  const level = {
    0: 0,
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
    11: 4,
    12: 4,
    13: 5,
    14: 5,
    15: 5,
    16: 6,
  };

  const levelArray = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12],
    5: [13, 14, 15],
  };

  const face = {
    0: '',
    1: 'center',
    2: 'left',
    3: 'right',
    4: 'center',
    5: 'left',
    6: 'right',
    7: 'center',
    8: 'left',
    9: 'right',
    10: 'center',
    11: 'left',
    12: 'right',
    13: 'center',
    14: 'left',
    15: 'right',
    16: 'all',
  };

  const names = {
    0: IPG,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
  };

  const [percAmpToggle, setPercAmpToggle] = useState('left');

  const [calculateQuantities, setCalculateQuantities] = useState(false);

  const handleCalculateQuantitiesButtonClick = () => {
    setCalculateQuantities((prev) => !prev);
  };

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

  const initialQuantities = {
    plus: 0,
    minus: 0,
  };

  const [totalAmplitude, setTotalAmplitude] = useState(
    props.totalAmplitude || 0,
  );

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
      9: 'left',
      10: 'left',
      11: 'left',
      12: 'left',
      13: 'left',
      14: 'left',
      15: 'left',
      16: 'left',
      // Initialize other images here
    },
  );

  const [animation, setAnimation] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null,
    13: null,
    14: null,
    15: null,
    16: null,
  });

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
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
    },
  );
  // const [userQuantities, setUserQuantities] = useState({}); // Store user input quantities

  const [parameters, setParameters] = useState(
    props.parameters || {
      parameter1: '60',
      parameter2: '130',
      parameter3: '0',
    },
  );

  const [visModel, setVisModel] = useState(props.visModel || '');

  const [sessionTitle, setSessionTitle] = useState(props.sessionTitle || '');

  const totalQuantity = quantities.plus + quantities.minus;
  let isAssisted = false;

  const [lastChangedInstance, setLastChangedInstance] = useState({
    key: null,
    quantity: null,
    value: null,
    animation: null,
  });

  const calculateLevelTotals = () => {
    const levelTotals = {};
    Object.keys(level).forEach((key) => {
      levelTotals[level[key]] = 0;
    });
    Object.keys(level).forEach((key) => {
      levelTotals[level[key]] =
        parseFloat(levelTotals[level[key]]) + parseFloat(quantities[key]);
      // console.log(levelQuantities);
    });
    return levelTotals;
  };
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

  // console.log('Values: ', selectedValues);

  const calculateQuantitiesForTwo = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    // This is effectively the number of TripleToggle components that have a value of 'center'
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'right') {
      total = totalAmplitude;
    }
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    let centerQuantityIncrement = centerCount > 0 ? total / centerCount : 0;
    // THis is effectively the number of TripleToggle components that have a value of 'right'
    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    let rightQuantityIncrement = rightCount > 0 ? total / rightCount : 0;

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
      // if (key !== lastChangedInstance.key) {
      if (value === 'left') {
        quantities[value] = 0;
      } else if (value === 'center') {
        quantities[value] = centerQuantityIncrement;
      } else if (value === 'right') {
        quantities[value] = rightQuantityIncrement;
      }
      // } else if (key === lastChangedInstance.key) {
      //   quantities[value] = lastChangedInstance.quantity;
      // }
    });

    return quantities;
  };

  // Define the handleQuantityChange function to update the quantity for a specific key and value
  // const handleQuantityChange = (quantity, key) => {
  //   // setQuantities((prevQuantities) => ({
  //   //   ...prevQuantities,
  //   //   [key]: quantity,
  //   // }));
  //   const updatedQuantities = { ...quantities, [key]: quantity };
  //   ////////Steering for two components logic///////
  //   const centerCount = Object.values(selectedValues).filter(
  //     (value) => value === 'center',
  //   ).length;
  //   // console.log('Center Count: ', centerCount);
  //   const rightCount = Object.values(selectedValues).filter(
  //     (value) => value === 'right',
  //   ).length;

  //   if (centerCount === 2 || rightCount === 2) {
  //     const newQuantities = calculateQuantitiesForTwo();
  //     setQuantities(newQuantities);
  //   }
  //   setQuantities(updatedQuantities);
  //   assist();
  // };

  const calculateQuantitiesWithDistribution = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'right') {
      total = totalAmplitude;
    }
    console.log('total: ', total);
    const centerCount = Object.values(selectedValues).filter(
      (value) => value === 'center',
    ).length;
    const centerQuantityIncrement = centerCount > 0 ? total / centerCount : 0;
    // console.log('CenterCount: ', centerCount);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = rightCount > 0 ? total / rightCount : 0;

    const updatedQuantities = { ...quantities }; // Create a copy of the quantities object

    // Update the quantities based on selected values
    Object.keys(selectedValues).forEach((key) => {
      const value = selectedValues[key];
      // console.log("key="+key + ", value=" + value);
      if (value === 'left') {
        updatedQuantities[key] = 0;
      } else if (value === 'center') {
        console.log('CENTER: ', centerQuantityIncrement);
        updatedQuantities[key] = centerQuantityIncrement;
        console.log('updated: ', updatedQuantities);
      } else if (value === 'right') {
        updatedQuantities[key] = rightQuantityIncrement;
      }
      // updatedQuantities[key] = 20;
    });

    // console.log(quantities);
    setQuantities(updatedQuantities);
    // setSelectedValues(selectedValue);

    console.log(quantities);
    // Update the state with the new quantities
  };

  const handleIPGLogic = () => {
    if (props.IPG === 'Abbott') {
      calculateQuantitiesWithDistribution();
    }
  };

  const handleTripleToggleChange = (value, anime, key) => {
    const updatedSelectedValues = { ...selectedValues, [key]: value };
    const updatedAnimationValues = { ...animation, [key]: anime };
    const updatedQuantities = { ...quantities };
    setSelectedValues(updatedSelectedValues);
    setAnimation(updatedAnimationValues);
    console.log(animation);
    if (props.IPG === 'Abbott') {
      console.log('1');
      console.log(selectedValues);
      Object.keys(updatedSelectedValues).forEach((thing) => {
        const newvalue = updatedSelectedValues[thing];
        // console.log("key="+key + ", value=" + value);
        if (newvalue === 'left') {
          updatedQuantities[key] = 0;
        } else if (newvalue === 'center') {
          // console.log('CENTER: ', centerQuantityIncrement);
          updatedQuantities[key] = 10;
          console.log('updated: ', updatedQuantities);
        } else if (newvalue === 'right') {
          updatedQuantities[key] = 10;
          console.log('updated: ', updatedQuantities);
        }
        // updatedQuantities[key] = 20;
      });
      console.log('2');
    }
    setQuantities(updatedQuantities);
    // console.log('quani: ', quantities);
    // // handleIPGLogic();
  };

  const roundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;
    const roundUpdatedQuantities = { ...quantities };

    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'right') {
      total = totalAmplitude;
    }

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
    const centerQuantityIncrement = (total - totalCenterSum) / centerCount;
    console.log('Center increment:', centerQuantityIncrement);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (total - totalRightSum) / rightCount;

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

  const newRoundToHundred = () => {
    // Initialize sum variables
    let totalCenterSum = 0;
    let totalRightSum = 0;
    const roundUpdatedQuantities = { ...quantities };

    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'right') {
      total = totalAmplitude;
    }

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
    const centerQuantityIncrement = (total - totalCenterSum) / centerCount;
    console.log('Center increment:', centerQuantityIncrement);

    const rightCount = Object.values(selectedValues).filter(
      (value) => value === 'right',
    ).length;
    const rightQuantityIncrement = (total - totalRightSum) / rightCount;

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
    return roundUpdatedQuantities;
    // console.log(roundUpdatedQuantities);
  };

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

  const vectorMakeUpAmplitude = () => {
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
            (levelQuantity * parseFloat(levelQuantities[levelQuantity])) /
              totalAmplitude,
          ); // levelQuantity here is the actual level, and then levelQuantities[levelQuantity] is the total quantity at that level
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

  const handleUpButton = () => {
    roundToHundred();
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues).forEach((key) => {
      const currentLevel = level[key];
      const belowLevel = currentLevel - 1;
      const nextLevel = currentLevel + 1;
      const maxLevel = nextLevel + 1;

      let keyBelow = Object.keys(level).find((k) => level[k] === belowLevel);
      if (keyBelow === 0) {
        keyBelow = 1;
      }

      if (updatedQuantities[key] !== 0 && updatedQuantities[keyBelow] === 0) {
        // This outputs the keys of the level above
        const keysAbove = Object.keys(level).filter(
          (k) => level[k] === nextLevel,
        );
        // This outputs the keys of two levels above
        const maxKeysAbove = Object.keys(level).filter(
          (k) => level[k] === nextLevel,
        );
        if (keysAbove && level[key] !== 0) {
          // Just counting code to see how many contacts are on what polarity
          let countLeft = 0;
          let countCenter = 0;
          let countRight = 0;
          keysAbove.forEach((aboveKey) => {
            const value = updatedSelectedValues[aboveKey];
            if (value === 'left') {
              countLeft += 1;
            } else if (value === 'center') {
              countCenter += 1;
            } else if (value === 'right') {
              countRight += 1;
            }
          });
          // End of counting code
          console.log('Count Left', countLeft);
          console.log('Face: ', face[key]);
          // Case when moving from 1 to 3 contacts
          if (face[key] === 'all' && countLeft === 3) {
            keysAbove.forEach((aboveKey) => {
              updatedQuantities[aboveKey] =
                parseFloat(updatedQuantities[aboveKey]) + 10 / countLeft;
              updatedSelectedValues[aboveKey] = updatedSelectedValues[key];
            });
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          }
          // Now we start to specify
          if (face[key] === 'all' && countLeft !== 3) {
            keysAbove.forEach((aboveKey) => {
              if (updatedSelectedValues[key] === 'center') {
                if (
                  updatedSelectedValues[aboveKey] === updatedSelectedValues[key]
                ) {
                  updatedQuantities[aboveKey] =
                    parseFloat(updatedQuantities[aboveKey]) + 10 / countCenter;
                }
              } else if (updatedSelectedValues[key] === 'right') {
                if (
                  updatedSelectedValues[aboveKey] === updatedSelectedValues[key]
                ) {
                  updatedQuantities[aboveKey] =
                    parseFloat(updatedQuantities[aboveKey]) + 10 / countRight;
                }
              }
            });
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          }
          // Moving from segmented contacts
          if (face[key] !== 'all') {
            keysAbove.forEach((aboveKey) => {
              // console.log('FaceAbove: ', face[aboveKey]);
              // console.log('Face: ', face[key]);
              console.log(
                'KeysAbove: ',
                aboveKey,
                updatedSelectedValues[aboveKey],
              );
              // moving from same contact to same contact
              if (face[aboveKey] === face[key]) {
                if (
                  selectedValues[key] === 'center' &&
                  updatedSelectedValues[aboveKey] === updatedSelectedValues[key]
                ) {
                  console.log('CountCenter: ', countCenter);
                  updatedQuantities[aboveKey] =
                    parseFloat(updatedQuantities[aboveKey]) + 10 / countCenter;
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) - 10 / countCenter;
                }
                if (
                  selectedValues[key] === 'right' &&
                  updatedSelectedValues[aboveKey] === updatedSelectedValues[key]
                ) {
                  updatedQuantities[aboveKey] =
                    parseFloat(updatedQuantities[aboveKey]) + 10 / countRight;
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) - 10 / countRight;
                }
                if (
                  updatedSelectedValues[aboveKey] === 'left' &&
                  updatedSelectedValues[key] !== 'left'
                ) {
                  console.log('hello');
                  updatedSelectedValues[aboveKey] = updatedSelectedValues[key];
                  updatedQuantities[aboveKey] =
                    parseFloat(updatedQuantities[aboveKey]) + 10;
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) - 10;
                }
              } else if (
                face[aboveKey] !== face[key] &&
                face[aboveKey] === 'all'
              ) {
                // Haven't finished this part yet
                const currentKeys = Object.keys(level).filter(
                  (k) => level[k] === currentLevel,
                );
                let currentLeftCount = 0;
                let currentCenterCount = 0;
                let currentRightCount = 0;
                currentKeys.forEach((currentKey) => {
                  const value = updatedSelectedValues[currentKey];
                  if (value === 'left') {
                    currentLeftCount += 1;
                  } else if (value === 'center') {
                    currentCenterCount += 1;
                  } else if (value === 'right') {
                    currentRightCount += 1;
                  }
                });
                console.log('Hello: ', currentCenterCount);
                currentKeys.forEach((currentKey) => {
                  if (
                    currentRightCount === 0 &&
                    // currentCenterCount !== 0 &&
                    updatedSelectedValues[currentKey] === 'center'
                  ) {
                    // console.log('Hello; ', currentCenterCount);
                    console.log(
                      'CurrentLevel: ',
                      updatedQuantities[currentKey],
                    );
                    updatedSelectedValues[aboveKey] = 'center';
                    updatedQuantities[aboveKey] =
                      parseFloat(updatedQuantities[aboveKey]) +
                      10 / currentCenterCount;
                    updatedQuantities[currentKey] =
                      parseFloat(updatedQuantities[currentKey]) -
                      10 / currentCenterCount;
                  } else if (
                    currentCenterCount === 0 &&
                    currentRightCount !== 0 &&
                    updatedSelectedValues[currentKey] === 'right'
                  ) {
                    console.log('Hello');
                    updatedSelectedValues[aboveKey] = 'right';
                    updatedQuantities[aboveKey] =
                      parseFloat(updatedQuantities[aboveKey]) +
                      10 / currentRightCount;
                    updatedQuantities[currentKey] =
                      parseFloat(updatedQuantities[currentKey]) -
                      10 / currentRightCount;
                  }
                });
              }
            });
          }
          /// ///////////
        }
      }
      if (updatedQuantities[key] === 0) {
        updatedSelectedValues[key] = 'left';
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
  };

  const handleDownButton = () => {
    // Create a copy of the current quantities
    roundToHundred();
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues).forEach((key) => {
      const currentLevel = level[key];
      const belowLevel = currentLevel - 1;

      // Ensure the level below exists and is within the valid range (e.g., not below 1)
      // if (!isNaN(belowLevel) && belowLevel >= 0) {
      // Check if the quantity is not zero
      if (updatedQuantities[key] !== 0) {
        const keyBelow = Object.keys(level).find(
          (k) => level[k] === belowLevel,
        );

        if (keyBelow && level[keyBelow] !== 0) {
          // Subtract 10 from the current instance's quantities
          // Add 10 to the instance at the level below
          if (selectedValues[keyBelow] === 'left') {
            updatedSelectedValues[keyBelow] = selectedValues[key];
          }
          updatedQuantities[key] -= 10;
          updatedQuantities[keyBelow] += 10;
        }
      }
      // }
    });

    // Update the quantities state with the updated quantities
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
  };

  function getOnContacts(aLevel) {
    const onContacts = [];
    Object.keys(level).forEach((key) => {
      const numericKey = parseInt(key, 10); // Convert the string key to a number
      if (level[key] === aLevel && selectedValues[key] !== 'left') {
        onContacts.push(numericKey);
      }
    });
    return onContacts;
  }

  const newHandleClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const totalLevelArray = {};
    const numOnContacts = {};
    const vectorLevelAngle = {};
    // This code allows us to determine how many contacts are on at each level and what the total sum of the contacts on that level are
    Object.keys(levelArray).forEach((key) => {
      totalLevelArray[key] = 0;
      numOnContacts[key] = 0;
      for (let i = 0; i < 3; i++) {
        console.log(levelArray[key][i]);
        totalLevelArray[key] =
          parseFloat(totalLevelArray[key]) +
          parseFloat(updatedQuantities[levelArray[key][i]]);
        if (updatedQuantities[levelArray[key][i]] > 0) {
          numOnContacts[key] += 1;
        }
      }
    });
    let aVec = [0, 0];
    let bVec = [0, 0];
    let cVec = [0, 0];
    const baseZero = [1, 0];
    const cos60 = Math.cos((60 * Math.PI) / 180);
    const cos30 = Math.cos((30 * Math.PI) / 180);
    const sin60 = Math.sin((60 * Math.PI) / 180);
    const sin30 = Math.sin((30 * Math.PI) / 180);
    const localCoords = [0, 0];
    // The next step is to determine the angle of the vector at that level
    Object.keys(numOnContacts).forEach((key) => {
      // Now we have the levels that rotation can occur
      if (numOnContacts[key] > 0 && numOnContacts[key] < 3) {
        console.log('here');
        for (let i = 0; i < 3; i++) {
          console.log(levelArray[key][i]);
          if (face[levelArray[key][i]] === 'left') {
            console.log('1');
            cVec = [
              parseFloat(-updatedQuantities[levelArray[key][i]]) / 2,
              parseFloat(-updatedQuantities[levelArray[key][i]]) * cos30,
            ];
            console.log('c', cVec);
          } else if (face[levelArray[key][i]] === 'center') {
            console.log('center');
            aVec = [updatedQuantities[levelArray[key][i]], 0];
            console.log('a', aVec);
          } else if (face[levelArray[key][i]] === 'right') {
            bVec = [
              parseFloat(-updatedQuantities[levelArray[key][i]]) / 2,
              parseFloat(updatedQuantities[levelArray[key][i]]) * sin60,
            ];
            console.log('b', bVec);
          }
        }
      }
    });
    for (let i = 0; i < aVec.length; i++) {
      localCoords[i] = aVec[i] + bVec[i] + cVec[i];
    }
    const vecLength = Math.sqrt(
      localCoords[0] * localCoords[0] + localCoords[1] * localCoords[1],
    );
    console.log('local', localCoords);
    const vecDotProduct = 0;
    const vecAng = (Math.acos(localCoords[0] / vecLength) * 180) / Math.PI;
    const vectorAngle =
      (Math.atan(localCoords[1] / localCoords[0]) * 180) / Math.PI;
    console.log('vcecof: ', vecAng);
  };

  const handleCounterClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) + 1;
        const previousKey = parseFloat(key) - 1;
        const rightNextKey = parseFloat(key) - 2;
        const centerpreviousKey = parseFloat(key) + 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        const levelTotals = calculateLevelTotals();
        console.log(levelTotals);
        let currentLevelTotal = 0;
        Object.keys(levelTotals).forEach((levels) => {
          if (level[key] === parseFloat(levels)) {
            currentLevelTotal = levelTotals[levels];
            console.log('leveltot: ', currentLevelTotal);
          }
        });
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[centerpreviousKey] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (face[key] === 'right' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] === updatedSelectedValues[rightNextKey]
            ) {
              updatedQuantities[rightNextKey] =
                parseFloat(updatedQuantities[rightNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[rightNextKey] === 'left') {
              updatedSelectedValues[rightNextKey] = updatedSelectedValues[key];
              updatedQuantities[rightNextKey] =
                parseFloat(updatedQuantities[rightNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // vectorMakeUp();
    // console.log('VecDirection: ', vectorDirection);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const handleCounterClockwiseButtonAmplitude = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) + 1;
        const previousKey = parseFloat(key) - 1;
        const rightNextKey = parseFloat(key) - 2;
        const centerpreviousKey = parseFloat(key) + 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[centerpreviousKey] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            }
          }
        }
        if (face[key] === 'right' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] === updatedSelectedValues[rightNextKey]
            ) {
              updatedQuantities[rightNextKey] =
                parseFloat(updatedQuantities[rightNextKey]) +
                totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[rightNextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[rightNextKey] = updatedSelectedValues[key];
              updatedQuantities[rightNextKey] =
                parseFloat(updatedQuantities[rightNextKey]) +
                totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // vectorMakeUp();
    // console.log('VecDirection: ', vectorDirection);
    // checkQuantitiesAndValues(quantities, selectedValues);
  };

  const handleClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) - 1;
        const previousKey = parseFloat(key) + 1;
        const centerNextKey = parseFloat(key) + 2;
        // const centerpreviousKey = parseFloat(key) - 1;
        const rightPreviousKey = parseFloat(key) - 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        const levelTotals = calculateLevelTotals();
        // console.log(levelTotals);
        let currentLevelTotal = 0;
        Object.keys(levelTotals).forEach((levels) => {
          if (level[key] === parseFloat(levels)) {
            currentLevelTotal = levelTotals[levels];
          }
        });
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              }
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] = parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (face[key] === 'center' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] ===
              updatedSelectedValues[centerNextKey]
            ) {
              // updatedQuantities[centerNextKey] =
              //   parseFloat(updatedQuantities[centerNextKey]) +
              //   currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                console.log('true');
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
              } else {
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              }
            } else if (updatedSelectedValues[centerNextKey] === 'left') {
              updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
              updatedQuantities[centerNextKey] =
                parseFloat(updatedQuantities[centerNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[rightPreviousKey] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              }
              // console.log('true');
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const handleClockwiseButtonAmplitude = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) - 1;
        const previousKey = parseFloat(key) + 1;
        const centerNextKey = parseFloat(key) + 2;
        // const centerpreviousKey = parseFloat(key) - 1;
        const rightPreviousKey = parseFloat(key) - 2;
        const currentFace = face[key];

        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
        const currentKeys = Object.keys(level).filter(
          (k) => level[k] === currentLevel,
        );
        let currentLeftCount = 0;
        let currentCenterCount = 0;
        let currentRightCount = 0;
        currentKeys.forEach((currentKey) => {
          const value = updatedSelectedValues[currentKey];
          if (value === 'left') {
            currentLeftCount += 1;
          } else if (value === 'center') {
            currentCenterCount += 1;
          } else if (value === 'right') {
            currentRightCount += 1;
          }
        });
        if (face[key] === 'left' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            }
          }
        }
        if (face[key] === 'center' && updatedQuantities[previousKey] === 0) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] ===
              updatedSelectedValues[centerNextKey]
            ) {
              updatedQuantities[centerNextKey] =
                parseFloat(updatedQuantities[centerNextKey]) +
                totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[centerNextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
              updatedQuantities[centerNextKey] =
                parseFloat(updatedQuantities[centerNextKey]) +
                totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[rightPreviousKey] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            } else if (updatedSelectedValues[nextKey] === 'left') {
              console.log('HelloHello');
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + totalAmplitude / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - totalAmplitude / 10;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // checkQuantitiesAndValues(quantities, selectedValues);
  };

  // const handleCounterClockwiseButton = () => {
  //   const updatedQuantities = { ...quantities };
  //   console.log(updatedQuantities);
  //   Object.keys(selectedValues).forEach((key) => {
  //     const currentLevel = level[key];
  //     const nextLevel = parseFloat(key) - 1;
  //     const belowLevel = parseFloat(key) + 2;
  //     const currentFace = face[key];
  //     if (selectedValues[key] !== 'left') {
  //       if (face[key] === 'right' || face[key] === 'left') {
  //         // console.log('Face: ', face[key]);
  //         // console.log(selectedValues[key]);
  //         // console.log(key);
  //         // console.log(nextLevel);
  //         // console.log(selectedValues[nextLevel] === selectedValues[key]);
  //         if (selectedValues[key] === selectedValues[nextLevel]) {
  //           console.log('UpdatedQuantities: ', updatedQuantities);
  //           updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           updatedQuantities[nextLevel] =
  //             parseFloat(updatedQuantities[nextLevel]) + 10;
  //           console.log('UpdatedQuantities: ', updatedQuantities);
  //         }
  //       } else if (face[key] === 'center') {
  //         if (selectedValues[key] === selectedValues[belowLevel]) {
  //           updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
  //           updatedQuantities[belowLevel] =
  //             parseFloat(updatedQuantities[belowLevel]) + 10;
  //         }
  //       }
  //     }
  //   });
  //   setQuantities(updatedQuantities);
  // };

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

  function segmentedContact(aKey) {
    let counter = 0;
    Object.keys(level).forEach((key) => {
      if (level[key] === level[aKey]) {
        counter += 1;
      }
    });
    console.log('hello1');
    if (counter > 1) {
      return true;
    }
    return false;
  }

  function segmentedLevel(aLevel) {
    let counter = 0;
    Object.keys(level).forEach((key) => {
      if (level[key] === aLevel) {
        counter += 1;
      }
    });
    if (counter > 1) {
      return true;
    }
    return false;
  }

  function roundAlloc(
    beforeLevel,
    nextLevel,
    levelAboveTotal,
    levelBelowTotal,
    values,
    amtOnContacts,
  ) {
    // let oldTotal = 0;
    let newAboveTotal = 0;
    let newBelowTotal = 0;
    let belowTotal = levelBelowTotal;
    let aboveTotal = levelAboveTotal;
    Object.keys(values).forEach((key) => {
      if (level[key] === beforeLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newBelowTotal += values[key];
      } else if (level[key] === nextLevel) {
        values[key] = Math.floor(values[key] + 0.5);
        newAboveTotal += values[key];
      }
      // values[key] = Math.floor(values[key] + 0.5);
      // newTotal += values[key];
    });
    // console.log('old', oldTotal);
    // console.log('new', newTotal);
    belowTotal = Math.floor(belowTotal + 0.5);
    const belowDiff = belowTotal - newBelowTotal;
    aboveTotal = Math.floor(aboveTotal + 0.5);
    const aboveDiff = aboveTotal - newAboveTotal;
    let doneUpdate = 0;
    console.log('above', aboveDiff);
    console.log('below', belowDiff);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === beforeLevel) {
        values[key] += belowDiff;
        doneUpdate = 1;
      }
    });
    doneUpdate = 0;
    console.log('below level total: ', belowTotal);
    Object.keys(values).forEach((key) => {
      if (values[key] !== 0 && doneUpdate === 0 && level[key] === nextLevel) {
        values[key] += aboveDiff;
        doneUpdate = 1;
      }
      if (amtOnContacts === 3) {
        if (aboveTotal % 3 === 0) {
          if (level[key] === nextLevel) {
            values[key] = aboveTotal / 3;
          }
        }
        if (belowTotal % 3 === 0) {
          if (level[key] === beforeLevel) {
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      } else if (amtOnContacts === 1) {
        console.log('made it here');
        if (belowTotal % 3 === 0) {
          console.log(beforeLevel);
          if (level[key] === beforeLevel) {
            console.log('yes');
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      }
    });
    return values;
  }

  // For clear button

  // const newHandleUpButton = () => {
  //   vectorMakeUp();
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   const levelIncrement = 0.1;
  //   const previousLevel = Math.floor(vectorLevel);
  //   vectorLevel += levelIncrement;
  //   const currentLevel = Math.floor(vectorLevel);
  //   console.log('currentLevel: ', currentLevel);
  //   console.log('previousLevel: ', previousLevel);
  //   const levelBelow =
  //     currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
  //   // const levelBelow = Math.floor(vectorLevel);
  //   // const levelAbove = Math.ceil(vectorLevel);
  //   const levelAbove = levelBelow + 1;
  //   console.log('Level Below', levelBelow);
  //   console.log('level Above', levelAbove);
  //   const percDiff = vectorLevel - levelBelow;
  //   const levelBelowQuantityTotal = 100 * (1 - percDiff);
  //   const levelAboveQuantityTotal = 100 - levelBelowQuantityTotal;
  //   // Want to figure out how many contacts are "on" at a level
  //   // const levelBelowCount = 0;
  //   // const levelAboveCount = 0;
  //   // Object.keys(selectedValues).forEach((key) => {
  //   //   if ((level[key] === levelBelow) && (selectedValues[key] !== 'left')) {
  //   //     levelBelowCount += 1;
  //   //   }
  //   //   if ((level[key] === levelAbove) && (selectedValues[key] !== )) {

  //   //   }
  //   // });
  //   const onContacts = getOnContacts(levelBelow);
  //   const numOnContacts = getOnContacts(levelBelow).length;
  //   const aboveOnContacts = getOnContacts(levelAbove);
  //   const numAboveOnContacts = aboveOnContacts.length;
  //   console.log('On Contacts', onContacts);
  //   Object.keys(level).forEach((key) => {
  //     // dealing with level below
  //     // vectorMakeUp();
  //     if (level[key] === levelBelow) {
  //       if (face[key] === 'all') {
  //         updatedQuantities[key] = levelBelowQuantityTotal;
  //       } else if (face[key] !== 'all' && numOnContacts !== 0) {
  //         for (let i = 0; i < numOnContacts; i++) {
  //           updatedQuantities[onContacts[i]] =
  //             levelBelowQuantityTotal / parseFloat(numOnContacts);
  //             // console.log('numOnContacts: ', numOnContacts);
  //             // console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
  //             // parseFloat(updatedQuantities[onContacts[i]]) -
  //             // 1 / levelIncrement / numOnContacts;
  //         }
  //         // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  //       }
  //       // if (levelBelowQuantityTotal === 0) {
  //       //   updatedSelectedValues[key] = 'left';
  //       // }
  //     }
  //     if (level[key] === levelAbove) {
  //       if (face[key] !== 'all') {
  //         for (let i = 0; i < numAboveOnContacts; i++) {
  //           if (face[key] === face[aboveOnContacts[i]]) {
  //             updatedQuantities[key] =
  //               levelAboveQuantityTotal / numAboveOnContacts;
  //             console.log('UpdatedQuantitie: ', updatedQuantities);
  //             if (updatedQuantities[key] !== 0) {
  //               updatedSelectedValues[key] =
  //                 updatedSelectedValues[aboveOnContacts[i]];
  //             }
  //           }
  //         }
  //         setSelectedValues(updatedSelectedValues);
  //         setQuantities(updatedQuantities);
  //         const newaboveOnContacts = getOnContacts(levelAbove);
  //         const newnumAboveOnContacts = newaboveOnContacts.length;
  //         if (newnumAboveOnContacts === 0) {
  //           console.log('hello');
  //           updatedQuantities[key] = levelAboveQuantityTotal / 3;
  //           updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //           // if (updatedQuantities[key] !== 0) {
  //           //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
  //           // }
  //         }
  //       } else if (face[key] === 'all') {
  //         updatedQuantities[key] = levelAboveQuantityTotal;
  //         if (updatedQuantities[key] !== 0) {
  //           updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //         }
  //       }
  //     }
  //   });
  //   // Object.keys(updatedQuantities).forEach((key) => {
  //   //   if (level[key] !== levelAbove || levelBelow) {
  //   //     updatedQuantities[key] = 0;
  //   //     updatedSelectedValues[key] = 'left';
  //   //   }
  //   // });
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  //   checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  // };
  const newHandleUpButton = () => {
    // newRoundToHundred();
    console.log('passed');
    console.log('quantities: ', quantities);
    vectorMakeUp();
    const newQuantities = newRoundToHundred();
    console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
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
        } else if (
          face[key] !== 'all' &&
          numOnContacts !== 0 &&
          updatedQuantities[key] !== 0
        ) {
          // for (let i = 0; i < numOnContacts; i++) {
          //   console.log('numOnContactsQuantities', key);
          //   if (key === onContacts[i]) {
          //     console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
          //     updatedQuantities[onContacts[i]] =
          //     // levelBelowQuantityTotal / parseFloat(numOnContacts);
          //     // console.log('numOnContacts: ', numOnContacts);
          //     // console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
          //     parseFloat(updatedQuantities[onContacts[i]]) -
          //     (100 * levelIncrement) / numOnContacts;
          //   }
          // }
          // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
          Object.keys(onContacts).forEach((contact) => {
            console.log('key: ', key);
            if (parseFloat(key) === onContacts[contact]) {
              // console.log('madeItHere');
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) -
                (100 * levelIncrement) / numOnContacts;
            }
          });
        }
        // if (levelBelowQuantityTotal === 0) {
        //   updatedSelectedValues[key] = 'left';
        // }
      }
      if (level[key] === levelAbove) {
        if (face[key] !== 'all') {
          if (segmentedContact(levelBelow)) {
            Object.keys(onContacts).forEach((contact) => {
              if (face[key] === face[onContacts[contact]]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) +
                  (100 * levelIncrement) / numOnContacts;
                updatedSelectedValues[key] =
                  updatedSelectedValues[onContacts[contact]];
              }
            });
          } else {
            let levelBelowKey = 0;
            Object.keys(level).forEach((keys) => {
              if (level[keys] === levelBelow) {
                levelBelowKey = keys;
              }
            });
            updatedQuantities[key] =
              parseFloat(updatedQuantities[key]) + (100 * levelIncrement) / 3;
            updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
          }
        }
        if (face[key] === 'all') {
          updatedQuantities[key] = levelAboveQuantityTotal;
          updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        }
        // if (face[key] !== 'all') {
        //   for (let i = 0; i < numAboveOnContacts; i++) {
        //     if (face[key] === face[aboveOnContacts[i]]) {
        //       updatedQuantities[key] =
        //         levelAboveQuantityTotal / numAboveOnContacts;
        //       console.log('UpdatedQuantities: ', updatedQuantities);
        //       if (updatedQuantities[key] !== 0) {
        //         updatedSelectedValues[key] =
        //           updatedSelectedValues[aboveOnContacts[i]];
        //       }
        //     }
        //   }
        //   setSelectedValues(updatedSelectedValues);
        //   setQuantities(updatedQuantities);
        //   const newaboveOnContacts = getOnContacts(levelAbove);
        //   const newnumAboveOnContacts = newaboveOnContacts.length;
        //   if (newnumAboveOnContacts === 0) {
        //     console.log('hello');
        //     updatedQuantities[key] = levelAboveQuantityTotal / 3;
        //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        //     // if (updatedQuantities[key] !== 0) {
        //     //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
        //     // }
        //   }
        // } else if (face[key] === 'all') {
        //   updatedQuantities[key] = levelAboveQuantityTotal;
        //   if (updatedQuantities[key] !== 0) {
        //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        //   }
        // }
      }
    });
    // Object.keys(updatedQuantities).forEach((key) => {
    //   if (level[key] !== levelAbove || levelBelow) {
    //     updatedQuantities[key] = 0;
    //     updatedSelectedValues[key] = 'left';
    //   }
    // });
    setSelectedValues(updatedSelectedValues);
    console.log('before level', previousLevel);
    roundAlloc(
      previousLevel,
      levelAbove,
      levelAboveQuantityTotal,
      levelBelowQuantityTotal,
      updatedQuantities,
      numAboveOnContacts,
    );
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };
  // const newHandleUpButton = () => {
  //   vectorMakeUp();
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   let total = 0;
  //   if (percAmpToggle === 'left') {
  //     total = 100;
  //   } else if (percAmpToggle === 'right') {
  //     total = totalAmplitude;
  //   }
  //   const levelIncrement = 0.1;
  //   const previousLevel = Math.floor(vectorLevel);
  //   vectorLevel += levelIncrement;
  //   const currentLevel = Math.floor(vectorLevel);
  //   console.log('currentLevel: ', currentLevel);
  //   console.log('previousLevel: ', previousLevel);
  //   const levelBelow =
  //     currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
  //   const levelAbove = levelBelow + 1;
  //   console.log('Level Below', levelBelow);
  //   console.log('level Above', levelAbove);
  //   const percDiff = vectorLevel - levelBelow;
  //   const levelBelowQuantityTotal = total * (1 - percDiff);
  //   const levelAboveQuantityTotal = total - levelBelowQuantityTotal;
  //   const onContacts = getOnContacts(levelBelow);
  //   const numOnContacts = getOnContacts(levelBelow).length;
  //   const aboveOnContacts = getOnContacts(levelAbove);
  //   const numAboveOnContacts = aboveOnContacts.length;
  //   console.log('On Contacts', onContacts);
  //   Object.keys(level).forEach((key) => {
  //     // dealing with level below
  //     // vectorMakeUp();
  //     if (level[key] === levelBelow) {
  //       if (face[key] === 'all') {
  //         updatedQuantities[key] = levelBelowQuantityTotal;
  //       } else if (
  //         face[key] !== 'all' &&
  //         numOnContacts !== 0 &&
  //         updatedQuantities[key] !== 0
  //       ) {
  //         Object.keys(onContacts).forEach((contact) => {
  //           console.log('key: ', key);
  //           if (parseFloat(key) === onContacts[contact]) {
  //             // console.log('madeItHere');
  //             updatedQuantities[key] =
  //               parseFloat(updatedQuantities[key]) -
  //               (total * levelIncrement) / numOnContacts;
  //           }
  //         });
  //       }
  //     }
  //     if (level[key] === levelAbove) {
  //       if (face[key] !== 'all') {
  //         if (segmentedContact(levelBelow)) {
  //           Object.keys(onContacts).forEach((contact) => {
  //             if (face[key] === face[onContacts[contact]]) {
  //               updatedQuantities[key] =
  //                 parseFloat(updatedQuantities[key]) +
  //                 (total * levelIncrement) / numOnContacts;
  //               updatedSelectedValues[key] =
  //                 updatedSelectedValues[onContacts[contact]];
  //             }
  //           });
  //         } else {
  //           let levelBelowKey = 0;
  //           Object.keys(level).forEach((keys) => {
  //             if (level[keys] === levelBelow) {
  //               levelBelowKey = keys;
  //             }
  //           });
  //           updatedQuantities[key] =
  //             parseFloat(updatedQuantities[key]) + (total * levelIncrement) / 3;
  //           updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
  //         }
  //       }
  //       if (face[key] === 'all') {
  //         updatedQuantities[key] = levelAboveQuantityTotal;
  //         updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //       }
  //     }
  //   });
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  //   checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  // };

  const newHandleUpButtonAmplitude = () => {
    vectorMakeUpAmplitude();
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
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = vectorLevel - levelBelow;
    const levelBelowQuantityTotal = totalAmplitude * (1 - percDiff);
    const levelAboveQuantityTotal = totalAmplitude - levelBelowQuantityTotal;
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
        } else if (
          face[key] !== 'all' &&
          numOnContacts !== 0 &&
          updatedQuantities[key] !== 0
        ) {
          // for (let i = 0; i < numOnContacts; i++) {
          //   console.log('numOnContactsQuantities', key);
          //   if (key === onContacts[i]) {
          //     console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
          //     updatedQuantities[onContacts[i]] =
          //     // levelBelowQuantityTotal / parseFloat(numOnContacts);
          //     // console.log('numOnContacts: ', numOnContacts);
          //     // console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
          //     parseFloat(updatedQuantities[onContacts[i]]) -
          //     (100 * levelIncrement) / numOnContacts;
          //   }
          // }
          // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
          Object.keys(onContacts).forEach((contact) => {
            console.log('key: ', key);
            if (parseFloat(key) === onContacts[contact]) {
              // console.log('madeItHere');
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) -
                (totalAmplitude * levelIncrement) / numOnContacts;
            }
          });
        }
        // if (levelBelowQuantityTotal === 0) {
        //   updatedSelectedValues[key] = 'left';
        // }
      }
      if (level[key] === levelAbove) {
        if (face[key] !== 'all') {
          if (segmentedContact(levelBelow)) {
            Object.keys(onContacts).forEach((contact) => {
              if (face[key] === face[onContacts[contact]]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) +
                  (totalAmplitude * levelIncrement) / numOnContacts;
                updatedSelectedValues[key] =
                  updatedSelectedValues[onContacts[contact]];
              }
            });
          } else {
            let levelBelowKey = 0;
            Object.keys(level).forEach((keys) => {
              if (level[keys] === levelBelow) {
                levelBelowKey = keys;
              }
            });
            updatedQuantities[key] =
              parseFloat(updatedQuantities[key]) +
              (totalAmplitude * levelIncrement) / 3;
            updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
          }
        }
        if (face[key] === 'all') {
          updatedQuantities[key] = levelAboveQuantityTotal;
          updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        }
        // if (face[key] !== 'all') {
        //   for (let i = 0; i < numAboveOnContacts; i++) {
        //     if (face[key] === face[aboveOnContacts[i]]) {
        //       updatedQuantities[key] =
        //         levelAboveQuantityTotal / numAboveOnContacts;
        //       console.log('UpdatedQuantities: ', updatedQuantities);
        //       if (updatedQuantities[key] !== 0) {
        //         updatedSelectedValues[key] =
        //           updatedSelectedValues[aboveOnContacts[i]];
        //       }
        //     }
        //   }
        //   setSelectedValues(updatedSelectedValues);
        //   setQuantities(updatedQuantities);
        //   const newaboveOnContacts = getOnContacts(levelAbove);
        //   const newnumAboveOnContacts = newaboveOnContacts.length;
        //   if (newnumAboveOnContacts === 0) {
        //     console.log('hello');
        //     updatedQuantities[key] = levelAboveQuantityTotal / 3;
        //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        //     // if (updatedQuantities[key] !== 0) {
        //     //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
        //     // }
        //   }
        // } else if (face[key] === 'all') {
        //   updatedQuantities[key] = levelAboveQuantityTotal;
        //   if (updatedQuantities[key] !== 0) {
        //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
        //   }
        // }
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

  // const newHandleDownButton = () => {
  //   vectorMakeUp();
  //   const updatedQuantities = { ...quantities };
  //   const updatedSelectedValues = { ...selectedValues };
  //   checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  //   const levelIncrement = 0.1;
  //   const previousLevel = Math.ceil(vectorLevel);
  //   vectorLevel -= levelIncrement;
  //   const currentLevel = Math.ceil(vectorLevel);
  //   console.log('currentLevel: ', currentLevel);
  //   console.log('previousLevel: ', previousLevel);
  //   const levelAbove =
  //     currentLevel !== previousLevel ? previousLevel : Math.ceil(vectorLevel);
  //   // const levelBelow = Math.floor(vectorLevel);
  //   // const levelAbove = Math.ceil(vectorLevel);
  //   const levelBelow = levelAbove - 1;
  //   // if (vectorLevel % 1 === 0) {
  //   //   levelBelow -= 1;
  //   // }
  //   console.log('Level Below', levelBelow);
  //   console.log('level Above', levelAbove);
  //   const percDiff = Math.abs(vectorLevel - levelAbove);
  //   const levelAboveQuantityTotal = 100 * (1 - percDiff);
  //   const levelBelowQuantityTotal = 100 - levelAboveQuantityTotal;
  //   // Want to figure out how many contacts are "on" at a level
  //   // const levelBelowCount = 0;
  //   // const levelAboveCount = 0;
  //   // Object.keys(selectedValues).forEach((key) => {
  //   //   if ((level[key] === levelBelow) && (selectedValues[key] !== 'left')) {
  //   //     levelBelowCount += 1;
  //   //   }
  //   //   if ((level[key] === levelAbove) && (selectedValues[key] !== )) {

  //   //   }
  //   // });
  //   const onContacts = getOnContacts(levelBelow);
  //   const numOnContacts = getOnContacts(levelBelow).length;
  //   const aboveOnContacts = getOnContacts(levelAbove);
  //   const numAboveOnContacts = aboveOnContacts.length;
  //   console.log('On Contacts', aboveOnContacts);
  //   Object.keys(level)
  //     .reverse()
  //     .forEach((key) => {
  //       // dealing with level above, the one that is passing current
  //       // vectorMakeUp();
  //       if (level[key] === levelAbove) {
  //         console.log('level Above: ', levelAbove);
  //         if (face[key] === 'all') {
  //           updatedQuantities[key] = levelAboveQuantityTotal;
  //         } else if (face[key] !== 'all' && numAboveOnContacts !== 0) {
  //           for (let i = 0; i < numAboveOnContacts; i++) {
  //             updatedQuantities[aboveOnContacts[i]] =
  //               // parseFloat(updatedQuantities[onContacts[i]]) -
  //               levelAboveQuantityTotal / parseFloat(numAboveOnContacts);
  //           }
  //           // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  //         }
  //         // if (levelBelowQuantityTotal === 0) {
  //         //   updatedSelectedValues[key] = 'left';
  //         // }
  //       }
  //       if (level[key] === levelBelow) {
  //         if (face[key] !== 'all') {
  //           for (let i = 0; i < numAboveOnContacts; i++) {
  //             if (face[key] === face[aboveOnContacts[i]]) {
  //               console.log('passed');
  //               updatedQuantities[key] =
  //                 levelBelowQuantityTotal / numAboveOnContacts;
  //               console.log('UpdatedQuantitie: ', updatedQuantities);
  //               if (updatedQuantities[key] !== 0) {
  //                 updatedSelectedValues[key] =
  //                   updatedSelectedValues[aboveOnContacts[i]];
  //               }
  //             }
  //           }
  //           // console.log(updatedQuantities);
  //           // console.log(updatedSelectedValues);
  //           setSelectedValues(updatedSelectedValues);
  //           setQuantities(updatedQuantities);
  //           const newaboveOnContacts = getOnContacts(levelBelow);
  //           const newnumAboveOnContacts = newaboveOnContacts.length;
  //           if (newnumAboveOnContacts === 0) {
  //             console.log('hello');
  //             updatedQuantities[key] = levelBelowQuantityTotal / 3;
  //             updatedSelectedValues[key] =
  //               updatedSelectedValues[aboveOnContacts[0]];
  //             // if (updatedQuantities[key] !== 0) {
  //             //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
  //             // }
  //           } else if (newnumAboveOnContacts !== 0) {
  //             updatedQuantities[key] = levelBelowQuantityTotal / 3;
  //           }
  //         } else if (face[key] === 'all') {
  //           updatedQuantities[key] = levelBelowQuantityTotal;
  //           if (updatedQuantities[key] !== 0) {
  //             updatedSelectedValues[key] =
  //               updatedSelectedValues[aboveOnContacts[0]];
  //           }
  //         }
  //       }
  //     });
  //   // Object.keys(updatedQuantities).forEach((key) => {
  //   //   if (level[key] !== levelAbove || levelBelow) {
  //   //     updatedQuantities[key] = 0;
  //   //     updatedSelectedValues[key] = 'left';
  //   //   }
  //   // });
  //   setSelectedValues(updatedSelectedValues);
  //   setQuantities(updatedQuantities);
  //   checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  // };
  // const newHandleClockwiseButton = () => {

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
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = Math.abs(vectorLevel - levelAbove);
    const levelAboveQuantityTotal = 100 * (1 - percDiff);
    const levelBelowQuantityTotal = 100 - levelAboveQuantityTotal;
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
          if (face[key] === 'all') {
            updatedQuantities[key] = levelAboveQuantityTotal;
          } else if (
            face[key] !== 'all' &&
            numAboveOnContacts !== 0 &&
            updatedQuantities[key] !== 0
          ) {
            Object.keys(aboveOnContacts).forEach((contact) => {
              if (parseFloat(key) === aboveOnContacts[contact]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) -
                  (100 * levelIncrement) / numAboveOnContacts;
              }
            });
          }
          // if (levelBelowQuantityTotal === 0) {
          //   updatedSelectedValues[key] = 'left';
          // }
        }
        if (level[key] === levelBelow) {
          if (face[key] !== 'all') {
            if (segmentedLevel(levelAbove)) {
              // console.log(levelAbove);
              console.log('Madeit: ', levelAbove);
              Object.keys(aboveOnContacts).forEach((contact) => {
                if (face[key] === face[aboveOnContacts[contact]]) {
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) +
                    (100 * levelIncrement) / numAboveOnContacts;
                  updatedSelectedValues[key] =
                    updatedSelectedValues[aboveOnContacts[contact]];
                }
              });
            } else {
              console.log('Made it');
              let levelAboveKey = 0;
              Object.keys(level).forEach((keys) => {
                if (level[keys] === levelAbove) {
                  levelAboveKey = keys;
                }
              });
              updatedSelectedValues[key] = updatedSelectedValues[levelAboveKey];
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) + (100 * levelIncrement) / 3;
            }
          } else if (face[key] === 'all') {
            updatedQuantities[key] = levelBelowQuantityTotal;
            updatedSelectedValues[key] =
              updatedSelectedValues[aboveOnContacts[0]];
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

  const newHandleDownButtonAmplitude = () => {
    vectorMakeUpAmplitude();
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
    console.log('Level Below', levelBelow);
    console.log('level Above', levelAbove);
    const percDiff = Math.abs(vectorLevel - levelAbove);
    const levelAboveQuantityTotal = totalAmplitude * (1 - percDiff);
    const levelBelowQuantityTotal = totalAmplitude - levelAboveQuantityTotal;
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
          if (face[key] === 'all') {
            updatedQuantities[key] = levelAboveQuantityTotal;
          } else if (
            face[key] !== 'all' &&
            numAboveOnContacts !== 0 &&
            updatedQuantities[key] !== 0
          ) {
            Object.keys(aboveOnContacts).forEach((contact) => {
              if (parseFloat(key) === aboveOnContacts[contact]) {
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) -
                  (totalAmplitude * levelIncrement) / numAboveOnContacts;
              }
            });
          }
          // if (levelBelowQuantityTotal === 0) {
          //   updatedSelectedValues[key] = 'left';
          // }
        }
        if (level[key] === levelBelow) {
          if (face[key] !== 'all') {
            if (segmentedLevel(levelAbove)) {
              // console.log(levelAbove);
              console.log('Madeit: ', levelAbove);
              Object.keys(aboveOnContacts).forEach((contact) => {
                if (face[key] === face[aboveOnContacts[contact]]) {
                  updatedQuantities[key] =
                    parseFloat(updatedQuantities[key]) +
                    (totalAmplitude * levelIncrement) / numAboveOnContacts;
                  updatedSelectedValues[key] =
                    updatedSelectedValues[aboveOnContacts[contact]];
                }
              });
            } else {
              console.log('Made it');
              let levelAboveKey = 0;
              Object.keys(level).forEach((keys) => {
                if (level[keys] === levelAbove) {
                  levelAboveKey = keys;
                }
              });
              updatedSelectedValues[key] = updatedSelectedValues[levelAboveKey];
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) +
                (totalAmplitude * levelIncrement) / 3;
            }
          } else if (face[key] === 'all') {
            updatedQuantities[key] = levelBelowQuantityTotal;
            updatedSelectedValues[key] =
              updatedSelectedValues[aboveOnContacts[0]];
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

  let facesVec = [];

  const getOnFacesCount = () => {
    let centerCount = 0;
    let rightCount = 0;
    let leftCount = 0;
    Object.keys(face).forEach((key) => {
      if (quantities[key] !== 0) {
        if (face[key] === 'left') {
          leftCount += 1;
        } else if (face[key] === 'center') {
          centerCount += 1;
        } else if (face[key] === 'right') {
          rightCount += 1;
        }
      }
    });
    facesVec = [leftCount + centerCount + rightCount];
    return facesVec;
  };

  const getNumContacts = () => {
    let counter = 0;
    Object.keys(quantities).forEach((key) => {
      counter += 1;
    });
    return counter;
  };

  // const isLevelOnAndSegmented = (aLevel) => {
  //   const numContacts = getNumContacts();
  //   for (let i = 1; i <= numContacts; i++) {
  //     if (
  //       level[i] === aLevel &&
  //       selectedValues[i] !== 'left' &&
  //       face[i] !== 'all'
  //     ) {
  //       return true;
  //     }
  //     // return false;
  //   }
  //   // Object.keys(level).forEach((key) => {
  //   //   if (
  //   //     level[key] === aLevel &&
  //   //     selectedValues[key] !== 'left' &&
  //   //     face[key] !== 'all'
  //   //   ) {
  //   //     return true;
  //   //   }
  //   // });
  // };

  const handleForwardButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]];
        // }
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleBackButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      if (
        (face[key] === 'left' || face[key] === 'right') &&
        levelQuantities[level[key]] !== 0
      ) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 2;
        // }
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleLeftButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      if (face[key] === 'left' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 4;
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleRightButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      if (face[key] === 'right' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 4;
      } else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const handleSplitEvenButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // getOnFacesCount();
    getOnFacesCount();
    vectorMakeUp();
    const levelTotalArray = calculateLevelTotals();
    console.log(facesVec);
    let counter = 0;
    // Object.keys(levelTotalArray).forEach((key) => {
    //   const useLevel = isLevelOnAndSegmented(key);
    //   console.log('useLevel ', useLevel);
    //   if (useLevel) {
    //     counter += 1;
    //   }
    // });
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      // keyLevel = getOnContacts[level[key]]
      // if (face[key] !== 'all' || face[key] !== '' && levelQuantities[level[key]] !== 0) {
      //   // console.log('length ', getOnContacts(level[key]).length);
      //   // if (getOnContacts(level[key]).length > 0) {
      //   // console.log('facesVec ', counter);
      //   updatedSelectedValues[key] = 'center'; // Need to fix this
      //   updatedQuantities[key] = levelQuantities[level[key]] / 3;
      //   // }
      // }
      if (levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        if (face[key] !== 'all' || face[key] !== '') {
          updatedSelectedValues[key] = 'center'; // Need to fix this
          updatedQuantities[key] = levelQuantities[level[key]] / 3;
        }
        // }
      }
      // else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
      //   updatedSelectedValues[key] = 'center';
      //   updatedQuantities[key] = levelQuantities[level[key]] / 4;
      // }
      else {
        updatedSelectedValues[key] = 'left';
        updatedQuantities[key] = 0;
      }
    });
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // checkQuantitiesAndValues();
    // roundToHundred();
    // calculateQuantitiesWithDistribution();
  };

  const [assistedModeEnabled, setAssistedModeEnabled] = useState(false);

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
        // console.log('negativeSum: ', negativeSum);
      } else if (updatedSelectedValues[key] === 'right') {
        positiveSum += parseFloat(updatedQuantities[key]);
        rightCount += 1;
        // console.log('positiveSum: ', positiveSum);
      }
    });

    Object.keys(updatedQuantities).find((key) => {
      if (updatedSelectedValues[key] === 'center') {
        if (key === lastChangedKey) {
          negativeModifiedKey = key;
          // console.log('negativeModifiedKey: ', negativeModifiedKey);
          return true; // exit loop
        }
      }
      if (updatedSelectedValues[key] === 'right') {
        if (key === lastChangedKey) {
          positiveModifiedKey = key;
          // console.log('positiveModifiedKey: ', positiveModifiedKey);
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
          // console.log('passed');
          updatedQuantities[key] =
            parseFloat(updatedQuantities[key]) +
            parseFloat(negativeDifference / (centerCount - 1));
        }
      });
      // console.log('negative difference: ', negativeDifference);
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

  function assist() {
    isAssisted = !isAssisted;
    if (isAssisted) {
      assistedMode();
    }
    // console.log('isAssisted: ', isAssisted);
  }

  const handleQuantityChange = (quantity, key) => {
    // setQuantities((prevQuantities) => ({
    //   ...prevQuantities,
    //   [key]: quantity,
    // }));
    const updatedQuantities = { ...quantities, [key]: quantity };
    /// /////Steering for two components logic///////
    // const centerCount = Object.values(selectedValues).filter(
    //   (value) => value === 'center',
    // ).length;
    // // console.log('Center Count: ', centerCount);
    // const rightCount = Object.values(selectedValues).filter(
    //   (value) => value === 'right',
    // ).length;

    // if (centerCount === 2 || rightCount === 2) {
    //   const newQuantities = calculateQuantitiesForTwo();
    //   setQuantities(newQuantities);
    // }
    // assist();
    if (assistedModeEnabled) {
      const newQuantities = assistedMode();
      setQuantities(newQuantities);
    }
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
    console.log('lastChangedKey: ', lastChangedKey);
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

  const handlePercAmpChangeUp = () => {
    // console.log('PercAmpButton: ', percAmpToggle);
    roundToHundred();
    if (percAmpToggle === 'left') {
      newHandleUpButton();
    } else if (percAmpToggle === 'right') {
      newHandleUpButtonAmplitude();
    }
  };

  const handlePercAmpChangeClockwise = () => {
    if (percAmpToggle === 'left') {
      handleClockwiseButton();
    } else if (percAmpToggle === 'right') {
      handleClockwiseButtonAmplitude();
    }
  };

  const handlePercAmpChangeCounterClockwise = () => {
    if (percAmpToggle === 'left') {
      handleCounterClockwiseButton();
    } else if (percAmpToggle === 'right') {
      handleCounterClockwiseButtonAmplitude();
    }
  };

  const handlePercAmpChangeDown = () => {
    if (percAmpToggle === 'left') {
      newHandleDownButton();
    } else if (percAmpToggle === 'right') {
      newHandleDownButtonAmplitude();
    }
  };

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

  const getStateAmplitude = () => {
    return totalAmplitude;
  };

  const getStateStimulationParameters = () => {
    return parameters;
  };

  const getStateSessionTitle = () => {
    return sessionTitle;
  };

  const getStateVisModel = () => {
    return visModel;
  };

  useImperativeHandle(ref, () => ({
    getCartesiaData,
    getStateQuantities,
    getStateSelectedValues,
    getStateAmplitude,
    getStateStimulationParameters,
    getStateSessionTitle,
    getStateVisModel,
  }));

  const handleParameterChange = (parameter) => (e) => {
    const newValue = e.target.value;
    setParameters((prevParams) => ({
      ...prevParams,
      [parameter]: newValue,
    }));
  };

  // const [totalAmplitude, setTotalAmplitude] = useState(0);

  const handleActivaVoltage = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      if (selectedValues[key] !== 'left') {
        updatedQuantities[key] = totalAmplitude;
      }
    });
    setQuantities(updatedQuantities);
  };

  const handleActivaAmplitude = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    // let numActiveContacts = 0;
    // const activeContacts = [];
    // Object.keys(quantities).forEach((key) => {
    //   if (quantities[key] > 0) {
    //     numActiveContacts += 1;
    //     activeContacts.push(key);
    //   }
    // });
    // if (numActiveContacts > 1) {
    //   for (let i = 0; i < numActiveContacts - 1; i++) {
    //     updatedQuantities[numActiveContacts[i]] = 0;
    //     updatedSelectedValues[numActiveContacts[i]] = 'left';
    //   }
    // }
    Object.keys(updatedQuantities).forEach((key) => {
      if (key !== lastChangedKey) {
        updatedQuantities[key] = 0;
        updatedSelectedValues[key] = 'left';
      }
    });
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  const handleTotalAmplitudeChange = (e) => {
    const newTotalAmplitude = e.target.value;
    setTotalAmplitude(newTotalAmplitude);
  };

  let stimController = 0;
  // Generating here a more simple key code for the IPG that is selected
  const handleIPG = () => {
    if (props.IPG === 'Medtronic_Activa') {
      stimController = 1;
    } else if (props.IPG === 'Abbott') {
      stimController = 2;
    } else if (props.IPG === 'Medtronic_Percept') {
      stimController = 3;
    }
    // console.log('stimController: ', stimController);
    // console.log('IPG', props.IPG);
  };

  const calculatePercentageFromAmplitude = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = (updatedQuantities[key] * 100) / totalAmplitude;
    });
    setQuantities(updatedQuantities);
  };

  const calculateAmplitudeFromPercentage = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = (updatedQuantities[key] * totalAmplitude) / 100;
    });
    setQuantities(updatedQuantities);
  };

  // Percentage vs mA toggle switch
  const handlePercAmpToggleChange = (value) => {
    const newValue = value;
    if (newValue === 'left') {
      // setTotalAmplitude(0);
      calculatePercentageFromAmplitude();
    } else if (newValue === 'right') {
      // let totalSum = 0;
      // Object.keys(quantities).forEach((key) => {
      //   totalSum += parseFloat(quantities[key]);
      // });
      // setTotalAmplitude(totalSum);
      calculateAmplitudeFromPercentage();
    }
    setPercAmpToggle(value);
  };

  const [assistedToggle, setAssistedToggle] = useState('left');

  const handleAssistedToggleChange = (value) => {
    setAssistedToggle(value);
  };

  const [volAmpToggle, setVolAmpToggle] = useState('left');
  const ampToggle = 'left';

  const handleVolAmpToggleChange = (value) => {
    const newValue = value;
    // if (newValue === 'left') {
    //   handleActivaAmplitude();
    // } else if (newValue === 'right') {
    //   handleActivaVoltage();
    // }
    setVolAmpToggle(volAmpToggle);
  };

  const [show, setShow] = useState(false);

  const handleCheck = () => {
    handleIPG();
    if (stimController === 0) {
      if (percAmpToggle === 'left') {
        let negSum = 0;
        let posSum = 0;
        console.log('1');
        Object.keys(quantities).forEach((key) => {
          if (selectedValues[key] === 'center') {
            negSum += parseFloat(quantities[key]);
          } else if (selectedValues[key] === 'right') {
            posSum += parseFloat(quantities[key]);
          }
        });
        console.log('2');
        if ((negSum > 0 && negSum !== 100) || (posSum > 0 && posSum !== 100)) {
          // Popup logic
          console.log('3');
          setShow(true);
        }
      }
    }
  };

  const handleClose = () => {
    setShow(false);
    console.log('made it');
    handleCheck();
  };

  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'None', value: '1' },
    { name: 'Assisted', value: '2' },
  ];

  const handleVisModelChange = (event) => {
    setVisModel(event.target.value);
  };

  const handleTitleChange = (event) => {
    setSessionTitle(event.target.value);
  };

  const tooltipspliteven = (
    <Tooltip id="tooltip">
      <strong>Holy guacamole!</strong> Evenly share current between active contacts.
    </Tooltip>
  );

  const tooltiprefactor = (
    <Tooltip id="tooltip">
      <strong>Holy guacamole!</strong> Make sure contacts sum to 100.
    </Tooltip>
  );

  useEffect(() => {
    if (props.IPG === 'Abbott') {
      // const newQuantities = { ...quantities };
      calculateQuantitiesWithDistribution();
    }
    if (radioValue === '2') {
      assistedMode();
    }
    // if (props.IPG === 'Medtronic_Activa') {
    //   if (volAmpToggle === 'left') {
    //     handleActivaAmplitude();
    //   } else if (volAmpToggle === 'right') {
    //     handleActivaVoltage();
    //   }
    // }
    // assist();
  });
  /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container">
      <div className="button-container">
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter session ID"
            value={sessionTitle}
            onChange={handleTitleChange}
          />
        </Form.Group>
        <Form.Select
          aria-label="Default select example"
          value={visModel}
          onChange={handleVisModelChange}
        >
          <option>Choose a model</option>
          <option value="1">Dembek 2017</option>
          <option value="2">FastField (Baniasadi 2020)</option>
          <option value="3">SimBio/FieldTrip (see Horn 2017)</option>
          <option value="4">Kuncel 2008</option>
          <option value="5">Maedler 2012</option>
        </Form.Select>
        <div />
        <div className="PercentageAmplitudeToggle">
          {props.IPG === 'Boston' && (
            <PercentageAmplitudeToggle
              value={percAmpToggle}
              onChange={(value) => handlePercAmpToggleChange(value)}
            />
          )}
          {props.IPG === 'Medtronic_Activa' && (
            <VoltageAmplitudeToggle
              value={volAmpToggle}
              onChange={(value) => handleVolAmpToggleChange(value)}
            />
          )}
          {props.IPG === 'Abbott' && (
            <MAToggleSwitch
              value={ampToggle}
              // onChange={(value) => handleVolAmpToggleChange(value)}
            />
          )}
        </div>
        <div />
        <div className="button-container">
          <label className="label">Total Amplitude</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={totalAmplitude}
            onChange={handleTotalAmplitudeChange}
          />
        </div>
        <div className="button-container">
          <label className="label">Pulsewidth (us):</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={parameters.parameter1}
            onChange={handleParameterChange('parameter1')}
          />
          <label className="label">Frequency (Hz):</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={parameters.parameter2}
            onChange={handleParameterChange('parameter2')}
          />
        </div>
        <div>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                name="radio"
                value={radio.value}
                checked={radioValue === radio.value}
                onChange={(e) => setRadioValue(e.currentTarget.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
      </div>
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
                  <div className="triple-toggle-ipg-boston-test">
                    <TripleToggleTest
                      key={ipg.key}
                      value={selectedValues[ipg.key]}
                      switchPosition={selectedValues[ipg.key]}
                      animation={animation[ipg.key]}
                      // quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
                      quantity={quantities[ipg.key]}
                      onChange={(value, anime) =>
                        handleTripleToggleChange(value, anime, ipg.key)
                      }
                      onQuantityChange={(value, anime, quantity) =>
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
                  <div className="triple-toggle-boston-test">
                    <TripleToggleTest
                      key={Lcon.key}
                      value={selectedValues[Lcon.key]}
                      switchPosition={selectedValues[Lcon.key]}
                      animation={animation[Lcon.key]}
                      // quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
                      quantity={quantities[Lcon.key]} // Pass the quantity prop
                      onChange={(value, anime) =>
                        handleTripleToggleChange(value, anime, Lcon.key)
                      }
                      onQuantityChange={(value, anime, quantity) =>
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
                )}
              </div>
              {/* <p className="image-key">{Lcon.key}</p> */}
              <p className="image-name-boston" style={{ color: 'white' }}>
                {names[Lcon.key]}
              </p>
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
                <div className="triple-toggle-boston-test">
                  <TripleToggleTest
                    key={svg.key}
                    value={selectedValues[svg.key]}
                    switchPosition={selectedValues[svg.key]}
                    animation={animation[svg.key]}
                    // quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
                    quantity={quantities[svg.key]}
                    // quantity={100}
                    onChange={(value, anime) =>
                      handleTripleToggleChange(value, anime, svg.key)
                    }
                    onQuantityChange={(value, anime, quantity) =>
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
            {/* <p className="image-key">{svg.key}</p> */}
            <p className="image-name-boston" style={{ color: 'white' }}>
              {names[svg.key]}
            </p>
          </div>
        ))}
      </div>
      <div className="spacing"></div>
      <div className="right-contacts">
        {rightContacts.map((rCon) => (
          <div className="image-item">
            <div className="image-container">
              {React.cloneElement(rCon, {
                key: rCon.key,
                className: `${selectedValues[rCon.key]}-color`,
              })}
              {!isNaN(Number(rCon.key)) && (
                <div className="triple-toggle-boston-test">
                  <TripleToggleTest
                    key={rCon.key}
                    value={selectedValues[rCon.key]}
                    switchPosition={selectedValues[rCon.key]}
                    animation={animation[rCon.key]}
                    // quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
                    quantity={quantities[rCon.key]}
                    onChange={(value, anime) =>
                      handleTripleToggleChange(value, anime, rCon.key)
                    }
                    onQuantityChange={(value, anime, quantity) =>
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
            <p className="image-name-boston" style={{ color: 'white' }}>
              {names[rCon.key]}
            </p>
          </div>
        ))}
      </div>
      <div className="button-container">
        {/* <button
          className="import-button"
          onClick={() => fileInputRef.current.click()}
        >
          Import Data
        </button> */}
        {/* <button
          className="export-button"
          onClick={() => exportToJsonFile(tripleToggleData)}
        >
          Export to LeadDBS
        </button> */}
        {/* <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the input element
        /> */}
        {/* <button
          className={calculateQuantities ? 'active-button' : 'inactive-button'}
          onClick={handleCalculateQuantitiesButtonClick}
        >
          {calculateQuantities ? 'On' : 'Off'}
        </button> */}
        <div className="button-container">
          <h2>Contact Share</h2>
          <OverlayTrigger placement="left" overlay={tooltipspliteven}>
            <button
              onClick={calculateQuantitiesWithDistribution}
              className="button"
            >
              Split Even
            </button>
          </OverlayTrigger>
          {/* <button
            onClick={calculateQuantitiesWithDistribution}
            className="button"
          >
            Split Even
          </button> */}
          <OverlayTrigger placement="left" overlay={tooltiprefactor}>
            <button onClick={roundToHundred} className="button">
              Refactor
            </button>
          </OverlayTrigger>
          <button onClick={handleClearButton} className="button">
            Clear
          </button>
          {/* <button onClick={handleCheck} className="button">
            Check
          </button> */}
          {/* <StaticExample
            show={show}
            setShow={setShow}
            handleClose={handleClose}
          /> */}
          {/* <button
            onClick={assist}
            className={isAssisted ? 'isAssistedButton' : 'button'}
          >
            Assisted
          </button> */}
        </div>
        {handleIPG()}
        {(stimController === 0 || stimController === 3) && (
          <div className="button-container">
            <h2>Steering</h2>
            {/* <div className="steering-container">
            <UpArrow onClick={handlePercAmpChange} />
            <DownArrow onClick={newHandleDownButton} />
            <ClockwiseArrow onClick={handleClockwiseButton} />
            <CounterClockwiseArrow onClick={handleCounterClockwiseButton} />
          </div> */}
            {(stimController === 0 || stimController === 3) && (
              <div className="steering-container">
                <UpArrow onClick={handlePercAmpChangeUp} />
                {/* <UpArrow onClick={newHandleUpButton} /> */}
                <DownArrow onClick={handlePercAmpChangeDown} />
                <ClockwiseArrow onClick={handlePercAmpChangeClockwise} />
                <CounterClockwiseArrow
                  onClick={handlePercAmpChangeCounterClockwise}
                />
              </div>
            )}
            {/* <div className="steering-container">
            <SplitEvenButton onClick={handleSplitEvenButton} />
            <ForwardButton onClick={handleForwardButton} />
            <BackButton onClick={handleBackButton} />
            <LeftButton onClick={handleLeftButton} />
            <RightButton onClick={handleRightButton} />
          </div> */}
          </div>
        )}
        <div className="steering-container">
          {/* <OverlayTrigger id={tooltipspliteven}>
            <SplitEvenButton onClick={handleSplitEvenButton} />
          </OverlayTrigger> */}
          <SplitEvenButton onClick={handleSplitEvenButton} />
          <ForwardButton onClick={handleForwardButton} />
          <BackButton onClick={handleBackButton} />
          <LeftButton onClick={handleRightButton} />
          <RightButton onClick={handleLeftButton} />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(BostonScientificCartesiaX);

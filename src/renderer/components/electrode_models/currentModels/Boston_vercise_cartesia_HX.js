/* eslint-disable camelcase */
// /* eslint-disable no-restricted-globals */
// /* eslint-disable react/prop-types */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react/function-component-definition */
import React, {
  useState,
  useEffect,
  useCallback,
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
import { OverlayTrigger } from 'react-bootstrap';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import QuantityInput2 from '../../QuantityInput2';
import TripleToggleTest from '../../TripleToggleTest';
import './ElecModelStyling/boston_vercise_directed.css';
import { ReactComponent as IPG } from '../images/IPG.svg';
import { ReactComponent as Contact } from '../images/Contact.svg';
import { ReactComponent as Tail } from '../images/ElectrodeTailContact.svg';
import { ReactComponent as RightContact } from '../images/RightContact.svg';
import { ReactComponent as LeftContact } from '../images/LeftContact.svg';
import { ReactComponent as HeadTop } from '../images/head_top.svg';
import { ReactComponent as HeadBottom } from '../images/head_bottom.svg';
import { ReactComponent as UpArrow } from '../images/UpArrow.svg';
import { ReactComponent as DownArrow } from '../images/DownArrow.svg';
import { ReactComponent as ClockwiseArrow } from '../images/ClockwiseArrow.svg';
import { ReactComponent as CounterClockwiseArrow } from '../images/CounterClockwiseArrow.svg';
import { ReactComponent as ForwardButton } from '../images/FrontButton.svg';
import { ReactComponent as BackButton } from '../images/BackButton.svg';
import { ReactComponent as LeftButton } from '../images/LeftButton.svg';
import { ReactComponent as RightButton } from '../images/RightButton.svg';
import { ReactComponent as SplitEvenButton } from '../images/SplitEvenButton.svg';
import PercentageAmplitudeToggle from '../../PercentageAmplitudeToggle';
import AssistedToggle from '../../AssistedToggle';
import VolumeAmplitudeToggle from '../../VoltageAmplitudeToggle';
import MAToggleSwitch from '../../MAToggleSwitch';

function Boston_vercise_cartesia_HX(props, ref) {
  const svgs = [
    <HeadTop key="headTop" />,
    <HeadBottom key="headBottom" />,
    <Contact key="16" level="4" />,
    <Contact key="15" level="3" face="center" />,
    <Contact key="14" level="2" face="center" />,
    <Contact key="13" level="2" face="center" />,
    <Contact key="10" level="4" />,
    <Contact key="7" level="3" face="center" />,
    <Contact key="4" level="2" face="center" />,
    <Contact key="1" level="2" face="center" />,
    <Tail key="tail" fill="transparent" />,
  ];

  const ipgs = [<IPG key="0" />];

  const leftContacts = [
    <Contact key="12" level="3" face="left" />,
    <Contact key="9" level="2" face="left" />,
    <Contact key="6" level="3" face="left" />,
    <Contact key="3" level="2" face="left" />,
  ];

  const rightContacts = [
    <Contact key="11" level="3" face="right" />,
    <Contact key="8" level="2" face="right" />,
    <Contact key="5" level="3" face="right" />,
    <Contact key="2" level="2" face="right" />,
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
    14: 6,
    15: 7,
    16: 8,
  };

  const levelArray = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12],
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
    13: 'all',
    14: 'all',
    15: 'all',
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

  const [percAmpToggle, setPercAmpToggle] = useState(
    props.percAmpToggle || 'left',
  );
  const [volAmpToggle, setVolAmpToggle] = useState(
    props.volAmpToggle || 'center',
  );

  const [researchToggle, setResearchToggle] = useState(
    props.researchToggle || 'left',
  );

  // const [IPGforOutput, setIPGforOutput] = useState(props.outputIPG);

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

  const newInitialQuantities =
    props.IPG === 'Boston'
      ? {
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
        }
      : {
          0: 0,
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
        };

  const [quantities, setQuantities] = useState(
    props.quantities || newInitialQuantities,
  );

  // const [quantities, setQuantities] = useState(
  //   props.quantities ||
  //   {
  //     0: 100,
  //     1: 0,
  //     2: 0,
  //     3: 0,
  //     4: 0,
  //     5: 0,
  //     6: 0,
  //     7: 0,
  //     8: 0,
  //   },
  // );

  const [parameters, setParameters] = useState(
    props.parameters || {
      parameter1: '60',
      parameter2: '130',
      parameter3: '0',
    },
  );

  const [visModel, setVisModel] = useState(props.visModel || '6');

  const [sessionTitle, setSessionTitle] = useState(props.sessionTitle || '');

  const totalQuantity = quantities.plus + quantities.minus;
  let isAssisted = false;

  const [lastChangedInstance, setLastChangedInstance] = useState({
    key: null,
    quantity: null,
    value: null,
    animation: null,
  });

  let outputTogglePosition = 'mA';

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

  const calculateQuantitiesForTwo = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    // This is effectively the number of TripleToggle components that have a value of 'center'
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'center') {
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

  const calculateQuantitiesWithDistribution = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'center') {
      total = totalAmplitude;
      // console.log('Total: ', totalAmplitude);
    }

    // total = totalAmplitude;
    console.log('percAmpToggle: ', percAmpToggle);
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

  const calculateQuantitiesWithDistributionAbbott = () => {
    // Calculate the quantity increment for 'center' and 'right' values
    let total = 0;
    if (percAmpToggle === 'left') {
      total = 100;
    } else if (percAmpToggle === 'center') {
      total = totalAmplitude;
    }

    total = totalAmplitude;

    // total = totalAmplitude;
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
      setPercAmpToggle('right');
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
      });
      console.log('2');
    }
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
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
    } else if (percAmpToggle === 'center') {
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

    let total = totalAmplitude;
    if (percAmpToggle === 'left') {
      total = 100;
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
    let total = totalAmplitude;
    console.log('TOTALAMPLITUDE: ', totalAmplitude);
    console.log('PERCAMPTOGGLE: ', percAmpToggle);
    if (percAmpToggle === 'left') {
      total = 100;
    }
    Object.keys(updatedQuantities).forEach((key) => {
      if (updatedQuantities[key] <= 0) {
        updatedSelectedValues[key] = 'left';
      }
      if (updatedSelectedValues[key] === 'left') {
        updatedQuantities[key] = 0;
      }
      if (updatedQuantities[key] > total) {
        updatedQuantities[key] = total;
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

  // Testing counter clockwise

  const handleCounterClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelChanges = {};
    Object.keys(levelArray).forEach((key) => {
      levelChanges[key] = 0;
    });
    console.log('levelchanges: ', levelChanges);
    Object.keys(selectedValues)
      .reverse()
      .forEach((key) => {
        const currentLevel = level[key];
        const nextKey = parseFloat(key) + 1;
        const previousKey = parseFloat(key) - 1;
        const leftNextKey = parseFloat(key) - 2;
        const centerpreviousKey = parseFloat(key) + 2;
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
        if (
          face[key] === 'left' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            console.log('FACE LEFT');
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
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
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[centerpreviousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              // updatedQuantities[centerNextKey] =
              //   parseFloat(updatedQuantities[centerNextKey]) +
              //   currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                console.log('true');
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
            } else if (updatedSelectedValues[nextKey] === 'left') {
              updatedSelectedValues[nextKey] = updatedSelectedValues[key];
              updatedQuantities[nextKey] =
                parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (
              updatedSelectedValues[key] === updatedSelectedValues[leftNextKey]
            ) {
              if (updatedQuantities[key] < currentLevelTotal / 10) {
                updatedQuantities[leftNextKey] =
                  parseFloat(updatedQuantities[leftNextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[leftNextKey] =
                  parseFloat(updatedQuantities[leftNextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
              // console.log('true');
              // updatedQuantities[nextKey] =
              //   parseFloat(updatedQuantities[nextKey]) + currentLevelTotal / 10;
              // updatedQuantities[key] =
              //   parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
            } else if (updatedSelectedValues[leftNextKey] === 'left') {
              updatedSelectedValues[leftNextKey] = updatedSelectedValues[key];
              updatedQuantities[leftNextKey] =
                parseFloat(updatedQuantities[leftNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    console.log('newlevelquantities: ', levelChanges);
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const handleClockwiseButton = () => {
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelChanges = {};
    Object.keys(levelArray).forEach((key) => {
      levelChanges[key] = 0;
    });
    // console.log('levelchanges: ', levelChanges);
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
        if (
          face[key] === 'left' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
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
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'center' &&
          updatedQuantities[previousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
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
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                console.log('true');
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[centerNextKey] =
                  parseFloat(updatedQuantities[centerNextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              }
            } else if (updatedSelectedValues[centerNextKey] === 'left') {
              updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
              updatedQuantities[centerNextKey] =
                parseFloat(updatedQuantities[centerNextKey]) +
                currentLevelTotal / 10;
              updatedQuantities[key] =
                parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (
          face[key] === 'right' &&
          updatedQuantities[rightPreviousKey] === 0 &&
          levelChanges[level[key]] === 0
        ) {
          if (updatedSelectedValues[key] !== 'left') {
            if (updatedSelectedValues[key] === updatedSelectedValues[nextKey]) {
              if (updatedQuantities[key] <= currentLevelTotal / 10) {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  parseFloat(updatedQuantities[key]);
                updatedQuantities[key] = 0;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
              } else {
                updatedQuantities[nextKey] =
                  parseFloat(updatedQuantities[nextKey]) +
                  currentLevelTotal / 10;
                updatedQuantities[key] =
                  parseFloat(updatedQuantities[key]) - currentLevelTotal / 10;
                levelChanges[parseFloat(level[key])] =
                  levelChanges[parseFloat(level[key])] + 1;
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
              levelChanges[parseFloat(level[key])] =
                levelChanges[parseFloat(level[key])] + 1;
            }
          }
        }
        if (updatedQuantities[key] === 0) {
          updatedSelectedValues[key] = 'left';
        }
      });
    // console.log('newlevelquantities: ', levelTotals);
    setSelectedValues(updatedSelectedValues);
    setQuantities(updatedQuantities);
    // easyRoundUp(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

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

  // function roundAlloc(
  //   beforeLevel,
  //   nextLevel,
  //   levelAboveTotal,
  //   levelBelowTotal,
  //   values,
  //   amtOnContacts,
  // ) {
  //   // let oldTotal = 0;
  //   let newAboveTotal = 0;
  //   let newBelowTotal = 0;
  //   let belowTotal = levelBelowTotal;
  //   let aboveTotal = levelAboveTotal;
  //   Object.keys(values).forEach((key) => {
  //     if (level[key] === beforeLevel) {
  //       values[key] = Math.floor(values[key] + 0.5);
  //       newBelowTotal += values[key];
  //     } else if (level[key] === nextLevel) {
  //       values[key] = Math.floor(values[key] + 0.5);
  //       newAboveTotal += values[key];
  //     }
  //     // values[key] = Math.floor(values[key] + 0.5);
  //     // newTotal += values[key];
  //   });
  //   // console.log('old', oldTotal);
  //   // console.log('new', newTotal);
  //   belowTotal = Math.floor(belowTotal + 0.5);
  //   const belowDiff = belowTotal - newBelowTotal;
  //   aboveTotal = Math.floor(aboveTotal + 0.5);
  //   const aboveDiff = aboveTotal - newAboveTotal;
  //   let doneUpdate = 0;
  //   console.log('above', aboveDiff);
  //   console.log('below', belowDiff);
  //   Object.keys(values).forEach((key) => {
  //     if (values[key] !== 0 && doneUpdate === 0 && level[key] === beforeLevel) {
  //       values[key] += belowDiff;
  //       doneUpdate = 1;
  //     }
  //   });
  //   doneUpdate = 0;
  //   console.log('below level total: ', belowTotal);
  //   Object.keys(values).forEach((key) => {
  //     if (values[key] !== 0 && doneUpdate === 0 && level[key] === nextLevel) {
  //       values[key] += aboveDiff;
  //       doneUpdate = 1;
  //     }
  //     if (amtOnContacts === 3) {
  //       if (aboveTotal % 3 === 0) {
  //         if (level[key] === nextLevel) {
  //           values[key] = aboveTotal / 3;
  //         }
  //       }
  //       if (belowTotal % 3 === 0) {
  //         if (level[key] === beforeLevel) {
  //           values[key] = belowTotal / 3;
  //           console.log('values[key]', values[key]);
  //         }
  //       }
  //     } else if (amtOnContacts === 1) {
  //       console.log('made it here');
  //       if (belowTotal % 3 === 0) {
  //         console.log(beforeLevel);
  //         if (level[key] === beforeLevel) {
  //           console.log('yes');
  //           values[key] = belowTotal / 3;
  //           console.log('values[key]', values[key]);
  //         }
  //       }
  //     }
  //   });
  //   return values;
  // }

  function roundAllocUp(
    beforeLevel,
    nextLevel,
    levelAboveTotal,
    levelBelowTotal,
    values,
    amtOnContacts,
    amtBelowOnContacts,
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
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('key', key);
            console.log(segmentedContact(key));
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      } else if (amtOnContacts === 1 && amtBelowOnContacts === 3) {
        console.log('belowOn: ', amtBelowOnContacts);
        console.log('made it here');
        if (belowTotal % 3 === 0) {
          console.log(beforeLevel);
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('yes');
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      }
    });
    return values;
  }

  // function easyRoundUp(values) {
  //   Object.keys(values).forEach((key) => {
  //     const decimalPart = values[key] % 1;
  //     if (decimalPart >= 0.99) {
  //       values[key] = Math.ceil(values[key]);
  //     }
  //   });
  //   return values;
  // }

  function easyRoundUp(values) {
    Object.keys(values).forEach((key) => {
      const decimalPart = values[key] % 1;

      if (decimalPart >= 0.99) {
        values[key] = Math.ceil(values[key]);
      } else if (decimalPart >= 0.199 && decimalPart < 0.2) {
        values[key] = Math.floor(values[key]) + 0.2;
      } else if (decimalPart >= 0.299 && decimalPart < 0.3) {
        values[key] = Math.floor(values[key]) + 0.3;
      } else if (decimalPart >= 0.399 && decimalPart < 0.4) {
        values[key] = Math.floor(values[key]) + 0.4;
      } else if (decimalPart >= 0.499 && decimalPart < 0.5) {
        values[key] = Math.floor(values[key]) + 0.5;
      } else if (decimalPart >= 0.599 && decimalPart < 0.6) {
        values[key] = Math.floor(values[key]) + 0.6;
      } else if (decimalPart >= 0.699 && decimalPart < 0.7) {
        values[key] = Math.floor(values[key]) + 0.7;
      } else if (decimalPart >= 0.799 && decimalPart < 0.8) {
        values[key] = Math.floor(values[key]) + 0.8;
      } else if (decimalPart >= 0.899 && decimalPart < 0.9) {
        values[key] = Math.floor(values[key]) + 0.9;
      } else if (decimalPart > 0 && decimalPart < 0.0001) {
        values[key] = Math.floor(values[key]);
      }

      // Remove trailing .00 if the value is a whole number
      if (values[key] % 1 === 0) {
        values[key] = Math.floor(values[key]);
      }
    });
    return values;
  }

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
      }
    });
    setSelectedValues(updatedSelectedValues);
    console.log('before level', previousLevel);
    // roundAllocUp(
    //   previousLevel,
    //   levelAbove,
    //   levelAboveQuantityTotal,
    //   levelBelowQuantityTotal,
    //   updatedQuantities,
    //   numAboveOnContacts,
    //   numOnContacts,
    // );
    easyRoundUp(updatedQuantities);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const newHandleUpButtonAmplitude = () => {
    // newRoundToHundred();
    // console.log('passed');
    // console.log('quantities: ', quantities);
    vectorMakeUpAmplitude();
    const newQuantities = newRoundToHundred();
    // console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
    // const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const levelIncrement = 0.1;
    const previousLevel = Math.floor(vectorLevel);
    vectorLevel += levelIncrement;
    const currentLevel = Math.floor(vectorLevel);
    // console.log('currentLevel: ', currentLevel);
    // console.log('previousLevel: ', previousLevel);
    const levelBelow =
      currentLevel !== previousLevel ? previousLevel : Math.floor(vectorLevel);
    // const levelBelow = Math.floor(vectorLevel);
    // const levelAbove = Math.ceil(vectorLevel);
    const levelAbove = levelBelow + 1;
    // console.log('Level Below', levelBelow);
    // console.log('level Above', levelAbove);
    const percDiff = vectorLevel - levelBelow;
    const levelBelowQuantityTotal = totalAmplitude * (1 - percDiff);
    console.log('HELEOELEO: ', percDiff);
    const levelAboveQuantityTotal = totalAmplitude - levelBelowQuantityTotal;
    // Want to figure out how many contacts are "on" at a level

    const onContacts = getOnContacts(levelBelow);
    const numOnContacts = getOnContacts(levelBelow).length;
    const aboveOnContacts = getOnContacts(levelAbove);
    const numAboveOnContacts = aboveOnContacts.length;
    // console.log('On Contacts', onContacts);
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
          // console.log('LevelBelowKey: ', key);
          Object.keys(onContacts).forEach((contact) => {
            console.log('ONCONTACTS: ', onContacts[contact]);
            if (parseFloat(key) === onContacts[contact]) {
              // console.log('madeItHere');
              console.log('HELLO: ', updatedQuantities[key]);
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
      }
    });
    setSelectedValues(updatedSelectedValues);
    console.log('before level', previousLevel);
    // roundAllocUp(
    //   previousLevel,
    //   levelAbove,
    //   levelAboveQuantityTotal,
    //   levelBelowQuantityTotal,
    //   updatedQuantities,
    //   numAboveOnContacts,
    //   numOnContacts,
    // );
    easyRoundUp(updatedQuantities);
    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  // const newHandleUpButtonAmplitude = () => {
  //   vectorMakeUpAmplitude();
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
  //   const levelBelowQuantityTotal = totalAmplitude * (1 - percDiff);
  //   const levelAboveQuantityTotal = totalAmplitude - levelBelowQuantityTotal;
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
  //       } else if (
  //         face[key] !== 'all' &&
  //         numOnContacts !== 0 &&
  //         updatedQuantities[key] !== 0
  //       ) {
  //         // for (let i = 0; i < numOnContacts; i++) {
  //         //   console.log('numOnContactsQuantities', key);
  //         //   if (key === onContacts[i]) {
  //         //     console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
  //         //     updatedQuantities[onContacts[i]] =
  //         //     // levelBelowQuantityTotal / parseFloat(numOnContacts);
  //         //     // console.log('numOnContacts: ', numOnContacts);
  //         //     // console.log('numOnContactsQuantities', updatedQuantities[onContacts[i]]);
  //         //     parseFloat(updatedQuantities[onContacts[i]]) -
  //         //     (100 * levelIncrement) / numOnContacts;
  //         //   }
  //         // }
  //         // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  //         Object.keys(onContacts).forEach((contact) => {
  //           console.log('key: ', key);
  //           if (parseFloat(key) === onContacts[contact]) {
  //             // console.log('madeItHere');
  //             updatedQuantities[key] =
  //               parseFloat(updatedQuantities[key]) -
  //               (totalAmplitude * levelIncrement) / numOnContacts;
  //           }
  //         });
  //       }
  //       // if (levelBelowQuantityTotal === 0) {
  //       //   updatedSelectedValues[key] = 'left';
  //       // }
  //     }
  //     if (level[key] === levelAbove) {
  //       if (face[key] !== 'all') {
  //         if (segmentedContact(levelBelow)) {
  //           Object.keys(onContacts).forEach((contact) => {
  //             if (face[key] === face[onContacts[contact]]) {
  //               updatedQuantities[key] =
  //                 parseFloat(updatedQuantities[key]) +
  //                 (totalAmplitude * levelIncrement) / numOnContacts;
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
  //             parseFloat(updatedQuantities[key]) +
  //             (totalAmplitude * levelIncrement) / 3;
  //           updatedSelectedValues[key] = updatedSelectedValues[levelBelowKey];
  //         }
  //       }
  //       if (face[key] === 'all') {
  //         updatedQuantities[key] = levelAboveQuantityTotal;
  //         updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //       }
  //       // if (face[key] !== 'all') {
  //       //   for (let i = 0; i < numAboveOnContacts; i++) {
  //       //     if (face[key] === face[aboveOnContacts[i]]) {
  //       //       updatedQuantities[key] =
  //       //         levelAboveQuantityTotal / numAboveOnContacts;
  //       //       console.log('UpdatedQuantities: ', updatedQuantities);
  //       //       if (updatedQuantities[key] !== 0) {
  //       //         updatedSelectedValues[key] =
  //       //           updatedSelectedValues[aboveOnContacts[i]];
  //       //       }
  //       //     }
  //       //   }
  //       //   setSelectedValues(updatedSelectedValues);
  //       //   setQuantities(updatedQuantities);
  //       //   const newaboveOnContacts = getOnContacts(levelAbove);
  //       //   const newnumAboveOnContacts = newaboveOnContacts.length;
  //       //   if (newnumAboveOnContacts === 0) {
  //       //     console.log('hello');
  //       //     updatedQuantities[key] = levelAboveQuantityTotal / 3;
  //       //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //       //     // if (updatedQuantities[key] !== 0) {
  //       //     //   updatedSelectedValues[key] = updatedSelectedValues[aboveOnContacts[0]];
  //       //     // }
  //       //   }
  //       // } else if (face[key] === 'all') {
  //       //   updatedQuantities[key] = levelAboveQuantityTotal;
  //       //   if (updatedQuantities[key] !== 0) {
  //       //     updatedSelectedValues[key] = updatedSelectedValues[onContacts[0]];
  //       //   }
  //       // }
  //     }
  //   });
  //   // Object.keys(updatedQuantities).forEach((key) => {
  //   //   if (level[key] !== levelAbove || levelBelow) {
  //   //     updatedQuantities[key] = 0;
  //   //     updatedSelectedValues[key] = 'left';
  //   //   }
  //   // });
  //   setSelectedValues(updatedSelectedValues);
  //   easyRoundUp(updatedQuantities);
  //   setQuantities(updatedQuantities);
  //   checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  // };

  function roundAllocDown(
    beforeLevel,
    nextLevel,
    levelAboveTotal,
    levelBelowTotal,
    values,
    amtOnContacts,
    amtBelowOnContacts,
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
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('key', key);
            console.log(segmentedContact(key));
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      } else if (amtOnContacts === 1 && amtBelowOnContacts === 3) {
        console.log('belowOn: ', amtBelowOnContacts);
        console.log('made it here');
        if (belowTotal % 3 === 0) {
          console.log(beforeLevel);
          if (level[key] === beforeLevel && segmentedContact(key)) {
            console.log('yes');
            values[key] = belowTotal / 3;
            console.log('values[key]', values[key]);
          }
        }
      }
    });
    return values;
  }
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
    console.log('levelBelowQuantity: ', levelBelowQuantityTotal);
    if (Math.ceil(levelBelowQuantityTotal) === 100) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (level[key] === levelAbove) {
          updatedQuantities[key] = 0;
          updatedSelectedValues[key] = 'left';
        }
      });
    }
    setSelectedValues(updatedSelectedValues);
    // roundAllocDown(
    //   previousLevel,
    //   levelAbove,
    //   levelBelowQuantityTotal,
    //   levelAboveQuantityTotal,
    //   updatedQuantities,
    //   numOnContacts,
    //   numAboveOnContacts,
    // );
    easyRoundUp(updatedQuantities);

    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  const newHandleDownButtonAmplitude = () => {
    vectorMakeUpAmplitude();
    // const updatedQuantities = { ...quantities };
    const newQuantities = newRoundToHundred();
    console.log('newQuantities: ', newQuantities);
    const updatedQuantities = { ...newQuantities };
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
    console.log('levelBelowQuantity: ', levelBelowQuantityTotal);
    if (Math.ceil(levelBelowQuantityTotal) === totalAmplitude) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (level[key] === levelAbove) {
          updatedQuantities[key] = 0;
          updatedSelectedValues[key] = 'left';
        }
      });
    }
    setSelectedValues(updatedSelectedValues);
    // roundAllocDown(
    //   previousLevel,
    //   levelAbove,
    //   levelBelowQuantityTotal,
    //   levelAboveQuantityTotal,
    //   updatedQuantities,
    //   numOnContacts,
    //   numAboveOnContacts,
    // );
    easyRoundUp(updatedQuantities);

    setQuantities(updatedQuantities);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
  };

  // const newHandleDownButtonAmplitude = () => {
  //   vectorMakeUpAmplitude();
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
  //   console.log('Level Below', levelBelow);
  //   console.log('level Above', levelAbove);
  //   const percDiff = Math.abs(vectorLevel - levelAbove);
  //   const levelAboveQuantityTotal = totalAmplitude * (1 - percDiff);
  //   const levelBelowQuantityTotal = totalAmplitude - levelAboveQuantityTotal;
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
  //         if (face[key] === 'all') {
  //           updatedQuantities[key] = levelAboveQuantityTotal;
  //         } else if (
  //           face[key] !== 'all' &&
  //           numAboveOnContacts !== 0 &&
  //           updatedQuantities[key] !== 0
  //         ) {
  //           Object.keys(aboveOnContacts).forEach((contact) => {
  //             if (parseFloat(key) === aboveOnContacts[contact]) {
  //               updatedQuantities[key] =
  //                 parseFloat(updatedQuantities[key]) -
  //                 (totalAmplitude * levelIncrement) / numAboveOnContacts;
  //             }
  //           });
  //         }
  //         // if (levelBelowQuantityTotal === 0) {
  //         //   updatedSelectedValues[key] = 'left';
  //         // }
  //       }
  //       if (level[key] === levelBelow) {
  //         if (face[key] !== 'all') {
  //           if (segmentedLevel(levelAbove)) {
  //             // console.log(levelAbove);
  //             console.log('Madeit: ', levelAbove);
  //             Object.keys(aboveOnContacts).forEach((contact) => {
  //               if (face[key] === face[aboveOnContacts[contact]]) {
  //                 updatedQuantities[key] =
  //                   parseFloat(updatedQuantities[key]) +
  //                   (totalAmplitude * levelIncrement) / numAboveOnContacts;
  //                 updatedSelectedValues[key] =
  //                   updatedSelectedValues[aboveOnContacts[contact]];
  //               }
  //             });
  //           } else {
  //             console.log('Made it');
  //             let levelAboveKey = 0;
  //             Object.keys(level).forEach((keys) => {
  //               if (level[keys] === levelAbove) {
  //                 levelAboveKey = keys;
  //               }
  //             });
  //             updatedSelectedValues[key] = updatedSelectedValues[levelAboveKey];
  //             updatedQuantities[key] =
  //               parseFloat(updatedQuantities[key]) +
  //               (totalAmplitude * levelIncrement) / 3;
  //           }
  //         } else if (face[key] === 'all') {
  //           updatedQuantities[key] = levelBelowQuantityTotal;
  //           updatedSelectedValues[key] =
  //             updatedSelectedValues[aboveOnContacts[0]];
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
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // skip to next iteration
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        // updatedSelectedValues[key] = 'center';
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
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
    Object.keys(levelQuantities).forEach((key) => {
      if (levelQuantities[key] !== 0 && segmentedLevel(key)) {
        console.log('hello');
        counter += 1;
      }
    });
    console.log('Counter: ', counter);
    Object.keys(updatedQuantities).forEach((key) => {
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (
        (face[key] === 'left' || face[key] === 'right') &&
        levelQuantities[level[key]] !== 0
      ) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        // updatedSelectedValues[key] = 'center';
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
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
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      // keyLevel = getOnContacts[level[key]]
      const levelOnContacts = getOnContacts(level[key]);
      if (face[key] === 'left' && levelQuantities[level[key]] !== 0) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
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
      if (face[key] === 'all' || key === '0') {
        return; // Skip this iteration
      }
      const levelOnContacts = getOnContacts(level[key]);
      if (
        face[key] === 'right' &&
        levelQuantities[level[key]] !== 0 &&
        key !== 0
      ) {
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = (3 * levelQuantities[level[key]]) / 4;
        // }
      } else if (
        face[key] === 'center' &&
        levelQuantities[level[key]] !== 0 &&
        key !== 0
      ) {
        updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
        // updatedSelectedValues[key] = 'center';
        updatedQuantities[key] = levelQuantities[level[key]] / 4;
      } else if (key !== 0) {
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
        console.log('hello:');
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
      if (levelQuantities[level[key]] !== 0 && level[key] !== 0) {
        const levelOnContacts = getOnContacts(level[key]);
        console.log('levelQuantities', levelQuantities);
        // console.log('length ', getOnContacts(level[key]).length);
        // if (getOnContacts(level[key]).length > 0) {
        // console.log('facesVec ', counter);
        if (face[key] !== 'all' && key !== 0) {
          updatedSelectedValues[key] = selectedValues[levelOnContacts[0]]; // Need to fix this
          updatedQuantities[key] = levelQuantities[level[key]] / 3;
        }
        // }
      }
      // else if (face[key] === 'center' && levelQuantities[level[key]] !== 0) {
      //   updatedSelectedValues[key] = 'center';
      //   updatedQuantities[key] = levelQuantities[level[key]] / 4;
      // }
      // else {
      //   updatedSelectedValues[key] = 'left';
      //   updatedQuantities[key] = 0;
      // }
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
      // gets the sum of negative polarity
      if (updatedSelectedValues[key] === 'center') {
        negativeSum += parseFloat(updatedQuantities[key]);
        centerCount += 1;
        // console.log('negativeSum: ', negativeSum);
        // gets the sum of positive polarity
      } else if (updatedSelectedValues[key] === 'right') {
        positiveSum += parseFloat(updatedQuantities[key]);
        rightCount += 1;
        // console.log('positiveSum: ', positiveSum);
      }
    });

    Object.keys(updatedQuantities).find((key) => {
      // Negative polarity
      if (updatedSelectedValues[key] === 'center') {
        if (key === lastChangedKey) {
          negativeModifiedKey = key;
          // console.log('negativeModifiedKey: ', negativeModifiedKey);
          return true; // exit loop
        }
      }
      // Positive polarity
      if (updatedSelectedValues[key] === 'right') {
        if (key === lastChangedKey) {
          positiveModifiedKey = key;
          // console.log('positiveModifiedKey: ', positiveModifiedKey);
          return true; // exit loop
        }
      }
      return false; // continue looping
    });

    if (negativeSum === 100) {
      Object.keys(updatedQuantities).forEach((key) => {
        if (key === negativeModifiedKey && updatedQuantities[key] === 0) {
          updatedQuantities[key] = 10;
        }
      });
    }

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
    // if (negativeSum === 100) {
    //   Object.keys(updatedQuantities).forEach((key) => {
    //     if ()
    //   })
    // }
    // roundAllocUp();
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
    checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    // return quantities;
    // Return the modified quantities
  }

  const semiAssist = useCallback(() => {
    // Function implementation
    const updatedQuantities = { ...quantities };
    let total = totalAmplitude;
    if (props.IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        total = 100;
      }
    }
    if (props.IPG === 'Research') {
      if (researchToggle === 'left') {
        total = 100;
      }
    }
    // const updatedSelectedValues = { ...selectedValues };
    let count = 0;
    const lastKey = [];
    Object.keys(updatedQuantities).forEach((key) => {
      if (key !== 0 && selectedValues[key] === 'center') {
        count += 1;
        lastKey.push(key);
      }
    });
    if (count === 1) {
      updatedQuantities[lastKey[0]] = total;
    }

    let rightCount = 0;
    const rightLastKey = [];
    Object.keys(updatedQuantities).forEach((key) => {
      if (selectedValues[key] === 'right') {
        rightCount += 1;
        rightLastKey.push(key);
      }
    });
    if (rightCount === 1) {
      updatedQuantities[rightLastKey[0]] = total;
    }
    setQuantities(updatedQuantities);
  }, [
    percAmpToggle,
    props.IPG,
    quantities,
    researchToggle,
    selectedValues,
    totalAmplitude,
  ]);

  // const semiAssist = () => {
  //   const updatedQuantities = { ...quantities };
  //   let total = totalAmplitude;
  //   if (props.IPG === 'Boston') {
  //     if (percAmpToggle === 'left') {
  //       total = 100;
  //     }
  //   }
  //   if (props.IPG === 'Research') {
  //     if (researchToggle === 'left') {
  //       total = 100;
  //     }
  //   }
  //   // const updatedSelectedValues = { ...selectedValues };
  //   let count = 0;
  //   const lastKey = [];
  //   Object.keys(updatedQuantities).forEach((key) => {
  //     if (key !== 0 && selectedValues[key] === 'center') {
  //       count += 1;
  //       lastKey.push(key);
  //     }
  //   });
  //   if (count === 1) {
  //     updatedQuantities[lastKey[0]] = total;
  //   }
  //   setQuantities(updatedQuantities);
  // };

  function assist() {
    isAssisted = !isAssisted;
    if (isAssisted) {
      assistedMode();
    }
    // console.log('isAssisted: ', isAssisted);
  }

  const handleQuantityChange = (quantity, key) => {
    const updatedQuantities = { ...quantities, [key]: quantity };
    /// /////Steering for two components logic///////
    if (assistedModeEnabled) {
      const newQuantities = assistedMode();
      setQuantities(newQuantities);
    }
    setQuantities(updatedQuantities);
    setLastChangedKey(key);
    console.log('lastChangedKey: ', lastChangedKey);
  };

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
    } else if (percAmpToggle === 'center') {
      newHandleUpButtonAmplitude();
    }
  };

  const handlePercAmpChangeClockwise = () => {
    if (percAmpToggle === 'left') {
      handleClockwiseButton();
    } else if (percAmpToggle === 'center') {
      handleClockwiseButton();
    }
  };

  const handlePercAmpChangeCounterClockwise = () => {
    if (percAmpToggle === 'left') {
      handleCounterClockwiseButton();
    } else if (percAmpToggle === 'center') {
      handleCounterClockwiseButton();
    }
  };

  const handlePercAmpChangeDown = () => {
    if (percAmpToggle === 'left') {
      newHandleDownButton();
    } else if (percAmpToggle === 'center') {
      newHandleDownButtonAmplitude();
    }
  };

  useEffect(() => {
    if (importedData) {
      updateDataFromJson(importedData);
    }
  }, [importedData]);

  const fileInputRef = useRef(null);

  /// /////////////////////////  Export to TabbedElectrodeIPGSelection   /////////////////////////////
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

  const getStatePercAmpToggle = () => {
    return percAmpToggle;
  };

  const getStateVolAmpToggle = () => {
    return volAmpToggle;
  };

  const getStateTogglePosition = () => {
    if (props.IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        outputTogglePosition = '%';
      }
    } else if (props.IPG === 'Medtronic_Activa') {
      console.log('volAmpToggle: ', volAmpToggle);
      if (volAmpToggle === 'right') {
        outputTogglePosition = 'V';
      }
    }
    return outputTogglePosition;
  };

  // const getOutputIPG = () => {
  //   // if (props.IPG = 'Boston') {
  //   //   if (percAmpToggle === 'right') {
  //   //     handlePercAmpToggleChange('left');
  //   //   }
  //   // } else if ()
  //   return IPGforOutput;
  // };

  useImperativeHandle(ref, () => ({
    getCartesiaData,
    getStateQuantities,
    getStateSelectedValues,
    getStateAmplitude,
    getStateStimulationParameters,
    getStateSessionTitle,
    getStateVisModel,
    getStateTogglePosition,
    getStatePercAmpToggle,
    getStateVolAmpToggle,
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
      if (percAmpToggle !== 'center') {
        setPercAmpToggle('center');
        // setIPGforOutput('')
      }
      // if (volAmpToggle === 'left') {
      //   setIPGforOutput('mA');
      // } else {
      //   setIPGforOutput('V');
      // }
    } else if (props.IPG === 'Abbott') {
      stimController = 2;
      // setIPGforOutput('mA');
    } else if (props.IPG === 'Medtronic_Percept') {
      stimController = 3;
      if (percAmpToggle !== 'center') {
        setPercAmpToggle('center');
      }
      // setIPGforOutput('mA');
    }
    // else if (props.IPG === 'Boston') {
    //   if (percAmpToggle === 'left') {
    //     setIPGforOutput('%');
    //   } else {
    //     setIPGforOutput('mA');
    //   }
    // }
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

  const [percAmpAnimation, setPercAmpAnimation] = useState(null);
  // Percentage vs mA toggle switch

  const handlePercAmpToggleChange = (value) => {
    console.log('value', value);
    const newValue = value;
    if (newValue === 'left') {
      // setTotalAmplitude(0);
      calculatePercentageFromAmplitude();
      outputTogglePosition = '%';
    } else if (newValue === 'center') {
      outputTogglePosition = 'mA';
      calculateAmplitudeFromPercentage();
    }
    console.log(value);
    setPercAmpToggle(value);
  };

  const handleResearchToggleChange = (value) => {
    console.log('ResearchToggle; ', researchToggle);
    console.log('NewValue: ', value);
    const newValue = value;
    console.log(newValue);
    if (newValue === 'left') {
      calculatePercentageFromAmplitude();
      outputTogglePosition = '%';
    } else if (newValue === 'center' && researchToggle !== 'right') {
      calculateAmplitudeFromPercentage();
      outputTogglePosition = 'mA';
    } else if (newValue === 'right') {
      if (researchToggle === 'left') {
        calculateAmplitudeFromPercentage();
      }
      outputTogglePosition = 'V';
      console.log(outputTogglePosition);
    }
    setResearchToggle(newValue);
    // setResearchTogg
  };

  const [assistedToggle, setAssistedToggle] = useState('left');

  const handleAssistedToggleChange = (value) => {
    setAssistedToggle(value);
  };

  const ampToggle = 'left';

  const handleVolAmpToggleChange = (value) => {
    const newValue = value;
    if (newValue === 'left') {
      outputTogglePosition = 'mA';
    } else if (newValue === 'right') {
      outputTogglePosition = 'V';
    }
    setVolAmpToggle(value);
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
  const handleSteeringModeChange = (value) => {
    let updatedSelectedValues = { ...selectedValues };
    let updatedQuantities = { ...quantities };
    let total = totalAmplitude;
    if (props.IPG === 'Boston') {
      if (percAmpToggle === 'left') {
        total = 100;
      }
    }
    console.log('Value: ', value);
    console.log('Total: ', total);
    if (value === '2') {
      console.log('Made it here');
      updatedSelectedValues = {
        0: 'right',
        1: 'center',
        2: 'left',
        3: 'left',
        4: 'left',
        5: 'left',
        6: 'left',
        7: 'left',
        8: 'left',
      };
      updatedQuantities = {
        0: total,
        1: total,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
      };
      // setSelectedValues(updatedSelectedValues);
      // setQuantities(updatedQuantities);
      // calculateQuantitiesWithDistribution();
    }
    console.log(updatedQuantities);
    setRadioValue(value);
    // checkQuantitiesAndValues(updatedQuantities, updatedSelectedValues);
    // semiAssist();
    console.log('Quantities: ', quantities);
  };

  const radios = [
    { name: 'None', value: '1' },
    { name: 'Steering', value: '2' },
  ];

  const percAmpDef = [
    { name: '%', value: 'left' },
    { name: 'mA', value: 'center' },
  ];

  const volAmpDef = [
    { name: 'mA', value: 'center' },
    { name: 'V', value: 'right' },
  ];

  const ampDef = [{ name: 'mA', value: 'center' }];

  const researchDef = [
    { name: '%', value: 'left' },
    { name: 'mA', value: 'center' },
    { name: 'V', value: 'right' },
  ];

  const handleVisModelChange = (event) => {
    setVisModel(event.target.value);
  };

  const handleTitleChange = (event) => {
    setSessionTitle(event.target.value);
  };

  const getVariant = (value) => {
    // if (value === 'left') {
    //     return 'outline-success';  // Green outline for 'left'
    // } else if (value === 'right') {
    //     return 'outline-danger';  // Red outline for 'right'
    // } else {
    //     return 'outline-secondary';  // Default secondary outline
    // }
    return 'outline-secondary';
  };

  const tooltipspliteven = (
    <Tooltip id="tooltip">
      Evenly share current between active contacts.
    </Tooltip>
  );

  const tooltiprefactor = (
    <Tooltip id="tooltip">Make sure contacts sum to 100.</Tooltip>
  );

  const getSwitchAnimationPercAmp = (value, switchPosition) => {
    if (value === 'right' && switchPosition === 'left') {
      setPercAmpAnimation('leftRight');
    } else if (value === 'left' && switchPosition === 'right') {
      setPercAmpAnimation('rightLeft');
    }
    // this.props.onChange(value, animation);
    // this.setState({ switchPosition: value, animation });
  };

  useEffect(() => {
    if (props.IPG === 'Abbott') {
      // const newQuantities = { ...quantities };
      calculateQuantitiesWithDistributionAbbott();
    }
    // console.log('outputTogglePosition: ', outputTogglePosition);
    if (radioValue === '1') {
      semiAssist();
    }
    if (outputTogglePosition === 'V') {
      console.log('here');
      handleActivaVoltage();
    }

    // if (radioValue === '2' && props.IPG === 'Boston' && percAmpToggle === 'left') {
    //   // assistedMode();
    //   calculateQuantitiesWithDistribution();
    // } else if (
    //   radioValue === '2' &&
    //   (outputTogglePosition === 'mA' || outputTogglePosition === 'V')
    // ) {
    //   calculateQuantitiesWithDistributionAbbott();
    // }
    // if (props.stimChanged) {
    //   setQuantities(props.allQuantities(props.key));
    //   props.setStimChanged(false);
    // }
    // if (props.IPG === 'Medtronic_Activa') {
    //   if (volAmpToggle === 'left') {
    //     handleActivaAmplitude();
    //   } else if (volAmpToggle === 'right') {
    //     handleActivaVoltage();
    //   }
    // }
    // assist();
  }, [
    props.IPG,
    radioValue,
    outputTogglePosition,
    calculateQuantitiesWithDistributionAbbott,
    semiAssist,
    handleActivaVoltage,
  ]);
  /// //////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container">
      <div className="">
        {/* <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter session ID"
            value={sessionTitle}
            onChange={handleTitleChange}
          />
        </Form.Group> */}
        <div className="button-container">
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
            <option value="6">OSS-DBS (Butenko 2020)</option>
          </Form.Select>
          <div />
          <div className="PercentageAmplitudeToggle">
            {props.IPG === 'Boston' && (
              <ButtonGroup className="button-group">
                {percAmpDef.map((percAmp, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`percAmp-${idx}`}
                    type="radio"
                    variant={getVariant(percAmp.value)}
                    name="percAmp"
                    value={percAmp.value}
                    checked={percAmpToggle === percAmp.value}
                    onChange={(e) =>
                      handlePercAmpToggleChange(e.currentTarget.value)
                    }
                  >
                    {percAmp.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            )}
            {/* {props.IPG === 'Medtronic_Activa' && (
            <VolumeAmplitudeToggle
              value={volAmpToggle}
              onChange={(value) => handleVolAmpToggleChange(value)}
            />
          )} */}
            {props.IPG === 'Medtronic_Activa' && (
              <ButtonGroup className="button-group">
                {volAmpDef.map((volAmp, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`volAmp-${idx}`}
                    type="radio"
                    variant={getVariant(volAmp.value)}
                    name="volAmp"
                    value={volAmp.value}
                    checked={volAmpToggle === volAmp.value}
                    onChange={(e) =>
                      handleVolAmpToggleChange(e.currentTarget.value)
                    }
                  >
                    {volAmp.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            )}
            {(props.IPG === 'Medtronic_Percept' || props.IPG === 'Abbott') && (
              <ButtonGroup className="button-group">
                {ampDef.map((amp, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`amp-${idx}`}
                    type="radio"
                    variant={getVariant(amp.value)}
                    name="amp"
                    value={amp.value}
                    checked={ampToggle === amp.value}
                  >
                    {amp.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            )}
            {props.IPG === 'Research' && (
              <ButtonGroup className="button-group">
                {researchDef.map((res, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`res-${idx}`}
                    type="radio"
                    variant={getVariant(res.value)}
                    name="res"
                    value={res.value}
                    checked={researchToggle === res.value}
                    onChange={(e) =>
                      handleResearchToggleChange(e.currentTarget.value)
                    }
                  >
                    {res.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            )}
          </div>
          <div className="input-wrapper">
            <input
              className="param-input"
              type="number"
              name="quantity"
              pattern="[0-9]+"
              value={totalAmplitude}
              onChange={handleTotalAmplitudeChange}
            />
            <span className="input-adornment">{outputTogglePosition}</span>
          </div>
        </div>
        {/* <div className="button-container">
          <label className="puls-label">Total Amplitude</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={totalAmplitude}
            onChange={handleTotalAmplitudeChange}
          />
        </div> */}
        <div className="button-container">
          {/* <label className="puls-label">Pulsewidth (us):</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={parameters.parameter1}
            onChange={handleParameterChange('parameter1')}
          />
          <label className="puls-label">Frequency (Hz):</label>
          <input
            className="new-quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={parameters.parameter2}
            onChange={handleParameterChange('parameter2')}
          /> */}
          <div className="input-wrapper">
            <input
              className="param-input"
              type="number"
              name="quantity"
              pattern="[0-9]+"
              value={parameters.parameter1}
              onChange={handleParameterChange('parameter1')}
            />
            <span className="input-adornment">μs</span>
          </div>
          <div className="input-wrapper">
            <input
              className="param-input"
              type="number"
              name="quantity"
              pattern="[0-9]+"
              value={parameters.parameter2}
              onChange={handleParameterChange('parameter2')}
            />
            <span className="input-adornment">hz</span>
          </div>
          {/* <QuantityInput2
            value={parameters.parameter1}
            onChange={handleParameterChange('parameter1')}
            min={0}
            label="us"
          /> */}
          {/* <QuantityInput2
            value={parameters.parameter2}
            onChange={handleParameterChange('parameter2')}
            min={0}
            label="hz"
          /> */}
        </div>
        <div className="button-container">
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
                onChange={(e) =>
                  handleSteeringModeChange(e.currentTarget.value)
                }
                // onChange={(e) => setRadioValue(e.currentTarget.value)}
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
        <div className="left-hx-contacts">
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
      <div className="right-hx-contacts">
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
      <div>
        {handleIPG()}
        {radioValue === '2' &&
          (stimController === 0 || stimController === 3) && (
            <div className="button-container">
              {/* <h2 style={{color: 'black'}}>Steering</h2> */}
              <span style={{ color: 'black' }}>Steering</span>
              <ButtonGroup horizontal>
                <Button onClick={handlePercAmpChangeUp}>↑</Button>
                <Button disabled>Level</Button>
                <Button onClick={handlePercAmpChangeDown}>↓</Button>
              </ButtonGroup>
              <ButtonGroup horizontal>
                <Button onClick={handlePercAmpChangeClockwise}>↻</Button>
                <Button disabled>Post-Lat</Button>
                <Button onClick={handlePercAmpChangeCounterClockwise}>↺</Button>
              </ButtonGroup>
            </div>
          )}
        {radioValue === '2' && (
          <div className="steering-container-special-buttons">
            <SplitEvenButton
              className="svgButtons"
              onClick={handleSplitEvenButton}
            />
            <ForwardButton
              className="svgButtons"
              onClick={handleForwardButton}
            />
            <BackButton className="svgButtons" onClick={handleBackButton} />
            <LeftButton className="svgButtons" onClick={handleRightButton} />
            <RightButton className="svgButtons" onClick={handleLeftButton} />
          </div>
        )}
        {/* <div className="steering-container-special-buttons">
          <SplitEvenButton
            className="svgButtons"
            onClick={handleSplitEvenButton}
          />
          <ForwardButton className="svgButtons" onClick={handleForwardButton} />
          <BackButton className="svgButtons" onClick={handleBackButton} />
          <LeftButton className="svgButtons" onClick={handleRightButton} />
          <RightButton className="svgButtons" onClick={handleLeftButton} />
        </div> */}
        <div style={{ textAlign: 'center' }}>
          {/* {outputTogglePosition} */}
          <ButtonGroup vertical>
            <Button
              onClick={calculateQuantitiesWithDistribution}
              className="button"
              disabled={outputTogglePosition === 'V'}
            >
              Split Even
            </Button>
            <Button onClick={roundToHundred} className="button">
              Refactor
            </Button>
            <Button onClick={handleClearButton} className="button">
              Clear
            </Button>
          </ButtonGroup>
          {/* <button
            onClick={calculateQuantitiesWithDistribution}
            className="button"
          >
            Split Even
          </button>
          <button onClick={roundToHundred} className="button">
            Refactor
          </button>
          <button onClick={handleClearButton} className="button">
            Clear
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Boston_vercise_cartesia_HX);

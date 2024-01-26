export const handleClockwiseButton = (quantities, selectedValues, level, face, setSelectedValues, setQuantities) => {
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
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[nextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[nextKey] = updatedSelectedValues[key];
            updatedQuantities[nextKey] =
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
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
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[nextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[nextKey] = updatedSelectedValues[key];
            updatedQuantities[nextKey] =
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          }
        }
      }
      if (face[key] === 'right' && updatedQuantities[previousKey] === 0) {
        if (updatedSelectedValues[key] !== 'left') {
          if (
            updatedSelectedValues[key] === updatedSelectedValues[rightNextKey]
          ) {
            updatedQuantities[rightNextKey] =
              parseFloat(updatedQuantities[rightNextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[rightNextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[rightNextKey] = updatedSelectedValues[key];
            updatedQuantities[rightNextKey] =
              parseFloat(updatedQuantities[rightNextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
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

export const handleCounterClockwiseButton = (quantities, selectedValues, level, face, setSelectedValues, setQuantities) => {
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
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[nextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[nextKey] = updatedSelectedValues[key];
            updatedQuantities[nextKey] =
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
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
              parseFloat(updatedQuantities[centerNextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[centerNextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[centerNextKey] = updatedSelectedValues[key];
            updatedQuantities[centerNextKey] =
              parseFloat(updatedQuantities[centerNextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
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
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
          } else if (updatedSelectedValues[nextKey] === 'left') {
            console.log('HelloHello');
            updatedSelectedValues[nextKey] = updatedSelectedValues[key];
            updatedQuantities[nextKey] =
              parseFloat(updatedQuantities[nextKey]) + 10;
            updatedQuantities[key] = parseFloat(updatedQuantities[key]) - 10;
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

export const newHandleUpButton = (
  vectorMakeUp,
  quantities,
  selectedValues,
  vectorLevel,
  getOnContacts,
  level,
  face,
  setSelectedValues,
  setQuantities,
  checkQuantitiesAndValues,
) => {
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

export const newHandleDownButton = (
  vectorMakeUp,
  quantities,
  selectedValues,
  vectorLevel,
  getOnContacts,
  level,
  face,
  setSelectedValues,
  setQuantities,
  checkQuantitiesAndValues,
) => {
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

export function segmentedContact(aKey, level) {
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

export function getOnContacts(aLevel, level, selectedValues) {
  const onContacts = [];
  Object.keys(level).forEach((key) => {
    if (level[key] === aLevel && selectedValues[key] !== 'left') {
      onContacts.push(key);
    }
  });
  return onContacts;
}

export const handleClearButton = (quantities, selectedValues, setQuantities, setSelectedValues) => {
  const updatedQuantities = { ...quantities };
  const updatedSelectedValues = { ...selectedValues };
  Object.keys(updatedQuantities).forEach((key) => {
    updatedQuantities[key] = 0;
    updatedSelectedValues[key] = 'left';
  });
  setQuantities(updatedQuantities);
  setSelectedValues(updatedSelectedValues);
};

export function assistedMode(quantities, selectedValues, lastChangedKey, setQuantities, setSelectedValues, checkQuantitiesAndValues) {
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

export function assist(isAssisted) {
  isAssisted = !isAssisted;
  if (isAssisted) {
    console.log('isAssisted: ', isAssisted);
    assistedMode();
  }
}

export const calculateQuantitiesWithDistribution = (selectedValues, lastChangedInstance, quantities) => {
  // const quantities = {
  //   left: 0,
  //   center: 0,
  //   right: 0,
  // };

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

export const vectorMakeUp = (quantities, level, levelQuantities, vectorLevel, face, vecCoords, vectorDirection) => {
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

export function checkQuantitiesAndValues(quantity, value, setQuantities, setSelectedValues) {
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

export const roundToHundred = (selectedValues, quantities, setQuantities) => {
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

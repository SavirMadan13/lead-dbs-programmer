export const vectorMakeUp = (
  quantities,
  level,
  levelQuantities,
  vectorLevel,
  face,
  vecCoords,
  vectorDirection,
) => {
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

export const getOnFacesCount = (face, quantities, facesVec) => {
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

export const calculateLevelTotals = (level, quantities) => {
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

export const handleForwardButton = (
  level,
  levelQuantities,
  vectorLevel,
  vecCoords,
  face,
  vectorDirection,
  quantities,
  selectedValues,
  facesVec,
  segmentedLevel,
  // level,
  // levelQuantities,
  // face,
  getOnContacts,
  setSelectedValues,
  setQuantities,
) => {
  const updatedQuantities = { ...quantities };
  const updatedSelectedValues = { ...selectedValues };
  // getOnFacesCount();
  getOnFacesCount(face, quantities, facesVec);
  vectorMakeUp(
    quantities,
    level,
    levelQuantities,
    vectorLevel,
    face,
    vecCoords,
    vectorDirection,
  );
  const levelTotalArray = calculateLevelTotals(level, quantities);
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

export const handleBackButton = (
  calculateLevelTotals,
  facesVec,
  quantities,
  selectedValues,
  getOnFacesCount,
  vectorMakeUp,
  level,
  levelQuantities,
  face,
  getOnContacts,
  setSelectedValues,
  setQuantities,
) => {
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

export const handleLeftButton = (
  calculateLevelTotals,
  facesVec,
  quantities,
  selectedValues,
  getOnFacesCount,
  vectorMakeUp,
  level,
  levelQuantities,
  face,
  getOnContacts,
  setSelectedValues,
  setQuantities,
) => {
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

export const handleRightButton = (
  calculateLevelTotals,
  facesVec,
  quantities,
  selectedValues,
  getOnFacesCount,
  vectorMakeUp,
  level,
  levelQuantities,
  face,
  getOnContacts,
  setSelectedValues,
  setQuantities,
) => {
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
    const levelOnContacts = getOnContacts(level[key]);
    if (face[key] === 'right' && levelQuantities[level[key]] !== 0) {
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

export function segmentedLevel(aLevel, level) {
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

export const handleSplitEvenButton = (
  vectorLevel,
  vecCoords,
  vectorDirection,
  facesVec,
  quantities,
  selectedValues,
  level,
  levelQuantities,
  face,
  getOnContacts,
  setSelectedValues,
  setQuantities,
) => {
  const updatedQuantities = { ...quantities };
  const updatedSelectedValues = { ...selectedValues };
  // getOnFacesCount();
  getOnFacesCount(face, quantities, facesVec);
  vectorMakeUp(
    quantities,
    level,
    levelQuantities,
    vectorLevel,
    face,
    vecCoords,
    vectorDirection,
  );
  const levelTotalArray = calculateLevelTotals(level, quantities);
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
    if (levelQuantities[key] !== 0 && segmentedLevel(key, level)) {
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
      centerCount > 0 ? (100 - lastChangedInstance.animation) / centerCount : 0;
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

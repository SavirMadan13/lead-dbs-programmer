const math = require('mathjs');

/**
 * Computes the radius of the sphere based on input millamps.
 * @param {number} milliamps - Input value used to compute the radius.
 * @returns {number} - Radius of the sphere.
 */
const computeRadius = (milliamps) => {
  const radius = (milliamps - 0.1) / 0.22;
  return milliamps > 0.1 ? math.sqrt(radius) : 0;
};

/**
 * Assigns values to the entire landscape based on the sphere's center and radius.
 * Uses vectorized operations with math.js for improved performance.
 * @param {Array} L - Array of points, each row is a point with each column being an [x, y, z, magnitude].
 * @param {Array} center - Center of the sphere [x0, y0, z0].
 * @param {number} r - Radius of the sphere.
 * @returns {Array} - Array of 0s and 1s representing whether each point lies inside the sphere.
 */
// const assignSphereValues = (L, center, r) => {
//   const [x0, y0, z0] = center;
//   // Extract the x, y, z coordinates as separate arrays
//   const xCoords = math.column(L, 0);
//   const yCoords = math.column(L, 1);
//   const zCoords = math.column(L, 2);
//   // Compute the squared distance from each point to the sphere center
//   const dx = math.subtract(xCoords, x0);
//   const dy = math.subtract(yCoords, y0);
//   const dz = math.subtract(zCoords, z0);
//   const distanceSquared = math.add(
//     math.square(dx),
//     math.square(dy),
//     math.square(dz),
//   );
//   const radiusSquared = r ** 2; // Faster to square the radius for comparison than to root every squared distance.
//   // Perform element-wise comparison to get boolean array and convert to 0/1
//   const insideSphere = math.smaller(distanceSquared, radiusSquared); // Gets booleans via inequality
//   const sphereMask = math.multiply(insideSphere, 1); // Converts trues to 1s.
//   return sphereMask;
// };

const assignSphereValues = (L, center, r) => {
  const [x0, y0, z0] = center;
  // Extract the x, y, z coordinates as separate arrays
  const xCoords = math.column(L, 0);
  const yCoords = math.column(L, 1);
  const zCoords = math.column(L, 2);

  // Compute the squared distance from each point to the sphere center
  const dx = math.subtract(xCoords, x0);
  const dy = math.subtract(yCoords, y0);
  const dz = math.subtract(zCoords, z0);

  // Use math.map to apply the square function element-wise
  const dxSquared = math.map(dx, math.square);
  const dySquared = math.map(dy, math.square);
  const dzSquared = math.map(dz, math.square);

  const distanceSquared = math.add(dxSquared, math.add(dySquared, dzSquared));
  const radiusSquared = r ** 2;

  // Perform element-wise comparison to get boolean array and convert to 0/1
  const insideSphere = math.smaller(distanceSquared, radiusSquared); // Gets booleans via inequality
  const sphereMask = math.multiply(insideSphere, 1); // Converts trues to 1s
  return sphereMask;
};

/**
 * Calculates the dot product of the sphere assignment vector and the flattened landscape.
 * @param {Array} S - Sphere assignment vector.
 * @param {Array} L - Flattened landscape values array [x,y,z,magnitude]. Same organization of the above rows as points,
 *                      but with a single column being value at that point.
 *                      Each row should correspond with the row of the x,y,z in landscape for assignSphereValues
 * @returns {number} - Dot product result.
 */
const dotProduct = (S, L) => {
  const magnitudes = math.column(L, 3);
  return math.dot(S, magnitudes);
};

/**
 * Calculates the target function value T(r), which is the density of 'high' values inside a sphere.
 * @param {Array} S_r - Sphere assignment vector.
 * @param {Array} L - Flattened landscape values.
 * @returns {number} - Target function value.
 */
const targetFunction = (S_r, L, weight = 100) => {
  return dotProduct(S_r, L) * weight;
};

/**
 * Computes the sum of the target function values for an array of possible sphere coordinates.
 * Only includes spheres where the corresponding value in v is non-zero.
 * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {Array} L - Flattened landscape values.
 * @returns {number} - Sum of the target function values for all valid spheres.
 */
const targetFunctionHandler = (sphereCoords, v, L) => {
  let sumTargetValue = 0;
  sphereCoords.forEach((center, index) => {
    if (v[index] > 0.1) {
      // Saves calculations when radius will be 0.
      const r = computeRadius(v[index]); // the value at index is our amperage. that is related to radius.
      const S_r = assignSphereValues(L, center, r);
      const targetValue = targetFunction(S_r, L);
      sumTargetValue += targetValue;
    }
  });
  return sumTargetValue;
};

/**
 * Calculates the penalty for individual contacts. If contact current above 5mA, penalize.
 * @param {number} v - Contact value (milliamperages)
 * @param {number} lambda - Penalty coefficient.
 * @returns {number} - Penalty value.
 */
const penaltyPerContact = (v, lambda) => lambda * Math.max(v - 0.1, 0);

/**
 * Handler function to compute the total penalty for a vector of contact values.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {number} lambda - Penalty coefficient.
 * @returns {number} - Total penalty value for all contacts.
 */
const penaltyPerContactHandler = (v, lambda) => {
  return v.reduce((sum, value) => sum + penaltyPerContact(value, lambda), 0);
};

/**
 * Calculates the penalty across all  contacts. If total current above 6mA, penalize.
 * @param {Array} v - Array of contact values (milliamperages)
 * @param {number} lambda - Penalty coefficient.
 * @returns {number} - Penalty value.
 */
const penaltyAllContacts = (v, lambda) =>
  lambda * math.max(math.sum(v) - 0.1, 0);

/**
 * Computes the loss function value.
 * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]). Organized like sphereCoords
 * @param {Array} L - Flattened landscape values.
 * @param {number} lambda - Penalty coefficient.
 * @returns {number} - Loss function value.
 */
const lossFunction = (sphereCoords, v, L, lambda) => {
  const T = targetFunctionHandler(sphereCoords, v, L); // Compute the total target value across all relevant spheres
  const P1 = penaltyPerContactHandler(v, lambda); // Compute the penalty for individual contacts
  const P2 = penaltyAllContacts(v, lambda); // Compute the overall penalty for the sum of contact values
  console.log(T, P1, P2);
  return T - P1 - P2; // P1 - P2;                                       // Return the loss function value
};

/**
 * Computes the difference quotient (numerical derivative) for a given element in the vector v.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {number} lossCurrent - loss at the current array of v.
 * @param {number} index - Index of the element to compute the derivative for.
 * @param {number} h - Small step size for numerical differentiation.
 * @param {Array} sphereCoords - Array of sphere centers.
 * @param {Array} L - Flattened landscape values.
 * @param {number} lambda - Penalty coefficient.
 * @returns {number} - Numerical derivative at the specified index.
 */
const partialDifferenceQuotient = (
  v,
  lossCurrent,
  index,
  h,
  sphereCoords,
  L,
  lambda,
) => {
  const vForward = [...v]; // Create a copy of v
  vForward[index] += h; // Perturb (step forward) by h only for the variable v at index i
  const lossForward = lossFunction(sphereCoords, vForward, L, lambda);
  return (lossForward - lossCurrent) / h;
};

/**
 * Computes the gradient vector of the loss function across all elements in v.
 * Uses the `partialDifferenceQuotient` function for numerical differentiation.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {number} h - Small step size for numerical differentiation.
 * @param {Array} sphereCoords - Array of sphere centers.
 * @param {Array} L - Flattened landscape values.
 * @param {number} lambda - Penalty coefficient.
 * @returns {Array} - Gradient vector of the loss function.
 */
const gradientVectorHandler = (v, h, sphereCoords, L, lambda) => {
  const lossCurrent = lossFunction(sphereCoords, v, L, lambda); // Compute the current loss
  const gradientVector = v.map(
    (
      v_i,
      index, // Use `partialDifferenceQuotient` for each element in v to construct the gradient vector
    ) =>
      partialDifferenceQuotient(
        v,
        lossCurrent,
        index,
        h,
        sphereCoords,
        L,
        lambda,
      ),
  );
  console.log(`Gradient vector: ${gradientVector}`);
  return gradientVector;
};

/**
 * Performs a single step of gradient ascent to update the contact values.
 * Uses the computed gradient vector to adjust each element of v in the direction of increasing the loss function.
 * @param {Array} gradientVector - The gradient vector of the loss function (numerical derivatives for each element of v).
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {number} alpha - Learning rate for gradient ascent (step size).
 * @returns {Array} - Updated array of contact values after the gradient ascent step.
 */
const gradientAscent = (gradientVector, v, alpha) => {
  // Use element-wise addition with math.js for efficient vector operation
  // const updatedV = math.add(v, math.multiply(gradientVector, alpha));
  // return updatedV.map((v_i) => Math.max(v_i, 0)); // do not allow amps below 0.
  const maxTotal = 5;
  const updatedV = math.add(v, math.multiply(gradientVector, alpha));
  const newV = updatedV.map((v_i) => Math.max(Math.min(v_i, maxTotal), 0));
  console.log('New V: ', newV);
  return newV;
};

/**
 * Projects contact values to satisfy individual and total constraints.
 * @param {Array} v - Array of contact values.
 * @param {number} maxTotal - Maximum total contact value.
 * @returns {Array} - Projected contact values.
 */
const projectConstraints = (v, maxTotal = 5) => {
  const currentSum = math.sum(v);
  return v.map((v_i) => (v_i / currentSum) * maxTotal); // percentage current scaled to max allowed current
};

/**
 * Checks L1 norm of the gradient
 * @param {array} gradientVector - array containing the gradient
 * @returns {number} l1Norm
 */
const getL1Norm = (gradientVector) => {
  return math.sum(math.abs(gradientVector));
};

/**
 * Validates input parameters for the optimizeSphereValues function.
 * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
 * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {Array} L - Flattened landscape values, each row is [x, y, z, magnitude].
 * @throws {Error} - If any validation check fails.
 */
const validateInputs = (sphereCoords, v, L) => {
  // Check that all inputs are arrays
  if (!Array.isArray(sphereCoords)) {
    throw new Error('sphereCoords must be an array.');
  }
  if (!Array.isArray(v)) {
    throw new Error('v must be an array.');
  }
  if (!Array.isArray(L)) {
    throw new Error('L must be an array.');
  }

  // Check that arrays are not empty
  if (sphereCoords.length === 0) {
    throw new Error('sphereCoords array cannot be empty.');
  }
  if (v.length === 0) {
    throw new Error('v array cannot be empty.');
  }
  if (L.length === 0) {
    throw new Error('L array cannot be empty.');
  }

  // Check length consistency
  if (sphereCoords.length !== v.length) {
    throw new Error('sphereCoords and v must have the same length.');
  }

  // Check that at least one v is greater than 0.1
  const hasVOverThreshold = v.some(
    (value) => typeof value === 'number' && value > 0.1,
  );
  if (!hasVOverThreshold) {
    throw new Error(
      'At least one contact value in v must be greater than 0.1.',
    );
  }

  // Validate each sphere coordinate
  sphereCoords.forEach((coord, index) => {
    if (!Array.isArray(coord) || coord.length !== 3) {
      throw new Error(
        `sphereCoords[${index}] must be an array of three numeric values [x, y, z].`,
      );
    }
    coord.forEach((val, subIndex) => {
      if (typeof val !== 'number' || isNaN(val)) {
        throw new Error(
          `sphereCoords[${index}][${subIndex}] must be a valid number.`,
        );
      }
    });
  });

  // Validate each contact value
  v.forEach((value, index) => {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      throw new Error(`v[${index}] must be a non-negative number.`);
    }
  });

  // Validate each landscape point
  L.forEach((point, index) => {
    if (!Array.isArray(point) || point.length !== 4) {
      throw new Error(
        `L[${index}] must be an array of four numeric values [x, y, z, magnitude].`,
      );
    }
    point.forEach((val, subIndex) => {
      if (typeof val !== 'number' || isNaN(val)) {
        throw new Error(`L[${index}][${subIndex}] must be a valid number.`);
      }
    });
  });
};

/**
 * Orchestrates the optimization process using gradient ascent.
 *
 * STOP Rules
 * grad L1 norm     - implemented
 * grad L2 norm     - not implemented
 * max iterations   - implemented
 * convergence      - not implemented
 * plateau dtxn     - not implemented
 *
 * NOTES:
 * Potential Logical Error: No safeguard against differing array lengths.
 * Ensure that sphereCoords and v are always of equal length to prevent unintended behavior.
 *
 * Performs a maximum of 100 iterations and includes placeholders for additional stopping rules.
 * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
 * @param {Array} v - Initial guess for the array of contact values (e.g., [q1, q2, q3, q4]).
 * @param {Array} L - Flattened landscape values, an array of (n,m) where n is the points and m is 4 cols (x coord,y coord,z coord,magnitude)
 * @param {number} lambda - Penalty coefficient.
 * @param {number} alpha - Learning rate for gradient ascent (step size).
 * @param {number} h - Small step size for numerical differentiation.
 * @returns {Array} - Optimized array of contact values.
 */
const optimizeSphereValues = (
  sphereCoords,
  v,
  L,
  lambda = 10,
  alpha = 0.01,
  h = 0.1,
  l1Tolerance = 0.05,
) => {
  validateInputs(sphereCoords, v, L); // throw errors if inputs are incorrect.
  let currentV = [...v]; // Clone the initial guess for v
  let iteration = 0;
  while (iteration < 100) {
    //  allows 100 steps of 0.05mA changes (max of 5mA in total change)
    const gradientVector = gradientVectorHandler(
      currentV,
      h,
      sphereCoords,
      L,
      lambda,
    ); // get gradient
    const updatedV = gradientAscent(gradientVector, currentV, alpha); // ascend gradient
    currentV = updatedV; // update
    iteration += 1;
    // Check stop conditions
    if (getL1Norm(gradientVector) < l1Tolerance) {
      console.log(`Convergence detected: L1 norm of gradient < ${l1Tolerance}`);
      break;
    } // increment
  }
  console.log(`Optimization completed after ${iteration} iterations.`);
  return projectConstraints(currentV, (maxTotal = 5));
};

module.exports = {
  optimizeSphereValues,
  lossFunction,
  validateInputs,
  computeRadius,
  assignSphereValues,
  dotProduct,
  targetFunction,
  penaltyPerContact,
  penaltyPerContactHandler,
  penaltyAllContacts,
  partialDifferenceQuotient,
  gradientVectorHandler,
  gradientAscent,
};

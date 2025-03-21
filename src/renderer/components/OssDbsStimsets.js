const nifti = require('nifti-reader-js');
const isosurface = require('isosurface');
const math = require('mathjs');

/**
 * Converts superimposed E-field data into a PLY surface mesh for visualization.
 * @param {Float32Array} eFieldSuperimposed - The superimposed E-field data (4D vector field).
 * @param {Float32Array} eFieldMagnitude - The magnitude of the E-field (3D scalar field).
 * @param {Array} dimensions - The dimensions of the E-field data [xDim, yDim, zDim].
 * @returns {string} - PLY data as a string.
 */
function eFieldToSurfacePLY(
  eFieldSuperimposed,
  eFieldMagnitude,
  dimensions,
  header,
) {
  const [xDim, yDim, zDim] = dimensions;
  // Convert E-field data into mm coordinates
  const eFieldSuperimposedMM = new Float32Array(eFieldSuperimposed.length);
  const eFieldMagnitudeMM = new Float32Array(eFieldMagnitude.length);

  const affineMatrix = header.affine; // Assuming you have access to the affine matrix from the header

  for (let z = 0; z < zDim; z++) {
    for (let y = 0; y < yDim; y++) {
      for (let x = 0; x < xDim; x++) {
        const index = x + xDim * (y + yDim * z);
        const voxelHomogeneous = [x, y, z, 1]; // Add 1 for homogeneous transformation
        const transformedVoxels = math.multiply(affineMatrix, voxelHomogeneous);
        const [wx, wy, wz] = transformedVoxels.slice(0, 3);

        eFieldSuperimposedMM[index] = eFieldSuperimposed[index]; // Assuming no change in value
        eFieldMagnitudeMM[index] = eFieldMagnitude[index]; // Assuming no change in value
      }
    }
  }

  console.log('Running Marching Cubes...');

  // Generate surface mesh using Marching Cubes algorithm with superimposed E-field data
  const mesh = isosurface.marchingCubes(
    [xDim, yDim, zDim],
    (x, y, z) => {
      const index = x + xDim * (y + yDim * z);
      // Use the magnitude of the superimposed E-field vector as the scalar field
      const ex = eFieldSuperimposedMM[index * 3];
      const ey = eFieldSuperimposedMM[index * 3 + 1];
      const ez = eFieldSuperimposedMM[index * 3 + 2];
      return Math.sqrt(ex * ex + ey * ey + ez * ez);
    },
    (x, y, z) => {
      const index = x + xDim * (y + yDim * z);
      if (index * 3 + 2 >= eFieldSuperimposedMM.length) {
        throw new Error(`Index out of bounds: ${index}`);
      }
      return [
        eFieldSuperimposedMM[index * 3],
        eFieldSuperimposedMM[index * 3 + 1],
        eFieldSuperimposedMM[index * 3 + 2],
      ];
    }
  );

  console.log(
    `Generated ${mesh.positions.length} vertices and ${mesh.cells.length} faces.`,
  );

  if (mesh.positions.length === 0) {
    throw new Error('No surface extracted. Check data values.');
  }

  // Convert faces to PLY format
  const faces = mesh.cells.map(([a, b, c]) => `3 ${a} ${b} ${c}`);

  // Construct PLY data as a string
  let plyContent = `ply
format ascii 1.0
element vertex ${mesh.positions.length}
property float x
property float y
property float z
element face ${faces.length}
property list uchar int vertex_index
end_header
`;

  mesh.positions.forEach(([x, y, z]) => {
    plyContent += `${x} ${y} ${z}\n`;
  });

  faces.forEach((face) => {
    plyContent += `${face}\n`;
  });

  // Convert PLY string to ArrayBuffer
  const encoder = new TextEncoder();
  const plyArrayBuffer = encoder.encode(plyContent).buffer;

  return plyArrayBuffer;
}

/**
 * Computes the superimposed electric field from unit-contact solutions.
 * @param {Float32Array} stimVector - Array of stimulation currents for each contact (in Amperes).
 * @param {ArrayBuffer[]} efieldContactSolutions - Array of NIfTI file buffers for each contact.
 * @returns {Object} - Contains the superimposed E-field (`eFieldSuperimposed`) and its magnitude (`eFieldMagnitude`).
 */
function computeSuperimposedEField(stimVector, efieldContactSolutions) {
  // console.log('stimVector', stimVector.length);
  // console.log('efieldContactSolutions', efieldContactSolutions.length);
  // if (stimVector.length !== efieldContactSolutions.length) {
  //   throw new Error(
  //     'Mismatch: stimVector and efieldContactSolutions must have the same length.',
  //   );
  // }

  let niftiHeader = null;
  let niftiData = null;
  let dimensions = null;
  console.log('efieldContactSolutions[0]', efieldContactSolutions[0]);
  // Load the first NIfTI file as the base field
  if (nifti.isNIFTI(efieldContactSolutions[0])) {
    const firstNifti = nifti.readHeader(efieldContactSolutions[0]);
    let firstData = nifti.readImage(firstNifti, efieldContactSolutions[0]);
    console.log('firstNifti', firstNifti);
    console.log('firstData', firstData);
    // Ensure `firstData` is an ArrayBuffer
    // if (!(firstData instanceof ArrayBuffer)) {
    //   firstData = new Uint8Array(firstData).buffer;
    // }

    // Handle endian mismatch
    if (!firstNifti.littleEndian) {
      const dataView = new DataView(firstData);
      const correctedData = new Float32Array(firstData.byteLength / 4);
      for (let i = 0; i < correctedData.length; i++) {
        correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
      }
      firstData = correctedData;
    } else {
      firstData = new Float32Array(firstData);
    }

    // Apply scaling factors
    // const { scl_slope = 1, scl_inter = 0 } = firstNifti;
    // firstData = new Float32Array(
    //   firstData.map((value) => value * scl_slope + scl_inter),
    // );

    niftiHeader = firstNifti;
    dimensions = firstNifti.dims.slice(1, 4); // Get spatial dimensions
    const voxelCount = dimensions.reduce((a, b) => a * b, 1);

    // Initialize superimposed E-field array (4D)
    niftiData = new Float32Array(voxelCount * 3); // Assuming 3 components per voxel
    console.log('StimVector', stimVector);
    console.log('StimVector[0]', stimVector[0]);
    // Scale first contact field
    for (let i = 0; i < niftiData.length; i++) {
      try {
        niftiData[i] = Math.abs(firstData[i] * stimVector[0]);
      } catch (error) {
        niftiData[i] = 0;
      }
    }
  } else {
    throw new Error('Invalid NIfTI file provided.');
  }

  // Loop through remaining contacts and add their scaled fields
  for (let contactIdx = 1; contactIdx < stimVector.length; contactIdx++) {
    if (nifti.isNIFTI(efieldContactSolutions[contactIdx])) {
      console.log('contactIdx', contactIdx);
      let contactData = nifti.readImage(
        nifti.readHeader(efieldContactSolutions[contactIdx]),
        efieldContactSolutions[contactIdx],
      );

      // Ensure `contactData` is an ArrayBuffer
      if (!(contactData instanceof ArrayBuffer)) {
        contactData = new Uint8Array(contactData).buffer;
      }

      // Handle endian mismatch
      if (!niftiHeader.littleEndian) {
        const dataView = new DataView(contactData);
        const correctedData = new Float32Array(contactData.byteLength / 4);
        for (let i = 0; i < correctedData.length; i++) {
          correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
        }
        contactData = correctedData;
      } else {
        contactData = new Float32Array(contactData);
      }
      console.log('niftiData.length', niftiData.length);
      for (let i = 0; i < niftiData.length; i++) {
        niftiData[i] += contactData[i] * stimVector[contactIdx];
      }
    } else {
      throw new Error(`Invalid NIfTI file at index ${contactIdx}`);
    }
  }

  // Compute magnitude of the final E-field (3D output)
  // const eFieldMagnitude = new Float32Array(
  //   dimensions.reduce((a, b) => a * b, 1),
  // );
  let eFieldMagnitude = new Float32Array(niftiData.length);

  for (let i = 0; i < eFieldMagnitude.length; i++) {
    let ex = niftiData[i * 3];
    let ey = niftiData[i * 3 + 1];
    let ez = niftiData[i * 3 + 2];
    eFieldMagnitude[i] = Math.sqrt(ex * ex + ey * ey + ez * ez) * 1000.0; // Convert to V/m
    // eFieldMagnitude[i] = Math.abs(niftiData[i])*1000;
  }
  console.log('eFieldSuperimposed', niftiData);
  // const plyData = eFieldToSurfacePLY(niftiData, eFieldMagnitude, dimensions, niftiHeader);

  return {
    eFieldSuperimposed: niftiData, // 4D vector field (Ex, Ey, Ez)
    eFieldMagnitude: eFieldMagnitude, // 3D magnitude field
    header: niftiHeader, // Original NIfTI header for reference
    // plyData: plyData, // PLY data for visualization
  };
}

module.exports = { computeSuperimposedEField, eFieldToSurfacePLY };

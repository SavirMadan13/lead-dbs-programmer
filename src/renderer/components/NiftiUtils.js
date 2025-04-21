import * as nifti from 'nifti-reader-js';
import * as iso from 'isosurface';
import * as THREE from 'three';
import * as math from 'mathjs';

function typedArrayFor(code) {
  const n1 = nifti.NIFTI1; // enum with the standard codes

  switch (code) {
    case n1.TYPE_UINT8:
      return Uint8Array; // 2  → 8‑bit unsigned
    case n1.TYPE_INT16:
      return Int16Array; // 4  → 16‑bit signed
    case n1.TYPE_INT32:
      return Int32Array; // 8  → 32‑bit signed
    case n1.TYPE_FLOAT32:
      return Float32Array; // 16 → 32‑bit float
    case n1.TYPE_FLOAT64:
      return Float64Array; // 64 → 64‑bit float
    /* add more cases (TYPE_UINT16, TYPE_INT8, …) if your data needs them */
    default:
      throw new Error(`Unsupported NIfTI datatype code: ${code}`);
  }
}

function gaussianSmooth(vox, nx, ny, nz, sigma = 1.0) {
  const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
  const kernel = new Float32Array(kernelSize);
  const halfSize = Math.floor(kernelSize / 2);
  const sigma2 = sigma * sigma;
  let sum = 0;

  for (let i = -halfSize; i <= halfSize; i++) {
    const value = Math.exp(-(i * i) / (2 * sigma2));
    kernel[i + halfSize] = value;
    sum += value;
  }

  for (let i = 0; i < kernelSize; i++) {
    kernel[i] /= sum;
  }

  const smoothVox = new Float32Array(vox.length);

  for (let z = 0; z < nz; z++) {
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        let sum = 0;
        for (let dz = -halfSize; dz <= halfSize; dz++) {
          for (let dy = -halfSize; dy <= halfSize; dy++) {
            for (let dx = -halfSize; dx <= halfSize; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              const nz = z + dz;
              if (nx >= 0 && nx < nx && ny >= 0 && ny < ny && nz >= 0 && nz < nz) {
                const index = nx + ny * nx + nz * nx * ny;
                sum += vox[index] * kernel[dx + halfSize] * kernel[dy + halfSize] * kernel[dz + halfSize];
              }
            }
          }
        }
        const index = x + y * nx + z * nx * ny;
        smoothVox[index] = sum;
      }
    }
  }

  return smoothVox;
}

function nii2Mesh(raw) {
  const header = nifti.readHeader(raw);
  const image = nifti.readImage(header, raw);
  console.log(header);
  const Typed = typedArrayFor(header.datatypeCode);
  let vox = new Typed(image);
  console.log(vox);
  const float32Array = new Float32Array(vox.length);
  for (let i = 0; i < vox.length; i++) {
    float32Array[i] = vox[i];
  }
  vox = float32Array;
  const [nx, ny, nz] = header.dims.slice(1, 4);

  // vox = gaussianSmooth(vox, nx, ny, nz);

  const isoLevel = 0.5;
  const scalar = (x, y, z) => vox[x + nx * (y + ny * z)] - isoLevel;
  const mesh = iso.marchingCubes([nx, ny, nz], scalar);

  if (mesh.positions.length === 0) {
    throw new Error('No voxels ≥ isoLevel – check datatype / isoLevel.');
  }

  // Apply Gaussian smoothing

  // --- scale vertices using affine matrix ---------------------------------
  const affineMatrix = header.affine; // Assuming affine matrix is available
  mesh.positions = mesh.positions.map(([x, y, z]) => {
    const voxelHomogeneous = [x + 0.5, y + 0.5, z + 0.5, 1]; // Add 0.5 for center of voxel
    const transformedVoxels = math.multiply(affineMatrix, voxelHomogeneous);
    return transformedVoxels.slice(0, 3); // Return only x, y, z
  });


  // --- Three.js geometry ---------------------------------------------------
  // const geo = new BufferGeometry();
  // geo.setAttribute(
  //   'position',
  //   new Float32BufferAttribute(mesh.positions.flat(), 3),
  // );
  // geo.setIndex(new Uint32BufferAttribute(mesh.cells.flat(), 1));
  // geo.computeVertexNormals();
  // return geo;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(mesh.positions.flat());
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Add faces (indices)
  // const indices = new Uint32Array(mesh.cells.flat());
  // geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  const indices = new Uint32Array(mesh.cells.flat());
  for (let i = 0; i < indices.length; i += 3) {
    // Swap the order of the indices to reverse the winding
    const temp = indices[i];
    indices[i] = indices[i + 1];
    indices[i + 1] = temp;
  }
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));


  // Compute vertex normals
  geometry.computeVertexNormals();

  // Set vertex colors
  const colors = new Float32Array(positions.length);
  for (let i = 0; i < positions.length / 3; i++) {
    const value = vox[i];
    if (value > 0) {
      colors.set([1, 0, 0], i * 3); // Red color for values > 0
    } else {
      colors.set([1, 1, 1], i * 3); // White color for values <= 0
    }
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    transparent: false,
    opacity: 0.5,
    smoothShading: true,
    color: 'red',
  });

  return { geometry, material };
}

export default nii2Mesh;

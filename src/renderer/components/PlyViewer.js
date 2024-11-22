import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
// import * as nifti from 'nifti-reader-js'; // Correctly importing the nifti module
import * as nifti from 'nifti-reader-js';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import { Tabs, Tab, Collapse, Button, Form, Modal } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings'; // Material UI settings icon
import * as math from 'mathjs';
import { optimizeSphereValues } from './StimOptimizer';
// import { remote } from 'electron'; // Use 'electron' for Electron v12+

function PlyViewer({
  quantities,
  setQuantities,
  selectedValues,
  setSelectedValues,
  amplitude,
  setAmplitude,
  side,
  historical,
  togglePosition,
  tab,
  names,
  elspec,
}) {
  const [plyFile, setPlyFile] = useState(null);
  const mountRef = useRef(null);
  const secondaryMountRef = useRef(null); // Ref for the secondary view
  const sphereRef = useRef(null); // Ref for the sphere to update position dynamically
  const controlsRef = useRef(null); // Ref for the OrbitControls
  const secondaryControlsRef = useRef(null); // Ref for the OrbitControls
  const [selectedTremor, setSelectedTremor] = useState([]); // Array to store selected tremor items
  const sphereRefs = useRef([]); // Refs for all spheres
  const sceneRef = useRef(null);
  const [atlas, setAtlas] = useState(null);
  const [meshes, setMeshes] = useState([]); // State to track meshes in the scene
  const [meshProperties, setMeshProperties] = useState({}); // State for each mesh's properties like visibility and opacity
  const rendererRef = useRef(null); // To store the renderer reference
  const secondaryRendererRef = useRef(null);
  const cameraRef = useRef(null); // To store the camera reference
  const secondaryCameraRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [recoData, setRecoData] = useState(null);
  const [elecCoords, setElecCoords] = useState(null);
  const [roi, setRoi] = useState('tremor-0');
  const [avoidRoi, setAvoidRoi] = useState('tremor-0');
  const [niiCoords, setNiiCoords] = useState(null);
  const [plotNiiCoords, setPlotNiiCoords] = useState({});
  const [niiSolution, setNiiSolution] = useState('');

  // Thresholding/Modification stuff

  useEffect(() => {
    // This loads in the combined electrodes for the selected patient
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-ply-file',
          historical,
        );
        // setPlyFile(fileData);
        const loader = new PLYLoader();
        const geometry = loader.parse(fileData);

        const material = new THREE.MeshStandardMaterial({
          vertexColors: geometry.hasAttribute('color'),
          flatShading: true,
          metalness: 0.1, // More reflective
          roughness: 0.5, // Shinier surface
          transparent: true, // Enable transparency
          opacity: 0.8, // Set opacity to 60%
        });
        // eslint-disable-next-line no-use-before-define
        addMeshToScene('Electrode Scene', geometry, material);
      } catch (error) {
        console.error('Error loading PLY file:', error);
      }
    };

    loadPlyFile(); // Call the async function
  }, []);

  const convert_fox_to_mni = (coordinates, resolution = 2) => {
    const offset = [45, 63, 36];
    return coordinates.map(
      (value, index) => (value - offset[index]) * resolution,
    );
  };

  // Current working model
  // useEffect(() => {
  //   const loadNiftiFile = async () => {
  //     try {
  //       const fileData = await window.electron.ipcRenderer.invoke(
  //         'load-nii-file',
  //         historical,
  //       );

  //       // Validate if the file is a valid NIfTI file
  //       if (!nifti.isNIFTI(fileData)) {
  //         throw new Error('File is not a valid NIfTI file');
  //       }

  //       const header = nifti.readHeader(fileData);
  //       let image = nifti.readImage(header, fileData);

  //       // Ensure `image` is a valid ArrayBuffer
  //       if (!(image instanceof ArrayBuffer)) {
  //         console.log('Adjusting image to ArrayBuffer...');
  //         image = new Uint8Array(image).buffer;
  //       }

  //       // Handle endian mismatch
  //       if (!header.littleEndian) {
  //         console.warn('File is in big-endian format. Adjusting...');
  //         const dataView = new DataView(image);
  //         const correctedData = new Float32Array(image.byteLength / 4);
  //         for (let i = 0; i < correctedData.length; i++) {
  //           correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
  //         }
  //         image = correctedData;
  //       } else {
  //         image = new Float32Array(image);
  //       }

  //       // Apply scaling factors
  //       const { scl_slope = 1, scl_inter = 0 } = header;
  //       const img = new Float32Array(
  //         image.map((value) => value * scl_slope + scl_inter),
  //       );

  //       // Extract dimensions
  //       const dimensions = header.dims.slice(1, 4);
  //       console.log('Dimensions:', dimensions);

  //       // Generate voxel coordinates
  //       const voxelCoordinates = [];
  //       img.forEach((value, index) => {
  //         if (!isNaN(value)) {
  //           const z = Math.floor(index / (dimensions[0] * dimensions[1]));
  //           const y = Math.floor(
  //             (index % (dimensions[0] * dimensions[1])) / dimensions[0],
  //           );
  //           const x = index % dimensions[0];
  //           voxelCoordinates.push([x, y, z, value]);
  //         }
  //       });

  //       console.log('Voxel Coordinates:', voxelCoordinates);

  //       // Transform to MNI coordinates using affine matrix
  //       const affineMatrix = header.affine;
  //       const mniCoordinates = voxelCoordinates.map(([x, y, z, value]) => {
  //         const voxelHomogeneous = [x, y, z, 1]; // Add 1 for homogeneous transformation
  //         const transformedVoxels = math.multiply(
  //           affineMatrix,
  //           voxelHomogeneous,
  //         );
  //         const [wx, wy, wz] = transformedVoxels.slice(0, 3);
  //         return [wx, wy, wz, value];
  //       });

  //       console.log('MNI Coordinates:', mniCoordinates);

  //       // Set the state with the transformed coordinates
  //       setNiiCoords(mniCoordinates);
  //     } catch (error) {
  //       console.error('Error loading NIfTI file:', error);
  //     }
  //   };

  //   loadNiftiFile();
  // }, []);

  /////////////// CSV ////////////

  // useEffect(() => {
  //   const loadCSVFile = async () => {
  //     try {
  //       // Invoke IPC to load NIfTI file
  //       const fileData = await window.electron.ipcRenderer.invoke(
  //         'load-csv-file',
  //         historical,
  //       );

  //       console.log(fileData);

  //       // Parse CSV data into an array of arrays
  //       const rows = fileData
  //       .trim() // Remove any extra whitespace or newline at the end
  //       .split('\n') // Split into rows
  //       .map((row) => row.split(',').map(Number)); // Split each row into columns and convert to numbers

  //         console.log(rows);
  //         setNiiCoords(rows);
  //       // Read header and image data
  //     } catch (error) {
  //       console.error('Error loading NIfTI file:', error);
  //     }
  //   };

  //   loadCSVFile();
  // }, []);

  useEffect(() => {
    // This loads the anatomy.ply scene
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-ply-file-anatomy',
          historical,
        );
        // setPlyFile(fileData);
        const loader = new PLYLoader();
        const geometry = loader.parse(fileData);

        const material = new THREE.MeshStandardMaterial({
          vertexColors: geometry.hasAttribute('color'),
          flatShading: true,
          metalness: 0.1, // More reflective
          roughness: 0.5, // Shinier surface
          transparent: true, // Enable transparency
          opacity: 0.8, // Set opacity to 60%
        });
        // eslint-disable-next-line no-use-before-define
        addMeshToScene('Anatomy', geometry, material);
      } catch (error) {
        console.error('Error loading PLY file:', error);
      }
    };

    loadPlyFile(); // Call the async function
  }, []);

  useEffect(() => {
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-vis-coords',
          historical,
        );
        // setPlyFile(fileData);
        console.log(fileData.markers.head1);
        setRecoData(fileData);
      } catch (error) {
        console.error('Error loading PLY file:', error);
      }
    };

    loadPlyFile(); // Call the async function
  }, []);

  // useEffect(() => {
  //   // This loads in the combined electrodes for the selected patient
  //   const loadPlyFile = async () => {
  //     try {
  //       const fileData = await window.electron.ipcRenderer.invoke(
  //         'load-test-file',
  //         historical,
  //       );
  //       // setPlyFile(fileData);
  //       const loader = new PLYLoader();
  //       const geometry = loader.parse(fileData);

  //       const material = new THREE.MeshStandardMaterial({
  //         vertexColors: geometry.hasAttribute('color'),
  //         flatShading: true,
  //         metalness: 0.1, // More reflective
  //         roughness: 0.5, // Shinier surface
  //         transparent: true, // Enable transparency
  //         opacity: 0.8, // Set opacity to 60%
  //       });
  //       // eslint-disable-next-line no-use-before-define
  //       addMeshToScene('Test OSS VTA', geometry, material);
  //     } catch (error) {
  //       console.error('Error loading PLY file:', error);
  //     }
  //   };

  //   loadPlyFile(); // Call the async function
  // }, []);

  // New states for visibility and thresholding

  const [meshVisibility, setMeshVisibility] = useState({});
  const [meshOpacity, setMeshOpacity] = useState({});
  const [threshold, setThreshold] = useState(0.5); // Example thresholding value

  const [newTremor, setNewTremor] = useState({ name: '', coords: [0, 0, 0] });
  const [showModal, setShowModal] = useState(false);
  const [showPDModal, setShowPDModal] = useState(false);
  const [newPD, setNewPD] = useState({ name: '', coords: [0, 0, 0] });
  const [solutionText, setSolutionText] = useState('');
  const [stimParams, setStimParams] = useState({});
  const [tremorData, setTremorData] = useState([
    { name: 'Papavassilliou et al', coords: [14.5, -17.7, -2.8] },
    { name: 'Hamel et al', coords: [13.79, -18.04, -1.06] },
    { name: 'Herzog et al', coords: [14.04, -16.66, -2.92] },
    { name: 'Blomstedt et al', coords: [12.61, -17.24, -0.28] },
    { name: 'Barbe et al', coords: [12.31, -18.2, -1.26] },
    { name: 'Sandvik et al', coords: [13.77, -12.56, 1.5] },
    { name: 'Sandvik et al2', coords: [13.11, -16.53, -1.61] },
    { name: 'Fytagoridis et al', coords: [12.93, -17.17, -0.62] },
    { name: 'Cury et al', coords: [14.91, -4.47, -5.88] },
    { name: 'Fiechter et al', coords: [15.36, -16.3, -3.89] },
    { name: 'Barbe et al2', coords: [11.97, -16.64, -0.86] },
    { name: 'Nowacki et al', coords: [11.51, -16.04, 0.6] },
    { name: 'Nowacki et al2', coords: [13.75, -14.77, -3.1] },
    { name: 'Philipson et al', coords: [13.03, -18.4, -1.91] },
    { name: 'Tsuboi et al', coords: [15.35, -15.34, -0.51] },
    { name: 'Elias et al', coords: [17.3, -13.9, 4.2] },
    { name: 'Tsuboi et al2', coords: [15.0, -17.0, 1.0] },
    { name: 'Middlebrooks et al', coords: [15.5, -15.5, 0.5] },
  ]);

  const [pdData, setPdData] = useState([
    { name: 'Ehlen et al 2013', coords: [11.95, 14.16, 1.62] },
    { name: 'Horn et al 2017', coords: [14.04, -13.2, -4.8] },
    { name: 'Krugel et al 2014', coords: [12.13, -13.93, -6.93] },
    { name: 'Todt et al 2022', coords: [12.3, 1.6, 2.3] },
    { name: 'Akram et al 2017 - Rigidity', coords: [9, -13, -7] },
    { name: 'Akram et al 2017 - Tremor', coords: [11, -12, -6] },
    { name: 'Boutet et al 2024 - Bradykinesia', coords: [12.2, -13, -4.4] },
    { name: 'Dembek et al - Motor', coords: [13.3, -13.5, -5.4] },
    { name: 'Avoidance coordinate - test', coords: [12.73, -14.36, -6.7] },
    { name: 'Cognition < 65', coords: [14.3, -13.7, -3.7] },
    { name: 'Cognition > 65', coords: [7.3, -10.2, -11.7] },
    { name: 'Gait', coords: [6.2, -8.3, -9.7] },
  ]);

  // Handle input change for new tremor data
  const handleNewTremorChange = (e) => {
    const { name, value } = e.target;
    setNewTremor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewPDChange = (e) => {
    const { name, value } = e.target;
    setNewPD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to add new tremor data
  const addNewTremor = () => {
    const { name, coords } = newTremor;
    if (name && coords.length === 3) {
      setTremorData((prevData) => [
        ...prevData,
        { name, coords: coords.map(Number) },
      ]);
      // Reset the form
      setNewTremor({ name: '', coords: [0, 0, 0] });
    }
  };

  const addNewPD = () => {
    const { name, coords } = newPD;
    if (name && coords.length === 3) {
      setPdData((prevData) => [
        ...prevData,
        { name, coords: coords.map(Number) },
      ]);
      // Reset the form
      setNewPD({ name: '', coords: [0, 0, 0] });
    }
  };

  const [plyFiles, setPlyFiles] = useState([]); // Store both names and paths

  useEffect(() => {
    // Gathers atlases
    const fetchPlyFiles = async () => {
      try {
        // Request the PLY file paths from the main process using invoke/handle
        const files = await window.electron.ipcRenderer.invoke('get-ply-files');

        // Store both the file name and the full path in the state
        const fileData = files.map((file) => ({
          name: file.fileName.split('/').pop(), // Extract the atlas name from the path
          path: file.filePath, // Store the full path
        }));
        setPlyFiles(fileData);
      } catch (error) {
        console.error('Error fetching PLY files:', error);
      }
    };

    fetchPlyFiles();
  }, []); // Empty dependency array ensures this runs only on mount

  const [priorStims, setPriorStims] = useState(null);

  useEffect(() => {
    // Gathers other stimulations from the database
    const fetchPlyFiles = async () => {
      try {
        // Request the PLY file paths from the main process using invoke/handle
        const files = await window.electron.ipcRenderer.invoke(
          'get-ply-files-database',
        );
        console.log(files);
        setPriorStims(files);
      } catch (error) {
        console.error('Error fetching PLY files:', error);
      }
    };

    fetchPlyFiles();
  }, []); // Empty dependency array ensures this runs only on mount

  const [selectedFilePath, setSelectedFilePath] = useState(''); // Selected file path

  const addMeshToScene = (name, geometry, material, position) => {
    const scene = sceneRef.current;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name; // Assign the name for reference
    if (position) {
      const [x, y, z] = position;
      mesh.position.set(x, y, z); // Set the position of the mesh
    }
    scene.add(mesh);

    setMeshes((prevMeshes) => [...prevMeshes, mesh]); // Add mesh to state
    setMeshProperties((prevProps) => ({
      ...prevProps,
      [name]: { visible: true, opacity: 0.8 },
    }));
  };

  const handleFileChange = async (event) => {
    // const selectedPath = event.target.value;
    // console.log(selectedPath);
    const loader = new PLYLoader();

    const selectedIndex = event.target.value;
    const selectedFile = plyFiles[selectedIndex]; // Get the file object using the index

    // You can now access the selected file's properties
    console.log('Selected File:', selectedFile);

    const selectedPath = selectedFile.path;
    const selectedName = selectedFile.name;

    try {
      // Load and parse the PLY file from Electron's IPC
      const fileData = await window.electron.ipcRenderer.invoke(
        'load-ply-file-2',
        selectedPath,
      );
      const geometry = loader.parse(fileData);

      // Create a material for the mesh
      const material = new THREE.MeshStandardMaterial({
        vertexColors: geometry.hasAttribute('color'),
        flatShading: true,
        metalness: 0.1,
        roughness: 0.5,
        transparent: true,
        opacity: 0.8,
      });

      // Add the mesh to the scene
      addMeshToScene(selectedName, geometry, material);
    } catch (error) {
      console.error('Error loading PLY file:', error);
    }
  };

  const handleVisibilityChange = (meshName) => {
    setMeshProperties((prevProps) => ({
      ...prevProps,
      [meshName]: {
        ...prevProps[meshName],
        visible: !prevProps[meshName].visible,
      },
    }));

    // Toggle visibility in the scene
    const mesh = meshes.find((m) => m.name === meshName);
    if (mesh) {
      mesh.visible = !mesh.visible;
    }
  };

  const handleOpacityChange = (meshName, opacity) => {
    setMeshProperties((prevProps) => ({
      ...prevProps,
      [meshName]: {
        ...prevProps[meshName],
        opacity,
      },
    }));

    // Update opacity in the scene
    const mesh = meshes.find((m) => m.name === meshName);
    if (mesh) {
      mesh.material.opacity = opacity;
      mesh.material.transparent = true;
    }
  };

  const handleThresholdChange = (meshName, threshold_input) => {
    setMeshProperties((prevProps) => ({
      ...prevProps,
      [meshName]: {
        ...prevProps[meshName],
        threshold_input, // Store the new threshold value
      },
    }));

    // Update threshold in the scene (e.g., affecting the size or structure of the mesh)
    const mesh = meshes.find((m) => m.name === meshName);
    if (mesh) {
      // Assuming you're using threshold to adjust the scale or another property
      mesh.scale.set(threshold_input, threshold_input, threshold_input); // Scale the mesh uniformly based on threshold
      mesh.geometry.needsUpdate = true; // If necessary, update the geometry
    }
  };

  // const handleFileChange = async (event) => {
  //   const selectedPath = event.target.value;
  //   setSelectedFilePath(selectedPath);

  //   // Request the file via IPC from the Electron main process
  //   const fileData = await window.electron.ipcRenderer.invoke('load-ply-file-2', selectedPath);

  //   if (fileData) {
  //     setAtlas(fileData);
  //   } else {
  //     console.error('Failed to load the PLY file.');
  //   }
  // };

  const handleTremorChange = (event) => {
    const selectTremor = event.target.value;
    const tremorItem = tremorData[selectTremor];
    const [x, y, z] = tremorItem.coords;
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: getRandomColor(),
      transparent: true,
      opacity: 0.8,
    });

    addMeshToScene(tremorItem.name, sphereGeometry, sphereMaterial, [x, y, z]);
    // setSelectedTremor((prevSelectedTremor) => {
    //   if (prevSelectedTremor.includes(selectedValue)) {
    //     // If already selected, remove it
    //     return prevSelectedTremor.filter((item) => item !== selectedValue);
    //   }
    //   // If not selected, add it
    //   return [...prevSelectedTremor, selectedValue];
    // });
  };

  const handlePDChange = (event) => {
    const selectTremor = event.target.value;
    const tremorItem = pdData[selectTremor];
    const [x, y, z] = tremorItem.coords;
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: getRandomColor(),
      transparent: true,
      opacity: 0.8,
    });

    addMeshToScene(tremorItem.name, sphereGeometry, sphereMaterial, [x, y, z]);
    // setSelectedTremor((prevSelectedTremor) => {
    //   if (prevSelectedTremor.includes(selectedValue)) {
    //     // If already selected, remove it
    //     return prevSelectedTremor.filter((item) => item !== selectedValue);
    //   }
    //   // If not selected, add it
    //   return [...prevSelectedTremor, selectedValue];
    // });
  };

  function getRandomColor() {
    return Math.floor(Math.random() * 16777215); // Generate a random number between 0 and 0xFFFFFF
  }

  const addOrRemoveSpheres = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Check existing spheres and add only new ones
    selectedTremor.forEach((selectedItem) => {
      const tremorItem = tremorData.find((item) => item.name === selectedItem);
      if (
        tremorItem &&
        !sphereRefs.current.some((sphere) => sphere.name === selectedItem)
      ) {
        const [x, y, z] = tremorItem.coords;
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: getRandomColor(),
          transparent: true,
          opacity: 0.8,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);

        // Assign the selectedItem as the sphere's name to track it
        sphere.name = selectedItem;

        scene.add(sphere);
        sphereRefs.current.push(sphere); // Add the new sphere to the list
      }
    });

    // Optionally, remove spheres if no longer selected
    sphereRefs.current = sphereRefs.current.filter((sphere) => {
      if (!selectedTremor.includes(sphere.name)) {
        scene.remove(sphere);
        return false; // Remove this sphere from the reference list
      }
      return true; // Keep this sphere
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.ply',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPlyFile(reader.result);
      };
      reader.readAsArrayBuffer(file);
    },
  });
  let contactDirections = {
    1: { x: 0, y: 0, z: 0 },
    2: { x: 0, y: 0, z: 0 },
    3: { x: 0, y: 0, z: 0 },
    4: { x: 0, y: 0, z: 0 },
  };
  let keyLevels = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
  };
  if (Object.keys(quantities).length > 6) {
    // contactDirections = {
    //   1: { x: 0, y: 0, z: 0 }, // Example directional adjustment for contact 1
    //   2: { x: 1, y: 0, z: 0 }, // Contact 2 adjustment
    //   3: { x: -0.5, y: -0.86, z: 0 }, // Contact 3 adjustment
    //   4: { x: -0.5, y: 0.86, z: 0 }, // Contact 4 adjustment
    //   5: { x: 1, y: 0, z: 0 }, // Contact 5 adjustment
    //   6: { x: -0.5, y: -0.86, z: 0 }, // Contact 6 adjustment
    //   7: { x: -0.5, y: 0.86, z: 0 }, // Contact 7 adjustment
    //   8: { x: 0, y: 0, z: 0 }, // Contact 8 adjustment
    // };
    contactDirections = {
      1: { x: 0, y: 0, z: 0 }, // Example directional adjustment for contact 1
      2: { x: 1, y: 0, z: 0 }, // Contact 2 adjustment
      3: { x: -0.5, y: -0.86, z: 0 }, // Contact 3 adjustment
      4: { x: -0.5, y: 0.86, z: 0 }, // Contact 4 adjustment
      5: { x: 1, y: 0, z: 0 }, // Contact 5 adjustment
      6: { x: -0.5, y: -0.86, z: 0 }, // Contact 6 adjustment
      7: { x: -0.5, y: 0.86, z: 0 }, // Contact 7 adjustment
      8: { x: 0, y: 0, z: 0 }, // Contact 8 adjustment
    };
    keyLevels = {
      1: 1,
      2: 2,
      3: 2,
      4: 2,
      5: 3,
      6: 3,
      7: 3,
      8: 4,
    };
  }
  const VTASpheresRef = useRef(null); // Store references to each sphere for updating later

  const clearAllSpheres = () => {
    // Traverse through all spheres and remove them
    Object.keys(VTASpheresRef).forEach((contactId) => {
      const sphere = VTASpheresRef[contactId];
      if (sphere) {
        sceneRef.current.remove(sphere);
        sphere.geometry.dispose();
        sphere.material.dispose();
        delete VTASpheresRef[contactId]; // Remove reference from VTASpheresRef
      }
    });
    // const scene = sceneRef.current;
    // VTASpheresRef.current = VTASpheresRef.current.filter((sphere) => {
    //   scene.remove(sphere);
    //   return true;
    // });
  };

  const handleIPG = (importedElectrode) => {
    if (
      importedElectrode.includes('Boston') ||
      importedElectrode.includes('boston')
    ) {
      return 'Boston';
    }
    if (
      importedElectrode.includes('Abbott') ||
      importedElectrode.includes('abbott')
    ) {
      return 'Abbott';
    }
    if (
      importedElectrode === 'Medtronic 3387' ||
      importedElectrode === 'Medtronic 3389' ||
      importedElectrode === 'medtronic_3387' ||
      importedElectrode === 'medtronic_3389' ||
      importedElectrode === 'medtronic_3391' ||
      importedElectrode === 'Medtronic 3391'
    ) {
      return 'Medtronic_Activa';
    }
    return 'Medtronic_Percept';
  };

  const handleImportedElectrode = (importedElectrode) => {
    switch (importedElectrode) {
      case 'Boston Scientific Vercise Directed':
        return 'boston_vercise_directed';
      case 'Medtronic 3389':
        return 'medtronic_3389';
      case 'Medtronic 3387':
        return 'medtronic_3387';
      case 'Medtronic 3391':
        return 'medtronic_3391';
      case 'Medtronic B33005':
        return 'medtronic_b33005';
      case 'Medtronic B33015':
        return 'medtronic_b33015';
      case 'Boston Scientific Vercise':
        return 'boston_scientific_vercise';
      case 'Boston Scientific Vercise Cartesia HX':
        return 'boston_scientific_vercise_cartesia_hx';
      case 'Boston Scientific Vercise Cartesia X':
        return 'boston_scientific_vercise_cartesia_x';
      case 'Abbott ActiveTip (6146-6149)':
        return 'abbott_activetip_2mm';
      case 'Abbott ActiveTip (6142-6145)':
        return 'abbott_activetip_3mm';
      case 'Abbott Directed 6172 (short)':
        return 'abbott_directed_05';
      case 'Abbott Directed 6173 (long)':
        return 'abbott_directed_15';
      default:
        return '';
    }
  };

  const gatherImportedDataNew = (jsonData, outputIPG) => {
    console.log(jsonData);

    const newQuantities = {};
    const newSelectedValues = {};
    const newTotalAmplitude = {};
    const newAllQuantities = {};
    const newAllVolAmpToggles = {};

    console.log('Imported Amplitude: ', jsonData.amplitude);

    for (let j = 1; j < 5; j++) {
      try {
        newTotalAmplitude[j] = jsonData.amplitude[1][j - 1];
        newTotalAmplitude[j + 4] = jsonData.amplitude[0][j - 1];
      } catch {
        console.log('');
      }

      try {
        newTotalAmplitude[j] = jsonData.amplitude.leftAmplitude[j - 1];
        newTotalAmplitude[j + 4] = jsonData.amplitude.rightAmplitude[j - 1];
      } catch {
        console.log('');
      }

      console.log('newTotalAmplitude: ', newTotalAmplitude);

      const dynamicKey2 = `Ls${j}`;
      const dynamicKey3 = `Rs${j}`;
      if (jsonData[dynamicKey2].va === 2) {
        newAllVolAmpToggles[j] = 'center';
      } else if (jsonData[dynamicKey2].va === 1) {
        newAllVolAmpToggles[j] = 'right';
      }

      if (jsonData[dynamicKey3].va === 2) {
        newAllVolAmpToggles[j + 4] = 'center';
      } else if (jsonData[dynamicKey3].va === 1) {
        newAllVolAmpToggles[j + 4] = 'right';
      }

      for (let i = 0; i < 9; i++) {
        const dynamicKey = `k${i + 7}`;
        const dynamicKey1 = `k${i}`;

        if (jsonData[dynamicKey2] && jsonData[dynamicKey2][dynamicKey]) {
          newQuantities[j] = newQuantities[j] || {};
          newQuantities[j][i] = parseFloat(
            jsonData[dynamicKey2][dynamicKey].perc,
          );
          newQuantities[j][0] = parseFloat(jsonData[dynamicKey2].case.perc);

          const { pol } = jsonData[dynamicKey2][dynamicKey];
          newSelectedValues[j] = newSelectedValues[j] || {};
          newSelectedValues[j][i] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          const casePol = jsonData[dynamicKey2].case.pol;
          newSelectedValues[j][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }

        if (jsonData[dynamicKey3] && jsonData[dynamicKey3][dynamicKey1]) {
          newQuantities[j + 4] = newQuantities[j + 4] || {};
          newQuantities[j + 4][i + 1] = parseFloat(
            jsonData[dynamicKey3][dynamicKey1].perc,
          );
          newQuantities[j + 4][0] = parseFloat(jsonData[dynamicKey3].case.perc);

          const { pol } = jsonData[dynamicKey3][dynamicKey1];
          newSelectedValues[j + 4] = newSelectedValues[j + 4] || {};
          newSelectedValues[j + 4][i + 1] =
            pol === 0 ? 'left' : pol === 1 ? 'center' : 'right';

          const casePol = jsonData[dynamicKey3].case.pol;
          newSelectedValues[j + 4][0] =
            casePol === 0 ? 'left' : casePol === 1 ? 'center' : 'right';
        }
      }

      newAllQuantities[j] = newQuantities[j];
      newAllQuantities[j + 4] = newQuantities[j + 4];
    }

    const filteredValues = Object.keys(newSelectedValues)
      .filter((key) => Object.keys(newSelectedValues[key]).length > 0)
      .reduce((obj, key) => {
        obj[key] = newSelectedValues[key];
        return obj;
      }, {});

    const filteredQuantities = Object.keys(newQuantities)
      .filter((key) => Object.keys(newQuantities[key]).length > 0)
      .reduce((obj, key) => {
        obj[key] = newQuantities[key];
        return obj;
      }, {});

    console.log('TEST!L: ', outputIPG);
    // if (outputIPG.includes('Medtronic')) {
    //   Object.keys(filteredQuantities).forEach((key) => {
    //     console.log('Test: ', filteredQuantities[key]);
    //     Object.keys(filteredQuantities[key]).forEach((key2) => {
    //       filteredQuantities[key][key2] =
    //         (filteredQuantities[key][key2] / 100) * newTotalAmplitude[key];
    //     });
    //   });
    // }

    return {
      filteredQuantities,
      filteredValues,
      newTotalAmplitude,
    };

    // Need to add some type of filtering here that detects whether it is Medtronic Activa, and then needs to put just mA values, not %
  };

  const addPreviousVTA = (
    reconstruction,
    stimulationParameters,
    selectedPatientID,
    selectedSession,
  ) => {
    const { S } = stimulationParameters;
    console.log(reconstruction);
    // const outputElectrode = S.elmodel;
    const outputIPG = S.ipg;
    const processedData = gatherImportedDataNew(S, outputIPG);

    let rotationAngle = 0;
    if (side < 5 && Object.keys(quantities).length > 6) {
      rotationAngle = reconstruction.directionality.roll_out_left - 60;
    } else {
      rotationAngle = reconstruction.directionality.roll_out_right - 120;
    }
    const rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(rotationAngle),
    ); // Z-axis rotation
    console.log(togglePosition);
    // Loop through all contact directions to handle adding and updating spheres
    Object.keys(contactDirections).forEach((contactId) => {
      console.log(togglePosition);
      let contactQuantity = parseFloat(quantities[contactId]);
      let newAmplitude = amplitude;
      // if (togglePosition === 'center') {
      const newQuantities = processedData.filteredQuantities[side];
      console.log(newQuantities);
      newAmplitude = processedData.newTotalAmplitude[side];
      console.log(newAmplitude);
      // }
      contactQuantity = parseFloat(newQuantities[contactId]);

      // If contactQuantity is greater than 0, add or update the sphere
      if (contactQuantity > 0) {
        // Check if the sphere already exists in VTASpheresRef
        // if (!VTASpheresRef[contactId]) {
        // Calculate position and amplitude
        console.log('PLYViewer', quantities, keyLevels, contactDirections);
        const vectorLevel = keyLevels[contactId];
        const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
        const normalizedLevel = (clampedLevel - 1) / (4 - 1);

        let startCoords = [];
        let targetCoords = [];
        if (side < 5) {
          const { head2: headMarkers, tail2: tailMarkers } =
            reconstruction.markers;
          startCoords = new THREE.Vector3(...headMarkers);
          targetCoords = new THREE.Vector3(...tailMarkers);
        } else {
          const { head1: headMarkers, tail1: tailMarkers } =
            reconstruction.markers;
          startCoords = new THREE.Vector3(...headMarkers);
          targetCoords = new THREE.Vector3(...tailMarkers);
        }

        // Calculate the direction of the electrode
        const direction = new THREE.Vector3()
          .subVectors(targetCoords, startCoords)
          .normalize();

        // Create an orthogonal basis for the electrode
        const up = new THREE.Vector3(0, 0, 1);
        const right = new THREE.Vector3()
          .crossVectors(direction, up)
          .normalize();
        const forward = new THREE.Vector3()
          .crossVectors(right, direction)
          .normalize();
        const newPosition = startCoords
          .clone()
          .lerp(targetCoords, normalizedLevel);
        const directionOffset = new THREE.Vector3(
          contactDirections[contactId].x,
          contactDirections[contactId].y,
          contactDirections[contactId].z,
        );

        // Apply the rotation to the directionOffset using the quaternion
        directionOffset.applyQuaternion(rotationQuaternion);

        // Apply the direction offset to the newPosition relative to the electrode’s orientation
        newPosition.x +=
          right.x * directionOffset.x +
          forward.x * directionOffset.y +
          direction.x * directionOffset.z;
        newPosition.y +=
          right.y * directionOffset.x +
          forward.y * directionOffset.y +
          direction.y * directionOffset.z;
        newPosition.z +=
          right.z * directionOffset.x +
          forward.z * directionOffset.y +
          direction.z * directionOffset.z;

        // Calculate amplitude based on contactQuantity
        const contactAmplitude = (contactQuantity / 100) * newAmplitude;

        // Create a new sphere
        const sphereGeo = new THREE.SphereGeometry(
          Math.sqrt((contactAmplitude - 0.1) / 0.22),
          32,
          32,
        );

        const sphereMat = new THREE.MeshStandardMaterial({
          color: 'blue', // Set the base color to red
          transparent: true, // Make the material transparent
          opacity: 0.8, // Set opacity to 80%
          roughness: 0.4, // Control the surface roughness (0 = smooth, 1 = rough)
          metalness: 0.1, // Control the metallic appearance (0 = non-metal, 1 = fully metallic)
          flatShading: false, // Enable smooth shading for better visual quality
          // Emissive properties
          emissive: 0xff0000, // Red glow
          emissiveIntensity: 0.2, // Controls the intensity of the emissive glow
          // Clearcoat for glossy surface
          // clearcoat: 1.0, // Max clearcoat effect
          // Specular highlights
          // Wireframe mode for structural view
          wireframe: false, // Turn on wireframe if needed
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);

        // Set the position of the sphere
        sphere.position.set(newPosition.x, newPosition.y, newPosition.z);
        // sphere.name = `contact_${contactId}`; // Name the sphere to track it
        addMeshToScene(
          `${selectedPatientID}_${selectedSession}_VTA`,
          sphereGeo,
          sphereMat,
          [newPosition.x, newPosition.y, newPosition.z],
        );
        // }
      }
    });
  };

  const handlePriorStimChange = async (event) => {
    const selectedValue = event.target.value;
    // console.log('Selected Value: ', selectedValue.split('-'));
    const splitValues = selectedValue.split('-');
    const selectedPatientID = splitValues[0];
    // const selectedPatientID = selectedValue;
    const selectedSession = splitValues[1];
    console.log(selectedPatientID);
    const electrodeLoader = new PLYLoader();
    const anatomyLoader = new PLYLoader();

    try {
      // Load and parse the PLY file from Electron's IPC
      const fileData = await window.electron.ipcRenderer.invoke(
        'load-ply-file-database',
        selectedPatientID,
        selectedSession,
      );
      const electrodeGeometry = electrodeLoader.parse(
        fileData.combinedElectrodesPly,
      );
      const anatomyGeometry = anatomyLoader.parse(fileData.anatomyPly);
      // Create a material for the mesh
      const material = new THREE.MeshStandardMaterial({
        // vertexColors: electrodeGeometry.hasAttribute('color'),
        color: new THREE.Color(0.1, 0.5, 0.8),
        flatShading: true,
        metalness: 0.1,
        roughness: 0.5,
        transparent: true,
        opacity: 0.8,
      });

      // Add the mesh to the scene
      addMeshToScene(
        `${selectedPatientID}-electrodes`,
        electrodeGeometry,
        material,
      );
      addPreviousVTA(
        fileData.reconstructionData,
        fileData.stimulationParameters,
        selectedPatientID,
        selectedSession,
      );
      // addMeshToScene(`${selectedPatientID}-electrodes`)
    } catch (error) {
      console.error('Error loading PLY file:', error);
    }
  };

  const calculatePercentageFromAmplitude = () => {
    const updatedQuantities = { ...quantities };
    Object.keys(updatedQuantities).forEach((key) => {
      updatedQuantities[key] = (updatedQuantities[key] * 100) / amplitude;
    });
    return updatedQuantities;
  };

  // VTA
  const updateSpherePosition = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (!recoData) return;
    console.log(recoData);
    clearAllSpheres();

    let rotationAngle = 0;
    if (side < 5 && Object.keys(quantities).length > 6) {
      rotationAngle = recoData.directionality.roll_out_left - 60;
    } else {
      rotationAngle = recoData.directionality.roll_out_right - 120;
    }
    const rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(rotationAngle),
    ); // Z-axis rotation

    // Loop through all contact directions to handle adding and updating spheres
    Object.keys(contactDirections).forEach((contactId) => {
      console.log(togglePosition);
      let contactQuantity = parseFloat(quantities[contactId]);
      if (togglePosition === 'center') {
        const newQuantities = calculatePercentageFromAmplitude();
        contactQuantity = parseFloat(newQuantities[contactId]);
      }

      // If contactQuantity is greater than 0, add or update the sphere
      if (contactQuantity > 0) {
        // Check if the sphere already exists in VTASpheresRef
        // if (!VTASpheresRef[contactId]) {
        // Calculate position and amplitude
        console.log('PLYViewer', quantities, keyLevels, contactDirections);
        const vectorLevel = keyLevels[contactId];
        const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
        const normalizedLevel = (clampedLevel - 1) / (4 - 1);

        let startCoords = [];
        let targetCoords = [];
        if (side < 5) {
          const { head2: headMarkers, tail2: tailMarkers } = recoData.markers;
          startCoords = new THREE.Vector3(...headMarkers);
          targetCoords = new THREE.Vector3(...tailMarkers);
        } else {
          const { head1: headMarkers, tail1: tailMarkers } = recoData.markers;
          startCoords = new THREE.Vector3(...headMarkers);
          targetCoords = new THREE.Vector3(...tailMarkers);
        }

        // Calculate the direction of the electrode
        const direction = new THREE.Vector3()
          .subVectors(targetCoords, startCoords)
          .normalize();

        // Create an orthogonal basis for the electrode
        const up = new THREE.Vector3(0, 0, 1); // Assuming 'up' is along the global Z-axis
        const right = new THREE.Vector3()
          .crossVectors(direction, up)
          .normalize();
        const forward = new THREE.Vector3()
          .crossVectors(right, direction)
          .normalize();

        // Linearly interpolate between startCoords and targetCoords based on normalizedLevel
        const newPosition = startCoords
          .clone()
          .lerp(targetCoords, normalizedLevel);

        // Get the direction adjustment for the contact
        // const directionOffset = contactDirections[contactId];

        // Get the direction offset for the contact
        const directionOffset = new THREE.Vector3(
          contactDirections[contactId].x,
          contactDirections[contactId].y,
          contactDirections[contactId].z,
        );

        // Apply the rotation to the directionOffset using the quaternion
        directionOffset.applyQuaternion(rotationQuaternion);

        // Apply the direction offset to the newPosition relative to the electrode’s orientation
        newPosition.x +=
          right.x * directionOffset.x +
          forward.x * directionOffset.y +
          direction.x * directionOffset.z;
        newPosition.y +=
          right.y * directionOffset.x +
          forward.y * directionOffset.y +
          direction.y * directionOffset.z;
        newPosition.z +=
          right.z * directionOffset.x +
          forward.z * directionOffset.y +
          direction.z * directionOffset.z;

        // Calculate amplitude based on contactQuantity
        const contactAmplitude = (contactQuantity / 100) * amplitude;

        // Create a new sphere
        const geometry = new THREE.SphereGeometry(
          Math.sqrt((contactAmplitude - 0.1) / 0.22),
          32,
          32,
        );

        const material = new THREE.MeshStandardMaterial({
          color: 0xff0000, // Set the base color to red
          transparent: true, // Make the material transparent
          opacity: 0.8, // Set opacity to 80%
          roughness: 0.4, // Control the surface roughness (0 = smooth, 1 = rough)
          metalness: 0.1, // Control the metallic appearance (0 = non-metal, 1 = fully metallic)
          flatShading: false, // Enable smooth shading for better visual quality
          // Emissive properties
          emissive: 0xff0000, // Red glow
          emissiveIntensity: 0.2, // Controls the intensity of the emissive glow
          // Clearcoat for glossy surface
          // clearcoat: 1.0, // Max clearcoat effect
          // Specular highlights
          specular: 0xffffff, // White specular highlights
          shininess: 15, // Sharpness of specular highlights
          // Wireframe mode for structural view
          wireframe: false, // Turn on wireframe if needed
        });
        const sphere = new THREE.Mesh(geometry, material);

        // Set the position of the sphere
        sphere.position.set(newPosition.x, newPosition.y, newPosition.z);
        sphere.name = `contact_${contactId}`; // Name the sphere to track it

        // Add the sphere to the scene and store it in the VTASpheresRef
        scene.add(sphere);
        VTASpheresRef[contactId] = sphere; // Track the sphere by contactId
        // }
      }
    });

    // Remove spheres that are no longer needed
    Object.keys(VTASpheresRef).forEach((contactId) => {
      const contactQuantity = parseFloat(quantities[contactId]);

      // If the quantity for this contactId is 0, remove the sphere
      if (!contactQuantity || contactQuantity === 0) {
        const sphere = VTASpheresRef[contactId];
        if (sphere) {
          scene.remove(sphere);
          sphere.geometry.dispose();
          sphere.material.dispose();
          delete VTASpheresRef[contactId]; // Remove reference from VTASpheresRef
        }
      }
    });
  };

  const logCameraSettings = () => {
    console.log(recoData);
    if (cameraRef.current) {
      console.log('Camera Settings:');
      console.log('Position:', cameraRef.current.position);
      console.log('Rotation:', cameraRef.current.rotation);
      console.log('Zoom:', cameraRef.current.zoom);
      console.log('FOV:', cameraRef.current.fov);
      console.log('Near:', cameraRef.current.near);
      console.log('Far:', cameraRef.current.far);
    } else {
      console.log('Camera not initialized.');
    }
  };
  // Vis main view
  // useEffect(() => {
  //   if (mountRef.current) {
  //     // Initialize scene, camera, and renderer only once
  //     const scene = new THREE.Scene();
  //     sceneRef.current = scene; // Save scene reference
  //     scene.background = new THREE.Color(0xffffff); // White background

  //     // Create an OrthographicCamera
  //     const aspect = 300 / 600;
  //     const frustumSize = 100; // Adjust this value to control zoom
  //     const camera = new THREE.OrthographicCamera(
  //       (frustumSize * aspect) / -2, // left
  //       (frustumSize * aspect) / 2, // right
  //       frustumSize / 2, // top
  //       frustumSize / -2, // bottom
  //       0.1, // near plane
  //       1000, // far plane
  //     );

  //     // const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000); // 1 is the aspect ratio (square)
  //     const renderer = new THREE.WebGLRenderer({ antialias: true });
  //     renderer.setSize(300, 600); // Set smaller size
  //     mountRef.current.appendChild(renderer.domElement);

  //     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //     scene.add(ambientLight);

  //     // if (side < 5) {
  //     //   // Create a clipping plane that only renders objects with x > 0
  //     //   const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

  //     //   // Enable the clipping planes in the renderer
  //     //   renderer.localClippingEnabled = true;

  //     //   // Apply the clipping plane to the entire scene
  //     //   renderer.clippingPlanes = [clipPlane];
  //     // } else {
  //     //   // Create a clipping plane that only renders objects with x > 0
  //     //   const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

  //     //   // Enable the clipping planes in the renderer
  //     //   renderer.localClippingEnabled = true;

  //     //   // Apply the clipping plane to the entire scene
  //     //   renderer.clippingPlanes = [clipPlane];
  //     // }

  //     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  //     directionalLight.position.set(5, 5, 5).normalize();
  //     scene.add(directionalLight);

  //     // const loader = new PLYLoader();
  //     // const geometry = loader.parse(plyFile);
  //     // // const material = new THREE.MeshStandardMaterial({
  //     // //   vertexColors: geometry.hasAttribute('color'),
  //     // //   flatShading: true,
  //     // // });

  //     // const material = new THREE.MeshStandardMaterial({
  //     //   vertexColors: geometry.hasAttribute('color'),
  //     //   flatShading: true,
  //     //   metalness: 0.1, // More reflective
  //     //   roughness: 0.5, // Shinier surface
  //     //   transparent: true, // Enable transparency
  //     //   opacity: 0.8, // Set opacity to 60%
  //     // });

  //     // geometry.computeVertexNormals();
  //     // const mesh = new THREE.Mesh(geometry, material);
  //     // scene.add(mesh);

  //     // OrbitControls setup (only initialize once)
  //     const controls = new OrbitControls(camera, renderer.domElement);
  //     controls.enableDamping = true;
  //     controls.dampingFactor = 0.1;
  //     controls.rotateSpeed = 0.8;
  //     controls.zoomSpeed = 0.5;
  //     controlsRef.current = controls;

  //     camera.position.set(0, -50, 60); // Zoomed out to start
  //     // camera.lookAt(0, 0, 0); // Ensure the camera is looking at the scene origin
  //     if (side < 5) {
  //       camera.lookAt(0, 100, 0); // Ensure the camera is looking at the scene origin
  //     } else {
  //       camera.lookAt(0, 0, 0); // Ensure the camera is looking at the scene origin
  //     }

  //     // const onWindowResize = () => {
  //     //   camera.aspect = window.innerWidth / window.innerHeight;
  //     //   camera.updateProjectionMatrix();
  //     //   renderer.setSize(window.innerWidth, window.innerHeight);
  //     // };
  //     const onWindowResize = () => {
  //       camera.left = (frustumSize * aspect) / -2;
  //       camera.right = (frustumSize * aspect) / 2;
  //       camera.top = frustumSize / 2;
  //       camera.bottom = frustumSize / -2;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(window.innerWidth, window.innerHeight);
  //     };
  //     window.addEventListener('resize', onWindowResize);

  //     rendererRef.current = renderer;
  //     cameraRef.current = camera;

  //     const animate = () => {
  //       requestAnimationFrame(animate);
  //       controls.update(); // Update OrbitControls
  //       renderer.render(sceneRef.current, camera);
  //     };
  //     animate();

  //     return () => {
  //       window.removeEventListener('resize', onWindowResize);
  //       renderer.dispose();
  //     };
  //   }
  // }, [plyFile]);

  useEffect(() => {
    if (mountRef.current && secondaryMountRef.current) {
      // Initialize scene, camera, and renderer only once
      const scene = new THREE.Scene();
      sceneRef.current = scene; // Save scene reference
      scene.background = new THREE.Color(0xffffff); // White background

      // Create an OrthographicCamera
      const aspect = 300 / 600;
      const frustumSize = 100; // Adjust this value to control zoom
      const camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2, // left
        (frustumSize * aspect) / 2, // right
        frustumSize / 2, // top
        frustumSize / -2, // bottom
        0.1, // near plane
        1000, // far plane
      );

      // Secondary Camera Setup
      const secondaryWidth = 300;
      const secondaryHeight = 150; // Adjust height as needed
      const aspectSecondary = secondaryWidth / secondaryHeight;
      const secondaryFrustumHeight = frustumSize / 2; // Set a smaller height for the secondary view
      const secondaryCamera = new THREE.OrthographicCamera(
        (secondaryFrustumHeight * aspectSecondary) / -2,
        (secondaryFrustumHeight * aspectSecondary) / 2,
        secondaryFrustumHeight / 2,
        secondaryFrustumHeight / -2,
        0.1,
        1000,
      );
      secondaryCamera.position.set(50, 50, 100);
      secondaryCamera.lookAt(0, 0, 0);

      // const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000); // 1 is the aspect ratio (square)
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(300, 600); // Set smaller size
      mountRef.current.appendChild(renderer.domElement);

      const secondaryRenderer = new THREE.WebGLRenderer({ antialias: true });
      secondaryRenderer.setSize(300, 150);
      secondaryMountRef.current.appendChild(secondaryRenderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      // OrbitControls setup (only initialize once)
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 0.5;
      controlsRef.current = controls;

      // const secondaryControls = new OrbitControls(secondaryCamera, secondaryRenderer.domElement);
      // secondaryControls.enableDamping = true;
      // secondaryControls.dampingFactor = 0.1;
      // secondaryControls.rotateSpeed = 0.8;
      // secondaryControls.zoomSpeed = 0.5;
      // secondaryControls.current = secondaryControls;

      // secondaryControlsRef.current = controls;

      camera.position.set(0, -50, 50); // Zoomed out to start
      // camera.lookAt(0, 0, 0); // Ensure the camera is looking at the scene origin

      // const onWindowResize = () => {
      //   camera.aspect = window.innerWidth / window.innerHeight;
      //   camera.updateProjectionMatrix();
      //   renderer.setSize(window.innerWidth, window.innerHeight);
      // };
      const onWindowResize = () => {
        camera.left = (frustumSize * aspect) / -2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);

      rendererRef.current = renderer;
      secondaryCameraRef.current = secondaryCamera;
      secondaryRendererRef.current = secondaryRenderer;
      cameraRef.current = camera;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update OrbitControls
        renderer.render(sceneRef.current, camera);
        secondaryRenderer.render(scene, secondaryCamera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', onWindowResize);
        renderer.dispose();
      };
    }
  }, [plyFile]);

  useEffect(() => {
    if (atlas && sceneRef.current) {
      const scene = sceneRef.current;
      const loader = new PLYLoader();
      const geometry = loader.parse(atlas);
      const material = new THREE.MeshStandardMaterial({
        vertexColors: geometry.hasAttribute('color'),
        flatShading: true,
        metalness: 0.1,
        roughness: 0.5,
        transparent: true,
        opacity: 0.8,
      });

      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }
  }, [atlas]);

  useEffect(() => {
    if (sceneRef.current) {
      addOrRemoveSpheres();
    }
  }, [selectedTremor]);

  useEffect(() => {
    if (quantities) {
      updateSpherePosition(); // Update the sphere position based on quantities
      // Object.keys(contactDirections).forEach((contactId) => {
      //   updateSpherePosition(contactId); // Create or update each sphere for every contactId
      // });
    }
  }, [quantities, amplitude]);

  // useEffect(() => {
  //   const scene = sceneRef.current;
  //   try {
  //     // Extract vertices and R values from plotNiiCoords
  //     const vertices = plotNiiCoords.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  //     const rValues = plotNiiCoords.map(([x, y, z, r]) => r); // Extract R values

  //     // Create a geometry and add the vertices
  //     const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  //     // Create an array to hold colors for each point
  //     const colors = new Float32Array(vertices.length * 3);

  //     // Normalize R values for coloring
  //     const minR = Math.min(...rValues);
  //     const maxR = Math.max(...rValues);

  //     // Assign colors based on R values
  //     rValues.forEach((r, i) => {
  //       const color = new THREE.Color();

  //       const normalizedR = Math.atan(r) / Math.PI + 0.5;

  //       if (r < 0) {
  //         // Map negative R values to cooler colors (blue to cyan)
  //         color.setHSL(0.6 - 0.2 * normalizedR, 1.0, 0.5); // Hue: blue to cyan
  //       } else {
  //         // Map positive R values to warmer colors (yellow to red)
  //         color.setHSL(0.1 + 0.3 * normalizedR, 1.0, 0.6); // Hue: yellow to red, brighter
  //       }

  //       // Assign color values
  //       colors[i * 3] = color.r; // Red
  //       colors[i * 3 + 1] = color.g; // Green
  //       colors[i * 3 + 2] = color.b; // Blue
  //     });

  //     console.log(rValues);

  //     // Add the color attribute to the geometry
  //     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  //     // Create a material for the points with vertexColors enabled
  //     const material = new THREE.PointsMaterial({
  //       vertexColors: true, // Enable per-vertex colors
  //       size: 5.0, // Increase size for better visibility
  //     });

  //     // Create the points object
  //     const points = new THREE.Points(geometry, material);

  //     // Add to the scene
  //     scene.add(points);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [plotNiiCoords]);

  // useEffect(() => {
  //   const scene = sceneRef.current;
  //   try {
  //     // Debugging: Log data samples and statistics
  //     console.log('Total Number of Points in plotNiiCoords:', plotNiiCoords.length);

  //     // Log the first 10 coordinates
  //     console.log('Sample Coordinates (First 10):');
  //     plotNiiCoords.slice(0, 10).forEach((coord, index) => {
  //       console.log(`Point ${index}:`, coord);
  //     });

  //     // Log a random sample of 10 points
  //     const sampleSize = 10;
  //     const randomSamples = Array.from({ length: sampleSize }, () => {
  //       const randomIndex = Math.floor(Math.random() * plotNiiCoords.length);
  //       return plotNiiCoords[randomIndex];
  //     });

  //     console.log('Random Sample of Coordinates:');
  //     randomSamples.forEach((coord, index) => {
  //       console.log(`Point ${index}:`, coord);
  //     });

  //     // Calculate summary statistics
  //     const xValues = plotNiiCoords.map(([x]) => x);
  //     const yValues = plotNiiCoords.map(([, y]) => y);
  //     const zValues = plotNiiCoords.map(([, , z]) => z);
  //     const rValues = plotNiiCoords.map(([, , , r]) => r);

  //     const getStats = (values) => {
  //       let min = Infinity;
  //       let max = -Infinity;
  //       let sum = 0;

  //       values.forEach((value) => {
  //         if (value < min) min = value;
  //         if (value > max) max = value;
  //         sum += value;
  //       });

  //       const mean = sum / values.length;

  //       return { min, max, mean };
  //     };

  //     console.log('X Stats:', getStats(xValues));
  //     console.log('Y Stats:', getStats(yValues));
  //     console.log('Z Stats:', getStats(zValues));
  //     console.log('R Stats:', getStats(rValues));

  //     // Log a grid view of coordinates
  //     const gridSize = 5; // Number of points to log per axis
  //     const step = Math.floor(plotNiiCoords.length / gridSize);

  //     console.log('Grid View of Coordinates:');
  //     for (let i = 0; i < plotNiiCoords.length; i += step) {
  //       console.log(`Point ${i}:`, plotNiiCoords[i]);
  //     }

  //     // Visualization: Subset data for rendering
  //     const samplingRate = 0.1; // Render 10% of points
  //     const sampledPlotNiiCoords = plotNiiCoords.filter(() => Math.random() < samplingRate);
  //     console.log('Number of Sampled Points:', sampledPlotNiiCoords.length);

  //     // Extract vertices and R values from sampled data
  //     const vertices = sampledPlotNiiCoords.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  //     const rValuesSampled = sampledPlotNiiCoords.map(([x, y, z, r]) => r);

  //     // Create a geometry and add the vertices
  //     const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

  //     // Create an array to hold colors
  //     const colors = new Float32Array(vertices.length * 3);

  //     // Normalize R values for coloring
  //     const minR = Math.min(...rValuesSampled);
  //     const maxR = Math.max(...rValuesSampled);

  //     // Assign colors based on R values
  //     rValuesSampled.forEach((r, i) => {
  //       const color = new THREE.Color();
  //       const normalizedR = Math.atan(r) / Math.PI + 0.5;

  //       if (r < 0) {
  //         // Map negative R values to cooler colors (blue to cyan)
  //         color.setHSL(0.6 - 0.2 * normalizedR, 1.0, 0.5);
  //       } else {
  //         // Map positive R values to warmer colors (yellow to red)
  //         color.setHSL(0.1 + 0.3 * normalizedR, 1.0, 0.6);
  //       }

  //       // Assign color values
  //       colors[i * 3] = color.r;
  //       colors[i * 3 + 1] = color.g;
  //       colors[i * 3 + 2] = color.b;
  //     });

  //     // Add the color attribute to the geometry
  //     geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  //     // Create a material for the points with vertexColors enabled
  //     const material = new THREE.PointsMaterial({
  //       vertexColors: true, // Enable per-vertex colors
  //       size: 5.0, // Increase size for better visibility
  //     });

  //     // Create the points object
  //     const points = new THREE.Points(geometry, material);

  //     // Add to the scene
  //     scene.add(points);
  //   } catch (err) {
  //     console.error('Error in rendering:', err);
  //   }
  // }, [plotNiiCoords]);

  useEffect(() => {
    const scene = sceneRef.current;
    try {
      // Step 1: Filter extreme R values
      const filteredCoords = plotNiiCoords.filter(
        ([x, y, z, r]) => r > 1e-5 && r < 1e5,
      );

      // Step 2: Extract and clamp R values
      const rValues = filteredCoords.map(([x, y, z, r]) => r);
      const clampedRValues = rValues.map((r) =>
        Math.max(1e-5, Math.min(r, 1e5)),
      );

      // Step 3: Normalize R values linearly
      const minR = Math.min(...clampedRValues);
      const maxR = Math.max(...clampedRValues);
      const normalizedRValues = clampedRValues.map(
        (r) => (r - minR) / (maxR - minR),
      );

      console.log('Filtered and Normalized R Values:', normalizedRValues);

      // Step 4: Create vertices and geometry
      const vertices = filteredCoords.map(
        ([x, y, z]) => new THREE.Vector3(x, y, z),
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

      // Step 5: Create colors array
      const colors = new Float32Array(vertices.length * 3);
      normalizedRValues.forEach((r, i) => {
        const color = new THREE.Color();
        color.setHSL(0.1 + 0.3 * r, 1.0, 0.6); // Yellow to red
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      });

      // Add colors to geometry
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Create and add points to the scene
      const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 5.0,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
    } catch (err) {
      console.error('Error in rendering:', err);
    }
  }, [plotNiiCoords]);

  const [zoomLevel, setZoomLevel] = useState(-3);

  // Function to change the camera angle
  const changeCameraAngle = () => {
    const camera = secondaryCameraRef.current;
    let startCoords = [];
    let targetCoords = [];
    if (side < 5) {
      const { head2: headMarkers, tail2: tailMarkers } = recoData.markers;
      startCoords = new THREE.Vector3(...headMarkers);
      targetCoords = new THREE.Vector3(...tailMarkers);
    } else {
      const { head1: headMarkers, tail1: tailMarkers } = recoData.markers;
      startCoords = new THREE.Vector3(...headMarkers);
      targetCoords = new THREE.Vector3(...tailMarkers);
    }

    if (camera) {
      // Calculate the direction vector by subtracting startCoords from endCoords
      const directionVector = new THREE.Vector3(
        targetCoords.x - startCoords.x,
        targetCoords.y - startCoords.y,
        targetCoords.z - startCoords.z,
      );

      // Normalize the direction vector
      directionVector.normalize();

      // Position the camera above the vector (for example, along the z-axis)
      const cameraDistance = 50; // Distance from the vector
      const cameraPosition = new THREE.Vector3();
      cameraPosition
        .copy(startCoords)
        .addScaledVector(directionVector, cameraDistance);
      const v = directionVector;
      const yaw = Math.atan2(v.x, v.z);
      const pitch = Math.atan2(v.y, v.z);
      const roll = 0;
      const newSwitchedPosition = new THREE.Vector3(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
      );
      camera.position.copy(newSwitchedPosition); // Move the camera to the calculated point
      camera.rotation.set(-pitch, yaw, roll, 'XYZ'); // Set the camera rotations
      camera.zoom = 3.25;
      camera.updateProjectionMatrix();
    }
  };

  const changePrimaryCameraAngle = () => {
    const camera = cameraRef.current;
    let startCoords = [];
    let targetCoords = [];
    if (side < 5) {
      const { head2: headMarkers, tail2: tailMarkers } = recoData.markers;
      startCoords = new THREE.Vector3(...headMarkers);
      targetCoords = new THREE.Vector3(...tailMarkers);
    } else {
      const { head1: headMarkers, tail1: tailMarkers } = recoData.markers;
      startCoords = new THREE.Vector3(...headMarkers);
      targetCoords = new THREE.Vector3(...tailMarkers);
    }

    if (camera) {
      // Calculate the direction vector by subtracting startCoords from endCoords
      const focalPoint = new THREE.Vector3(
        startCoords.x,
        camera.position.y,
        camera.position.z,
      );
      camera.position.copy(focalPoint); // Move the camera to the calculated point
      camera.rotation.set(0.8, 0, 0, 'XYZ');
      camera.lookAt(startCoords);
      camera.zoom = 3;
      camera.updateProjectionMatrix();
    }
  };

  useEffect(() => {
    if (recoData) {
      changeCameraAngle();
      // changePrimaryCameraAngle();
    }
  }, [recoData]);

  const findNearestCoordinate = (target, coordinates) => {
    const [x1, y1, z1] = target;
    let minIndex = -1;
    let minDistance = Infinity;
    const coordinateDistances = coordinates.map(([x2, y2, z2], index) => {
      const distance = Math.sqrt(
        (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2,
      );
      if (distance < minDistance) {
        minDistance = distance;
        minIndex = index;
      }
      return { index, distance };
    });

    // Sort distances to assign ranks
    const rankedDistances = [...coordinateDistances]
      .sort((a, b) => a.distance - b.distance)
      .map((item, rank) => ({ ...item, rank: rank + 1 })); // Rank starts from 1

    return {
      index: minIndex,
      distance: minDistance,
      distanceArray: rankedDistances, // Array with distances and ranks
    };
  };

  const calvinsGoodness = (candidate, target, avoidance) => {
    const euclideanDistance = (point1, point2) => {
      const [x1, y1, z1] = point1;
      const [x2, y2, z2] = point2;
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    };

    const distanceToTarget = euclideanDistance(candidate, target);
    const distanceToAvoidance = euclideanDistance(candidate, avoidance);
    const sum = distanceToTarget + distanceToAvoidance;

    // Calculate the normalized goodness score
    return (distanceToAvoidance - distanceToTarget) / sum;
  };

  const findOptimalCoordinate = (target, avoidance, candidates) => {
    const scores = candidates.map((candidate, index) => ({
      index,
      score: calvinsGoodness(candidate, target, avoidance),
    }));

    // Sort by score in descending order (best to worst)
    scores.sort((a, b) => b.score - a.score);

    const bestIndex = scores[0].index;
    const rankedIndices = scores.map((item) => item.index);
    const [x1, y1, z1] = target;
    const [x2, y2, z2] = candidates[bestIndex];
    const distance = Math.sqrt(
      (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2,
    );

    return { bestIndex, rankedIndices, distance };
  };

  // const calculateAmplitude = (distance, k = 1.3) => {
  //   console.log(distance);
  //   return (distance / k) ** 2;
  // };

  // const calculateAmplitude = (distance, k = 1.3) => {
  //   const tmpAmp = (distance / k) ** 2;
  //   return Math.round(tmpAmp * 10) / 10;
  // };

  const calculateAmplitude = (distance, k = 0.22) => {
    const tmpAmp = k * distance ** 2 + 0.1;
    return Math.round(tmpAmp * 10) / 10;
  };

  const getCoordsForRoi = () => {
    // Determine if selected roi is from tremorData or pdData
    const [dataType, index] = roi.split('-');
    const data = dataType === 'tremor' ? tremorData : pdData;
    return data[parseInt(index, 10)].coords;
  };

  const getCoordsForAvoidRoi = () => {
    // Determine if selected roi is from tremorData or pdData
    const [dataType, index] = avoidRoi.split('-');
    const data = dataType === 'tremor' ? tremorData : pdData;
    return data[parseInt(index, 10)].coords;
  };

  const handleQuantityStateChange = (index, tmpAmp) => {
    console.log(stimParams);
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };
    const changedContact = index + 1;
    Object.keys(updatedQuantities).forEach((contact) => {
      if (parseFloat(contact) === 0) {
        return;
      }
      if (parseFloat(contact) === changedContact) {
        updatedSelectedValues[contact] = 'center';
        if (togglePosition === 'center') {
          updatedQuantities[contact] = tmpAmp;
        } else {
          updatedQuantities[contact] = 100;
        }
      } else {
        updatedQuantities[contact] = 0;
        updatedSelectedValues[contact] = 'left';
      }
    });
    setAmplitude(tmpAmp);
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  const handleQuantityStateChangeGroup = (indexList, tmpAmp, contactShare) => {
    console.log(stimParams);
    const updatedQuantities = { ...quantities };
    const updatedSelectedValues = { ...selectedValues };

    Object.keys(updatedQuantities).forEach((contact) => {
      if (parseFloat(contact) === 0) {
        return;
      }

      // Check if the contact is in the list of specified indexes
      if (indexList.includes(parseFloat(contact) - 1)) {
        updatedSelectedValues[contact] = 'center';
        updatedQuantities[contact] =
          togglePosition === 'center'
            ? tmpAmp * contactShare[parseFloat(contact - 1)]
            : 100 * contactShare[parseFloat(contact - 1)];
      } else {
        updatedQuantities[contact] = 0;
        updatedSelectedValues[contact] = 'left';
      }
    });
    setAmplitude(tmpAmp);
    setQuantities(updatedQuantities);
    setSelectedValues(updatedSelectedValues);
  };

  const cylinderSurfaceArea = (
    diameter = elspec.contact_diameter / 1000,
    height = elspec.contact_length / 1000,
    n_contacts = 1,
  ) => {
    const radius = diameter / 2;
    const contact_area = 2 * Math.PI * radius * height;
    const directional_area = contact_area / n_contacts;
    return directional_area;
  };

  const getCharge = (current, pulseWidth = 30) => {
    const currentInAmps = current * 1e-3;
    // Calculate charge (Q) in coulombs (C)
    const chargeInCoulombs = currentInAmps * pulseWidth * 1e-6;
    // Convert charge to microcoulombs (µC)
    const chargeInMicroCoulombs = chargeInCoulombs * 1e6;
    return chargeInMicroCoulombs;
  };

  const isSafeCharge = (Q, A, D, k = 1.5) => {
    const maxSafeCharge = A * 10 ** (k - Math.log10(D));
    // Check if the given charge per phase is below the safe threshold
    console.log('Q: ', Q);
    console.log('Max safe charge: ', maxSafeCharge);
    const isSafe = Q < maxSafeCharge;
    // Return both the boolean result and the max safe charge
    return { isSafe, maxSafeCharge };
  };

  const calculateAmps = (charge, pulsewidth) => {
    const chargeInCoulombs = charge * 1e-6;
    // Calculate current (I) in amps (A)
    const currentInAmps = (1e-6 * pulsewidth) / chargeInCoulombs;
    // Convert current to microamps (µA)
    const currentInMilliAmps = currentInAmps * 1e-6;
    return Math.round(currentInMilliAmps * 10) / 10;
  };

  const handleSafety = (amp) => {
    const contactSurfaceArea = cylinderSurfaceArea();
    const charge = getCharge(amp);
    const { isSafe, maxSafeCharge } = isSafeCharge(
      charge,
      contactSurfaceArea,
      30,
    );
    let newAmplitude = amp;
    console.log(isSafe);
    console.log(maxSafeCharge);
    if (!isSafe) {
      newAmplitude = calculateAmps(maxSafeCharge, 30);
    }
    return newAmplitude;
  };

  const handleSTNParameters = () => {
    const STNCoords = new THREE.Vector3(11.28, -13.92, -9.02);
    const bestQuantities = {};
    const bestAmplitude = amplitude; // Initial amplitude
    const minDistance = Infinity;

    const newCoords = [];

    let rotationAngle = 0;
    if (side < 5 && Object.keys(quantities).length > 6) {
      rotationAngle = recoData.directionality.roll_out_left - 60;
    } else {
      rotationAngle = recoData.directionality.roll_out_right - 120;
    }
    const rotationQuaternion = new THREE.Quaternion();
    rotationQuaternion.setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(rotationAngle),
    ); // Z-axis rotation

    Object.keys(contactDirections).forEach((contactId) => {
      console.log(togglePosition);
      let contactQuantity = parseFloat(quantities[contactId]);
      if (togglePosition === 'center') {
        const newQuantities = calculatePercentageFromAmplitude();
        contactQuantity = parseFloat(newQuantities[contactId]);
      }

      // If contactQuantity is greater than 0, add or update the sphere
      // Check if the sphere already exists in VTASpheresRef
      // if (!VTASpheresRef[contactId]) {
      // Calculate position and amplitude
      console.log('PLYViewer', quantities, keyLevels, contactDirections);
      const vectorLevel = keyLevels[contactId];
      const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
      const normalizedLevel = (clampedLevel - 1) / (4 - 1);

      let startCoords = [];
      let targetCoords = [];
      if (side < 5) {
        const { head2: headMarkers, tail2: tailMarkers } = recoData.markers;
        startCoords = new THREE.Vector3(...headMarkers);
        targetCoords = new THREE.Vector3(...tailMarkers);
      } else {
        const { head1: headMarkers, tail1: tailMarkers } = recoData.markers;
        startCoords = new THREE.Vector3(...headMarkers);
        targetCoords = new THREE.Vector3(...tailMarkers);
      }

      // Calculate the direction of the electrode
      const direction = new THREE.Vector3()
        .subVectors(targetCoords, startCoords)
        .normalize();

      // Create an orthogonal basis for the electrode
      const up = new THREE.Vector3(0, 0, 1); // Assuming 'up' is along the global Z-axis
      const right = new THREE.Vector3().crossVectors(direction, up).normalize();
      const forward = new THREE.Vector3()
        .crossVectors(right, direction)
        .normalize();

      // Linearly interpolate between startCoords and targetCoords based on normalizedLevel
      const newPosition = startCoords
        .clone()
        .lerp(targetCoords, normalizedLevel);

      // Get the direction adjustment for the contact
      // const directionOffset = contactDirections[contactId];

      // Get the direction offset for the contact
      const directionOffset = new THREE.Vector3(
        contactDirections[contactId].x,
        contactDirections[contactId].y,
        contactDirections[contactId].z,
      );

      // Apply the rotation to the directionOffset using the quaternion
      directionOffset.applyQuaternion(rotationQuaternion);

      // Apply the direction offset to the newPosition relative to the electrode’s orientation
      newPosition.x +=
        right.x * directionOffset.x +
        forward.x * directionOffset.y +
        direction.x * directionOffset.z;
      newPosition.y +=
        right.y * directionOffset.x +
        forward.y * directionOffset.y +
        direction.y * directionOffset.z;
      newPosition.z +=
        right.z * directionOffset.x +
        forward.z * directionOffset.y +
        direction.z * directionOffset.z;

      newCoords.push([newPosition.x, newPosition.y, newPosition.z]);
    });

    console.log('NewCoords: ', newCoords);
    setElecCoords(newCoords);
    console.log('Roi coords: ', getCoordsForRoi());
    const sweetspotCoord = getCoordsForRoi();
    const coordinateOutput = findNearestCoordinate(sweetspotCoord, newCoords);
    const activeContact = coordinateOutput.index;
    const activeAmplitude = calculateAmplitude(coordinateOutput.distance);
    console.log(coordinateOutput.distanceArray);
    console.log(activeAmplitude);
    console.log(activeContact);
    let finalAmplitude = activeAmplitude;
    if (activeAmplitude > 5) {
      finalAmplitude = handleSafety(activeAmplitude);
    }
    console.log(finalAmplitude);
    setStimParams({
      index: activeContact + 1,
      amplitude: finalAmplitude,
      distanceMaster: coordinateOutput.distanceArray,
    });
    const outputText = `Active Contact: ${
      names[activeContact + 1]
    }, Amplitude: ${finalAmplitude}`;
    setSolutionText(outputText);
    handleQuantityStateChange(activeContact, finalAmplitude);
  };

  const handleAddContacts = () => {
    console.log(stimParams);
    const newIndex = stimParams.distanceMaster[1].index;
    const newDistance = stimParams.distanceMaster[1].distance;
    const newAmplitude = calculateAmplitude(newDistance);
    console.log(newAmplitude);
    const newContact = newIndex + 1;
    const totalAmplitude = stimParams.amplitude + newAmplitude;
    console.log(stimParams.amplitude);
    console.log(totalAmplitude);
    const contactShare = {};
    contactShare[stimParams.distanceMaster[0].index] =
      stimParams.amplitude / totalAmplitude;
    contactShare[newIndex] = newAmplitude / totalAmplitude;
    console.log(contactShare);
    const outputAmplitude =
      totalAmplitude > 5 ? stimParams.amplitude : totalAmplitude;
    const outputText = `Active Contacts: ${
      names[stimParams.distanceMaster[0].index + 1]
    } and ${names[newContact]}, Amplitude: ${stimParams.amplitude}`;
    setSolutionText(outputText);
    handleQuantityStateChangeGroup(
      [stimParams.distanceMaster[0].index, newIndex],
      outputAmplitude,
      contactShare,
    );
  };

  const handleAvoidance = () => {
    // const avoidCoord = [12.73, -14.36, -6.7];
    // const avoidCoord = [7.3, -10.2, -11.7];
    const avoidCoord = getCoordsForAvoidRoi();
    const sweetspotCoord = getCoordsForRoi();
    const { bestIndex, rankedIndices, distance } = findOptimalCoordinate(
      sweetspotCoord,
      avoidCoord,
      elecCoords,
    );
    console.log(bestIndex);
    const newContact = bestIndex + 1;
    const outputText = `${names[newContact]}`;
    const newAmplitude = calculateAmplitude(distance);
    setSolutionText(outputText);
    const outputAmplitude =
      newAmplitude < 5 ? newAmplitude : stimParams.amplitude;
    // handleQuantityStateChange(bestIndex, stimParams.amplitude);
    handleQuantityStateChange(bestIndex, outputAmplitude);
  };

  const handleRoiChange = (event) => {
    console.log(event.target.value);
    setRoi(event.target.value);
  };

  const handleAvoidanceRoiChange = (event) => {
    console.log(event.target.value);
    setAvoidRoi(event.target.value);
  };
  /**
   * Validates input parameters for the optimizeSphereValues function.
   * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
   * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
   * @param {Array} L - Flattened landscape values, each row is [x, y, z, magnitude].
   * @throws {Error} - If any validation check fails.
   */
  // const validateInputs = (sphereCoords, v, L) => {
  //   // Check that all inputs are arrays
  //   if (!Array.isArray(sphereCoords)) {
  //     throw new Error('sphereCoords must be an array.');
  //   }
  //   if (!Array.isArray(v)) {
  //     throw new Error('v must be an array.');
  //   }
  //   if (!Array.isArray(L)) {
  //     throw new Error('L must be an array.');
  //   }

  //   // Check that arrays are not empty
  //   if (sphereCoords.length === 0) {
  //     throw new Error('sphereCoords array cannot be empty.');
  //   }
  //   if (v.length === 0) {
  //     throw new Error('v array cannot be empty.');
  //   }
  //   if (L.length === 0) {
  //     throw new Error('L array cannot be empty.');
  //   }

  //   // Check length consistency
  //   if (sphereCoords.length !== v.length) {
  //     throw new Error('sphereCoords and v must have the same length.');
  //   }

  //   // Check that at least one v is greater than 0.1
  //   const hasVOverThreshold = v.some(
  //     (value) => typeof value === 'number' && value > 0.1,
  //   );
  //   if (!hasVOverThreshold) {
  //     throw new Error(
  //       'At least one contact value in v must be greater than 0.1.',
  //     );
  //   }

  //   // Validate each sphere coordinate
  //   sphereCoords.forEach((coord, index) => {
  //     if (!Array.isArray(coord) || coord.length !== 3) {
  //       throw new Error(
  //         `sphereCoords[${index}] must be an array of three numeric values [x, y, z].`,
  //       );
  //     }
  //     coord.forEach((val, subIndex) => {
  //       if (typeof val !== 'number' || isNaN(val)) {
  //         throw new Error(
  //           `sphereCoords[${index}][${subIndex}] must be a valid number.`,
  //         );
  //       }
  //     });
  //   });

  //   // Validate each contact value
  //   v.forEach((value, index) => {
  //     if (typeof value !== 'number' || isNaN(value) || value < 0) {
  //       throw new Error(`v[${index}] must be a non-negative number.`);
  //     }
  //   });

  //   // Validate each landscape point
  //   L.forEach((point, index) => {
  //     if (!Array.isArray(point) || point.length !== 4) {
  //       throw new Error(
  //         `L[${index}] must be an array of four numeric values [x, y, z, magnitude].`,
  //       );
  //     }
  //     point.forEach((val, subIndex) => {
  //       if (typeof val !== 'number' || isNaN(val)) {
  //         throw new Error(`L[${index}][${subIndex}] must be a valid number.`);
  //       }
  //     });
  //   });
  // };

  // /**
  //  * Computes the radius of the sphere based on input millamps.
  //  * @param {number} milliamps - Input value used to compute the radius.
  //  * @returns {number} - Radius of the sphere.
  //  */
  // const computeRadius = (milliamps) => {
  //   const radius = (milliamps - 0.1) / 0.22;
  //   return milliamps > 0.1 ? math.sqrt(radius) : 0;
  // };

  // /**
  //  * Assigns values to the entire landscape based on the sphere's center and radius.
  //  * Uses vectorized operations with math.js for improved performance.
  //  * @param {Array} L - Array of points, each row is a point with each column being an [x, y, z, magnitude].
  //  * @param {Array} center - Center of the sphere [x0, y0, z0].
  //  * @param {number} r - Radius of the sphere.
  //  * @returns {Array} - Array of 0s and 1s representing whether each point lies inside the sphere.
  //  */
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
  //     math.map(dx, (value) => value ** 2), // Element-wise square for dx
  //     math.map(dy, (value) => value ** 2), // Element-wise square for dy
  //     math.map(dz, (value) => value ** 2), // Element-wise square for dz
  //   );

  //   const radiusSquared = r ** 2; // Faster to square the radius for comparison than to root every squared distance.

  //   // Perform element-wise comparison to get boolean array and convert to 0/1
  //   const insideSphere = math.smaller(distanceSquared, radiusSquared); // Gets booleans via inequality
  //   const sphereMask = math.multiply(insideSphere, 1); // Converts trues to 1s.
  //   return sphereMask;
  // };

  // /**
  //  * Calculates the dot product of the sphere assignment vector and the flattened landscape.
  //  * @param {Array} S - Sphere assignment vector.
  //  * @param {Array} L - Flattened landscape values array [x,y,z,magnitude]. Same organization of the above rows as points,
  //  *                      but with a single column being value at that point.
  //  *                      Each row should correspond with the row of the x,y,z in landscape for assignSphereValues
  //  * @returns {number} - Dot product result.
  //  */
  // const dotProduct = (S, L) => {
  //   console.log(S, L);
  //   const magnitudes = math.column(L, 3);
  //   return math.dot(S, magnitudes);
  // };

  // /**
  //  * Calculates the target function value T(r), which is the density of 'high' values inside a sphere.
  //  * @param {number} r - Radius of the sphere.
  //  * @param {Array} S_r - Sphere assignment vector.
  //  * @param {Array} L - Flattened landscape values.
  //  * @returns {number} - Target function value.
  //  */
  // const targetFunction = (S_r, L, weight = 100) => {
  //   return dotProduct(S_r, L) * weight;
  // };

  // /**
  //  * Computes the sum of the target function values for an array of possible sphere coordinates.
  //  * Only includes spheres where the corresponding value in v is non-zero.
  //  * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {Array} L - Flattened landscape values.
  //  * @returns {number} - Sum of the target function values for all valid spheres.
  //  */
  // const targetFunctionHandler = (sphereCoords, v, L) => {
  //   let sumTargetValue = 0;
  //   sphereCoords.forEach((center, index) => {
  //     if (v[index] > 0) {
  //       // Only compute if the corresponding v value is above 0.1 (which is minimum for VTA in our radius function)
  //       const r = computeRadius(v[index]); // the value at index is our amperage. that is related to radius.
  //       const S_r = assignSphereValues(L, center, r);
  //       const targetValue = targetFunction(S_r, L);
  //       sumTargetValue += targetValue;
  //     }
  //   });
  //   return sumTargetValue;
  // };

  // /**
  //  * Calculates the penalty for individual contacts. If contact current above 5mA, penalize.
  //  * @param {number} v - Contact value (milliamperages)
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {number} - Penalty value.
  //  */
  // const penaltyPerContact = (v, lambda) => lambda * Math.max(v - 0.1, 0);

  // /**
  //  * Handler function to compute the total penalty for a vector of contact values.
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {number} - Total penalty value for all contacts.
  //  */
  // const penaltyPerContactHandler = (v, lambda) => {
  //   return v.reduce((sum, value) => sum + penaltyPerContact(value, lambda), 0);
  // };

  // /**
  //  * Calculates the penalty across all  contacts. If total current above 6mA, penalize.
  //  * @param {Array} v - Array of contact values (milliamperages)
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {number} - Penalty value.
  //  */
  // const penaltyAllContacts = (v, lambda) =>
  //   lambda * math.max(math.sum(v) - 0.1, 0);

  // /**
  //  * Computes the loss function value.
  //  * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]). Organized like sphereCoords
  //  * @param {Array} L - Flattened landscape values.
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {number} - Loss function value.
  //  */
  // const lossFunction = (sphereCoords, v, L, lambda) => {
  //   const T = targetFunctionHandler(sphereCoords, v, L); // Compute the total target value across all relevant spheres
  //   const P1 = penaltyPerContactHandler(v, lambda); // Compute the penalty for individual contacts
  //   const P2 = penaltyAllContacts(v, lambda); // Compute the overall penalty for the sum of contact values
  //   return T - P1 - P2; // Return the loss function value
  // };

  // /**
  //  * Computes the difference quotient (numerical derivative) for a given element in the vector v.
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {number} lossCurrent - loss at the current array of v.
  //  * @param {number} index - Index of the element to compute the derivative for.
  //  * @param {number} h - Small step size for numerical differentiation.
  //  * @param {Array} sphereCoords - Array of sphere centers.
  //  * @param {Array} L - Flattened landscape values.
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {number} - Numerical derivative at the specified index.
  //  */
  // const partialDifferenceQuotient = (
  //   v,
  //   lossCurrent,
  //   index,
  //   h,
  //   sphereCoords,
  //   L,
  //   lambda,
  // ) => {
  //   const vForward = [...v]; // Create a copy of v
  //   vForward[index] += h; // Perturb (step forward) by h only for the variable v at index i
  //   const lossForward = lossFunction(sphereCoords, vForward, L, lambda);
  //   const partialDifference = (lossForward - lossCurrent) / h;
  //   return partialDifference;
  // };

  // /**
  //  * Computes the gradient vector of the loss function across all elements in v.
  //  * Uses the `partialDifferenceQuotient` function for numerical differentiation.
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {number} h - Small step size for numerical differentiation.
  //  * @param {Array} sphereCoords - Array of sphere centers.
  //  * @param {Array} L - Flattened landscape values.
  //  * @param {number} lambda - Penalty coefficient.
  //  * @returns {Array} - Gradient vector of the loss function.
  //  */
  // const gradientVectorHandler = (v, h, sphereCoords, L, lambda) => {
  //   const lossCurrent = lossFunction(sphereCoords, v, L, lambda); // Compute the current loss
  //   const gradientVector = v.map(
  //     (
  //       v_i,
  //       index, // Use `partialDifferenceQuotient` for each element in v to construct the gradient vector
  //     ) =>
  //       partialDifferenceQuotient(
  //         v,
  //         lossCurrent,
  //         index,
  //         h,
  //         sphereCoords,
  //         L,
  //         lambda,
  //       ),
  //   );
  //   console.log('Gradient vector: ', gradientVector);
  //   return gradientVector;
  // };

  // /**
  //  * Performs a single step of gradient ascent to update the contact values.
  //  * Uses the computed gradient vector to adjust each element of v in the direction of increasing the loss function.
  //  * @param {Array} gradientVector - The gradient vector of the loss function (numerical derivatives for each element of v).
  //  * @param {Array} v - Array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {number} alpha - Learning rate for gradient ascent (step size).
  //  * @returns {Array} - Updated array of contact values after the gradient ascent step.
  //  */
  // const gradientAscent = (gradientVector, v, alpha) => {
  //   // Use element-wise addition with math.js for efficient vector operation
  //   const updatedV = math.add(v, math.multiply(gradientVector, alpha));
  //   return updatedV.map((v_i) => Math.max(v_i, 0)); //do not allow amps below 0.
  // };

  const findClusters = (coordinates, epsilon) => {
    // Step 1: Filter for positive points
    const positivePoints = coordinates.filter(([x, y, z, r]) => r > 0);

    // Step 2: Helper to calculate Euclidean distance
    const calculateDistance = ([x1, y1, z1], [x2, y2, z2]) =>
      math.sqrt(
        math.pow(x1 - x2, 2) + math.pow(y1 - y2, 2) + math.pow(z1 - z2, 2),
      );

    // Step 3: Clustering algorithm
    const clusters = [];
    const visited = new Set();

    const growCluster = (startIndex) => {
      const cluster = [];
      const queue = [startIndex];

      while (queue.length > 0) {
        const currentIndex = queue.pop();
        if (visited.has(currentIndex)) continue;

        visited.add(currentIndex);
        const currentPoint = positivePoints[currentIndex];
        cluster.push(currentPoint);

        // Find neighbors within epsilon distance
        positivePoints.forEach((point, index) => {
          if (!visited.has(index)) {
            const distance = calculateDistance(
              currentPoint.slice(0, 3),
              point.slice(0, 3),
            );
            if (distance <= epsilon) {
              queue.push(index);
            }
          }
        });
      }

      return cluster;
    };

    // Step 4: Iterate through all points to form clusters
    positivePoints.forEach((point, index) => {
      if (!visited.has(index)) {
        const newCluster = growCluster(index);
        clusters.push(newCluster);
      }
    });

    // Step 5: Find the largest cluster
    const largestCluster = clusters.reduce(
      (largest, cluster) =>
        cluster.length > largest.length ? cluster : largest,
      [],
    );

    // Step 6: Compute averages for the largest cluster
    const total = largestCluster.reduce(
      (acc, [x, y, z, r]) => {
        acc.x += x;
        acc.y += y;
        acc.z += z;
        acc.r += r;
        return acc;
      },
      { x: 0, y: 0, z: 0, r: 0 },
    );

    const numPoints = largestCluster.length;

    const average = {
      x: total.x / numPoints,
      y: total.y / numPoints,
      z: total.z / numPoints,
      r: total.r / numPoints,
    };

    return {
      average,
      points: largestCluster, // The points in the largest cluster
    };
  };

  const filterBoxAroundSphere = (L, sphereCoords, boxSize, sphereIndex) => {
    // Extract the center of the box from the third sphere coordinate
    const [cx, cy, cz] = sphereCoords[sphereIndex];
    console.log(cx, cy, cz);
    console.log(L);
    // Define the half-size of the box (since the box is symmetric around the center)
    const halfBox = boxSize / 2;

    // Filter L based on the box boundaries
    const filteredL = L.filter(
      ([x, y, z]) =>
        x >= cx - halfBox &&
        x <= cx + halfBox &&
        y >= cy - halfBox &&
        y <= cy + halfBox &&
        z >= cz - halfBox &&
        z <= cz + halfBox,
    );

    console.log(`Filtered L size: ${filteredL.length}`);
    const epsilon = 2;
    const clusters = findClusters(filteredL, epsilon);
    console.log('Positive clusters: ', clusters);
    return { filteredL, clusters };
  };

  // /**
  //  * Orchestrates the optimization process using gradient ascent.
  //  *
  //  * STOP Rules
  //  * grad L1 norm     - not implemented
  //  * grad L2 norm     - not implemented
  //  * max iterations   - implemented
  //  * convergence      - not implemented
  //  * plateau dtxn     - not implemented
  //  *
  //  * NOTES:
  //  * Potential Logical Error: No safeguard against differing array lengths.
  //  * Ensure that sphereCoords and v are always of equal length to prevent unintended behavior.
  //  *
  //  * Performs a maximum of 100 iterations and includes placeholders for additional stopping rules.
  //  * @param {Array} sphereCoords - Array of sphere centers, each center is an [x, y, z] coordinate.
  //  * @param {Array} v - Initial guess for the array of contact values (e.g., [q1, q2, q3, q4]).
  //  * @param {Array} L - Flattened landscape values, an array of (n,m) where n is the points and m is 4 cols (x coord,y coord,z coord,magnitude)
  //  * @param {number} lambda - Penalty coefficient.
  //  * @param {number} alpha - Learning rate for gradient ascent (step size).
  //  * @param {number} h - Small step size for numerical differentiation.
  //  * @returns {Array} - Optimized array of contact values.
  //  */
  // const optimizeSphereValues = (
  //   sphereCoords,
  //   v,
  //   L,
  //   lambda = 10,
  //   alpha = 0.01,
  //   h = 0.05,
  // ) => {
  //   validateInputs(sphereCoords, v, L); // throw errors if inputs are incorrect.

  //   let currentV = [...v]; // Clone the initial guess for v
  //   let iteration = 0;
  //   const reducedL = filterBoxAroundSphere(L, sphereCoords, 20, 2);
  //   console.log(reducedL);
  //   setPlotNiiCoords(reducedL);
  //   while (iteration < 5) {
  //     //  allows 100 steps of 0.05mA changes (max of 5mA in total change)
  //     const gradientVector = gradientVectorHandler(
  //       currentV,
  //       h,
  //       sphereCoords,
  //       reducedL,
  //       lambda,
  //     ); // get gradient
  //     const updatedV = gradientAscent(gradientVector, currentV, alpha); // ascend gradient
  //     currentV = updatedV; // update
  //     iteration += 1; // increment
  //   }
  //   console.log(`Optimization completed after ${iteration} iterations.`);
  //   return currentV;
  // };

  const handleNiiMap = () => {
    const sphereCoords = elecCoords;
    console.log(elecCoords);
    // const v = [0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75];
    const v = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    // const v = [1, 1, 1, 1];
    const L = niiCoords;
    const { filteredL, clusters } = filterBoxAroundSphere(
      L,
      sphereCoords,
      20,
      2,
    );
    const reducedL = filteredL;
    // const reducedL = L;
    const normalizedPlotNiiCoords = reducedL.map(([x, y, z, r]) => {
      // Apply arctan normalization
      const normalizedR = Math.atan(r); // Normalize arctan(r) to [0, 1]
      // Return the updated coordinate array with normalized R
      return [x, y, z, normalizedR];
    });
    console.log(normalizedPlotNiiCoords);
    const sweetspotCoord = [
      clusters.average.x,
      clusters.average.y,
      clusters.average.z,
    ];
    const coordinateOutput = findNearestCoordinate(
      sweetspotCoord,
      sphereCoords,
    );
    const activeContact = coordinateOutput.index;
    const activeAmplitude = calculateAmplitude(coordinateOutput.distance);
    console.log(coordinateOutput.distanceArray);
    console.log(activeAmplitude);
    console.log(activeContact);
    let finalAmplitude = activeAmplitude;
    if (activeAmplitude > 5) {
      finalAmplitude = handleSafety(activeAmplitude);
    }
    console.log(finalAmplitude);
    if (finalAmplitude >= 4) {
      finalAmplitude = 3;
    }
    const totalAmplitude = 3.9; // Total amplitude to distribute
    const remainingAmplitude = totalAmplitude - finalAmplitude;

    // Number of indices to split the remaining amplitude across
    const otherContacts = v.length - 1;

    // Distribute remaining amplitude equally
    const equalAmplitude = remainingAmplitude / otherContacts;

    // Update the array
    const updatedV = v.map((value, index) =>
      index === activeContact ? finalAmplitude : equalAmplitude,
    );
    console.log(updatedV);
    setPlotNiiCoords(reducedL);
    // const reducedLJSON = JSON.stringify(normalizedPlotNiiCoords, null, 2);

    // // Create a Blob and download it
    // const blob = new Blob([reducedLJSON], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);

    // // Create a temporary anchor element to trigger the download
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'L.json'; // The name of the downloaded file
    // a.click();

    // // Clean up the URL object
    // URL.revokeObjectURL(url);
    const outputV = optimizeSphereValues(
      sphereCoords,
      updatedV,
      normalizedPlotNiiCoords,
    );
    console.log(outputV);
    // setNiiSolution(outputV);
  };

  const niiFile = useRef(null);

  const handleNiiButtonClick = () => {
    if (niiFile.current) {
      niiFile.current.click();
    }
  };

  const handleNiiUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        throw new Error('No file selected');
      }

      // Read the file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileData = e.target.result;

          // Validate if the file is a valid NIfTI file
          if (!nifti.isNIFTI(fileData)) {
            throw new Error('File is not a valid NIfTI file');
          }

          const header = nifti.readHeader(fileData);
          let image = nifti.readImage(header, fileData);

          // Ensure `image` is a valid ArrayBuffer
          if (!(image instanceof ArrayBuffer)) {
            console.log('Adjusting image to ArrayBuffer...');
            image = new Uint8Array(image).buffer;
          }

          // Handle endian mismatch
          if (!header.littleEndian) {
            console.warn('File is in big-endian format. Adjusting...');
            const dataView = new DataView(image);
            const correctedData = new Float32Array(image.byteLength / 4);
            for (let i = 0; i < correctedData.length; i++) {
              correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
            }
            image = correctedData;
          } else {
            image = new Float32Array(image);
          }

          // Apply scaling factors
          const { scl_slope = 1, scl_inter = 0 } = header;
          const img = new Float32Array(
            image.map((value) => value * scl_slope + scl_inter),
          );

          // Extract dimensions
          const dimensions = header.dims.slice(1, 4);
          console.log('Dimensions:', dimensions);

          // Generate voxel coordinates
          const voxelCoordinates = [];
          img.forEach((value, index) => {
            if (!isNaN(value)) {
              const z = Math.floor(index / (dimensions[0] * dimensions[1]));
              const y = Math.floor(
                (index % (dimensions[0] * dimensions[1])) / dimensions[0],
              );
              const x = index % dimensions[0];
              voxelCoordinates.push([x, y, z, value]);
            }
          });

          console.log('Voxel Coordinates:', voxelCoordinates);

          // Transform to MNI coordinates using affine matrix
          const affineMatrix = header.affine;
          const mniCoordinates = voxelCoordinates.map(([x, y, z, value]) => {
            const voxelHomogeneous = [x, y, z, 1]; // Add 1 for homogeneous transformation
            const transformedVoxels = math.multiply(
              affineMatrix,
              voxelHomogeneous,
            );
            const [wx, wy, wz] = transformedVoxels.slice(0, 3);
            return [wx, wy, wz, value];
          });

          console.log('MNI Coordinates:', mniCoordinates);

          // Set the state with the transformed coordinates
          setNiiCoords(mniCoordinates);
        } catch (error) {
          console.error('Error processing NIfTI file:', error);
        }
      };

      reader.onerror = () => {
        console.error('Failed to read file');
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error loading NIfTI file:', error);
    }
  };

  // useEffect(() => {
  //   const mainWindow = remote.getCurrentWindow();
  //   if (open) {
  //     // Increase the window height when the Collapse is open
  //     mainWindow.setSize(mainWindow.getSize()[0], mainWindow.getSize()[1] + 300);
  //   } else {
  //     // Decrease the window height when the Collapse is closed
  //     mainWindow.setSize(mainWindow.getSize()[0], mainWindow.getSize()[1] - 300);
  //   }
  // }, [open]);

  // useEffect(() => {
  //   // Example: Resize window to 1024x768 on component load
  //   window.electron.ipcRenderer.sendMessage('resize-window', 1024, 768);
  // }, []);

  // Don't forget this

  // useEffect(() => {
  //   window.electron.zoom.setZoomLevel(-3);
  // }, []);

  return (
    <div>
      {/* {!plyFile && (
        <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drag & drop a .ply file here</p>
        </div>
      )} */}
      <div style={viewerContainerStyle}>
        {/* <div ref={mountRef} /> */}
        {/* <Button onClick={changeCameraAngle}>View from top</Button> */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div ref={mountRef} />
          <div ref={secondaryMountRef} />
        </div>
        <Button
          variant="outline-secondary"
          onClick={() => setOpen(!open)}
          aria-controls="tabs-collapse"
          aria-expanded={open}
          style={{ marginBottom: '10px' }}
        >
          <SettingsIcon />
        </Button>
        {/* <button onClick={logCameraSettings}>Log Camera Settings</button>
        <button onClick={changeCameraAngle}>Change Camera</button> */}

        <Collapse in={open}>
          <div id="tabs-collapse">
            <Tabs
              defaultActiveKey="meshes"
              id="mesh-controls-tab"
              className="mb-3"
            >
              {/* Tab for Meshes */}
              <Tab eventKey="meshes" title="Meshes">
                <div style={controlPanelStyle}>
                  {meshes.map((mesh, index) => (
                    <div key={mesh.name} style={meshControlStyle}>
                      <h5 style={meshNameStyle}>{mesh.name}</h5>
                      <h3 style={{ fontSize: '12px' }}>Visibility</h3>
                      <Form.Check
                        type="switch"
                        checked={meshProperties[mesh.name]?.visible}
                        onChange={() => handleVisibilityChange(mesh.name)}
                      />
                      <h3 style={{ fontSize: '12px' }}>Opacity</h3>
                      <Form.Range
                        min={0}
                        max={1}
                        step={0.01}
                        value={meshProperties[mesh.name]?.opacity || 0.8}
                        onChange={(e) =>
                          handleOpacityChange(
                            mesh.name,
                            parseFloat(e.target.value),
                          )
                        }
                        style={{ width: '150px' }}
                      />
                    </div>
                  ))}
                </div>
              </Tab>

              {/* Tab for Atlases */}
              <Tab eventKey="atlases" title="Atlases">
                <div style={controlPanelStyle2}>
                  <select
                    onChange={handleFileChange}
                    multiple
                    style={{ height: '500px', width: '300px' }}
                  >
                    {plyFiles.map((file, index) => (
                      <option key={index} value={index}>
                        {file.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Tab>
              <Tab eventKey="priorStims" title="Patient Database">
                <div style={controlPanelStyle2}>
                  <select
                    onChange={handlePriorStimChange}
                    multiple
                    style={{ height: '500px', width: '300px' }}
                  >
                    {priorStims &&
                      Object.keys(priorStims).map((patientId, index) => (
                        <optgroup key={index} label={patientId}>
                          {priorStims[patientId].map(
                            (session, sessionIndex) => (
                              <option
                                key={`${patientId}-${sessionIndex}`}
                                value={`${patientId}-${session}`}
                              >
                                {session}
                              </option>
                            ),
                          )}
                        </optgroup>
                      ))}
                  </select>
                </div>
              </Tab>

              {/* Tab for Sweetspots with nested tabs */}
              <Tab eventKey="sweetspots" title="Sweetspots">
                <Tabs defaultActiveKey="tremor" id="nested-tabs-inside">
                  <Tab eventKey="tremor" title="Tremor">
                    <div style={controlPanelStyle2}>
                      <select
                        onChange={handleTremorChange}
                        multiple
                        style={{ height: '500px', width: '300px' }}
                      >
                        {tremorData.map((tremor, index) => (
                          <option key={index} value={index}>
                            {tremor.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="primary"
                        onClick={() => setShowModal(true)}
                      >
                        Add Coordinates
                      </Button>
                      <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Add New Coordinates</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newTremor.name}
                            onChange={handleNewTremorChange}
                            className="form-control"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="X"
                            value={newTremor.coords[0]}
                            onChange={(e) =>
                              setNewTremor({
                                ...newTremor,
                                coords: [
                                  e.target.value,
                                  newTremor.coords[1],
                                  newTremor.coords[2],
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="Y"
                            value={newTremor.coords[1]}
                            onChange={(e) =>
                              setNewTremor({
                                ...newTremor,
                                coords: [
                                  newTremor.coords[0],
                                  e.target.value,
                                  newTremor.coords[2],
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="Z"
                            value={newTremor.coords[2]}
                            onChange={(e) =>
                              setNewTremor({
                                ...newTremor,
                                coords: [
                                  newTremor.coords[0],
                                  newTremor.coords[1],
                                  e.target.value,
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                          >
                            Close
                          </Button>
                          <Button variant="primary" onClick={addNewTremor}>
                            Add
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </Tab>
                  <Tab eventKey="pd" title="PD">
                    <div style={controlPanelStyle2}>
                      <select
                        onChange={handlePDChange}
                        multiple
                        style={{ height: '500px', width: '300px' }}
                      >
                        {pdData.map((tremor, index) => (
                          <option key={index} value={index}>
                            {tremor.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="primary"
                        onClick={() => setShowPDModal(true)}
                      >
                        Add Coordinates
                      </Button>
                      <Modal
                        show={showPDModal}
                        onHide={() => setShowPDModal(false)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Add New Coordinates</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newPD.name}
                            onChange={handleNewPDChange}
                            className="form-control"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="X"
                            value={newPD.coords[0]}
                            onChange={(e) =>
                              setNewPD({
                                ...newPD,
                                coords: [
                                  e.target.value,
                                  newPD.coords[1],
                                  newPD.coords[2],
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="Y"
                            value={newPD.coords[1]}
                            onChange={(e) =>
                              setNewTremor({
                                ...newPD,
                                coords: [
                                  newPD.coords[0],
                                  e.target.value,
                                  newPD.coords[2],
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                          <input
                            type="number"
                            name="coords"
                            placeholder="Z"
                            value={newPD.coords[2]}
                            onChange={(e) =>
                              setNewTremor({
                                ...newPD,
                                coords: [
                                  newPD.coords[0],
                                  newPD.coords[1],
                                  e.target.value,
                                ],
                              })
                            }
                            className="form-control mt-2"
                          />
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowPDModal(false)}
                          >
                            Close
                          </Button>
                          <Button variant="primary" onClick={addNewPD}>
                            Add
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </Tab>
                </Tabs>
              </Tab>
              <Tab eventKey="solution" title="Automatic Solution">
                <div>
                  <h3 style={{ fontSize: '14px' }}>Optimize for:</h3>
                  <select
                    id="options"
                    style={{ width: '200px' }}
                    value={roi}
                    onChange={handleRoiChange}
                  >
                    <optgroup label="Tremor Data">
                      {tremorData.map((tremor, index) => (
                        <option
                          key={`tremor-${index}`}
                          value={`tremor-${index}`}
                        >
                          {tremor.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="PD Data">
                      {pdData.map((pd, index) => (
                        <option key={`pd-${index}`} value={`pd-${index}`}>
                          {pd.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div>
                    <Button variant="primary" onClick={handleSTNParameters}>
                      Provide Solution
                    </Button>
                  </div>
                  <h3 style={{ fontSize: '14px' }}>Avoid:</h3>
                  <select
                    id="options"
                    style={{ width: '200px' }}
                    value={avoidRoi}
                    onChange={handleAvoidanceRoiChange}
                  >
                    <optgroup label="Tremor Data">
                      {tremorData.map((tremor, index) => (
                        <option
                          key={`tremor-${index}`}
                          value={`tremor-${index}`}
                        >
                          {tremor.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="PD Data">
                      {pdData.map((pd, index) => (
                        <option key={`pd-${index}`} value={`pd-${index}`}>
                          {pd.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    {/* <Button variant="primary" onClick={handleSTNParameters}>
                      Provide Solution
                    </Button> */}
                    <Button variant="primary" onClick={handleAddContacts}>
                      Add Contact
                    </Button>
                    <Button variant="primary" onClick={handleAvoidance}>
                      Avoid
                    </Button>
                    <Button variant="primary" onClick={handleNiiMap}>
                      Test Nii Coords
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => document.getElementById('nifti-upload').click()}
                      className="mb-4 mx-2"
                    >
                      Import NIfTI File
                    </Button>
                    <input
                      id="nifti-upload"
                      type="file"
                      style={{ display: 'none' }}
                      accept=".nii"
                      onChange={(e) => handleNiiUpload(e)}
                    />
                    {/* <span>{solutionText}</span> */}
                    <span>{niiSolution}</span>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

const dropzoneStyle = {
  // width: '100%',
  height: '150px',
  border: '3px dashed #007bff',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  marginBottom: '20px',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const viewerContainerStyle = {
  display: 'flex',
  flexDirection: 'row', // Ensures that the viewer and controls are side-by-side
  alignItems: 'flex-start', // Align the controls to the top of the viewer
  justifyContent: 'space-between',
  height: '100%', // Adjust to fit the full height of the container
  width: '100%',
};

const viewerStyle = {
  flexGrow: 1, // Allow the viewer to take up most of the space
  height: '600px', // Fixed height, adjust as necessary
  border: '1px solid #ccc',
  marginRight: '20px', // Adds space between viewer and control panel
};

const controlPanelStyle2 = {
  display: 'flex',
  flexDirection: 'column', // Stack controls vertically
  // maxHeight: '600px', // Matches the height of the viewer
  // overflowY: 'auto', // Allows scrolling if controls exceed height
  width: '300px', // Fixed width for the control panel
  height: '600px',
  padding: '10px',
  backgroundColor: '#f8f9fa',
};

const controlPanelStyle = {
  display: 'flex',
  flexDirection: 'column', // Stack controls vertically
  maxHeight: '600px', // Matches the height of the viewer
  overflowY: 'auto', // Allows scrolling if controls exceed height
  width: '300px', // Fixed width for the control panel
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f8f9fa',
};

const meshControlStyle = {
  marginBottom: '20px', // Space between each mesh control
};

const meshNameStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px', // Add space below the mesh name
};

export default PlyViewer;

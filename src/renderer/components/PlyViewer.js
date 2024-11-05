import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
import * as nifti from 'nifti-reader-js'; // Correctly importing the nifti module
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import { Tabs, Tab, Collapse, Button, Form, Modal } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings'; // Material UI settings icon

function PlyViewer({
  quantities,
  amplitude,
  side,
  historical,
  togglePosition,
  tab,
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

  useEffect(() => {
    // This loads in the combined electrodes for the selected patient
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-test-file',
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
        addMeshToScene('Test OSS VTA', geometry, material);
      } catch (error) {
        console.error('Error loading PLY file:', error);
      }
    };

    loadPlyFile(); // Call the async function
  }, []);

  // New states for visibility and thresholding
  const [meshVisibility, setMeshVisibility] = useState({});
  const [meshOpacity, setMeshOpacity] = useState({});
  const [threshold, setThreshold] = useState(0.5); // Example thresholding value

  const [newTremor, setNewTremor] = useState({ name: '', coords: [0, 0, 0] });
  const [showModal, setShowModal] = useState(false);
  const [tremorData, setTremorData] = useState([
    { name: 'Papavassilliou et al', coords: [-14.5, -17.7, -2.8] },
    { name: 'Hamel et al', coords: [-13.79, -18.04, -1.06] },
    { name: 'Herzog et al', coords: [-14.04, -16.66, -2.92] },
    { name: 'Blomstedt et al', coords: [-12.61, -17.24, -0.28] },
    { name: 'Barbe et al', coords: [-12.31, -18.2, -1.26] },
    { name: 'Sandvik et al', coords: [-13.77, -12.56, 1.5] },
    { name: 'Sandvik et al2', coords: [-13.11, -16.53, -1.61] },
    { name: 'Fytagoridis et al', coords: [-12.93, -17.17, -0.62] },
    { name: 'Cury et al', coords: [-14.91, -4.47, -5.88] },
    { name: 'Fiechter et al', coords: [-15.36, -16.3, -3.89] },
    { name: 'Barbe et al2', coords: [-11.97, -16.64, -0.86] },
    { name: 'Nowacki et al', coords: [-11.51, -16.04, 0.6] },
    { name: 'Nowacki et al2', coords: [-13.75, -14.77, -3.1] },
    { name: 'Philipson et al', coords: [-13.03, -18.4, -1.91] },
    { name: 'Tsuboi et al', coords: [-15.35, -15.34, -0.51] },
    { name: 'Elias et al', coords: [-17.3, -13.9, 4.2] },
    { name: 'Tsuboi et al2', coords: [-15.0, -17.0, 1.0] },
    { name: 'Middlebrooks et al', coords: [-15.5, -15.5, 0.5] },
  ]);

  // Handle input change for new tremor data
  const handleNewTremorChange = (e) => {
    const { name, value } = e.target;
    setNewTremor((prev) => ({
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
      const focalPoint = new THREE.Vector3(startCoords.x, camera.position.y, camera.position.z);
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

  // useEffect(() => {
  //   // Example: Resize window to 1024x768 on component load
  //   window.electron.ipcRenderer.sendMessage('resize-window', 1024, 768);
  // }, []);

  // Don't forget this

  useEffect(() => {
    window.electron.zoom.setZoomLevel(-3);
  }, []);

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
                  <select onChange={handleFileChange} multiple>
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
                  <select onChange={handlePriorStimChange} multiple>
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
                      <select onChange={handleTremorChange} multiple>
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
                      <h4>Coordinates...</h4>
                    </div>
                  </Tab>
                </Tabs>
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
  // display: 'flex',
  // flexDirection: 'column', // Stack controls vertically
  // height: '600px', // Matches the height of the viewer
  // // overflowY: 'auto', // Allows scrolling if controls exceed height
  // width: '300px', // Fixed width for the control panel
  // backgroundColor: '#f8f9fa',
  display: 'flex',
  flexDirection: 'column', // Stack controls vertically
  maxHeight: '600px', // Matches the height of the viewer
  overflowY: 'auto', // Allows scrolling if controls exceed height
  width: '300px', // Fixed width for the control panel
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

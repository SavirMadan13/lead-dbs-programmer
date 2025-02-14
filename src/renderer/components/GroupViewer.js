import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
// import * as nifti from 'nifti-reader-js'; // Correctly importing the nifti module
import * as nifti from 'nifti-reader-js';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import {
  Tabs,
  Tab,
  Collapse,
  Button,
  Form,
  Modal,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings'; // Material UI settings icon
import * as math from 'mathjs';
// import { remote } from 'electron'; // Use 'electron' for Electron v12+

function GroupViewer({
  filteredPatients,
  directoryPath,
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
  const [open, setOpen] = useState(true);
  const [recoData, setRecoData] = useState(null);
  const [elecCoords, setElecCoords] = useState(null);
  const [roi, setRoi] = useState('tremor-0');
  const [avoidRoi, setAvoidRoi] = useState('tremor-0');
  const [niiCoords, setNiiCoords] = useState(null);
  const [plotNiiCoords, setPlotNiiCoords] = useState({});
  const [niiSolution, setNiiSolution] = useState('');
  // Thresholding/Modification stuff

  // Don't forget **********************
  // useEffect(() => {
  //   // This loads in the combined electrodes for the selected patient
  //   const loadPlyFile = async () => {
  //     try {
  //       const fileData = await window.electron.ipcRenderer.invoke(
  //         'load-ply-file',
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
  //       addMeshToScene('Electrode Scene', geometry, material);
  //     } catch (error) {
  //       console.error('Error loading PLY file:', error);
  //     }
  //   };

  //   loadPlyFile(); // Call the async function
  // }, []);

  useEffect(() => {
    // This loads the anatomy.ply scene
    const loadPlyFile = async () => {
      const historical = {
        patient: filteredPatients[0],
        timeline: 'none',
        directoryPath,
        leadDBS: true,
      };
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

  // useEffect(() => {
  //   // Gathers atlases
  //   const fetchPlyFiles = async () => {
  //     try {
  //       // Request the PLY file paths from the main process using invoke/handle
  //       const files = await window.electron.ipcRenderer.invoke('get-ply-files');
  //       // Store both the file name and the full path in the state
  //       const fileData = files.map((file) => ({
  //         name: file.fileName.split('/').pop(), // Extract the atlas name from the path
  //         path: file.filePath, // Store the full path
  //       }));
  //       console.log(fileData);
  //       setPlyFiles(fileData);
  //     } catch (error) {
  //       console.error('Error fetching PLY files:', error);
  //     }
  //   };

  //   fetchPlyFiles();
  // }, []); // Empty dependency array ensures this runs only on mount

  const [priorStims, setPriorStims] = useState(null);

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
  };

  function getRandomColor() {
    return Math.floor(Math.random() * 16777215); // Generate a random number between 0 and 0xFFFFFF
  }

  const handlePriorStimChange = async (outputPatientID) => {
    const electrodeLoader = new PLYLoader();
    const anatomyLoader = new PLYLoader();

    try {
      // Load and parse the PLY file from Electron's IPC
      const fileData = await window.electron.ipcRenderer.invoke(
        'load-reconstruction',
        // selectedPatientID,
        // selectedSession,
        outputPatientID,
        directoryPath,
      );
      const electrodeGeometry = electrodeLoader.parse(
        fileData.combinedElectrodesPly,
      );
      console.log('ELECTRODE GEOMETRY: ', electrodeGeometry);
      console.log('Output patient id: ', outputPatientID);
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
        `${outputPatientID}-electrodes`,
        electrodeGeometry,
        material,
      );
      // addMeshToScene(`${selectedPatientID}-electrodes`)
    } catch (error) {
      console.error('Error loading PLY file:', error);
    }
  };

  useEffect(() => {
    console.log('Filtered patients: ', filteredPatients);
    if (sceneRef.current && mountRef.current) {
      // Remove all previously rendered patients
      sceneRef.current.children = sceneRef.current.children.filter(
        (child) => !child.name.includes('-electrodes')
      );

      // Render the filtered patients
      filteredPatients.forEach((patient) => {
        handlePriorStimChange(patient.id);
      });
    }
  }, [filteredPatients]);

  // useEffect(() => {
  //   if (mountRef.current && secondaryMountRef.current) {
  //     // Initialize scene, camera, and renderer only once
  //     const scene = new THREE.Scene();
  //     sceneRef.current = scene; // Save scene reference
  //     scene.background = new THREE.Color(0xffffff); // White background

  //     // Create an OrthographicCamera
  //     const aspect = 500 / 500;
  //     const frustumSize = 45; // Adjust this value to control zoom
  //     const camera = new THREE.OrthographicCamera(
  //       (frustumSize * aspect) / -2, // left
  //       (frustumSize * aspect) / 2, // right
  //       frustumSize / 2, // top
  //       frustumSize / -2, // bottom
  //       0.1, // near plane
  //       1000, // far plane
  //     );

  //     // Secondary Camera Setup
  //     const secondaryWidth = 500;
  //     const secondaryHeight = 250; // Adjust height as needed
  //     const aspectSecondary = secondaryWidth / secondaryHeight;
  //     const secondaryFrustumHeight = frustumSize; // Set a smaller height for the secondary view
  //     const secondaryCamera = new THREE.OrthographicCamera(
  //       (secondaryFrustumHeight * aspectSecondary) / -2,
  //       (secondaryFrustumHeight * aspectSecondary) / 2,
  //       secondaryFrustumHeight / 2,
  //       secondaryFrustumHeight / -2,
  //       0.1,
  //       1000,
  //     );
  //     secondaryCamera.position.set(50, 50, 100);
  //     secondaryCamera.lookAt(0, 0, 0);

  //     // const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000); // 1 is the aspect ratio (square)
  //     const renderer = new THREE.WebGLRenderer({ antialias: true });
  //     // renderer.setSize(300, 600); // Set smaller size
  //     renderer.setSize(500, 500);
  //     mountRef.current.appendChild(renderer.domElement);

  //     const secondaryRenderer = new THREE.WebGLRenderer({ antialias: true });
  //     secondaryRenderer.setSize(500, 250);
  //     secondaryMountRef.current.appendChild(secondaryRenderer.domElement);

  //     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //     scene.add(ambientLight);

  //     const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  //     directionalLight.position.set(5, 5, 5).normalize();
  //     scene.add(directionalLight);

  //     // OrbitControls setup (only initialize once)
  //     const controls = new OrbitControls(camera, renderer.domElement);
  //     controls.enableDamping = true;
  //     controls.dampingFactor = 0.1;
  //     controls.rotateSpeed = 0.8;
  //     controls.zoomSpeed = 0.5;
  //     controlsRef.current = controls;

  //     camera.position.set(0, -50, 50); // Zoomed out to start

  //     rendererRef.current = renderer;
  //     secondaryCameraRef.current = secondaryCamera;
  //     secondaryRendererRef.current = secondaryRenderer;
  //     cameraRef.current = camera;

  //     const animate = () => {
  //       requestAnimationFrame(animate);
  //       controls.update(); // Update OrbitControls
  //       renderer.render(sceneRef.current, camera);
  //       secondaryRenderer.render(scene, secondaryCamera);
  //     };
  //     animate();

  //     return () => {
  //       // window.removeEventListener('resize', onWindowResize);
  //       renderer.dispose();
  //     };
  //   }
  // }, []);


  useEffect(() => {
    if (mountRef.current) {
      // Initialize scene, camera, and renderer only once
      const scene = new THREE.Scene();
      sceneRef.current = scene; // Save scene reference
      scene.background = new THREE.Color(0xffffff); // White background

      // Create an OrthographicCamera
      const aspect = 500 / 500;
      const frustumSize = 45; // Adjust this value to control zoom
      const camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2, // left
        (frustumSize * aspect) / 2, // right
        frustumSize / 2, // top
        frustumSize / -2, // bottom
        0.1, // near plane
        1000, // far plane
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(500, 500);
      mountRef.current.appendChild(renderer.domElement);

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

      camera.position.set(0, -50, 50); // Zoomed out to start

      rendererRef.current = renderer;
      cameraRef.current = camera;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update OrbitControls
        renderer.render(sceneRef.current, camera);
      };
      animate();

      return () => {
        renderer.dispose();
      };
    }
  }, []);

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

  const [searchCoordinate, setSearchCoordinate] = useState('');
  const [matchingAtlases, setMatchingAtlases] = useState([]);

  // load-ply-file-2 is basically jsust used for the coordinate within which atlas functionality
  const handleCoordinateSearch = async () => {
    if (!searchCoordinate) {
      alert('Please enter a valid coordinate.');
      return;
    }

    // Parse the coordinate input (assuming comma-separated x, y, z)
    const [x, y, z] = searchCoordinate.split(',').map(Number);
    if ([x, y, z].some(isNaN)) {
      alert('Please enter valid numeric coordinates in the format x,y,z.');
      return;
    }

    const loader = new PLYLoader();
    const matchingFiles = [];

    const fileData = await window.electron.ipcRenderer.invoke(
      'load-ply-file-2',
      '',
    );

    const niiFilesPassed = [];

    console.log('fileData: ', fileData);

    const checkCoord = (path, fileBuffer) => {
      const header = nifti.readHeader(fileBuffer);
      let image = nifti.readImage(header, fileBuffer);
      console.log(image);
      console.log('Header: ', header);
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
        if (image.byteLength % 4 !== 0) {
          const padding = 4 - (image.byteLength % 4);
          const paddedArray = new Uint8Array(image.byteLength + padding);
          paddedArray.set(new Uint8Array(image));
          image = paddedArray.buffer;
        }
        image = new Float32Array(image);
      }
      // Apply scaling factors
      const { scl_slope = 1, scl_inter = 0 } = header;
      const img = new Float32Array(
        image.map((value) => value * scl_slope + scl_inter),
      );

      // Extract dimensions
      const dimensions = header.dims.slice(1, 4);

      // Generate voxel coordinates
      const voxelCoordinates = [];
      const threshold = 0.5; // Define your threshold value here
      img.forEach((value, index) => {
        if (!Number.isNaN(value)) {
          const z = Math.floor(index / (dimensions[0] * dimensions[1]));
          const y = Math.floor(
            (index % (dimensions[0] * dimensions[1])) / dimensions[0],
          );
          const x = index % dimensions[0];
          // const binarizedValue = value >= threshold ? 1 : 0; // Binarize the value based on the threshold
          voxelCoordinates.push([x, y, z, value]);
        }
      });
      const affineMatrix = header.affine;
      const inverseAffineMatrix = math.inv(affineMatrix);
      const newSearchCoordinate = [
        parseFloat(searchCoordinate.split(',')[0]),
        parseFloat(searchCoordinate.split(',')[1]),
        parseFloat(searchCoordinate.split(',')[2]),
        1,
      ];
      console.log(searchCoordinate);
      console.log(newSearchCoordinate);
      const transformedCoordinates = math.multiply(
        inverseAffineMatrix,
        newSearchCoordinate,
      );

      console.log(transformedCoordinates);
      const roundedCoordinates = transformedCoordinates.map((coord) =>
        Math.round(coord),
      );
      console.log(roundedCoordinates);
      // Find the value of the roundedCoordinates in voxelCoordinates
      const [roundedX, roundedY, roundedZ] = roundedCoordinates;
      console.log(roundedX, roundedY, roundedZ);
      Object.keys(voxelCoordinates).forEach((key) => {
        if (
          voxelCoordinates[key][0] === roundedX &&
          voxelCoordinates[key][1] === roundedY &&
          voxelCoordinates[key][2] === roundedZ
        ) {
          console.log('Found: ', voxelCoordinates[key][3]);
        }
      });

      const findVoxelValue = (targetX, targetY, targetZ) => {
        // Find the index of the voxel with the specified coordinates
        const index = voxelCoordinates.findIndex(
          ([x, y, z]) => x === targetX && y === targetY && z === targetZ,
        );

        // If the voxel is found, return the value; otherwise, return null or an appropriate message
        if (index !== -1) {
          return voxelCoordinates[index][3]; // Assuming the value is at the 4th position
        }
        return null; // Or handle the case where the voxel is not found
      };

      const value = findVoxelValue(
        roundedX,
        roundedY,
        roundedZ,
        voxelCoordinates,
      );
      console.log('Value at rounded coordinates:', value);

      const matchingVoxel = voxelCoordinates.find((voxel) => {
        const [x, y, z] = voxel;
        return x === roundedX && y === roundedY && z === roundedZ;
      });
      console.log(matchingVoxel);
      if (matchingVoxel) {
        const value = matchingVoxel[3];
        console.log('Value at rounded coordinates:', value);
      } else {
        // If no exact match is found, find the nearest neighbor
        const findNearestNeighbor = (target, coordinates) => {
          let nearest = null;
          let minDistance = Infinity;

          coordinates.forEach(([x, y, z, value]) => {
            const distance = Math.sqrt(
              (x - target[0]) ** 2 +
                (y - target[1]) ** 2 +
                (z - target[2]) ** 2,
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearest = [x, y, z, value];
            }
          });

          return nearest;
        };

        const nearestVoxel = findNearestNeighbor(
          roundedCoordinates,
          voxelCoordinates,
        );

        if (nearestVoxel) {
          const value = nearestVoxel[3];
          if (value !== 0) {
            niiFilesPassed.push(path);
          }
          console.log('Value at nearest coordinates:', value);
        } else {
          console.log('No nearby voxel found.');
        }
      }
      console.log(matchingFiles);
    };

    const processFile = async (file) => {
      const { filePath } = file;
      const fileBuffer = await window.electron.ipcRenderer.invoke(
        'load-file-buffer',
        filePath,
      );
      console.log('filePath: ', filePath);
      checkCoord(filePath, fileBuffer);
    };

    const processFilesSequentially = async () => {
      for (const file of fileData) {
        const {fileName } = file;
        if (fileName !== 'gm_mask.nii.gz') {
          await processFile(file);
        }
      }
    };

    // Call the function to process files one at a time
    processFilesSequentially(fileData);

    // await Promise.all(
    //   fileData.map(async (file) => {
    //     const { filePath } = file;
    //     const fileBuffer = await window.electron.ipcRenderer.invoke(
    //       'load-file-buffer',
    //       filePath,
    //     );
    //     console.log('filePath: ', filePath);
    //     checkCoord(filePath, fileBuffer);
    //   }),
    // );
    console.log('niiFilesPassed: ', niiFilesPassed);
    // const header = nifti.readHeader(fileData);
    // let image = nifti.readImage(header, fileData);
    // console.log(image);
    // console.log('Header: ', header);
    // // Ensure `image` is a valid ArrayBuffer
    // if (!(image instanceof ArrayBuffer)) {
    //   console.log('Adjusting image to ArrayBuffer...');
    //   image = new Uint8Array(image).buffer;
    // }

    // // Handle endian mismatch
    // if (!header.littleEndian) {
    //   console.warn('File is in big-endian format. Adjusting...');
    //   const dataView = new DataView(image);
    //   const correctedData = new Float32Array(image.byteLength / 4);
    //   for (let i = 0; i < correctedData.length; i++) {
    //     correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
    //   }
    //   image = correctedData;
    // } else {
    //   if (image.byteLength % 4 !== 0) {
    //     const padding = 4 - (image.byteLength % 4);
    //     const paddedArray = new Uint8Array(image.byteLength + padding);
    //     paddedArray.set(new Uint8Array(image));
    //     image = paddedArray.buffer;
    //   }
    //   image = new Float32Array(image);
    // }
    // console.log(image);
    // // Apply scaling factors
    // const { scl_slope = 1, scl_inter = 0 } = header;
    // const img = new Float32Array(
    //   image.map((value) => value * scl_slope + scl_inter),
    // );

    // // Extract dimensions
    // const dimensions = header.dims.slice(1, 4);
    // console.log('Dimensions:', dimensions);

    // // Generate voxel coordinates
    // const voxelCoordinates = [];
    // const threshold = 0.5; // Define your threshold value here
    // img.forEach((value, index) => {
    //   if (!Number.isNaN(value)) {
    //     const z = Math.floor(index / (dimensions[0] * dimensions[1]));
    //     const y = Math.floor(
    //       (index % (dimensions[0] * dimensions[1])) / dimensions[0],
    //     );
    //     const x = index % dimensions[0];
    //     // const binarizedValue = value >= threshold ? 1 : 0; // Binarize the value based on the threshold
    //     voxelCoordinates.push([x, y, z, value]);
    //   }
    // });
    // console.log(voxelCoordinates);
    // const affineMatrix = header.affine;
    // const inverseAffineMatrix = math.inv(affineMatrix);
    // const newSearchCoordinate = [
    //   parseFloat(searchCoordinate.split(',')[0]),
    //   parseFloat(searchCoordinate.split(',')[1]),
    //   parseFloat(searchCoordinate.split(',')[2]),
    //   1,
    // ];
    // console.log(searchCoordinate);
    // console.log(newSearchCoordinate);
    // const transformedCoordinates = math.multiply(
    //   inverseAffineMatrix,
    //   newSearchCoordinate,
    // );

    // console.log(transformedCoordinates);
    // const roundedCoordinates = transformedCoordinates.map((coord) =>
    //   Math.round(coord),
    // );
    // console.log(roundedCoordinates);
    // // Find the value of the roundedCoordinates in voxelCoordinates
    // const [roundedX, roundedY, roundedZ] = roundedCoordinates;
    // console.log(roundedX, roundedY, roundedZ);
    // Object.keys(voxelCoordinates).forEach((key) => {

    //   if (voxelCoordinates[key][0] === roundedX && voxelCoordinates[key][1] === roundedY && voxelCoordinates[key][2] === roundedZ) {
    //     console.log('Found: ', voxelCoordinates[key][3]);
    //   }
    // });

    // const findVoxelValue = (targetX, targetY, targetZ) => {
    //   // Find the index of the voxel with the specified coordinates
    //   const index = voxelCoordinates.findIndex(([x, y, z]) => x === targetX && y === targetY && z === targetZ);

    //   // If the voxel is found, return the value; otherwise, return null or an appropriate message
    //   if (index !== -1) {
    //     return voxelCoordinates[index][3]; // Assuming the value is at the 4th position
    //   } else {
    //     return null; // Or handle the case where the voxel is not found
    //   }
    // };

    // const value = findVoxelValue(roundedX, roundedY, roundedZ, voxelCoordinates);
    // console.log('Value at rounded coordinates:', value);

    // const matchingVoxel = voxelCoordinates.find((voxel) => {
    //   const [x, y, z] = voxel;
    //   return x === roundedX && y === roundedY && z === roundedZ;
    // });
    // console.log(matchingVoxel);
    // if (matchingVoxel) {
    //   const value = matchingVoxel[3];
    //   console.log('Value at rounded coordinates:', value);
    // } else {
    //   // If no exact match is found, find the nearest neighbor
    //   const findNearestNeighbor = (target, coordinates) => {
    //     let nearest = null;
    //     let minDistance = Infinity;

    //     coordinates.forEach(([x, y, z, value]) => {
    //       const distance = Math.sqrt(
    //         Math.pow(x - target[0], 2) +
    //         Math.pow(y - target[1], 2) +
    //         Math.pow(z - target[2], 2)
    //       );

    //       if (distance < minDistance) {
    //         minDistance = distance;
    //         nearest = [x, y, z, value];
    //       }
    //     });

    //     return nearest;
    //   };

    //   const nearestVoxel = findNearestNeighbor(roundedCoordinates, voxelCoordinates);

    //   if (nearestVoxel) {
    //     const value = nearestVoxel[3];
    //     console.log('Value at nearest coordinates:', value);
    //   } else {
    //     console.log('No nearby voxel found.');
    //   }
    // }
    // console.log(matchingFiles);
    // setMatchingAtlases(matchingFiles);
  };

  const isCoordinateInGeometry = (x, y, z, geometry) => {
    const vertices = geometry.attributes.position.array;

    // Check if the input coordinate is near any vertex
    for (let i = 0; i < vertices.length; i += 3) {
      const [vx, vy, vz] = [vertices[i], vertices[i + 1], vertices[i + 2]];
      const tolerance = 0.3; // Adjust tolerance as needed
      if (
        Math.abs(vx - x) <= tolerance &&
        Math.abs(vy - y) <= tolerance &&
        Math.abs(vz - z) <= tolerance
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div style={{ marginTop: '-120px' }}>
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
          {/* <div ref={secondaryMountRef} /> */}
        </div>
        <Dropdown drop="start">
          <Dropdown.Toggle variant="secondary" style={{ marginLeft: '-100px' }}>
            <SettingsIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            <div id="tabs-collapse">
              <Tabs
                defaultActiveKey="meshes"
                id="mesh-controls-tab"
                // className="mb-3"
                style={{ backgroundColor: 'transparent' }}
              >
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

                <Tab eventKey="atlases" title="Atlases">
                  <div style={controlPanelStyle2}>
                    <input
                      type="text"
                      placeholder="Enter coordinates (x,y,z)"
                      value={searchCoordinate}
                      onChange={(e) => setSearchCoordinate(e.target.value)}
                      style={{ marginBottom: '10px', width: '300px' }}
                    />
                    <button onClick={handleCoordinateSearch}>Search</button>
                    <div style={{ marginTop: '20px' }}>
                      <h4>Matching Atlases:</h4>
                      {matchingAtlases.length > 0 ? (
                        <ul>
                          {matchingAtlases.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No matching atlases found.</p>
                      )}
                    </div>
                    <select
                      onChange={handleFileChange}
                      multiple
                      style={{
                        height: '500px',
                        width: '300px',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {plyFiles.map((file, index) => (
                        <option key={index} value={index}>
                          {file.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Tab>

                <Tab eventKey="sweetspots" title="Sweetspots">
                  <Tabs defaultActiveKey="tremor" id="nested-tabs-inside">
                    <Tab eventKey="tremor" title="Tremor">
                      <div style={controlPanelStyle2}>
                        <select
                          onChange={handleTremorChange}
                          multiple
                          style={{
                            height: '500px',
                            width: '300px',
                            backgroundColor: 'transparent',
                          }}
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
                          style={{
                            height: '500px',
                            width: '300px',
                            backgroundColor: 'transparent',
                          }}
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
              </Tabs>
            </div>
          </Dropdown.Menu>
        </Dropdown>
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
  // backgroundColor: '#f8f9fa',
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

const controlPanelStyle2 = {
  display: 'flex',
  flexDirection: 'column', // Stack controls vertically
  width: '300px', // Fixed width for the control panel
  height: '600px',
  padding: '10px',
  border: 'none',
  // backgroundColor: '#f5f5f5',
  backgroundColor: 'transparent', // Semi-transparent background color
};

const controlPanelStyle = {
  display: 'flex',
  flexDirection: 'column', // Stack controls vertically
  maxHeight: '600px', // Matches the height of the viewer
  overflowY: 'auto', // Allows scrolling if controls exceed height
  width: '300px', // Fixed width for the control panel
  // border: '1px solid #ccc',
  border: 'none',
  borderRadius: '8px',
  // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  backgroundColor: 'transparent', // Semi-transparent background color
  // backgroundColor: 'green',
};

const meshControlStyle = {
  marginBottom: '20px', // Space between each mesh control
};

const meshNameStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px', // Add space below the mesh name
  backgroundColor: 'rgba(245, 245, 245, 0.2)', // Semi-transparent background color
};

export default GroupViewer;

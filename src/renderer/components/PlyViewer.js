import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
import * as nifti from 'nifti-reader-js'; // Correctly importing the nifti module
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';

function PlyViewer({ quantities, amplitude, side }) {
  const [plyFile, setPlyFile] = useState(null);
  const mountRef = useRef(null);
  const sphereRef = useRef(null); // Ref for the sphere to update position dynamically
  const controlsRef = useRef(null); // Ref for the OrbitControls
  const [selectedTremor, setSelectedTremor] = useState([]); // Array to store selected tremor items
  const sphereRefs = useRef([]); // Refs for all spheres
  const sceneRef = useRef(null);
  const [atlas, setAtlas] = useState(null);
  const [meshes, setMeshes] = useState([]); // State to track meshes in the scene
  const [meshProperties, setMeshProperties] = useState({}); // State for each mesh's properties like visibility and opacity
  const rendererRef = useRef(null); // To store the renderer reference
  const cameraRef = useRef(null); // To store the camera reference

  // Thresholding/Modification stuff

  useEffect(() => {
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-ply-file',
          'selectedPath',
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
    const loadPlyFile = async () => {
      try {
        const fileData = await window.electron.ipcRenderer.invoke(
          'load-ply-file-anatomy',
          'selectedPath',
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

  // New states for visibility and thresholding
  const [meshVisibility, setMeshVisibility] = useState({});
  const [meshOpacity, setMeshOpacity] = useState({});
  const [threshold, setThreshold] = useState(0.5); // Example thresholding value

  const tremorData = [
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
  ];

  // const [plyFiles, setPlyFiles] = useState([
  //   // List of PLY file paths
  //   '/Users/savirmadan/Downloads/DBS_Targets_Horn_2017.ply',
  //   '/Users/savirmadan/Downloads/STN Sweetspots (Dembek 2019).ply',
  //   '/Users/savirmadan/Downloads/OCD Response Tract Atlas (Li 2020).ply',
  //   '/Users/savirmadan/Downloads/Thalamic Connectivity Atlas (Horn 2016).ply',
  // ]);

  const [plyFiles, setPlyFiles] = useState([]); // Store both names and paths

  // UseEffect to retrieve PLY file paths on component mount
  // useEffect(() => {
  //   // Request the PLY file paths from the main process
  //   window.electron.ipcRenderer.sendMessage('get-ply-files');

  //   // Handle the response from the main process
  //   window.electron.ipcRenderer.on('ply-files-result', (event, files) => {
  //     // Store both the file name and the full path in the state
  //     console.log(files);
  //     const fileData = files.map(file => ({
  //       name: file.fileName.split('/').pop(),  // Extract the atlas name from the path
  //       path: file.filePath                    // Store the full path
  //     }));
  //     console.log('File Data: ', fileData);
  //     setPlyFiles(fileData);
  //   });

  //   // Handle errors (optional)
  //   window.electron.ipcRenderer.on('ply-files-error', (event, errorMessage) => {
  //     console.error('Error fetching PLY files:', errorMessage);
  //   });
  // }, []);  // Empty dependency array ensures this runs only on mount

  useEffect(() => {
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

  // const handleFileChange = async (event) => {
  //   const selectedPath = event.target.value;
  //   const loader = new PLYLoader();
  //   // Load and parse the PLY file
  //   const fileData = await window.electron.ipcRenderer.invoke(
  //     'load-ply-file-2',
  //     selectedPath,
  //   );
  //   const geometry = loader.parse(fileData);
  //   const material = new THREE.MeshStandardMaterial({
  //     vertexColors: geometry.hasAttribute('color'),
  //     flatShading: true,
  //     metalness: 0.1,
  //     roughness: 0.5,
  //     transparent: true,
  //     opacity: 0.8,
  //   });
  //   // Add the mesh to the scene
  //   addMeshToScene(selectedPath, geometry, material);
  // };

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

  const contactDirections = {
    1: { x: 0, y: 0, z: 0 }, // Example directional adjustment for contact 1
    2: { x: 1, y: 0, z: 0 }, // Contact 2 adjustment
    3: { x: -0.5, y: -0.7, z: 0 }, // Contact 3 adjustment
    4: { x: -0.5, y: 0.7, z: 0 }, // Contact 4 adjustment
    5: { x: 1, y: 0, z: 0 }, // Contact 5 adjustment
    6: { x: -0.5, y: -0.7, z: 0 }, // Contact 6 adjustment
    7: { x: -0.5, y: 0.7, z: 0 }, // Contact 7 adjustment
    8: { x: 0, y: 0, z: 0 }, // Contact 8 adjustment
  };

  const VTASpheresRef = useRef(null); // Store references to each sphere for updating later

  const calculateVectorLevel = () => {
    const keyLevels = {
      1: 1,
      2: 2,
      3: 2,
      4: 2,
      5: 3,
      6: 3,
      7: 3,
      8: 4,
    };

    let totalQuantity = 0;
    let weightedSum = 0;
    // console.log(Object.keys(quantities));

    Object.keys(quantities).forEach((key) => {
      if (key === '0') {
        return;
      }
      const level = keyLevels[key];
      const quantity = parseFloat(quantities[key]);

      // Check if quantity is a valid number
      if (!isNaN(quantity)) {
        totalQuantity += quantity;
        weightedSum += level * quantity;
      }
    });

    // Avoid division by zero
    if (totalQuantity === 0) {
      return 0; // Return a default vector level (0) if no valid quantities are found
    }

    return weightedSum / totalQuantity; // Return the average vector level
  };

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

  const updateSpherePosition = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    clearAllSpheres();
    const keyLevels = {
      1: 1,
      2: 2,
      3: 2,
      4: 2,
      5: 3,
      6: 3,
      7: 3,
      8: 4,
    };
    // Loop through all contact directions to handle adding and updating spheres
    Object.keys(contactDirections).forEach((contactId) => {
      const contactQuantity = parseFloat(quantities[contactId]);

      // If contactQuantity is greater than 0, add or update the sphere
      if (contactQuantity > 0) {
        // Check if the sphere already exists in VTASpheresRef
        // if (!VTASpheresRef[contactId]) {
        // Calculate position and amplitude
        const vectorLevel = keyLevels[contactId];
        const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
        const normalizedLevel = (clampedLevel - 1) / (4 - 1);

        let startCoords = [];
        let targetCoords = [];
        if (side < 5) {
          startCoords = new THREE.Vector3(25.15, -8.62, -6.9);
          targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235);
        } else {
          startCoords = new THREE.Vector3(-24.28, -12.7068, -8.09);
          targetCoords = new THREE.Vector3(-24.91, -9.66, -2.09);
        }

        // Linearly interpolate between startCoords and targetCoords based on normalizedLevel
        const newPosition = startCoords
          .clone()
          .lerp(targetCoords, normalizedLevel);

        // Adjust position based on direction offset
        const directionOffset = contactDirections[contactId];
        newPosition.x += 1.3 * directionOffset.x;
        newPosition.y += 1.3 * directionOffset.y;
        newPosition.z += 1.3 * directionOffset.z;

        // Calculate amplitude based on contactQuantity
        const contactAmplitude = (contactQuantity / 100) * amplitude;

        // Create a new sphere
        const geometry = new THREE.SphereGeometry(
          Math.sqrt((contactAmplitude - 0.1) / 0.22),
          32,
          32,
        );
        // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
        const material = new THREE.MeshStandardMaterial({
          color: 0xff0000, // Set the base color to red
          transparent: true, // Make the material transparent
          opacity: 0.8, // Set opacity to 80%
          roughness: 0.4, // Control the surface roughness (0 = smooth, 1 = rough)
          metalness: 0.1, // Control the metallic appearance (0 = non-metal, 1 = fully metallic)
          flatShading: false, // Enable smooth shading for better visual quality
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

  useEffect(() => {
    if (mountRef.current) {
      // Initialize scene, camera, and renderer only once
      const scene = new THREE.Scene();
      sceneRef.current = scene; // Save scene reference
      scene.background = new THREE.Color(0xffffff); // White background
      const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000); // 1 is the aspect ratio (square)
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(300, 600); // Set smaller size
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      // if (side < 5) {
      //   // Create a clipping plane that only renders objects with x > 0
      //   const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

      //   // Enable the clipping planes in the renderer
      //   renderer.localClippingEnabled = true;

      //   // Apply the clipping plane to the entire scene
      //   renderer.clippingPlanes = [clipPlane];
      // } else {
      //   // Create a clipping plane that only renders objects with x > 0
      //   const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

      //   // Enable the clipping planes in the renderer
      //   renderer.localClippingEnabled = true;

      //   // Apply the clipping plane to the entire scene
      //   renderer.clippingPlanes = [clipPlane];
      // }

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      // const loader = new PLYLoader();
      // const geometry = loader.parse(plyFile);
      // // const material = new THREE.MeshStandardMaterial({
      // //   vertexColors: geometry.hasAttribute('color'),
      // //   flatShading: true,
      // // });

      // const material = new THREE.MeshStandardMaterial({
      //   vertexColors: geometry.hasAttribute('color'),
      //   flatShading: true,
      //   metalness: 0.1, // More reflective
      //   roughness: 0.5, // Shinier surface
      //   transparent: true, // Enable transparency
      //   opacity: 0.8, // Set opacity to 60%
      // });

      // geometry.computeVertexNormals();
      // const mesh = new THREE.Mesh(geometry, material);
      // scene.add(mesh);

      // OrbitControls setup (only initialize once)
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 0.5;
      controlsRef.current = controls;

      camera.position.set(0, 0, 60); // Zoomed out to start

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);

      rendererRef.current = renderer;
      cameraRef.current = camera;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update OrbitControls
        renderer.render(sceneRef.current, camera);
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

  // Don't forget this

  useEffect(() => {
    window.electron.zoom.setZoomLevel(zoomLevel);
  }, [zoomLevel]);

  return (
    <div>
      {/* {!plyFile && (
        <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drag & drop a .ply file here</p>
        </div>
      )} */}
      <div style={viewerContainerStyle}>
        <div ref={mountRef} />

        <Tabs
          defaultActiveKey="atlases"
          id="mesh-controls-tab"
          className="mb-3"
        >
          <Tab eventKey="meshes" title="Meshes">
            <div style={controlPanelStyle}>
              {meshes.map((mesh, index) => (
                <div key={mesh.name} style={meshControlStyle}>
                  <h5 style={meshNameStyle}>{mesh.name}</h5>
                  <h3 style={{ fontSize: '12px' }}>Visibility</h3>
                  <Form.Check
                    type="switch"
                    // label="Visible"
                    checked={meshProperties[mesh.name]?.visible}
                    onChange={() => handleVisibilityChange(mesh.name)}
                  />
                  {/* <Form.Label>Opacity</Form.Label> */}
                  <h3 style={{ fontSize: '12px' }}>Opacity</h3>
                  <Form.Range
                    min={0}
                    max={1}
                    step={0.01}
                    value={meshProperties[mesh.name]?.opacity || 0.8}
                    onChange={(e) =>
                      handleOpacityChange(mesh.name, parseFloat(e.target.value))
                    }
                    style={{ width: '150px' }} // Adjust the width to your preference
                  />
                  {/* <h3 style={{ fontSize: '12px' }}>Thresholding</h3>
                  <Form.Range
                    min={0}
                    max={1}
                    step={0.01}
                    value={meshProperties[mesh.name]?.opacity || 0.8}
                    onChange={(e) =>
                      handleThresholdChange(mesh.name, parseFloat(e.target.value))
                    }
                    style={{ width: '150px' }} // Adjust the width to your preference
                  /> */}
                </div>
              ))}
            </div>
          </Tab>
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
          <Tab eventKey="sweetspots" title="Sweetspots">
            <Tabs defaultActiveKey="overview" id="nested-tabs-inside">
              <Tab eventKey="tremor" title="Tremor">
                <div style={controlPanelStyle2}>
                  <h4>Overview</h4>
                  <select onChange={handleTremorChange} multiple>
                    {tremorData.map((tremor, index) => (
                      <option key={index} value={index}>
                        {tremor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Tab>
              <Tab eventKey="pd" title="PD">
                <div style={controlPanelStyle2}>
                  <h4>Coordinates</h4>
                </div>
              </Tab>
            </Tabs>
          </Tab>
        </Tabs>
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

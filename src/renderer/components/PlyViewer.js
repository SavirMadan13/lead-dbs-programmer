import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function PlyViewer({ quantities, amplitude, side }) {
  const [electricFieldPlotting, setElectricFieldPlotting] = useState(null);

  // useEffect(() => {
  //   // Function to create an Electric Field Simulator
  //   const electricFieldSimulator = (electrode, tissueProperties, stimulationParams) => {
  //     const gridSize = 0.1; // mm resolution
  //     const gridDimensions = { x: 100, y: 100, z: 100 }; // Size of the simulation volume
  //     const potential = initializePotentialGrid(gridDimensions);
  //     const electricField = initializeElectricFieldGrid(gridDimensions);

  //     function initializePotentialGrid({ x, y, z }) {
  //       return Array.from({ length: x }, () =>
  //         Array.from({ length: y }, () => Array.from({ length: z }, () => 0))
  //       );
  //     }

  //     function initializeElectricFieldGrid({ x, y, z }) {
  //       return Array.from({ length: x }, () =>
  //         Array.from({ length: y }, () => Array.from({ length: z }, () => [0, 0, 0]))
  //       );
  //     }

  //     function solvePotential() {
  //       const maxIterations = 1000;
  //       const tolerance = 1e-6;
  //       let diff = tolerance + 1;
  //       let iteration = 0;

  //       for (let i = 1; i < gridDimensions.x - 1; i++) {
  //         for (let j = 1; j < gridDimensions.y - 1; j++) {
  //           for (let k = 1; k < gridDimensions.z - 1; k++) {
  //             if (isElectrodeRegion(i, j, k)) {
  //               potential[i][j][k] = amplitude; // Define the amplitude clearly
  //             }
  //           }
  //         }
  //       }

  //       while (diff > tolerance && iteration < maxIterations) {
  //         diff = 0;
  //         for (let i = 1; i < gridDimensions.x - 1; i++) {
  //           for (let j = 1; j < gridDimensions.y - 1; j++) {
  //             for (let k = 1; k < gridDimensions.z - 1; k++) {
  //               if (!isElectrodeRegion(i, j, k)) {
  //                 const oldPotential = potential[i][j][k];
  //                 potential[i][j][k] =
  //                   (potential[i + 1][j][k] +
  //                     potential[i - 1][j][k] +
  //                     potential[i][j + 1][k] +
  //                     potential[i][j - 1][k] +
  //                     potential[i][j][k + 1] +
  //                     potential[i][j][k - 1]) /
  //                   6;
  //                 diff = Math.max(diff, Math.abs(potential[i][j][k] - oldPotential));
  //               }
  //             }
  //           }
  //         }
  //         iteration++;
  //       }
  //     }

  //     function isElectrodeRegion(i, j, k) {
  //       const contactRadius = 2;
  //       for (const contact of electrode.contacts) {
  //         const [cx, cy, cz] = contact.position;
  //         const distance = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2 + (k - cz) ** 2);
  //         if (distance <= contactRadius) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     }

  //     function applyDirectionalField(contact, i, j, k) {
  //       const { isDirectional, percentage, direction } = contact;
  //       const distanceVector = [i - contact.position[0], j - contact.position[1], k - contact.position[2]];
  //       const magnitude = Math.sqrt(distanceVector[0] ** 2 + distanceVector[1] ** 2 + distanceVector[2] ** 2);
  //       if (magnitude === 0) return 0;

  //       if (isDirectional) {
  //         const directionFactor = dotProduct(direction, distanceVector) / magnitude;
  //         return Math.max(0, directionFactor * percentage);
  //       }
  //       return percentage;
  //     }

  //     function calculateElectricField() {
  //       const { x, y, z } = gridDimensions;
  //       for (let i = 1; i < x - 1; i++) {
  //         for (let j = 1; j < y - 1; j++) {
  //           for (let k = 1; k < z - 1; k++) {
  //             electricField[i][j][k][0] =
  //               -(potential[i + 1][j][k] - potential[i - 1][j][k]) / (2 * gridSize);
  //             electricField[i][j][k][1] =
  //               -(potential[i][j + 1][k] - potential[i][j - 1][k]) / (2 * gridSize);
  //             electricField[i][j][k][2] =
  //               -(potential[i][j][k + 1] - potential[i][j][k - 1]) / (2 * gridSize);
  //           }
  //         }
  //       }
  //     }

  //     function calculateVTA(threshold) {
  //       const VTA = [];
  //       for (let i = 1; i < gridDimensions.x - 1; i++) {
  //         for (let j = 1; j < gridDimensions.y - 1; j++) {
  //           for (let k = 1; k < gridDimensions.z - 1; k++) {
  //             const field = electricField[i][j][k];
  //             const fieldStrength = Math.sqrt(field[0] ** 2 + field[1] ** 2 + field[2] ** 2);
  //             if (fieldStrength >= threshold) {
  //               VTA.push({ x: i, y: j, z: k });
  //             }
  //           }
  //         }
  //       }
  //       return VTA;
  //     }

  //     function runSimulation() {
  //       solvePotential();
  //       calculateElectricField();
  //       return calculateVTA(stimulationParams.threshold);
  //     }

  //     return { runSimulation };
  //   };

  //   // Example usage:
  //   const electrode = {
  //     num_contacts: 8,
  //     contacts: [
  //       {
  //         position: [25.15, -8.62, -6.9], // Contact 1 - start position
  //         isDirectional: false,
  //         percentage: quantities['1'] / 100,
  //       },
  //       {
  //         position: [25.34, -7.94, -4.74], // Contact 2 - shared position for contacts 2-4
  //         isDirectional: true,
  //         direction: [1, 0, 0],
  //         percentage: quantities['2'] / 100,
  //       },
  //       {
  //         position: [25.34, -7.94, -4.74], // Contact 3 - shared position for contacts 2-4
  //         isDirectional: true,
  //         direction: [0, 1, 0],
  //         percentage: quantities['3'] / 100,
  //       },
  //       {
  //         position: [25.34, -7.94, -4.74], // Contact 4 - shared position for contacts 2-4
  //         isDirectional: true,
  //         direction: [0, 0, 1],
  //         percentage: quantities['4'] / 100,
  //       },
  //       {
  //         position: [25.54, -7.27, -2.58], // Contact 5 - shared position for contacts 5-7
  //         isDirectional: true,
  //         direction: [-1, 0, 0],
  //         percentage: quantities['5'] / 100,
  //       },
  //       {
  //         position: [25.54, -7.27, -2.58], // Contact 6 - shared position for contacts 5-7
  //         isDirectional: true,
  //         direction: [0, -1, 0],
  //         percentage: quantities['6'] / 100,
  //       },
  //       {
  //         position: [25.54, -7.27, -2.58], // Contact 7 - shared position for contacts 5-7
  //         isDirectional: true,
  //         direction: [0, 0, -1],
  //         percentage: quantities['7'] / 100,
  //       },
  //       {
  //         position: [25.74, -6.59, -0.42], // Contact 8 - end position
  //         isDirectional: false,
  //         percentage: quantities['8'] / 100,
  //       },
  //     ],
  //   };

  //   const tissueProperties = {
  //     greyMatter: { conductivity: 0.33 },
  //     whiteMatter: { conductivity: 0.14 },
  //     csf: { conductivity: 1.79 },
  //   };

  //   const stimulationParams = {
  //     pulse_width: 60, // microseconds
  //     frequency: 130, // Hz
  //     threshold: 0.2, // Threshold for VTA calculation
  //   };

  //   // const simulator = electricFieldSimulator(
  //   //   electrode,
  //   //   tissueProperties,
  //   //   stimulationParams,
  //   // );
  //   const simulator = electricFieldSimulator(electrode, tissueProperties, stimulationParams);
  //   const VTA = simulator.runSimulation();
  //   console.log('VTA: ', VTA);

  //   // setElectricFieldPlotting(results.VTA);

  //   // console.log('Electric Field:', results.electricField);
  //   // console.log('VTA:', results.VTA);
  // }, []);

  const [plyFile, setPlyFile] = useState(null);
  const mountRef = useRef(null);
  const sphereRef = useRef(null); // Ref for the sphere to update position dynamically
  const controlsRef = useRef(null); // Ref for the OrbitControls
  const [selectedTremor, setSelectedTremor] = useState([]); // Array to store selected tremor items
  const sphereRefs = useRef([]); // Refs for all spheres
  const sceneRef = useRef(null);

  // List of tremor data (simplified from your table)
  // const tremorData = [
  //   { name: 'Papavassilliou et al47', coords: [-14.5, -17.7, -2.8] },
  //   { name: 'Hamel et al36', coords: [-12.7, -7.0, -1.5] },
  //   { name: 'Herzog et al37', coords: [-13.0, -5.5, 0.0] },
  //   { name: 'Blomstedt et al4', coords: [-11.6, -6.3, -2.3] },
  //   { name: 'Barbe et al48', coords: [-11.3, -7.2, -1.4] },
  //   { name: 'Sandvik et al29 (66)', coords: [-13.0, -1.8, 4.1] },
  //   { name: 'Sandvik et al29 (12)', coords: [-12.1, -5.5, -1.2] },
  //   { name: 'Fytagoridis et al32', coords: [-11.9, -6.2, -2.0] },
  //   { name: 'Cury et al49', coords: [-14.7, 7.1, 1.8] },
  //   { name: 'Fiechter et al50', coords: [-14.3, -5.0, 0.9] },
  //   { name: 'Barbe et al35', coords: [-11.0, -5.7, -1.9] },
  //   { name: 'Nowacki et al5', coords: [-10.6, -5.2, -3.2] },
  //   { name: 'Nowacki et al51', coords: [-12.8, -3.6, 0.0] },
  //   { name: 'Philipson et al33', coords: [-12.0, -7.5, -4.0] },
  //   { name: 'Tsuboi et al52', coords: [-14.3, -4.3, -2.1] },
  //   { name: 'Elias et al17', coords: [-17.3, -13.9, 4.2] },
  //   { name: 'Tsuboi et al31', coords: [-15.0, -17.0, 1.0] },
  //   { name: 'Middlebrooks et al53', coords: [-15.5, -15.5, 0.5] },
  // ];

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

  const handleTremorChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTremor((prevSelectedTremor) => {
      if (prevSelectedTremor.includes(selectedValue)) {
        // If already selected, remove it
        return prevSelectedTremor.filter((item) => item !== selectedValue);
      }
      // If not selected, add it
      return [...prevSelectedTremor, selectedValue];
    });
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
      if (tremorItem && !sphereRefs.current.some(sphere => sphere.name === selectedItem)) {
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

  // const addOrRemoveSpheres = () => {
  //   const scene = sceneRef.current;
  //   if (!scene) return;

  //   // Clear all existing spheres first
  //   sphereRefs.current.forEach((sphere) => {
  //     scene.remove(sphere);
  //   });
  //   sphereRefs.current = [];

  //   // Add spheres based on the selectedTremor items
  //   // selectedTremor.forEach((selectedItem) => {
  //   //   const tremorItem = tremorData.find((item) => item.name === selectedItem);
  //   //   if (tremorItem) {
  //   //     const [x, y, z] = tremorItem.coords;
  //   //     const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  //   //     const sphereMaterial = new THREE.MeshStandardMaterial({
  //   //       color: getRandomColor(),
  //   //       transparent: true,
  //   //       opacity: 0.8,
  //   //     });
  //   //     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  //   //     sphere.position.set(x, y, z);
  //   //     scene.add(sphere);
  //   //     sphereRefs.current.push(sphere); // Keep track of spheres for removal
  //   //   }
  //   // });

  //   selectedTremor.forEach((selectedItem) => {
  //     const tremorItem = tremorData.find((item) => item.name === selectedItem);
  //     if (tremorItem) {
  //       const [x, y, z] = tremorItem.coords;
  //       const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

  //       // Ensure a new material instance for each sphere
  //       const sphereMaterial = new THREE.MeshStandardMaterial({
  //         color: new THREE.Color(Math.random(), Math.random(), Math.random()), // Generate random color
  //         transparent: true,
  //         opacity: 0.8,
  //       });

  //       const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  //       sphere.position.set(x, y, z);
  //       scene.add(sphere);
  //       sphereRefs.current.push(sphere); // Keep track of spheres for removal
  //     }
  //   });
  // };

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

  const updateSpherePosition = () => {
    const vectorLevel = calculateVectorLevel();

    // Ensure vectorLevel is clamped between 1 and 4
    const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);

    // Normalize vectorLevel to a 0-1 range where 1 maps to 0 and 4 maps to 1
    const normalizedLevel = (clampedLevel - 1) / (4 - 1);

    // Define the initial starting coordinates
    // const startCoords = new THREE.Vector3(25.15, -8.62, -6.9);
    // const startCoords = new THREE.Vector3(-24.28, -12.7068, -8.09);

    // Define the target coordinates
    // const targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235); // Example target coordinates
    // const targetCoords = new THREE.Vector3(-24.91, -9.66, -2.09); // Example target coordinates
    let startCoords = [];
    let targetCoords = [];

    if (side < 5) {
      startCoords = new THREE.Vector3(25.15, -8.62, -6.9);
      targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235); // Example target coordinates
    } else {
      startCoords = new THREE.Vector3(-24.28, -12.7068, -8.09);
      targetCoords = new THREE.Vector3(-24.91, -9.66, -2.09); // Example target coordinates
    }

    // Linearly interpolate between startCoords and targetCoords based on normalizedLevel
    const newPosition = startCoords.clone().lerp(targetCoords, normalizedLevel);

    // Update the sphere position with the new coordinates (x, y, z)
    if (sphereRef.current) {
      sphereRef.current.position.set(
        newPosition.x,
        newPosition.y,
        newPosition.z,
      );
      sphereRef.current.geometry.dispose();

      // Create new sphere geometry based on the new amplitude
      const newGeometry = new THREE.SphereGeometry(amplitude, 32, 32);

      // Assign the new geometry to the existing sphere
      sphereRef.current.geometry = newGeometry;
      // const newScale = amplitude; // Adjust this scaling factor as needed
      // sphereRef.current.scale.set(newScale, 32, 32); // Uniformly scale the sphere
    }
  };

  useEffect(() => {
    if (plyFile && mountRef.current) {
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

      if (side < 5) {
        // Create a clipping plane that only renders objects with x > 0
        const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

        // Enable the clipping planes in the renderer
        renderer.localClippingEnabled = true;

        // Apply the clipping plane to the entire scene
        renderer.clippingPlanes = [clipPlane];
      } else {
        // Create a clipping plane that only renders objects with x > 0
        const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0); // Vector3(-1, 0, 0) means we're clipping based on the x axis

        // Enable the clipping planes in the renderer
        renderer.localClippingEnabled = true;

        // Apply the clipping plane to the entire scene
        renderer.clippingPlanes = [clipPlane];
      }

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      const loader = new PLYLoader();
      const geometry = loader.parse(plyFile);
      // const material = new THREE.MeshStandardMaterial({
      //   vertexColors: geometry.hasAttribute('color'),
      //   flatShading: true,
      // });

      const material = new THREE.MeshStandardMaterial({
        vertexColors: geometry.hasAttribute('color'),
        flatShading: true,
        metalness: 0.1, // More reflective
        roughness: 0.5, // Shinier surface
        transparent: true, // Enable transparency
        opacity: 0.8, // Set opacity to 60%
      });

      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Create sphere (fixed size) and add it to the scene
      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // sphere.position.copy(new THREE.Vector3(25.15, -8.62, -6.9)); // Initial position
      // sphere.position.copy(new THREE.Vector3(-24.28, -12.7068, -8.09));
      sphereRef.current = sphere; // Reference to the sphere for dynamic updates
      scene.add(sphere);

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

      // Simplified function to plot points for electric field vectors
      // const plotElectricFieldPoints = () => {
      //   const pointMaterial = new THREE.PointsMaterial({
      //     color: 0x00ff00, // Green color for points
      //     size: 0.5, // Size of each point
      //     transparent: true,
      //     opacity: 0.8,
      //   });

      //   const points = [];

      //   // Loop through the VTA array and create points for each vector
      //   electricFieldPlotting.forEach((fieldVector) => {
      //     if (
      //       fieldVector.x !== undefined &&
      //       fieldVector.y !== undefined &&
      //       fieldVector.z !== undefined
      //     ) {
      //       // Extract x, y, z coordinates
      //       const pointPosition = new THREE.Vector3(
      //         fieldVector.x,
      //         fieldVector.y,
      //         fieldVector.z,
      //       );
      //       points.push(pointPosition);
      //     }
      //   });

      //   console.log('Points: ', points);

      //   // Convert the points array to a buffer geometry
      //   const pointGeometry = new THREE.BufferGeometry().setFromPoints(points);

      //   // Create the points object
      //   const fieldPoints = new THREE.Points(pointGeometry, pointMaterial);
      //   scene.add(fieldPoints);
      // };

      // // Example: Plot electric field points
      // plotElectricFieldPoints();

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // Update OrbitControls
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', onWindowResize);
        renderer.dispose();
      };
    }
  }, [plyFile]);

  useEffect(() => {
    if (sceneRef.current) {
      addOrRemoveSpheres();
    }
  }, [selectedTremor]);

  useEffect(() => {
    if (quantities) {
      updateSpherePosition(); // Update the sphere position based on quantities
    }
  }, [quantities]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '500px',
      }}
    >
      {!plyFile && (
        <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drag & drop a .ply file here</p>
        </div>
      )}
      <div>
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="tremor" title="Tremor">
            <select onChange={handleTremorChange} multiple>
              {tremorData.map((tremor) => (
                <option key={tremor.name} value={tremor.name}>
                  {tremor.name}
                </option>
              ))}
            </select>
          </Tab>
          <Tab eventKey="profile" title="Profile">
            Tab content for Profile
          </Tab>
          <Tab eventKey="contact" title="Contact" disabled>
            Tab content for Contact
          </Tab>
        </Tabs>
      </div>
      <div ref={mountRef} style={viewerStyle} />
    </div>
  );
}

const dropzoneStyle = {
  width: '100%',
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

const viewerStyle = {
  width: '100%',
  height: '200px',
  // border: '1px solid #000',
};

export default PlyViewer;

// Trying something new
// import React, { useState, useRef, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import * as THREE from 'three';
// import { PLYLoader, OrbitControls } from 'three-stdlib';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

// function PlyViewer({ quantities, amplitude, side }) {
//   const [plyFiles, setPlyFiles] = useState([]); // State for multiple PLY files
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null); // Reference for the THREE.js scene
//   const cameraRef = useRef(null); // Reference for the camera
//   const rendererRef = useRef(null); // Reference for the renderer
//   const sphereRef = useRef(null); // Reference for the sphere
//   const controlsRef = useRef(null); // Ref for the OrbitControls

//   window.electron.ipcRenderer.sendMessage('import-ply-file', side);

//   useEffect(() => {
//     // Ensure that the ipcRenderer is available
//     if (window.electron && window.electron.ipcRenderer) {
//       const ipcRenderer = window.electron.ipcRenderer;

//       // Event listener for import-file
//       const handleImportFile = (arg1, arg2) => {
//         console.log('received');
//         setPlyFiles([arg1, arg2]);
//       };
//       // Attach listeners using 'once' so that it only listens for the event once
//       // ipcRenderer.once('import-file-error', handleImportFileError);
//       ipcRenderer.once('import-ply-file', handleImportFile);

//     } else {
//       console.error('ipcRenderer is not available');
//     }
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: '.ply',
//     onDrop: (acceptedFiles) => {
//       acceptedFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setPlyFiles((prevFiles) => [...prevFiles, reader.result]);
//         };
//         reader.readAsArrayBuffer(file);
//       });
//     },
//   });

//   const calculateVectorLevel = () => {
//     const keyLevels = {
//       '1': 1,
//       '2': 2,
//       '3': 2,
//       '4': 2,
//       '5': 3,
//       '6': 3,
//       '7': 3,
//       '8': 4,
//     };

//     let totalQuantity = 0;
//     let weightedSum = 0;

//     Object.keys(quantities).forEach((key) => {
//       if (key === '0') {
//         return;
//       }
//       const level = keyLevels[key];
//       const quantity = parseFloat(quantities[key]);

//       if (!isNaN(quantity)) {
//         totalQuantity += quantity;
//         weightedSum += level * quantity;
//       }
//     });

//     if (totalQuantity === 0) {
//       return 0;
//     }

//     return weightedSum / totalQuantity;
//   };

//   const updateSpherePosition = () => {
//     const vectorLevel = calculateVectorLevel();
//     const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
//     const normalizedLevel = (clampedLevel - 1) / (4 - 1);

//     const startCoords = new THREE.Vector3(25.15, -8.62, -6.9);
//     const targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235);

//     const newPosition = startCoords.clone().lerp(targetCoords, normalizedLevel);

//     if (sphereRef.current) {
//       sphereRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
//       sphereRef.current.geometry.dispose();

//       const newGeometry = new THREE.SphereGeometry(amplitude, 32, 32);
//       sphereRef.current.geometry = newGeometry;
//     }
//   };

//   useEffect(() => {
//     if (mountRef.current) {
//       // Initialize scene, camera, and renderer only once
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
//       camera.position.set(0, 0, 60); // Zoomed out to start

//       const renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setSize(300, 600);
//       mountRef.current.appendChild(renderer.domElement);

//       const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
//       directionalLight.position.set(5, 5, 5).normalize();
//       scene.add(directionalLight);

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.1;
//       controls.rotateSpeed = 0.8;
//       controls.zoomSpeed = 0.5;

//       // Create the sphere and add it to the scene
//       const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
//       const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
//       const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//       sphere.position.copy(new THREE.Vector3(25.15, -8.62, -6.9));
//       sphereRef.current = sphere; // Save reference to update later
//       scene.add(sphere);

//       // Save references for later updates
//       sceneRef.current = scene;
//       cameraRef.current = camera;
//       rendererRef.current = renderer;
//       controlsRef.current = controls;

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };
//       animate();
//     }
//   }, []);

//   useEffect(() => {
//     if (plyFiles.length > 0 && sceneRef.current) {
//       const loader = new PLYLoader();

//       plyFiles.forEach((plyFile) => {
//         const geometry = loader.parse(plyFile);
//         const material = new THREE.MeshStandardMaterial({
//           vertexColors: geometry.hasAttribute('color'),
//           flatShading: true,
//           metalness: 0.1,
//           roughness: 0.5,
//           transparent: true,
//           opacity: 0.8,
//         });

//         geometry.computeVertexNormals();
//         const mesh = new THREE.Mesh(geometry, material);
//         sceneRef.current.add(mesh); // Add each new mesh to the same scene
//       });
//     }
//   }, [plyFiles]);

//   useEffect(() => {
//     if (quantities) {
//       updateSpherePosition();
//     }
//   }, [quantities]);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px' }}>
//       <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
//         <input {...getInputProps()} />
//         <p>Drag & drop .ply files here, or click to select</p>
//       </div>
//       <div ref={mountRef} style={viewerStyle} />
//     </div>
//   );
// }

// const dropzoneStyle = {
//   width: '100%',
//   height: '150px',
//   border: '3px dashed #007bff',
//   borderRadius: '10px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: '#f8f9fa',
//   transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   marginBottom: '20px',
//   cursor: 'pointer',
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
// };

// const viewerStyle = {
//   width: '100%',
//   height: '200px',
// };

// export default PlyViewer;

// import React, { useState, useRef, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import * as THREE from 'three';
// import { PLYLoader, OrbitControls } from 'three-stdlib';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

// function PlyViewer({ quantities, amplitude }) {
//   const [plyFiles, setPlyFiles] = useState([]); // State for multiple PLY files
//   const [fileProps, setFileProps] = useState([]); // Track visibility and transparency for each PLY file
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null); // Reference for the THREE.js scene
//   const cameraRef = useRef(null); // Reference for the camera
//   const rendererRef = useRef(null); // Reference for the renderer
//   const sphereRef = useRef(null); // Reference for the sphere
//   const controlsRef = useRef(null); // Ref for the OrbitControls
//   const meshesRef = useRef([]); // Track the meshes for direct updates

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: '.ply',
//     onDrop: (acceptedFiles) => {
//       acceptedFiles.forEach((file, index) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setPlyFiles((prevFiles) => [...prevFiles, reader.result]);
//           setFileProps((prevProps) => [
//             ...prevProps,
//             { visible: true, transparency: 0.8 }, // Add default visibility and transparency
//           ]);
//         };
//         reader.readAsArrayBuffer(file);
//       });
//     },
//   });

//   const calculateVectorLevel = () => {
//     const keyLevels = {
//       1: 1,
//       2: 2,
//       3: 2,
//       4: 2,
//       5: 3,
//       6: 3,
//       7: 3,
//       8: 4,
//     };

//     let totalQuantity = 0;
//     let weightedSum = 0;

//     Object.keys(quantities).forEach((key) => {
//       if (key === '0') {
//         return;
//       }
//       const level = keyLevels[key];
//       const quantity = parseFloat(quantities[key]);

//       if (!isNaN(quantity)) {
//         totalQuantity += quantity;
//         weightedSum += level * quantity;
//       }
//     });

//     if (totalQuantity === 0) {
//       return 0;
//     }

//     return weightedSum / totalQuantity;
//   };

//   const updateSpherePosition = () => {
//     const vectorLevel = calculateVectorLevel();
//     const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);
//     const normalizedLevel = (clampedLevel - 1) / (4 - 1);

//     const startCoords = new THREE.Vector3(25.15, -8.62, -6.9);
//     const targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235);

//     const newPosition = startCoords.clone().lerp(targetCoords, normalizedLevel);

//     if (sphereRef.current) {
//       sphereRef.current.position.set(
//         newPosition.x,
//         newPosition.y,
//         newPosition.z,
//       );
//       sphereRef.current.geometry.dispose();

//       const newGeometry = new THREE.SphereGeometry(amplitude, 32, 32);
//       sphereRef.current.geometry = newGeometry;
//     }
//   };

//   useEffect(() => {
//     if (mountRef.current) {
//       // Initialize scene, camera, and renderer only once
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
//       camera.position.set(0, 0, 60); // Zoomed out to start

//       const renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setSize(300, 600);
//       mountRef.current.appendChild(renderer.domElement);

//       const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
//       directionalLight.position.set(5, 5, 5).normalize();
//       scene.add(directionalLight);

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.1;
//       controls.rotateSpeed = 0.8;
//       controls.zoomSpeed = 0.5;

//       // Create the sphere and add it to the scene
//       const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
//       const sphereMaterial = new THREE.MeshStandardMaterial({
//         color: 0xff0000,
//         transparent: true,
//         opacity: 0.8,
//       });
//       const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//       sphere.position.copy(new THREE.Vector3(25.15, -8.62, -6.9));
//       sphereRef.current = sphere; // Save reference to update later
//       scene.add(sphere);

//       // Save references for later updates
//       sceneRef.current = scene;
//       cameraRef.current = camera;
//       rendererRef.current = renderer;
//       controlsRef.current = controls;

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };
//       animate();
//     }
//   }, []);

//   // Function to toggle visibility
//   const toggleVisibility = (index) => {
//     setFileProps((prevProps) => {
//       const updatedProps = [...prevProps];
//       updatedProps[index].visible = !updatedProps[index].visible;

//       if (meshesRef.current[index]) {
//         meshesRef.current[index].visible = updatedProps[index].visible;
//       }

//       return updatedProps;
//     });
//   };

//   // Function to change transparency
//   const changeTransparency = (index, transparency) => {
//     setFileProps((prevProps) => {
//       const updatedProps = [...prevProps];
//       updatedProps[index].transparency = transparency;

//       if (meshesRef.current[index]) {
//         meshesRef.current[index].material.opacity = transparency;
//         meshesRef.current[index].material.transparent = true;
//       }

//       return updatedProps;
//     });
//   };

//   useEffect(() => {
//     if (plyFiles.length > 0 && sceneRef.current) {
//       const loader = new PLYLoader();

//       plyFiles.forEach((plyFile, index) => {
//         const geometry = loader.parse(plyFile);
//         const material = new THREE.MeshStandardMaterial({
//           vertexColors: geometry.hasAttribute('color'),
//           flatShading: true,
//           metalness: 0.1,
//           roughness: 0.5,
//           transparent: true,
//           opacity: fileProps[index]?.transparency || 0.8, // Use transparency from state
//         });

//         geometry.computeVertexNormals();
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.visible = fileProps[index]?.visible ?? true; // Use visibility from state
//         sceneRef.current.add(mesh); // Add each new mesh to the same scene
//         meshesRef.current[index] = mesh; // Save reference to each mesh
//       });
//     }
//   }, [plyFiles, fileProps]); // Add dependencies on both plyFiles and fileProps

//   useEffect(() => {
//     if (quantities) {
//       updateSpherePosition();
//     }
//   }, [quantities]);

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         maxWidth: '500px',
//       }}
//     >
//       <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
//         <input {...getInputProps()} />
//         <p>Drag & drop .ply files here, or click to select</p>
//       </div>
//       <div ref={mountRef} style={viewerStyle} />
//       {/* Render buttons for each PLY file */}
//       {plyFiles.map((_, index) => (
//         <div key={index} style={{ marginTop: '-200px', display: 'flex',
//           flexDirection: 'row' }}>
//           <button
//             onClick={() => toggleVisibility(index)}
//             style={{
//               padding: '8px 16px',
//               margin: '5px',
//               backgroundColor: '#007bff',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             {fileProps[index]?.visible ? 'Hide' : 'Show'} File {index + 1}
//           </button>
//           {/* <button onClick={() => changeTransparency(index, fileProps[index]?.transparency === 0.8 ? 0.3 : 0.8)}>
//             {fileProps[index]?.transparency === 0.8 ? 'Make Transparent' : 'Make Opaque'}
//           </button> */}
//         </div>
//       ))}
//     </div>
//   );
// }

// const dropzoneStyle = {
//   width: '100%',
//   height: '150px',
//   border: '3px dashed #007bff',
//   borderRadius: '10px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: '#f8f9fa',
//   transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   marginBottom: '20px',
//   cursor: 'pointer',
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
// };

// const viewerStyle = {
//   width: '100%',
//   height: '200px',
// };

// export default PlyViewer;

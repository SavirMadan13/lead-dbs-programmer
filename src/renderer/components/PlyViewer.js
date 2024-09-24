import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';
import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

function PlyViewer({ quantities, amplitude }) {
  const [plyFile, setPlyFile] = useState(null);
  const mountRef = useRef(null);
  const sphereRef = useRef(null); // Ref for the sphere to update position dynamically
  const controlsRef = useRef(null); // Ref for the OrbitControls

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
      '1': 1,
      '2': 2,
      '3': 2,
      '4': 2,
      '5': 3,
      '6': 3,
      '7': 3,
      '8': 4,
    };

    let totalQuantity = 0;
    let weightedSum = 0;
    console.log(Object.keys(quantities));

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

  // const updateSpherePosition = () => {
  //   const vectorLevel = calculateVectorLevel();
  //   console.log(vectorLevel);
  //   // const newYPosition = -8.62 + vectorLevel * 1.5; // Adjust scale factor
  //   const newZPosition = -8.62 + vectorLevel * 2.5; // Adjust scale factor
  //   if (sphereRef.current) {
  //     sphereRef.current.position.set(25.15, -8.62, newZPosition); // Only update Y-axis
  //   }
  // };

  const updateSpherePosition = () => {
    const vectorLevel = calculateVectorLevel();

    // Ensure vectorLevel is clamped between 1 and 4
    const clampedLevel = Math.min(Math.max(vectorLevel, 1), 4);

    // Normalize vectorLevel to a 0-1 range where 1 maps to 0 and 4 maps to 1
    const normalizedLevel = (clampedLevel - 1) / (4 - 1);

    // Define the initial starting coordinates
    const startCoords = new THREE.Vector3(25.15, -8.62, -6.9);

    // Define the target coordinates
    const targetCoords = new THREE.Vector3(25.743, -6.5955, -0.4235); // Example target coordinates

    // Linearly interpolate between startCoords and targetCoords based on normalizedLevel
    const newPosition = startCoords.clone().lerp(targetCoords, normalizedLevel);

    // Update the sphere position with the new coordinates (x, y, z)
    if (sphereRef.current) {
      sphereRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
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
      const camera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000); // 1 is the aspect ratio (square)
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(300, 600); // Set smaller size
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

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
        metalness: 0.1,  // More reflective
        roughness: 0.5,  // Shinier surface
        transparent: true,  // Enable transparency
        opacity: 0.8,       // Set opacity to 60%
      });

      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Create sphere (fixed size) and add it to the scene
      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(new THREE.Vector3(25.15, -8.62, -6.9)); // Initial position
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
    if (quantities) {
      updateSpherePosition(); // Update the sphere position based on quantities
    }
  }, [quantities]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px' }}>
      {!plyFile && (
        <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
          <input {...getInputProps()} />
          <p>Drag & drop a .ply file here</p>
        </div>
      )}
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

// // Trying something new
// import React, { useState, useRef, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import * as THREE from 'three';
// import { PLYLoader, OrbitControls } from 'three-stdlib';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

// function PlyViewer({ quantities, amplitude }) {
//   const [plyFiles, setPlyFiles] = useState([]); // State for multiple PLY files
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null); // Reference for the THREE.js scene
//   const cameraRef = useRef(null); // Reference for the camera
//   const rendererRef = useRef(null); // Reference for the renderer
//   const sphereRef = useRef(null); // Reference for the sphere
//   const controlsRef = useRef(null); // Ref for the OrbitControls

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



// import React, { useState, useRef, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import * as THREE from 'three';
// import { PLYLoader, OrbitControls } from 'three-stdlib';

// function PlyViewer({ quantities }) {
//   const [plyFile, setPlyFile] = useState(null);
//   const mountRef = useRef(null);
//   const sphereRef = useRef(null); // Ref for the sphere to update position dynamically
//   const controlsRef = useRef(null); // Ref for the OrbitControls

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: '.ply',
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0];
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPlyFile(reader.result);
//       };
//       reader.readAsArrayBuffer(file);
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
//     console.log(Object.keys(quantities));

//     Object.keys(quantities).forEach((key) => {
//       if (key === '0') {
//         return;
//       }
//       const level = keyLevels[key];
//       const quantity = parseFloat(quantities[key]);

//       // Check if quantity is a valid number
//       if (!isNaN(quantity)) {
//         totalQuantity += quantity;
//         weightedSum += level * quantity;
//       }
//     });

//     // Avoid division by zero
//     if (totalQuantity === 0) {
//       return 0; // Return a default vector level (0) if no valid quantities are found
//     }

//     return weightedSum / totalQuantity; // Return the average vector level
//   };

//   const updateSpherePosition = () => {
//     const vectorLevel = calculateVectorLevel();
//     console.log(vectorLevel);
//     // const newYPosition = -8.62 + vectorLevel * 1.5; // Adjust scale factor
//     const newZPosition = -8.62 + vectorLevel * 2.5; // Adjust scale factor
//     if (sphereRef.current) {
//       sphereRef.current.position.set(25.15, -8.62, newZPosition); // Only update Y-axis
//     }
//   };

//   useEffect(() => {
//     if (plyFile && mountRef.current) {
//       // Initialize scene, camera, and renderer only once
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       const renderer = new THREE.WebGLRenderer({ antialias: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       mountRef.current.appendChild(renderer.domElement);

//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//       scene.add(ambientLight);

//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//       directionalLight.position.set(5, 5, 5).normalize();
//       scene.add(directionalLight);

//       const loader = new PLYLoader();
//       const geometry = loader.parse(plyFile);
//       const material = new THREE.MeshStandardMaterial({
//         vertexColors: geometry.hasAttribute('color'),
//         flatShading: true,
//       });

//       geometry.computeVertexNormals();
//       const mesh = new THREE.Mesh(geometry, material);
//       scene.add(mesh);

//       // Create sphere (fixed size) and add it to the scene
//       const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
//       const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//       const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//       sphere.position.copy(new THREE.Vector3(25.15, -8.62, -6.9)); // Initial position
//       sphereRef.current = sphere; // Reference to the sphere for dynamic updates
//       scene.add(sphere);

//       // OrbitControls setup (only initialize once)
//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.enableDamping = true;
//       controls.dampingFactor = 0.1;
//       controls.rotateSpeed = 0.8;
//       controls.zoomSpeed = 0.5;
//       controlsRef.current = controls;

//       camera.position.set(0, 0, 30); // Zoomed out to start

//       const onWindowResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//       };
//       window.addEventListener('resize', onWindowResize);

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controls.update(); // Update OrbitControls
//         renderer.render(scene, camera);
//       };
//       animate();

//       return () => {
//         window.removeEventListener('resize', onWindowResize);
//         renderer.dispose();
//       };
//     }
//   }, [plyFile]);

//   useEffect(() => {
//     if (quantities) {
//       updateSpherePosition(); // Update the sphere position based on quantities
//     }
//   }, [quantities]);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
//         <input {...getInputProps()} />
//         <p>Drag & drop a .ply file here</p>
//       </div>
//       <div ref={mountRef} style={viewerStyle} />
//     </div>
//   );
// }

// const dropzoneStyle = {
//   width: '100%',
//   height: '150px',
//   border: '2px dashed #007bff',
//   borderRadius: '5px',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginBottom: '20px',
// };

// const viewerStyle = {
//   width: '100%',
//   height: '500px',
//   border: '1px solid #000',
// };

// export default PlyViewer;

import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader, OrbitControls } from 'three-stdlib';

function PlyViewer({ quantities, start = { x: 15.15, y: -8.62, z: -6.78 }, end = { x: 25.74, y: -6.59, z: -0.42 } }) {
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

      if (!isNaN(quantity)) {
        totalQuantity += quantity;
        weightedSum += level * quantity;
      }
    });

    if (totalQuantity === 0) {
      return 0;
    }

    return weightedSum / totalQuantity;
  };

  const updateSpherePosition = () => {
    const vectorLevel = calculateVectorLevel();

    if (sphereRef.current) {
      const t = vectorLevel * 0.1; // Scale `t` to move along the vector
      const newXPosition = start.x + t * (end.x - start.x);
      const newYPosition = start.y + t * (end.y - start.y);
      const newZPosition = start.z + t * (end.z - start.z);

      sphereRef.current.position.set(newXPosition, newYPosition, newZPosition);
    }
  };

  useEffect(() => {
    if (plyFile && mountRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      const loader = new PLYLoader();
      const geometry = loader.parse(plyFile);
      const material = new THREE.MeshStandardMaterial({
        vertexColors: geometry.hasAttribute('color'),
        flatShading: true,
      });

      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(new THREE.Vector3(start.x, start.y, start.z));
      sphereRef.current = sphere;
      scene.add(sphere);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.8;
      controls.zoomSpeed = 0.5;
      controlsRef.current = controls;

      camera.position.set(0, 0, 30);

      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onWindowResize);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
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
      updateSpherePosition();
    }
  }, [quantities]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop a .ply file here</p>
      </div>
      <div ref={mountRef} style={viewerStyle} />
    </div>
  );
}
const dropzoneStyle = {
  width: '100%',
  height: '150px',
  border: '2px dashed #007bff',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
};

const viewerStyle = {
  width: '100%',
  height: '500px',
  border: '1px solid #000',
};


export default PlyViewer;

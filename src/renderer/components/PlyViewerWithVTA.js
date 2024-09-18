import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as THREE from 'three';
import { PLYLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';

const PlyViewerWithVTA = () => {
  const [plyFile, setPlyFile] = useState(null);
  const mountRef = useRef(null);
  const [electrodePosition, setElectrodePosition] = useState({ position: new THREE.Vector3(0, 0, 0), direction: new THREE.Vector3(0, 0, 1) });
  const [activeContact, setActiveContact] = useState(2); // Let's assume contact 2 is active

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.ply',
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPlyFile(reader.result);
      };
      reader.readAsArrayBuffer(file);
    }
  });

  useEffect(() => {
    if (plyFile && mountRef.current) {
      // Set up scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      // Load and render PLY file (electrode)
      const loader = new PLYLoader();
      const geometry = loader.parse(plyFile);

      const material = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
      geometry.computeVertexNormals();
      const electrodeMesh = new THREE.Mesh(geometry, material);
      scene.add(electrodeMesh);

      // Find the electrode's position and orientation (Simplified estimation)
      const boundingBox = new THREE.Box3().setFromObject(electrodeMesh);
      const electrodeHeight = boundingBox.max.z - boundingBox.min.z;
      const electrodeCenter = boundingBox.getCenter(new THREE.Vector3());

      const electrodeDirection = new THREE.Vector3(0, 0, 1); // Assuming it's aligned along the z-axis

      setElectrodePosition({ position: electrodeCenter, direction: electrodeDirection });

      // Set up OrbitControls for zoom, pan, and rotate
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.maxPolarAngle = Math.PI / 2;
      camera.position.set(0, 0, 5);

      // Visualize Contacts: Assuming contacts are evenly spaced along the z-axis
      const numContacts = 4; // Example: 4 contacts
      const contactSpacing = electrodeHeight / numContacts;

      // Iterate and add a sphere for each contact
      for (let i = 0; i < numContacts; i++) {
        const contactGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const contactMaterial = new THREE.MeshStandardMaterial({
          color: i === activeContact ? 0xff0000 : 0x00ff00, // Highlight active contact in red
        });
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
        contactMesh.position.set(
          electrodeCenter.x,
          electrodeCenter.y,
          electrodeCenter.z + i * contactSpacing - electrodeHeight / 2
        ); // Adjust based on orientation
        scene.add(contactMesh);
      }

      // Visualize VTA for the active contact
      const vtaGeometry = new THREE.SphereGeometry(0.3, 32, 32); // Example VTA radius
      const vtaMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        opacity: 0.5,
        transparent: true,
      });
      const vtaMesh = new THREE.Mesh(vtaGeometry, vtaMaterial);
      vtaMesh.position.set(
        electrodeCenter.x,
        electrodeCenter.y,
        electrodeCenter.z + activeContact * contactSpacing - electrodeHeight / 2
      ); // Place at active contact
      scene.add(vtaMesh);

      // Animation loop to render the scene and controls
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Clean up on component unmount
      return () => {
        mountRef.current.removeChild(renderer.domElement);
      };
    }
  }, [plyFile, activeContact]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div {...getRootProps({ className: 'dropzone' })} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop a .ply file here</p>
      </div>
      <div ref={mountRef} style={viewerStyle} />
      <button onClick={() => setActiveContact((prev) => (prev + 1) % 4)}>Next Contact</button>
    </div>
  );
};

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

export default PlyViewerWithVTA;

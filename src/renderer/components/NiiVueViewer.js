import React, { useEffect, useRef } from 'react';
import { Niivue } from '@niivue/niivue';

const NiiVueViewer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize NiiVue with the canvas
    const nv = new Niivue({
      backColor: [0, 0, 0, 1], // Black background
      textColor: [1, 1, 1, 1], // White text
    });

    nv.attachToCanvas(canvasRef.current);

    // Optional: Set a placeholder message or customize the viewer
    console.log("NiiVue initialized without files");

    // You can later load files dynamically like this:
    // nv.loadVolumes([{ url: "path/to/file.nii.gz", name: "MyVolume" }]);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
      }}
    ></canvas>
  );
};

export default NiiVueViewer;

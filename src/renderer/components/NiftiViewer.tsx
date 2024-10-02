import React, { useState } from 'react';
import * as nifti from 'nifti-reader-js';
import { Niivue } from 'niivue-react'; // Niivue can now be used in a .tsx file

const NiftiViewer: React.FC = () => {
  const [volume, setVolume] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        processNiftiFile(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processNiftiFile = (data: ArrayBuffer) => {
    let niftiHeader = null;
    let niftiImage = null;

    if (nifti.isCompressed(data)) {
      data = nifti.decompress(data);
    }

    if (nifti.isNIFTI(data)) {
      niftiHeader = nifti.readHeader(data);
      niftiImage = nifti.readImage(niftiHeader, data);

      const volumeData = {
        dataArray: new Uint8Array(niftiImage),
        dims: [niftiHeader.dims[1], niftiHeader.dims[2], niftiHeader.dims[3]],
        pixDims: [
          niftiHeader.pixDims[1],
          niftiHeader.pixDims[2],
          niftiHeader.pixDims[3],
        ],
        name: 'Volume',
      };

      setVolume(volumeData);
    } else {
      console.error('The selected file is not a valid NIfTI file.');
    }
  };

  return (
    <div>
      <label htmlFor="fileInput">Select a NIfTI File:</label>
      <input
        id="fileInput"
        type="file"
        accept=".nii,.nii.gz"
        onChange={handleFileChange}
      />
      <div style={{ width: '100%', height: '100vh' }}>
        {volume && (
          <Niivue volumes={[volume]} options={{ isOrientCube: true }} />
        )}
      </div>
    </div>
  );
};

export default NiftiViewer;

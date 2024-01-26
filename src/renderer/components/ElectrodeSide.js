import React, { useState } from 'react';
// import './ElectrodeIPGSelection.css';
import BostonCartesia from './electrode_models/BostonCartesia';
import ElectrodeIPGSelection from './ElectrodeIPGSelection';


function ElectrodeSide() {
  const [selectedElectrode, setSelectedElectrode] = useState('');
  const [selectedIPG, setSelectedIPG] = useState('');

  const electrodeOptions = ['left', 'right'];
  const ipgOptions = ['Boston Scientific', 'Medtronic', ''];

  const handleElectrodeChange = (event) => {
    setSelectedElectrode(event.target.value);
  };

  const testElectrodeOptions = {
    Left: <ElectrodeIPGSelection />,
    Right: <ElectrodeIPGSelection />,
  };

  const handleIPGChange = (event) => {
    setSelectedIPG(event.target.value);
  };

  const selectedThing = testElectrodeOptions[selectedElectrode];

  return (
    <div className="form-container">
      <h2>Electrode Side Selection</h2>
      {/* <div>
        <label htmlFor="electrodeSelect">Select an Electrode</label>
        <select
          id="electrodeSelect"
          onChange={handleElectrodeChange}
          value={selectedElectrode}
        >
          <option value="">Select an Electrode</option>
          {electrodeOptions.map((electrode, index) => (
            <option key={index} value={electrode}>
              {electrode}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ipgSelect">Select an IPG</label>
        <select id="ipgSelect" onChange={handleIPGChange} value={selectedIPG}>
          <option value="">Select an IPG</option>
          {ipgOptions.map((ipg, index) => (
            <option key={index} value={ipg}>
              {ipg}
            </option>
          ))}
        </select>
      </div> */}
      <div>
        {/* <label htmlFor="electrodeSelect">Select an Electrode</label> */}
        <select value={selectedElectrode} onChange={handleElectrodeChange}>
          <option value="">Select an option</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>

        {selectedThing}
      </div>
    </div>
  );
}

function BostonCartesiax() {
  const images = [
    { key: 'image1', src: './electrode_models/images/ElectrodeContact.png' },
    { key: 'image2', src: './electrode_models/images/ElectrodeContact.png' },
    { key: 'image3', src: './electrode_models/images/ElectrodeContact.png' },
    // Add more images with keys and src values here
  ];

  return (
    <div>
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image.src} alt={image.key} className="image" />
          <p className="image-key">{image.key}</p>
        </div>
      ))}
    </div>
  );
}

// function BostonCartesiax() {
//   return <div>Boston</div>;
// }

function ImageRenderer({ images }) {
  return (
    <div className="image-list">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image.src} alt={image.key} className="image" />
          <p className="image-key">{image.key}</p>
        </div>
      ))}
    </div>
  );
}

function ComponentMapper({ selectedElectrode }) {
  const electrodeMap = {
    'Boston Scientific Cartesia': BostonCartesia,
    'Boston Scientific Cartesiax': BostonCartesiax,
  };

  const SelectedElectrodeComponent = electrodeMap[selectedElectrode];

  return (
    <div>
      {SelectedElectrodeComponent && <SelectedElectrodeComponent />}
      <ImageRenderer
        images={
          SelectedElectrodeComponent ? SelectedElectrodeComponent.images : []
        }
      />
    </div>
  );
}

export default ElectrodeSide;

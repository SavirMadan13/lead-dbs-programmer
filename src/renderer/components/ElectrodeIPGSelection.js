import React, { useState } from 'react';
import './ElectrodeIPGSelection.css';
import BostonCartesia from './electrode_models/BostonCartesia';

function ElectrodeIPGSelection() {
  const [selectedElectrode, setSelectedElectrode] = useState('');
  const [selectedIPG, setSelectedIPG] = useState('');

  const electrodeOptions = [
    'Boston Scientific Cartesia',
    'Boston Scientific Cartesiax',
    'Electrode B',
    'Electrode C',
  ];
  const ipgOptions = ['Boston Scientific', 'Medtronic', ''];

  const handleElectrodeChange = (event) => {
    setSelectedElectrode(event.target.value);
  };

  const testElectrodeOptions = {
    BostonCartesia: <BostonCartesia />,
  };

  const handleIPGChange = (event) => {
    setSelectedIPG(event.target.value);
  };

  const selectedThing = testElectrodeOptions[selectedElectrode];

  return (
    <div className="form-container">
      <h2>Electrode Selection</h2>
      <div>
        {/* <label htmlFor="electrodeSelect">Select an Electrode</label> */}
        <select value={selectedElectrode} onChange={handleElectrodeChange}>
          <option value="">Select an option</option>
          <option value="BostonCartesia">Boston Scientific Cartesia</option>
        </select>

        {selectedThing}
      </div>
    </div>
  );
}

export default ElectrodeIPGSelection;

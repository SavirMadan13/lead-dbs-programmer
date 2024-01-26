/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import './StimulationParameters.css';

function StimulationParameters() {
  const [leftElectrode, setLeftElectrode] = useState('');
  const [rightElectrode, setRightElectrode] = useState('');
  const [parameters, setParameters] = useState({
    parameter1: '60',
    parameter2: '130',
    parameter3: '0',
  });

  const handleParameterChange = (parameter) => (e) => {
    const newValue = e.target.value;
    setParameters((prevParams) => ({
      ...prevParams,
      [parameter]: newValue,
    }));
  };

  const handleLeftElectrodeChange = (e) => {
    const selectedLeftElectrode = e.target.value;
    setLeftElectrode(selectedLeftElectrode);
  };

  const handleRightElectrodeChange = (e) => {
    const selectedRightElectrode = e.target.value;
    setRightElectrode(selectedRightElectrode);
  };

  const saveParameters = () => {
    fetch('/save-parameters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="StimulationParameters">
      <div className="form-container">
        {/* <h2>Stimulation Parameters</h2> */}
        <label className="label">Pulsewidth (us):</label>
        <input
          type="text"
          className="input-field"
          value={parameters.parameter1}
          onChange={handleParameterChange('parameter1')}
        />
        <label className="label">Frequency (Hz):</label>
        <input
          type="text"
          className="input-field"
          value={parameters.parameter2}
          onChange={handleParameterChange('parameter2')}
        />
        {/* <label className="label">Amplitude (mA):</label>
        <input
          type="text"
          className="input-field"
          value={parameters.parameter3}
          onChange={handleParameterChange('parameter3')}
        /> */}
        {/* <button className="save-button" onClick={saveParameters}>
          Save
        </button> */}
      </div>
      <select
          value={leftElectrode}
          onChange={(e) => handleLeftElectrodeChange(e)}
        >
          <option value="">Choose Left Electrode</option>
          <option value="BostonCartesia">Boston Scientific Cartesia</option>
          <option value="Medtronic3389">Medtronic 3389</option>
          <option value="BostonCartesiaTest">Boston Cartesia Test</option>
          <option value="NewBostonCartesiaTest">New Boston Cartesia Test</option>
          <option value="AbbottDirectedTest">Abbott Directed</option>
        </select>

        <select
          value={rightElectrode}
          onChange={(e) => handleRightElectrodeChange(e)}
        >
          <option value="">Choose Right Electrode</option>
          <option value="BostonCartesia">Boston Scientific Cartesia</option>
          <option value="Medtronic3389">Medtronic 3389</option>
          <option value="BostonCartesiaTest">Boston Cartesia Test</option>
        </select>
    </div>
  );
}

export default StimulationParameters;


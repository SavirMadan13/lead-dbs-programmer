import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import data from './sub-SEEG73_desc-reconstruction.json';

// Define styles for the grid and checkbox
const useStyles = makeStyles({
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    padding: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '5px',
    boxSizing: 'border-box',
    color: 'black',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
});

console.log(data);

function SEEG() {
  const classes = useStyles();
  // const electrodeNames = [
  //   'LACC',
  //   'LAHIPP',
  //   'LAMY',
  //   'LENT',
  //   'LHG',
  //   'LITG',
  //   'LOFC',
  //   'LPLANINS',
  //   'LRHIPP',
  //   'LSMAAINS',
  //   'LSTGPHP',
  //   'LTP',
  //   'LTPO',
  //   'RAHIPP',
  //   'RAMY',
  //   'RPHIPP',
  // ];
  // const electrodeModels = [
  //   'DIXI D08-08AM',
  //   'DIXI D08-10AM',
  //   'DIXI D08-12AM',
  //   'DIXI D08-10AM',
  //   'DIXI D08-08AM',
  //   'DIXI D08-12AM',
  //   'DIXI D08-15AM',
  //   'DIXI D08-12AM',
  //   'DIXI D08-08AM',
  //   'DIXI D08-10AM',
  //   'DIXI D08-10AM',
  //   'DIXI D08-08AM',
  //   'DIXI D08-08AM',
  //   'DIXI D08-15AM',
  //   'DIXI D08-10AM',
  //   'DIXI D08-10AM',
  // ];

  const electrodeNames = data.map((item) => item.elname);
  const electrodeModels = data.map((item) => item.multiple_elmodel);

  const [selectedElectrode, setSelectedElectrode] = useState(electrodeNames[0]);

  const getNumberOfContacts = () => {
    const index = electrodeNames.indexOf(selectedElectrode);
    const model = electrodeModels[index];
    const match = model.match(/(\d+)AM$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Function to generate contact names based on the number of contacts
  // const generateContactNames = () => {
  //   const numContacts = getNumberOfContacts();
  //   return Array.from({ length: numContacts }, (_, i) => `A${i + 1}`);
  // };

  // Example: Set contact names based on a specific electrode's number of contacts
  // const contactNames = generateContactNames(); // Replace 16 with the desired number of contacts

  const generateContactNames = () => {
    const index = electrodeNames.indexOf(selectedElectrode);
    return data[index].labels[0];
  };

  const contactNames = generateContactNames();

  const [variableNames, setVariableNames] = useState([
    'Variable1',
    'Variable2',
  ]); // Example variable names
  const [electrodeSets, setElectrodeSets] = useState(
    electrodeNames.reduce((acc, electrode) => {
      acc[electrode] = [
        {
          contacts: [],
          amplitude: '',
          amplitudeUnit: 'mA',
          pulseWidth: '',
          variableValues: {}, // Store values for each variable name
        },
      ];
      return acc;
    }, {}),
  );

  const handleElectrodeChange = (event) => {
    setSelectedElectrode(event.target.value);
  };

  const handleContactChange = (index, event) => {
    const contact = event.target.name;
    setElectrodeSets((prevSets) => {
      const currentSet = prevSets[selectedElectrode][index];
      const updatedContacts = currentSet.contacts.includes(contact)
        ? currentSet.contacts.filter((c) => c !== contact)
        : [...currentSet.contacts, contact];
      const updatedSet = { ...currentSet, contacts: updatedContacts };
      const updatedSets = [...prevSets[selectedElectrode]];
      updatedSets[index] = updatedSet;
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const handleAmplitudeChange = (index, event) => {
    const value = event.target.value;
    setElectrodeSets((prevSets) => {
      const updatedSet = {
        ...prevSets[selectedElectrode][index],
        amplitude: value,
      };
      const updatedSets = [...prevSets[selectedElectrode]];
      updatedSets[index] = updatedSet;
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const handlePulseWidthChange = (index, event) => {
    const value = event.target.value;
    setElectrodeSets((prevSets) => {
      const updatedSet = {
        ...prevSets[selectedElectrode][index],
        pulseWidth: value,
      };
      const updatedSets = [...prevSets[selectedElectrode]];
      updatedSets[index] = updatedSet;
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const handleAmplitudeUnitChange = (index, event) => {
    const value = event.target.value;
    setElectrodeSets((prevSets) => {
      const updatedSet = {
        ...prevSets[selectedElectrode][index],
        amplitudeUnit: value,
      };
      const updatedSets = [...prevSets[selectedElectrode]];
      updatedSets[index] = updatedSet;
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const handleVariableValueChange = (index, varName, event) => {
    const value = event.target.value;
    setElectrodeSets((prevSets) => {
      const updatedVariableValues = {
        ...prevSets[selectedElectrode][index].variableValues,
        [varName]: value,
      };
      const updatedSet = {
        ...prevSets[selectedElectrode][index],
        variableValues: updatedVariableValues,
      };
      const updatedSets = [...prevSets[selectedElectrode]];
      updatedSets[index] = updatedSet;
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const addSet = () => {
    setElectrodeSets((prevSets) => ({
      ...prevSets,
      [selectedElectrode]: [
        ...prevSets[selectedElectrode],
        {
          contacts: [],
          amplitude: '',
          amplitudeUnit: 'mA',
          pulseWidth: '',
          variableValues: {},
        },
      ],
    }));
  };

  const removeSet = (index) => {
    setElectrodeSets((prevSets) => {
      const updatedSets = prevSets[selectedElectrode].filter(
        (_, i) => i !== index,
      );
      return {
        ...prevSets,
        [selectedElectrode]: updatedSets,
      };
    });
  };

  const addVariableName = () => {
    setVariableNames((prevNames) => [
      ...prevNames,
      `Variable${prevNames.length + 1}`,
    ]);
  };

  return (
    <div>
      <FormControl>
        <InputLabel id="electrode-select-label">Choose an electrode</InputLabel>
        <Select
          labelId="electrode-select-label"
          id="electrode-select"
          value={selectedElectrode}
          label="Choose an electrode"
          onChange={handleElectrodeChange}
        >
          {electrodeNames.map((electrode, index) => (
            <MenuItem key={electrode} value={electrode}>
              {electrode} - {electrodeModels[index]}
            </MenuItem>
          ))}
          {/* {electrodeNames.map((electrode) => (
            <MenuItem key={electrode} value={electrode}>
              {electrode}
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>
      <div style={{ marginRight: '-200px' }}>
        {variableNames.map((varName, varIndex) => (
          <TextField
            key={varIndex}
            label={`Variable Name ${varIndex + 1}`}
            value={varName}
            onChange={(event) => {
              const newName = event.target.value;
              setVariableNames((prevNames) => {
                const updatedNames = [...prevNames];
                updatedNames[varIndex] = newName;
                return updatedNames;
              });
            }}
            margin="normal"
          />
        ))}
      </div>
      <Button onClick={addVariableName} variant="contained" color="primary">
        Add Variable Name
      </Button>
      <div></div>
      {electrodeSets[selectedElectrode].map((set, index) => (
        <div key={index} className={classes.rowContainer}>
          <FormControl>
            <InputLabel id={`contact-select-label-${index}`}>
              Select Contacts
            </InputLabel>
            <Select
              labelId={`contact-select-label-${index}`}
              id={`contact-select-${index}`}
              multiple
              value={set.contacts}
              renderValue={(selected) => selected.join(', ')}
            >
              <div className={classes.gridContainer}>
                {contactNames.map((contact) => (
                  <FormControlLabel
                    key={contact}
                    control={
                      <Checkbox
                        checked={set.contacts.includes(contact)}
                        onChange={(event) => handleContactChange(index, event)}
                        name={contact}
                        color="primary"
                      />
                    }
                    label={contact}
                    classes={{ label: classes.checkboxLabel }}
                  />
                ))}
              </div>
            </Select>
          </FormControl>
          <TextField
            label={`Amplitude (${set.amplitudeUnit})`}
            value={set.amplitude}
            onChange={(event) => handleAmplitudeChange(index, event)}
            margin="normal"
          />
          <FormControl margin="normal">
            <InputLabel id={`amplitude-unit-select-label-${index}`}>
              Amplitude Unit
            </InputLabel>
            <Select
              labelId={`amplitude-unit-select-label-${index}`}
              id={`amplitude-unit-select-${index}`}
              value={set.amplitudeUnit}
              onChange={(event) => handleAmplitudeUnitChange(index, event)}
            >
              <MenuItem value="mA">mA</MenuItem>
              <MenuItem value="V">V</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Pulse Width"
            value={set.pulseWidth}
            onChange={(event) => handlePulseWidthChange(index, event)}
            margin="normal"
          />
          <div >
            {variableNames.map((varName, varIndex) => (
              <TextField
                key={varIndex}
                label={`Value for ${varName}`}
                value={set.variableValues[varName] || ''}
                onChange={(event) => handleVariableValueChange(index, varName, event)}
                margin="normal"
              />
            ))}
          </div>
          {index === 0 && (
            <Button onClick={addSet} variant="contained" color="primary">
              +
            </Button>
          )}
          <Button
            onClick={() => removeSet(index)}
            variant="contained"
            color="secondary"
            disabled={electrodeSets[selectedElectrode].length === 1}
          >
            -
          </Button>
        </div>
      ))}
    </div>
  );
}

export default SEEG;

import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import * as XLSX from 'xlsx'; // Import xlsx for Excel parsing
import { PatientContext } from './PatientContext';
import initializeS from './InitializeS';
import electrodeData from './electrodeModels.json';

function Import({ leadDBS }) {
  const allPatients = useContext(PatientContext);
  const [timeline, setTimeline] = useState('');
  const navigate = useNavigate();

  function parseStimulationParameters(row) {
    const label = row.Label;
    const electrodeModelR = row.ElectrodeModel_R;
    const electrodeModelL = row.ElectrodeModel_L;

    // Get electrode configurations for both hemispheres
    const configR = electrodeData[electrodeModelR];
    const configL = electrodeData[electrodeModelL];

    // Initialize S using numel from the electrode configurations
    const S = initializeS(label, configR.numel);

    // Helper function to process contacts
    const processContacts = (contacts, polarity, hemisphere, config, source) => {
      const isDirected = config.isdirected === 1;
      const etageIdx = isDirected ? config.etageidx : null;
      const contactNames = config.contactnames;

      // Parse the contacts
      const parsedContacts = contacts.split('/').map((entry) => {
        const [contact, percentage] = entry.split(',').map((x) => x.trim());
        const percValue = percentage
          ? parseFloat(percentage.replace('%', ''))
          : null; // Use null if percentage not specified
        return { contact, percValue };
      });

      // Calculate percentages for contacts
      let totalPerc = 0;
      const missingPerc = [];
      parsedContacts.forEach(({ contact, percValue }) => {
        if (percValue === null) {
          missingPerc.push(contact);
        } else {
          totalPerc += percValue;
        }
      });

      const defaultPerc = missingPerc.length > 0 ? (100 - totalPerc) / missingPerc.length : 0;

      // Process each contact
      parsedContacts.forEach(({ contact, percValue }) => {
        const perc = percValue === null ? defaultPerc : percValue;
        const contactLevel = contact.replace(/[^\d]/g, ''); // Extract level

        if (isDirected && etageIdx.some((range) => range.includes(contactLevel))) {
          // Evenly distribute percentage among directional sub-contacts
          const levelContacts = contactNames.filter((name) =>
            name.includes(contactLevel)
          );
          const distributedPerc = perc / levelContacts.length;

          levelContacts.forEach((contactName) => {
            const contactIdx = contactName.replace(/[^\dA-Z]/g, '');
            S[`${hemisphere}s${source}`][`k${contactIdx}`] = {
              perc: distributedPerc,
              pol: polarity,
              imp: 1,
            };
          });
        } else {
          // Non-directional contact or entire level
          const contactIdx = contact.replace(/[^\d]/g, '');
          S[`${hemisphere}s${source}`][`k${contactIdx}`] = {
            perc,
            pol: polarity,
            imp: 1,
          };
        }
      });
    };

    for (let source = 1; source <= configR.numel; source++) {
      // Parse Right Hemisphere
      const rightNegative = row[`Right_${source}_Negative`];
      const rightPositive = row[`Right_${source}_Positive`];
      const rightAmpInput = row[`Right_${source}_Amp`];

      if (rightAmpInput) {
        const ampValue = parseFloat(rightAmpInput.replace(/[^\d.]/g, '')); // Extract amplitude
        const unit = rightAmpInput.includes('mA') ? 2 : 1; // Determine unit (mA or V)
        S[`Rs${source}`].amp = ampValue;
        S[`Rs${source}`].va = unit;
      }

      if (rightNegative) {
        processContacts(rightNegative, -1, 'R', configR, source);
      }

      if (rightPositive) {
        processContacts(rightPositive, 1, 'R', configR, source);

        // Reset case if positive contacts exist
        S[`Rs${source}`].case = { perc: 0, pol: 0 };
      }

      // Parse Left Hemisphere
      const leftNegative = row[`Left_${source}_Negative`];
      const leftPositive = row[`Left_${source}_Positive`];
      const leftAmpInput = row[`Left_${source}_Amp`];

      if (leftAmpInput) {
        const ampValue = parseFloat(leftAmpInput.replace(/[^\d.]/g, ''));
        const unit = leftAmpInput.includes('mA') ? 2 : 1;
        S[`Ls${source}`].amp = ampValue;
        S[`Ls${source}`].va = unit;
      }

      if (leftNegative) {
        processContacts(leftNegative, -1, 'L', configL, source);
      }

      if (leftPositive) {
        processContacts(leftPositive, 1, 'L', configL, source);

        // Reset case if positive contacts exist
        S[`Ls${source}`].case = { perc: 0, pol: 0 };
      }
    }

    return S;
  }


  const parseStimulations = (sheetData) => {
    const parsedData = sheetData.map((row) => {
      const patientID = row.PatientID;
      const S = parseStimulationParameters(row);
      return { patientID, S, timeline };
    });
    console.log('Parsed Stimulation Data:', parsedData);
  };
  // Clinical Scores

  function restructurePatientData(data) {
    // Extract Patient ID and Timeline
    const id = data.PatientID;
    const { timeline } = data;

    // Filter out the scores by excluding non-score keys
    const scores = Object.keys(data)
      .filter((key) => key !== 'PatientID' && key !== 'timeline')
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

    // Return the restructured object
    return {
      id,
      timeline,
      scores,
    };
  }

  // Submit data to main process
  const handleSubmit = (sheetData) => {
    if (!timeline || sheetData.length === 0) {
      alert('Please provide a timeline and import data!');
      return;
    }

    const patientData = sheetData.map((entry) => ({
      ...entry,
      timeline,
    }));

    const processedData = {};
    Object.keys(patientData).forEach((key) => {
      processedData[key] = restructurePatientData(patientData[key]);
    });

    console.log(processedData);
    window.electron.ipcRenderer.sendMessage(
      'batch-import',
      processedData,
      leadDBS,
    );

    alert('Data submitted successfully!');
  };

  // Parse Excel file
  const parseFile = (uploadedFile, fileType) => {
    if (!uploadedFile) {
      alert('Please select a file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (fileType === 'clinical') {
        handleSubmit(sheetData);
      } else {
        parseStimulations(sheetData);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleStimulationParametersExcel = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      parseFile(uploadedFile);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      parseFile(uploadedFile, 'clinical');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Batch Patient Import</h2>
      <label>
        Timeline:
        <input
          type="text"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          placeholder="Enter timeline (no spaces)"
        />
      </label>
      <br />
      <label>
        Import Excel File:
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </label>
      <br />
      <br />
      <label>
        Import Excel File:
        <input type="file" accept=".xlsx, .xls" onChange={handleStimulationParametersExcel} />
      </label>
      <br />
      <button className="button" onClick={() => navigate(-1)}>
        Back to Patient Details
      </button>
    </div>
  );
}

export default Import;

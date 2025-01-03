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

  const contactMapper = (level, value, etageidx) => {
    const contactMapping = {
      a: 0,
      b: 1,
      c: 2,
    };

    // Parse etageidx to handle ranges like '2:4'
    const parseEtageIdx = (etage) => {
      if (etage.includes(':')) {
        const [start, end] = etage.split(':').map(Number);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
      return [parseInt(etage, 10)];
    };

    const etageLevel = parseEtageIdx(etageidx[level - 1]);
    const contactValue = etageLevel[contactMapping[value]];

    console.log(level, value, contactValue);
    return contactValue;
  };

  // Helper function to process contacts
  const processContacts = (
    S,
    contacts,
    polarity,
    hemisphere,
    config,
    source,
  ) => {
    const isDirected = config.isdirected === 1;
    const etageIdx = isDirected
      ? config.etageidx
      : Array.from({ length: config.numel }, (_, i) => i + 1);

    console.log('Config', electrodeData);

    // Define a mapping from contact names to indices
    const contactMapping = {
      1: '1',
      '2a': '2',
      '2b': '3',
      '2c': '4',
      '3a': '5',
      '3b': '6',
      '3c': '7',
      4: '8',
    };
    // Parse the contacts
    const parsedContacts = contacts
      .split('/')
      .map((entry) => {
        let [contact, percentage] = entry.split(',').map((x) => x.trim());
        const percValue = percentage
          ? parseFloat(percentage.replace('%', ''))
          : 100 / contacts.split('/').length; // Use 100 / length of contacts if percentage not specified

        contact = contact.replace(/[+-]$/, '');
        if (contact === 'C') {
          return { contact: 'C', percValue };
        }
        if (/[a-z]/.test(contact)) {
          // If contact is like "2ab", split and distribute percentage
          const contactParts = contact.split(/(?=[a-z])/);
          const level = parseInt(contactParts.shift(), 10);
          console.log('Contact Parts', contactParts, contact);
          // const mappedContacts = contactParts.map((part) => {
          //   return contactMapper(level, part, etageIdx, percValue);
          // });
          // return contactParts.map((part) => ({
          //   contact: part,
          //   percValue: percValue / contactParts.length,
          // }));
          return contactParts.map((part) => {
            const mappedContact = contactMapper(level, part, etageIdx);
            return {
              contact: mappedContact,
              percValue: percValue / contactParts.length,
            };
          });
        }
        if (isDirected) {
          console.log('Contact', contact);
          const level = parseInt(contact, 10);
          console.log('Level', level);
          const etageValue = etageIdx[level - 1];
          console.log('Etage Value', etageValue);
          if (etageValue.includes(':')) {
            const [start, end] = etageValue.split(':').map(Number);
            const etageContacts = Array.from(
              { length: end - start + 1 },
              (_, i) => (start + i).toString(),
            );
            return etageContacts.map((etageContact) => ({
              contact: etageContact,
              percValue: percValue / etageContacts.length,
            }));
          }
          return {
            contact: parseInt(etageValue, 10),
            percValue,
          };
        }

        return { contact, percValue };
      })
      .flat(); // Flatten the array in case of split contacts

    console.log(parsedContacts);

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

    console.log(missingPerc);
    console.log(totalPerc);

    const defaultPerc =
      missingPerc.length > 0 ? (100 - totalPerc) / missingPerc.length : 0;

    // Process each contact
    parsedContacts.forEach(({ contact, percValue }) => {
      const percentage = percValue === null ? defaultPerc : percValue;
      if (contact === 'C') {
        console.log('case');
        S[`${hemisphere}s${source}`].case = {
          perc: 100,
          pol: polarity === -1 ? 1 : 2,
        };
      } else {
        // S[`${hemisphere}s${source}`].case = {
        //   perc: 0,
        //   pol: polarity === 0,
        // };
        S[`${hemisphere}s${source}`][`k${contact}`] = {
          perc: percentage,
          pol: polarity === -1 ? 1 : 2,
          imp: 1,
        };
      }
    });

    return S;
  };

  function parseStimulationParameters(row) {
    const label = row.Label;
    const electrodeModelR = row.ElectrodeModel_R;
    const electrodeModelL = row.ElectrodeModel_L;

    // Get electrode configurations for both hemispheres

    // Will eventually need to put the contact parser in here
    const configR = electrodeData[electrodeModelR];
    const configL = electrodeData[electrodeModelL];

    // Initialize S using numel from the electrode configurations
    let S = initializeS(label, configR.numel);

    for (let source = 1; source <= 4; source++) {
      // Parse Right Hemisphere
      const rightNegative = row[`Right_${source}_Negative`];
      const rightPositive = row[`Right_${source}_Positive`];
      const rightAmpInput = row[`Right_${source}_Amp`];
      S[`Rs${source}`].case = { perc: 0, pol: 0 };
      S[`Ls${source}`].case = { perc: 0, pol: 0 };
      if (rightAmpInput) {
        const ampValue = parseFloat(rightAmpInput.replace(/[^\d.]/g, '')); // Extract amplitude
        const unit = rightAmpInput.includes('mA') ? 2 : 1; // Determine unit (mA or V)
        S[`Rs${source}`].amp = ampValue;
        S[`Rs${source}`].va = unit;
      }

      if (rightNegative) {
        console.log('Right Negative', rightNegative);
        S = processContacts(S, rightNegative, -1, 'R', configR, source);
      }

      if (rightPositive) {
        console.log('Right Positive', rightPositive);
        S = processContacts(S, rightPositive, 1, 'R', configR, source);

        // Reset case if positive contacts exist
        // S[`Rs${source}`].case = { perc: 0, pol: 0 };
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
        console.log('Left Negative', leftNegative);
        S = processContacts(S, leftNegative, -1, 'L', configL, source);
      }

      if (leftPositive) {
        console.log('Left Positive', leftPositive);
        S = processContacts(S, leftPositive, 1, 'L', configL, source);

        // Reset case if positive contacts exist
        // S[`Ls${source}`].case = { perc: 0, pol: 0 };
      }
    }

    return S;
  }

  const parseStimulations = (sheetData) => {
    const parsedData = sheetData.map((row) => {
      const patientID = row.PatientID;
      const S = parseStimulationParameters(row);
      return { id: patientID, S, timeline: S.label };
    });
    console.log('Parsed Stimulation Data:', parsedData);
    window.electron.ipcRenderer.sendMessage(
      'batch-import-stimulation',
      parsedData,
      leadDBS,
    );
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
      e.target.value = ''; // Reset the file input
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      parseFile(uploadedFile, 'clinical');
      e.target.value = ''; // Reset the file input
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
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleStimulationParametersExcel}
        />
      </label>
      <br />
      <button className="button" onClick={() => navigate(-1)}>
        Back to Patient Details
      </button>
    </div>
  );
}

export default Import;

import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import * as XLSX from 'xlsx';
import DatabasePlot from './DatabasePlot';
import GroupAveragePlot from './GroupAveragePlot';
import { PatientContext } from './PatientContext';
import GroupLateralityAnalysisPlot from './GroupLateralityAnalysisPlot';
import GroupSubscoreAnalysisPlot from './GroupSubscoreAnalysisPlot';

function DatabaseStats({ directoryPath }) {
  const { patients } = useContext(PatientContext); // Optional: Use context for patient data
  console.log(patients);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisType, setAnalysisType] = useState('all');
  // const { directoryPath } = location.state || {};
  console.log(directoryPath);
  const [clinicalTimelines, setClinicalTimelines] = useState(null);
  const [clinicalDataForPlotting, setClinicalDataForPlotting] = useState(null);
  const [tremorPts, setTremorPts] = useState([]);
  const [bradykinesiaPts, setBradykinesiaPts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('none');

  const bradykinesiaItems = [
    '3.4a: Finger tapping- Right hand',
    '3.4b: Finger tapping- Left hand',
    '3.5a: Hand movements- Right hand',
    '3.5b: Hand movements- Left hand',
    '3.6a: Pronation- supination movements- Right hand',
    '3.6b: Pronation- supination movements- Left hand',
    '3.7a: Toe tapping- Right foot',
    '3.7b: Toe tapping- Left foot',
    '3.8a: Leg agility- Right leg',
    '3.8b: Leg agility- Left leg',
    '3.14: Global spontaneity of movement',
  ];

  const rigidityItems = [
    '3.3a: Rigidity- Neck',
    '3.3b: Rigidity- RUE',
    '3.3c: Rigidity- LUE',
    '3.3d: Rigidity- RLE',
    '3.3e: Rigidity- LLE',
  ];

  const tremorItems = [
    '3.15a: Postural tremor- Right hand',
    '3.15b: Postural tremor- Left hand',
    '3.16a: Kinetic tremor- Right hand',
    '3.16b: Kinetic tremor- Left hand',
    '3.17a: Rest tremor amplitude- RUE',
    '3.17b: Rest tremor amplitude- LUE',
    '3.17c: Rest tremor amplitude- RLE',
    '3.17d: Rest tremor amplitude- LLE',
    '3.17e: Rest tremor amplitude- Lip/jaw',
    '3.18: Constancy of rest tremor',
  ];

  const axialItems = [
    '3.1: Speech',
    '3.2: Facial expression',
    '3.9: Arising from chair',
    '3.10: Gait',
    '3.11: Freezing of gait',
    '3.12: Postural stability',
    '3.13: Posture',
  ];
  // useEffect(() => {
  //   if (directoryPath) {
  //     // Request timelines from the main process
  //     window.electron.ipcRenderer
  //       .invoke('get-timelines', directoryPath, patients[0].id, true)
  //       .then((receivedTimelines) => {
  //         const timelineNames = receivedTimelines.map(
  //           (timelineData) => timelineData.timeline
  //         );
  //         console.log(timelineNames);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching timelines:', error);
  //       });
  //   }
  // }, [directoryPath, patients]);

  useEffect(() => {
    if (directoryPath && filteredPatients.length > 0) {
      // Create an array of promises to fetch timelines for each patient
      const timelinePromises = filteredPatients.map((patient) =>
        window.electron.ipcRenderer.invoke(
          'get-timelines',
          directoryPath,
          patient.id,
          true,
        ),
      );

      Promise.all(timelinePromises)
        // eslint-disable-next-line promise/always-return
        .then((allReceivedTimelines) => {
          // Map over each patient's timelines and filter for timelines with hasClinical = true
          const allFilteredTimelineNames = allReceivedTimelines.map(
            (receivedTimelines) =>
              receivedTimelines
                .filter((timelineData) => timelineData.hasClinical)
                .map((timelineData) => timelineData.timeline),
          );

          const patientsArray = Object.keys(filteredPatients); // Get patient IDs as an array
          const patientsWithTimelines = patientsArray.map(
            (patientID, index) => ({
              id: filteredPatients[index].id,
              timelines: allFilteredTimelineNames[index] || [], // Get timelines from `allFilteredTimelineNames`
            }),
          );
          console.log(patientsWithTimelines);
          setClinicalTimelines(patientsWithTimelines); // Logs only the timelines with hasClinical = true for each patient
        })
        .catch((error) => {
          console.error('Error fetching timelines for all patients:', error);
        });
    }
  }, [directoryPath, filteredPatients]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-clinical-data', directoryPath, clinicalTimelines)
      // eslint-disable-next-line promise/always-return
      .then((clinicalData) => {
        console.log('Clinical Data: ', clinicalData); // Process the received clinical data
        setClinicalDataForPlotting(clinicalData);
      })
      .catch((error) => {
        console.error('Error retrieving clinical data:', error);
      });
  }, [clinicalTimelines]);

  window.electron.ipcRenderer.sendMessage(
    'database-group-figures',
    directoryPath,
  );
  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const importedScores = {};

      const handleGetTimelines = (arg) => {
        console.log('Timelines: ', arg);
      };

      const handleImportFile = (arg) => {
        console.log('Import file: ', arg);
      };

      window.electron.ipcRenderer.once(
        'database-group-figures',
        handleImportFile,
      );
    } else {
      console.error('ipcRenderer is not available');
    }
  }, []);

  // Excel plotting

  const handleExportToExcel = () => {
    // Prepare the data for export
    const exportData = [];

    clinicalDataForPlotting.forEach((patientData) => {
      const { id, clinicalData } = patientData;

      Object.keys(clinicalData).forEach((timeline) => {
        const timelineData = clinicalData[timeline];

        exportData.push({
          PatientID: id,
          Timeline: timeline,
          ...timelineData,
        });
      });
    });

    // Convert the data into a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clinical Data');

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, 'ClinicalData.xlsx');
  };

  const [ageRange, setAgeRange] = useState([0, 100]);
  const [gender, setGender] = useState('all');
  const [sortField, setSortField] = useState('age');
  const [sortDirection, setSortDirection] = useState('asc');

  // State to store filtered and sorted patients
  const [displayedPatients, setDisplayedPatients] = useState([]);

  useEffect(() => {
    // Filter patients based on criteria
    let filtered = patients.filter((patient) => {
      const inAgeRange =
        patient.age >= ageRange[0] && patient.age <= ageRange[1];
      const matchesGender = gender === 'all' || patient.gender === gender;
      return inAgeRange && matchesGender;
    });

    // Sort the filtered patients
    filtered = filtered.sort((a, b) => {
      const compareA = a[sortField];
      const compareB = b[sortField];
      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Update displayedPatients state with filtered and sorted data
    console.log('Filtered: ', filtered);
    setDisplayedPatients(filtered);
    setFilteredPatients(filtered);
  }, [patients, ageRange, gender, sortField, sortDirection]);

  const renderAnalysis = () => {
    switch (analysisType) {
      case 'raincloud':
        return <DatabasePlot clinicalData={clinicalDataForPlotting} />;
      case 'average':
        return <GroupAveragePlot clinicalData={clinicalDataForPlotting} />;
      case 'laterality':
        return (
          <GroupLateralityAnalysisPlot clinicalData={clinicalDataForPlotting} />
        );
      case 'subscore':
        return (
          <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} />
        );
      // case 'all':
      //   return (
      //     <div style={{ display: 'flex', marginLeft: '-60px', width: '1000px' }}>
      //       <div style={{ flex: 1, marginLeft: '-30px' }}>
      //         <DatabasePlot clinicalData={clinicalDataForPlotting}
      //         />
      //       </div>
      //       <div style={{ flex: 1, marginLeft: '-50px' }}>
      //         <LateralityAnalysisComponent
      //           rawData={rawData}
      //           showPercentage={showPercentage}
      //         />
      //       </div>
      //       <div style={{ flex: 1, marginLeft: '-60px' }}>
      //         <SubscoreAnalysis
      //           rawData={rawData}
      //           showPercentage={showPercentage}
      //         />
      //       </div>
      //     </div>
      //   );

      default:
        return <p>Please select an analysis type.</p>;
    }
  };

  // useEffect(() => {
  //   const updatedClinicalData = { ...clinicalDataForPlotting };
  //   const subscores = {};
  //   const tremorPatients = [];
  //   const bradyKinesiaPatients = [];
  //   const otherPatients = {};
  //   Object.keys(updatedClinicalData).forEach((key, index) => {
  //     let ptClinicalData = updatedClinicalData[key];
  //     const pt_baseline_scores = ptClinicalData.clinicalData.baseline;
  //     console.log(key, pt_baseline_scores);
  //     let pt_bradykinesia = 0;
  //     let pt_tremor = 0;
  //     Object.keys(bradykinesiaItems).forEach((item) => {
  //       pt_bradykinesia += parseFloat(
  //         pt_baseline_scores[bradykinesiaItems[item]],
  //       );
  //     });
  //     Object.keys(tremorItems).forEach((tremorItem) => {
  //       pt_tremor += parseFloat(pt_baseline_scores[tremorItems[tremorItem]]);
  //     });
  //     subscores[ptClinicalData.id] = {
  //       bradykinesia: pt_bradykinesia,
  //       tremor: pt_tremor,
  //     };
  //     if (pt_tremor === 0) {
  //       console.log(patients[index]);
  //       bradyKinesiaPatients.push(patients[index]);
  //     } else if (pt_bradykinesia === 0 || pt_tremor / pt_bradykinesia >= 1.5) {
  //       tremorPatients.push(patients[index]);
  //     }
  //   });
  //   console.log('Subscores: ', subscores);
  //   console.log(bradyKinesiaPatients);
  //   console.log(tremorPatients);
  //   setTremorPts(tremorPatients);
  //   setBradykinesiaPts(bradyKinesiaPatients);
  // }, [clinicalDataForPlotting]);

  // useEffect(() => {
  //   console.log(selectedPatient);
  //   if (selectedPatient === 'tremor') {
  //     console.log(tremorPts);
  //     setFilteredPatients(tremorPts);
  //     setDisplayedPatients(tremorPts);
  //   } else if (selectedPatient === 'bradykinesia') {
  //     console.log(bradykinesiaPts);
  //     setFilteredPatients(bradykinesiaPts);
  //     setDisplayedPatients(bradykinesiaPts);
  //   } else {
  //     // Reset to show all patients or another default list as needed
  //     setFilteredPatients(patients);
  //     setDisplayedPatients(patients);
  //   }
  // }, [selectedPatient]); // Add dependencies here

  // Combine tremor and bradykinesia patient states into one
  // const [patientGroups, setPatientGroups] = useState({
  //   tremor: [],
  //   bradykinesia: [],
  // });

  // useEffect(() => {
  //   if (!clinicalDataForPlotting) return;

  //   const updatedClinicalData = { ...clinicalDataForPlotting };
  //   const subscores = {};
  //   const tremorPatients = [];
  //   const bradykinesiaPatients = [];

  //   Object.keys(updatedClinicalData).forEach((key, index) => {
  //     const ptClinicalData = updatedClinicalData[key];
  //     const pt_baseline_scores = ptClinicalData.clinicalData.baseline;
  //     console.log(key, pt_baseline_scores);

  //     let pt_bradykinesia = 0;
  //     let pt_tremor = 0;

  //     // Calculate bradykinesia and tremor subscores
  //     bradykinesiaItems.forEach((item) => {
  //       pt_bradykinesia += parseFloat(pt_baseline_scores[bradykinesiaItems[item]]) || 0;
  //     });
  //     tremorItems.forEach((tremorItem) => {
  //       pt_tremor += parseFloat(pt_baseline_scores[tremorItems[tremorItem]]) || 0;
  //     });

  //     // Determine patient group based on scores
  //     subscores[ptClinicalData.id] = { bradykinesia: pt_bradykinesia, tremor: pt_tremor };
  //     if (pt_tremor === 0) {
  //       bradykinesiaPatients.push(patients[index]);
  //     } else if (pt_bradykinesia === 0 || pt_tremor / pt_bradykinesia >= 1.5) {
  //       tremorPatients.push(patients[index]);
  //     }
  //   });

  //   console.log('Subscores:', subscores);
  //   console.log('Bradykinesia Patients:', bradykinesiaPatients);
  //   console.log('Tremor Patients:', tremorPatients);

  //   // Update both groups in one state update
  //   setPatientGroups({ tremor: tremorPatients, bradykinesia: bradykinesiaPatients });

  // }, [clinicalDataForPlotting, patients]);

  // // Handle selectedPatient changes by referring to `patientGroups`
  // useEffect(() => {
  //   const { tremor, bradykinesia } = patientGroups;

  //   if (selectedPatient === 'tremor') {
  //     console.log("Displaying Tremor Patients:", tremor);
  //     setFilteredPatients(tremor);
  //     setDisplayedPatients(tremor);
  //   } else if (selectedPatient === 'bradykinesia') {
  //     console.log("Displaying Bradykinesia Patients:", bradykinesia);
  //     setFilteredPatients(bradykinesia);
  //     setDisplayedPatients(bradykinesia);
  //   } else {
  //     setFilteredPatients(patients);
  //     setDisplayedPatients(patients);
  //   }
  // }, [selectedPatient, patientGroups, patients]);

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  return (
    <div style={{ width: '1000px' }}>
      <HomeIcon
        onClick={() => navigate('/')}
        style={{
          fontSize: '36px', // Customize size
          color: '#1a73e8', // Customize color
          cursor: 'pointer', // Add pointer cursor on hover
          margin: '0 10px', // Add some margin for spacing
          marginTop: '-70px',
        }}
      />
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Age Range Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Age Range:</h3>
            <input
              type="number"
              value={ageRange[0]}
              onChange={(e) =>
                setAgeRange([Number(e.target.value), ageRange[1]])
              }
              style={{ width: '70px', padding: '4px' }}
            />
            <span>to</span>
            <input
              type="number"
              value={ageRange[1]}
              onChange={(e) =>
                setAgeRange([ageRange[0], Number(e.target.value)])
              }
              style={{ width: '70px', padding: '4px' }}
            />
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '16px', margin: 0 }}>Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ padding: '4px', minWidth: '80px' }}
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <h3 style={{fontSize: '16px'}}>Further sorting options...</h3>
        </div>

        {/* Displayed Patients List */}
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            minWidth: '200px',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3 style={{ fontSize: '16px', margin: 0, marginBottom: '10px' }}>
            Patient List
          </h3>
          <ul style={{ paddingLeft: '15px' }}>
            {displayedPatients.map((patient, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {patient.name} - Age: {patient.age}, Gender: {patient.gender}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {/* <select value={analysisType} onChange={handleAnalysisChange}>
          <option value="raincloud">Trendline</option>
          <option value="average">Group Average</option>
          <option value="laterality">Laterality Analysis</option>
          <option value="subscore">Subscores</option>
        </select> */}
      </div>
      {clinicalDataForPlotting && filteredPatients && (
        <div style={{ width: '1000px' }}>
          {/* <DatabasePlot clinicalData={clinicalDataForPlotting} />
          <GroupAveragePlot clinicalData={clinicalDataForPlotting} />
          <GroupLateralityAnalysisPlot clinicalData={clinicalDataForPlotting} />
          <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} /> */}
          <select value={analysisType} onChange={handleAnalysisChange}>
            <option value="none">Choose an option</option>
            <option value="raincloud">Trendline</option>
            <option value="average">Group Average</option>
            <option value="laterality">Laterality Analysis</option>
            <option value="subscore">Subscores</option>
            {/* <option value="boxPlot">Box Plot</option>
            <option value="laterality">Laterality Analysis</option> */}
            {/* <option value="subscale">Subscale Comparison</option>
            <option value="responder">Responder Analysis</option> */}
            {/* <option value="correlation">Correlation Analysis</option> */}
            {/* <option value="all">View All Plots</option> */}
          </select>
          {renderAnalysis()}
        </div>
      )}
      <button onClick={handleExportToExcel} className="export-button">
        Export to Excel
      </button>
    </div>
  );
}

export default DatabaseStats;

// import React, { useContext, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import HomeIcon from '@mui/icons-material/Home';
// import * as XLSX from 'xlsx';
// import DatabasePlot from './DatabasePlot';
// import GroupAveragePlot from './GroupAveragePlot';
// import { PatientContext } from './PatientContext';
// import GroupLateralityAnalysisPlot from './GroupLateralityAnalysisPlot';
// import GroupSubscoreAnalysisPlot from './GroupSubscoreAnalysisPlot';

// function DatabaseStats({ directoryPath }) {
//   const { patients } = useContext(PatientContext); // Optional: Use context for patient data
//   console.log(patients);
//   const [filteredPatients, setFilteredPatients] = useState(patients);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [analysisType, setAnalysisType] = useState('all');
//   // const { directoryPath } = location.state || {};
//   console.log(directoryPath);
//   const [clinicalTimelines, setClinicalTimelines] = useState(null);
//   const [clinicalDataForPlotting, setClinicalDataForPlotting] = useState(null);
//   const [tremorPts, setTremorPts] = useState([]);
//   const [bradykinesiaPts, setBradykinesiaPts] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState('none');

//   useEffect(() => {
//     if (directoryPath && filteredPatients.length > 0) {
//       // Create an array of promises to fetch timelines for each patient
//       const timelinePromises = filteredPatients.map((patient) =>
//         window.electron.ipcRenderer.invoke(
//           'get-timelines',
//           directoryPath,
//           patient.id,
//           true,
//         ),
//       );

//       Promise.all(timelinePromises)
//         // eslint-disable-next-line promise/always-return
//         .then((allReceivedTimelines) => {
//           // Map over each patient's timelines and filter for timelines with hasClinical = true
//           const allFilteredTimelineNames = allReceivedTimelines.map(
//             (receivedTimelines) =>
//               receivedTimelines
//                 .filter((timelineData) => timelineData.hasClinical)
//                 .map((timelineData) => timelineData.timeline),
//           );

//           const patientsArray = Object.keys(filteredPatients); // Get patient IDs as an array
//           const patientsWithTimelines = patientsArray.map(
//             (patientID, index) => ({
//               id: filteredPatients[index].id,
//               timelines: allFilteredTimelineNames[index] || [], // Get timelines from `allFilteredTimelineNames`
//             }),
//           );
//           console.log(patientsWithTimelines);
//           setClinicalTimelines(patientsWithTimelines); // Logs only the timelines with hasClinical = true for each patient
//         })
//         .catch((error) => {
//           console.error('Error fetching timelines for all patients:', error);
//         });
//     }
//   }, [directoryPath, filteredPatients]);

//   useEffect(() => {
//     window.electron.ipcRenderer
//       .invoke('get-clinical-data', directoryPath, clinicalTimelines)
//       // eslint-disable-next-line promise/always-return
//       .then((clinicalData) => {
//         console.log('Clinical Data: ', clinicalData); // Process the received clinical data
//         setClinicalDataForPlotting(clinicalData);
//       })
//       .catch((error) => {
//         console.error('Error retrieving clinical data:', error);
//       });
//   }, [clinicalTimelines]);

//   window.electron.ipcRenderer.sendMessage(
//     'database-group-figures',
//     directoryPath,
//   );
//   useEffect(() => {
//     if (window.electron && window.electron.ipcRenderer) {
//       const importedScores = {};

//       const handleGetTimelines = (arg) => {
//         console.log('Timelines: ', arg);
//       };

//       const handleImportFile = (arg) => {
//         console.log('Import file: ', arg);
//       };

//       window.electron.ipcRenderer.once(
//         'database-group-figures',
//         handleImportFile,
//       );
//     } else {
//       console.error('ipcRenderer is not available');
//     }
//   }, []);

//   // Excel plotting

//   const handleExportToExcel = () => {
//     // Prepare the data for export
//     const exportData = [];

//     clinicalDataForPlotting.forEach((patientData) => {
//       const { id, clinicalData } = patientData;

//       Object.keys(clinicalData).forEach((timeline) => {
//         const timelineData = clinicalData[timeline];

//         exportData.push({
//           PatientID: id,
//           Timeline: timeline,
//           ...timelineData,
//         });
//       });
//     });

//     // Convert the data into a worksheet and workbook
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Clinical Data');

//     // Export the workbook as an Excel file
//     XLSX.writeFile(workbook, 'ClinicalData.xlsx');
//   };

//   const [ageRange, setAgeRange] = useState([0, 100]);
//   const [gender, setGender] = useState('all');
//   const [sortField, setSortField] = useState('age');
//   const [sortDirection, setSortDirection] = useState('asc');

//   // State to store filtered and sorted patients
//   const [displayedPatients, setDisplayedPatients] = useState([]);

//   useEffect(() => {
//     // Filter patients based on criteria
//     let filtered = patients.filter((patient) => {
//       const inAgeRange =
//         patient.age >= ageRange[0] && patient.age <= ageRange[1];
//       const matchesGender = gender === 'all' || patient.gender === gender;
//       return inAgeRange && matchesGender;
//     });

//     // Sort the filtered patients
//     filtered = filtered.sort((a, b) => {
//       const compareA = a[sortField];
//       const compareB = b[sortField];
//       if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
//       if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });

//     // Update displayedPatients state with filtered and sorted data
//     console.log('Filtered: ', filtered);
//     setDisplayedPatients(filtered);
//     setFilteredPatients(filtered);
//   }, [patients, ageRange, gender, sortField, sortDirection]);

//   const renderAnalysis = () => {
//     switch (analysisType) {
//       case 'raincloud':
//         return <DatabasePlot clinicalData={clinicalDataForPlotting} />;
//       case 'average':
//         return <GroupAveragePlot clinicalData={clinicalDataForPlotting} />;
//       case 'laterality':
//         return (
//           <GroupLateralityAnalysisPlot clinicalData={clinicalDataForPlotting} />
//         );
//       case 'subscore':
//         return (
//           <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} />
//         );
//       case 'all':
//         return (
//           <div>
//             <div style={{ flex: 1, marginLeft: '-60px' }}>
//               <DatabasePlot clinicalData={clinicalDataForPlotting} />
//             </div>
//             <div style={{ flex: 1, marginLeft: '-60px' }}>
//               <GroupAveragePlot clinicalData={clinicalDataForPlotting} />;
//             </div>
//             <div style={{ flex: 1, marginLeft: '-60px' }}>
//               <GroupLateralityAnalysisPlot clinicalData={clinicalDataForPlotting} />
//             </div>
//             <div style={{ flex: 1, marginLeft: '-60px' }}>
//               <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} />

//             </div>
//           </div>
//         );

//       default:
//         return <p>Please select an analysis type.</p>;
//     }
//   };

//   const handleAnalysisChange = (e) => {
//     setAnalysisType(e.target.value);
//   };

//   return (
//     <div style={{ width: '1000px' }}>
//       <HomeIcon
//         onClick={() => navigate('/')}
//         style={{
//           fontSize: '36px', // Customize size
//           color: '#1a73e8', // Customize color
//           cursor: 'pointer', // Add pointer cursor on hover
//           margin: '0 10px', // Add some margin for spacing
//           marginTop: '-70px',
//         }}
//       />
//       <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
//         {/* Filter Controls */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {/* Age Range Filter */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             <h3 style={{ fontSize: '16px', margin: 0 }}>Age Range:</h3>
//             <input
//               type="number"
//               value={ageRange[0]}
//               onChange={(e) =>
//                 setAgeRange([Number(e.target.value), ageRange[1]])
//               }
//               style={{ width: '70px', padding: '4px' }}
//             />
//             <span>to</span>
//             <input
//               type="number"
//               value={ageRange[1]}
//               onChange={(e) =>
//                 setAgeRange([ageRange[0], Number(e.target.value)])
//               }
//               style={{ width: '70px', padding: '4px' }}
//             />
//           </div>

//           {/* Gender Filter */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//             <label style={{ fontSize: '16px', margin: 0 }}>Gender:</label>
//             <select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               style={{ padding: '4px', minWidth: '80px' }}
//             >
//               <option value="all">All</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </div>
//           <h3 style={{fontSize: '16px'}}>Further sorting options...</h3>
//         </div>

//         {/* Displayed Patients List */}
//         <div
//           style={{
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//             padding: '10px',
//             minWidth: '200px',
//             maxHeight: '300px',
//             overflowY: 'auto',
//             backgroundColor: '#f9f9f9',
//           }}
//         >
//           <h3 style={{ fontSize: '16px', margin: 0, marginBottom: '10px' }}>
//             Patient List
//           </h3>
//           <ul style={{ paddingLeft: '15px' }}>
//             {displayedPatients.map((patient, index) => (
//               <li key={index} style={{ marginBottom: '5px' }}>
//                 {patient.name} - Age: {patient.age}, Gender: {patient.gender}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div />
//       {clinicalDataForPlotting && filteredPatients && (
//         <div style={{ width: '1000px' }}>
//           <select value={analysisType} onChange={handleAnalysisChange}>
//             <option value="none">Choose an option</option>
//             <option value="raincloud">Trendline</option>
//             <option value="average">Group Average</option>
//             <option value="laterality">Laterality Analysis</option>
//             <option value="subscore">Subscores</option>
//             <option value="all">View All Plots</option>
//           </select>
//           {renderAnalysis()}
//         </div>
//       )}
//       <button onClick={handleExportToExcel} className="export-button">
//         Export to Excel
//       </button>
//     </div>
//   );
// }

// export default DatabaseStats;


import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import * as XLSX from 'xlsx';
import DatabasePlot from './DatabasePlot';
import GroupAveragePlot from './GroupAveragePlot';
import { PatientContext } from './PatientContext';
import GroupLateralityAnalysisPlot from './GroupLateralityAnalysisPlot';
import GroupSubscoreAnalysisPlot from './GroupSubscoreAnalysisPlot';
import './DatabaseStats.css'; // Ensure this CSS file is correctly linked

function DatabaseStats({ directoryPath }) {
  const { patients } = useContext(PatientContext);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState('all');
  const [clinicalTimelines, setClinicalTimelines] = useState(null);
  const [clinicalDataForPlotting, setClinicalDataForPlotting] = useState(null);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [gender, setGender] = useState('all');
  const [sortField, setSortField] = useState('age');
  const [sortDirection, setSortDirection] = useState('asc');
  const [displayedPatients, setDisplayedPatients] = useState([]);

  useEffect(() => {
    if (directoryPath && filteredPatients.length > 0) {
      const timelinePromises = filteredPatients.map((patient) =>
        window.electron.ipcRenderer.invoke(
          'get-timelines',
          directoryPath,
          patient.id,
          true,
        ),
      );

      Promise.all(timelinePromises)
        .then((allReceivedTimelines) => {
          const allFilteredTimelineNames = allReceivedTimelines.map(
            (receivedTimelines) =>
              receivedTimelines
                .filter((timelineData) => timelineData.hasClinical)
                .map((timelineData) => timelineData.timeline),
          );

          const patientsArray = Object.keys(filteredPatients);
          const patientsWithTimelines = patientsArray.map(
            (patientID, index) => ({
              id: filteredPatients[index].id,
              timelines: allFilteredTimelineNames[index] || [],
            }),
          );
          setClinicalTimelines(patientsWithTimelines);
        })
        .catch((error) => {
          console.error('Error fetching timelines for all patients:', error);
        });
    }
  }, [directoryPath, filteredPatients]);

  useEffect(() => {
    if (clinicalTimelines) {
      window.electron.ipcRenderer
        .invoke('get-clinical-data', directoryPath, clinicalTimelines)
        .then((clinicalData) => {
          setClinicalDataForPlotting(clinicalData);
        })
        .catch((error) => {
          console.error('Error retrieving clinical data:', error);
        });
    }
  }, [clinicalTimelines]);

  useEffect(() => {
    let filtered = patients.filter((patient) => {
      const inAgeRange =
        patient.age >= ageRange[0] && patient.age <= ageRange[1];
      const matchesGender = gender === 'all' || patient.gender === gender;
      return inAgeRange && matchesGender;
    });

    filtered = filtered.sort((a, b) => {
      const compareA = a[sortField];
      const compareB = b[sortField];
      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setDisplayedPatients(filtered);
    setFilteredPatients(filtered);
  }, [patients, ageRange, gender, sortField, sortDirection]);

  const handleExportToExcel = () => {
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

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clinical Data');
    XLSX.writeFile(workbook, 'ClinicalData.xlsx');
  };

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
      case 'all':
        return (
          <div className="analysis-container">
            <DatabasePlot clinicalData={clinicalDataForPlotting} />
            <GroupAveragePlot clinicalData={clinicalDataForPlotting} />
            <GroupLateralityAnalysisPlot clinicalData={clinicalDataForPlotting} />
            <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} />
          </div>
        );
      default:
        return <p>Please select an analysis type.</p>;
    }
  };

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  return (
    <div className="database-stats-container">
      <HomeIcon
        onClick={() => navigate('/')}
        className="home-icon"
      />
      <div className="filter-controls">
        <div className="filter-group">
          <h3>Age Range:</h3>
          <input
            type="number"
            value={ageRange[0]}
            onChange={(e) =>
              setAgeRange([Number(e.target.value), ageRange[1]])
            }
            className="age-input"
          />
          <span>to</span>
          <input
            type="number"
            value={ageRange[1]}
            onChange={(e) =>
              setAgeRange([ageRange[0], Number(e.target.value)])
            }
            className="age-input"
          />
        </div>

        <div className="filter-group">
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="gender-select"
          >
            <option value="all">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="patient-list">
        <h3>Patient List</h3>
        <ul>
          {displayedPatients.map((patient, index) => (
            <li key={index}>
              {patient.name} - Age: {patient.age}, Gender: {patient.gender}
            </li>
          ))}
        </ul>
      </div>

      {clinicalDataForPlotting && filteredPatients && (
        <div className="analysis-section">
          <select value={analysisType} onChange={handleAnalysisChange} className="analysis-select">
            <option value="none">Choose an option</option>
            <option value="raincloud">Trendline</option>
            <option value="average">Group Average</option>
            <option value="laterality">Laterality Analysis</option>
            <option value="subscore">Subscores</option>
            <option value="all">View All Plots</option>
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

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import {
  Slider,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';
import * as nifti from 'nifti-reader-js';
import DatabasePlot from './DatabasePlot';
import GroupAveragePlot from './GroupAveragePlot';
import { PatientContext } from './PatientContext';
import GroupLateralityAnalysisPlot from './GroupLateralityAnalysisPlot';
import GroupSubscoreAnalysisPlot from './GroupSubscoreAnalysisPlot';
import CombinedPlot from './CombinedPlot';
import './DatabaseStats.css'; // Ensure this CSS file is correctly linked
import { optimizeDatabase } from './OptimizeDatabase';
import electrodeModels from './electrodeModels.json';
import * as math from 'mathjs';

function DatabaseStats({ directoryPath }) {
  const { patients } = useContext(PatientContext);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const navigate = useNavigate();
  const [analysisType, setAnalysisType] = useState('all');
  const [clinicalTimelines, setClinicalTimelines] = useState(null);
  const [clinicalData, setClinicalData] = useState(null);
  const [clinicalDataForPlotting, setClinicalDataForPlotting] = useState(null);
  const [ageRange, setAgeRange] = useState([0, 100]);
  const [gender, setGender] = useState('all');
  const [sortField, setSortField] = useState('age');
  const [sortDirection, setSortDirection] = useState('asc');
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [filters, setFilters] = useState({});

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

          const patientsArray = filteredPatients;
          const patientsWithTimelines = patientsArray.map((patient, index) => ({
            id: patient.id,
            timelines: allFilteredTimelineNames[index] || [],
          }));
          return setClinicalTimelines(patientsWithTimelines);
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
          setClinicalData(clinicalData);
          setClinicalDataForPlotting(clinicalData);
          return clinicalData;
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
            <CombinedPlot clinicalData={clinicalDataForPlotting} />
            <GroupLateralityAnalysisPlot
              clinicalData={clinicalDataForPlotting}
            />
            <GroupSubscoreAnalysisPlot clinicalData={clinicalDataForPlotting} />
          </div>
        );
      case 'new':
        return <CombinedPlot clinicalData={clinicalDataForPlotting} />;
      default:
        return <p>Please select an analysis type.</p>;
    }
  };

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  const detectAttributeTypes = () => {
    if (patients.length === 0) return {};

    const samplePatient = patients[0];
    const attributeTypes = {};

    Object.keys(samplePatient).forEach((key) => {
      const value = samplePatient[key];
      if (typeof value === 'number') {
        attributeTypes[key] = 'number';
      } else if (typeof value === 'string') {
        attributeTypes[key] = 'string';
      }
      // Add more type checks as needed
    });

    return attributeTypes;
  };

  const generateFilterUI = () => {
    const attributeTypes = detectAttributeTypes();
    console.log('Attribute Types:', attributeTypes);
    return Object.keys(attributeTypes).map((key) => {
      const type = attributeTypes[key];
      // if (type === 'number') {
      //   return (
      //     <div key={key} className="filter-group">
      //       <h1 style={{ fontSize: '10px' }}>{key}:</h1>
      //       <input
      //         type="number"
      //         value={filters[key]?.min || ''}
      //         placeholder="Min"
      //         onChange={(e) =>
      //           setFilters((prev) => ({
      //             ...prev,
      //             [key]: { ...prev[key], min: Number(e.target.value) },
      //           }))
      //         }
      //       />
      //       <input
      //         type="number"
      //         value={filters[key]?.max || ''}
      //         placeholder="Max"
      //         onChange={(e) =>
      //           setFilters((prev) => ({
      //             ...prev,
      //             [key]: { ...prev[key], max: Number(e.target.value) },
      //           }))
      //         }
      //       />
      //     </div>
      //   );
      // }
      // if (type === 'string') {
      //   return (
      //     <div key={key} className="filter-group">
      //       <h3 style={{ fontSize: '10px' }}>{key}:</h3>
      //       <input
      //         type="text"
      //         value={filters[key] || ''}
      //         onChange={(e) =>
      //           setFilters((prev) => ({
      //             ...prev,
      //             [key]: e.target.value,
      //           }))
      //         }
      //       />
      //     </div>
      //   );
      // }

      if (type === 'number') {
        return (
          <Box key={key} className="filter-group" sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{key}:</Typography>
            <Slider
              value={filters[key] || [0, 120]}
              onChange={(e, newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  [key]: newValue,
                }))
              }
              valueLabelDisplay="auto"
              min={0}
              max={120}
            />
          </Box>
        );
      }
      if (type === 'string') {
        return (
          <Box key={key} className="filter-group" sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{key}:</Typography>
            <TextField
              value={filters[key] || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              variant="outlined"
              fullWidth
              placeholder="none"
            />
          </Box>
        );
      }
      return null;
    });
  };

  // const generateFilterUI = () => {
  //   const attributeTypes = detectAttributeTypes();
  //   return Object.keys(attributeTypes).map((key) => {
  //     const type = attributeTypes[key];
  //     if (type === 'number') {
  //       return (
  //         <Box key={key} className="filter-group" sx={{ mb: 2 }}>
  //           <Typography variant="subtitle1">{key}:</Typography>
  //           <Slider
  //             value={filters[key] || [0, 100]}
  //             onChange={(e, newValue) =>
  //               setFilters((prev) => ({
  //                 ...prev,
  //                 [key]: newValue,
  //               }))
  //             }
  //             valueLabelDisplay="auto"
  //             min={0}
  //             max={100}
  //           />
  //         </Box>
  //       );
  //     } else if (type === 'string') {
  //       return (
  //         <Box key={key} className="filter-group" sx={{ mb: 2 }}>
  //           <Typography variant="subtitle1">{key}:</Typography>
  //           <TextField
  //             value={filters[key] || ''}
  //             onChange={(e) =>
  //               setFilters((prev) => ({
  //                 ...prev,
  //                 [key]: e.target.value,
  //               }))
  //             }
  //             variant="outlined"
  //             fullWidth
  //           />
  //         </Box>
  //       );
  //     }
  //     return null;
  //   });
  // };

  const applyFilters = (filters) => {
    console.log('Filters:', filters);
    return patients.filter((patient) => {
      return Object.keys(filters).every((key) => {
        const filter = filters[key];
        const value = patient[key];

        if (typeof filter === 'object') {
          // Numeric filter
          const [min, max] = filter;
          return (
            (min === undefined || value >= min) &&
            (max === undefined || value <= max)
          );
        }
        // String filter
        return value.toLowerCase().includes(filter.toLowerCase());
      });
    });
  };

  useEffect(() => {
    const filtered = applyFilters(filters);
    console.log('Filtered Patients:', filtered);
    setFilteredPatients(filtered);
    setDisplayedPatients(filtered);
    // Filter clinical data based on filtered patients
    if (clinicalData) {
      const filteredClinicalData = clinicalData.filter((data) =>
        filtered.some((patient) => patient.id === data.id),
      );
      setClinicalDataForPlotting(filteredClinicalData);
    }
  }, [filters]);

  const handleNiiUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        throw new Error('No file selected');
      }

      // Read the file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileData = e.target.result;

          // Validate if the file is a valid NIfTI file
          if (!nifti.isNIFTI(fileData)) {
            throw new Error('File is not a valid NIfTI file');
          }

          const header = nifti.readHeader(fileData);
          let image = nifti.readImage(header, fileData);
          console.log('Header: ', header);
          // Ensure `image` is a valid ArrayBuffer
          if (!(image instanceof ArrayBuffer)) {
            console.log('Adjusting image to ArrayBuffer...');
            image = new Uint8Array(image).buffer;
          }

          // Handle endian mismatch
          if (!header.littleEndian) {
            console.warn('File is in big-endian format. Adjusting...');
            const dataView = new DataView(image);
            const correctedData = new Float32Array(image.byteLength / 4);
            for (let i = 0; i < correctedData.length; i++) {
              correctedData[i] = dataView.getFloat32(i * 4, false); // false = big-endian
            }
            image = correctedData;
          } else {
            image = new Float32Array(image);
          }

          // Apply scaling factors
          const { scl_slope = 1, scl_inter = 0 } = header;
          const img = new Float32Array(
            image.map((value) => value * scl_slope + scl_inter),
          );

          // Extract dimensions
          const dimensions = header.dims.slice(1, 4);
          console.log('Dimensions:', dimensions);

          // Generate voxel coordinates
          const voxelCoordinates = [];
          img.forEach((value, index) => {
            if (!isNaN(value)) {
              const z = Math.floor(index / (dimensions[0] * dimensions[1]));
              const y = Math.floor(
                (index % (dimensions[0] * dimensions[1])) / dimensions[0],
              );
              const x = index % dimensions[0];
              voxelCoordinates.push([x, y, z, value]);
            }
          });

          console.log('Voxel Coordinates:', voxelCoordinates);

          // Transform to MNI coordinates using affine matrix
          const affineMatrix = header.affine;
          const mniCoordinates = voxelCoordinates.map(([x, y, z, value]) => {
            const voxelHomogeneous = [x, y, z, 1]; // Add 1 for homogeneous transformation
            const transformedVoxels = math.multiply(
              affineMatrix,
              voxelHomogeneous,
            );
            const [wx, wy, wz] = transformedVoxels.slice(0, 3);
            return [wx, wy, wz, value];
          });

          console.log('MNI Coordinates:', mniCoordinates);

          // plotNifti(mniCoordinates);
          // Set the state with the transformed coordinates
          // setNiiCoords(mniCoordinates);
          // handleNiiMap(mniCoordinates);
          optimizeDatabase(
            patients,
            directoryPath,
            electrodeModels,
            mniCoordinates,
          );
          // return mniCoordinates;
          // setIsLoading(false); // Hide spinner
        } catch (error) {
          console.error('Error processing NIfTI file:', error);
          // setIsLoading(false); // Hide spinner
        }
      };

      reader.onerror = () => {
        console.error('Failed to read file');
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error loading NIfTI file:', error);
    }
  };

  const handleOptimizeDatabase = () => {
    const niiCoords = handleNiiUpload();
    optimizeDatabase(patients, directoryPath, electrodeModels, niiCoords);
  };

  return (
    <div className="database-stats-container">
      <HomeIcon onClick={() => navigate('/')} className="home-icon" />
      {/* <div className="filter-controls">
        <div className="filter-group">
          <h3>Age Range:</h3>
          <input
            type="number"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
            className="age-input"
          />
          <span>to</span>
          <input
            type="number"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
            className="age-input"
          />
        </div>

        <div className="filter-group">
          <h3 style={{ fontSize: '10px' }}>Gender:</h3>
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
      </div> */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-controls-content"
          id="filter-controls-header"
        >
          <Typography>Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="filter-controls">{generateFilterUI()}</div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="patient-list-content"
          id="patient-list-header"
        >
          <Typography>Patient List</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="patient-list">
            <ul>
              {displayedPatients.map((patient, index) => (
                <li key={index}>
                  {Object.entries(patient).map(([key, value]) => (
                    <p key={key}>
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>{' '}
                      {value}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>

      {clinicalDataForPlotting && filteredPatients && (
        <div className="analysis-section">
          <select
            value={analysisType}
            onChange={handleAnalysisChange}
            className="analysis-select"
          >
            <option value="none">Choose an option</option>
            {/* <option value="raincloud">Trendline</option>
            <option value="average">Group Average</option> */}
            <option value="new">Trendlines</option>
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
      {/* <button onClick={handleNiiUpload} className="export-button">
        Calculate stimulation parameters
      </button> */}
      <Button
        variant="primary"
        onClick={() => document.getElementById('nifti-upload').click()}
        className="mb-4 mx-2"
      >
        Import NIfTI File and Provide Solution
      </Button>
      <input
        id="nifti-upload"
        type="file"
        style={{ display: 'none' }}
        accept=".nii"
        onChange={(e) => handleNiiUpload(e)}
      />
    </div>
  );
}

export default DatabaseStats;

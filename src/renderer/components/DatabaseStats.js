import React, { useState, useEffect } from 'react';
import DatabasePlot from './DatabasePlot';
import * as XLSX from 'xlsx';

function DatabaseStats({ patients, directoryPath }) {
  console.log(patients);
  console.log(directoryPath);
  const [clinicalTimelines, setClinicalTimelines] = useState(null);
  const [clinicalDataForPlotting, setClinicalDataForPlotting] = useState(null);
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
    if (directoryPath && patients.length > 0) {
      // Create an array of promises to fetch timelines for each patient
      const timelinePromises = patients.map((patient) =>
        window.electron.ipcRenderer.invoke(
          'get-timelines',
          directoryPath,
          patient.id,
          true,
        ),
      );

      Promise.all(timelinePromises)
        .then((allReceivedTimelines) => {
          // Map over each patient's timelines and filter for timelines with hasClinical = true
          const allFilteredTimelineNames = allReceivedTimelines.map(
            (receivedTimelines) =>
              receivedTimelines
                .filter((timelineData) => timelineData.hasClinical)
                .map((timelineData) => timelineData.timeline),
          );

          const patientsArray = Object.keys(patients); // Get patient IDs as an array
          const patientsWithTimelines = patientsArray.map(
            (patientID, index) => ({
              id: patients[index].id,
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
  }, [directoryPath, patients]);

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-clinical-data', directoryPath, clinicalTimelines)
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

  return (
    <div>
      {clinicalDataForPlotting && (
        <DatabasePlot clinicalData={clinicalDataForPlotting} />
      )}
      <button onClick={handleExportToExcel} className="export-button">
        Export to Excel
      </button>
    </div>
  );
}

export default DatabaseStats;

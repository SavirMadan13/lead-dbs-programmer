import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function GroupLateralityAveragePlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(true);

  const leftSideItems = [
    '3.3c: Rigidity- LUE', '3.3e: Rigidity- LLE', '3.4b: Finger tapping- Left hand',
    '3.5b: Hand movements- Left hand', '3.6b: Pronation- supination movements- Left hand',
    '3.7b: Toe tapping- Left foot', '3.8b: Leg agility- Left leg',
    '3.15b: Postural tremor- Left hand', '3.16b: Kinetic tremor- Left hand',
    '3.17b: Rest tremor amplitude- LUE', '3.17d: Rest tremor amplitude- LLE',
  ];

  const rightSideItems = [
    '3.3b: Rigidity- RUE', '3.3d: Rigidity- RLE', '3.4a: Finger tapping- Right hand',
    '3.5a: Hand movements- Right hand', '3.6a: Pronation- supination movements- Right hand',
    '3.7a: Toe tapping- Right foot', '3.8a: Leg agility- Right leg',
    '3.15a: Postural tremor- Right hand', '3.16a: Kinetic tremor- Right hand',
    '3.17a: Rest tremor amplitude- RUE', '3.17c: Rest tremor amplitude- RLE',
  ];

  // Function to parse timeline strings (e.g., '3months', '2years', etc.)
  const parseTimeline = (timeline) => {
    if (timeline === 'baseline') return 0; // Baseline is the starting point
    const match = timeline.match(/(\d+)(years|months)/);
    if (!match) return Infinity; // Handle unexpected formats
    const [_, value, unit] = match;
    const multiplier = unit === 'years' ? 12 : 1; // Convert years to months
    return parseInt(value) * multiplier;
  };

  // Get all timelines and order them chronologically
  const timelines = [...new Set(clinicalData.flatMap((patient) => Object.keys(patient.clinicalData)))];
  const orderedTimelines = timelines.sort((a, b) => parseTimeline(a) - parseTimeline(b));

  const calculateStats = (values) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    return { mean, stdDev };
  };

  // Collect data for each patient for left and right sides
  const leftPatientData = clinicalData.map((patientData) =>
    orderedTimelines.map((timeline) => {
      const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
        .filter(([item]) => leftSideItems.includes(item))
        .map(([, score]) => score);
      const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.entries(patientData.clinicalData[timeline] || {})
        .filter(([item]) => leftSideItems.includes(item))
        .map(([, score]) => score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
    })
  );

  const rightPatientData = clinicalData.map((patientData) =>
    orderedTimelines.map((timeline) => {
      const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
        .filter(([item]) => rightSideItems.includes(item))
        .map(([, score]) => score);
      const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.entries(patientData.clinicalData[timeline] || {})
        .filter(([item]) => rightSideItems.includes(item))
        .map(([, score]) => score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
    })
  );

  const leftAverages = orderedTimelines.map((_, i) => calculateStats(leftPatientData.map((patient) => patient[i])).mean);
  const leftStdDevs = orderedTimelines.map((_, i) => calculateStats(leftPatientData.map((patient) => patient[i])).stdDev);

  const rightAverages = orderedTimelines.map((_, i) => calculateStats(rightPatientData.map((patient) => patient[i])).mean);
  const rightStdDevs = orderedTimelines.map((_, i) => calculateStats(rightPatientData.map((patient) => patient[i])).stdDev);

  const data = {
    labels: orderedTimelines,
    datasets: [
      ...leftPatientData.map((data, i) => ({
        label: `Patient ${i + 1} - Left`,
        data,
        borderColor: 'rgba(78, 121, 167, 0.3)',
        borderWidth: 1,
        tension: 0.2,
        pointRadius: 0,
        showLine: true,
      })),
      ...rightPatientData.map((data, i) => ({
        label: `Patient ${i + 1} - Right`,
        data,
        borderColor: 'rgba(242, 142, 43, 0.3)',
        borderWidth: 1,
        tension: 0.2,
        pointRadius: 0,
        showLine: true,
      })),
      {
        label: 'Left Side Average',
        data: leftAverages,
        borderColor: '#4E79A7',
        backgroundColor: 'rgba(78, 121, 167, 0.2)',
        borderWidth: 2,
        fill: '-1',
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: 'Right Side Average',
        data: rightAverages,
        borderColor: '#F28E2B',
        backgroundColor: 'rgba(242, 142, 43, 0.2)',
        borderWidth: 2,
        fill: '-1',
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          filter: (legendItem) => !legendItem.text.includes('Patient'), // Exclude patient lines from the legend
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label.includes('Patient')) {
              return `${context.dataset.label}: ${context.raw}`;
            }
            return `${context.dataset.label}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Group Laterality Analysis',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: showPercentage ? 'Percentage Improvement (%)' : 'Scores',
        },
      },
    },
  };

  return (
    <div>
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={() => setShowPercentage((prev) => !prev)}
          />
          Show Percentage Improvement
        </h3>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}

export default GroupLateralityAveragePlot;

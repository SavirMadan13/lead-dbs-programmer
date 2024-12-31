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

function GroupSubscoreAnalysisPlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(true);

  const bradykinesiaItems = [
    '3.4a: Finger tapping- Right hand', '3.4b: Finger tapping- Left hand',
    '3.5a: Hand movements- Right hand', '3.5b: Hand movements- Left hand',
    '3.6a: Pronation- supination movements- Right hand', '3.6b: Pronation- supination movements- Left hand',
    '3.7a: Toe tapping- Right foot', '3.7b: Toe tapping- Left foot',
    '3.8a: Leg agility- Right leg', '3.8b: Leg agility- Left leg',
    '3.14: Global spontaneity of movement',
  ];

  const rigidityItems = [
    '3.3a: Rigidity- Neck', '3.3b: Rigidity- RUE', '3.3c: Rigidity- LUE',
    '3.3d: Rigidity- RLE', '3.3e: Rigidity- LLE',
  ];

  const tremorItems = [
    '3.15a: Postural tremor- Right hand', '3.15b: Postural tremor- Left hand',
    '3.16a: Kinetic tremor- Right hand', '3.16b: Kinetic tremor- Left hand',
    '3.17a: Rest tremor amplitude- RUE', '3.17b: Rest tremor amplitude- LUE',
    '3.17c: Rest tremor amplitude- RLE', '3.17d: Rest tremor amplitude- LLE',
    '3.17e: Rest tremor amplitude- Lip/jaw', '3.18: Constancy of rest tremor',
  ];

  const axialItems = [
    '3.1: Speech', '3.2: Facial expression', '3.9: Arising from chair',
    '3.10: Gait', '3.11: Freezing of gait', '3.12: Postural stability',
    '3.13: Posture',
  ];

  const categories = [
    { name: 'Bradykinesia', items: bradykinesiaItems, color: '#4E79A7' },
    { name: 'Rigidity', items: rigidityItems, color: '#59A14F' },
    { name: 'Tremor', items: tremorItems, color: '#E15759' },
    { name: 'Axial', items: axialItems, color: '#F28E2B' },
  ];

  const timelines = [...new Set(clinicalData.flatMap((patient) => Object.keys(patient.clinicalData)))];
  const orderedTimelines = timelines.sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  const calculateStats = (values) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    return { mean, stdDev };
  };

  const datasets = [];

  categories.forEach(({ name, items, color }) => {
    const patientData = clinicalData.map((patientData) =>
      orderedTimelines.map((timeline) => {
        const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
          .filter(([item]) => items.includes(item))
          .map(([, score]) => score);
        const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

        const scores = Object.entries(patientData.clinicalData[timeline] || {})
          .filter(([item]) => items.includes(item))
          .map(([, score]) => score);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
      })
    );

    const averages = orderedTimelines.map((_, i) => calculateStats(patientData.map((patient) => patient[i])).mean);
    const stdDevs = orderedTimelines.map((_, i) => calculateStats(patientData.map((patient) => patient[i])).stdDev);

    patientData.forEach((data, i) => {
      datasets.push({
        label: `Patient ${i + 1} - ${name}`,
        data,
        borderColor: `${color}88`, // Lighter color for visibility
        borderWidth: 1.5,
        tension: 0.2,
        pointRadius: 0,
        showLine: true,
      });
    });

    datasets.push({
      label: `${name} Average`,
      data: averages,
      borderColor: color,
      backgroundColor: `${color}33`,
      borderWidth: 2.5,
      fill: {
        target: '+1', // Fill between this dataset and the next one
        above: `${color}33`, // Color for the area above the line
        below: `${color}33`, // Color for the area below the line
      },
      tension: 0.3,
      pointRadius: 3,
    });

    datasets.push({
      label: `${name} Std Dev Upper`,
      data: averages.map((avg, i) => avg + stdDevs[i]),
      borderColor: 'transparent', // Hide the line
      backgroundColor: `${color}33`,
      borderWidth: 0,
      fill: false,
      pointRadius: 0,
    });

    datasets.push({
      label: `${name} Std Dev Lower`,
      data: averages.map((avg, i) => avg - stdDevs[i]),
      borderColor: 'transparent', // Hide the line
      backgroundColor: `${color}33`,
      borderWidth: 0,
      fill: '-1', // Fill between this dataset and the previous one
      pointRadius: 0,
    });
  });

  const data = {
    labels: orderedTimelines,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          filter: (legendItem) => !legendItem.text.includes('Patient'), // Exclude patient lines
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label.includes('Patient')) {
              return `${context.dataset.label}: ${context.raw}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Group Subscore Analysis',
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

export default GroupSubscoreAnalysisPlot;

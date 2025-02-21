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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SubscoreAnalysis({ rawData, showPercentage }) {
  const [threshold, setThreshold] = useState(0);

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

  const subscoreCategories = [
    { name: 'Bradykinesia', items: bradykinesiaItems, color: '#4E79A7' },
    { name: 'Rigidity', items: rigidityItems, color: '#59A14F' },
    { name: 'Tremor', items: tremorItems, color: '#E15759' },
    { name: 'Axial', items: axialItems, color: '#F28E2B' },
  ];

  const subscoreSumsByTimepoint = {
    bradykinesia: {},
    rigidity: {},
    tremor: {},
    axial: {},
  };

  rawData.forEach((patientData) => {
    Object.keys(patientData).forEach((timepoint) => {
      if (timepoint !== 'id') {
        const calculateSum = (items) =>
          items.reduce((sum, item) => sum + (patientData[timepoint][item] >= threshold ? patientData[timepoint][item] : 0), 0);

        subscoreSumsByTimepoint.bradykinesia[timepoint] = calculateSum(bradykinesiaItems);
        subscoreSumsByTimepoint.rigidity[timepoint] = calculateSum(rigidityItems);
        subscoreSumsByTimepoint.tremor[timepoint] = calculateSum(tremorItems);
        subscoreSumsByTimepoint.axial[timepoint] = calculateSum(axialItems);
      }
    });
  });

  const orderedTimepoints = Object.keys(subscoreSumsByTimepoint.bradykinesia).sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;

    const aIsDay = a.includes('day');
    const bIsDay = b.includes('day');
    const aIsMonth = a.includes('month');
    const bIsMonth = b.includes('month');
    const aIsYear = a.includes('year');
    const bIsYear = b.includes('year');

    if (aIsDay && !bIsDay) return -1;
    if (!aIsDay && bIsDay) return 1;
    if (aIsMonth && !bIsMonth) return -1;
    if (!aIsMonth && bIsMonth) return 1;
    if (aIsYear && !bIsYear) return 1;
    if (!aIsYear && bIsYear) return -1;

    return a.localeCompare(b, undefined, { numeric: true });
  });

  const baseline = {
    bradykinesia: subscoreSumsByTimepoint.bradykinesia['baseline'] || 1,
    rigidity: subscoreSumsByTimepoint.rigidity['baseline'] || 1,
    tremor: subscoreSumsByTimepoint.tremor['baseline'] || 1,
    axial: subscoreSumsByTimepoint.axial['baseline'] || 1,
  };

  const datasets = subscoreCategories.map(({ name, items, color }) => {
    const yValues = orderedTimepoints.map((timepoint) =>
      showPercentage
        ? ((baseline[name.toLowerCase()] - subscoreSumsByTimepoint[name.toLowerCase()][timepoint]) / baseline[name.toLowerCase()]) * 100
        : subscoreSumsByTimepoint[name.toLowerCase()][timepoint]
    );

    return {
      label: name,
      data: yValues,
      borderColor: color,
      backgroundColor: `${color}33`,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
    };
  });

  const data = {
    labels: orderedTimepoints,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Subscore Analysis',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            showPercentage
              ? `Percentage Improvement: ${tooltipItem.raw.toFixed(2)}%`
              : `Score: ${tooltipItem.raw.toFixed(2)}`,
        },
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

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  return (
    <div>
      <div style={{ width: '500px', height: '600px' }}>
        <Line data={data} options={options} />
      </div>
      <div style={{ marginLeft: '70px', marginTop: '-360px' }}>
        <h3 style={{ fontSize: '14px' }}>Set Threshold:</h3>
        <input
          type="number"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold value"
          style={{ marginLeft: '10px', padding: '5px', fontSize: '14px' }}
        />
      </div>
    </div>
  );
}

export default SubscoreAnalysis;

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

function DatabasePlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(true);

  // Define a clean color palette
  const colorPalette = [
    '#4E79A7',
    '#F28E2B',
    '#E15759',
    '#76B7B2',
    '#59A14F',
    '#EDC948',
    '#B07AA1',
    '#FF9DA7',
    '#9C755F',
    '#BAB0AC',
  ];

  const datasets = clinicalData.map((patientData, index) => {
    const patientID = patientData.id;
    const timelines = Object.keys(patientData.clinicalData);

    // Sort timelines with 'baseline' first, then months, then years
    const orderedTimelines = timelines.sort((a, b) => {
      if (a === 'baseline') return -1;
      if (b === 'baseline') return 1;

      const aIsMonth = a.includes('month');
      const bIsMonth = b.includes('month');
      const aIsYear = a.includes('year');
      const bIsYear = b.includes('year');

      if (aIsMonth && !bIsMonth) return -1;
      if (!aIsMonth && bIsMonth) return 1;
      if (aIsYear && !bIsYear) return 1;
      if (!aIsYear && bIsYear) return -1;

      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Calculate baseline total score for percentage calculation
    const baselineScores = Object.values(patientData.clinicalData['baseline'] || {});
    const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

    // Calculate total scores for each ordered timeline
    const data = orderedTimelines.map((timeline) => {
      const scores = Object.values(patientData.clinicalData[timeline] || {});
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      return showPercentage
        ? ((baselineTotal - totalScore) / baselineTotal) * 100 // Calculate percentage improvement
        : totalScore;
    });

    return {
      label: `Patient ${patientID}`,
      data,
      fill: false,
      borderColor: colorPalette[index % colorPalette.length], // Use colors from the palette
      tension: 0.2,
      spanGaps: false,
    };
  });

  const labels = clinicalData[0]
    ? Object.keys(clinicalData[0].clinicalData).sort((a, b) => {
        if (a === 'baseline') return -1;
        if (b === 'baseline') return 1;

        const aIsMonth = a.includes('month');
        const bIsMonth = b.includes('month');
        const aIsYear = a.includes('year');
        const bIsYear = b.includes('year');

        if (aIsMonth && !bIsMonth) return -1;
        if (!aIsMonth && bIsMonth) return 1;
        if (aIsYear && !bIsYear) return 1;
        if (!aIsYear && bIsYear) return -1;

        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      })
    : [];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Clinical Data Visualization',
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

  const data = {
    labels,
    datasets,
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{fontSize: '16px'}}>
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

export default DatabasePlot;

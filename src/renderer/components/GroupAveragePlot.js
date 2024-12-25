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
  Filler, // Required for shaded areas
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

function GroupAveragePlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(true);

  // Collect all timelines and sort with 'baseline' first
  const timelines = [...new Set(clinicalData.flatMap(patient => Object.keys(patient.clinicalData)))];
  const orderedTimelines = timelines.sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Calculate average and standard deviation for each timeline
  const averages = [];
  const stdDeviations = [];

  orderedTimelines.forEach(timeline => {
    const values = clinicalData.map(patientData => {
      const baselineScores = Object.values(patientData.clinicalData['baseline'] || {});
      const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.values(patientData.clinicalData[timeline] || {});
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      return showPercentage
        ? ((baselineTotal - totalScore) / baselineTotal) * 100 // Calculate percentage improvement
        : totalScore;
    });

    // Calculate mean and standard deviation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

    averages.push(mean);
    stdDeviations.push(stdDev);
  });

  // Data for Chart.js
  const data = {
    labels: orderedTimelines,
    datasets: [
      {
        label: 'Group Average',
        data: averages,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: 'Standard Deviation',
        data: averages.map((avg, i) => avg + stdDeviations[i]),
        backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue shading
        borderWidth: 0,
        fill: '+1', // Fills the area between this and the dataset below
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: '',
        data: averages.map((avg, i) => avg - stdDeviations[i]),
        backgroundColor: 'rgba(173, 216, 230, 0.3)', // Same light blue shading
        borderWidth: 0,
        fill: false, // End of the fill for the standard deviation area
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Group Average with Standard Deviation',
        font: { size: 18 },
        padding: { top: 10, bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            tooltipItem.dataset.label === 'Group Average'
              ? `Average: ${tooltipItem.raw.toFixed(2)}`
              : undefined,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          font: { size: 14 },
        },
        ticks: {
          font: { size: 12 },
        },
      },
      y: {
        title: {
          display: true,
          text: showPercentage ? 'Percentage Improvement (%)' : 'Scores',
          font: { size: 14 },
        },
        ticks: {
          font: { size: 12 },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.5)',
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

export default GroupAveragePlot;

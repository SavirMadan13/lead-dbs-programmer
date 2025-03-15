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
  Filler,
);

function CombinedPlot({ clinicalData, scoretype }) {
  const [showPercentage, setShowPercentage] = useState(true);
  const [showGroupAverage, setShowGroupAverage] = useState(true);
  console.log('Patient data: ', clinicalData);
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

  // Collect all timelines and sort with 'baseline' first
  const timelines = [
    ...new Set(
      clinicalData.flatMap((patient) => Object.keys(patient.clinicalData)),
    ),
  ];
  console.log('Timelines: ', timelines);
  const orderedTimelines = timelines.sort((a, b) => {
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

    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
  console.log('Ordered timelines: ', orderedTimelines);
  // Calculate average and standard deviation for each timeline
  const averages = [];
  const stdDeviations = [];

  orderedTimelines.forEach((timeline) => {
    const values = clinicalData.map((patientData) => {
      // Check if the patient has clinical data for the baseline and the current timeline
      if (patientData.clinicalData === {}) {
        return null;
      }
      const baselineData = patientData.clinicalData.baseline?.[scoretype];
      const timelineData = patientData.clinicalData[timeline]?.[scoretype];
      console.log(baselineData, timelineData);
      if (!baselineData || !timelineData) {
        return null; // Return null if data is missing
      }

      const baselineScores = Object.values(baselineData).filter(score => typeof score === 'number');

      const baselineTotal =
        baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.values(timelineData).filter(score => typeof score === 'number');
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      console.log(baselineTotal, totalScore);
      return showPercentage
        ? ((baselineTotal - totalScore) / baselineTotal) * 100
        : totalScore;
    }).filter(value => value !== null && !isNaN(value)); // Filter out null and NaN values
    console.log(values);
    if (values.length === 0) {
      averages.push(0); // Handle case where no valid values are present
      stdDeviations.push(0);
      return;
    }

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length,
    );

    averages.push(mean);
    stdDeviations.push(stdDev);
  });
  console.log('Averages: ', averages);
  console.log('Std deviations: ', stdDeviations);
  // Create datasets for individual patients
  const patientDatasets = clinicalData.map((patientData, index) => {
    const patientID = patientData.id;
    const baselineScores = Object.values(
      patientData.clinicalData.baseline?.[scoretype] || {},
    ).filter(score => typeof score === 'number');
    const baselineTotal =
      baselineScores.reduce((sum, score) => sum + score, 0) || 1;

    const data = orderedTimelines.map((timeline) => {
      const timelineData = patientData.clinicalData[timeline]?.[scoretype];
      if (!timelineData) {
        return null; // Return null if timeline data is missing
      }
      const scores = Object.values(timelineData).filter(score => typeof score === 'number');
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      return showPercentage
        ? ((baselineTotal - totalScore) / baselineTotal) * 100
        : totalScore;
    }).filter(value => value !== null && !isNaN(value)); // Filter out null and NaN values

    return {
      label: `Patient ${patientID}`,
      data,
      fill: false,
      borderColor: colorPalette[index % colorPalette.length],
      tension: 0.2,
      spanGaps: false,
    };
  }).filter(dataset => dataset.data.length > 0); // Filter out datasets with no data

  // Create datasets for group average
  const groupAverageDataset = [
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
      backgroundColor: 'rgba(173, 216, 230, 0.3)',
      borderWidth: 0,
      fill: '+1',
      tension: 0.3,
      pointRadius: 0,
    },
    {
      label: '',
      data: averages.map((avg, i) => avg - stdDeviations[i]),
      backgroundColor: 'rgba(173, 216, 230, 0.3)',
      borderWidth: 0,
      fill: false,
      tension: 0.3,
      pointRadius: 0,
    },
  ];

  const data = {
    labels: orderedTimelines,
    datasets: showGroupAverage ? groupAverageDataset : patientDatasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: !showGroupAverage,
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            labels.forEach(label => {
              label.fillStyle = label.strokeStyle; // Use the stroke color to fill the legend
            });
            return labels;
          },
        },
      },
      title: {
        display: true,
        text: showGroupAverage
          ? 'Group Average with Standard Deviation'
          : 'Clinical Data Visualization',
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

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ fontSize: '16px' }}>
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={() => setShowPercentage((prev) => !prev)}
          />
          Show Percentage Improvement
        </h3>
        <h3 style={{ fontSize: '16px' }}>
          <input
            type="checkbox"
            checked={showGroupAverage}
            onChange={() => setShowGroupAverage((prev) => !prev)}
          />
          Show Group Average
        </h3>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}

export default CombinedPlot;

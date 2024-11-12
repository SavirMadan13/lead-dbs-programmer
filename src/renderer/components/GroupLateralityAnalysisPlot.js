import React, { useState } from 'react';
import Plot from 'react-plotly.js';

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

  const timelines = [...new Set(clinicalData.flatMap(patient => Object.keys(patient.clinicalData)))];
  const orderedTimelines = timelines.sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Initialize arrays for averages only
  const leftAverages = [];
  const rightAverages = [];

  orderedTimelines.forEach(timeline => {
    const leftValues = clinicalData.map(patientData => {
      const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
        .filter(([item]) => leftSideItems.includes(item))
        .map(([, score]) => score);
      const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.entries(patientData.clinicalData[timeline] || {})
        .filter(([item]) => leftSideItems.includes(item))
        .map(([, score]) => score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
    });

    const rightValues = clinicalData.map(patientData => {
      const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
        .filter(([item]) => rightSideItems.includes(item))
        .map(([, score]) => score);
      const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

      const scores = Object.entries(patientData.clinicalData[timeline] || {})
        .filter(([item]) => rightSideItems.includes(item))
        .map(([, score]) => score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
    });

    // Calculate mean for left and right values
    const leftMean = leftValues.reduce((sum, val) => sum + val, 0) / leftValues.length;
    const rightMean = rightValues.reduce((sum, val) => sum + val, 0) / rightValues.length;

    leftAverages.push(leftMean);
    rightAverages.push(rightMean);
  });

  // Plot data for left and right without standard deviation areas
  const leftTrace = {
    x: orderedTimelines,
    y: leftAverages,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Left Side Average',
    line: { width: 2, color: 'blue' },
  };

  const rightTrace = {
    x: orderedTimelines,
    y: rightAverages,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Right Side Average',
    line: { width: 2, color: 'red' },
  };

  return (
    <div>
      <div style={{ marginTop: '30px', marginBottom: '-10px' }}>
        <h3 style={{fontSize: '14px'}}>
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={() => setShowPercentage((prev) => !prev)}
          />
          Show Percentage Improvement
        </h3>
      </div>
      <Plot
        data={[leftTrace, rightTrace]}
        layout={{
          xaxis: {
            title: 'Time',
            tickfont: { size: 14, color: '#333' },
            gridcolor: '#f2f2f2',
          },
          yaxis: {
            title: showPercentage ? 'Percentage Improvement (%)' : 'Scores',
            tickfont: { size: 14, color: '#333' },
            gridcolor: '#e6e6e6',
            zeroline: true,
            zerolinecolor: '#000',
          },
          plot_bgcolor: '#fafafa',
          paper_bgcolor: '#ffffff',
          margin: { l: 60, r: 40, t: 80, b: 60 },
          hovermode: 'closest',
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default GroupLateralityAveragePlot;

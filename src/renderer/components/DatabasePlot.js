import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function DatabasePlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(false);
  const traces = clinicalData.map((patientData, index) => {
    const patientID = patientData.id;
    const timelines = Object.keys(patientData.clinicalData);

    // Sort timelines with 'baseline' first
    const orderedTimelines = timelines.sort((a, b) => {
      if (a === 'baseline') return -1;
      if (b === 'baseline') return 1;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Calculate baseline total score for percentage calculation
    const baselineScores = Object.values(patientData.clinicalData['baseline'] || {});
    const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

    // Calculate total scores for each ordered timeline
    const yValues = orderedTimelines.map((timeline) => {
      const scores = Object.values(patientData.clinicalData[timeline] || {});
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      return showPercentage
        ? ((baselineTotal - totalScore) / baselineTotal) * 100 // Calculate percentage improvement
        : totalScore;
    });

    return {
      x: orderedTimelines,
      y: yValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: patientID, // Use generated patient ID for the legend
      line: { width: 2 },
      marker: { size: 6 },
    };
  });

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
        data={traces}
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

export default DatabasePlot;

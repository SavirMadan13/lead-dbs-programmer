import React, { useState } from 'react';
import Plot from 'react-plotly.js';

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

  // Prepare data for average line with shaded area
  const traceAverage = {
    x: orderedTimelines,
    y: averages,
    type: 'scatter',
    mode: 'lines',
    name: 'Group Average',
    line: { width: 2, color: 'blue' },
  };

  const traceMargin = {
    x: [...orderedTimelines, ...orderedTimelines.slice().reverse()],
    y: [...averages.map((avg, i) => avg + stdDeviations[i]), ...averages.map((avg, i) => avg - stdDeviations[i]).reverse()],
    type: 'scatter',
    fill: 'toself',
    fillcolor: 'rgba(173, 216, 230, 0.3)', // Light blue for standard deviation area
    line: { width: 0 },
    showlegend: false,
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
        data={[traceAverage, traceMargin]}
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

export default GroupAveragePlot;

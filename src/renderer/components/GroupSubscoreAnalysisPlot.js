import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function GroupSubscoreAnalysisPlot({ clinicalData }) {
  const [showPercentage, setShowPercentage] = useState(true);

  const bradykinesiaItems = [
    '3.4a: Finger tapping- Right hand', '3.4b: Finger tapping- Left hand',
    '3.5a: Hand movements- Right hand', '3.5b: Hand movements- Left hand',
    '3.6a: Pronation- supination movements- Right hand', '3.6b: Pronation- supination movements- Left hand',
    '3.7a: Toe tapping- Right foot', '3.7b: Toe tapping- Left foot',
    '3.8a: Leg agility- Right leg', '3.8b: Leg agility- Left leg',
    '3.14: Global spontaneity of movement'
  ];

  const rigidityItems = [
    '3.3a: Rigidity- Neck', '3.3b: Rigidity- RUE', '3.3c: Rigidity- LUE',
    '3.3d: Rigidity- RLE', '3.3e: Rigidity- LLE'
  ];

  const tremorItems = [
    '3.15a: Postural tremor- Right hand', '3.15b: Postural tremor- Left hand',
    '3.16a: Kinetic tremor- Right hand', '3.16b: Kinetic tremor- Left hand',
    '3.17a: Rest tremor amplitude- RUE', '3.17b: Rest tremor amplitude- LUE',
    '3.17c: Rest tremor amplitude- RLE', '3.17d: Rest tremor amplitude- LLE',
    '3.17e: Rest tremor amplitude- Lip/jaw', '3.18: Constancy of rest tremor'
  ];

  const axialItems = [
    '3.1: Speech', '3.2: Facial expression', '3.9: Arising from chair',
    '3.10: Gait', '3.11: Freezing of gait', '3.12: Postural stability',
    '3.13: Posture'
  ];

  const categories = [
    { name: 'Bradykinesia', items: bradykinesiaItems, color: 'blue' },
    { name: 'Rigidity', items: rigidityItems, color: 'green' },
    { name: 'Tremor', items: tremorItems, color: 'red' },
    { name: 'Axial', items: axialItems, color: 'purple' }
  ];

  const timelines = [...new Set(clinicalData.flatMap(patient => Object.keys(patient.clinicalData)))];
  const orderedTimelines = timelines.sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  // const calculateMeanAndStdDev = (values) => {
  //   const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  //   const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  //   return { mean, stdDev };
  // };

  // const plotData = categories.flatMap(({ name, items, color }) => {
  //   const averages = [];
  //   const stdDeviations = [];

  //   orderedTimelines.forEach(timeline => {
  //     const values = clinicalData.map(patientData => {
  //       const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
  //         .filter(([item]) => items.includes(item))
  //         .map(([, score]) => score);
  //       const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

  //       const scores = Object.entries(patientData.clinicalData[timeline] || {})
  //         .filter(([item]) => items.includes(item))
  //         .map(([, score]) => score);
  //       const totalScore = scores.reduce((sum, score) => sum + score, 0);

  //       return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
  //     });

  //     const { mean, stdDev } = calculateMeanAndStdDev(values);
  //     averages.push(mean);
  //     stdDeviations.push(stdDev);
  //   });

  //   const traceAverage = {
  //     x: orderedTimelines,
  //     y: averages,
  //     type: 'scatter',
  //     mode: 'lines',
  //     name: `${name} Average`,
  //     line: { width: 2, color },
  //   };

  //   const traceMargin = {
  //     x: [...orderedTimelines, ...orderedTimelines.slice().reverse()],
  //     y: [...averages.map((avg, i) => avg + stdDeviations[i]), ...averages.map((avg, i) => avg - stdDeviations[i]).reverse()],
  //     type: 'scatter',
  //     fill: 'toself',
  //     fillcolor: `rgba(${color === 'blue' ? '173, 216, 230' : color === 'green' ? '144, 238, 144' : color === 'red' ? '255, 182, 193' : '221, 160, 221'}, 0.3)`,
  //     line: { width: 0 },
  //     showlegend: false,
  //   };

  //   return [traceAverage, traceMargin];
  // });

  const calculateMean = (values) => {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const plotData = categories.map(({ name, items, color }) => {
    const averages = orderedTimelines.map(timeline => {
      const values = clinicalData.map(patientData => {
        const baselineScores = Object.entries(patientData.clinicalData['baseline'] || {})
          .filter(([item]) => items.includes(item))
          .map(([, score]) => score);
        const baselineTotal = baselineScores.reduce((sum, score) => sum + score, 0) || 1;

        const scores = Object.entries(patientData.clinicalData[timeline] || {})
          .filter(([item]) => items.includes(item))
          .map(([, score]) => score);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        return showPercentage ? ((baselineTotal - totalScore) / baselineTotal) * 100 : totalScore;
      });

      return calculateMean(values);
    });

    return {
      x: orderedTimelines,
      y: averages,
      type: 'scatter',
      mode: 'lines+markers',
      name: `${name} Average`,
      line: { width: 2, color },
    };
  });
  return (
    <div>
      <div style={{ marginTop: '30px', marginBottom: '-10px' }}>
        <h3 style={{ fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={() => setShowPercentage((prev) => !prev)}
          />
          Show Percentage Improvement
        </h3>
      </div>
      <Plot
        data={plotData}
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

export default GroupSubscoreAnalysisPlot;

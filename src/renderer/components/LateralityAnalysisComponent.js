import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function LateralityAnalysisComponent({ rawData }) {
  function splitScoresByLaterality(scores, threshold) {
    const leftSideItems = [
      '3.3c: Rigidity- LUE',
      '3.3e: Rigidity- LLE',
      '3.4b: Finger tapping- Left hand',
      '3.5b: Hand movements- Left hand',
      '3.6b: Pronation- supination movements- Left hand',
      '3.7b: Toe tapping- Left foot',
      '3.8b: Leg agility- Left leg',
      '3.15b: Postural tremor- Left hand',
      '3.16b: Kinetic tremor- Left hand',
      '3.17b: Rest tremor amplitude- LUE',
      '3.17d: Rest tremor amplitude- LLE',
    ];

    const rightSideItems = [
      '3.3b: Rigidity- RUE',
      '3.3d: Rigidity- RLE',
      '3.4a: Finger tapping- Right hand',
      '3.5a: Hand movements- Right hand',
      '3.6a: Pronation- supination movements- Right hand',
      '3.7a: Toe tapping- Right foot',
      '3.8a: Leg agility- Right leg',
      '3.15a: Postural tremor- Right hand',
      '3.16a: Kinetic tremor- Right hand',
      '3.17a: Rest tremor amplitude- RUE',
      '3.17c: Rest tremor amplitude- RLE',
    ];

    const leftSideSum = leftSideItems.reduce((sum, item) => {
      const value = scores[item] || 0;
      return sum + (value >= threshold ? value : 0);
    }, 0);

    const rightSideSum = rightSideItems.reduce((sum, item) => {
      const value = scores[item] || 0;
      return sum + (value >= threshold ? value : 0);
    }, 0);

    return { leftSideSum, rightSideSum };
  }

  const [threshold, setThreshold] = useState(0);

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  const leftSumsByTimepoint = {};
  const rightSumsByTimepoint = {};

  rawData.forEach((patientData) => {
    Object.keys(patientData).forEach((timepoint) => {
      if (timepoint !== 'id') {
        const { leftSideSum, rightSideSum } = splitScoresByLaterality(
          patientData[timepoint],
          threshold,
        );

        if (!leftSumsByTimepoint[timepoint]) {
          leftSumsByTimepoint[timepoint] = [];
          rightSumsByTimepoint[timepoint] = [];
        }

        leftSumsByTimepoint[timepoint].push(leftSideSum);
        rightSumsByTimepoint[timepoint].push(rightSideSum);
      }
    });
  });

  const plotData = [];
  let isFirstLeft = true;
  let isFirstRight = true;

  Object.keys(leftSumsByTimepoint)
    .sort((a, b) => {
      if (a === 'baseline') return -1;
      if (b === 'baseline') return 1;
      return a.localeCompare(b, undefined, { numeric: true });
    })
    .forEach((timepoint) => {
      plotData.push(
        {
          type: 'box',
          x: leftSumsByTimepoint[timepoint].map(() => timepoint),
          y: leftSumsByTimepoint[timepoint],
          name: 'Left Side',
          boxpoints: 'all',
          jitter: 0.3,
          pointpos: -1.8,
          marker: { color: 'rgba(0, 123, 255, 0.7)', size: 10 },
          line: { color: 'rgba(0, 123, 255, 1)' },
          fillcolor: 'rgba(0, 123, 255, 0.3)',
          showlegend: isFirstLeft,
        },
        {
          type: 'box',
          x: rightSumsByTimepoint[timepoint].map(() => timepoint),
          y: rightSumsByTimepoint[timepoint],
          name: 'Right Side',
          boxpoints: 'all',
          jitter: 0.3,
          pointpos: -1.8,
          marker: { color: 'rgba(255, 99, 132, 0.7)', size: 10 },
          line: { color: 'rgba(255, 99, 132, 1)' },
          fillcolor: 'rgba(255, 99, 132, 0.3)',
          showlegend: isFirstRight,
        },
      );

      isFirstLeft = false;
      isFirstRight = false;
    });

  return (
    <div>
      <Plot
        data={plotData}
        layout={{
          title: {
            text: 'Laterality',
            font: {
              family: 'Arial, sans-serif',
              size: 24,
              color: '#333',
            },
            x: 0.5,
            xanchor: 'center',
          },
          yaxis: {
            title: {
              text: 'Scores',
              font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#333',
              },
            },
            tickfont: {
              size: 14,
              color: '#333',
            },
            gridcolor: '#e6e6e6',
            zeroline: true,
            zerolinecolor: '#e6e6e6',
            rangemode: 'tozero',
          },
          xaxis: {
            title: {
              text: 'Timepoints',
              font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#333',
              },
            },
            tickfont: {
              size: 14,
              color: '#333',
            },
            gridcolor: '#f2f2f2',
          },
          boxmode: 'group',
          showlegend: true,
          legend: {
            x: 1,
            y: 1,
            xanchor: 'right',
            yanchor: 'top',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#ccc',
            borderwidth: 1,
            font: {
              family: 'Arial, sans-serif',
              size: 14,
              color: '#333',
            },
          },
          plot_bgcolor: '#f9f9f9',
          paper_bgcolor: '#ffffff',
          margin: { l: 80, r: 40, t: 80, b: 60 },
          hovermode: 'closest',
        }}
        style={{ width: '100%', height: '100%' }}
      />
      <div>
        <label style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Set Threshold:{' '}
        </label>
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

export default LateralityAnalysisComponent;

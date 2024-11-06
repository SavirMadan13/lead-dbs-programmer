import React from 'react';
import Plot from 'react-plotly.js';

function PairedTTestComponent({ rawData }) {
  const scoreSums = {};

  // Calculate the total score for each time point, excluding 'id'
  rawData.forEach((patient) => {
    Object.keys(patient).forEach((timepoint) => {
      if (timepoint !== 'id') {
        const scores = Object.values(patient[timepoint]);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        // Initialize or add to the total for this time point
        if (!scoreSums[timepoint]) {
          scoreSums[timepoint] = 0;
        }
        scoreSums[timepoint] += totalScore;
      }
    });
  });

  // Prepare ordered data for the line chart
  const orderedTimepoints = Object.keys(scoreSums).sort((a, b) => {
    // Place 'baseline' first, then sort others naturally (e.g., '3months', '6months', etc.)
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  const xValues = orderedTimepoints;
  const yValues = orderedTimepoints.map((timepoint) => scoreSums[timepoint]);

  return (
    <div>
      <Plot
        data={[
          {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{
          // title: {
          //   text: 'Sum of UPDRS Scores Across Time Points',
          //   font: {
          //     family: 'Arial, sans-serif',
          //     size: 18,
          //   },
          // },
          xaxis: {
            title: {
              text: 'Time',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
              },
            },
          },
          yaxis: {
            title: {
              text: 'UPDRS Score',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
              },
            },
            rangemode: 'tozero',
          },
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default PairedTTestComponent;

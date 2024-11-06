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
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
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
            line: {
              color: '#1f77b4', // Blue line
              width: 3, // Slightly thicker line
            },
            marker: {
              color: '#ff7f0e', // Orange markers
              size: 8, // Larger markers for emphasis
              symbol: 'circle', // Circle marker shape
              line: {
                color: 'white', // White border around markers
                width: 1.5,
              },
            },
          },
        ]}
        layout={{
          // title: {
          //   text: 'UPDRS Score Over Time',
          //   font: {
          //     family: 'Arial, sans-serif',
          //     size: 20,
          //     color: '#333',
          //   },
          //   xref: 'paper',
          //   x: 0.5, // Center align title
          // },
          xaxis: {
            title: {
              text: 'Time',
              font: {
                family: 'Arial, sans-serif',
                size: 16,
                color: '#333',
              },
            },
            tickfont: {
              size: 12,
              color: '#333',
            },
            showgrid: true,
            gridcolor: '#e5e5e5', // Light gray grid lines for x-axis
          },
          yaxis: {
            title: {
              text: 'UPDRS Score',
              font: {
                family: 'Arial, sans-serif',
                size: 16,
                color: '#333',
              },
            },
            tickfont: {
              size: 12,
              color: '#333',
            },
            rangemode: 'tozero',
            showgrid: true,
            gridcolor: '#e5e5e5', // Light gray grid lines for y-axis
          },
          plot_bgcolor: '#fafafa', // Light background for plot area
          paper_bgcolor: '#ffffff', // White background for entire chart
          margin: {
            l: 60,
            r: 40,
            t: 80,
            b: 60,
          },
          hovermode: 'closest', // Highlight nearest point on hover
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default PairedTTestComponent;

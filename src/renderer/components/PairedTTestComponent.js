// import React, { useState } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import { tTest, mean } from 'simple-statistics';

// // Register the components you plan to use
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// );

// function PairedTTestComponent() {
//   // Sample data for baseline and postop values
//   const [baselineValues, setBaselineValues] = useState([20, 25, 22, 28, 30]);
//   const [postopValues, setPostopValues] = useState([18, 24, 21, 27, 31]);

//   // Calculate the differences between baseline and postop
//   const differences = baselineValues.map(
//     (value, index) => value - postopValues[index],
//   );

//   // Perform the paired t-test
//   const meanDifference = mean(differences);
//   const tTestResult = tTest(differences, 0);

//   // Prepare data for visualization
//   const data = {
//     labels: baselineValues.map((_, index) => `Patient ${index + 1}`),
//     datasets: [
//       {
//         label: 'Baseline',
//         data: baselineValues,
//         borderColor: 'rgba(75,192,192,1)',
//         backgroundColor: 'rgba(75,192,192,0.2)',
//         fill: false,
//       },
//       {
//         label: 'Postoperative',
//         data: postopValues,
//         borderColor: 'rgba(153,102,255,1)',
//         backgroundColor: 'rgba(153,102,255,0.2)',
//         fill: false,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Paired T-Test Results</h2>
//       <p>Mean Difference: {meanDifference.toFixed(2)}</p>
//       <p>t-Statistic: {tTestResult.toFixed(4)}</p>
//       <Line data={data} options={options} />
//     </div>
//   );
// }

// export default PairedTTestComponent;

import React from 'react';
import Plot from 'react-plotly.js';

function PairedViolinPlotComponent({ baselineValues, postopValues }) {
  // Generate patient labels or indexes for the x-axis
  const patientLabels = baselineValues.map(
    (_, index) => `Patient ${index + 1}`,
  );

  // Create trace for lines connecting baseline to postop values
  const lines = patientLabels.map((label, index) => ({
    x: ['Baseline', 'Postoperative'],
    y: [baselineValues[index], postopValues[index]],
    mode: 'lines',
    line: {
      color: 'gray',
      width: 1.5,
    },
    // marker: {
    //   size: 8,
    // },
    showlegend: false,
    hoverinfo: 'none',
  }));

  return (
    <div>
      {/* <h2>Paired Violin Plot with Enhanced Aesthetics</h2> */}
      <Plot
        data={[
          // Half Violin plot for baseline values
          {
            type: 'violin',
            x: baselineValues.map(() => 'Baseline'),
            y: baselineValues,
            name: 'Baseline',
            side: 'negative',
            points: 'none',
            line: {
              color: 'rgba(0, 123, 255, 1)', // Blue border color
            },
            fillcolor: 'rgba(0, 123, 255, 0.3)', // Softer blue fill
            spanmode: 'soft',
            width: 0.6, // Reducing width to bring violins closer
          },
          // Half Violin plot for postoperative values
          {
            type: 'violin',
            x: postopValues.map(() => 'Postoperative'),
            y: postopValues,
            name: 'Postoperative',
            side: 'positive',
            points: 'none',
            line: {
              color: 'rgba(255, 99, 132, 1)', // Red border color
            },
            fillcolor: 'rgba(255, 99, 132, 0.3)', // Softer red fill
            spanmode: 'soft',
            width: 0.6, // Reducing width to bring violins closer
          },
          // Scatter plot to show individual baseline values
          {
            type: 'scatter',
            x: baselineValues.map(() => 'Baseline'),
            y: baselineValues,
            mode: 'markers',
            marker: {
              color: 'rgba(0, 123, 255, 0.7)', // Match violin color but a bit darker
              size: 10,
              symbol: 'circle', // Hollow circle
            },
            name: 'Individual Baseline',
            showlegend: false,
          },
          // Scatter plot to show individual postoperative values
          {
            type: 'scatter',
            x: postopValues.map(() => 'Postoperative'),
            y: postopValues,
            mode: 'markers',
            marker: {
              color: 'rgba(255, 99, 132, 0.7)', // Match violin color but a bit darker
              size: 10,
              symbol: 'circle', // Hollow circle
            },
            name: 'Individual Postoperative',
            showlegend: false,
          },
          // Lines connecting baseline to postoperative values
          ...lines,
        ]}
        layout={{
          title: {
            text: 'Baseline vs Postoperative UPDRS Scores',
            font: {
              family: 'Arial, sans-serif',
              size: 18,
            },
          },
          yaxis: {
            zeroline: false,
            title: {
              text: 'Scores',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
              },
            },
          },
          xaxis: {
            title: {
              // text: 'Condition',
              font: {
                family: 'Arial, sans-serif',
                size: 14,
              },
            },
            showticklabels: false,
          },
          hovermode: 'closest',
          margin: {
            l: 60,
            r: 60,
            t: 80,
            b: 60,
          },
          violingap: 0.2, // Reduce gap between violins
          violingroupgap: 0, // No group gap for paired data
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default PairedViolinPlotComponent;

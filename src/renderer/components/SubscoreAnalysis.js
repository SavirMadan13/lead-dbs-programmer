// import React, { useState } from 'react';
// import Plot from 'react-plotly.js';

// function SubscoreAnalysis({ rawData }) {
//   function splitScoresBySubscore(scores, threshold) {
//     const bradykinesiaItems = [
//       '3.4a: Finger tapping- Right hand',
//       '3.4b: Finger tapping- Left hand',
//       '3.5a: Hand movements- Right hand',
//       '3.5b: Hand movements- Left hand',
//       '3.6a: Pronation- supination movements- Right hand',
//       '3.6b: Pronation- supination movements- Left hand',
//       '3.7a: Toe tapping- Right foot',
//       '3.7b: Toe tapping- Left foot',
//       '3.8a: Leg agility- Right leg',
//       '3.8b: Leg agility- Left leg',
//       '3.14: Global spontaneity of movement'
//     ];

//     const rigidityItems = [
//       '3.3a: Rigidity- Neck',
//       '3.3b: Rigidity- RUE',
//       '3.3c: Rigidity- LUE',
//       '3.3d: Rigidity- RLE',
//       '3.3e: Rigidity- LLE'
//     ];

//     const tremorItems = [
//       '3.15a: Postural tremor- Right hand',
//       '3.15b: Postural tremor- Left hand',
//       '3.16a: Kinetic tremor- Right hand',
//       '3.16b: Kinetic tremor- Left hand',
//       '3.17a: Rest tremor amplitude- RUE',
//       '3.17b: Rest tremor amplitude- LUE',
//       '3.17c: Rest tremor amplitude- RLE',
//       '3.17d: Rest tremor amplitude- LLE',
//       '3.17e: Rest tremor amplitude- Lip/jaw',
//       '3.18: Constancy of rest tremor'
//     ];

//     const axialItems = [
//       '3.1: Speech',
//       '3.2: Facial expression',
//       '3.9: Arising from chair',
//       '3.10: Gait',
//       '3.11: Freezing of gait',
//       '3.12: Postural stability',
//       '3.13: Posture'
//     ];

//     const calculateSum = (items) =>
//       items.reduce((sum, item) => sum + (scores[item] >= threshold ? scores[item] : 0), 0);

//     return {
//       bradykinesia: calculateSum(bradykinesiaItems),
//       rigidity: calculateSum(rigidityItems),
//       tremor: calculateSum(tremorItems),
//       axial: calculateSum(axialItems)
//     };
//   }

//   const [threshold, setThreshold] = useState(0);

//   const handleThresholdChange = (e) => {
//     setThreshold(Number(e.target.value));
//   };

//   const subscoreSumsByTimepoint = {
//     bradykinesia: {},
//     rigidity: {},
//     tremor: {},
//     axial: {}
//   };

//   rawData.forEach((patientData) => {
//     Object.keys(patientData).forEach((timepoint) => {
//       if (timepoint !== 'id') {
//         const { bradykinesia, rigidity, tremor, axial } = splitScoresBySubscore(
//           patientData[timepoint],
//           threshold
//         );

//         if (!subscoreSumsByTimepoint.bradykinesia[timepoint]) {
//           subscoreSumsByTimepoint.bradykinesia[timepoint] = 0;
//           subscoreSumsByTimepoint.rigidity[timepoint] = 0;
//           subscoreSumsByTimepoint.tremor[timepoint] = 0;
//           subscoreSumsByTimepoint.axial[timepoint] = 0;
//         }

//         subscoreSumsByTimepoint.bradykinesia[timepoint] += bradykinesia;
//         subscoreSumsByTimepoint.rigidity[timepoint] += rigidity;
//         subscoreSumsByTimepoint.tremor[timepoint] += tremor;
//         subscoreSumsByTimepoint.axial[timepoint] += axial;
//       }
//     });
//   });

//   const plotData = [];
//   const subscoreNames = ['bradykinesia', 'rigidity', 'tremor', 'axial'];
//   const colors = ['rgba(0, 123, 255, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(60, 179, 113, 0.7)', 'rgba(255, 165, 0, 0.7)'];

//   subscoreNames.forEach((subscore, index) => {
//     plotData.push({
//       type: 'scatter',
//       mode: 'lines+markers',
//       x: Object.keys(subscoreSumsByTimepoint[subscore]).sort((a, b) => {
//         if (a === 'baseline') return -1;
//         if (b === 'baseline') return 1;
//         return a.localeCompare(b, undefined, { numeric: true });
//       }),
//       y: Object.keys(subscoreSumsByTimepoint[subscore]).sort((a, b) => {
//         if (a === 'baseline') return -1;
//         if (b === 'baseline') return 1;
//         return a.localeCompare(b, undefined, { numeric: true });
//       }).map((timepoint) => subscoreSumsByTimepoint[subscore][timepoint]),
//       name: subscore.charAt(0).toUpperCase() + subscore.slice(1),
//       line: { color: colors[index] },
//       marker: { color: colors[index] }
//     });
//   });

//   return (
//     <div>
//       <Plot
//         data={plotData}
//         layout={{
//           yaxis: {
//             title: {
//               text: 'Scores',
//               font: {
//                 family: 'Arial, sans-serif',
//                 size: 18,
//                 color: '#333',
//               },
//             },
//             tickfont: {
//               size: 14,
//               color: '#333',
//             },
//             gridcolor: '#e6e6e6',
//             zeroline: true,
//             zerolinecolor: '#e6e6e6',
//             rangemode: 'tozero',
//           },
//           xaxis: {
//             title: {
//               text: 'Time',
//               font: {
//                 family: 'Arial, sans-serif',
//                 size: 18,
//                 color: '#333',
//               },
//             },
//             tickfont: {
//               size: 14,
//               color: '#333',
//             },
//             gridcolor: '#f2f2f2',
//           },
//           showlegend: true,
//           legend: {
//             x: 1,
//             y: 1,
//             xanchor: 'right',
//             yanchor: 'top',
//             bgcolor: 'rgba(255, 255, 255, 0.8)',
//             bordercolor: '#ccc',
//             borderwidth: 1,
//             font: {
//               family: 'Arial, sans-serif',
//               size: 14,
//               color: '#333',
//             },
//           },
//           plot_bgcolor: '#f9f9f9',
//           paper_bgcolor: '#ffffff',
//           margin: { l: 80, r: 40, t: 80, b: 60 },
//           hovermode: 'closest',
//         }}
//         style={{ width: '100%', height: '100%' }}
//       />
//       <div style={{marginLeft: '120px', marginTop: '30px'}}>
//         <h3 style={{ fontSize: '14px' }}>Set Threshold:</h3>
//         <input
//           type="number"
//           value={threshold}
//           onChange={handleThresholdChange}
//           placeholder="Enter threshold value"
//           style={{ marginLeft: '10px', padding: '5px', fontSize: '14px' }}
//         />
//       </div>
//     </div>
//   );
// }

// export default SubscoreAnalysis;

import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function SubscoreAnalysis({ rawData, showPercentage }) {
  function splitScoresBySubscore(scores, threshold) {
    const bradykinesiaItems = [
      '3.4a: Finger tapping- Right hand',
      '3.4b: Finger tapping- Left hand',
      '3.5a: Hand movements- Right hand',
      '3.5b: Hand movements- Left hand',
      '3.6a: Pronation- supination movements- Right hand',
      '3.6b: Pronation- supination movements- Left hand',
      '3.7a: Toe tapping- Right foot',
      '3.7b: Toe tapping- Left foot',
      '3.8a: Leg agility- Right leg',
      '3.8b: Leg agility- Left leg',
      '3.14: Global spontaneity of movement'
    ];

    const rigidityItems = [
      '3.3a: Rigidity- Neck',
      '3.3b: Rigidity- RUE',
      '3.3c: Rigidity- LUE',
      '3.3d: Rigidity- RLE',
      '3.3e: Rigidity- LLE'
    ];

    const tremorItems = [
      '3.15a: Postural tremor- Right hand',
      '3.15b: Postural tremor- Left hand',
      '3.16a: Kinetic tremor- Right hand',
      '3.16b: Kinetic tremor- Left hand',
      '3.17a: Rest tremor amplitude- RUE',
      '3.17b: Rest tremor amplitude- LUE',
      '3.17c: Rest tremor amplitude- RLE',
      '3.17d: Rest tremor amplitude- LLE',
      '3.17e: Rest tremor amplitude- Lip/jaw',
      '3.18: Constancy of rest tremor'
    ];

    const axialItems = [
      '3.1: Speech',
      '3.2: Facial expression',
      '3.9: Arising from chair',
      '3.10: Gait',
      '3.11: Freezing of gait',
      '3.12: Postural stability',
      '3.13: Posture'
    ];

    const calculateSum = (items) =>
      items.reduce((sum, item) => sum + (scores[item] >= threshold ? scores[item] : 0), 0);

    return {
      bradykinesia: calculateSum(bradykinesiaItems),
      rigidity: calculateSum(rigidityItems),
      tremor: calculateSum(tremorItems),
      axial: calculateSum(axialItems)
    };
  }

  const [threshold, setThreshold] = useState(0);

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  const subscoreSumsByTimepoint = {
    bradykinesia: {},
    rigidity: {},
    tremor: {},
    axial: {}
  };

  rawData.forEach((patientData) => {
    Object.keys(patientData).forEach((timepoint) => {
      if (timepoint !== 'id') {
        const { bradykinesia, rigidity, tremor, axial } = splitScoresBySubscore(
          patientData[timepoint],
          threshold
        );

        if (!subscoreSumsByTimepoint.bradykinesia[timepoint]) {
          subscoreSumsByTimepoint.bradykinesia[timepoint] = 0;
          subscoreSumsByTimepoint.rigidity[timepoint] = 0;
          subscoreSumsByTimepoint.tremor[timepoint] = 0;
          subscoreSumsByTimepoint.axial[timepoint] = 0;
        }

        subscoreSumsByTimepoint.bradykinesia[timepoint] += bradykinesia;
        subscoreSumsByTimepoint.rigidity[timepoint] += rigidity;
        subscoreSumsByTimepoint.tremor[timepoint] += tremor;
        subscoreSumsByTimepoint.axial[timepoint] += axial;
      }
    });
  });

  // Calculate baseline for percentage improvement if needed
  const baseline = {
    bradykinesia: subscoreSumsByTimepoint.bradykinesia['baseline'] || 1,
    rigidity: subscoreSumsByTimepoint.rigidity['baseline'] || 1,
    tremor: subscoreSumsByTimepoint.tremor['baseline'] || 1,
    axial: subscoreSumsByTimepoint.axial['baseline'] || 1,
  };

  // Prepare data for the plot with dynamic range calculation
  const plotData = [];
  const subscoreNames = ['bradykinesia', 'rigidity', 'tremor', 'axial'];
  const colors = ['rgba(0, 123, 255, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(60, 179, 113, 0.7)', 'rgba(255, 165, 0, 0.7)'];

  let allYValues = [];

  subscoreNames.forEach((subscore, index) => {
    const yValues = Object.keys(subscoreSumsByTimepoint[subscore])
      .sort((a, b) => (a === 'baseline' ? -1 : b === 'baseline' ? 1 : a.localeCompare(b, undefined, { numeric: true })))
      .map((timepoint) =>
        showPercentage
          ? ((baseline[subscore] - subscoreSumsByTimepoint[subscore][timepoint]) / baseline[subscore]) * 100
          : subscoreSumsByTimepoint[subscore][timepoint]
      );

    allYValues = allYValues.concat(yValues);

    plotData.push({
      type: 'scatter',
      mode: 'lines+markers',
      x: Object.keys(subscoreSumsByTimepoint[subscore]).sort((a, b) => {
        if (a === 'baseline') return -1;
        if (b === 'baseline') return 1;
        return a.localeCompare(b, undefined, { numeric: true });
      }),
      y: yValues,
      name: subscore.charAt(0).toUpperCase() + subscore.slice(1),
      line: { color: colors[index] },
      marker: { color: colors[index] }
    });
  });

  // Determine y-axis range with padding below the minimum value
  const minYValue = Math.min(...allYValues);
  const yAxisRange = showPercentage ? [minYValue - 10, Math.max(...allYValues) + 10] : [0, Math.max(...allYValues) + 2];

  return (
    <div>
      <Plot
        data={plotData}
        layout={{
          yaxis: {
            title: {
              text: showPercentage ? 'Percentage Improvement (%)' : 'Scores',
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
            zerolinecolor: '#000', // Black zero line for clarity
            range: yAxisRange, // Dynamic y-axis range
          },
          xaxis: {
            title: {
              text: 'Time',
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
          showlegend: true,
          // legend: {
          //   x: 1,
          //   y: 1,
          //   xanchor: 'right',
          //   yanchor: 'top',
          //   bgcolor: 'rgba(255, 255, 255, 0.8)',
          //   bordercolor: '#ccc',
          //   borderwidth: 1,
          //   font: {
          //     family: 'Arial, sans-serif',
          //     size: 14,
          //     color: '#333',
          //   },
          // },
          legend: {
            x: showPercentage ? 0 : 1,
            y: 1,
            xanchor: showPercentage ? 'left' : 'right',
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
      <div style={{marginLeft: '120px', marginTop: '30px'}}>
        <h3 style={{ fontSize: '14px' }}>Set Threshold:</h3>
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

export default SubscoreAnalysis;

import React, { useState } from 'react';
import Plot from 'react-plotly.js';

function LateralityAnalysisComponent({ rawData }) {
  function splitScoresByLaterality(scores, threshold) {
    const leftSideItems = [
      '3.3c',
      '3.3e',
      '3.4b',
      '3.5b',
      '3.6b',
      '3.7b',
      '3.8b',
      '3.15b',
      '3.16b',
      '3.17b',
      '3.17d',
    ];
    const rightSideItems = [
      '3.3b',
      '3.3d',
      '3.4a',
      '3.5a',
      '3.6a',
      '3.7a',
      '3.8a',
      '3.15a',
      '3.16a',
      '3.17a',
      '3.17c',
    ];

    // Sum the values for left and right sides after applying the threshold
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

  const [threshold, setThreshold] = useState(0); // Default threshold value

  const handleThresholdChange = (e) => {
    setThreshold(Number(e.target.value));
  };

  // Initialize arrays to hold the summed left and right side values for all patients
  const baselineLeftSumValues = [];
  const baselineRightSumValues = [];
  const postopLeftSumValues = [];
  const postopRightSumValues = [];

  rawData.forEach((patientData) => {
    const baselineLaterality = splitScoresByLaterality(
      patientData.baseline,
      threshold,
    );
    const postopLaterality = splitScoresByLaterality(
      patientData.postop,
      threshold,
    );

    baselineLeftSumValues.push(baselineLaterality.leftSideSum);
    baselineRightSumValues.push(baselineLaterality.rightSideSum);
    postopLeftSumValues.push(postopLaterality.leftSideSum);
    postopRightSumValues.push(postopLaterality.rightSideSum);
  });

  return (
    <div>
      <Plot
        data={[
          {
            type: 'box',
            x: baselineLeftSumValues.map(() => 'Baseline Left Side'),
            y: baselineLeftSumValues,
            name: 'Baseline Left Side',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
              color: 'rgba(0, 123, 255, 0.7)',
              size: 10,
            },
            line: {
              color: 'rgba(0, 123, 255, 1)',
            },
            fillcolor: 'rgba(0, 123, 255, 0.3)',
          },
          {
            type: 'box',
            x: postopLeftSumValues.map(() => 'Postop Left Side'),
            y: postopLeftSumValues,
            name: 'Postop Left Side',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
              color: 'rgba(255, 99, 132, 0.7)',
              size: 10,
            },
            line: {
              color: 'rgba(255, 99, 132, 1)',
            },
            fillcolor: 'rgba(255, 99, 132, 0.3)',
          },
          {
            type: 'box',
            x: baselineRightSumValues.map(() => 'Baseline Right Side'),
            y: baselineRightSumValues,
            name: 'Baseline Right Side',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
              color: 'rgba(75, 192, 192, 0.7)',
              size: 10,
            },
            line: {
              color: 'rgba(75, 192, 192, 1)',
            },
            fillcolor: 'rgba(75, 192, 192, 0.3)',
          },
          {
            type: 'box',
            x: postopRightSumValues.map(() => 'Postop Right Side'),
            y: postopRightSumValues,
            name: 'Postop Right Side',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: {
              color: 'rgba(153, 102, 255, 0.7)',
              size: 10,
            },
            line: {
              color: 'rgba(153, 102, 255, 1)',
            },
            fillcolor: 'rgba(153, 102, 255, 0.3)',
          },
        ]}
        layout={{
          title: 'Laterality Analysis',
          yaxis: {
            title: 'Scores',
          },
          boxmode: 'group',
        }}
      />
      <div>
        {/* <label>Set Threshold: </label> */}
        <h2 style={{fontSize: '16px'}}>Set Threshold: </h2>
        <input
          type="number"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold value"
        />
      </div>
    </div>
  );
}

export default LateralityAnalysisComponent;

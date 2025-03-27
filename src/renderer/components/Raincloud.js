import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

function Raincloud({ clinicalData, scoretype }) {
  const [selectedTimelines, setSelectedTimelines] = useState(new Set());

  // Collect all timelines and sort with 'baseline' first
  const timelines = [
    ...new Set(
      clinicalData.flatMap((patient) =>
        Object.keys(patient.clinicalData).filter(timeline =>
          patient.clinicalData[timeline]?.[scoretype] !== undefined
        ),
      ),
    ),
  ];

  // Initialize selectedTimelines with all timelines if not set
  if (selectedTimelines.size === 0) {
    setSelectedTimelines(new Set(timelines));
  }

  const orderedTimelines = timelines.sort((a, b) => {
    if (a === 'baseline') return -1;
    if (b === 'baseline') return 1;

    const aIsDay = a.includes('day');
    const bIsDay = b.includes('day');
    const aIsMonth = a.includes('month');
    const bIsMonth = b.includes('month');
    const aIsYear = a.includes('year');
    const bIsYear = b.includes('year');

    if (aIsDay && !bIsDay) return -1;
    if (!aIsDay && bIsDay) return 1;
    if (aIsMonth && !bIsMonth) return -1;
    if (!aIsMonth && bIsMonth) return 1;
    if (aIsYear && !bIsYear) return 1;
    if (!aIsYear && bIsYear) return -1;

    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  // Filter timelines to only include 'baseline' and 'postop'
  const filteredTimelines = orderedTimelines.filter(timeline =>
    timeline === 'baseline' || timeline === 'postop'
  );

  // Prepare data for raincloud plots using filtered timelines
  const raincloudData = filteredTimelines.map((timeline) => {
    return clinicalData.map((patientData) => {
      const timelineData = patientData.clinicalData[timeline]?.[scoretype];
      if (!timelineData) {
        return null;
      }
      return Object.values(timelineData).filter(score => typeof score === 'number');
    }).filter(values => values !== null);
  });

  // Create traces for raincloud plot using filtered timelines
  const traces = raincloudData.map((data, index) => {
    const yData = data.flat();
    return {
      type: 'violin',
      y: yData,
      name: filteredTimelines[index],
      box: {
        visible: true
      },
      line: {
        color: 'blue'
      },
      meanline: {
        visible: true
      }
    };
  });

  // Create lines connecting baseline to postop
  const baselineIndex = filteredTimelines.indexOf('baseline');
  const postopIndex = filteredTimelines.indexOf('postop');

  if (baselineIndex !== -1 && postopIndex !== -1) {
    const baselineData = raincloudData[baselineIndex];
    const postopData = raincloudData[postopIndex];

    baselineData.forEach((baselineScores, i) => {
      const postopScores = postopData[i];
      if (baselineScores && postopScores) {
        baselineScores.forEach((score, j) => {
          traces.push({
            type: 'scatter',
            mode: 'lines+markers',
            x: ['baseline', 'postop'],
            y: [score, postopScores[j]],
            line: {
              color: 'red',
              width: 1
            },
            marker: {
              color: 'red',
              size: 5
            },
            name: `Line ${i}-${j}`
          });
        });
      }
    });
  }

  // Function to handle timeline selection
  const handleTimelineChange = (timeline) => {
    setSelectedTimelines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(timeline)) {
        newSet.delete(timeline);
      } else {
        newSet.add(timeline);
      }
      return newSet;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <div>
          <Select
            multiple
            value={Array.from(selectedTimelines)}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedTimelines(new Set(value));
            }}
            renderValue={() => 'Timelines'}
            style={{ minWidth: 200 }}
          >
            {orderedTimelines.map((timeline) => (
              <MenuItem key={timeline} value={timeline}>
                <Checkbox checked={selectedTimelines.has(timeline)} />
                <ListItemText primary={timeline} />
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <Plot
        data={traces}
        layout={{
          title: 'Raincloud Plot',
          yaxis: {
            title: 'Scores',
          },
          xaxis: {
            title: 'Timelines',
          },
          showlegend: true,
        }}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}

export default Raincloud;
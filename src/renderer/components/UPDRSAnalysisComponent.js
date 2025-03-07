import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PairedTTestComponent from './PairedTTestComponent';
import BoxPlotComponent from './BoxPlotComponent';
import LateralityAnalysisComponent from './LateralityAnalysisComponent';
// import SubscaleAnalysisComponent from './SubscaleAnalysisComponent';
// import ResponderAnalysisComponent from './ResponderAnalysisComponent';
import CorrelationAnalysisComponent from './CorrelationAnalysisComponent';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import SubscoreAnalysis from './SubscoreAnalysis';

function UPDRSAnalysisComponent({ currentStage, rawData, clinicalTimelines, scoretype }) {
  console.log(rawData);
  const [analysisType, setAnalysisType] = useState(scoretype === 'UPDRS' ? 'all' : 'raincloud');
  const [showPercentage, setShowPercentage] = useState(true);
  const [plotData, setPlotData] = useState(rawData);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  useEffect(() => {
    console.log(clinicalTimelines, rawData);
    const updatedRawData = { ...rawData };
    console.log(updatedRawData);
    Object.keys(clinicalTimelines).forEach((key) => {
      console.log(clinicalTimelines[key].hasClinical);
      console.log(updatedRawData[0][clinicalTimelines[key].timeline]);
      if (!clinicalTimelines[key].hasClinical) {
        delete updatedRawData[0][clinicalTimelines[key].timeline];
        console.log(clinicalTimelines[key].timeline);
      }
    });
    console.log('rawData: ', rawData);
    console.log('updatedRawData: ', updatedRawData);
    setPlotData(updatedRawData);
  }, [clinicalTimelines, rawData]);

  const renderAnalysis = () => {
    switch (analysisType) {
      case 'raincloud':
        return (
          <PairedTTestComponent
            rawData={rawData}
            showPercentage={showPercentage}
            scoretype={scoretype}
          />
        );
      // case 'boxPlot':
      //   return (
      //     <BoxPlotComponent
      //       rawData={rawData}
      //     />
      //   );
      case 'laterality':
        return (
          <LateralityAnalysisComponent
            rawData={rawData}
            showPercentage={showPercentage}
            scoretype={scoretype}
          />
        );
      case 'subscore':
        return (
          <SubscoreAnalysis rawData={rawData} showPercentage={showPercentage} scoretype={scoretype} />
        );
      // // case 'subscale':
      // //   return (
      // //     <SubscaleAnalysisComponent
      // //       baselineValues={baselineValues}
      // //       postopValues={postopValues}
      // //       subscaleValues={subscaleValues}
      // //     />
      // //   );
      // // case 'responder':
      // //   return (
      // //     <ResponderAnalysisComponent
      // //       baselineValues={baselineValues}
      // //       postopValues={postopValues}
      // //     />
      // //   );
      // case 'correlation':
      //   return (
      //     <CorrelationAnalysisComponent
      //       baselineValues={baselineValues}
      //       postopValues={postopValues}
      //     />
      //   );
      case 'all':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <PairedTTestComponent
                rawData={rawData}
                showPercentage={showPercentage}
                scoretype={scoretype}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <LateralityAnalysisComponent
                rawData={rawData}
                showPercentage={showPercentage}
                scoretype={scoretype}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <SubscoreAnalysis
                rawData={rawData}
                showPercentage={showPercentage}
                scoretype={scoretype}
              />
            </div>
          </div>
        );

      default:
        return <p>Please select an analysis type.</p>;
    }
  };

  return (
    <div>
      <h2>UPDRS III Analysis</h2>
      {/* <div>
        <select value={analysisType} onChange={handleAnalysisChange}>
          <option value="raincloud">Trendline</option>
          <option value="laterality">Laterality Analysis</option>
          <option value="subscore">Subscores</option>
          <option value="all">View All Plots</option>
        </select>
      </div> */}
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
      <div>{renderAnalysis()}</div>
    </div>
  );
}

export default UPDRSAnalysisComponent;

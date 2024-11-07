import React, { useState } from 'react';
import PairedTTestComponent from './PairedTTestComponent';
import BoxPlotComponent from './BoxPlotComponent';
import LateralityAnalysisComponent from './LateralityAnalysisComponent';
// import SubscaleAnalysisComponent from './SubscaleAnalysisComponent';
// import ResponderAnalysisComponent from './ResponderAnalysisComponent';
import CorrelationAnalysisComponent from './CorrelationAnalysisComponent';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';
import SubscoreAnalysis from './SubscoreAnalysis';

function UPDRSAnalysisComponent({ currentStage, rawData }) {
  console.log(rawData);
  const [analysisType, setAnalysisType] = useState('raincloud');
  const [showPercentage, setShowPercentage] = useState(false);

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  const renderAnalysis = () => {
    switch (analysisType) {
      case 'raincloud':
        return <PairedTTestComponent rawData={rawData} showPercentage={showPercentage}
        />;
      // case 'boxPlot':
      //   return (
      //     <BoxPlotComponent
      //       rawData={rawData}
      //     />
      //   );
      case 'laterality':
        return <LateralityAnalysisComponent rawData={rawData} showPercentage={showPercentage} />;
      case 'subscore':
        return <SubscoreAnalysis rawData={rawData} showPercentage={showPercentage} />;
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
          <div style={{ display: 'flex', marginLeft: '-60px', width: '1000px' }}>
            <div style={{ flex: 1, marginLeft: '-30px' }}>
              <PairedTTestComponent
                rawData={rawData}
                showPercentage={showPercentage}
              />
            </div>
            <div style={{ flex: 1, marginLeft: '-50px' }}>
              <LateralityAnalysisComponent
                rawData={rawData}
                showPercentage={showPercentage}
              />
            </div>
            <div style={{ flex: 1, marginLeft: '-60px' }}>
              <SubscoreAnalysis
                rawData={rawData}
                showPercentage={showPercentage}
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
      <div>
        {/* <label>Select Analysis Type: </label> */}
        <select value={analysisType} onChange={handleAnalysisChange}>
          <option value="raincloud">Trendline</option>
          <option value="laterality">Laterality Analysis</option>
          <option value="subscore">Subscores</option>
          {/* <option value="boxPlot">Box Plot</option>
          <option value="laterality">Laterality Analysis</option> */}
          {/* <option value="subscale">Subscale Comparison</option>
          <option value="responder">Responder Analysis</option> */}
          {/* <option value="correlation">Correlation Analysis</option> */}
          <option value="all">View All Plots</option>
        </select>
      </div>
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
      <div>{renderAnalysis()}</div>
    </div>
  );
}

export default UPDRSAnalysisComponent;

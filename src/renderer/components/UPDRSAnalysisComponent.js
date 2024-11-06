import React, { useState } from 'react';
import PairedTTestComponent from './PairedTTestComponent';
import BoxPlotComponent from './BoxPlotComponent';
import LateralityAnalysisComponent from './LateralityAnalysisComponent';
// import SubscaleAnalysisComponent from './SubscaleAnalysisComponent';
// import ResponderAnalysisComponent from './ResponderAnalysisComponent';
import CorrelationAnalysisComponent from './CorrelationAnalysisComponent';
// import './electrode_models/currentModels/ElecModelStyling/boston_vercise_directed.css';

function UPDRSAnalysisComponent({ currentStage, rawData }) {
  console.log(rawData);
  const [analysisType, setAnalysisType] = useState('raincloud');

  const handleAnalysisChange = (e) => {
    setAnalysisType(e.target.value);
  };

  const renderAnalysis = () => {
    switch (analysisType) {
      case 'raincloud':
        return <PairedTTestComponent rawData={rawData} />;
      // case 'boxPlot':
      //   return (
      //     <BoxPlotComponent
      //       rawData={rawData}
      //     />
      //   );
      case 'laterality':
        return <LateralityAnalysisComponent rawData={rawData} />;
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
      // case 'all':
      //   return (
      //     <div className="grid-container">
      //       <div className="grid-item">
      //         <PairedTTestComponent
      //           baselineValues={baselineValues}
      //           postopValues={postopValues}
      //         />
      //       </div>
      //       <div className="grid-item">
      //         <BoxPlotComponent
      //           baselineValues={baselineValues}
      //           postopValues={postopValues}
      //         />
      //       </div>
      //       <div className="grid-item">
      //         <LateralityAnalysisComponent rawData={rawData} />
      //       </div>
      //       <div className="grid-item">
      //         <CorrelationAnalysisComponent
      //           baselineValues={baselineValues}
      //           postopValues={postopValues}
      //         />
      //       </div>
      //     </div>
      //   );

      default:
        return <p>Please select an analysis type.</p>;
    }
  };

  return (
    <div>
      <h2>UPDRS III Analysis</h2>
      <div>
        <label>Select Analysis Type: </label>
        <select value={analysisType} onChange={handleAnalysisChange}>
          <option value="raincloud">Trendline</option>
          <option value="laterality">Laterality Analysis</option>
          {/* <option value="boxPlot">Box Plot</option>
          <option value="laterality">Laterality Analysis</option> */}
          {/* <option value="subscale">Subscale Comparison</option>
          <option value="responder">Responder Analysis</option> */}
          {/* <option value="correlation">Correlation Analysis</option> */}
          {/* <option value="all">View All Plots</option> */}
        </select>
      </div>
      <div>{renderAnalysis()}</div>
    </div>
  );
}

export default UPDRSAnalysisComponent;

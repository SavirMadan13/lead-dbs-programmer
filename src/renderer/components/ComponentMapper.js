/* eslint-disable no-constructor-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import ElectrodeIPGSelection, { getSelectedElectrode, getSelectedIPG } from './ElectrodeIPGSelection';
import BostonCartesia from './BostonCartesia'; // Import the component for Boston Scientific Cartesia
import ElectrodeModel from './ElectrodeModel';

// const ComponentMapper = ({ selectedElectrode, selectedIPG }) => {
//   // Define a mapping of selectedElectrode values to component imports
//   const componentMap = {
//     'Boston Scientific Cartesia': BostonCartesia, // Import BostonCartesia.js component
//     // Add more mappings for other electrodes if needed
//   };

//   // Determine the component to render based on selectedElectrode
//   const SelectedComponent = componentMap[selectedElectrode];

//   if (!SelectedComponent) {
//     // Handle the case where there's no component mapping for the selectedElectrode
//     return (
//       <div>
//         <p>No component found for selectedElectrode: {selectedElectrode}</p>
//       </div>
//     );
//   }

//   // Render the selected component
//   return (
//     <div>
//       <h2>Selected Component</h2>
//       <SelectedComponent selectedIPG={selectedIPG} />
//     </div>
//   );
// };

// export default ComponentMapper;

function ComponentMapper() {
  const electrodeMap = {
    'Boston Scientific Cartesia': BostonCartesia,
    'Boston Scientific Cartesiax': BostonCartesiax,
  };
  const ipgMap = {
    'Boston Scientific Cartesia': BostonCartesia,
  };
  const selectedElectrode = getSelectedElectrode();
  const selectedIPG = getselectedIPG();

  const selectedElectrodeComponent = electrodeMap[selectedElectrode];
  const selectedIPGComponent = ipgMap[selectedIPG];

  return (
    <div>
      <selectedElectrodeComponent />
      <ImageRenderer images={this.state.images} />
    </div>
  );
}

export default ComponentMapper;

class BostonCartesiax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        { key: 'image1', src: 'image1.jpg' },
        { key: 'image2', src: 'image2.jpg' },
        { key: 'image3', src: 'image3.jpg' },
        // Add more images with keys and src values here
      ],
    };

    return null;
  }
}

function ImageRenderer({ images }) {
  return (
    <div className="image-list">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image.src} alt={image.key} className="image" />
          <p className="image-key">{image.key}</p>
        </div>
      ))}
    </div>
  );
}


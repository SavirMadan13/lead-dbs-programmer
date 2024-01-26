/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import TripleToggle from './TripleToggle';
import QuantityInput from './QuantityInput';
import './ImageDisplay.css'; // Import the CSS for your image display component
import ElectrodeContactImage from './electrode_models/images/ElectrodeContact.png';
import svg1 from './electrode_models/images/SVGStyle.svg';

class ImageDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 'left', // Set an initial value for the TripleToggle
      quantity: 0, // Set an initial quantity
    };
  }

  handleTripleToggleChange = (value) => {
    this.setState({ selectedValue: value });
  };

  handleQuantityInputChange = (quantity) => {
    // this.setState({ quantity });
    const selectedValue = quantity > 0 ? 'center' : 'left';
    this.setState({ quantity, selectedValue });
    console.log(quantity);
  };

  render() {
    const { selectedValue, quantity } = this.state;

    // Determine the image source based on selectedValue (replace with your logic)
    const imageUrl = <img src={svg1} alt="svg1" height="200" width="200" />;

    // Determine the CSS class based on selectedValue
    const imageClassName = `image-container ${selectedValue}-color`;

    return (
      <div className="image-display">
        <TripleToggle onChange={this.handleTripleToggleChange} />
        <QuantityInput onChange={this.handleQuantityInputChange} />

        <div className={imageClassName} style={{ backgroundImage: imageUrl }} />
      </div>
    );
  }
}

export default ImageDisplay;

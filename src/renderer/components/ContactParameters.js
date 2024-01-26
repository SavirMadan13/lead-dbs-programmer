/* eslint-disable prettier/prettier */
/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import './ContactParameters.css';

class ContactParameters extends Component {
  constructor(props) {
    super(props);

    // Initialize the component's state with default values
    this.state = {
      isPositive: props.imageState?.isPositive || true,
      isOn: props.imageState?.isOn || false,
      inputValue: props.imageState?.inputValue || '',
    };
  }

  // Function to handle the toggle of the +/- switch
  togglePolarity = () => {
    this.setState((prevState) => ({
      isPositive: !prevState.isPositive,
    }));
  };

  // Function to handle the toggle of the ON/OFF switch
  toggleSwitch = () => {
    this.setState((prevState) => ({
      isOn: !prevState.isOn,
    }));
  };

  // Function to handle changes in the text box input
  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  // Function to increment the input value
  incrementValue = () => {
    this.setState((prevState) => ({
      inputValue: Number(prevState.inputValue) + 1,
    }));
  };

  // Function to decrement the input value
  decrementValue = () => {
    this.setState((prevState) => ({
      inputValue: Number(prevState.inputValue) - 1,
    }));
  };

  // Function to update the parent component with the current state
  // saveChanges = () => {
  //   this.props.onSave(this.state);
  // };

  render() {
    return (
      <div className="form-container">
        {/* Display the current state of the +/- switch */}
        <p>Current Polarity: {this.state.isPositive ? '+' : '-'}</p>

        {/* Render the +/- switch */}
        <button onClick={this.togglePolarity}>Switch polarity</button>

        {/* Display the current state of the ON/OFF switch */}
        {/* <p>{this.state.isOn ? 'ON' : 'OFF'}</p> */}

        {/* Render the ON/OFF switch */}
        <button className="ON-OFF" onClick={this.toggleSwitch}>
          {this.state.isOn ? 'Turn OFF' : 'Turn ON'}
        </button>

        {/* Render the input field with buttons */}
        <div>
          <button onClick={this.decrementValue}>-</button>
          <input
            type="number"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
          <button onClick={this.incrementValue}>+</button>
        </div>

        {/* Render a button to save changes */}
        <button className="save-button">Save</button>
      </div>
    );
  }
}

export default ContactParameters;


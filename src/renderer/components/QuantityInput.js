/* eslint-disable react/prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './QuantityInput.css';

class QuantityInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
  }

  // change_quantity(change) {
  //   let quantity = this.state.quantity + change;
  //   quantity = Math.max(quantity, 1);
  //   this.setState({ quantity });
  // }

  render() {
    // const { decreaseText = 'Decrease', increaseText = 'Increase' } = this.props;

    return (
      <div className="quantity-container">
        {/* <button
          type="button"
          className="quantity-button sub"
          onClick={() => this.change_quantity(-1)}
        >
          {decreaseText}
        </button> */}
        <input
          className="quantity-input"
          type="number"
          name="quantity"
          pattern="[0-9]+"
          value={this.state.quantity}
          onChange={(e) => this.setState({ quantity: e.target.value })}
        />
        {/* <button
          type="button"
          className="quantity-button add"
          onClick={() => this.change_quantity(1)}
        >
          {increaseText}
        </button> */}
      </div>
    );
  }
}

export default QuantityInput;

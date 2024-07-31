/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */

import React from 'react';
import PropTypes from 'prop-types';
import './TripleToggle.css';

const valueType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
]);

const propTypes = {
  labels: PropTypes.shape({
    left: {
      title: PropTypes.string.isRequired,
      value: valueType,
    },
    center: {
      title: PropTypes.string.isRequired,
      value: valueType,
    },
    right: {
      title: PropTypes.string.isRequired,
      value: valueType,
    },
  }),
  onChange: PropTypes.func.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
};

const defaultProps = {
  labels: {
    left: {
      title: 'OFF',
      value: 'left',
    },
    center: {
      title: '-',
      value: 'center',
    },
    right: {
      title: '+',
      value: 'right',
    },
  },
  onChange: (value) => console.log('value:', value),
};

class TripleToggleTest extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   switchPosition: 'left',
    //   animation: null,
    //   quantity: props.quantity,
    // };
  }

  getSwitchAnimation = (value) => {
    const { switchPosition } = this.props;
    // console.log(">state=" + this.state.quantity);
    let animation = null;
    if (value === 'center' && switchPosition === 'left') {
      animation = 'left-to-center';
    } else if (value === 'right' && switchPosition === 'center') {
      animation = 'center-to-right';
    } else if (value === 'center' && switchPosition === 'right') {
      animation = 'right-to-center';
    } else if (value === 'left' && switchPosition === 'center') {
      animation = 'center-to-left';
    } else if (value === 'right' && switchPosition === 'left') {
      animation = 'left-to-right';
    } else if (value === 'left' && switchPosition === 'right') {
      animation = 'right-to-left';
    }
    this.props.onChange(value, animation);
    // this.setState({ switchPosition: value, animation });
    this.handleValueChange(value);
  };

  handleValueChange = (value) => {
    const { quantity } = this.props;
    if (value === 'left' && quantity !== 0) {
      // this.setState({ quantity: 0 }, () => {
      //   this.props.onQuantityChange(
      //     value,
      //     this.props.animation,
      //     this.props.quantity,
      //   );
      // });
      this.props.onQuantityChange(
        this.props.switchPosition,
        this.props.animation,
        0,
      );
    }
  };

  handleQuantityChange = (quantity) => {
    const { switchPosition, animation } = this.props;
    if (quantity !== 0 && switchPosition === 'left') {
      this.getSwitchAnimation('center');
    }
    this.setState({ quantity, animation }, () => {
      this.props.onQuantityChange(switchPosition, animation, quantity);
    });
    this.props.onQuantityChange(
      this.props.switchPosition,
      this.props.animation,
      quantity,
    );
  };

  render() {
    const { labels } = this.props;
    // const quantity = this.props.quantity;
    // console.log("r-q=" + quantity );

    return (
      <div className="container">
        <div className="main-container">
          <div
            className={`switch ${this.props.animation} ${this.props.switchPosition}-position`}
          />
          <label
            className={`left-label ${
              this.props.switchPosition === 'left' && 'black-font'
            }`}
            // htmlFor="left"
          >
            <input
              defaultChecked
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.props.quantity}`} // Unique name for each radio group
              id="left"
              type="radio"
              value="left"
            />
            <h4 style = {{fontSize: '16px'}}>{labels.left.title}</h4>
          </label>

          <label
            className={`center-label ${
              this.props.switchPosition === 'center' && 'black-font'
            }`}
            // htmlFor="center"
          >
            <input
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.props.quantity}`} // Unique name for each radio group
              id="center"
              type="radio"
              value="center"
            />
            <h4 style = {{fontSize: '16px'}}>{labels.center.title}</h4>
          </label>

          <label
            className={`right-label ${
              this.props.switchPosition === 'right' && 'black-font'
            }`}
            // htmlFor="right"
          >
            <input
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.props.quantity}`} // Unique name for each radio group
              id="right"
              type="radio"
              value="right"
            />
            <h4 style = {{fontSize: '16px'}}>{labels.right.title}</h4>
          </label>
        </div>
        <div className="quantity-container">
          <input
            className="quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            min="0"
            // max="100"
            // value={quantity}
            // value={this.state.quantity}
            value={this.props.quantity}
            // value={parseInt(this.props.quantity, 10)} // Update value prop
            onChange={(e) => this.handleQuantityChange(e.target.value)}
          />
          {/* {console.log(this.state.quantity)} */}
        </div>
      </div>
    );
  }
}

TripleToggleTest.propTypes = propTypes;
TripleToggleTest.defaultProps = defaultProps;

export default TripleToggleTest;

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/destructuring-assignment */
// import React from 'react';
// import PropTypes from 'prop-types';
// import './TripleToggle.css';

// const valueType = PropTypes.oneOfType([
//   PropTypes.string,
//   PropTypes.number,
//   PropTypes.bool,
// ]);

// const propTypes = {
//   labels: PropTypes.shape({
//     left: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     center: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     right: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//   }),
//   onChange: PropTypes.func.isRequired,
//   styles: PropTypes.object,
// };

// const defaultProps = {
//   labels: {
//     left: {
//       title: 'OFF',
//       value: 'left',
//     },
//     center: {
//       title: '+',
//       value: 'center',
//     },
//     right: {
//       title: '-',
//       value: 'right',
//     },
//   },
//   onChange: (value) => console.log('value:', value),
// };

// class TripleToggle extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       switchPosition: 'left',
//       animation: null,
//       quantity: 0,
//     };
//   }

//   getSwitchAnimation = (value) => {
//     const { switchPosition } = this.state;
//     let animation = null;
//     if (value === 'center' && switchPosition === 'left') {
//       animation = 'left-to-center';
//     } else if (value === 'right' && switchPosition === 'center') {
//       animation = 'center-to-right';
//     } else if (value === 'center' && switchPosition === 'right') {
//       animation = 'right-to-center';
//     } else if (value === 'left' && switchPosition === 'center') {
//       animation = 'center-to-left';
//     } else if (value === 'right' && switchPosition === 'left') {
//       animation = 'left-to-right';
//     } else if (value === 'left' && switchPosition === 'right') {
//       animation = 'right-to-left';
//     }
//     this.props.onChange(value);
//     this.setState({ switchPosition: value, animation });
//   };

//   handleQuantityChange = (quantity) => {
//     // if (quantity === 0) {
//     //   this.getSwitchAnimation('left');
//     // } else {
//     //   // Check the current switch position to avoid changing it from "-"
//     //   if (this.state.switchPosition !== 'right') {
//     //     this.getSwitchAnimation('center');
//     //   }
//     // }

//     if (quantity !== 0 && this.state.switchPosition === 'left') {
//       this.getSwitchAnimation('center');
//     } else if (quantity === 0 && this.state.switchPosition !== 'left') {
//       this.getSwitchAnimation('left');
//     }
//     this.setState({ quantity });
//   };

//   render() {
//     const { labels } = this.props;

//     return (
//       <div>
//         <div className="main-container">
//           <div
//             className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
//           />
//           <input
//             defaultChecked
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="left"
//             type="radio"
//             value="left"
//           />
//           <label
//             className={`left-label ${
//               this.state.switchPosition === 'left' && 'black-font'
//             }`}
//             htmlFor="left"
//           >
//             <h4>{labels.left.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="center"
//             type="radio"
//             value="center"
//           />
//           <label
//             className={`center-label ${
//               this.state.switchPosition === 'center' && 'black-font'
//             }`}
//             htmlFor="center"
//           >
//             <h4>{labels.center.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="right"
//             type="radio"
//             value="right"
//           />
//           <label
//             className={`right-label ${
//               this.state.switchPosition === 'right' && 'black-font'
//             }`}
//             htmlFor="right"
//           >
//             <h4>{labels.right.title}</h4>
//           </label>
//         </div>
//         <div className="quantity-container">
//           <input
//             className="quantity-input"
//             type="number"
//             name="quantity"
//             pattern="[0-9]+"
//             value={this.state.quantity}
//             onChange={(e) => this.handleQuantityChange(e.target.value)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// TripleToggle.propTypes = propTypes;
// TripleToggle.defaultProps = defaultProps;

// export default TripleToggle;

// import React from 'react';
// import PropTypes from 'prop-types';
// import './TripleToggle.css';

// const valueType = PropTypes.oneOfType([
//   PropTypes.string,
//   PropTypes.number,
//   PropTypes.bool,
// ]);

// const propTypes = {
//   labels: PropTypes.shape({
//     left: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     center: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     right: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//   }),
//   onChange: PropTypes.func.isRequired,
//   styles: PropTypes.object,
// };

// const defaultProps = {
//   labels: {
//     left: {
//       title: 'OFF',
//       value: 'left',
//     },
//     center: {
//       title: '+',
//       value: 'center',
//     },
//     right: {
//       title: '-',
//       value: 'right',
//     },
//   },
//   onChange: (value) => console.log('value:', value),
// };

// class TripleToggle extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       switchPosition: 'left',
//       animation: null,
//       quantity: 0,
//     };
//   }

//   getSwitchAnimation = (value) => {
//     const { switchPosition } = this.state;
//     let animation = null;
//     if (value === 'center' && switchPosition === 'left') {
//       animation = 'left-to-center';
//     } else if (value === 'right' && switchPosition === 'center') {
//       animation = 'center-to-right';
//     } else if (value === 'center' && switchPosition === 'right') {
//       animation = 'right-to-center';
//     } else if (value === 'left' && switchPosition === 'center') {
//       animation = 'center-to-left';
//     } else if (value === 'right' && switchPosition === 'left') {
//       animation = 'left-to-right';
//     } else if (value === 'left' && switchPosition === 'right') {
//       animation = 'right-to-left';
//     }
//     this.props.onChange(value);
//     this.setState({ switchPosition: value, animation });
//   };

//   handleQuantityChange = (quantity) => {
//     if (quantity !== 0 && this.state.switchPosition === 'left') {
//       this.getSwitchAnimation('center');
//     } else if (quantity === 0 && this.state.switchPosition !== 'left') {
//       this.getSwitchAnimation('left');
//     }
//     this.setState({ quantity });
//   };

//   render() {
//     const { labels } = this.props;

//     return (
//       <div>
//         <div className="main-container">
//           <div
//             className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
//           />
//           <input
//             defaultChecked
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
//             id="left"
//             type="radio"
//             value="left"
//           />
//           <label
//             className={`left-label ${
//               this.state.switchPosition === 'left' && 'black-font'
//             }`}
//             htmlFor="left"
//           >
//             <h4>{labels.left.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
//             id="center"
//             type="radio"
//             value="center"
//           />
//           <label
//             className={`center-label ${
//               this.state.switchPosition === 'center' && 'black-font'
//             }`}
//             htmlFor="center"
//           >
//             <h4>{labels.center.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
//             id="right"
//             type="radio"
//             value="right"
//           />
//           <label
//             className={`right-label ${
//               this.state.switchPosition === 'right' && 'black-font'
//             }`}
//             htmlFor="right"
//           >
//             <h4>{labels.right.title}</h4>
//           </label>
//         </div>
//         <div className="quantity-container">
//           <input
//             className="quantity-input"
//             type="number"
//             name="quantity"
//             pattern="[0-9]+"
//             value={this.state.quantity}
//             onChange={(e) => this.handleQuantityChange(e.target.value)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// TripleToggle.propTypes = propTypes;
// TripleToggle.defaultProps = defaultProps;

// export default TripleToggle;

/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/destructuring-assignment */
// import React from 'react';
// import PropTypes from 'prop-types';
// import './TripleToggle.css';

// const valueType = PropTypes.oneOfType([
//   PropTypes.string,
//   PropTypes.number,
//   PropTypes.bool,
// ]);

// const propTypes = {
//   labels: PropTypes.shape({
//     left: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     center: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     right: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//   }),
//   onChange: PropTypes.func.isRequired,
//   styles: PropTypes.object,
// };

// const defaultProps = {
//   labels: {
//     left: {
//       title: 'OFF',
//       value: 'left',
//     },
//     center: {
//       title: '+',
//       value: 'center',
//     },
//     right: {
//       title: '-',
//       value: 'right',
//     },
//   },
//   onChange: (value) => console.log('value:', value),
// };

// class TripleToggle extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       switchPosition: 'left',
//       animation: null,
//       quantity: 0,
//     };
//   }

//   getSwitchAnimation = (value) => {
//     const { switchPosition } = this.state;
//     let animation = null;
//     if (value === 'center' && switchPosition === 'left') {
//       animation = 'left-to-center';
//     } else if (value === 'right' && switchPosition === 'center') {
//       animation = 'center-to-right';
//     } else if (value === 'center' && switchPosition === 'right') {
//       animation = 'right-to-center';
//     } else if (value === 'left' && switchPosition === 'center') {
//       animation = 'center-to-left';
//     } else if (value === 'right' && switchPosition === 'left') {
//       animation = 'left-to-right';
//     } else if (value === 'left' && switchPosition === 'right') {
//       animation = 'right-to-left';
//     }
//     this.props.onChange(value);
//     this.setState({ switchPosition: value, animation });
//   };

//   handleQuantityChange = (quantity) => {
//     // if (quantity === 0) {
//     //   this.getSwitchAnimation('left');
//     // } else {
//     //   // Check the current switch position to avoid changing it from "-"
//     //   if (this.state.switchPosition !== 'right') {
//     //     this.getSwitchAnimation('center');
//     //   }
//     // }

//     if (quantity !== 0 && this.state.switchPosition === 'left') {
//       this.getSwitchAnimation('center');
//     } else if (quantity === 0 && this.state.switchPosition !== 'left') {
//       this.getSwitchAnimation('left');
//     }
//     this.setState({ quantity });
//   };

//   render() {
//     const { labels } = this.props;

//     return (
//       <div>
//         <div className="main-container">
//           <div
//             className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
//           />
//           <input
//             defaultChecked
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="left"
//             type="radio"
//             value="left"
//           />
//           <label
//             className={`left-label ${
//               this.state.switchPosition === 'left' && 'black-font'
//             }`}
//             htmlFor="left"
//           >
//             <h4>{labels.left.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="center"
//             type="radio"
//             value="center"
//           />
//           <label
//             className={`center-label ${
//               this.state.switchPosition === 'center' && 'black-font'
//             }`}
//             htmlFor="center"
//           >
//             <h4>{labels.center.title}</h4>
//           </label>

//           <input
//             onChange={(e) => this.getSwitchAnimation(e.target.value)}
//             name="map-switch"
//             id="right"
//             type="radio"
//             value="right"
//           />
//           <label
//             className={`right-label ${
//               this.state.switchPosition === 'right' && 'black-font'
//             }`}
//             htmlFor="right"
//           >
//             <h4>{labels.right.title}</h4>
//           </label>
//         </div>
//         <div className="quantity-container">
//           <input
//             className="quantity-input"
//             type="number"
//             name="quantity"
//             pattern="[0-9]+"
//             value={this.state.quantity}
//             onChange={(e) => this.handleQuantityChange(e.target.value)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// TripleToggle.propTypes = propTypes;
// TripleToggle.defaultProps = defaultProps;

// export default TripleToggle;

//////////////////////////// Works ////////////////////////

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

class TripleToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPosition: 'left',
      animation: null,
      quantity: 0,
    };
  }

  getSwitchAnimation = (value) => {
    const { switchPosition } = this.state;
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
    this.props.onChange(value);
    this.setState({ switchPosition: value, animation });
    this.handleValueChange(value);
  };

  handleValueChange = (value) => {
    const { quantity } = this.state;
    if (value === 'left' && quantity !== 0) {
      this.setState({ quantity: 0 }, () => {
        this.props.onQuantityChange(
          value,
          this.state.animation,
          this.state.quantity,
        );
      });
    } else if (value !== 'left' && quantity === 0) {
      this.setState({ quantity: 100 }, () => {
        this.props.onQuantityChange(
          value,
          this.state.animation,
          this.state.quantity,
        );
      });
    }
    this.props.onQuantityChange(
      this.state.switchPosition,
      this.state.animation,
      this.state.quantity,
    );
  };

  handleQuantityChange = (quantity) => {
    const { switchPosition, animation } = this.state;
    if (quantity !== 0 && switchPosition === 'left') {
      this.getSwitchAnimation('center');
    }
    this.setState({ quantity, animation }, () => {
      this.props.onQuantityChange(switchPosition, animation, quantity);
    });
    this.props.onQuantityChange(
      this.state.switchPosition,
      this.state.animation,
      quantity,
    );
  };

  render() {
    const { labels } = this.props;

    return (
      <div className="container">
        <div className="main-container">
          <div
            className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
          />
          <label
            className={`left-label ${
              this.state.switchPosition === 'left' && 'black-font'
            }`}
            // htmlFor="left"
          >
            <input
              defaultChecked
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
              id="left"
              type="radio"
              value="left"
            />
            <h4>{labels.left.title}</h4>
          </label>

          <label
            className={`center-label ${
              this.state.switchPosition === 'center' && 'black-font'
            }`}
            // htmlFor="center"
          >
            <input
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
              id="center"
              type="radio"
              value="center"
            />
            <h4>{labels.center.title}</h4>
          </label>

          <label
            className={`right-label ${
              this.state.switchPosition === 'right' && 'black-font'
            }`}
            // htmlFor="right"
          >
            <input
              onChange={(e) => this.getSwitchAnimation(e.target.value)}
              name={`map-switch-${this.state.quantity}`} // Unique name for each radio group
              id="right"
              type="radio"
              value="right"
            />
            <h4>{labels.right.title}</h4>
          </label>
        </div>
        <div className="quantity-container">
          <input
            className="quantity-input"
            type="number"
            name="quantity"
            pattern="[0-9]+"
            value={this.state.quantity}
            // value={parseInt(this.props.quantity, 10)} // Update value prop
            // value={this.props.quantity}
            onChange={(e) => this.handleQuantityChange(e.target.value)}
          />
          {/* {console.log(this.state.quantity)} */}
        </div>
      </div>
    );
  }
}

TripleToggle.propTypes = propTypes;
TripleToggle.defaultProps = defaultProps;

export default TripleToggle;

////////////////////////////// Above This Works ////////////////////////////////////////////

// handleValueChange = (value, quantity) => {
//   if (value === 'left' && quantity !== 0) {
//     quantity = 0;
//   } else if (value !== 'left' && quantity === 0) {
//     this.getSwitchAnimation('left');
//   }
//   this.setState({ quantity });
// };

// handleValueChange = (value, quantity) => {
//   if (value === 'left' && quantity !== 0) {
//     quantity = 0;
//   } else if (value !== 'left' && quantity === 0) {
//     quantity = 100; // Set to 100 when moving from 'left' to 'center' or 'right'
//   }
//   this.setState({ quantity }, () => {
//     this.props.onQuantityChange(
//       value,
//       this.state.animation,
//       this.state.quantity,
//     );
//   });
// };

// handleQuantityChange = (value, animation, quantity) => {
//   if (quantity !== 0 && this.state.switchPosition === 'left') {
//     value = 'center';
//     animation = 'left-to-center';
//     this.setState({ switchPosition: value, animation });
//     this.getSwitchAnimation('center');
//   } else if (quantity === 0 && this.state.switchPosition !== 'left') {
//     this.getSwitchAnimation('left');
//   }
//   this.setState({ swichPosition: value, animation });
//   this.setState({ quantity });
//   // this.props.onQuantityChange(value, animation, quantity);
// };

////////////////////////// Practice trial below

// import React from 'react';
// import PropTypes from 'prop-types';
// import './TripleToggle.css';

// const valueType = PropTypes.oneOfType([
//   PropTypes.string,
//   PropTypes.number,
//   PropTypes.bool,
// ]);

// const propTypes = {
//   labels: PropTypes.shape({
//     left: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     center: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//     right: {
//       title: PropTypes.string.isRequired,
//       value: valueType,
//     },
//   }),
//   onChange: PropTypes.func.isRequired,
//   onQuantityChange: PropTypes.func.isRequired,
//   styles: PropTypes.object,
// };

// const defaultProps = {
//   labels: {
//     left: {
//       title: 'OFF',
//       value: 'left',
//     },
//     center: {
//       title: '-',
//       value: 'center',
//     },
//     right: {
//       title: '+',
//       value: 'right',
//     },
//   },
//   // onChange: (value) => console.log('value:', value),
// };

// class TripleToggle extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       switchPosition: 'left',
//       animation: null,
//       // quantity: props.quantity,
//       quantity: 0,
//     };
//   }

//   // New additions to switch animation, has some of the logic and effectively is meant to replace handleValueChange
//   getSwitchAnimation = (value) => {
//     const { switchPosition, quantity } = this.state;
//     let animation = null;
//     let updatedQuantity = quantity;

//     if (value === 'left' && switchPosition !== 'left') {
//       updatedQuantity = 0;
//     }

//     if (value === 'center' && switchPosition === 'left') {
//       animation = 'left-to-center';
//     } else if (value === 'right' && switchPosition === 'center') {
//       animation = 'center-to-right';
//     } else if (value === 'center' && switchPosition === 'right') {
//       animation = 'right-to-center';
//     } else if (value === 'left' && switchPosition === 'center') {
//       animation = 'center-to-left';
//     } else if (value === 'right' && switchPosition === 'left') {
//       animation = 'left-to-right';
//     } else if (value === 'left' && switchPosition === 'right') {
//       animation = 'right-to-left';
//     }

//     this.props.onChange(value);
//     this.setState({
//       switchPosition: value,
//       animation,
//       // quantity: updatedQuantity, // quantity part is new
//     });
//     // Used to be handleValueChange - I guess replacing and changing it to quantityChange basis, maybe that's the problem?
//     // this.props.onQuantityChange(
//     //   this.state.switchPosition,
//     //   animation,
//     //   updatedQuantity,
//     // );
//     this.props.handleValueChange(value);
//   };

//   // handleQuantityChange = (quantity) => {
//   //   const { switchPosition, animation } = this.state;
//   //   this.setState({ quantity }, () => {
//   //     this.props.onQuantityChange(switchPosition, animation, quantity);
//   //     if (quantity !== 0 && switchPosition === 'left') {
//   //       this.getSwitchAnimation('center');
//   //     }
//   //   });
//   // };

//   handleValueChange = (value) => {
//     const { quantity } = this.state;
//     if (value === 'left' && quantity !== 0) {
//       this.setState({ quantity: 0 }, () => {
//         this.props.onQuantityChange(
//           value,
//           this.state.animation,
//           this.state.quantity,
//         );
//       });
//     } else if (value !== 'left' && quantity === 0) {
//       this.setState({ quantity: 100 }, () => {
//         this.props.onQuantityChange(
//           value,
//           this.state.animation,
//           this.state.quantity,
//         );
//       });
//     }
//     this.props.onQuantityChange(
//       this.state.switchPosition,
//       this.state.animation,
//       this.state.quantity,
//     );
//   };

//   handleQuantityChange = (quantity) => {
//     const { switchPosition, animation } = this.state;
//     if (quantity !== 0 && switchPosition === 'left') {
//       this.getSwitchAnimation('center');
//     }
//     this.setState({ quantity, animation }, () => {
//       this.props.onQuantityChange(switchPosition, animation, quantity);
//     });
//     this.props.onQuantityChange(
//       this.state.switchPosition,
//       this.state.animation,
//       quantity,
//     );
//   };

//   // handleQuantityChange = (e) => {
//   //   const quantity = parseInt(e.target.value, 10);
//   //   const { switchPosition, animation } = this.state;
//   //   if (quantity !== 0 && switchPosition === 'left') {
//   //     this.getSwitchAnimation('center');
//   //   }
//   //   this.setState({ quantity }, () => {
//   //     this.props.onQuantityChange(
//   //       this.state.switchPosition,
//   //       this.state.animation,
//   //       quantity,
//   //     );
//   //   });
//   // };

//   render() {
//     const { labels } = this.props;
//     // console.log(quantity);
//     return (
//       <div className="container">
//         <div className="main-container">
//           <div
//             className={`switch ${this.state.animation} ${this.state.switchPosition}-position`}
//           />
//           <label
//             className={`left-label ${
//               this.state.switchPosition === 'left' && 'black-font'
//             }`}
//           >
//             <input
//               defaultChecked
//               onChange={() => this.getSwitchAnimation('left')}
//               name="map-switch"
//               id="left"
//               type="radio"
//               value="left"
//             />
//             <h4>{labels.left.title}</h4>
//           </label>

//           <label
//             className={`center-label ${
//               this.state.switchPosition === 'center' && 'black-font'
//             }`}
//           >
//             <input
//               onChange={() => this.getSwitchAnimation('center')}
//               name="map-switch"
//               id="center"
//               type="radio"
//               value="center"
//             />
//             <h4>{labels.center.title}</h4>
//           </label>

//           <label
//             className={`right-label ${
//               this.state.switchPosition === 'right' && 'black-font'
//             }`}
//           >
//             <input
//               onChange={() => this.getSwitchAnimation('right')}
//               name="map-switch"
//               id="right"
//               type="radio"
//               value="right"
//             />
//             <h4>{labels.right.title}</h4>
//           </label>
//         </div>
//         <div className="quantity-container">
//           {/* <input
//             className="quantity-input"
//             type="number"
//             name="quantity"
//             min="0"
//             step="1"
//             value={this.state.quantity}
//             onChange={(e) => this.handleQuantityChange(e.target.value)}
//           /> */}
//           <input
//             className="quantity-input"
//             type="number"
//             name="quantity"
//             min="0"
//             // step="1"
//             value={this.state.quantity}
//             // onChange={this.handleQuantityChange}
//             onChange={(e) => this.handleQuantityChange(e.target.value)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// TripleToggle.propTypes = propTypes;
// TripleToggle.defaultProps = defaultProps;

// export default TripleToggle;

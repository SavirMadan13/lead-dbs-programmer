import React from 'react';
import PropTypes from 'prop-types';
import './PercentageAmplitudeToggle.css';

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
    right: {
      title: PropTypes.string.isRequired,
      value: valueType,
    },
  }),
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.object,
};

const defaultProps = {
  labels: {
    left: {
      title: '%',
      value: 'left',
    },
    right: {
      title: 'mA',
      value: 'right',
    },
  },
  onChange: (value) => console.log('value:', value),
};

class PercentageAmplitudeToggle extends React.Component {
  constructor(props) {
    super(props);
    // let switchPosition = this.props.switchPosition;
    this.state = {
      switchPosition: 'left',
      animation: null,
    };
  }

  getSwitchAnimation = (value) => {
    const { switchPosition } = this.state;
    let animation = null;
    if (value === 'right' && switchPosition === 'left') {
      animation = 'leftRight';
    } else if (value === 'left' && switchPosition === 'right') {
      animation = 'rightLeft';
    }
    this.props.onChange(value);
    this.setState({ switchPosition: value, animation });
  };

  render() {
    const { labels } = this.props;

    return (
      <div className="perc-main-container">
        <div
          className={`perc-switch ${this.state.animation} ${this.state.switchPosition}-perc-position`}
        />
        <input
          defaultChecked
          onChange={(e) => this.getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="left"
          type="radio"
          value="left"
        />
        <label
          className={`perc-left-label ${
            this.state.switchPosition === 'left' && 'black-font'
          }`}
          htmlFor="left"
        >
          <h4 className="perc-h4">{labels.left.title}</h4>
        </label>

        <input
          onChange={(e) => this.getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="right"
          type="radio"
          value="right"
        />
        <label
          className={`perc-right-label ${
            this.state.switchPosition === 'right' && 'black-font'
          }`}
          htmlFor="right"
        >
          <h4 className="perc-h4">{labels.right.title}</h4>
        </label>
      </div>
    );
  }
}

PercentageAmplitudeToggle.propTypes = propTypes;
PercentageAmplitudeToggle.defaultProps = defaultProps;

export default PercentageAmplitudeToggle;

// Works above this

// import React from 'react';
// import PropTypes from 'prop-types';
// import './PercentageAmplitudeToggle.css';

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
//       title: '%',
//       value: 'left',
//     },
//     right: {
//       title: 'mA',
//       value: 'right',
//     },
//   },
//   onChange: (value) => console.log('value:', value),
// };

// class PercentageAmplitudeToggle extends React.Component {
//   constructor(props) {
//     super(props);
//     // let switchPosition = this.props.switchPosition;
//     // this.state = {
//     //   // switchPosition: 'left',
//     //   animation: null,
//     // };
//   }

//   getSwitchAnimation = (value) => {
//     const { switchPosition } = this.props;
//     let { animation } = this.props;
//     if (value === 'right' && switchPosition === 'left') {
//       animation = 'leftRight';
//     } else if (value === 'left' && switchPosition === 'right') {
//       animation = 'rightLeft';
//     }
//     this.props.onChange(value, animation);
//     // this.setState({ switchPosition: value, animation });
//   };

//   render() {
//     const { labels } = this.props;

//     return (
//       <div className="perc-main-container">
//         <div
//           className={`perc-switch ${this.props.animation} ${this.props.switchPosition}-perc-position`}
//         />
//         <input
//           defaultChecked
//           onChange={(e) => this.getSwitchAnimation(e.target.value)}
//           name="map-switch"
//           id="left"
//           type="radio"
//           value="left"
//         />
//         <label
//           className={`perc-left-label ${
//             this.props.switchPosition === 'left' && 'black-font'
//           }`}
//           htmlFor="left"
//         >
//           <h4 className="perc-h4">{labels.left.title}</h4>
//         </label>

//         <input
//           onChange={(e) => this.getSwitchAnimation(e.target.value)}
//           name="map-switch"
//           id="right"
//           type="radio"
//           value="right"
//         />
//         <label
//           className={`perc-right-label ${
//             this.props.switchPosition === 'right' && 'black-font'
//           }`}
//           htmlFor="right"
//         >
//           <h4 className="perc-h4">{labels.right.title}</h4>
//         </label>
//       </div>
//     );
//   }
// }

// PercentageAmplitudeToggle.propTypes = propTypes;
// PercentageAmplitudeToggle.defaultProps = defaultProps;

// export default PercentageAmplitudeToggle;

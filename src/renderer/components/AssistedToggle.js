import React from 'react';
import PropTypes from 'prop-types';
// import './PercentageAmplitudeToggle.css';
import './AssistedToggle.css';

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
      title: 'None',
      value: 'left',
    },
    right: {
      title: 'Assisted',
      value: 'right',
    },
  },
  onChange: (value) => console.log('value:', value),
};

class AssistedToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchPosition: 'left',
      animation: null,
    };
  }

  getSwitchAnimation = (value) => {
    const { switchPosition } = this.state;
    let animation = null;
    if (value === 'right' && switchPosition === 'left') {
      animation = 'leftRightAssist';
    } else if (value === 'left' && switchPosition === 'right') {
      animation = 'rightLeftAssist';
    }
    this.props.onChange(value);
    this.setState({ switchPosition: value, animation });
  };

  render() {
    const { labels } = this.props;

    return (
      <div className="assist-main-container">
        <div
          className={`assist-switch ${this.state.animation} ${this.state.switchPosition}-assist-position`}
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
          className={`assist-left-label ${
            this.state.switchPosition === 'left' && 'black-font'
          }`}
          htmlFor="left"
        >
          <h4 className="assist-h4">{labels.left.title}</h4>
        </label>

        <input
          onChange={(e) => this.getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="right"
          type="radio"
          value="right"
        />
        <label
          className={`assist-right-label ${
            this.state.switchPosition === 'right' && 'black-font'
          }`}
          htmlFor="right"
        >
          <h4 className="assist-h4">{labels.right.title}</h4>
        </label>
      </div>
    );
  }
}

AssistedToggle.propTypes = propTypes;
AssistedToggle.defaultProps = defaultProps;

export default AssistedToggle;

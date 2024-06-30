import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function NewTripleToggle({ labels, onChange, onQuantityChange, quantity }) {
  const [toggle, setToggle] = useState('left'); // Default starting position
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const toggleDef = [
    { name: 'OFF', value: 'left' },
    { name: '-', value: 'center' },
    { name: '+', value: 'right' },
  ];

  const handleTripToggleChange = (value) => {
    setToggle(value);

    if (value === 'left' && currentQuantity !== 0) {
      setCurrentQuantity(0);
      onQuantityChange(value, 0); // Passes value and quantity directly
    } else {
      onChange(value);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setCurrentQuantity(newQuantity);
    onQuantityChange(toggle, newQuantity); // Passes toggle position and new quantity
  };

  const getVariant = (value) => {
    return 'outline-secondary';
  };

  return (
    <div>
      <ButtonGroup className="button-group-2">
        {toggleDef.map((tog, idx) => (
          <ToggleButton
            key={idx}
            id={`tog-${idx}`}
            type="radio"
            variant={getVariant(tog.value)}
            name="toggle"
            value={tog.value}
            checked={toggle === tog.value}
            onChange={(e) => handleTripToggleChange(e.currentTarget.value)}
          >
            {tog.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <div className="input-wrapper">
        <input
          type="number"
          name="quantity"
          pattern="[0-9]+"
          value={currentQuantity}
          onChange={handleQuantityChange}
        />
      </div>
    </div>
  );
}

export default NewTripleToggle;

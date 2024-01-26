/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import ContactParameters from './ContactParameters';

const ElectrodeLogic = ({ imageFiles }) => {
  const [imageStates, setImageStates] = useState(
    imageFiles.map(() => ({
      clicked: false,
      hovered: false,
      voltageInput: '',
    }))
  );

  const [showPopup, setShowPopup] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowPopup(true);
  };

  const handlePopupSave = (updatedImageState) => {
    if (selectedImageIndex !== null) {
      setImageStates((prevImageStates) =>
        prevImageStates.map((state, i) =>
          i === selectedImageIndex ? updatedImageState : state
        )
      );
    }
    setShowPopup(false);
  };

  return (
    <div>
      {/* Render images */}
      {imageFiles.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index}`}
          onClick={() => handleImageClick(index)}
        />
      ))}

      {/* Render the ContactParameters popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <ContactParameters
              imageState={imageStates[selectedImageIndex]}
              onSave={handlePopupSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectrodeLogic;

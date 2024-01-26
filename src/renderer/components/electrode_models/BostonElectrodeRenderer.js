import React from 'react';
import TripleToggle from '../TripleToggle';

function BostonElectrodeRenderer({
  fileInputRef,
  calculateZIndex,
  selectedValues,
  quantities,
  svgs,
  ipgs,
  rightContacts,
  leftContacts,
}) {
  return (
    <div className="container">
      <div className="container2">
        <div className="IPG">
          {ipgs.map((ipg) => (
            <div className="image-item">
              <div className="image-container">
                {React.cloneElement(ipg, {
                  key: ipg.key,
                  className: `${selectedValues[ipg.key]}-color`,
                })}
                {!isNaN(Number(ipg.key)) && (
                  <div className="triple-toggle-ipg">
                    <TripleToggle
                      key={ipg.key}
                      value={selectedValues[ipg.key]}
                      quantity={quantities[selectedValues[ipg.key]]} // Pass the quantity prop
                      onChange={(value) =>
                        handleTripleToggleChange(value, ipg.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(
                          value,
                          animation,
                          quantity,
                          ipg.key,
                        )
                      }
                    />
                  </div>
                )}
              </div>
              {/* <p className="image-key">{ipg.key}</p> */}
            </div>
          ))}
        </div>
        <div className="left-contacts">
          {leftContacts.map((Lcon) => (
            <div className="image-item">
              <div className="image-container">
                {React.cloneElement(Lcon, {
                  key: Lcon.key,
                  className: `${selectedValues[Lcon.key]}-color`,
                })}
                {!isNaN(Number(Lcon.key)) && (
                  <div className="triple-toggle">
                    <TripleToggle
                      key={Lcon.key}
                      value={selectedValues[Lcon.key]}
                      quantity={quantities[selectedValues[Lcon.key]]} // Pass the quantity prop
                      onChange={(value) =>
                        handleTripleToggleChange(value, Lcon.key)
                      }
                      onQuantityChange={(value, animation, quantity) =>
                        handleQuantityChange(
                          value,
                          animation,
                          quantity,
                          Lcon.key,
                        )
                      }
                    />
                  </div>
                )}
              </div>
              {/* <p className="image-key">{Lcon.key}</p> */}
            </div>
          ))}
        </div>
      </div>
      <div className="Elmodel-center">
        {svgs.map((svg) => (
          <div
            className="image-item"
            style={{ zIndex: calculateZIndex(svg.key) }}
          >
            <div className="image-container">
              {React.cloneElement(svg, {
                key: svg.key,
                className: `${selectedValues[svg.key]}-color`,
              })}
              {!isNaN(Number(svg.key)) && (
                <div className="triple-toggle">
                  <TripleToggle
                    key={svg.key}
                    value={selectedValues[svg.key]}
                    quantity={quantities[selectedValues[svg.key]]} // Pass the quantity prop
                    onChange={(value) =>
                      handleTripleToggleChange(value, svg.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(value, animation, quantity, svg.key)
                    }
                  />
                </div>
              )}
            </div>
            {/* <p className="image-key">{svg.key}</p> */}
          </div>
        ))}
      </div>
      <div className="right-contacts">
        {rightContacts.map((rCon) => (
          <div className="image-item">
            <div className="image-container">
              {React.cloneElement(rCon, {
                key: rCon.key,
                className: `${selectedValues[rCon.key]}-color`,
              })}
              {!isNaN(Number(rCon.key)) && (
                <div className="triple-toggle">
                  <TripleToggle
                    key={rCon.key}
                    value={selectedValues[rCon.key]}
                    quantity={quantities[selectedValues[rCon.key]]} // Pass the quantity prop
                    onChange={(value) =>
                      handleTripleToggleChange(value, rCon.key)
                    }
                    onQuantityChange={(value, animation, quantity) =>
                      handleQuantityChange(value, animation, quantity, rCon.key)
                    }
                  />
                </div>
              )}
            </div>
            {/* <p className="image-key">{rCon.key}</p> */}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button
          className="import-button"
          onClick={() => fileInputRef.current.click()}
        >
          Import from LeadDBS
        </button>
        <button
          className="export-button"
          onClick={() => exportToJsonFile(tripleToggleData)}
        >
          Export to LeadDBS
        </button>
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the input element
        />
        {/* <button
          className={calculateQuantities ? 'active-button' : 'inactive-button'}
          onClick={handleCalculateQuantitiesButtonClick}
        >
          {calculateQuantities ? 'On' : 'Off'}
        </button> */}
      </div>
    </div>
  );
}

export default BostonElectrodeRenderer;

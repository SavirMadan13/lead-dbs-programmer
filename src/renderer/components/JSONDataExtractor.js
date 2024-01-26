import React, { useState } from 'react';

function JSONDataExtractor() {
  const [percNumbers, setPercNumbers] = useState([]);
  const [polNumbers, setPolNumbers] = useState([]);

  const extractNumbers = () => {
    fetch('/Users/savirmadan/Documents/MATLAB/output2.json') // Replace with the actual file path
      .then((response) => response.json())
      .then((data) => {
        const percNumbers = [];
        const polNumbers = [];

        function recursiveSearch(obj) {
          for (const key in obj) {
            if (typeof obj[key] === 'object') {
              recursiveSearch(obj[key]);
            } else if (key === 'perc') {
              percNumbers.push(obj[key]);
            } else if (key === 'pol') {
              polNumbers.push(obj[key]);
            }
          }
        }

        recursiveSearch(data);

        setPercNumbers(percNumbers);
        setPolNumbers(polNumbers);
      });
  };

  return (
    <div>
      <button onClick={extractNumbers}>Extract Numbers</button>
      <div>
        <h2>perc Numbers:</h2>
        <ul>
          {percNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>pol Numbers:</h2>
        <ul>
          {polNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default JSONDataExtractor;

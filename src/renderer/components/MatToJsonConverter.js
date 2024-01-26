const fs = require('fs');

// Specify the path to your JSON file
const jsonFilePath = '/Users/savirmadan/Documents/MATLAB/output2.json';

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading the JSON file: ${err}`);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Now you can use the jsonData object as shown in the previous example
  const extractedPolValues = MatToJsonConverter(jsonData);
  console.log(extractedPolValues);
});

function MatToJsonConverter(jsonData) {
  const polValues = {};

  // Iterate through each 'Rs'
  for (const rsKey in jsonData) {
    if (rsKey.startsWith('Rs')) {
      polValues[rsKey] = {};

      // Iterate through each 'k' for the current 'Rs'
      const rsData = jsonData[rsKey];
      for (const kKey in rsData) {
        if (kKey.startsWith('k')) {
          polValues[rsKey][kKey] = rsData[kKey].pol;
        }
      }
    }
  }

  return polValues;
}

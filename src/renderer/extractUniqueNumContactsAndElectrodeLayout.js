// /* eslint-disable no-restricted-syntax */
// const fs = require('fs');

// function extractUniqueNumContactsAndElectrodeLayout(filePath) {
//   try {
//     const fileContent = fs.readFileSync(filePath, 'utf-8');

//     // Split the file content into sections based on 'case' statements
//     const sections = fileContent.split('case ');

//     const results = [];

//     // Regular expressions to extract NumContacts and ElectrodeLayout
//     const numContactsRegex = /elspec\.numel=(\d+);/;
//     const electrodeLayoutRegex = /elspec\.etageidx=num2cell\(([\d\s,]+)\);/;

//     for (const section of sections) {
//       // Find the 'case' statement in this section
//       const caseMatch = section.match(/'(.+?)'/);

//       if (caseMatch) {
//         const caseName = caseMatch[1];

//         const numContactsMatch = section.match(numContactsRegex);
//         const electrodeLayoutMatch = section.match(electrodeLayoutRegex);

//         if (numContactsMatch && electrodeLayoutMatch) {
//           const NumContacts = parseInt(numContactsMatch[1], 10);
//           const ElectrodeLayout = electrodeLayoutMatch[1]
//             .split(',')
//             .map(Number);

//           results.push({ Case: caseName, NumContacts, ElectrodeLayout });
//         }
//       }
//     }

//     return results;
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//   }
// }

// const filePath =
//   '/Users/savirmadan/Documents/GitHub/leaddbs/templates/electrode_models/ea_resolve_elspec.m';
// const results = extractUniqueNumContactsAndElectrodeLayout(filePath);

// if (results) {
//   // Write the results to a JSON file
//   const outputFileName = 'ElectrodeDetails.json';
//   fs.writeFileSync(outputFileName, JSON.stringify(results, null, 2));
//   console.log(`Data written to ${outputFileName}`);
// }

const fs = require('fs');
const path = require('path');

// Provide the directory and file name
const directory = '/Users/savirmadan/Documents/GitHub/leaddbs/templates/electrode_models';
const fileName = 'ea_resolve_elspec.m';

// Read the .m file content
const filePath = path.join(directory, fileName);

if (fs.existsSync(filePath)) {
  const mFileContents = fs.readFileSync(filePath, 'utf8');

  // Define regular expression patterns to extract elspec.numel and elspec.etageidx
  const regexNumel = /elspec\.numel=(\d+);/g;
  const regexEtageidx = /elspec\.etageidx=(.*?);/g;

  const numelMatches = mFileContent.match(regexNumel);

  if (numelMatches) {
    const results = [];

    for (let i = 0; i < numelMatches.length; i++) {
      const numel = parseInt(numelMatches[i].match(/\d+/)[0]);

      // Only capture etageidx if numel is not equal to 4
      let etageidx = [];
      if (numel !== 4) {
        const etageidxMatch = regexEtageidx.exec(mFileContent);
        if (etageidxMatch) {
          etageidx = eval(etageidxMatch[1]);
        }
      }

      results.push({ numel, etageidx });
    }

    // Convert the results to JSON
    const jsonResult = JSON.stringify(results, null, 2);

    // Write the JSON to a file
    fs.writeFileSync('output.json', jsonResult, 'utf8');

    console.log('JSON data saved to output.json');
  } else {
    console.error('No matches found for elspec.numel in the .m file.');
  }
} else {
  console.error('File not found in the specified directory.');
}


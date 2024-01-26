// server.js
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3001; // Change the port if needed

app.use(express.json());

app.post('/save-parameters', (req, res) => {
  const parameters = req.body;
  const dataToWrite = JSON.stringify(parameters, null, 2);

  fs.writeFile('parameters.json', dataToWrite, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to save parameters.' });
    } else {
      res.json({ message: 'Parameters saved successfully.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const app = express();
const port = 3300;
const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('LE.txt')
.pipe(csv({ separator: '\t' }))
.on('data', (data) => results.push(data))
.on('end', () => {
});

app.get('/', (req, res) => {
  res.send(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
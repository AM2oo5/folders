// Requirements
const express = require('express');
const app = express();
const port = 3300;
const csv = require('csv-parser');
const fs = require('fs');
const results = [];

// create stream 
fs.createReadStream('LE.txt')
// läbi CSV parseriga, seperate ja create readable stream from desired "CSV" TXT meie näitel
.pipe(csv({ separator: '\t' }))
// parsed TXT muuta dataks
.on('data', (data) => results.push(data))
.on('end', () => {
});

// Express endpoint 
app.get('/spare-parts', (req, res) => {
res.send(results);
});
// Express server start mis kuulab port mis on 3330
app.listen(port, () => {
console.log(`http://localhost:${port}/spare-parts`);
});
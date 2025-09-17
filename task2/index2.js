const express = require('express');
const app = express();
const port = 3300;
const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('LE.txt')
.pipe(csv({ 
  separator: '\t',
  // txt file'i otsime ainult neid headerid
  headers: ['number', 'name', 'price']
}))
.on('data', (data) => {
  Object.keys(data).forEach(key => {
    if (data[key]) {
      data[key] = data[key].replace(/^["']|["']$/g, '').trim();
    }
  });
  results.push(data);
})
.on('end', () => {
});

app.get('/spare-parts', (req, res) => {
  // Required Query'd
  const { sn, name, price } = req.query;
  let filteredResults = results;

  if (sn) {
    filteredResults = filteredResults.filter(part => 
      part.number && part.number.toLowerCase().includes(sn.toLowerCase())
    );
  }
  
  if (name) {
    filteredResults = filteredResults.filter(part => 
      part.name && part.name.toLowerCase().includes(name.toLowerCase())
    );
  }

   if (price) {
    filteredResults = filteredResults.filter(part => 
      part.price && part.price.toLowerCase().includes(price.toLowerCase())
    );
  }
  // valitud otsingus üks header prindib valja ka teised headerid välja. Vajadusel võib muuta kui vaja.
  const cleanResults = filteredResults.map(part => ({
    sn: part.number,
    name: part.name,
    price: part.price
  }));

  res.json({
    // prindib const cleanResults 
    results: cleanResults
  });
});
// Server 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/spare-parts`);
});

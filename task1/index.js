// Dependencies

const https = require('https');
const fs = require('fs');

// Query'd
const lat = 59.436962;
const lon = 24.753574;
const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

const query = {
  headers: {
    'User-Agent': 'allan.miljan@tptlive.ee'
  }
};

https.get(url, query, (res) => {
  let data = '';

  // Data
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(data);

    const jsonString = JSON.stringify(json,null, 2);
    fs.writeFileSync('yrno_forecast.json', jsonString);
    console.log('Saved forecast to eesti.forecast.json');

    const timeseries = json.properties.timeseries;

    for (let i = 0; i < 25; i++) {
      const entry = timeseries[i];
      const time = entry.time;
      const temp = entry.data.next_12_hours.summary.symbol_code;
      console.log(`${time} ${temp}`);
    }
  });
});

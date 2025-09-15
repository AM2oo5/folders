const https = require('https');

const lat = 59.436962;
const lon = 24.753574;
var url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

const options = {
  headers: {
    'User-Agent': 'allan.miljan@tptlive.ee'
  }
};

https.get(url, options, (res) => {
  let data = '';

  // data chunks
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(data);
    const timeseries = json.properties.timeseries;

    // Loop 
    for (let i = 0; i < 24; i++) {
      const entry = timeseries[i];
      const time = entry.time;
      const temp = entry.data.instant.details.air_temperature;
      
      console.log(`${time} ${temp}C`);
    }
  });
});

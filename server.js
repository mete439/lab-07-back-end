'use strict';
// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Home Page');
})

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    console.log('location: ', locationData);
    response.send(locationData);
  }
  catch (error) {
    console.log('So sorry, something went wrong.', error);
  }
})

app.get('/weather', (request, response) => {
  try {
    const wxData = require('./data/darksky.json');
    const weatherData = [];
    wxData.daily.data.forEach(value => {
      const localWx = new Weather(value);
      weatherData.push(localWx);
    });
    console.log('WX', weatherData);
    response.send(weatherData);
  }
  catch (error) {
    console.log('So sorry, something went wrong.', error);
  }
})

// Location Constructor
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// Location Weather Constructor
function Weather(localObj) {
  this.forecast = localObj.summary;
  this.time = new Date(localObj.time * 1000).toUTCString().slice(0, 16);

}

// function errorHandler(error, request, response) {
//     response.status(500).send(error);
// }

// Server Listener
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));

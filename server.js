'use strict';
// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Home Page');
});

// list Routes.

app.get('/location ', locationHandler);
// app.get('/weather', weatherHandler);
// app.get('/event', eventHandler);

/// creating callback functions for routes. 

function locationHandler(request, response) {
  try {
    let city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const location = new Location(city, geoData);
        response.send(location);
      })
      .catch(() => {
        errorHandler('Location superagent broke', request, response);
      });
  }
  catch (error) {
    errorHandler(error, request, response);
  }

}

////// creating constracter function for location 

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;

}

//// Creating error habndler function.
function errorHandler(error, request, response) {
  console.error(error);
  response.status(500).send(error);
}


//// TO conferm the server is listning. 
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));





















// app.get('/location', (request, response) => {
//   try {
//     const geoData = require('./data/geo.json');
//     const city = request.query.city;
//     const locationData = new Location(city, geoData);
//     console.log('location: ', locationData);
//     response.send(locationData);
//   }
//   catch (error) {
//     console.log('So sorry, something went wrong.', error);
//   }
// })

// app.get('/weather', (request, response) => {
//   try {
//     const wxData = require('./data/darksky.json');
//     const weatherData = [];
//     wxData.daily.data.forEach(value => {
//       const localWx = new Weather(value);
//       weatherData.push(localWx);
//     });
//     console.log('WX', weatherData);
//     response.send(weatherData);
//   }
//   catch (error) {
//     console.log('So sorry, something went wrong.', error);
//   }
// })

// // Location Constructor
// function Location(city, geoData) {
//   this.search_query = city;
//   this.formatted_query = geoData[0].display_name;
//   this.latitude = geoData[0].lat;
//   this.longitude = geoData[0].lon;
// }

// // Location Weather Constructor
// function Weather(localObj) {
//   this.forecast = localObj.summary;
//   this.time = new Date(localObj.time * 1000).toUTCString().slice(0, 16);

// }

// // function errorHandler(error, request, response) {
// //     response.status(500).send(error);
// // }

// // Server Listener


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

// list Rout
/// Route checker or error .
app.get('/hello', (request, response) => {
  response.status(200).send('hello');
});

// list Routes

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/event', eventHandler);

/// creating callback functions for routes.

function locationHandler(request, response) {

  try {
    //console.log(request);
    let city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    // console.log(url);

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

////// creating constracter function for location.

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;

}
//  weather constructor
function Weather(day) {

  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
// Eventful constructor . 
function Event(event) {
  this.link = event.url;
  this.name = event.name;
  this.event_date = new Date(event.time * 1000).toString().slice(0, 15);
  this.summary = event.summary;
}
// Eventful handler function . 

function Eventful(request, response) {

  let eventName = request.query.name;
  let eventDay = request.query.name;

  const url = `http://api.eventful.com/rest/events/search?&keywords=${process.env.EVENTFUL_API_KEY}&location=${eventName}&${eventDay}=Future`;



  superagent.get(url)
    .then(data => {
      console.log(data);
      const eventsummary = data.body.event_day.data.map(day => {
        return new Event(day);
      });
      response.status(200).json(eventsummary);
    })
    .catch(() => {
      errorHandler('opps, something wrong', require, response);
    });

}


//// Creating error habndler function.
function weatherHandler(request, response) {

  let latitude = request.query.latitude;
  console.log(latitude);
  let longitude = request.query.longitude;
  console.log(longitude);

  const url = `https://api.darksky.net/forecast/${process.env.WRATHER_API_KEY}/${latitude},${longitude}`;
  //console.log('prof of life');

  superagent.get(url)
    .then(data => {
      console.log(data);
      const weatherSummeries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummeries);
    })
    .catch(() => {
      errorHandler('opps, something wrong', require, response);
    });

}

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


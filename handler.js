'use strict';

/* eslint-disable no-param-reassign */

module.exports.localTrucks = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.query && req.query.latitude && req.query.longitude) {
    const lat = req.query.latitude
    const long = req.query.longitude
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: `Latitude: ${lat}, longitude: ${long}`,
    };

  } else {
    context.res = {
      body: 'Please supple a longitude and latitude as query parameters'
    }
  }


  context.done();
};

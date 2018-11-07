const soda = require('soda-js');

module.exports.localTrucks = async function (context, req) {
  if (req.query && req.query.latitude && req.query.longitude) {
    const latitude = req.query.latitude
    const longitude = req.query.longitude
    try {
      context.res = {
        status: 200,
        body: {
          trucks: await sodaQuery(latitude, longitude)
        }
      };

    } catch (err) {
      context.log('Got an error from soda ', err)
      context.res = badQuery(latitude, longitude)
    }

  } else {
    context.res = missingParams
  }
  context.done()
};

function badQuery(latitude, longitude) {
  return {
    status: 400,
    body: `Sorry, we were unable to get trucks located at latitude ${latitude} and longitude ${longitude}`
  }
}

const missingParams = {
  status: 422,
  body: 'Please supply a longitude and latitude as query parameters'
}

function sodaQuery(latitude, longitude) {
  return new Promise((resolve, reject) => {
    const consumer = new soda.Consumer('data.sfgov.org');
    consumer.query()
      .withDataset('6a9r-agq8')
      .limit(5)
      .select(`address, applicant as name, dayshours as schedule, fooditems as menu, distance_in_meters(location, 'POINT (${longitude} ${latitude})') * 3.28084 AS distance_in_feet`)
      .where({ status: 'APPROVED' })
      .order(`distance_in_meters(location, 'POINT (${longitude} ${latitude})')`)
      .getRows()
      .on('success', function (rows) { resolve(rows); })
      .on('error', function (error) { reject(error); });

  })
}

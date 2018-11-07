const soda = require('soda-js');

function sodaQuery() {
  return new Promise((res, rej) => {
    const consumer = new soda.Consumer('data.sfgov.org');
    consumer.query()
      .withDataset('6a9r-agq8')
      .limit(5)
      .where({status: 'APPROVED'})
      .getRows()
        .on('success', function(rows) { res(rows); })
        .on('error', function(error) { rej(error); });
  
  })
}

module.exports.localTrucks = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  if (req.query && req.query.latitude && req.query.longitude) {
    // const lat = req.query.latitude
    // const long = req.query.longitude
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        trucks: await sodaQuery()
      }
    };

  } else {
    context.res = {
      body: 'Please supple a longitude and latitude as query parameters'
    }
  }


  context.done();
};
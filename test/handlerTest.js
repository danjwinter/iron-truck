const assert = require('chai').assert
const handler = require('../src/handler')
const helper = require('./helper')

describe('localTrucks', async () => {
  it('returns 5 closest trucks given latitude and longitude', async () => {
    const request = {
      query: {
        latitude: 37.78304609975,
        longitude: -122.39406659923
      }
    }
    const context = {}
    await handler.localTrucks(context, request)
    assert.deepEqual(context, helper.happyPathExpectedContext)
  })

  it('returns a 400 if bad latitude and longitude are given', async () => {
    const request = {
      query: {
        latitude: 'a',
        longitude: 'b'
      }
    }
    const context = {
      log: function() {}
    }
    const expectedErrorMessage = `Sorry, we were unable to get trucks located at latitude ${request.query.latitude} and longitude ${request.query.longitude}`
    await handler.localTrucks(context, request)
    assert.equal(context.res.status, 400)
    assert.equal(context.res.body, expectedErrorMessage)
  })

  it('returns a 422 if latitude or longitude are missing', async () => {
    const request = {
      query: {
        longitude: 11111
      }
    }
    const context = {
      log: function() {}
    }
    const expectedErrorMessage = 'Please supply a longitude and latitude as query parameters'
    await handler.localTrucks(context, request)
    assert.equal(context.res.status, 422)
    assert.equal(context.res.body, expectedErrorMessage)
  })
})
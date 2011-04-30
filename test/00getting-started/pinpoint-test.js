

var vows = require('vows'),
    assert = require('assert'),
    request = require('request'),
    helpers = require('./../helpers');
    
helpers.addPinpoint('00getting-started');

var pinpoint = require('pinpoint');

vows.describe('00getting-started').addBatch(helpers.requiresInit(8000)).addBatch({
  "A request to the pinpoint server": {
    topic: function () {
      request({
        uri: 'http://localhost:8000/',
        method: 'GET'
      }, this.callback);
    },
    "should respond with 501 - Not implemented": function (err, res, body) {
      assert.isNull(err);
      assert.equal(res.statusCode, 501);
      assert.equal(JSON.parse(body).message, 'not implemented');
    }
  }
}).export(module);
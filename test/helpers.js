
var helpers = exports;

var assert = require('assert'),
    path = require('path'),
    pinpoint = require('../lib/pinpoint');

helpers.requiresInit = function (port) {
  return {
    "This test requires pinpoint.start": {
      topic: function () {
        pinpoint.start({ env: 'test', port: port }, this.callback);
      },
      "should respond without an error": function (err, server) {
        assert.isNull(err);
      }
    }
  };
}
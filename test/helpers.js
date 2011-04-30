
var helpers = exports;

var assert = require('assert'),
    pinpoint;

helpers.addPinpoint = function (target) {
  require.paths.unshift(require('path').join(__dirname, '..', 'lib', target));
  pinpoint = require('pinpoint');
};

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
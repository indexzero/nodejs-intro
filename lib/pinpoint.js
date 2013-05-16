/*
 * pinpoint.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http'),
    winston = require('winston'),
    union = require('union'),
    service = require('./service');

/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
exports.createServer = function (port, database) {
  var router = service.createRouter(),
      server;

  server = union.createServer({
    before: [
      function (req, res) {
        //
        // Dispatch the request to the router
        //
        winston.info('Incoming Request: ' + req.url);
        router.dispatch(req, res, function (err) {
          winston.info('Request errored: ' + req.url);
          if (err) {
            res.writeHead(404);
            res.end();
          }
        });
      }
    ]
  });
  
  if (port) {
    server.listen(port);
  }
  
  return server;
};

/**
 * Light-weight wrapped to 'createServer' method for future use
 */
exports.start = function (options, callback) {
  var server = exports.createServer(options.port);
  callback(null, server);
}
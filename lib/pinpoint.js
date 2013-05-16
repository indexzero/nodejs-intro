/*
 * pinpoint.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http'),
    winston = require('winston'),
    service = require('./service');

/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
exports.createServer = function (port) {
  var router = service.createRouter();
  
  var server = http.createServer(function (request, response) {
    var body = '';
    
    winston.info('Incoming Request', { url: request.url });
    
    request.on('data', function (chunk) {
      body += chunk;
    });
    
    request.on('end', function () {
      //
      // Dispatch the request to the router
      //
      router.handle(request, body, function (route) {
        response.writeHead(route.status, route.headers);
        response.end(route.body);
      });
    })
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
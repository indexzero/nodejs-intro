/*
 * pinpoint.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var http = require('http'),
    winston = require('winston'),
    database = require('./database'),
    bookmark = require('./bookmark'),
    service = require('./service');

/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 * @param {connection} database: Connection to CouchDB
 */
exports.createServer = function (port, database) {
  var resource = new bookmark.Bookmark(database),
      router = service.createRouter(resource);
      
  var server = http.createServer(function (request, response) {
    winston.info('Incoming Request', { url: request.url });
    request.on('end', function () {
      //
      // Dispatch the request to the router
      //
      router.dispatch(request, request, function (err) {
        winston.info('Request completed', info);
        if (err) {
          res.writeHead(404);
          res.end();
        }
      });
    });
  });
  
  if (port) {
    server.listen(port);
  }
  
  return server;
};

/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 * @param {connection} database: Connection to CouchDB
 */
exports.start = function (options, callback) {
  database.setup(options, function (err, db) {
    if (err) {
      return callback(err);
    }
    
    callback(null, exports.createServer(options.port, db));
  });
};
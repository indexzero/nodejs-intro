/*
 * pinpoint.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var winston = require('winston'),
    union = require('union'),
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
      router = service.createRouter(resource),
      server;

  server = union.createServer({
    before: [
      function (req, res) {
        //
        // Dispatch the request to the router
        //
        winston.info('Incoming Request', { url: req.url });
        router.dispatch(req, res, function (err) {
          winston.info('Request completed', { url: req.url });
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
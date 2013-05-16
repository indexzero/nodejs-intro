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
    helpers = require('./helpers'),
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
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 * @param {connection} database: Connection to CouchDB
 */
exports.start = function (options, callback) {
  database.setup(options, function (err, db) {
    if (err) {
      return callback(err);
    }
    
    if (options.basicAuth) {
      var auth = options.basicAuth.split(':');
      helpers.auth.username = auth[0];
      helpers.auth.password = auth[1];
      console.log('Configuring HTTP Basic Auth. Base64 Encoded Username/Password: ' + helpers.base64.encode(auth[0] + ':' + auth[1]));
    }
    
    callback(null, exports.createServer(options.port, db));
  });
};
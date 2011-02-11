/*
 * pinpoint.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var sys = require('sys'),
    http = require('http'),
    winston = require('winston'),
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
      router = service.createRouter(resource);
      
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
      var emitter = router.handle(request, body, function (route) {
        response.writeHead(route.status, route.headers);
        response.end(route.body);
      });
      
      emitter.on('log', function (info) {
        winston.info('Request completed', info);
      });
    })
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
      sys.puts('Configuring HTTP Basic Auth. Base64 Encoded Username/Password: ' + helpers.base64.encode(auth[0] + ':' + auth[1]));
    }
    
    callback(null, exports.createServer(options.port, db));
  });
};
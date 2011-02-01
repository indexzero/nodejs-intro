/*
 * database.js: Configuration for CouchDB and cradle for this application. 
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var cradle = require('cradle');
 
var setup = exports.setup = function (options, callback) {
  // Set connection configuration
  cradle.setup({
    host: options.host || '127.0.0.1',
    port: 5984,
    options: options.options,
  });
  
  // Connect to cradle
  var conn = new (cradle.Connection)({ auth: options.auth }),
      db = conn.database(options.database || 'pinpoint-dev');
      
  if (options.setup) {
    initViews(db, callback);
  }
  else {
    callback(null, db); 
  }
};

var initViews = exports.initViews = function (db, callback) {
  var designs = [
    {
      '_id': '_design/Bookmark',
      views: {
        all: {
          map: function (doc) { if (doc.resource === 'Bookmark') emit(doc._id, doc) }
        },
        byUrl: {
          map: function (doc) { if (doc.resource === 'Bookmark') { emit(doc.url, doc); } }
        },
        byDate: {
          map: function (doc) { if (doc.resource === 'Bookmark') { emit(doc.date, doc); } }
        }
      }
    }
  ];
  
  db.save(designs, function (err) {
    if (err) return callback(err);
    callback(null, db);    
  });
};
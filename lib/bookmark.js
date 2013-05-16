/*
 * bookmark.js: Top-level include for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */

var helpers = require('./helpers');

/**
* Constructor function for the Bookmark object..
* @constructor
* @param {connection} database: Connection to CouchDB
*/
var Bookmark = exports.Bookmark = function (database) {
  this.database = database;
};

/**
* Lists all Bookmarks in the database
* @param {function} callback: Callback function
*/
Bookmark.prototype.list = function (callback) {
  this.database.view('Bookmark/all', function (err, result) {
    if (err) {
      return callback(err);
    }
    
    callback(null, result.rows.map(function (row) { return row.value }));
  })
};

/**
* Shows details of a particular bookmark
* @param {string} id: ID of the bookmark
* @param {function} callback: Callback function
*/
Bookmark.prototype.show = function (id, callback) {
  this.database.get(id, function (err, doc) {
    if (err) {
      return callback(err);
    }
    
    callback(null, doc);
  });
};

/**
* Creates a new bookmark with the specified properties
* @param {object} bookmark: Properties to use for the bookmark
* @param {function} callback: Callback function
*/
Bookmark.prototype.create = function (bookmark, callback) {
  bookmark._id = helpers.randomString(32);
  bookmark.resource = "Bookmark";
  
  this.database.save(bookmark._id, bookmark, function (err, res) {
    if (err) {
      return callback(err);
    }
    
    callback(null, bookmark);
  })
};

/**
* Updates a new bookmark with the specified id and properties
* @param {object} bookmark: Properties to update the bookmark with
* @param {function} callback: Callback function
*/
Bookmark.prototype.update = function (id, bookmark, callback) {
  this.database.merge(id, bookmark, function (err, res) {
    if (err) {
      return callback(err);
    }
    
    callback(null, true);
  });
};

/**
* Destroys a bookmark with the specified ID
* @param {string} id: ID of the bookmark to destroy
* @param {function} callback: Callback function
*/
Bookmark.prototype.destroy = function (id, callback) {
  var self = this;
  this.show(id, function (err, doc) {
    if (err) {
      return callback(err);
    }
    
    self.database.remove(id, doc._rev, function (err, res) {
      if (err) {
        return callback(err);
      }

      callback(null, true);
    });
  });
};
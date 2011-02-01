/*
 * service.js: Defines the web service for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */

var journey = require('journey');

/**
 * Creates the RESTful router for the pinpoint web service
 * @param {bookmark} resource: Instance of a bookmark resource
 */
exports.createRouter = function (resource) {
  return new (journey.Router)(function (map) {
    map.path(/\/bookmarks/, function () {
      //
      // LIST: GET to /bookmarks lists all bookmarks
      //
      this.get().bind(function (res) {
        resource.list(function (err, bookmarks) {
          if (err) {
            return res.send(500, { 'Content-Type': 'application/json' }, { error: err.error });
          }
          
          res.send(200, { 'Content-Type': 'application/json' }, { bookmarks: bookmarks });
        });
      });
      
      //
      // SHOW: GET to /bookmarks/:id shows the details of a specific bookmark 
      //
      this.get(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
        resource.show(id, function (err, bookmark) {
          if (err) {
            return res.send(500, { 'Content-Type': 'application/json' }, { error: err.error });
          }
          
          res.send(200, { 'Content-Type': 'application/json' }, { bookmark: bookmark });
        });
      });
      
      //
      // CREATE: POST to /bookmarks creates a new bookmark
      //
      this.post().bind(function (res, bookmark) {
        resource.create(bookmark, function (err, result) {
          if (err) {
            return res.send(500, { 'Content-Type': 'application/json' }, { error: err.error });
          }
          
          res.send(200, { 'Content-Type': 'application/json' }, { bookmark: result });
        });
      });
      
      //
      // UPDATE: PUT to /bookmarks updates an existing bookmark
      //
      this.put(/\/([\w|\d|\-|\_]+)/).bind(function (res, id, bookmark) {
        resource.update(id, bookmark, function (err, updated) {
          if (err) {
            return res.send(500, { 'Content-Type': 'application/json' }, { error: err.error });
          }
          
          res.send(200, { 'Content-Type': 'application/json' }, { updated: updated });
        });
      });
      
      //
      // DELETE: DELETE to /bookmarks/:id deletes a specific bookmark
      //
      this.del(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
        resource.destroy(id, function (err, destroyed) {
          if (err) {
            return res.send(500, { 'Content-Type': 'application/json' }, { error: err.error });
          }
          
          res.send(200, { 'Content-Type': 'application/json' }, { destroyed: destroyed });
        });
      });
    });
  }, { strict: false });
};
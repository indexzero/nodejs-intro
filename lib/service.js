/*
 * service.js: Defines the web service for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */

var director = require('director'),
    helpers = require('./helpers');

/**
 * Creates the RESTful router for the pinpoint web service
 * @param {bookmark} resource: Instance of a bookmark resource
 */
exports.createRouter = function (resource) {
  var router = new director.http.Router().configure({
    strict: false,
    async: true
  });

  router.path(/\/bookmarks/, function () {
    //
    // LIST: GET to /bookmarks lists all bookmarks
    //
    this.get(function () {
      var res = this.res;
      resource.list(function (err, bookmarks) {
        if (err) {
          return res.json(500, { error: err.error });
        }
        
        res.json(200, { bookmarks: bookmarks });
      });
    });
    
    //
    // SHOW: GET to /bookmarks/:id shows the details of a specific bookmark 
    //
    this.get(/\/([\w|\d|\-|\_]+)/, function (id) {
      var res = this.res;
      resource.show(id, function (err, bookmark) {
        if (err) {
          return res.json(500, { error: err.error });
        }
        
        res.json(200, { bookmark: bookmark });
      });
    });
    
    //
    // CREATE: POST to /bookmarks creates a new bookmark
    //
    this.post(function (bookmark) {
      var res = this.res;
      resource.create(bookmark, function (err, result) {
        if (err) {
          return res.json(500, { error: err.error });
        }
        
        res.json(200, { bookmark: result });
      });
    });
    
    //
    // UPDATE: PUT to /bookmarks updates an existing bookmark
    //
    this.put(/\/([\w|\d|\-|\_]+)/, function (id, bookmark) {
      var res = this.res;
      resource.update(id, bookmark, function (err, updated) {
        if (err) {
          return res.json(500, { error: err.error });
        }
        
        res.json(200, { updated: updated });
      });
    });
    
    //
    // DELETE: DELETE to /bookmarks/:id deletes a specific bookmark
    //
    this.delete(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
      var res = this.res;
      resource.destroy(id, function (err, destroyed) {
        if (err) {
          return res.json(500, { error: err.error });
        }
        
        res.json(200, { destroyed: destroyed });
      });
    });
  });
  
  return router;
};
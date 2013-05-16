/*
 * service.js: Defines the web service for the Pinpoint module. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */

var director = require('director');

/**
 * Creates the RESTful router for the pinpoint web service
 */
exports.createRouter = function () {
  var router = new director.http.Router().configure({
    strict: false,
    async: true
  });
  
  router.path(/\/bookmarks/, function () {
    //
    // LIST: GET to /bookmarks lists all bookmarks
    //
    this.get(function () {
      this.res.json(501, { action: 'list' });
    });
    
    //
    // SHOW: GET to /bookmarks/:id shows the details of a specific bookmark 
    //
    this.get(/\/([\w|\d|\-|\_]+)/, function (id) {
      this.res.json(501, { action: 'show' });
    });
    
    //
    // CREATE: POST to /bookmarks creates a new bookmark
    //
    this.post(function (bookmark) {
      this.res.json(501, { action: 'create' });
    });
    
    //
    // UPDATE: PUT to /bookmarks updates an existing bookmark
    //
    this.put(/\/([\w|\d|\-|\_]+)/, function (bookmark) {
      this.res.json(501, { action: 'update' });
    });
    
    //
    // DELETE: DELETE to /bookmarks/:id deletes a specific bookmark
    //
    this.delete(/\/([\w|\d|\-|\_]+)/, function (id) {
      this.res.json(501, { action: 'delete' });
    });
  });
  
  return router;
};
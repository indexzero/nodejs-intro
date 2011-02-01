
var journey = require('journey');

var service = exports;

service.createRouter = function () {
  return new (journey.Router)(function (map) {
    map.path(/\/bookmarks/, function () {
      //
      // LIST: GET to /bookmarks lists all bookmarks
      //
      this.get().bind(function (res) {
        res.send(501, { 'Content-Type': 'application/json'}, { action: 'list' });
      });
      
      //
      // SHOW: GET to /bookmarks/:id shows the details of a specific bookmark 
      //
      this.get(/\/(\w+)/).bind(function (res, id) {
        res.send(501, { 'Content-Type': 'application/json'}, { action: 'show' });
      });
      
      //
      // CREATE: POST to /bookmarks creates a new bookmark
      //
      this.post().bind(function (res, bookmark) {
        res.send(501, { 'Content-Type': 'application/json'}, { action: 'create' });
      });
      
      //
      // UPDATE: PUT to /bookmarks updates an existing bookmark
      //
      this.put().bind(function (res, bookmark) {
        res.send(501, { 'Content-Type': 'application/json'}, { action: 'update' });
      });
      
      //
      // DELETE: DELETE to /bookmarks/:id deletes a specific bookmark
      //
      this.del(/\/(\w+)/).bind(function (res, id) {
        res.send(501, { 'Content-Type': 'application/json'}, { action: 'delete' });
      });
    });
  });
};
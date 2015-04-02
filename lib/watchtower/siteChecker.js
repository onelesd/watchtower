"use strict"

var request = require("request");

function SiteChecker(base) {
  this.base = base;
};

SiteChecker.prototype.validate = function(endpoints) {
  for (var i in endpoints) {
    get_status(endpoints[i], this.base, function(msg) {
      console.log(msg);
    });
  };
};

var form_url = function(base, path) {
  return base + path;
};

var get_status = function(endpoint, base, callback) {
  var url = form_url(base, endpoint.path);
  request(url, function (_error, resp, _body) {
    var msg = endpoint.name + " (" + url + ") - " + resp.statusCode;
    callback(msg);
  })
};

module.exports = SiteChecker;

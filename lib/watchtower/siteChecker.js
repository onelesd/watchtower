var _       = require("underscore");
var request = require("request");

function SiteChecker(base) {
  this.base = base;
};

SiteChecker.prototype.validate = function(endpoints, callback) {
  var base    = this.base;
  var results = [];
  _.each(endpoints, function(endpoint) {
    get_status(endpoint, base, function(result) {
      results.push(result);
      finished(results, endpoints, callback);
    });
  });
};

var finished = function(results, endpoints, callback) {
  if (results.length == endpoints.length) {
    callback(results);
  }
};

var form_url = function(base, path) {
  return base + path;
};

var get_status = function(endpoint, base, callback) {
  var url = form_url(base, endpoint.path);
  request(url, function (_error, resp, _body) {
    callback(result(resp.statusCode, endpoint));
  })
};

var result = function(status, endpoint) {
  return {
    status: status,
    endpoint: endpoint
  }
};

module.exports = SiteChecker;

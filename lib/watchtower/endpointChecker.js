var _       = require("underscore");
var request = require("request");

function EndpointChecker() {};

EndpointChecker.prototype.validate = function(endpoints, callback) {
  var results = [];
  _.each(endpoints, function(endpoint) {
    get_status(endpoint, function(result) {
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

var get_status = function(endpoint, callback) {
  request(endpoint.url, function (_error, resp, _body) {
    callback(result(resp.statusCode, endpoint));
  })
};

var result = function(status, endpoint) {
  return {
    status: status,
    endpoint: endpoint
  }
};

module.exports = EndpointChecker;

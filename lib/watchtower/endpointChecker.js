var _       = require("lodash");
var log     = require("./logger.js");
var request = require("request");

function EndpointChecker(max_concurrent) {
  request.defaults.maxSockets = max_concurrent;
};

EndpointChecker.prototype.validate = function(endpoints, callback) {
  log.info("Verifying " + endpoints.length + " endpoints.");
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
  request(request_opts(endpoint.url), function (_error, resp, _body) {
      callback(result(resp.statusCode, resp.elapsedTime, endpoint));
    }
  )
};

var request_opts = function(url) {
  return {
    url: url,
    time: true
  };
};

var result = function(status, time, endpoint) {
  return {
    status: status,
    site: endpoint.site,
    time: time,
    endpoint: endpoint
  }
};

module.exports = EndpointChecker;

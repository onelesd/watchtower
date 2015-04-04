var _               = require("underscore");
var configParser    = require("./watchtower/configParser.js");
var endpointChecker = require("./watchtower/endpointChecker.js");

function startWatch() {
  var endpoints = new configParser("config.yaml").parse();
  verify_endpoints(endpoints);
};

var output_results = function(results) {
  _.each(results, function(result) {
    var e   = result.endpoint;
    var msg = e.site + ": " + e.page_name + " (" + e.url + ") - " + result.status;
    console.log(msg);
  });
};

var verify_endpoints = function(endpoints) {
  var checker = new endpointChecker();
  checker.validate(endpoints, function(results) {
    output_results(results);
  });
};

exports.startWatch = startWatch;

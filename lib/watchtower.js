var _               = require("underscore");
var configParser    = require("./watchtower/configParser.js");
var endpointChecker = require("./watchtower/endpointChecker.js");
var fs              = require("fs");

function startWatch(config_path) {
  check_config_exists(config_path);
  var endpoints = new configParser(config_path).parse();
  verify_endpoints(endpoints);
};

var check_config_exists = function(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    throw new Error("Config YAML not found.");
  }
};

var group_results = function(results) {
  return _.groupBy(results, function(r) { return r.site; });
};

var output_result = function(result) {
  var e   = result.endpoint;
  var msg = " - " + e.page_name + " (" + e.url + "): " + result.status;
  console.log(msg);
};

var output_results = function(results) {
  _.each(group_results(results), function(val, key) {
    console.log(key);
    _.each(val, function(result) {
      output_result(result);
    });
  });
};

var sort_by_site = function(results) {
  return _.sortBy(results, "site");
};

var verify_endpoints = function(endpoints) {
  var checker = new endpointChecker();
  checker.validate(endpoints, function(results) {
    output_results(results);
  });
};

exports.startWatch = startWatch;

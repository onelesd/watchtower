var _            = require("underscore");
var configParser = require("./watchtower/configParser.js");
var siteChecker  = require("./watchtower/siteChecker.js");

function startWatch() {
  var config  = new configParser("config.yaml").parse();
  var sites   = config.sites;
  verify_sites(sites);
};

var finished = function(results, sites) {
  if (results.length == sites.length) {
    output_results(_.flatten(results));
  }
};

var output_results = function(results) {
  _.each(results, function(result) {
    var endpoint = result.endpoint;
    var msg      = endpoint.name + " (" + endpoint.path + ") - " + result.status;
    console.log(msg);
  });
};

var verify_sites = function(sites) {
  var results = [];
  _.each(sites, function(site) {
    var checker = new siteChecker(site.base);
    checker.validate(site.endpoints, function(array) {
      results.push(array);
      finished(results, sites);
    });
  });
};

exports.startWatch = startWatch;

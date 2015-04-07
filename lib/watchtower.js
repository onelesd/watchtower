var _               = require("underscore");
var clc             = require("cli-color");
var configParser    = require("./watchtower/configParser.js");
var endpointChecker = require("./watchtower/endpointChecker.js");
var fs              = require("fs");
var infiniteLoop    = require("infinite-loop");

function Watchtower(config_path) {
  check_config_exists(config_path);
  this.config = new configParser(config_path).parse();
};

Watchtower.prototype.start = function() {
  if (this.config.loop) {
    start_loop(this.config.endpoints, this.config.interval);
  } else {
    verify_endpoints(this.config.endpoints);
  }
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

var output_result = function(r) {
  var e   = r.endpoint;
  var msg = " - " + render_status(r.status) + " " + e.url + " (" + r.time + "ms)";
  console.log(msg);
};

var output_results = function(results) {
  _.each(group_results(results), function(val, key) {
    console.log(clc.blue(key));
    _.each(val, function(result) {
      output_result(result);
    });
  });
  console.log("");
};

var render_status = function(s) {
  if (s == 200) {
    return clc.green(s);
  } else {
    return clc.red(s);
  }
};

var start_loop = function(endpoints, interval) {
  var il = new infiniteLoop;
  il.add(verify_endpoints, endpoints);
  il.setInterval(interval);
  il.run();
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

module.exports = Watchtower;

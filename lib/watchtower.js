var _               = require("underscore");
var clc             = require("cli-color");
var configParser    = require("./watchtower/configParser.js");
var endpointChecker = require("./watchtower/endpointChecker.js");
var fs              = require("fs");
var infiniteLoop    = require("infinite-loop");
var log             = require("./watchtower/logger.js");
var slack           = require("./watchtower/slack.js");

function Watchtower(config_path) {
  check_config_exists(config_path);
  this.config = new configParser(config_path).parse();
};

Watchtower.prototype.start = function() {
  startup_log(this.config);
  if (this.config.loop.enabled) {
    start_loop(this.config.endpoints, this.config.loop.interval);
  } else {
    verify_endpoints(this.config.endpoints, this.config.slack);
  }
};

var check_config_exists = function(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    log.error("Config YAML not found.");
    process.exit(1);
  }
};

var group_results = function(results) {
  return _.groupBy(results, function(r) { return r.site; });
};

var output_result = function(r) {
  var e   = r.endpoint;
  var msg = "  => " + render_status(r.status) + " " + e.url + " (" + r.time + "ms)";
  log.info(msg);
};

var output_to_log = function(results) {
  log.info("Results:")
  _.each(group_results(results), function(val, key) {
    log.info(clc.blue(" " + key));
    _.each(val, function(result) {
      output_result(result);
    });
  });
};

var output_to_slack = function(results, webhook_url) {
  new slack(results, webhook_url).send();
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

var startup_log = function(config) {
  log.info("Starting Watchtower");
  log.info("Loop mode  => " + config.loop.enabled);
  log.info("Slack mode => " + config.slack.enabled);
};

var sort_by_site = function(results) {
  return _.sortBy(results, "site");
};

var verify_endpoints = function(endpoints, slack_config) {
  var checker = new endpointChecker();
  checker.validate(endpoints, function(results) {
    output_to_log(results);
    if (slack_config.enabled) {
      output_to_slack(results, slack_config.webhook_url);
    }
  });
};

module.exports = Watchtower;

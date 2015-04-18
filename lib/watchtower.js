var _               = require("underscore");
var clc             = require("cli-color");
var configParser    = require("./watchtower/configParser.js");
var endpointChecker = require("./watchtower/endpointChecker.js");
var log             = require("./watchtower/logger.js");
var sender          = require("./watchtower/slack/sender.js");

function Watchtower(config_path) {
  this.config = new configParser(config_path).parse();
};

Watchtower.prototype.start = function() {
  startup_log(this.config);
  verify_endpoints(this.config);
};

var group_results = function(results) {
  return _.groupBy(results, function(r) { return r.site; });
};

var output_result = function(r) {
  var e   = r.endpoint;
  var msg = "   => " + render_status(r.status) + " " + e.url + " (" + r.time + "ms)";
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

var output_to_slack = function(results, webhook_url, channel) {
  new sender(results, webhook_url, channel).send();
};

var render_status = function(s) {
  if (s == 200) {
    return clc.green(s);
  } else {
    return clc.red(s);
  }
};

var startup_log = function(config) {
  log.info("Starting Watchtower");
  log.info("Slack mode => " + config.slack.enabled);
};

var sort_by_site = function(results) {
  return _.sortBy(results, "site");
};

var verify_endpoints = function(config) {
  var checker = new endpointChecker(config.max_concurrent);
  checker.validate(config.endpoints, function(results) {
    output_to_log(results);
    if (config.slack.enabled) {
      output_to_slack(results, config.slack.webhook_url, config.slack.channel);
    }
  });
};

module.exports = Watchtower;

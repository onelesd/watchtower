var _               = require("lodash");
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

function group_results (results) {
  return _.groupBy(results, function(r) { return r.site; });
};

function output_result (r) {
  var e   = r.endpoint;
  var msg = "   => " + render_status(r.status) + " " + e.url + " (" + r.time + "ms)";
  log.info(msg);
};

function output_to_log (results) {
  log.info("Results:")
  _.each(group_results(results), function(val, key) {
    log.info(clc.blue(" " + key));
    _.each(val, function(result) {
      output_result(result);
    });
  });
};

function output_to_slack (results, webhook_url, channel) {
  new sender(results, webhook_url, channel).send();
};

function render_status (s) {
  if (s == 200) {
    return clc.green(s);
  } else {
    return clc.red(s);
  }
};

function startup_log (config) {
  log.info("Starting Watchtower");
  log.info("Slack mode => " + config.slack.enabled);
};

function sort_by_site (results) {
  return _.sortBy(results, "site");
};

function verify_endpoints (config) {
  var checker = new endpointChecker(config.max_concurrent);
  checker.validate(config.endpoints, function(results) {
    output_to_log(results);
    if (config.slack.enabled) {
      output_to_slack(results, config.slack.webhook_url, config.slack.channel);
    }
  });
};

module.exports = Watchtower;

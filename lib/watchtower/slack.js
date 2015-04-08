var _      = require("underscore");
var log    = require("./logger.js");
var slackr = require("node-slackr");

function Slack(results, webhook_url) {
  this.results = results;
  this.slackr  = new slackr(webhook_url, {
    channel: "#general",
    username: "Watchtower",
  });
};

Slack.prototype.send = function() {
  this.slackr.notify(message(this.results), function(error, result) {
    log_response(error);
  });
};

var log_response = function(error) {
  if (error) {
    log.error("Unable to post to Slack.");
    log.error(err);
  } else {
    log.info("Posted to Slack successfully.");
  }
};

var message = function(results) {
  return num_of_failures(results) + "/" + results.length + " endpoints failed.";
};

var num_of_failures = function(results) {
  var success = _.groupBy(results, function(r) { return r.status; })["200"];
  return results.length - success.length;
};

module.exports = Slack;

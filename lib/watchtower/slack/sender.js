var _      = require("lodash");
var log    = require("../logger.js");
var msg    = require("./message.js");
var slackr = require("node-slackr");

function Sender(results, webhook_url, channel) {
  this.message = new msg(results).payload();
  this.results = results;
  this.slackr  = new slackr(webhook_url, {
    channel: channel,
    username: "Watchtower",
    icon_url: "http://i.imgur.com/9RWM0ds.png"
  });
};

Sender.prototype.send = function() {
  if (failures(this.results).length == 0) {
    log.info("No failures, not posting to Slack.");
  } else {
    this.slackr.notify(this.message, function(error, result) {
      log_response(error);
    });
  }
};

var failures = function(results) {
  return _.reject(results, function(r) { return r.status == 200; });
};

var log_response = function(error) {
  if (error) {
    log.error("Unable to post to Slack.");
    log.error(err);
  } else {
    log.info("Posted to Slack successfully.");
  }
};

module.exports = Sender;

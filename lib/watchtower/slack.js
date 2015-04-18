var _      = require("underscore");
var log    = require("./logger.js");
var slackr = require("node-slackr");

function Slack(results, webhook_url, channel) {
  this.results = results;
  this.slackr  = new slackr(webhook_url, {
    channel: channel,
    username: "Watchtower",
    icon_url: "http://i.imgur.com/9RWM0ds.png"
  });
};

Slack.prototype.send = function() {
  if (failures(this.results).length == 0) {
    log.info("No failures, not posting to Slack.");
  } else {
    this.slackr.notify(message(this.results), function(error, result) {
      log_response(error);
    });
  }
};

var attachments = function(results) {
  return _.map(failures(results), function(r) {
    return r.status + " - " + r.endpoint.url;
  }).join("\n");
};

var failures = function(results) {
  return _.reject(results, function(r) { return r.status == 200; });
};

var failure_message = function(results) {
  return "*" + failures(results).length + "* of *" + results.length + "* endpoints failed.";
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
  return {
    text: failure_message(results) + " " + total_message(results),
    attachments: [
      {
        fallback: "List of failed endpoints",
        color: "danger",
        text: attachments(results)
      }
    ]
  };
};

var sites = function(results) {
  sites = _.groupBy(results, function(r) { return r.site; });
  return _.keys(sites).length;
};

var total_message = function(results) {
  return "Checked *" + sites(results) + "* sites.";
};

module.exports = Slack;

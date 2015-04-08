var _    = require("underscore");
var fs   = require("fs");
var log  = require("./logger.js");
var yaml = require("js-yaml");

function ConfigParser(path) {
  this.path = path;
};

ConfigParser.prototype.parse = function() {
  try {
    var parsed = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));
    return to_hash(parsed);
  } catch (e) {
    log.error("Failed to parse config.")
    log.error(e);
  }
};

var add_interval = function(hash, parsed) {
  if (hash.loop.enabled) {
    hash.loop.interval = parsed.interval;
  }
  return hash;
};

var add_slack_webhook_url = function(hash, parsed) {
  if (hash.slack.enabled) {
    hash.slack.webhook_url = parsed.slack_webhook_url;
  }
  return hash;
};

var base_hash = function(parsed) {
  return {
    endpoints: merged_sites(parsed.sites),
    loop: {
      enabled: key_exist(parsed, "interval")
    },
    slack: {
      enabled: key_exist(parsed, "slack_webhook_url")
    }
  };
};

var key_exist = function(hash, key) {
  return _.has(hash, key);
};

var merged_sites = function(sites) {
  var merged = [];
  _.each(sites, function(site) {
    _.each(site.endpoints, function(endpoint) {
      merged.push(merged_endpoint(site, endpoint));
    });
  });
  return merged;
};

var merged_endpoint = function(site, endpoint) {
  return {
    site: site.name,
    url: (site.base + endpoint.path)
  }
};

var to_hash = function(parsed) {
  var hash = base_hash(parsed);
  hash = add_interval(hash, parsed);
  return add_slack_webhook_url(hash, parsed);
};

module.exports = ConfigParser;
